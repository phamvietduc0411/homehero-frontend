import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';
import '../../styles/Technician/TechnicianDashboard.css'

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock technician data (in real app, this would come from API)
  const technicianData = {
    technicianId: 'TECH001',
    fullName: 'Nguyễn Văn Thành',
    email: 'thanh.nguyen@repairservice.com',
    phone: '0987654321',
    experienceYears: 5,
    isActive: true,
    avatar: '/api/placeholder/100/100',
    specialties: ['Điện', 'Điều hòa', 'Máy giặt'],
    rating: 4.8,
    completedJobs: 248,
    joinDate: '2019-03-15'
  };

  // Mock booking data (in real app, this would come from API)
  const bookings = [
    {
      bookingId: 'BK12345678',
      status: 'Assigned',
      customerName: 'Trần Thị Lan',
      customerPhone: '0912345678',
      serviceType: 'Sửa chữa điều hòa',
      applianceType: 'Điều hòa inverter',
      description: 'Điều hòa không lạnh, có tiếng ồn lạ',
      address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
      preferredDate: '2025-06-24',
      preferredTime: '14:00 - 16:00',
      urgencyLevel: 'normal',
      estimatedPrice: '300,000 ₫',
      createdAt: '23/06/2025 10:30:00',
      assignedAt: '23/06/2025 11:00:00'
    },
    {
      bookingId: 'BK12345679',
      status: 'In Progress',
      customerName: 'Lê Văn Minh',
      customerPhone: '0923456789',
      serviceType: 'Sửa chữa điện',
      applianceType: 'Ổ cắm điện',
      description: 'Ổ cắm bị cháy, không hoạt động',
      address: '456 Lê Lợi, Quận 1, TP.HCM',
      preferredDate: '2025-06-23',
      preferredTime: '16:00 - 18:00',
      urgencyLevel: 'urgent',
      estimatedPrice: '200,000 ₫',
      createdAt: '23/06/2025 09:15:00',
      assignedAt: '23/06/2025 09:30:00',
      startedAt: '23/06/2025 16:00:00'
    },
    {
      bookingId: 'BK12345680',
      status: 'Completed',
      customerName: 'Phạm Thị Hoa',
      customerPhone: '0934567890',
      serviceType: 'Sửa máy giặt',
      applianceType: 'Máy giặt cửa trước',
      description: 'Máy giặt không vắt được',
      address: '789 Võ Văn Tần, Quận 3, TP.HCM',
      preferredDate: '2025-06-22',
      preferredTime: '08:00 - 10:00',
      urgencyLevel: 'normal',
      estimatedPrice: '250,000 ₫',
      actualPrice: '280,000 ₫',
      createdAt: '21/06/2025 15:20:00',
      assignedAt: '21/06/2025 16:00:00',
      startedAt: '22/06/2025 08:00:00',
      completedAt: '22/06/2025 09:30:00'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Assigned':
        return <Clock className="status-icon status-assigned" />;
      case 'In Progress':
        return <AlertCircle className="status-icon status-progress" />;
      case 'Completed':
        return <CheckCircle className="status-icon status-completed" />;
      default:
        return <XCircle className="status-icon status-default" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Assigned':
        return 'status-assigned';
      case 'In Progress':
        return 'status-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  const handleStatusChange = (bookingId, newStatus) => {
    // In real app, this would make an API call
    console.log(`Changing booking ${bookingId} to status: ${newStatus}`);
    alert(`Đã cập nhật trạng thái đơn hàng ${bookingId} thành: ${newStatus}`);
  };

  const ProfileTab = () => (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar">
            {technicianData.fullName.charAt(0)}
          </div>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{technicianData.fullName}</h2>
          <p className="profile-id">ID: {technicianData.technicianId}</p>
          <div className="rating-container">
            <Star className="star-icon" />
            <span className="rating-score">{technicianData.rating}</span>
            <span className="rating-text">({technicianData.completedJobs} công việc hoàn thành)</span>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-section">
          <h3 className="section-title">Thông tin liên hệ</h3>
          
          <div className="info-item">
            <Mail className="info-icon" />
            <div className="info-content">
              <p className="info-label">Email</p>
              <p className="info-value">{technicianData.email}</p>
            </div>
          </div>

          <div className="info-item">
            <Phone className="info-icon" />
            <div className="info-content">
              <p className="info-label">Số điện thoại</p>
              <p className="info-value">{technicianData.phone}</p>
            </div>
          </div>

          <div className="info-item">
            <Calendar className="info-icon" />
            <div className="info-content">
              <p className="info-label">Ngày gia nhập</p>
              <p className="info-value">{new Date(technicianData.joinDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Thông tin nghề nghiệp</h3>
          
          <div className="career-info">
            <p className="info-label">Kinh nghiệm</p>
            <p className="info-value">{technicianData.experienceYears} năm</p>
          </div>

          <div className="career-info">
            <p className="info-label">Chuyên môn</p>
            <div className="specialties">
              {technicianData.specialties.map((specialty, index) => (
                <span key={index} className="specialty-tag">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="career-info">
            <p className="info-label">Trạng thái</p>
            <span className={`status-badge ${technicianData.isActive ? 'active' : 'inactive'}`}>
              {technicianData.isActive ? 'Đang hoạt động' : 'Tạm nghỉ'}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-completed">
          <div className="stat-number">{technicianData.completedJobs}</div>
          <div className="stat-label">Công việc hoàn thành</div>
        </div>
        <div className="stat-card stat-rating">
          <div className="stat-number">{technicianData.rating}</div>
          <div className="stat-label">Đánh giá trung bình</div>
        </div>
        <div className="stat-card stat-experience">
          <div className="stat-number">{technicianData.experienceYears}</div>
          <div className="stat-label">Năm kinh nghiệm</div>
        </div>
      </div>
    </div>
  );

  const BookingsTab = () => (
    <div className="bookings-container">
      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Chờ xử lý</p>
              <p className="quick-stat-number assigned">
                {bookings.filter(b => b.status === 'Assigned').length}
              </p>
            </div>
            <Clock className="quick-stat-icon assigned" />
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Đang thực hiện</p>
              <p className="quick-stat-number progress">
                {bookings.filter(b => b.status === 'In Progress').length}
              </p>
            </div>
            <AlertCircle className="quick-stat-icon progress" />
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Hoàn thành</p>
              <p className="quick-stat-number completed">
                {bookings.filter(b => b.status === 'Completed').length}
              </p>
            </div>
            <CheckCircle className="quick-stat-icon completed" />
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Tổng công việc</p>
              <p className="quick-stat-number total">{bookings.length}</p>
            </div>
            <Calendar className="quick-stat-icon total" />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        <div className="bookings-header">
          <h3 className="bookings-title">Danh sách công việc</h3>
        </div>
        
        <div className="booking-items">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <div className="booking-header">
                <div className="booking-status-info">
                  {getStatusIcon(booking.status)}
                  <div className="booking-id-info">
                    <h4 className="booking-id">#{booking.bookingId}</h4>
                    <p className="booking-created">Tạo lúc: {booking.createdAt}</p>
                  </div>
                </div>
                <div className="booking-badges">
                  <span className={`status-badge ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                  {booking.urgencyLevel === 'urgent' && (
                    <span className="urgent-badge">
                      Khẩn cấp
                    </span>
                  )}
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-section">
                  <div className="customer-info">
                    <p className="section-title">Thông tin khách hàng</p>
                    <p className="customer-name">{booking.customerName}</p>
                    <p className="customer-phone">{booking.customerPhone}</p>
                  </div>
                  
                  <div className="address-info">
                    <p className="section-title">Địa chỉ</p>
                    <div className="address-content">
                      <MapPin className="address-icon" />
                      <p className="address-text">{booking.address}</p>
                    </div>
                  </div>
                </div>

                <div className="booking-section">
                  <div className="service-info">
                    <p className="section-title">Dịch vụ</p>
                    <p className="service-type">{booking.serviceType}</p>
                    <p className="appliance-type">{booking.applianceType}</p>
                  </div>
                  
                  <div className="time-info">
                    <p className="section-title">Thời gian</p>
                    <p className="time-slot">
                      {new Date(booking.preferredDate).toLocaleDateString('vi-VN')} • {booking.preferredTime}
                    </p>
                  </div>
                  
                  <div className="price-info">
                    <p className="section-title">Giá dự kiến</p>
                    <p className="estimated-price">{booking.estimatedPrice}</p>
                    {booking.actualPrice && (
                      <p className="actual-price">Thực tế: {booking.actualPrice}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="description-section">
                <p className="section-title">Mô tả sự cố</p>
                <p className="description-text">{booking.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="booking-actions">
                {booking.status === 'Assigned' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking.bookingId, 'In Progress')}
                      className="action-btn primary"
                    >
                      Bắt đầu làm việc
                    </button>
                    <button className="action-btn secondary">
                      Liên hệ khách hàng
                    </button>
                  </>
                )}
                
                {booking.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking.bookingId, 'Completed')}
                      className="action-btn success"
                    >
                      Hoàn thành
                    </button>
                    <button className="action-btn secondary">
                      Cập nhật tiến độ
                    </button>
                  </>
                )}
                
                {booking.status === 'Completed' && (
                  <button className="action-btn secondary">
                    Xem chi tiết
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="dashboard-title">Trang chủ kỹ thuật viên</h1>
              <p className="dashboard-subtitle">Xin chào, {technicianData.fullName}!</p>
            </div>
            <div className="header-profile">
              <div className="header-date">
                <p className="date-label">Hôm nay</p>
                <p className="date-value">{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="header-avatar">
                {technicianData.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div className="tab-border">
            <nav className="tab-nav">
              <button
                onClick={() => setActiveTab('profile')}
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              >
                <div className="tab-content">
                  <User className="tab-icon" />
                  <span>Thông tin cá nhân</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
              >
                <div className="tab-content">
                  <Calendar className="tab-icon" />
                  <span>Lịch booking sửa chữa</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? <ProfileTab /> : <BookingsTab />}
      </div>
    </div>
  );
};

export default TechnicianDashboard;