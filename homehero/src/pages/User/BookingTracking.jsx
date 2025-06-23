import React, { useState, useEffect } from 'react';
import '../../styles/User/BookingTracking.css';

const BookingTracking = ({ initialBookingData, onNavigateToPayment, onBackToForm }) => {
  // Initialize with passed data or sample data
  const [bookingData, setBookingData] = useState(initialBookingData || {
    bookingId: 'BK20250623001',
    status: 'Confirmed',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    serviceType: 'Sửa chữa điều hòa',
    applianceType: 'Điều hòa inverter',
    description: 'Điều hòa không lạnh, tiếng ồn khi hoạt động',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    preferredDate: '2025-06-25',
    preferredTime: '14:00 - 16:00',
    urgencyLevel: 'normal',
    estimatedPrice: '350,000',
    actualPrice: null,
    technicianInfo: {
      name: 'Trần Văn Bình',
      phone: '0987654321',
      rating: 4.8,
      experience: '5 năm kinh nghiệm',
      avatar: '👨‍🔧'
    },
    createdAt: '2025-06-23 14:30',
    updatedAt: '2025-06-23 15:15',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-06-23 14:30', note: 'Đơn hàng đã được tạo' },
      { status: 'Confirmed', timestamp: '2025-06-23 15:15', note: 'Đã phân công thợ và xác nhận lịch hẹn' }
    ]
  });

  // Status configuration
  const statusConfig = {
    'Pending': {
      label: 'Chờ xử lý',
      icon: '⏳',
      color: '#f59e0b',
      description: 'Đơn hàng đang chờ được xử lý'
    },
    'Confirmed': {
      label: 'Đã xác nhận',
      icon: '✅',
      color: '#10b981',
      description: 'Đã phân công thợ và xác nhận lịch hẹn'
    },
    'InProgress': {
      label: 'Đang sửa chữa',
      icon: '🔧',
      color: '#3b82f6',
      description: 'Thợ đang tiến hành sửa chữa'
    },
    'Completed': {
      label: 'Hoàn thành',
      icon: '🎉',
      color: '#059669',
      description: 'Dịch vụ đã hoàn thành'
    },
    'Cancelled': {
      label: 'Đã hủy',
      icon: '❌',
      color: '#ef4444',
      description: 'Đơn hàng đã bị hủy'
    }
  };

  const statusOrder = ['Pending', 'Confirmed', 'InProgress', 'Completed'];
  const currentStatusIndex = statusOrder.indexOf(bookingData.status);

  // 🎯 FIX: Handle auto navigation to payment when completed
  useEffect(() => {
    if (bookingData.status === 'Completed' && onNavigateToPayment) {
      // Add actual price when completed
      const completedData = {
        ...bookingData,
        actualPrice: '450,000'
      };
      
      // Auto navigate to payment after 3 seconds
      const timer = setTimeout(() => {
        onNavigateToPayment(completedData);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [bookingData.status, onNavigateToPayment]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, this would be WebSocket or polling API
      // For demo, we'll simulate status changes
      if (Math.random() > 0.97) { // 3% chance every second
        const nextStatusIndex = Math.min(currentStatusIndex + 1, statusOrder.length - 1);
        if (nextStatusIndex > currentStatusIndex) {
          const newStatus = statusOrder[nextStatusIndex];
          setBookingData(prev => ({
            ...prev,
            status: newStatus,
            updatedAt: new Date().toLocaleString('vi-VN'),
            statusHistory: [
              ...prev.statusHistory,
              {
                status: newStatus,
                timestamp: new Date().toLocaleString('vi-VN'),
                note: statusConfig[newStatus].description
              }
            ]
          }));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStatusIndex]);

  // 🎯 ADD: Manual function to simulate progress (for testing)
  const handleSimulateProgress = () => {
    const nextStatusIndex = Math.min(currentStatusIndex + 1, statusOrder.length - 1);
    if (nextStatusIndex > currentStatusIndex) {
      const newStatus = statusOrder[nextStatusIndex];
      setBookingData(prev => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toLocaleString('vi-VN'),
        statusHistory: [
          ...prev.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toLocaleString('vi-VN'),
            note: statusConfig[newStatus].description
          }
        ]
      }));
    }
  };

  // 🎯 ADD: Manual navigate to payment (for testing)
  const handleManualPayment = () => {
    if (onNavigateToPayment) {
      onNavigateToPayment({
        ...bookingData,
        actualPrice: '450,000'
      });
    }
  };

  const handleCancelBooking = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      setBookingData(prev => ({
        ...prev,
        status: 'Cancelled',
        updatedAt: new Date().toLocaleString('vi-VN'),
        statusHistory: [
          ...prev.statusHistory,
          {
            status: 'Cancelled',
            timestamp: new Date().toLocaleString('vi-VN'),
            note: 'Đơn hàng đã được hủy bởi khách hàng'
          }
        ]
      }));
    }
  };

  const handleContactTechnician = () => {
    if (bookingData.technicianInfo) {
      window.open(`tel:${bookingData.technicianInfo.phone}`);
    }
  };

  const getProgressPercentage = () => {
    if (bookingData.status === 'Cancelled') return 0;
    return ((currentStatusIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Theo dõi đơn hàng</span>
        </div>
        <h1 className="page-title">📱 Theo dõi đơn hàng</h1>
        <p className="page-subtitle">
          Mã đơn hàng: <strong>{bookingData.bookingId}</strong>
        </p>
      </div>

      <div className="tracking-container">
        
        {/* Status Progress */}
        <div className="status-section">
          <div className="status-header">
            <div className="current-status">
              <span className="status-icon" style={{ color: statusConfig[bookingData.status].color }}>
                {statusConfig[bookingData.status].icon}
              </span>
              <div className="status-info">
                <h3>{statusConfig[bookingData.status].label}</h3>
                <p>{statusConfig[bookingData.status].description}</p>
                <small>Cập nhật lần cuối: {bookingData.updatedAt}</small>
                
                {/* 🎯 ADD: Show countdown when completed */}
                {bookingData.status === 'Completed' && (
                  <div className="completion-notice">
                    <p style={{ color: '#059669', fontWeight: 'bold', marginTop: '10px' }}>
                      🎉 Dịch vụ hoàn thành! Đang chuyển đến trang thanh toán...
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {bookingData.status !== 'Cancelled' && bookingData.status !== 'Completed' && (
              <button onClick={handleCancelBooking} className="cancel-btn">
                Hủy đơn hàng
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: bookingData.status === 'Cancelled' ? '#ef4444' : '#10b981'
                }}
              ></div>
            </div>
            
            <div className="progress-steps">
              {statusOrder.map((status, index) => (
                <div 
                  key={status}
                  className={`step ${index <= currentStatusIndex ? 'completed' : ''} ${
                    bookingData.status === 'Cancelled' ? 'cancelled' : ''
                  }`}
                >
                  <div className="step-circle">
                    <span>{statusConfig[status].icon}</span>
                  </div>
                  <div className="step-label">{statusConfig[status].label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="details-section">
          <h3>📋 Chi tiết đơn hàng</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Dịch vụ:</span>
              <span className="value">{bookingData.serviceType}</span>
            </div>
            <div className="detail-item">
              <span className="label">Thiết bị:</span>
              <span className="value">{bookingData.applianceType}</span>
            </div>
            <div className="detail-item">
              <span className="label">Thời gian:</span>
              <span className="value">{bookingData.preferredDate} ({bookingData.preferredTime})</span>
            </div>
            <div className="detail-item">
              <span className="label">Địa chỉ:</span>
              <span className="value">{bookingData.address}</span>
            </div>
            <div className="detail-item">
              <span className="label">Mô tả sự cố:</span>
              <span className="value">{bookingData.description}</span>
            </div>
            <div className="detail-item">
              <span className="label">Giá ước tính:</span>
              <span className="value price">{bookingData.estimatedPrice} ₫</span>
            </div>
            {bookingData.actualPrice && (
              <div className="detail-item">
                <span className="label">Giá thực tế:</span>
                <span className="value price actual">{bookingData.actualPrice} ₫</span>
              </div>
            )}
          </div>
        </div>

        {/* Technician Info */}
        {bookingData.technicianInfo && bookingData.status !== 'Pending' && (
          <div className="technician-section">
            <h3>👨‍🔧 Thông tin thợ sửa chữa</h3>
            <div className="technician-card">
              <div className="technician-avatar">
                {bookingData.technicianInfo.avatar}
              </div>
              <div className="technician-info">
                <h4>{bookingData.technicianInfo.name}</h4>
                <div className="technician-details">
                  <span className="rating">⭐ {bookingData.technicianInfo.rating}</span>
                  <span className="experience">{bookingData.technicianInfo.experience}</span>
                </div>
                <p className="phone">📞 {bookingData.technicianInfo.phone}</p>
              </div>
              <button onClick={handleContactTechnician} className="contact-btn">
                Liên hệ thợ
              </button>
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="history-section">
          <h3>📜 Lịch sử trạng thái</h3>
          <div className="history-timeline">
            {bookingData.statusHistory.slice().reverse().map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span>{statusConfig[item.status].icon}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-status">{statusConfig[item.status].label}</div>
                  <div className="timeline-note">{item.note}</div>
                  <div className="timeline-time">{item.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          {/* 🎯 ADD: Test buttons for development */}
          {bookingData.status !== 'Completed' && bookingData.status !== 'Cancelled' && (
            <button onClick={handleSimulateProgress} className="action-btn primary">
              🚀 Mô phỏng tiến trình tiếp theo
            </button>
          )}
          
          {bookingData.status === 'Completed' && (
            <>
              <button onClick={handleManualPayment} className="action-btn primary">
                💳 Đi đến thanh toán
              </button>
              <button className="action-btn secondary">⭐ Đánh giá dịch vụ</button>
              <button className="action-btn secondary">🔄 Đặt lại dịch vụ</button>
            </>
          )}
          
          {bookingData.status === 'InProgress' && (
            <>
              <button onClick={handleContactTechnician} className="action-btn primary">
                📞 Liên hệ thợ
              </button>
              <button className="action-btn secondary">❓ Báo cáo vấn đề</button>
            </>
          )}
          
          {onBackToForm && (
            <button onClick={onBackToForm} className="action-btn secondary">
              🏠 Về trang đặt lịch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTracking;