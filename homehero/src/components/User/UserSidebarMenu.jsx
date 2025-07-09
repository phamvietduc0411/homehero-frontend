import React from 'react';
import '../../styles/User/UserSidebarMenu.css';

const UserSidebarMenu = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    // {
    //   icon: 'fas fa-tv',
    //   text: 'Trang chủ'
    // },
    {
      icon: 'fas fa-map-marker-alt',
      text: 'Hồ sơ cá nhân'
    },
    {
      icon: 'fas fa-chart-pie',
      text: 'Đặt lịch sửa chữa'
    },
    {
      icon: 'fas fa-shopping-cart',
      text: 'Đặt mua sản phẩm',
      isNew: true
    },
    {
      icon: 'fas fa-newspaper',
      text: 'Lịch sử đơn hàng'
    },
    {
      icon: 'fas fa-table',
      text: 'Thông báo'
    },
    
    {
      icon: 'fas fa-puzzle-piece',
      text: 'Thanh toán/Hóa đơn'
    },
    {
      icon: 'fas fa-chart-bar',
      text: 'Hỗ trợ / Liên hệ'
    },
    // {
    //   icon: 'fas fa-calendar-alt',
    //   text: 'Calendar'
    // }
  ];

  // const documentationItems = [
  //   {
  //     icon: 'fas fa-rocket',
  //     text: 'Getting started'
  //   },
  //   {
  //     icon: 'fas fa-atom',
  //     text: 'Foundation'
  //   },
  //   {
  //     icon: 'fas fa-puzzle-piece',
  //     text: 'Components'
  //   }
  // ];

  const handleMenuClick = (menuText) => {
    setActiveMenu(menuText);
  };

  const isActive = (menuText) => {
    return activeMenu === menuText;
  };

  return (
    <div className="sidebar-menu">
      {/* Navigation menu */}
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick(item.text);
              }}
              className={isActive(item.text) ? 'active' : ''}
            >
              <i className={item.icon}></i> 
              {item.text}
              {item.isNew && <span className="new-badge">NEW</span>}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-documentation">
        {/* Documentation section
        <h6>DOCUMENTATION</h6>
        <ul>
          {documentationItems.map((item, index) => (
            <li key={index}>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(item.text);
                }}
                className={isActive(item.text) ? 'active' : ''}
              >
                <i className={item.icon}></i> 
                {item.text}
              </a>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default UserSidebarMenu;