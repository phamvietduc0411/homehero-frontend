import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserSidebarMenu from '../../components/User/UserSidebarMenu';
import ProductStore from '../User/ProductStore';

import '../../styles/User/UserDashboard.css';
import Payment from './Payment';
import BookingFlowManager from '../../styles/User/BookingFlowManagement';
import BookingTracking from './BookingTracking';
import RepairSchedule from '../User/RepairSchedule';

const DashboardHome = () => (
  <div className="page-content">
    <div className="page-header">
      <div className="breadcrumb">
        <span>Pages</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Trang chủ</span>
      </div>
      <h1 className="page-title">🏠 Dashboard khách hàng</h1>
      <p className="page-subtitle">
        Chào mừng bạn quay trở lại! Đây là tổng quan về tài khoản của bạn.
      </p>
    </div>
    
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>DỊCH VỤ ĐÃ SỬ DỤNG</h3>
            <div className="stat-value">5</div>
            <div className="stat-subtitle">Lần sửa chữa hoàn thành</div>
          </div>
          <div className="stat-icon">🔧</div>
        </div>
        <div className="stat-change positive">+2 từ tháng trước</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>ĐÁNH GIÁ TRUNG BÌNH</h3>
            <div className="stat-value">4.8⭐</div>
            <div className="stat-subtitle">Từ 5 lần sử dụng dịch vụ</div>
          </div>
          <div className="stat-icon">⭐</div>
        </div>
        <div className="stat-change positive">Rất hài lòng</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>TIẾT KIỆM</h3>
            <div className="stat-value">2.5M ₫</div>
            <div className="stat-subtitle">So với sửa chữa tại shop</div>
          </div>
          <div className="stat-icon">💰</div>
        </div>
        <div className="stat-change positive">+15% hiệu quả</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>LỊCH HẸN SẮP TỚI</h3>
            <div className="stat-value">1</div>
            <div className="stat-subtitle">Sửa điều hòa - 25/12</div>
          </div>
          <div className="stat-icon">📅</div>
        </div>
        <div className="stat-change neutral">Trong 3 ngày tới</div>
      </div>
    </div>

    <div className="recent-activity">
      <div className="activity-card">
        <div className="activity-header">
          <h3>🕒 Hoạt động gần đây</h3>
          <button className="view-all-btn">Xem tất cả</button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon completed">✓</div>
            <div className="activity-details">
              <div className="activity-title">Sửa máy giặt Samsung</div>
              <div className="activity-date">15/12/2024 - Hoàn thành</div>
            </div>
            <div className="activity-status completed">Đã xong</div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon pending">⏳</div>
            <div className="activity-details">
              <div className="activity-title">Bảo trì điều hòa Daikin</div>
              <div className="activity-date">25/12/2024 - Đã đặt lịch</div>
            </div>
            <div className="activity-status pending">Chờ xử lý</div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon completed">✓</div>
            <div className="activity-details">
              <div className="activity-title">Sửa tủ lạnh LG</div>
              <div className="activity-date">08/12/2024 - Hoàn thành</div>
            </div>
            <div className="activity-status completed">Đã xong</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// const BookingPage = () => (
//   <div className="page-content">
//     <div className="page-header">
//       <div className="breadcrumb">
//         <span>Pages</span>
//         <span className="breadcrumb-separator">/</span>
//         <span className="breadcrumb-current">Đặt lịch sửa chữa</span>
//       </div>
//       <h1 className="page-title">📅 Đặt lịch sửa chữa</h1>
//       <p className="page-subtitle">
//         Chọn dịch vụ và đặt lịch hẹn với kỹ thuật viên chuyên nghiệp
//       </p>
//     </div>
    
//     <div className="services-grid">
//       <div className="service-card">
//         <div className="service-icon">🔌</div>
//         <h3>Sửa chữa điện</h3>
//         <p>Sửa chữa các thiết bị điện, đường dây điện trong nhà</p>
//         <div className="service-price">Từ 200,000 ₫</div>
//         <button className="book-btn">Đặt lịch ngay</button>
//       </div>
      
//       <div className="service-card">
//         <div className="service-icon">🚿</div>
//         <h3>Sửa chữa nước</h3>
//         <p>Sửa chữa hệ thống nước, vòi sen, bồn rửa</p>
//         <div className="service-price">Từ 150,000 ₫</div>
//         <button className="book-btn">Đặt lịch ngay</button>
//       </div>
      
//       <div className="service-card">
//         <div className="service-icon">❄️</div>
//         <h3>Sửa chữa điều hòa</h3>
//         <p>Bảo trì, sửa chữa điều hòa không khí</p>
//         <div className="service-price">Từ 300,000 ₫</div>
//         <button className="book-btn">Đặt lịch ngay</button>
//       </div>
      
//       <div className="service-card">
//         <div className="service-icon">🧺</div>
//         <h3>Sửa máy giặt</h3>
//         <p>Sửa chữa, bảo trì máy giặt các loại</p>
//         <div className="service-price">Từ 250,000 ₫</div>
//         <button className="book-btn">Đặt lịch ngay</button>
//       </div>
      
//       <div className="service-card">
//         <div className="service-icon">🧊</div>
//         <h3>Sửa tủ lạnh</h3>
//         <p>Sửa chữa tủ lạnh, tủ đông các hãng</p>
//         <div className="service-price">Từ 280,000 ₫</div>
//         <button className="book-btn">Đặt lịch ngay</button>
//       </div>
      
//       <div className="service-card">
//         <div className="service-icon">📺</div>
//         <h3>Sửa TV & âm thanh</h3>
//         <p>Sửa chữa TV, dàn âm thanh, loa</p>
//         <div className="service-price">Từ 200,000 ₫</div>
//         <button className="book-btn">Đặt lịch ngay</button>
//       </div>
//     </div>
//   </div>
// );

const OrderHistory = () => (
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
    
    <div className="orders-table">
      <div className="table-header">
        <h3>Đơn hàng gần đây</h3>
        <div className="table-actions">
          <select className="filter-select">
            <option>Tất cả trạng thái</option>
            <option>Hoàn thành</option>
            <option>Đang xử lý</option>
            <option>Đã hủy</option>
          </select>
        </div>
      </div>
      
      <div className="orders-list">
        <div className="order-item">
          <div className="order-info">
            <div className="order-id">#DH001</div>
            <div className="order-service">Sửa máy giặt Samsung</div>
            <div className="order-date">15/12/2024</div>
          </div>
          <div className="order-technician">
            <div className="tech-name">Nguyễn Văn An</div>
            <div className="tech-rating">⭐ 4.9</div>
          </div>
          <div className="order-price">350,000 ₫</div>
          <div className="order-status completed">Hoàn thành</div>
          <div className="order-actions">
            <button className="action-btn">Chi tiết</button>
            <button className="action-btn">Đánh giá</button>
          </div>
        </div>
        
        <div className="order-item">
          <div className="order-info">
            <div className="order-id">#DH002</div>
            <div className="order-service">Bảo trì điều hòa Daikin</div>
            <div className="order-date">25/12/2024</div>
          </div>
          <div className="order-technician">
            <div className="tech-name">Trần Văn Bình</div>
            <div className="tech-rating">⭐ 4.8</div>
          </div>
          <div className="order-price">280,000 ₫</div>
          <div className="order-status pending">Đã đặt lịch</div>
          <div className="order-actions">
            <button className="action-btn">Chi tiết</button>
            <button className="action-btn">Hủy lịch</button>
          </div>
        </div>
        
        <div className="order-item">
          <div className="order-info">
            <div className="order-id">#DH003</div>
            <div className="order-service">Sửa tủ lạnh LG</div>
            <div className="order-date">08/12/2024</div>
          </div>
          <div className="order-technician">
            <div className="tech-name">Lê Văn Cường</div>
            <div className="tech-rating">⭐ 5.0</div>
          </div>
          <div className="order-price">420,000 ₫</div>
          <div className="order-status completed">Hoàn thành</div>
          <div className="order-actions">
            <button className="action-btn">Chi tiết</button>
            <button className="action-btn">Đặt lại</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PlaceholderPage = ({ title, description, icon }) => (
  <div className="page-content">
    <div className="page-header">
      <div className="breadcrumb">
        <span>Pages</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{title}</span>
      </div>
      <h1 className="page-title">{icon} {title}</h1>
      <p className="page-subtitle">{description}</p>
    </div>
    
    <div className="placeholder-content">
      <div className="placeholder-icon">{icon}</div>
      <h3>Trang này đang được phát triển</h3>
      <p>Tính năng sẽ được bổ sung trong phiên bản tiếp theo...</p>
    </div>
  </div>
);

const UserDashboard = () => {
  // ✅ State quản lý menu active
  const [activeMenu, setActiveMenu] = useState('Trang chủ');
  const [currentView, setCurrentView] = useState('home');
  const [bookingData, setBookingData] = useState(null); // State để lưu booking data

const handleNavigateToTracking = (bookingData) => {
  setBookingData(bookingData);
  setCurrentView('tracking');
  setActiveMenu('Theo dõi đơn hàng'); // Đổi menu active
};


  // ✅ Function render content dựa trên menu được chọn
  const renderContent = () => {
    switch (activeMenu) {
      case 'Trang chủ':
        return <DashboardHome />;
      case 'Đặt lịch sửa chữa':
        return <BookingFlowManager />;
      case 'Đặt mua sản phẩm':
        return <ProductStore />;
      case 'Lịch sử đơn hàng':
        return <OrderHistory />;
      case 'Đặt lịch sửa chữa':
      // return <RepairSchedule onNavigateToTracking={handleNavigateToTracking} />;
      // case 'Theo dõi đơn hàng':
      // return <BookingTracking initialBookingData={bookingData} />;
      case 'Thông báo':
        return <PlaceholderPage 
          title="Thông báo" 
          description="Xem các thông báo mới từ hệ thống"
          icon="🔔"
        />;
      case 'Hồ sơ cá nhân':
        return <PlaceholderPage 
          title="Hồ sơ cá nhân" 
          description="Quản lý thông tin tài khoản của bạn"
          icon="👤"
        />;
      case 'Thanh toán/Hóa đơn':
        return <Payment 
          title="Thanh toán/Hóa đơn" 
          description="Quản lý phương thức thanh toán và xem hóa đơn"
          icon="💳"
        />;
      case 'Hỗ trợ / Liên hệ':
        return <PlaceholderPage 
          title="Hỗ trợ / Liên hệ" 
          description="Liên hệ với đội ngũ hỗ trợ khách hàng"
          icon="🆘"
        />;
      case 'Calendar':
        return <PlaceholderPage 
          title="Calendar" 
          description="Xem lịch hẹn và các dịch vụ đã đặt"
          icon="📅"
        />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <div className="user-sidebar">
        <div className="user-sidebar-header">
          <div className="logo">
            <img 
              src="https://res.cloudinary.com/dsq0mei34/image/upload/v1749056947/z6661153873542_d6e54c1859ad70b70e7aeec88c6ae88a_bieazp.jpg" 
              alt="Home Hero Logo" 
              className="logo-icon"
            />
            <span className="logo-text">HomeHero</span>
          </div>
        </div>
        
        {/* ✅ Truyền props đúng cách */}
        <UserSidebarMenu 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
        />
      </div>

      {/* Main Content */}
      <div className="user-main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDashboard;