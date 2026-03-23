// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  BellAlertIcon, 
  CameraIcon, 
  ChartBarIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlayIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SignalIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import StatCard from '../components/UI/StatCard';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import CameraFeedModal from '../components/Camera/CameraFeedModal';
import { useAlerts } from '../hooks/useAlerts';
import { mockCameras, mockAlerts, mockRecentActivity } from '../data/mockData';

const Dashboard = () => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { alerts, loading, acknowledgeAlert, stats: alertStats } = useAlerts();
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').slice(0, 3);
  const recentAlerts = alerts.slice(0, 5);

  // Thống kê
  const [stats, setStats] = useState({
    criticalPredictions: 3,
    totalPredictions: 156,
    activeCameras: 8,
    predictionAccuracy: 94.5,
    avgResponseTime: '1.8',
    preventedCases: 12,
    highRiskAreas: 3,
    activeInterventions: 2
  });

  // Dữ liệu biểu đồ
  const predictionTrendData = {
    '24h': [
      { time: '00:00', predictions: 2, interventions: 1 },
      { time: '04:00', predictions: 1, interventions: 0 },
      { time: '08:00', predictions: 5, interventions: 2 },
      { time: '12:00', predictions: 8, interventions: 3 },
      { time: '16:00', predictions: 12, interventions: 4 },
      { time: '20:00', predictions: 15, interventions: 5 },
      { time: '23:59', predictions: 4, interventions: 1 },
    ],
    '7days': [
      { day: 'Mon', predictions: 8, interventions: 3 },
      { day: 'Tue', predictions: 12, interventions: 4 },
      { day: 'Wed', predictions: 10, interventions: 3 },
      { day: 'Thu', predictions: 15, interventions: 5 },
      { day: 'Fri', predictions: 7, interventions: 2 },
      { day: 'Sat', predictions: 4, interventions: 1 },
      { day: 'Sun', predictions: 3, interventions: 1 },
    ],
    '30days': [
      { week: 'Tuần 1', predictions: 42, interventions: 15 },
      { week: 'Tuần 2', predictions: 38, interventions: 12 },
      { week: 'Tuần 3', predictions: 45, interventions: 18 },
      { week: 'Tuần 4', predictions: 52, interventions: 20 },
    ]
  };

  const riskDistributionData = [
    { name: 'Rất cao', value: 6, color: '#ef4444', description: 'Hành vi nguy hiểm trực tiếp' },
    { name: 'Cao', value: 15, color: '#f97316', description: 'Dấu hiệu cảnh báo rõ ràng' },
    { name: 'Trung bình', value: 30, color: '#eab308', description: 'Hành vi bất thường' },
    { name: 'Thấp', value: 49, color: '#22c55e', description: 'Theo dõi định kỳ' },
  ];

  const locationRiskData = [
    { name: 'Tầng thượng', risk: 85, alerts: 12, location: 'Tòa nhà A' },
    { name: 'Cầu thang', risk: 72, alerts: 8, location: 'Tòa nhà B' },
    { name: 'Hồ nước', risk: 68, alerts: 6, location: 'Khuôn viên' },
    { name: 'Thư viện', risk: 45, alerts: 3, location: 'Tòa nhà chính' },
    { name: 'Sân thể thao', risk: 30, alerts: 2, location: 'Khu thể thao' },
  ];

  const timeOfDayData = [
    { time: 'Đêm', incidents: 5, color: '#3b82f6' },
    { time: 'Sáng', incidents: 8, color: '#8b5cf6' },
    { time: 'Trưa', incidents: 12, color: '#ec4899' },
    { time: 'Chiều', incidents: 15, color: '#f59e0b' },
    { time: 'Tối', incidents: 10, color: '#ef4444' },
  ];

  // Xử lý sự kiện
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    setIsLiveMode(true);
  };

  const handleAcknowledgeAlert = async (alertId) => {
    const result = await acknowledgeAlert(alertId);
    if (result.success) {
      console.log('Alert acknowledged:', alertId);
    }
  };

  const handleExportReport = () => {
    const reportData = {
      date: new Date().toLocaleDateString('vi-VN'),
      stats: stats,
      criticalAlerts: criticalAlerts,
      summary: `Báo cáo hệ thống HUTECH - ${new Date().toLocaleString('vi-VN')}`
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hutech-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Đã xuất báo cáo thành công!');
  };

  const handleLiveView = () => {
    if (mockCameras.length > 0) {
      handleCameraClick(mockCameras[0]);
    } else {
      setIsLiveMode(true);
    }
  };

  // Filter cameras based on search
  const filteredCameras = mockCameras.filter(camera =>
    camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Recent activity data
  const recentActivity = [
    { time: '10:30 AM', camera: 'Main Entrance', event: 'Suspicious behavior detected', severity: 'High', status: 'New' },
    { time: '10:15 AM', camera: 'Lab Building', event: 'Person detected in restricted area', severity: 'Critical', status: 'Acknowledged' },
    { time: '09:45 AM', camera: 'Dormitory', event: 'Unusual activity detected', severity: 'Medium', status: 'Resolved' },
    { time: '09:20 AM', camera: 'Main Entrance', event: 'System health check', severity: 'Low', status: 'Completed' },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Hệ thống Giám sát An toàn <span className="text-blue-600">HUTECH</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Dự đoán và ngăn chặn hành vi tự tử - Giám sát thời gian thực
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Hệ thống đang hoạt động
              </span>
              <span className="text-sm text-gray-500">
                Cập nhật: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-sm text-blue-600">
                <AcademicCapIcon className="w-4 h-4 inline mr-1" />
                HUTECH University
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={handleExportReport}
              className="border-blue-200 hover:bg-blue-50 flex items-center"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button 
              variant="primary"
              onClick={handleLiveView}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
            >
              <PlayIcon className="w-4 h-4 mr-2" />
              Giám sát trực tiếp
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dự đoán nguy cơ cao"
          value={stats.criticalPredictions}
          change="+2 hôm nay"
          icon={<BellAlertIcon className="w-6 h-6" />}
          variant="danger"
          trend="up"
          description="Cần can thiệp ngay"
        />
        <StatCard
          title="Camera đang hoạt động"
          value={`${stats.activeCameras}/12`}
          change="Tất cả bình thường"
          icon={<CameraIcon className="w-6 h-6" />}
          variant="primary"
          trend="neutral"
          description={
            <span className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
              8 camera đang giám sát
            </span>
          }
        />
        <StatCard
          title="Độ chính xác dự đoán"
          value={`${stats.predictionAccuracy}%`}
          change="+2.5% tuần trước"
          icon={<ChartBarIcon className="w-6 h-6" />}
          variant="success"
          trend="up"
          description="AI Model v4.2"
        />
        <StatCard
          title="Thời gian phản hồi"
          value={`${stats.avgResponseTime} phút`}
          change="-0.5 phút"
          icon={<ClockIcon className="w-6 h-6" />}
          variant="warning"
          trend="down"
          description="Trung bình"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Trend Chart */}
          <Card 
            title="Xu hướng dự đoán rủi ro"
            actions={
              <div className="flex items-center space-x-2">
                <select 
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="24h">24 giờ qua</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => console.log('View details')}>
                  <ChartPieIcon className="w-4 h-4" />
                </Button>
              </div>
            }
            className="border-blue-100 hover-lift"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionTrendData[timeRange]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey={timeRange === '24h' ? 'time' : timeRange === '7days' ? 'day' : 'week'} 
                    stroke="#6b7280" 
                    fontSize={12} 
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => {
                      const labels = {
                        predictions: 'Dự đoán',
                        interventions: 'Can thiệp'
                      };
                      return [value, labels[name] || name];
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="predictions" 
                    stroke="#3b82f6" 
                    fill="url(#colorPredictions)" 
                    strokeWidth={2}
                    name="Dự đoán"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interventions" 
                    stroke="#10b981" 
                    fill="url(#colorInterventions)" 
                    strokeWidth={2}
                    name="Can thiệp"
                  />
                  <defs>
                    <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterventions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>📈 Tổng số dự đoán: <strong>{stats.totalPredictions}</strong> trường hợp</p>
              <p>🛡️ Đã ngăn chặn: <strong>{stats.preventedCases}</strong> trường hợp nguy cơ cao</p>
            </div>
          </Card>

          {/* Critical Alerts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Critical Alerts */}
            <Card 
              title="Cảnh báo cần xử lý" 
              variant="danger"
              actions={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => console.log('View all alerts')}
                >
                  Xem tất cả
                </Button>
              }
              className="border-red-100"
            >
              {criticalAlerts.length > 0 ? (
                <div className="space-y-4">
                  {criticalAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover-lift"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900 text-sm">{alert.camera}</h4>
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                {alert.confidence}% tin cậy
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mt-1 line-clamp-2">{alert.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <MapPinIcon className="w-3 h-3 mr-1" />
                                {alert.location}
                              </span>
                              <span>
                                {new Date(alert.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="bg-gradient-to-r from-red-600 to-orange-600 text-xs px-3 py-1.5"
                          >
                            Xác nhận
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs px-3 py-1.5"
                            onClick={() => handleCameraClick({ id: 1, name: alert.camera })}
                          >
                            <EyeIcon className="w-3 h-3 mr-1" />
                            Xem video
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 font-medium">Không có cảnh báo nguy cơ cao</p>
                  <p className="text-gray-500 text-sm mt-1">Hệ thống đang hoạt động ổn định</p>
                </div>
              )}
            </Card>

            {/* High Risk Locations */}
            <Card 
              title="Khu vực nguy cơ cao" 
              variant="warning"
              actions={
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => console.log('View locations')}
                >
                  Xem chi tiết
                </Button>
              }
              className="border-yellow-100"
            >
              <div className="space-y-3">
                {locationRiskData.map((location, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${location.risk > 70 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{location.name}</p>
                        <p className="text-xs text-gray-500">{location.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-sm font-bold ${location.risk > 70 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {location.risk}%
                        </span>
                        <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                      </div>
                      <p className="text-xs text-gray-500">{location.alerts} cảnh báo</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column - Status & Activity */}
        <div className="space-y-6">
          {/* Risk Distribution */}
          <Card 
            title="Phân bố mức độ rủi ro" 
            className="border-purple-100 hover-lift"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} trường hợp`,
                      props.payload.description
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {riskDistributionData.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Camera Status */}
          <Card 
            title="Trạng thái camera" 
            actions={
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm camera..."
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SignalIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            }
            className="border-blue-100 hover-lift"
          >
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {filteredCameras.map((camera) => (
                <div 
                  key={camera.id}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover-lift ${
                    camera.status === 'online' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
                    camera.status === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200' :
                    'bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => handleCameraClick(camera)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        camera.status === 'online' ? 'bg-green-100' :
                        camera.status === 'warning' ? 'bg-yellow-100' :
                        'bg-gray-200'
                      }`}>
                        <CameraIcon className={`w-5 h-5 ${
                          camera.status === 'online' ? 'text-green-600' :
                          camera.status === 'warning' ? 'text-yellow-600' :
                          'text-gray-500'
                        }`} />
                      </div>
                      {camera.hasAlert && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white"></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{camera.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        <BuildingLibraryIcon className="w-3 h-3 inline mr-1" />
                        {camera.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`text-sm font-bold ${
                        camera.riskLevel > 70 ? 'text-red-600' :
                        camera.riskLevel > 40 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {camera.riskLevel}%
                      </span>
                      {camera.riskLevel > 70 ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                      ) : camera.riskLevel > 40 ? (
                        <ExclamationCircleIcon className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      camera.status === 'online' ? 'text-green-600' :
                      camera.status === 'warning' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {camera.status === 'online' ? '🟢 Online' :
                       camera.status === 'warning' ? '🟡 Warning' :
                       '⚪ Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-8 border-blue-200 text-blue-600 hover:bg-blue-50 text-sm py-2"
              onClick={() => console.log('Manage cameras')}
            >
              Quản lý tất cả camera
            </Button>
          </Card>
        </div>
      </div>

      {/* Camera Feed Modal */}
      {isLiveMode && (
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

export default Dashboard;