import React, { useState } from 'react';
import '../../styles/Admin/AdminDashboard.css';

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Sample data - bạn có thể thay đổi sau
  const statsData = [
    {
      title: "TODAY'S MONEY",
      value: "$53,000",
      change: "+55% since yesterday",
      changeType: "positive",
      icon: "💰"
    },
    {
      title: "TODAY'S USERS",
      value: "2,300",
      change: "+3% since last week",
      changeType: "positive",
      icon: "👥"
    },
    {
      title: "NEW CLIENTS",
      value: "+3,462",
      change: "-2% since last quarter",
      changeType: "negative",
      icon: "📈"
    },
    {
      title: "SALES",
      value: "$103,430",
      change: "+5% than last month",
      changeType: "positive",
      icon: "🛒"
    }
  ];

  const menuItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Tables', icon: '📋', active: false },
    { name: 'Billing', icon: '💳', active: false },
    { name: 'Virtual Reality', icon: '🥽', active: false },
    { name: 'RTL', icon: '🌐', active: false },
    { name: 'Profile', icon: '👤', active: false, isAccount: true }
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Home Hero Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuItems.filter(item => !item.isAccount).map((item, index) => (
              <div 
                key={index}
                className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.name)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">ACCOUNT PAGES</div>
            {menuItems.filter(item => item.isAccount).map((item, index) => (
              <div 
                key={index}
                className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.name)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="breadcrumb">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Dashboard</span>
          </div>
          <h1 className="page-title">Dashboard</h1>
          
          <div className="header-right">
            <div className="search-box">
              <input type="text" placeholder="Type here..." />
              <span className="search-icon">🔍</span>
            </div>
            <button className="sign-in-btn">
              <span className="user-icon">👤</span>
              Sign In
            </button>
            <div className="header-icons">
              <span className="header-icon">⚙️</span>
              <span className="header-icon">🔔</span>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-info">
                    <h3 className="stat-title">{stat.title}</h3>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                  <div className="stat-icon">{stat.icon}</div>
                </div>
                <div className={`stat-change ${stat.changeType}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card sales-overview">
            <div className="chart-header">
              <h3>Sales Overview</h3>
              <p className="chart-subtitle">🔺 4% more in 2021</p>
            </div>
            <div className="chart-container">
              {/* Placeholder for chart - có thể dùng chart library sau */}
              <div className="chart-placeholder">
                <svg viewBox="0 0 400 200" className="line-chart">
                  <polyline
                    fill="none"
                    stroke="#5b73e8"
                    strokeWidth="3"
                    points="0,180 50,160 100,120 150,80 200,100 250,60 300,40 350,70 400,50"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5b73e8" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#5b73e8" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                  <polygon
                    fill="url(#gradient)"
                    points="0,180 50,160 100,120 150,80 200,100 250,60 300,40 350,70 400,50 400,200 0,200"
                  />
                </svg>
                <div className="chart-tooltip">
                  <div className="tooltip-content">
                    <strong>Apr</strong>
                    <br />
                    Mobile apps: 50
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card get-started">
            <div className="get-started-content">
              <div className="get-started-visual">
                <div className="floating-elements">
                  <div className="element sphere"></div>
                  <div className="element cube"></div>
                  <div className="element cylinder"></div>
                </div>
              </div>
              <div className="get-started-text">
                <h3>Get started with Home Hero</h3>
                <p>There's nothing I really wanted to do in life that I wasn't able to get good at.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="chart-card">
            <h3>Sales by Country</h3>
            <div className="countries-list">
              <div className="country-item">
                <span className="country-flag">🇺🇸</span>
                <span className="country-name">United States</span>
                <span className="country-sales">$2500</span>
              </div>
              <div className="country-item">
                <span className="country-flag">🇩🇪</span>
                <span className="country-name">Germany</span>
                <span className="country-sales">$3900</span>
              </div>
              <div className="country-item">
                <span className="country-flag">🇬🇧</span>
                <span className="country-name">Great Britain</span>
                <span className="country-sales">$1400</span>
              </div>
              <div className="country-item">
                <span className="country-flag">🇧🇷</span>
                <span className="country-name">Brasil</span>
                <span className="country-sales">$562</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Categories</h3>
            <div className="categories-list">
              <div className="category-item">
                <span className="category-icon">📱</span>
                <span className="category-name">Mobile App</span>
                <span className="category-percentage">25%</span>
              </div>
              <div className="category-item">
                <span className="category-icon">💻</span>
                <span className="category-name">Website</span>
                <span className="category-percentage">45%</span>
              </div>
              <div className="category-item">
                <span className="category-icon">🎮</span>
                <span className="category-name">Games</span>
                <span className="category-percentage">30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;