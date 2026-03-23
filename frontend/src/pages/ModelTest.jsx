import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  PlayCircle, 
  PauseCircle, 
  AlertTriangle, 
  CheckCircle, 
  Upload, 
  Video, 
  Download,
  Shield,
  Activity,
  FileVideo,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Clock,
  Zap,
  AlertCircle,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Info,
  BarChart,
  Filter
} from "lucide-react";

/*
  Cải tiến UI & chuyển toàn bộ nhãn sang tiếng Việt.
  Những thay đổi chính:
  - Toàn bộ text (title, nút, mô tả, cảnh báo, tooltip, thông báo alert) được dịch sang tiếng Việt.
  - Gọn gàng hóa spacing, shadow, border để giao diện dịu mắt hơn.
  - Giữ nguyên toàn bộ logic và hành vi (upload, websocket, modal, zoom...).
  - Thêm vài cải tiến nhỏ về UX (ví dụ: tên file download, thông báo upload/analyze bằng tiếng Việt).
*/

const Card = ({ children, title, className = "", icon: Icon, headerClassName = "" }) => (
  <div className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
    <div className={`px-6 pt-5 pb-3 ${headerClassName}`}>
      <div className="flex items-center">
        {Icon && <Icon className="w-5 h-5 mr-3 text-indigo-600" />}
        {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
      </div>
    </div>
    <div className="px-6 pb-6">
      {children}
    </div>
  </div>
);

const DangerFrameThumbnail = ({ frame, index, timestamp, probability, onClick, isActive }) => (
  <div 
    className={`relative group cursor-pointer transform transition-all hover:scale-[1.03] ${isActive ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
    onClick={onClick}
    title={`Khung cảnh báo #${index} — ${probability}%`}
  >
    <div className="relative overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-gray-900">
      <img 
        src={frame} 
        alt={`Khung nguy hiểm ${index}`}
        className="w-full h-28 object-cover transform group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231f2937"/><text x="50" y="50" font-family="Arial" font-size="12" fill="%239ca3af" text-anchor="middle" dy=".3em">Khung '+index+'</text></svg>';
        }}
      />
      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
        <AlertTriangle className="w-3 h-3 mr-1" />
        #{index}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="text-white">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{timestamp}s</span>
            </div>
            <span className="font-bold text-red-300">{probability}%</span>
          </div>
          <div className="mt-1 w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-red-500 h-1 rounded-full" 
              style={{ width: `${Math.min(probability, 100)}%` }}
            />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <ZoomIn className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress, label, color = "blue" }) => {
  const colors = {
    blue: "bg-indigo-500",
    green: "bg-emerald-500",
    red: "bg-red-500",
    yellow: "bg-yellow-400"
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colors[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const DangerFrameModal = ({ 
  isOpen, 
  onClose, 
  frame, 
  index, 
  totalFrames,
  timestamp, 
  probability,
  prediction,
  frameIdx,
  onNext,
  onPrev
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === '+') setZoomLevel(prev => Math.min(prev + 0.1, 3));
      if (e.key === '-') setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  if (!isOpen) return null;

  const isHighRisk = parseFloat(probability) > 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div 
        ref={modalRef}
        className="relative bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="font-bold">KHUNG NGUY HIỂM #{index}</span>
              </div>
              <div className="flex items-center text-white">
                <span className="text-sm">{frameIdx} • {timestamp}s • {probability}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrev}
              disabled={index === 1}
              className={`p-2 rounded-lg transition-colors ${index === 1 ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-700"}`}
              aria-label="Khung trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white text-sm">{index} / {totalFrames}</span>
            <button
              onClick={onNext}
              disabled={index === totalFrames}
              className={`p-2 rounded-lg transition-colors ${index === totalFrames ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-700"}`}
              aria-label="Khung sau"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-black">
            <div 
              className="relative"
              style={{ width: '100%', height: '100%', cursor: zoomLevel > 1 ? 'grab' : 'default' }}
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  if (e.deltaY < 0) setZoomLevel(prev => Math.min(prev + 0.1, 3));
                  else setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
                }
              }}
            >
              <img 
                src={frame} 
                alt={`Khung chi tiết ${index}`}
                className="transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231f2937"/><text x="400" y="300" font-family="Arial" font-size="24" fill="%239ca3af" text-anchor="middle" dy=".3em">Khung '+index+'</text></svg>';
                }}
              />
            </div>
          </div>

          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-700 bg-gray-800 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Phân tích khung</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Chỉ số khung</span>
                    <span className="text-white font-mono font-bold">{frameIdx}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Thời gian</span>
                    <span className="text-white font-bold">{timestamp} giây</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Độ tin cậy</span>
                    <div className="flex items-center">
                      <span className={`text-xl font-bold ${isHighRisk ? 'text-red-400' : 'text-yellow-300'}`}>{probability}%</span>
                      <div className="ml-2 w-24 bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${probability}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Đánh giá rủi ro</h3>
                <div className={`p-4 rounded-xl ${isHighRisk ? 'bg-red-900/30 border border-red-700' : 'bg-yellow-900/30 border border-yellow-700'}`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`w-6 h-6 mr-3 flex-shrink-0 mt-1 ${isHighRisk ? 'text-red-400' : 'text-yellow-400'}`} />
                    <div>
                      <p className={`text-xl font-bold ${isHighRisk ? 'text-red-300' : 'text-yellow-300'}`}>{prediction || 'Hành vi rủi ro'}</p>
                      <p className="text-sm text-gray-300 mt-2">
                        {isHighRisk ? 'Xác suất cao có hành vi tự hại — cần can thiệp ngay lập tức.' : 'Phát hiện khả năng rủi ro — cần theo dõi.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Chi tiết AI</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Mức rủi ro</p>
                    <p className={`text-lg font-bold ${isHighRisk ? 'text-red-400' : 'text-yellow-400'}`}>{isHighRisk ? 'CAO' : 'TRUNG BÌNH'}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Mô hình</p>
                    <p className="text-lg font-bold text-blue-400">YOLO + LSTM</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Chất lượng khung</p>
                    <p className="text-lg font-bold text-green-400">~98%</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Thời gian xử lý</p>
                    <p className="text-lg font-bold text-purple-400">~42ms</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Hành động</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = frame;
                      link.download = `khung_nguy_hiem_${frameIdx}_${probability}pc.jpg`;
                      link.click();
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Tải khung
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`
Khung #${index}
Thời gian: ${timestamp}s
Độ tin cậy: ${probability}%
Dự đoán: ${prediction || 'N/A'}
Mức rủi ro: ${isHighRisk ? 'CAO' : 'TRUNG BÌNH'}
                      `).then(() => alert('Đã sao chép vào bộ nhớ tạm!'));
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Info className="w-5 h-5 mr-2" />
                    Sao chép báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className={`p-2 rounded-lg ${zoomLevel <= 0.5 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className={`p-2 rounded-lg ${zoomLevel >= 3 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                aria-label="Phóng to"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-400">Dùng bánh xe chuột (Ctrl + Scroll) để zoom • ← → để chuyển khung</div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Toàn màn hình"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DangerFrameFilter = ({ filter, setFilter }) => {
  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'high', label: 'Rủi ro cao (>85%)' },
    { id: 'medium', label: 'Trung bình (70-85%)' }
  ];

  return (
    <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <Filter className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 mr-2">Bộ lọc:</span>
      <div className="flex space-x-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === f.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function SuicidePreventionDashboard() {
  // State và refs giữ nguyên
  const [file, setFile] = useState(null);
  const [visual, setVisual] = useState(null);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [dangerFrames, setDangerFrames] = useState([]);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [analysisStats, setAnalysisStats] = useState({
    totalFrames: 0,
    processedFrames: 0,
    startTime: null,
    elapsedTime: 0
  });
  const [activeDangerFrame, setActiveDangerFrame] = useState(null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [chartData, setChartData] = useState([]);
  const [realtimeStats, setRealtimeStats] = useState({
    velocity: 0,
    zone_status: 0
  });

  const wsRef = useRef(null);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const filteredDangerFrames = dangerFrames.filter(frame => {
    const prob = parseFloat(frame.probability);
    if (filter === 'high') return prob > 85;
    if (filter === 'medium') return prob >= 70 && prob <= 85;
    return true;
  });

  useEffect(() => {
    if (isAnalyzing && !isPaused) {
      progressIntervalRef.current = setInterval(() => {
        setAnalysisStats(prev => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
      }, 1000);
    } else {
      clearInterval(progressIntervalRef.current);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [isAnalyzing, isPaused]);

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file video trước!");
      return;
    }

    setProcessing(true);
    setResult(null);
    setVisual(null);
    setDangerFrames([]);
    setActiveDangerFrame(null);
    setSelectedFrameIndex(null);
    setAnalysisStats({
      totalFrames: 0,
      processedFrames: 0,
      startTime: null,
      elapsedTime: 0
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (file.type.startsWith("video/")) {
        const videoURL = URL.createObjectURL(file);
        setUploadedVideo(videoURL);
      }

      setAnalysisStats(prev => ({ ...prev, totalFrames: res.data.total_frames || 0 }));

      alert("Tải lên thành công! Nhấn 'Bắt đầu phân tích' để chạy.");
    } catch (err) {
      console.error("Lỗi upload:", err);
      alert("Tải lên thất bại. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRunAnalyst = () => {
    if (!file) {
      alert("Vui lòng tải lên video trước!");
      return;
    }

    setIsAnalyzing(true);
    setIsPaused(false);
    setDangerFrames([]);
    setActiveDangerFrame(null);
    setSelectedFrameIndex(null);
    setAnalysisStats(prev => ({ ...prev, startTime: Date.now(), elapsedTime: 0, processedFrames: 0 }));

    wsRef.current = new WebSocket("ws://localhost:8000/ws/process-video");
    
    wsRef.current.onopen = () => console.log("WebSocket kết nối");
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.done) {
        setIsAnalyzing(false);
        alert("Phân tích hoàn tất!");
        return;
      }

      if (data.image) {
        const probVal = data.prediction.match(/\((\d+\.\d+)\)/)?.[1] || "0.00";
        const probPercent = parseFloat(probVal) * 100;

        const frameData = {
          image: `data:image/jpeg;base64,${data.image}`,
          prediction: data.prediction,
          alert: data.alert,
          frameIdx: data.frame_idx,
          timestamp: (data.frame_idx / 30).toFixed(2),
          velocity: data.velocity || 0,
          zone_status: data.zone_status || 0
        };

        setVisual(frameData.image);
        setResult({ prediction: data.prediction, alert: data.alert, frameIdx: data.frame_idx });
        setCurrentFrame(data.frame_idx);
        setAnalysisStats(prev => ({ ...prev, processedFrames: data.frame_idx }));
        setRealtimeStats({
          velocity: data.velocity || 0,
          zone_status: data.zone_status || 0
        });

        // Update chart data (keep last 50 points)
        setChartData(prev => {
          const newData = [...prev, { time: data.frame_idx, risk: probPercent }];
          if (newData.length > 50) return newData.slice(newData.length - 50);
          return newData;
        });

        if (data.alert) {
          const newFrame = {
            ...frameData,
            probability: probPercent.toFixed(1),
            id: Date.now() + Math.random()
          };
          
          setDangerFrames(prev => {
            const updated = [newFrame, ...prev];
            if (updated.length > 0) setActiveDangerFrame(updated[0].id);
            return updated;
          });
        }
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket đóng");
      setIsAnalyzing(false);
    };

    wsRef.current.onerror = (error) => {
      console.error("Lỗi WebSocket:", error);
      setIsAnalyzing(false);
      alert("Lỗi kết nối WebSocket. Vui lòng kiểm tra server.");
    };
  };

  const handleFrameSelect = (frame, index) => {
    setSelectedFrameIndex(index);
  };

  const handleNextFrame = () => {
    if (selectedFrameIndex < filteredDangerFrames.length - 1) setSelectedFrameIndex(selectedFrameIndex + 1);
  };

  const handlePrevFrame = () => {
    if (selectedFrameIndex > 0) setSelectedFrameIndex(selectedFrameIndex - 1);
  };

  const handleReset = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    
    setFile(null);
    setVisual(null);
    setResult(null);
    setProcessing(false);
    setIsAnalyzing(false);
    setIsPaused(false);
    setCurrentFrame(0);
    setDangerFrames([]);
    setUploadedVideo(null);
    setActiveDangerFrame(null);
    setSelectedFrameIndex(null);
    setAnalysisStats({ totalFrames: 0, processedFrames: 0, startTime: null, elapsedTime: 0 });
    setChartData([]);
    setRealtimeStats({ velocity: 0, zone_status: 0 });
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handlePauseResume = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsPaused(!isPaused);
      if (!isPaused) wsRef.current.send(JSON.stringify({ action: "pause" }));
      else wsRef.current.send(JSON.stringify({ action: "resume" }));
    }
  };

  const handleDownloadFrame = () => {
    if (visual) {
      const link = document.createElement('a');
      link.href = visual;
      link.download = `khung_${currentFrame}_${new Date().toISOString().slice(0,10)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(progressIntervalRef.current);
    };
  }, []);

  const progressPercentage = analysisStats.totalFrames > 0 
    ? Math.min((analysisStats.processedFrames / analysisStats.totalFrames) * 100, 100)
    : 0;

  const selectedFrame = selectedFrameIndex !== null ? filteredDangerFrames[selectedFrameIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-3 rounded-2xl mr-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hệ thống AI Phòng ngừa Tự tử</h1>
                <p className="text-gray-600 text-sm mt-1">Giám sát thời gian thực — YOLO + LSTM + Segmentation</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Đặt lại
              </button>
            </div>
          </div>
          
          {(processing || isAnalyzing) && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {processing ? (
                    <>
                      <Upload className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="font-medium text-gray-700">Đang tải lên...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                      <span className="font-medium text-gray-700">Đang phân tích...</span>
                    </>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600">{isAnalyzing ? `${analysisStats.processedFrames} khung đã xử lý` : ''}</span>
              </div>
              <ProgressBar 
                progress={processing ? 100 : progressPercentage} 
                label={processing ? "Tiến trình tải lên" : "Tiến trình phân tích"}
                color={processing ? "blue" : "green"}
              />
              {isAnalyzing && (
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Đã chạy: {analysisStats.elapsedTime}s</span>
                  <span>Khung: {analysisStats.processedFrames}/{analysisStats.totalFrames || '??'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Tải lên video" icon={Upload} className="h-full">
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${file ? "border-emerald-400 bg-emerald-50/40" : "border-indigo-200 bg-indigo-50/50 hover:border-indigo-400"}`}
                  onClick={() => !file && document.getElementById('video-upload').click()}
                >
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer block">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${file ? "bg-emerald-100 border-2 border-emerald-300" : "bg-white border-2 border-indigo-200"}`}>
                      {file ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <Upload className="w-8 h-8 text-indigo-600" />}
                    </div>
                    <p className="text-gray-700 mb-2 font-medium">
                      {file ? <span className="text-emerald-600">Đã chọn file ✓</span> : <span className="text-indigo-600">Nhấn để tải lên</span>}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">{file ? file.name : "MP4, AVI, MOV (Tối đa 100MB)"}</p>
                    {file && (
                      <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                        <FileVideo className="w-4 h-4 mr-2 text-gray-600" />
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    )}
                  </label>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleUpload}
                    disabled={processing || !file}
                    className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${processing || !file ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"}`}
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Tải lên video
                      </>
                    )}
                  </button>

                  {uploadedVideo && (
                    <button
                      onClick={handleRunAnalyst}
                      disabled={isAnalyzing}
                      className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${isAnalyzing ? "bg-emerald-600 text-white shadow-md" : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md"}`}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Đang phân tích...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Bắt đầu phân tích
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </Card>

            <Card title="Xem trước video" icon={Video} className="lg:col-span-2">
              {uploadedVideo ? (
                <div className="space-y-4">
                  <div className="bg-black rounded-xl overflow-hidden shadow-lg">
                    <video ref={videoRef} src={uploadedVideo} controls className="w-full h-60 object-contain" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${isAnalyzing ? "bg-emerald-500 animate-pulse" : "bg-indigo-500"}`} />
                          <p className="text-sm font-medium">{isAnalyzing ? "Đang phân tích" : "Sẵn sàng"}</p>
                        </div>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        <p className="text-xs text-gray-500 mb-1">Khung hiện tại</p>
                        <p className="text-lg font-bold text-gray-800">{currentFrame}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-500 mb-1">Vận tốc (Velocity)</p>
                        <p className="text-lg font-bold text-blue-700">{realtimeStats.velocity.toFixed(4)}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <p className="text-xs text-gray-500 mb-1">Khu vực (Zone)</p>
                        <p className={`text-sm font-bold ${realtimeStats.zone_status > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {realtimeStats.zone_status > 0 ? "⚠️ NGUY HIỂM" : "✅ AN TOÀN"}
                        </p>
                      </div>
                    </div>
                  
                    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2 text-indigo-600" />
                        Biểu đồ Rủi ro Thời gian thực
                      </h3>
                      <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              labelClassName="text-gray-500 text-xs"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="risk" 
                              stroke="#6366f1" 
                              fillOpacity={1} 
                              fill="url(#colorRisk)" 
                              strokeWidth={2}
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Video className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium text-gray-500">Chưa có video</p>
                  <p className="text-sm text-gray-400 mt-1">Tải video để xem trước</p>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Phân tích thời gian thực" icon={Activity} className="lg:col-span-2">
              <div className="space-y-4">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden h-80">
                  {visual ? (
                    <>
                      <img src={visual} alt="Hình phân tích" className="w-full h-full object-contain" onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231f2937"/><text x="200" y="150" font-family="Arial" font-size="16" fill="%239ca3af" text-anchor="middle" dy=".3em">Khung phân tích</text></svg>';
                      }} />
                      <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Khung: {currentFrame}
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button onClick={handleDownloadFrame} className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors" title="Tải khung">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                      {isAnalyzing && (
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-600/90 to-orange-600/90 text-white px-3 py-1.5 rounded-full shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-sm font-medium">PHÂN TÍCH TRỰC TIẾP</span>
                            <Zap className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Activity className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-500">Chưa có hình phân tích</p>
                      <p className="text-sm text-gray-400 mt-1">Bắt đầu phân tích để xem kết quả</p>
                    </div>
                  )}
                </div>

                {isAnalyzing && (
                  <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Thời gian: <span className="font-bold">{(currentFrame / 30).toFixed(2)}s</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Tiến độ: <span className="font-bold">{progressPercentage.toFixed(1)}%</span></span>
                      </div>
                    </div>
                    <button onClick={handlePauseResume} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${isPaused ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"}`}>
                      {isPaused ? <><PlayCircle className="w-5 h-5" /><span>Tiếp tục</span></> : <><PauseCircle className="w-5 h-5" /><span>Tạm dừng</span></>}
                    </button>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Kết quả phát hiện" icon={AlertCircle}>
              <div className="space-y-4">
                {result ? (
                  <>
                    <div className={`p-4 rounded-xl border-2 ${result.alert ? (result.prediction.includes("SUICIDE") ? "border-red-300 bg-gradient-to-br from-red-50 to-red-100" : "border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100") : "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100"}`}>
                      <div className="flex items-start">
                        {result.alert ? (result.prediction.includes("SUICIDE") ? <AlertTriangle className="w-8 h-8 text-red-600 mr-3" /> : <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />) : <CheckCircle className="w-8 h-8 text-emerald-600 mr-3" />}
                        <div>
                          <p className={`text-lg font-bold ${result.alert ? (result.prediction.includes("SUICIDE") ? "text-red-800" : "text-yellow-800") : "text-emerald-800"}`}>{result.prediction}</p>
                          <p className={`text-sm mt-1 ${result.alert ? (result.prediction.includes("SUICIDE") ? "text-red-600" : "text-yellow-600") : "text-emerald-600"}`}>{result.alert ? (result.prediction.includes("SUICIDE") ? "Rủi ro cao được phát hiện" : "Phát hiện khả năng rủi ro") : "Không phát hiện rủi ro"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Số khung</p>
                        <p className="text-xl font-bold text-gray-800">{currentFrame}</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${result.alert ? (result.prediction.includes("SUICIDE") ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50") : "border-emerald-200 bg-emerald-50"}`}>
                        <p className="text-xs text-gray-500 mb-1">Mức rủi ro</p>
                        <p className={`text-xl font-bold ${result.alert ? (result.prediction.includes("SUICIDE") ? "text-red-600" : "text-yellow-600") : "text-emerald-600"}`}>{result.alert ? (result.prediction.includes("SUICIDE") ? "CAO" : "TRUNG BÌNH") : "THẤP"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Đang chờ phân tích</p>
                    <p className="text-sm text-gray-400 mt-1">Kết quả sẽ xuất hiện ở đây</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Thống kê</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Khung cảnh báo:</span>
                      <span className="font-semibold">{dangerFrames.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tốc độ xử lý:</span>
                      <span className="font-semibold text-green-600">30 fps</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Khung rủi ro cao:</span>
                      <span className="font-semibold text-red-600">{dangerFrames.filter(f => parseFloat(f.probability) > 85).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {dangerFrames.length > 0 && (
            <Card title="Các khung cảnh báo" icon={AlertTriangle}>
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <span className="text-sm font-medium text-gray-700 mr-3">Khung phát hiện</span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">{dangerFrames.length} cảnh báo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center px-3 py-1 bg-indigo-50 rounded-lg">
                        <BarChart className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="text-sm text-indigo-700">Cao: {dangerFrames.filter(f => parseFloat(f.probability) > 85).length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Hiển thị {filteredDangerFrames.length} / {dangerFrames.length}</div>
                </div>

                <DangerFrameFilter filter={filter} setFilter={setFilter} />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {filteredDangerFrames.map((frame, idx) => (
                    <DangerFrameThumbnail
                      key={frame.id}
                      frame={frame.image}
                      index={filteredDangerFrames.length - idx}
                      timestamp={frame.timestamp}
                      probability={frame.probability}
                      isActive={activeDangerFrame === frame.id}
                      onClick={() => {
                        setVisual(frame.image);
                        setResult({ prediction: frame.prediction, alert: true, frameIdx: frame.frameIdx });
                        setCurrentFrame(frame.frameIdx);
                        setActiveDangerFrame(frame.id);
                        handleFrameSelect(frame, idx);
                      }}
                    />
                  ))}
                </div>

                {filteredDangerFrames.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                    <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Không có khung phù hợp với bộ lọc</p>
                    <p className="text-sm text-gray-400 mt-1">Thử chọn bộ lọc khác</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Tổng cảnh báo</p>
                      <p className="text-2xl font-bold text-red-600">{dangerFrames.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Rủi ro cao</p>
                      <p className="text-2xl font-bold text-yellow-600">{dangerFrames.filter(f => parseFloat(f.probability) > 85).length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Trung bình độ tin cậy</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {dangerFrames.length > 0 ? (dangerFrames.reduce((s, f) => s + parseFloat(f.probability), 0) / dangerFrames.length).toFixed(1) + '%' : '0%'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Xem chi tiết</p>
                      <p className="text-sm font-medium text-green-600">Nhấn khung để xem</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card title="Tổng quan hệ thống" icon={BarChart3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Upload className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Trạng thái tải lên</p>
                    <p className={`text-sm font-semibold ${file ? "text-emerald-600" : "text-gray-500"}`}>{file ? "Sẵn sàng" : "Chưa có"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Trạng thái phân tích</p>
                    <p className={`text-sm font-semibold ${isAnalyzing ? "text-indigo-600" : result ? "text-emerald-600" : "text-gray-500"}`}>{isAnalyzing ? "Đang chạy" : result ? "Hoàn thành" : "Rảnh"}</p>
                  </div>
                </div>
                {isAnalyzing && <ProgressBar progress={progressPercentage} label="Tiến độ" color="green" />}
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phát hiện rủi ro</p>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-red-700 mr-2">{dangerFrames.length}</span>
                      <span className="text-sm text-red-600">khung</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tình trạng hệ thống</p>
                    <p className="text-sm font-semibold text-green-600">Tốt</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Độ trễ:</span>
                  <span className="font-semibold text-green-600">12ms</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 mb-3 md:mb-0">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  <span>AI Suicide Prevention v2.0 | Giám sát thời gian thực</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  {dangerFrames.length > 0 && (
                    <button
                      onClick={() => selectedFrameIndex !== null && handleFrameSelect(selectedFrameIndex)}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      Xem chi tiết ({filteredDangerFrames.length} khung)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DangerFrameModal
        isOpen={selectedFrameIndex !== null}
        onClose={() => setSelectedFrameIndex(null)}
        frame={selectedFrame?.image}
        index={selectedFrameIndex !== null ? filteredDangerFrames.length - selectedFrameIndex : 1}
        totalFrames={filteredDangerFrames.length}
        timestamp={selectedFrame?.timestamp}
        probability={selectedFrame?.probability}
        prediction={selectedFrame?.prediction}
        frameIdx={selectedFrame?.frameIdx}
        onNext={handleNextFrame}
        onPrev={handlePrevFrame}
      />
    </div>
  );
}