import { useState, useEffect, useMemo } from 'react';
import {
    FunnelIcon,
    CheckIcon,
    EyeIcon,
    BellAlertIcon,
    ArchiveBoxIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    ArrowsUpDownIcon,
    Cog6ToothIcon,
    DocumentChartBarIcon,
    UserGroupIcon,
    MapPinIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import AlertDetails from './AlertDetails';
import Badge from '../components/UI/Badge';

const AlertSystem = () => {
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'desc' });
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            camera: 'Cổng chính',
            type: 'Hành vi khả nghi',
            severity: 'critical',
            time: '10:30 AM',
            date: '2024-01-15',
            status: 'new',
            description: 'Người đứng quanh cổng hơn 15 phút',
            location: 'Cổng A, Tòa nhà chính',
            assignedTo: 'Đội bảo vệ A',
            imageUrl: '/api/placeholder/400/300',
            duration: '15 phút',
            confidence: '92%'
        },
        {
            id: 2,
            camera: 'Tòa nhà Lab',
            type: 'Truy cập trái phép',
            severity: 'high',
            time: '10:15 AM',
            date: '2024-01-15',
            status: 'acknowledged',
            description: 'Cố gắng truy cập khu vực hạn chế',
            location: 'Tầng 3, Cánh Lab',
            assignedTo: 'Đội bảo vệ B',
            imageUrl: '/api/placeholder/400/300',
            duration: '2 phút',
            confidence: '87%'
        },
        {
            id: 3,
            camera: 'Ký túc xá',
            type: 'Hoạt động bất thường',
            severity: 'medium',
            time: '09:45 AM',
            date: '2024-01-15',
            status: 'resolved',
            description: 'Di chuyển lạ trong giờ giới nghiêm',
            location: 'Khu C, Ký túc xá',
            assignedTo: 'Đội bảo vệ A',
            resolution: 'Đã xác nhận là nhân viên bảo trì',
            duration: '8 phút',
            confidence: '76%'
        },
        {
            id: 4,
            camera: 'Thư viện',
            type: 'Camera mất kết nối',
            severity: 'low',
            time: '09:20 AM',
            date: '2024-01-15',
            status: 'new',
            description: 'Camera #LIB-03 mất kết nối mạng',
            location: 'Cánh Tây, Thư viện',
            assignedTo: 'Hỗ trợ IT',
            imageUrl: '/api/placeholder/400/300',
            duration: '45 phút',
            confidence: '99%'
        },
        {
            id: 5,
            camera: 'Căn tin',
            type: 'Đám đông bất thường',
            severity: 'medium',
            time: '08:50 AM',
            date: '2024-01-15',
            status: 'new',
            description: 'Đám đông lớn tập trung gần cửa vào',
            location: 'Căn tin chính',
            assignedTo: 'Kiểm soát đám đông',
            imageUrl: '/api/placeholder/400/300',
            duration: '12 phút',
            confidence: '81%'
        },
        {
            id: 6,
            camera: 'Khu thể thao',
            type: 'Lỗi hệ thống',
            severity: 'low',
            time: '08:30 AM',
            date: '2024-01-15',
            status: 'resolved',
            description: 'Cần hiệu chuẩn hệ thống phát hiện chuyển động',
            location: 'Nhà thi đấu',
            assignedTo: 'Đội kỹ thuật',
            resolution: 'Đã hiệu chuẩn và hoạt động bình thường',
            duration: '5 phút',
            confidence: '95%'
        },
    ]);

    const [selectedAlert, setSelectedAlert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        email: true,
        push: true,
        sound: false,
        criticalOnly: false,
        quietHours: false,
        dailyDigest: true,
        vibration: true
    });

    const severityConfig = {
        critical: {
            color: 'red',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-700',
            icon: <ExclamationTriangleIcon className="w-4 h-4" />,
            label: 'Nghiêm trọng'
        },
        high: {
            color: 'orange',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-700',
            icon: <BellAlertIcon className="w-4 h-4" />,
            label: 'Cao'
        },
        medium: {
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-700',
            icon: <ClockIcon className="w-4 h-4" />,
            label: 'Trung bình'
        },
        low: {
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700',
            icon: <ArchiveBoxIcon className="w-4 h-4" />,
            label: 'Thấp'
        },
    };

    const statusConfig = {
        new: {
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            badgeText: 'Mới'
        },
        acknowledged: {
            color: 'purple',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            badgeText: 'Đang xử lý'
        },
        resolved: {
            color: 'green',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            badgeText: 'Đã giải quyết'
        },
    };

    useEffect(() => {
        // Phát âm thanh cho cảnh báo nghiêm trọng mới (nếu bật)
        const newCriticalAlerts = alerts.filter(alert =>
            alert.status === 'new' && alert.severity === 'critical'
        );

        if (newCriticalAlerts.length > 0 && notificationSettings.sound) {
            // placeholder - replace with toast/sound later
            console.log('Cảnh báo nghiêm trọng! (âm thanh)');
        }
    }, [alerts, notificationSettings.sound]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAcknowledge = (id) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, status: 'acknowledged' } : alert
        ));
    };

    const handleResolve = (id) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, status: 'resolved' } : alert
        ));
    };

    const handleViewDetails = (alert) => {
        setSelectedAlert(alert);
        setIsModalOpen(true);
    };

    const handleBulkAcknowledge = () => {
        const newAlerts = alerts.map(alert =>
            alert.status === 'new' ? { ...alert, status: 'acknowledged' } : alert
        );
        setAlerts(newAlerts);
    };

    const handleExportLogs = () => {
        const csvContent = [
            ['ID', 'Camera', 'Loại', 'Mức độ', 'Trạng thái', 'Thời gian', 'Ngày', 'Vị trí', 'Người phụ trách', 'Độ tin cậy'],
            ...alerts.map(alert => [
                alert.id,
                alert.camera,
                alert.type,
                severityConfig[alert.severity]?.label || alert.severity,
                statusConfig[alert.status]?.badgeText || alert.status,
                alert.time,
                alert.date,
                alert.location || 'N/A',
                alert.assignedTo || 'Chưa phân công',
                alert.confidence || 'N/A'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bao-cao-canh-bao-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleNotificationToggle = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const sortedAndFilteredAlerts = useMemo(() => {
        let filtered = alerts.filter(alert => {
            const matchesSeverity = filter === 'all' || alert.severity === filter;
            const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
            const matchesSearch = searchTerm === '' ||
                alert.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.location?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSeverity && matchesStatus && matchesSearch;
        });

        // Sắp xếp
        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'time') {
                aValue = new Date(`${a.date} ${a.time}`);
                bValue = new Date(`${b.date} ${b.time}`);
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [alerts, filter, statusFilter, searchTerm, sortConfig]);

    const stats = useMemo(() => ({
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length,
        new: alerts.filter(a => a.status === 'new').length,
        acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
        resolved: alerts.filter(a => a.status === 'resolved').length,
        total: alerts.length,
    }), [alerts]);

    const getColorClass = (color, type = 'text') => {
        switch(color) {
            case 'red':
                return type === 'text' ? 'text-red-600' : type === 'bg' ? 'bg-red-100' : 'border-l-4 border-l-red-500';
            case 'orange':
                return type === 'text' ? 'text-orange-600' : type === 'bg' ? 'bg-orange-100' : 'border-l-4 border-l-orange-500';
            case 'yellow':
                return type === 'text' ? 'text-yellow-600' : type === 'bg' ? 'bg-yellow-100' : 'border-l-4 border-l-yellow-500';
            case 'green':
                return type === 'text' ? 'text-green-600' : type === 'bg' ? 'bg-green-100' : 'border-l-4 border-l-green-500';
            case 'blue':
                return type === 'text' ? 'text-blue-600' : type === 'bg' ? 'bg-blue-100' : 'border-l-4 border-l-blue-500';
            case 'purple':
                return type === 'text' ? 'text-purple-600' : type === 'bg' ? 'bg-purple-100' : 'border-l-4 border-l-purple-500';
            default:
                return '';
        }
    };

    const getStatusDotColor = (status) => {
        switch(status) {
            case 'new':
                return 'bg-blue-500';
            case 'acknowledged':
                return 'bg-purple-500';
            case 'resolved':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Tiêu đề và Thống kê tổng quan */}
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="lg:w-2/3 space-y-6">
                    {/* Tiêu đề chính */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md">
                                        <BellAlertIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hệ thống cảnh báo</h1>
                                        <p className="text-gray-600 mt-1">Giám sát và xử lý cảnh báo an ninh theo thời gian thực</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4 flex-wrap">
                                    <Badge variant={stats.new > 0 ? 'danger' : 'success'} size="lg" className="px-4 py-1.5">
                                        {stats.new} cảnh báo mới
                                    </Badge>
                                    <Badge variant="outline" size="lg" className="px-4 py-1.5 flex items-center gap-2">
                                        <DocumentChartBarIcon className="w-4 h-4" />
                                        {stats.total} tổng cảnh báo
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="flex items-center gap-2 border-gray-300 hover:border-gray-400 rounded-lg"
                                >
                                    <Cog6ToothIcon className="w-5 h-5" />
                                    Cài đặt
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleExportLogs}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                    Xuất báo cáo
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Thống kê mức độ nghiêm trọng */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.entries({
                            critical: { label: 'Nghiêm trọng', icon: ExclamationTriangleIcon, color: 'red' },
                            high: { label: 'Mức cao', icon: BellAlertIcon, color: 'orange' },
                            medium: { label: 'Trung bình', icon: ClockIcon, color: 'yellow' },
                            low: { label: 'Mức thấp', icon: ArchiveBoxIcon, color: 'green' }
                        }).map(([key, { label, icon: Icon, color }]) => (
                            <Card
                                key={key}
                                className={`p-4 hover:shadow-lg transition-all duration-200 cursor-pointer rounded-2xl ${getColorClass(color, 'border')}`}
                                onClick={() => setFilter(key)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{stats[key]}</div>
                                        <div className="text-sm text-gray-600 font-medium">{label}</div>
                                        <div className="text-xs text-gray-500 mt-2">Cảnh báo hiện tại</div>
                                    </div>
                                    <div className={`p-3 rounded-lg ${getColorClass(color, 'bg')}`}>
                                        <Icon className={`w-6 h-6 ${getColorClass(color, 'text')}`} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Panel trạng thái */}
                <div className="lg:w-1/3">
                    <Card className="h-full p-6 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-2xl shadow-lg">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <InformationCircleIcon className="w-5 h-5" />
                            Tóm tắt trạng thái
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                                    <span className="font-medium">Chưa xử lý</span>
                                </div>
                                <span className="text-xl font-bold">{stats.new}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full" />
                                    <span className="font-medium">Đang xử lý</span>
                                </div>
                                <span className="text-xl font-bold">{stats.acknowledged}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                                    <span className="font-medium">Đã giải quyết</span>
                                </div>
                                <span className="text-xl font-bold">{stats.resolved}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/20">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">Tổng số cảnh báo hôm nay:</span>
                                <span className="font-bold text-lg">{stats.total}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-300">Tỷ lệ xử lý:</span>
                                <span className="font-bold text-green-400">
                                    {stats.total > 0 ? Math.round(((stats.acknowledged + stats.resolved) / stats.total) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Thanh tìm kiếm và bộ lọc */}
            <Card className="p-5 rounded-2xl">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm camera, loại cảnh báo, vị trí..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative min-w-[180px]">
                            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">Tất cả mức độ</option>
                                <option value="critical">Nghiêm trọng</option>
                                <option value="high">Cao</option>
                                <option value="medium">Trung bình</option>
                                <option value="low">Thấp</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[180px]">
                            <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="new">Mới</option>
                                <option value="acknowledged">Đang xử lý</option>
                                <option value="resolved">Đã giải quyết</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {stats.new > 0 && (
                            <Button
                                variant="primary"
                                onClick={handleBulkAcknowledge}
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg"
                            >
                                <CheckIcon className="w-5 h-5" />
                                Xác nhận tất cả ({stats.new})
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Danh sách cảnh báo */}
            <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <DocumentChartBarIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Danh sách cảnh báo
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Hiển thị {sortedAndFilteredAlerts.length} trong tổng số {alerts.length} cảnh báo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <ArrowsUpDownIcon className="w-4 h-4" />
                            <span>
                                Sắp xếp theo:
                                <span className="font-semibold text-gray-700 ml-1">
                                    {sortConfig.key === 'time' ? 'Thời gian' :
                                     sortConfig.key === 'severity' ? 'Mức độ' :
                                     sortConfig.key === 'status' ? 'Trạng thái' :
                                     sortConfig.key === 'camera' ? 'Camera' : 'Loại cảnh báo'}
                                </span>
                                <span className="mx-1">•</span>
                                <span className="font-semibold text-gray-700">
                                    {sortConfig.direction === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-white sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('status')}
                                        className="flex items-center gap-2 hover:text-gray-900"
                                    >
                                        Trạng thái
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('camera')}
                                        className="flex items-center gap-2 hover:text-gray-900"
                                    >
                                        <MapPinIcon className="w-4 h-4 mr-1" />
                                        Camera / Vị trí
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Loại cảnh báo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('severity')}
                                        className="flex items-center gap-2 hover:text-gray-900"
                                    >
                                        Mức độ
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('time')}
                                        className="flex items-center gap-2 hover:text-gray-900"
                                    >
                                        Thời gian
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {sortedAndFilteredAlerts.map((alert) => {
                                const severity = severityConfig[alert.severity];
                                const status = statusConfig[alert.status];

                                return (
                                    <tr
                                        key={alert.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap align-top">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${getStatusDotColor(alert.status)} ${alert.status === 'new' ? 'animate-pulse' : ''}`} />
                                                <Badge 
                                                    variant={status.color} 
                                                    size="md"
                                                    className="font-medium"
                                                >
                                                    {status.badgeText}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div>
                                                <div className="font-semibold text-gray-900">{alert.camera}</div>
                                                <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    {alert.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div>
                                                <div className="font-semibold text-gray-900">{alert.type}</div>
                                                <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                    {alert.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${severity.bgColor}`}>
                                                    {severity.icon}
                                                </div>
                                                <Badge
                                                    variant={severity.color}
                                                    size="md"
                                                    className="font-semibold"
                                                >
                                                    {severity.label}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div>
                                                <div className="font-semibold text-gray-900">{alert.time}</div>
                                                <div className="text-sm text-gray-600">{alert.date}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Thời lượng: {alert.duration}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewDetails(alert)}
                                                    className="border-gray-300 hover:border-gray-400 rounded-md"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    <span className="ml-1">Xem</span>
                                                </Button>

                                                {alert.status === 'new' && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => handleAcknowledge(alert.id)}
                                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md"
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                        <span className="ml-1">Xác nhận</span>
                                                    </Button>
                                                )}

                                                {alert.status === 'acknowledged' && (
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() => handleResolve(alert.id)}
                                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-md"
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                        <span className="ml-1">Giải quyết</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {sortedAndFilteredAlerts.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                <FunnelIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy cảnh báo</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                {searchTerm 
                                    ? `Không có cảnh báo nào phù hợp với "${searchTerm}"`
                                    : 'Không có cảnh báo nào phù hợp với bộ lọc hiện tại'}
                            </p>
                            {(searchTerm || filter !== 'all' || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilter('all');
                                        setStatusFilter('all');
                                    }}
                                >
                                    <XMarkIcon className="w-4 h-4 mr-2" />
                                    Xóa tất cả bộ lọc
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600 gap-3">
                        <div>
                            Hiển thị <span className="font-semibold">{sortedAndFilteredAlerts.length}</span> cảnh báo
                            {searchTerm && <span className="ml-2">cho từ khóa "<span className="font-semibold">{searchTerm}</span>"</span>}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Mới</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Đang xử lý</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Đã giải quyết</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modal cài đặt */}
            <Modal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="Cài đặt hệ thống"
                size="lg"
            >
                <div className="space-y-8">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                            Cấu hình thông báo
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(notificationSettings).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h5 className="font-semibold text-gray-900 capitalize mb-1">
                                            {key === 'email' ? 'Email' :
                                             key === 'push' ? 'Thông báo đẩy' :
                                             key === 'sound' ? 'Âm thanh cảnh báo' :
                                             key === 'criticalOnly' ? 'Chỉ cảnh báo nghiêm trọng' :
                                             key === 'quietHours' ? 'Giờ yên tĩnh' :
                                             key === 'dailyDigest' ? 'Báo cáo hàng ngày' :
                                             key === 'vibration' ? 'Rung thiết bị' : key}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                            {key === 'email' && 'Gửi thông báo qua email cho tất cả cảnh báo'}
                                            {key === 'push' && 'Nhận thông báo đẩy trên thiết bị di động'}
                                            {key === 'sound' && 'Phát âm thanh cho cảnh báo mới'}
                                            {key === 'criticalOnly' && 'Chỉ thông báo cho cảnh báo mức độ nghiêm trọng'}
                                            {key === 'quietHours' && 'Không làm phiền từ 22:00 đến 06:00'}
                                            {key === 'dailyDigest' && 'Báo cáo tổng hợp hàng ngày lúc 08:00'}
                                            {key === 'vibration' && 'Rung thiết bị cho cảnh báo khẩn cấp'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={value}
                                            onChange={() => handleNotificationToggle(key)}
                                        />
                                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-6">Tùy chỉnh hệ thống</h4>
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl">
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-1">Tự động xác nhận cảnh báo mức thấp</h5>
                                    <p className="text-sm text-gray-600">Tự động đánh dấu cảnh báo mức thấp là đã xử lý sau thời gian chỉ định</p>
                                </div>
                                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>15 phút</option>
                                    <option>30 phút</option>
                                    <option>1 giờ</option>
                                    <option>Không tự động</option>
                                </select>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl">
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-1">Chế độ xem mặc định</h5>
                                    <p className="text-sm text-gray-600">Thiết lập chế độ xem khi truy cập hệ thống</p>
                                </div>
                                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Tất cả cảnh báo</option>
                                    <option>Chỉ cảnh báo mới</option>
                                    <option>Nghiêm trọng & Cao</option>
                                    <option>Đang xử lý</option>
                                </select>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl">
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-1">Độ nhạy cảnh báo</h5>
                                    <p className="text-sm text-gray-600">Điều chỉnh độ nhạy của hệ thống phát hiện</p>
                                </div>
                                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Bình thường</option>
                                    <option>Cao</option>
                                    <option>Rất cao</option>
                                    <option>Tùy chỉnh</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsSettingsOpen(false)}
                            className="px-8 rounded-lg"
                        >
                            Hủy
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => setIsSettingsOpen(false)}
                            className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal chi tiết cảnh báo */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Chi tiết cảnh báo"
                size="xl"
            >
                {selectedAlert && <AlertDetails alert={selectedAlert} />}
            </Modal>
        </div>
    );
};

export default AlertSystem;