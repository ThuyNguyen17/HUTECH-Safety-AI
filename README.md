# 🛡️ HUTECH Safety AI - Hệ thống Giám sát & Phòng ngừa Tự tử bằng Trí tuệ Nhân tạo

Hệ thống AI giám sát thời gian thực giúp phát hiện sớm các hành vi rủi ro (tự tử) thông qua phân tích video. Dự án kết hợp các mô hình Deep Learning tiên tiến nhất hiện nay để đưa ra cảnh báo chính xác.

## 🚀 Quy trình Xử lý (Flowchart)
Hệ thống hoạt động theo trình tự chuyên sâu:
1.  **Input**: Camera / Video Frames.
2.  **Processing**: Kết hợp **YOLO-Pose** (lấy tọa độ khớp xương) và **RFDETR** (phân tích ngữ cảnh vùng ảnh).
3.  **Spatial Logic**: Tính toán **Vận tốc (Velocity)** và **Trạng thái vùng (Zone Status)** để xác định mức độ nguy hiểm.
4.  **Temporal Analysis**: Sử dụng **LSTM** (hoặc Transformer/GNN) để phân tích chuỗi hành vi theo thời gian (Sliding Window).
5.  **Output**: Cảnh báo rủi ro (Normal / Dangerous) cùng biểu đồ phân tích trực quan.

## 🛠️ Công nghệ Sử dụng
*   **Backend**: Python, FastAPI, Uvicorn.
*   **AI Models**: Ultralytics YOLOv8, PyTorch (LSTM), RFDETR Segmentation.
*   **Frontend**: React.js, TailwindCSS, Lucide Icons, Recharts (Visualizing risk).
*   **Communication**: WebSockets (Xử lý thời gian thực).

## 📁 Cấu trúc Thư mục
*   `/backend`: Chứa mã nguồn server FastAPI và logic xử lý AI.
*   `/frontend`: Dashboard React hiển thị kết quả và biểu đồ.

## 🏃 Cách Chạy Dự án

### 1. Cài đặt & Chạy Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
# Cài đặt thư viện cần thiết
pip install -r requirements.txt
# Khởi động server
cd video_api
python -m uvicorn main:app --reload --port 8000
```

### 2. Cài đặt & Chạy Frontend
```bash
cd frontend
npm install
npm start
```

## 📊 Dashboard Tính năng
*   Giao diện Dashboard hiện đại (Dark Mode hỗ trợ).
*   Biểu đồ rủi ro thời gian thực (Real-time Risk Area Chart).
*   Thống kê vận tốc di chuyển và cảnh báo vùng nguy hiểm.
*   Lưu trữ và xem lại các khung hình (frames) có dấu hiệu rủi ro cao.
<img width="1592" height="760" alt="image" src="https://github.com/user-attachments/assets/62a4fad3-5ab6-4040-8ce5-61a4a558f982" />
<img width="1592" height="733" alt="image" src="https://github.com/user-attachments/assets/7e0f05a3-0bc5-4442-b31d-543964d9314b" />

---
© 2024 HUTECH Safety AI Project
