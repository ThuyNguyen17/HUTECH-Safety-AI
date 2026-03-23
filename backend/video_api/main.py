import cv2, numpy as np, base64, os, torch, json, asyncio
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from datetime import datetime
from collections import deque
import torch.nn as nn

# --- CUSTOM MODULES ---
try:
    from spatial_logic import SpatialLogicProcessor
except ImportError:
    SpatialLogicProcessor = None

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
YOLO_WEIGHTS = os.path.join(BASE_DIR, "weights", "best.pt")
SEG_CHECKPOINT = os.path.join(BASE_DIR, "weights", "checkpoint0039.pth")
LSTM_WEIGHTS = os.path.join(BASE_DIR, "weights", "best_lstm_suicide_detector.pth")

SEQ_LEN = 32
MAX_KEYPOINTS = 5
TARGET_SEG_SIZE = (16,16)
# Keep original input size to match pretrained weights
INPUT_SIZE = 4 + (MAX_KEYPOINTS*3) + (TARGET_SEG_SIZE[0]*TARGET_SEG_SIZE[1])
HIDDEN_SIZE = 128
NUM_LAYERS = 2
NUM_CLASSES = 2
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

DANGER_OUTPUT_DIR = r"backend/output_danger"
os.makedirs(DANGER_OUTPUT_DIR, exist_ok=True)

# --- MODELS ---
class SuicideDetectionLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes, dropout_rate=0.5):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout_rate if num_layers>1 else 0)
        self.fc = nn.Linear(hidden_size, num_classes)
        
    def forward(self, x):
        lstm_out, (h_n, c_n) = self.lstm(x)
        return self.fc(h_n[-1])

# Global instances
yolo_model = YOLO(YOLO_WEIGHTS)
seg_model = None
try:
    from rfdetr import RFDETRSegPreview
    seg_model = RFDETRSegPreview(pretrain_weights=SEG_CHECKPOINT)
    seg_model.optimize_for_inference()
except Exception as e:
    print(f"⚠️ RFDETRSegPreview not loaded: {e}")

lstm_model = SuicideDetectionLSTM(INPUT_SIZE, HIDDEN_SIZE, NUM_LAYERS, NUM_CLASSES).to(DEVICE)
try:
    lstm_model.load_state_dict(torch.load(LSTM_WEIGHTS, map_location=DEVICE))
    lstm_model.eval()
except Exception as e:
    print(f"⚠️ LSTM Model load failed: {e}")

# --- FASTAPI APP ---
app = FastAPI(title="HUTECH Safety AI - Video API")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

# --- HELPERS ---
def run_yolo(frame):
    result = yolo_model(frame)[0]
    boxes, keypoints = [], []
    if result.boxes is not None:
        for box in result.boxes.xyxy.cpu().numpy():
            boxes.append(box.astype(int).tolist())
    if hasattr(result, "keypoints") and result.keypoints is not None:
        for kp in result.keypoints.xyc.cpu().numpy() if hasattr(result.keypoints, "xyc") else result.keypoints.xy.cpu().numpy():
            # Standardize to [x, y, conf]
            if kp.shape[1] == 2:
                kp = np.concatenate([kp, np.ones((kp.shape[0], 1))], axis=1)
            keypoints.append(kp.astype(float).tolist())
    return boxes, keypoints

def normalize_yolo_output(bbox, keypoints, fw, fh):
    x1, y1, x2, y2 = bbox
    cx, cy = (x1+x2)/2/fw, (y1+y2)/2/fh
    w, h = (x2-x1)/fw, (y2-y1)/fh
    
    kpts_norm = []
    for i in range(MAX_KEYPOINTS):
        if i < len(keypoints):
            kp = keypoints[i]
            # Ensure it has [x, y, conf]
            if len(kp) < 3: kp = kp + [1.0]
            kpts_norm.extend([kp[0]/fw, kp[1]/fh, kp[2]])
        else:
            kpts_norm.extend([0.0, 0.0, 0.0])
            
    return np.array([cx, cy, w, h] + kpts_norm, dtype=np.float32)

def normalize_segmentation_output(detections, img_shape):
    h, w, _ = img_shape
    mask_combined = np.zeros((h, w), dtype=np.float32)
    if detections is None or not hasattr(detections, "mask"):
        return np.zeros(TARGET_SEG_SIZE).flatten()
    for mask in detections.mask:
        mask_combined = np.maximum(mask_combined, mask.astype(np.float32))
    return cv2.resize(mask_combined, TARGET_SEG_SIZE, interpolation=cv2.INTER_LINEAR).flatten()

