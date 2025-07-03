import React, { useState, useEffect } from 'react';
import '../../styles/User/BookingTracking.css';


const BookingTracking = ({ bookingId, onNavigateToPayment, onBackToForm }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setError('Không có thông tin đơn hàng');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking/${bookingId}`
        );
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin đơn hàng');
        }

        const result = await response.json();
        
        // Map API data sang format của component
        const mappedData = {
          bookingId: result.bookingId,
          status: result.status,
          customerName: result.customerName || 'N/A',
          customerPhone: result.customerPhone || result.phone || 'N/A',
          serviceName: result.serviceName || 'N/A',
          description: result.problemDescription || 'N/A',
          address: result.address || 'N/A',
          preferredDate: new Date(result.bookingDate).toISOString().split('T')[0],
          preferredTime: result.preferredTimeSlot || 'N/A',
          urgencyLevel: result.urgencyLevel || 'normal',
          estimatedPrice: result.totalPrice ? result.totalPrice.toLocaleString('vi-VN') : '0',
          actualPrice: result.status === 'Completed' && result.totalPrice ? 
                      result.totalPrice.toLocaleString('vi-VN') : null,
          technicianInfo: result.technicianName && result.technicianName !== 'Chưa phân công' ? {
            name: result.technicianName,
            phone: 'Liên hệ qua admin', // API chưa trả phone của technician
            rating: 4.8,
            experience: '5 năm kinh nghiệm',
            avatar: '👨‍🔧'
          } : null,
          createdAt: new Date().toLocaleString('vi-VN'), // API chưa có createdAt
          updatedAt: new Date().toLocaleString('vi-VN'), // API chưa có updatedAt
          statusHistory: [
            {
              status: 'Pending',
              timestamp: new Date().toLocaleString('vi-VN'),
              note: 'Đơn hàng đã được tạo'
            },
            {
              status: result.status,
              timestamp: new Date().toLocaleString('vi-VN'),
              note: getStatusNote(result.status)
            }
          ].filter((item, index, arr) => 
            index === 0 || item.status !== arr[0].status
          )
        };

        setBookingData(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);
  useEffect(() => {
  if (!bookingId || !bookingData) return;

  // Chỉ poll khi booking chưa completed/cancelled
  if (bookingData.status === 'Completed' || bookingData.status === 'Cancelled') {
    return;
  }

  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(
        `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking/${bookingId}`
      );
      
      if (response.ok) {
        const result = await response.json();
        
        // Chỉ update nếu status thay đổi
        if (result.status !== bookingData.status) {
          console.log(`Status updated from ${bookingData.status} to ${result.status}`);
          
          // Re-map data với status mới
          const updatedData = {
            ...bookingData,
            status: result.status,
            updatedAt: new Date().toLocaleString('vi-VN'),
            statusHistory: [
              ...bookingData.statusHistory,
              {
                status: result.status,
                timestamp: new Date().toLocaleString('vi-VN'),
                note: getStatusNote(result.status)
              }
            ]
          };
          
          setBookingData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error polling booking status:', error);
    }
  }, 5000); // Poll mỗi 5 giây

  return () => clearInterval(pollInterval);
}, [bookingId, bookingData?.status]);

// ✅ THÊM: Status change notification
useEffect(() => {
  if (bookingData?.status === 'Completed') {
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: #10b981; 
        color: white; 
        padding: 15px 20px; 
        border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: bold;
      ">
        🎉 Dịch vụ đã hoàn thành! Đang chuyển đến thanh toán...
      </div>
    `;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}, [bookingData?.status]);

  useEffect(() => {
    if (bookingData?.status === 'Completed' && onNavigateToPayment) {
      const completedData = {
        ...bookingData,
        actualPrice: bookingData.estimatedPrice
      };
      
      const timer = setTimeout(() => {
        onNavigateToPayment(completedData);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [bookingData?.status, onNavigateToPayment, bookingData]);

  const getStatusNote = (status) => {
    const statusNotes = {
      'Pending': 'Đơn hàng đang chờ được xử lý',
      'Confirmed': 'Đã phân công thợ và xác nhận lịch hẹn',
      'InProgress': 'Thợ đang tiến hành sửa chữa',
      'Completed': 'Dịch vụ đã hoàn thành',
      'Cancelled': 'Đơn hàng đã bị hủy'
    };
    return statusNotes[status] || `Trạng thái được cập nhật thành ${status}`;
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="page-content">
        <div className="error-container">
          <h3>❌ Không thể tải thông tin đơn hàng</h3>
          <p>{error || 'Đã có lỗi xảy ra'}</p>
          {onBackToForm && (
            <button onClick={onBackToForm} className="action-btn primary">
              🏠 Về trang đặt lịch
            </button>
          )}
        </div>
      </div>
    );
  }

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

  const handleManualPayment = () => {
    if (onNavigateToPayment) {
      onNavigateToPayment({
        ...bookingData,
        actualPrice: bookingData.estimatedPrice
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
      alert('Vui lòng liên hệ admin để được kết nối với thợ sửa chữa');
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
          Mã đơn hàng: <strong>BK{String(bookingData.bookingId).padStart(8, '0')}</strong>
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
              <span className="value">{bookingData.serviceName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Khách hàng:</span>
              <span className="value">{bookingData.customerName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">{bookingData.customerPhone}</span>
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
              <span className="label">Mức độ khẩn cấp:</span>
              <span className="value">{bookingData.urgencyLevel === 'urgent' ? 'Khẩn cấp' : 'Bình thường'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Tổng chi phí:</span>
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