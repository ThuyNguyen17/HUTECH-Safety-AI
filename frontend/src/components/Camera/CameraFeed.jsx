// src/components/Camera/CameraFeed.jsx
import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

const CameraFeed = ({ cameraId }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date());

  // Simulate live timestamp updates
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimestamp(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Video Container */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden">
        {/* Mock Video Feed */}
        <div className="aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-medium">Đang phát video mẫu từ Camera {cameraId}</p>
              <p className="text-gray-400 text-sm mt-2">
                Đây là video demo cho hệ thống HUTECH
              </p>
            </div>
          </div>
          
          {/* Simulated video overlay */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
            LIVE
          </div>
          
          {/* AI Analysis Overlay */}
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-lg flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              AI ĐANG PHÂN TÍCH
            </div>
          </div>
          
          {/* Risk Indicator */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="font-bold">NGUY CƠ CAO: 85%</span>
              </div>
              <p className="text-sm opacity-90">Phát hiện hành vi bất thường</p>
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
            {timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 p-4 bg-gray-800 rounded-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          
          <div className="text-white">
            <p className="text-sm">Trạng thái: {isPlaying ? 'Đang phát' : 'Tạm dừng'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Record snapshot')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Chụp ảnh
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Analysis Results */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-2">Phân tích AI</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Đã nhận diện: 3 người
            </li>
            <li className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Tư thế bất thường: Có
            </li>
            <li className="flex items-center text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Thời gian đứng yên: 15 phút
            </li>
          </ul>
        </div>
        
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <h4 className="font-bold text-gray-900 mb-2">Cảnh báo</h4>
          <ul className="space-y-2">
            <li className="text-sm">📍 Vị trí: Khu vực cầu thang</li>
            <li className="text-sm">⏱️ Thời gian: {timestamp.toLocaleTimeString()}</li>
            <li className="text-sm">🔔 Mức độ: Khẩn cấp</li>
            <li className="text-sm">📞 Đã thông báo: An ninh & Tư vấn</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;