def encode_frame(frame):
    _, buffer = cv2.imencode(".jpg", frame)
    return base64.b64encode(buffer).decode()

def draw_visual(frame, bbox, keypoints, alert, velocity=0.0):
    color = (0, 0, 255) if alert else (0, 255, 0)
    # Draw BBox
    for box in bbox:
        cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), color, 2)
    # Draw Keypoints
    for person in keypoints:
        for kp in person:
            cv2.circle(frame, (int(kp[0]), int(kp[1])), 4, (255, 0, 0), -1)
    # Draw Overlay Info
    cv2.putText(frame, f"VELOCITY: {velocity:.4f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    return frame

# --- ENDPOINTS ---
@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    tmp_path = "temp_video.mp4"
    with open(tmp_path, "wb") as f:
        f.write(await file.read())
    return {"path": tmp_path}

@app.websocket("/ws/process-video")
async def ws_process_video(ws: WebSocket):
    await ws.accept()
    spatial_processor = SpatialLogicProcessor(history_size=SEQ_LEN) if SpatialLogicProcessor else None
    
    try:
        tmp_path = "temp_video.mp4"
        if not os.path.exists(tmp_path):
            await ws.send_json({"error": "Video not uploaded yet"})
            return

        cap = cv2.VideoCapture(tmp_path)
        feature_buffer = deque(maxlen=SEQ_LEN)
        
        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break

            h, w = frame.shape[:2]
            bbox_list, keypoints_list = run_yolo(frame)
            
            # 1. Spatial Logic (Velocity & Zone)
            velocity = 0.0
            zone_status = 0.0
            if keypoints_list and spatial_processor:
                # Use first person detected
                kpts = np.array(keypoints_list[0])
                bbox_norm = [0.5, 0.5, 0.1, 0.1]
                if bbox_list:
                    bx1, by1, bx2, by2 = bbox_list[0]
                    bbox_norm = [(bx1+bx2)/2/w, (by1+by2)/2/h, (bx2-bx1)/w, (by2-by1)/h]
                
                velocity, zone_status = spatial_processor.process_features(np.array(bbox_norm), kpts)

            # 2. Normalize and Combine
            # Default mapping if none detected
            primary_kpts = keypoints_list[0] if keypoints_list else [[w/2, h/2, 1.0]] + [[0,0,0]]*(MAX_KEYPOINTS-1)
            primary_bbox = bbox_list[0] if bbox_list else [0, 0, w, h]
            
            bbox_kpts_norm = normalize_yolo_output(primary_bbox, primary_kpts, w, h)
            
            if seg_model:
                seg_features = normalize_segmentation_output(seg_model.predict(frame), frame.shape)
            else:
                seg_features = np.zeros(TARGET_SEG_SIZE[0]*TARGET_SEG_SIZE[1], dtype=np.float32)

            features = np.concatenate([bbox_kpts_norm, seg_features])
            feature_buffer.append(features)

            # 3. Model Inference
            suicide_prob = 0.0
            alert = False
            pred_text = "NORMAL"
            
            if len(feature_buffer) == SEQ_LEN:
                seq = torch.from_numpy(np.stack(feature_buffer)).float().unsqueeze(0).to(DEVICE)
                with torch.no_grad():
                    out = lstm_model(seq)
                    probs = torch.softmax(out, dim=1)
                    suicide_prob = probs[0, 1].item()
                    
                    if suicide_prob > 0.85:
                        pred_text = f"🚨 SUICIDE DETECTED ({suicide_prob:.2f})"
                        alert = True
                    elif suicide_prob > 0.5:
                        pred_text = f"⚠️ HIGH RISK ({suicide_prob:.2f})"
                        alert = True
                    else:
                        pred_text = f"✅ NORMAL ({suicide_prob:.2f})"

            # 4. Response
            visual_frame = draw_visual(frame.copy(), bbox_list, keypoints_list, alert, velocity)
            await ws.send_json({
                "frame_idx": frame_idx,
                "image": encode_frame(visual_frame),
                "prediction": pred_text,
                "alert": alert,
                "velocity": float(velocity),
                "zone_status": float(zone_status),
                "timestamp": frame_idx / 30.0
            })
            
            frame_idx += 1
            await asyncio.sleep(0.01) # Faster processing

        cap.release()
        await ws.send_json({"done": True})

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await ws.send_json({"error": str(e)})

