import React from 'react';
import '../../styles/User/UserSidebarMenu.css';

const UserSidebarMenu = () => {
  return (
    <div className="sidebar-menu">
      {" "}
      {/* Navigation menu */}
      <ul>
        <li>
          <a href="#">
            <i className="fas fa-tv"></i> Trang chủ
          </a>
        </li>

        <li>
          <a href="#">
            <i className="fas fa-chart-pie"></i> Đặt lịch sửa chữa
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-newspaper"></i> Lịch sử đơn hàng
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-table"></i>Thông báo
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-map-marker-alt"></i> Hồ sơ cá nhân
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-puzzle-piece"></i> Thanh toán/Hóa đơn
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-chart-bar"></i> Hỗ trợ / Liên hệ
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-calendar-alt"></i> Calendar
          </a>
        </li>
      </ul>
      <div className="sidebar-documentation">
        {" "}
        {/* Documentation section */}
        <h6>DOCUMENTATION</h6>
        <ul>
          <li>
            <a href="#">
              <i className="fas fa-rocket"></i> Getting started
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-atom"></i> Foundation
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-puzzle-piece"></i> Components
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSidebarMenu; 