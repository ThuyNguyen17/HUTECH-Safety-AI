import React, { useState } from 'react';
import './DocumentPage.css';

const DocumentPageSimple = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: 'background',
      title: '1. Bối cảnh & Lý do chọn đề tài',
      content: (
        <div className="section-content">
          <h3>Bối cảnh:</h3>
          <div className="info-box">
            <p>Khuôn viên Trường Đại học Công nghệ TPHCM (Hutech) với diện tích rộng, nhiều tòa nhà cao tầng.</p>
          </div>
          
          <h3>Lý do chọn đề tài:</h3>
          <ul>
            <li>Nhu cầu đảm bảo an ninh, an toàn trong khuôn viên trường học</li>
            <li>Giảm thiểu rủi ro tai nạn nghiêm trọng</li>
            <li>Ứng dụng công nghệ AI vào thực tiễn</li>
          </ul>
        </div>
      )
    },
    // Thêm các sections khác tương tự...
  ];

  return (
    <div className="document-container">
      <header className="document-header">
        <h1>HỆ THỐNG GIÁM SÁT AN NINH THÔNG MINH</h1>
        <h2>Trường Đại học Công nghệ TPHCM (Hutech)</h2>
        <p className="subtitle">Ứng dụng AI trong phát hiện và cảnh báo sớm các sự kiện nguy hiểm</p>
      </header>

      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">Trạng thái:</span>
          <span className="status-value active">Đang nghiên cứu</span>
        </div>
        <div className="status-item">
          <span className="status-label">Phiên bản:</span>
          <span className="status-value">1.0.0</span>
        </div>
      </div>

      <div className="sections-container">
        {sections.map((section) => (
          <div key={section.id} className="section">
            <div 
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              <h3>{section.title}</h3>
              <span className="toggle-icon">
                {expandedSection === section.id ? '−' : '+'}
              </span>
            </div>
            
            {expandedSection === section.id && (
              <div className="section-content">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="document-footer">
        <h3>Kết luận</h3>
        <p>Hệ thống giám sát thông minh sử dụng AI tại Hutech hướng đến việc tạo ra môi trường học tập an toàn hơn.</p>
      </footer>
    </div>
  );
};

export default DocumentPageSimple;