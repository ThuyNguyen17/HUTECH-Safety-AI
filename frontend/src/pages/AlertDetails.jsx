import { 
  MapPinIcon, 
  UserIcon, 
  CalendarIcon, 
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AlertDetails = ({ alert }) => {
  const severityLabel = (sev) => {
    switch (sev) {
      case 'critical': return 'Nghiêm trọng';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return sev;
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'new': return 'Mới';
      case 'acknowledged': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{alert.type}</h3>
          <span className={`px-3 py-1 text-sm rounded-full ${
            alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
            alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {severityLabel(alert.severity)}
          </span>
        </div>
        <p className="text-gray-600">{alert.description}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Vị trí</h4>
              <p className="text-gray-900">{alert.location}</p>
              <p className="text-sm text-gray-600">{alert.camera}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Người phụ trách</h4>
              <p className="text-gray-900">{alert.assignedTo || 'Chưa phân công'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Ngày & giờ</h4>
              <p className="text-gray-900">{alert.date} lúc {alert.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Trạng thái</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                alert.status === 'new' ? 'bg-blue-100 text-blue-800' :
                alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {statusLabel(alert.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {alert.resolution && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Kết quả xử lý</h4>
          <p className="text-green-700">{alert.resolution}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          Phân công...
        </button>
        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
          Thêm ghi chú
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Thực hiện hành động
        </button>
      </div>
    </div>
  );
};

export default AlertDetails;