// src/data/mockData.js
export const mockCameras = [
  {
    id: 1,
    name: 'Camera Tầng Thượng A',
    location: 'Tòa nhà A, Tầng 10',
    status: 'online',
    riskLevel: 85,
    hasAlert: true,
    lastActive: '2 phút trước'
  },
  {
    id: 2,
    name: 'Camera Cầu Thang B',
    location: 'Tòa nhà B, Khu vực cầu thang',
    status: 'online',
    riskLevel: 72,
    hasAlert: true,
    lastActive: '1 phút trước'
  },
  {
    id: 3,
    name: 'Camera Hồ Nước',
    location: 'Khuôn viên chính',
    status: 'warning',
    riskLevel: 68,
    hasAlert: false,
    lastActive: '5 phút trước'
  },
  {
    id: 4,
    name: 'Camera Thư Viện',
    location: 'Tòa nhà Thư viện',
    status: 'online',
    riskLevel: 45,
    hasAlert: false,
    lastActive: '30 giây trước'
  }
];

export const mockAlerts = [
  {
    id: 1,
    camera: 'Camera Tầng Thượng A',
    message: 'Phát hiện người đứng ở lan can tầng thượng quá lâu',
    severity: 'critical',
    confidence: 92,
    location: 'Tòa nhà A, Tầng 10',
    timestamp: new Date(Date.now() - 5 * 60000)
  },
  {
    id: 2,
    camera: 'Camera Cầu Thang B',
    message: 'Hành vi leo trèo bất thường phát hiện',
    severity: 'critical',
    confidence: 85,
    location: 'Tòa nhà B, Cầu thang',
    timestamp: new Date(Date.now() - 8 * 60000)
  },
  {
    id: 3,
    camera: 'Camera Hồ Nước',
    message: 'Người đứng gần mép hồ quá lâu',
    severity: 'high',
    confidence: 78,
    location: 'Khuôn viên chính',
    timestamp: new Date(Date.now() - 15 * 60000)
  }
];