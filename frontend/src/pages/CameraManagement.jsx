// src/pages/CameraManagement.jsx
import React, { useState } from 'react';
import { 
  VideoCameraIcon, 
  PlusIcon, 
  WifiIcon, 
  SignalIcon, 
  Cog6ToothIcon,
  EyeIcon,
  TrashIcon,
  PlayIcon,
  StopIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import StatCard from '../components/UI/StatCard';
import CameraFeedModal from '../components/Camera/CameraFeedModal';
import { mockCameras } from '../data/mockData';

const CameraManagement = () => {
  const [cameras, setCameras] = useState(mockCameras);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newCamera, setNewCamera] = useState({ 
    name: '', 
    location: '', 
    streamUrl: '', 
    type: 'ip', 
    resolution: '1080p',
    fps: 30,
    aiEnabled: true 
  });

  // Stats calculation
  const stats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'online').length,
    offline: cameras.filter(c => c.status === 'offline').length,
    warning: cameras.filter(c => c.status === 'warning').length,
    totalAlerts: cameras.reduce((sum, c) => sum + (c.alerts || 0), 0),
    recording: cameras.filter(c => c.isRecording).length,
    aiEnabled: cameras.filter(c => c.aiEnabled).length
  };

  // Filter cameras based on search and status
  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle camera actions
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    setIsLiveMode(true);
  };

  const handleToggleRecording = (cameraId, e) => {
    e.stopPropagation();
    setCameras(cameras.map(camera => 
      camera.id === cameraId 
        ? { ...camera, isRecording: !camera.isRecording }
        : camera
    ));
  };

  const handleTestConnection = (cameraId, e) => {
    e.stopPropagation();
    // Simulate connection test
    setCameras(cameras.map(camera => 
      camera.id === cameraId 
        ? { ...camera, status: 'online', lastActive: 'Just now' }
        : camera
    ));
    
    setTimeout(() => {
      alert(`Connection test successful for Camera ${cameraId}`);
    }, 500);
  };

  const handleDeleteCamera = (cameraId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this camera?')) {
      setCameras(cameras.filter(camera => camera.id !== cameraId));
    }
  };

  const handleAddCamera = () => {
    if (!newCamera.name || !newCamera.location) {
      alert('Please fill in required fields');
      return;
    }

    const newCameraData = {
      id: cameras.length + 1,
      ...newCamera,
      status: 'online',
      alerts: 0,
      lastActive: 'Just now',
      riskLevel: 0,
      hasAlert: false
    };

    setCameras([...cameras, newCameraData]);
    setNewCamera({ name: '', location: '', streamUrl: '', type: 'ip', resolution: '1080p', fps: 30, aiEnabled: true });
    setIsAdding(false);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'startAll':
        setCameras(cameras.map(c => ({ ...c, isRecording: true })));
        break;
      case 'stopAll':
        setCameras(cameras.map(c => ({ ...c, isRecording: false })));
        break;
      case 'testAll':
        // Simulate testing all cameras
        setCameras(cameras.map(c => ({ ...c, status: 'online', lastActive: 'Just now' })));
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Quản lý Camera HUTECH
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý, giám sát và cấu hình hệ thống camera an ninh
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {stats.online}/{stats.total} camera đang hoạt động
              </span>
              <span className="text-sm text-gray-500">
                Cập nhật lần cuối: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="border-blue-200 hover:bg-blue-50 flex items-center"
              onClick={() => handleBulkAction('testAll')}
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Kiểm tra tất cả
            </Button>
            <Button 
              variant="primary"
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Thêm camera
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng số camera"
          value={stats.total}
          change={`${stats.online} đang hoạt động`}
          icon={<VideoCameraIcon className="w-5 h-5" />}
          variant="primary"
          trend="neutral"
          description="12 camera được cấu hình"
        />
        <StatCard
          title="Trạng thái hệ thống"
          value={`${Math.round((stats.online / stats.total) * 100)}%`}
          change={`${stats.warning} cần kiểm tra`}
          icon={<SignalIcon className="w-5 h-5" />}
          variant={stats.online === stats.total ? "success" : "warning"}
          trend={stats.online === stats.total ? "up" : "down"}
          description="Hiệu suất hệ thống"
        />
        <StatCard
          title="Đang ghi hình"
          value={stats.recording}
          change={`${stats.total - stats.recording} không ghi`}
          icon={<PlayIcon className="w-5 h-5" />}
          variant="success"
          trend="up"
          description="Camera đang ghi"
        />
        <StatCard
          title="AI đang hoạt động"
          value={stats.aiEnabled}
          change="Tự động phân tích"
          icon={<Cog6ToothIcon className="w-5 h-5" />}
          variant="primary"
          trend="up"
          description="Phân tích hành vi"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm camera theo tên hoặc vị trí..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="online">Đang hoạt động</option>
                <option value="warning">Cần kiểm tra</option>
                <option value="offline">Ngắt kết nối</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={cameras.every(c => c.isRecording) ? "primary" : "outline"}
                size="sm"
                onClick={() => handleBulkAction(cameras.every(c => c.isRecording) ? 'stopAll' : 'startAll')}
                className={cameras.every(c => c.isRecording) ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {cameras.every(c => c.isRecording) ? (
                  <>
                    <StopIcon className="w-4 h-4 mr-1" />
                    Dừng tất cả
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-1" />
                    Bắt đầu tất cả
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCameras.map((camera) => (
          <Card 
            key={camera.id}
            className={`hover:shadow-xl transition-all duration-300 hover-lift border ${
              camera.status === 'online' ? 'border-green-200' :
              camera.status === 'warning' ? 'border-yellow-200' :
              'border-red-200'
            }`}
          >
            {/* Camera Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  camera.status === 'online' ? 'bg-gradient-to-r from-green-100 to-emerald-100' :
                  camera.status === 'warning' ? 'bg-gradient-to-r from-yellow-100 to-amber-100' :
                  'bg-gradient-to-r from-red-100 to-pink-100'
                }`}>
                  <VideoCameraIcon className={`w-6 h-6 ${
                    camera.status === 'online' ? 'text-green-600' :
                    camera.status === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{camera.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{camera.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  camera.status === 'online' ? 'bg-green-100 text-green-800' :
                  camera.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {camera.status === 'online' ? '🟢 Online' :
                   camera.status === 'warning' ? '🟡 Warning' :
                   '🔴 Offline'}
                </span>
                {camera.aiEnabled && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                    🤖 AI Enabled
                  </span>
                )}
              </div>
            </div>

            {/* Camera Info */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Rủi ro</div>
                  <div className={`text-lg font-bold ${
                    camera.riskLevel > 70 ? 'text-red-600' :
                    camera.riskLevel > 40 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {camera.riskLevel}%
                    {camera.riskLevel > 70 && (
                      <ClockIcon className="w-4 h-4 inline ml-1 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Cảnh báo</div>
                  <div className="text-lg font-bold text-gray-900">
                    {camera.alerts || 0}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Hoạt động lần cuối:</span>
                </div>
                <span className="font-medium">{camera.lastActive}</span>
              </div>
            </div>

            {/* Camera Actions */}
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center justify-center"
                onClick={(e) => handleCameraClick(camera)}
              >
                <EyeIcon className="w-4 h-4" />
              </Button>
              <Button 
                variant={camera.isRecording ? "danger" : "outline"}
                size="sm"
                className={`flex items-center justify-center ${
                  camera.isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : ''
                }`}
                onClick={(e) => handleToggleRecording(camera.id, e)}
                disabled={camera.status === 'offline'}
              >
                {camera.isRecording ? (
                  <StopIcon className="w-4 h-4" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center justify-center"
                onClick={(e) => handleTestConnection(camera.id, e)}
              >
                <WifiIcon className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center justify-center border-red-200 text-red-600 hover:bg-red-50"
                onClick={(e) => handleDeleteCamera(camera.id, e)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Recording Indicator */}
            {camera.isRecording && (
              <div className="mt-3 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-red-600">Đang ghi hình</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCameras.length === 0 && (
        <Card className="text-center py-12 border-dashed border-2 border-gray-300">
          <VideoCameraIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy camera nào
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
              : "Chưa có camera nào được cấu hình"}
          </p>
          <Button 
            variant="primary"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setIsAdding(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Thêm camera đầu tiên
          </Button>
        </Card>
      )}

      {/* Add/Edit Camera Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Chỉnh sửa Camera' : 'Thêm Camera Mới'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  setNewCamera({ name: '', location: '', streamUrl: '', type: 'ip', resolution: '1080p', fps: 30, aiEnabled: true });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên camera <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Camera cổng chính"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vị trí <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Tòa nhà A, Tầng 1"
                    value={newCamera.location}
                    onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Stream
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="rtsp://192.168.1.100:554/stream"
                    value={newCamera.streamUrl}
                    onChange={(e) => setNewCamera({...newCamera, streamUrl: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại camera
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCamera.type}
                    onChange={(e) => setNewCamera({...newCamera, type: e.target.value})}
                  >
                    <option value="ip">IP Camera</option>
                    <option value="webcam">Webcam</option>
                    <option value="dvr">DVR System</option>
                    <option value="nvr">NVR System</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ phân giải
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCamera.resolution}
                    onChange={(e) => setNewCamera({...newCamera, resolution: e.target.value})}
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="2k">2K Quad HD</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FPS (Frame Rate)
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCamera.fps}
                    onChange={(e) => setNewCamera({...newCamera, fps: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 FPS</option>
                    <option value={24}>24 FPS</option>
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kích hoạt AI phân tích
                    </label>
                    <p className="text-sm text-gray-500">
                      Phát hiện hành vi tự động
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={newCamera.aiEnabled}
                      onChange={(e) => setNewCamera({...newCamera, aiEnabled: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Lưu ý quan trọng</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Đảm bảo camera có kết nối mạng ổn định và địa chỉ IP không bị chặn bởi firewall.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  setNewCamera({ name: '', location: '', streamUrl: '', type: 'ip', resolution: '1080p', fps: 30, aiEnabled: true });
                }}
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="primary"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleAddCamera}
              >
                {isEditing ? 'Cập nhật' : 'Thêm camera'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Camera Feed Modal */}
      {isLiveMode && selectedCamera && (
        <CameraFeedModal
          camera={selectedCamera}
          onClose={() => {
            setIsLiveMode(false);
            setSelectedCamera(null);
          }}
        />
      )}
    </div>
  );
};

export default CameraManagement;