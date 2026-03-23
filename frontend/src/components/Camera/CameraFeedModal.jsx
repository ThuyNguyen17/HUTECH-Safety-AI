// src/components/Camera/CameraFeedModal.jsx
import React, { useState, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CameraFeedModal = ({ camera, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimestamp(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <CameraIcon className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Live Camera Feed</h3>
              <p className="text-sm opacity-90">
                {camera?.name || 'Camera 1'} - {camera?.location || 'HUTECH Campus'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Video Feed */}
        <div className="flex-1 overflow-auto p-4">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
            {/* Mock Video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <PlayIcon className="w-8 h-8" />
                </div>
                <p className="text-xl font-semibold mb-2">Đang phát video mẫu</p>
                <p className="text-gray-300">Camera: {camera?.name || 'Demo Camera'}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Hệ thống HUTECH - Demo cho mục đích thử nghiệm
                </p>
              </div>
            </div>

            {/* Overlays */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </div>

            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                  <span className="font-bold">NGUY CƠ: 85%</span>
                </div>
                <p className="text-xs mt-1">Phát hiện hành vi bất thường</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>{timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-100 rounded-xl">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="w-4 h-4" />
                    <span>Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    <span>Tiếp tục</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => alert('Đã chụp ảnh!')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Chụp ảnh
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => console.log('Fullscreen')}
                className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <ArrowsPointingOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">Phân tích AI</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nhận diện người:</span>
                  <span className="font-medium">3 người</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tư thế bất thường:</span>
                  <span className="font-medium text-yellow-600">Có</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thời gian đứng yên:</span>
                  <span className="font-medium text-red-600">15 phút</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Độ tin cậy:</span>
                  <span className="font-medium text-green-600">92%</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <h4 className="font-bold text-gray-900 mb-3">Thông tin cảnh báo</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Khu vực: Cầu thang tòa nhà A</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Thời gian: {timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Mức độ: <span className="font-bold text-red-600">Khẩn cấp</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Đã thông báo: An ninh & Tư vấn viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeedModal;