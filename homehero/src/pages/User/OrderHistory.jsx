import React, { useState, useEffect } from 'react';
import '../../styles/User/OrderHistory.css';

const OrderHistory = ({ userData }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchOrders = async (status = 'all', page = 1) => {
    try {
      setLoading(true);
      
      let url = `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking/user/${userData.id}/orders`;
      const params = new URLSearchParams();
      
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      if (status !== 'all') {
        params.append('status', status);
      }
      
      url += `?${params.toString()}`;
      
      console.log('Fetching URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.isSuccess) {
        setOrders(result.data.orders || []);
        setTotalCount(result.data.totalCount || 0);
        setTotalPages(result.data.totalPages || 1);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setOrders([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('UserData:', userData);
    if (userData?.id) {
      fetchOrders(selectedStatus, currentPage);
    } else {
      console.log('No userId found in userData');
      setLoading(false);
      setError('Không tìm thấy thông tin người dùng');
    }
  }, [userData, selectedStatus, currentPage]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'confirmed':
        return 'confirmed';
      case 'inprogress':
        return 'inprogress';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      case 'waitingtechnician':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Hoàn thành';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'inprogress':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      case 'waitingtechnician':
        return 'Chờ thợ';
      default:
        return status || 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return `${price.toLocaleString('vi-VN')} ₫`;
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div className="breadcrumb">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Lịch sử đơn hàng</span>
          </div>
          <h1 className="page-title">📰 Lịch sử đơn hàng</h1>
          <p className="page-subtitle">
            Xem lại các đơn hàng và dịch vụ đã sử dụng
          </p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div className="breadcrumb">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Lịch sử đơn hàng</span>
          </div>
          <h1 className="page-title">📰 Lịch sử đơn hàng</h1>
          <p className="page-subtitle">
            Xem lại các đơn hàng và dịch vụ đã sử dụng
          </p>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => fetchOrders(selectedStatus, currentPage)}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Lịch sử đơn hàng</span>
        </div>
        <h1 className="page-title">📰 Lịch sử đơn hàng</h1>
        <p className="page-subtitle">
          Xem lại các đơn hàng và dịch vụ đã sử dụng
        </p>
      </div>
      
      <div className="orders-container">
        <div className="orders-header">
          <div className="orders-summary">
            <h3>Đơn hàng của bạn</h3>
            <span className="orders-count">Tổng cộng: {totalCount} đơn hàng</span>
          </div>
          
          <div className="orders-filters">
            <select 
              className="filter-select" 
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="inprogress">Đang xử lý</option>
              <option value="pending">Chờ xử lý</option>
              <option value="cancelled">Đã hủy</option>
              <option value="waitingtechnician">Chờ thợ</option>
            </select>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📄</div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Bạn chưa có đơn hàng nào với trạng thái này</p>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.bookingId} className="order-item">
                  <div className="order-main-info">
                    <div className="order-header-row">
                      <div className="order-id">#{order.bookingCode || `BK${order.bookingId.toString().padStart(8, '0')}`}</div>
                      <div className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                    
                    <div className="order-details-row">
                      <div className="order-service">
                        <h4>{order.serviceName}</h4>
                        <p className="order-description">{order.problemDescription || 'Không có mô tả'}</p>
                      </div>
                      
                      <div className="order-technician">
                        <span className="tech-label">Thợ sửa chữa:</span>
                        <div className="tech-info">
                          <span className="tech-name">{order.technicianName}</span>
                          {order.technicianRating && (
                            <span className="tech-rating">⭐ {order.technicianRating.toFixed(1)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-meta-row">
                      <div className="order-date">
                        <span className="date-label">Ngày đặt:</span>
                        <span>{formatDate(order.bookingDate)}</span>
                      </div>
                      
                      <div className="order-time">
                        <span className="time-label">Giờ hẹn:</span>
                        <span>{order.preferredTimeSlot || 'Chưa xác định'}</span>
                      </div>
                      
                      <div className="order-address">
                        <span className="address-label">Địa chỉ:</span>
                        <span>{order.fullAddress}</span>
                      </div>
                      
                      <div className="order-price">
                        <span className="price-label">Tổng tiền:</span>
                        <span className="price-value">{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* ĐÃ XÓA TẤT CẢ CÁC NÚT ACTION */}
                  {/* <div className="order-actions">
                    <button className="action-btn view-details">Chi tiết</button>
                    {order.canRate && (
                      <button className="action-btn rate-service">Đánh giá</button>
                    )}
                    {order.canReorder && (
                      <button className="action-btn reorder">Đặt lại</button>
                    )}
                    {order.canCancel && (
                      <button className="action-btn cancel-order">Hủy đơn</button>
                    )}
                  </div> */}
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹ Trước
                </button>
                
                <div className="pagination-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;