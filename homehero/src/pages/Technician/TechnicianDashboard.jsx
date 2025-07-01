import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle, Star, RefreshCw } from 'lucide-react';
import '../../styles/Technician/TechnicianDashboard.css';

import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { tokenManager } from '../Login_ver2';



const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [technicianData, setTechnicianData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingStats, setBookingStats] = useState({
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });

  
  const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api';
  useEffect(() => {
    const checkAuth = () => {
      if (!tokenManager.isAuthenticated()) {
        navigate('/');
        return;
      }
      
      const user = tokenManager.getUserData();
      if (user.userType !== 'Technician') {
        navigate('/');
        return;
      }
      
      setUserData(user);
      // Sử dụng user ID từ token thay vì hardcode
      fetchTechnicianProfile(user.id);
    };

    checkAuth();
  }, [navigate]);

  // Fetch technician profile data
  const fetchTechnicianProfile = async (technicianId) => {
  try {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/Technician/${technicianId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ FIX: Xử lý response đúng cách
    if (data.isSuccess && data.data) {
      setTechnicianData(data.data);
    } else if (data.fullName || data.email) {
      setTechnicianData(data);
    } else {
      setTechnicianData(null);
    }
  } catch (err) {
    setError('Không thể tải thông tin kỹ thuật viên: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  // Fetch bookings for technician
  const fetchBookings = async (status = 'all', page = 1) => {
  try {
    setBookingLoading(true);
    const token = tokenManager.getToken();
    const technicianId = userData?.id;
    
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '10'
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/Booking/technician/${technicianId}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // ✅ FIX: Xử lý đúng API structure
    if (data.isSuccess && data.data && data.data.bookings) {
      // API trả về: data.data.bookings là array
      setBookings(data.data.bookings);
      setBookingStats({
        totalCount: data.data.totalCount || data.data.bookings.length,
        totalPages: data.data.totalPages || Math.ceil(data.data.bookings.length / 10),
        hasNext: data.pagination?.hasNext || false,
        hasPrevious: data.pagination?.hasPrevious || false
      });
    } else if (Array.isArray(data)) {
      // Fallback: direct array response
      setBookings(data);
      setBookingStats({
        totalCount: data.length,
        totalPages: Math.ceil(data.length / 10),
        hasNext: false,
        hasPrevious: false
      });
    } else {
      // No bookings found
      setBookings([]);
      setBookingStats({
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      });
    }

  } catch (err) {
    setError('Không thể tải danh sách booking: ' + err.message);
    setBookings([]);
  } finally {
    setBookingLoading(false);
  }
};


  // Logout function
  const handleLogout = () => {
    tokenManager.removeToken();
    tokenManager.removeUserData();
    navigate('/');
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = tokenManager.getToken();
      const params = new URLSearchParams({
        id: bookingId.toString(),
        status: newStatus
      });

      const response = await fetch(`${API_BASE_URL}/Booking/status?${params}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchBookings(statusFilter, bookingPage);
      
      alert(`Đã cập nhật trạng thái booking #${bookingId} thành: ${newStatus}`);
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Không thể cập nhật trạng thái booking');
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (userData?.id) { 
      await fetchBookings();
    }
    };



    loadData();
  }, [userData]);

  // Reload bookings when filter or page changes
  useEffect(() => {
    if (userData?.id && !loading) {
      fetchBookings(statusFilter, bookingPage);
    }
  }, [statusFilter, bookingPage, userData]);

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'confirmed':
        return <Clock className="status-icon status-assigned" />;
      case 'in progress':
      case 'inprogress':
        return <AlertCircle className="status-icon status-progress" />;
      case 'completed':
        return <CheckCircle className="status-icon status-completed" />;
      default:
        return <XCircle className="status-icon status-default" />;
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'confirmed':
        return 'status-pending';
      case 'in progress':
      case 'inprogress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusLower = currentStatus?.toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'confirmed':
        return 'InProgress';
      case 'in progress':
      case 'inprogress':
        return 'Completed';
      default:
        return null;
    }
  };

  const getActionButtonText = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'confirmed':
        return 'Bắt đầu làm việc';
      case 'in progress':
      case 'inprogress':
        return 'Hoàn thành';
      default:
        return 'Xem chi tiết';
    }
  };

  const ProfileTab = () => {
    if (!technicianData) {
      return (
        <div className="profile-container">
          <div className="loading-state">
            <RefreshCw className="loading-icon animate-spin" />
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">
              {technicianData.fullName?.charAt(0) || 'T'}
            </div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{technicianData.fullName || 'N/A'}</h2>
            <p className="profile-id">ID: {technicianData.technicianId || 'N/A'}</p>
            <div className="rating-container">
              <Star className="star-icon" />
              <span className="rating-score">{technicianData.rating || '0.0'}</span>
              <span className="rating-text">({technicianData.jobCount || 0} công việc hoàn thành)</span>
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
                <p className="info-value">{technicianData.email || 'N/A'}</p>
              </div>
            </div>

            <div className="info-item">
              <Phone className="info-icon" />
              <div className="info-content">
                <p className="info-label">Số điện thoại</p>
                <p className="info-value">{technicianData.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="info-item">
              <Calendar className="info-icon" />
              <div className="info-content">
                <p className="info-label">Ngày gia nhập</p>
                <p className="info-value">
                  {technicianData.joinDate ? new Date(technicianData.joinDate).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Thông tin nghề nghiệp</h3>
            
            <div className="career-info">
              <p className="info-label">Kinh nghiệm</p>
              <p className="info-value">{technicianData.experienceYears || 0} năm</p>
            </div>

            <div className="career-info">
              <p className="info-label">Chuyên môn</p>
              <div className="specialties">
                {technicianData.skills && technicianData.skills.length > 0 ? (
                  technicianData.skills.map((skill, index) => (
                    <span key={index} className="specialty-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="specialty-tag">Chưa cập nhật</span>
                )}
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
            <div className="stat-number">{technicianData.jobCount || 0}</div>
            <div className="stat-label">Công việc hoàn thành</div>
          </div>
          <div className="stat-card stat-rating">
            <div className="stat-number">{technicianData.rating || '0.0'}</div>
            <div className="stat-label">Đánh giá trung bình</div>
          </div>
          <div className="stat-card stat-experience">
            <div className="stat-number">{technicianData.experienceYears || 0}</div>
            <div className="stat-label">Năm kinh nghiệm</div>
          </div>
        </div>
      </div>
    );
  };

  // Thay thế BookingsTab component trong TechnicianDashboard.jsx

const BookingsTab = () => {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  const assignedCount = safeBookings.filter(b => 
    ['pending', 'confirmed'].includes(b.status?.toLowerCase())
  ).length;
  
  const inProgressCount = safeBookings.filter(b => 
    ['in progress', 'inprogress'].includes(b.status?.toLowerCase())
  ).length;
  
  const completedCount = safeBookings.filter(b => 
    b.status?.toLowerCase() === 'completed'
  ).length;

  return (
    <div className="bookings-container">
    

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Chờ xử lý</p>
              <p className="quick-stat-number assigned">{assignedCount}</p>
            </div>
            <Clock className="quick-stat-icon assigned" />
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Đang thực hiện</p>
              <p className="quick-stat-number progress">{inProgressCount}</p>
            </div>
            <AlertCircle className="quick-stat-icon progress" />
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Hoàn thành</p>
              <p className="quick-stat-number completed">{completedCount}</p>
            </div>
            <CheckCircle className="quick-stat-icon completed" />
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-label">Tổng công việc</p>
              <p className="quick-stat-number total">{bookingStats.totalCount}</p>
            </div>
            <Calendar className="quick-stat-icon total" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bookings-controls">
        <div className="filter-section">
          <label htmlFor="status-filter">Lọc theo trạng thái:</label>
          <select 
            id="status-filter"
            value={statusFilter} 
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setBookingPage(1);
            }}
            className="status-filter"
          >
            <option value="all">Tất cả</option>
            <option value="confirmed">Chờ xử lý</option>
            <option value="inprogress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
        
        <button 
          onClick={() => fetchBookings(statusFilter, bookingPage)}
          className="refresh-btn"
          disabled={bookingLoading}
        >
          <RefreshCw className={bookingLoading ? 'refresh-icon animate-spin' : 'refresh-icon'} />
          Làm mới
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        <div className="bookings-header">
          <h3 className="bookings-title">
            Danh sách công việc 
            {statusFilter !== 'all' && ` - ${statusFilter}`}
            {bookingStats.totalCount > 0 && ` (${bookingStats.totalCount})`}
          </h3>
        </div>
        
        {bookingLoading ? (
          <div className="loading-state">
            <RefreshCw className="loading-icon animate-spin" />
            <p>Đang tải danh sách booking...</p>
          </div>
        ) : safeBookings.length > 0 ? (
          <div className="booking-items">
            {safeBookings.map((booking, index) => (
              <div key={booking.bookingId || index} className="booking-card">
                <div className="booking-header">
                  <div className="booking-status-info">
                    {getStatusIcon(booking.status)}
                    <div className="booking-id-info">
                      <h4 className="booking-id">#{booking.bookingId}</h4>
                      <p className="booking-created">
                        Tạo lúc: {booking.createdAt ? new Date(booking.createdAt).toLocaleString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="booking-badges">
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.isUrgent && (
                      <span className="urgent-badge">Khẩn cấp</span>
                    )}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="booking-section">
                    <div className="customer-info">
                      <p className="section-title">Thông tin khách hàng</p>
                      <p className="customer-name">{booking.customerName || 'N/A'}</p>
                      <p className="customer-phone">{booking.customerPhone || 'N/A'}</p>
                    </div>
                    
                    <div className="address-info">
                      <p className="section-title">Địa chỉ</p>
                      <div className="address-content">
                        <MapPin className="address-icon" />
                        <p className="address-text">{booking.fullAddress || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="booking-section">
                    <div className="service-info">
                      <p className="section-title">Dịch vụ</p>
                      <p className="service-type">{booking.serviceName || 'N/A'}</p>
                    </div>
                    
                    <div className="time-info">
                      <p className="section-title">Thời gian</p>
                      <p className="time-slot">
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : 'N/A'}
                        {booking.preferredTimeSlot && ` • ${booking.preferredTimeSlot}`}
                      </p>
                    </div>
                    
                    <div className="price-info">
                      <p className="section-title">Giá</p>
                      <p className="estimated-price">{booking.formattedPrice || booking.price || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {booking.problemDescription && (
                  <div className="description-section">
                    <p className="section-title">Mô tả sự cố</p>
                    <p className="description-text">{booking.problemDescription}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="booking-actions">
                  {getNextStatus(booking.status) && (
                    <button
                      onClick={() => updateBookingStatus(booking.bookingId, getNextStatus(booking.status))}
                      className="action-btn primary"
                    >
                      {getActionButtonText(booking.status)}
                    </button>
                  )}
                  <button className="action-btn secondary">
                    Liên hệ khách hàng
                  </button>
                  {booking.status?.toLowerCase() === 'completed' && (
                    <button className="action-btn secondary">
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Calendar className="empty-icon" />
            <p>Không có booking nào</p>
            <p className="empty-subtitle">
              {statusFilter !== 'all' 
                ? `Không có booking nào với trạng thái "${statusFilter}"`
                : 'Chưa có booking nào được phân công'
              }
            </p>
          </div>
        )}
        {/* Pagination */}
        {bookingStats.totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setBookingPage(prev => prev - 1)}
              disabled={!bookingStats.hasPrevious || bookingLoading}
              className="pagination-btn"
            >
              Trang trước
            </button>
            
            <span className="pagination-info">
              Trang {bookingPage} / {bookingStats.totalPages}
            </span>
            
            <button 
              onClick={() => setBookingPage(prev => prev + 1)}
              disabled={!bookingStats.hasNext || bookingLoading}
              className="pagination-btn"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <RefreshCw className="loading-icon animate-spin" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <XCircle className="error-icon" />
          <p>Có lỗi xảy ra: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="dashboard-title">Trang chủ kỹ thuật viên</h1>
              <p className="dashboard-subtitle">
                Xin chào, {technicianData?.fullName || 'Kỹ thuật viên'}!
              </p>
            </div>
            <div className="header-profile">
              <div className="header-date">
                <p className="date-label">Hôm nay</p>
                <p className="date-value">{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
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

      <style jsx>{`
        .loading-state, .error-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
          color: #6b7280;
        }

        .loading-icon, .error-icon, .empty-icon {
          width: 3rem;
          height: 3rem;
          margin-bottom: 1rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bookings-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-filter {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .refresh-icon {
          width: 1rem;
          height: 1rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding: 1rem;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .pagination-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: 500;
          color: #374151;
        }

        .retry-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .empty-subtitle {
          font-size: 0.875rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default TechnicianDashboard;