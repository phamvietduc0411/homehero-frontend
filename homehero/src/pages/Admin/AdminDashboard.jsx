import React, { useState } from 'react';
import '../../styles/Admin/AdminDashboard.css';
import BookingManagement from './BookingManagement';
import TechniciansManagement from './TechniciansManagement';
import UsersManagement from './UsersManagement';

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Real data aggregated from Bookings, Technicians, Users
  const dashboardStats = {
    bookings: {
      total: 6,
      completed: 1,
      pending: 2,
      confirmed: 1,
      inProgress: 1,
      cancelled: 1
    },
    technicians: {
      total: 5,
      active: 4,
      inactive: 1,
      avgRating: 4.6,
      totalJobs: 669
    },
    users: {
      total: 5,
      active: 4,
      inactive: 1,
      vipCustomers: 2,
      avgRating: 4.3
    },
    revenue: {
      today: '1,830,000 VND',
      thisMonth: '15,250,000 VND',
      totalRevenue: '186,450,000 VND',
      avgOrderValue: '310,750 VND'
    }
  };

  // Monthly revenue data (sample realistic data)
  const monthlyRevenue = [
    { month: 'Jan 2024', revenue: 12500000, bookings: 45, growth: '+12%' },
    { month: 'Feb 2024', revenue: 15200000, bookings: 52, growth: '+21%' },
    { month: 'Mar 2024', revenue: 18300000, bookings: 61, growth: '+20%' },
    { month: 'Apr 2024', revenue: 16800000, bookings: 58, growth: '-8%' },
    { month: 'May 2024', revenue: 21400000, bookings: 72, growth: '+27%' },
    { month: 'Jun 2024', revenue: 19600000, bookings: 67, growth: '-8%' },
    { month: 'Jul 2024', revenue: 23800000, bookings: 78, growth: '+21%' },
    { month: 'Aug 2024', revenue: 22100000, bookings: 74, growth: '-7%' },
    { month: 'Sep 2024', revenue: 25300000, bookings: 84, growth: '+14%' },
    { month: 'Oct 2024', revenue: 27600000, bookings: 91, growth: '+9%' },
    { month: 'Nov 2024', revenue: 24900000, bookings: 83, growth: '-10%' },
    { month: 'Dec 2024', revenue: 28750000, bookings: 95, growth: '+15%' }
  ];

  // Real-time dashboard stats
  const statsData = [
    {
      title: "TODAY'S REVENUE",
      value: dashboardStats.revenue.today,
      change: "+18% since yesterday",
      changeType: "positive",
      icon: "💰",
      subtitle: "From active bookings"
    },
    {
      title: "ACTIVE BOOKINGS",
      value: `${dashboardStats.bookings.pending + dashboardStats.bookings.confirmed + dashboardStats.bookings.inProgress}`,
      change: `${dashboardStats.bookings.total} total bookings`,
      changeType: "neutral",
      icon: "📅",
      subtitle: "Pending, Confirmed, In Progress"
    },
    {
      title: "ACTIVE TECHNICIANS",
      value: `${dashboardStats.technicians.active}`,
      change: `${dashboardStats.technicians.avgRating}⭐ avg rating`,
      changeType: "positive",
      icon: "👨‍🔧",
      subtitle: `${dashboardStats.technicians.totalJobs} total jobs completed`
    },
    {
      title: "CUSTOMER SATISFACTION",
      value: `${dashboardStats.users.avgRating}⭐`,
      change: `${dashboardStats.users.vipCustomers} VIP customers`,
      changeType: "positive",
      icon: "😊",
      subtitle: `${dashboardStats.users.active} active users`
    }
  ];

  // Service popularity data
  const serviceStats = [
    { name: 'Plumbing Services', percentage: 28, revenue: '52,340,000 VND', color: '#4285f4' },
    { name: 'Electrical Work', percentage: 24, revenue: '44,780,000 VND', color: '#34a853' },
    { name: 'AC & Appliance Repair', percentage: 22, revenue: '41,020,000 VND', color: '#fbbc04' },
    { name: 'Furniture Assembly', percentage: 15, revenue: '27,970,000 VND', color: '#ea4335' },
    { name: 'General Maintenance', percentage: 11, revenue: '20,340,000 VND', color: '#9aa0a6' }
  ];

  // City performance data
  const cityPerformance = [
    { city: 'Ho Chi Minh City', revenue: '125,600,000 VND', bookings: 412, growth: '+15%', flag: '🏙️' },
    { city: 'Hanoi', revenue: '38,200,000 VND', bookings: 128, growth: '+8%', flag: '🏛️' },
    { city: 'Da Nang', revenue: '22,650,000 VND', bookings: 76, growth: '+12%', flag: '🏖️' }
  ];

  const menuItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Booking Management', icon: '📅', active: false },
    { name: 'Technicians Management', icon: '👨‍🔧', active: false },
    { name: 'Users Management', icon: '👥', active: false },
    { name: 'Profile', icon: '👤', active: false, isAccount: true }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img 
      src="https://res.cloudinary.com/dsq0mei34/image/upload/v1749056947/z6661153873542_d6e54c1859ad70b70e7aeec88c6ae88a_bieazp.jpg" 
      alt="Home Hero Logo" 
      className="logo-icon"
      style={{
        width: '24px',
        height: '24px',
        objectFit: 'contain'
      }}
    />
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
        {activeMenu === 'Booking Management' ? (
          <BookingManagement />
        ) : activeMenu === 'Technicians Management' ? (
          <TechniciansManagement />
        ) : activeMenu === 'Users Management' ? (
          <UsersManagement />
        ) : (
          <>
            {/* Header */}
            <header className="dashboard-header">
              <div className="header-left">
                <div className="breadcrumb">
                  <span>Pages</span>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-current">{activeMenu}</span>
                </div>
                <h1 className="page-title">Home Hero Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back! Here's what's happening with your business today.</p>
              </div>
              
              <div className="header-right">
                <div className="search-box">
                  <input type="text" placeholder="Search anything..." />
                  <span className="search-icon">🔍</span>
                </div>
                <div className="header-actions">
                  <div className="notification-badge">
                    <span className="header-icon">🔔</span>
                    <span className="badge">3</span>
                  </div>
                  <button className="profile-btn">
                    <span className="user-icon">👤</span>
                    Admin
                  </button>
                </div>
              </div>
            </header>

            {/* Key Stats Cards */}
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-content">
                    <div className="stat-header">
                      <div className="stat-info">
                        <h3 className="stat-title">{stat.title}</h3>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-subtitle">{stat.subtitle}</div>
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
              <div className="chart-card revenue-overview">
                <div className="chart-header">
                  <h3>Revenue Overview - {getCurrentMonth()}</h3>
                  <div className="chart-summary">
                    <span className="revenue-amount">{dashboardStats.revenue.thisMonth}</span>
                    <span className="growth-indicator positive">📈 +24% from last month</span>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="revenue-chart">
                    <svg viewBox="0 0 800 300" className="line-chart">
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4285f4" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#4285f4" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      <g className="grid-lines">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <line key={i} x1="60" y1={50 + i * 40} x2="750" y2={50 + i * 40} stroke="#f0f0f0" strokeWidth="1"/>
                        ))}
                      </g>
                      
                      {/* Revenue line */}
                      <polyline
                        fill="none"
                        stroke="#4285f4"
                        strokeWidth="3"
                        points="80,220 140,200 200,170 260,180 320,140 380,150 440,110 500,120 560,100 620,90 680,110 740,80"
                      />
                      
                      {/* Fill area */}
                      <polygon
                        fill="url(#revenueGradient)"
                        points="80,220 140,200 200,170 260,180 320,140 380,150 440,110 500,120 560,100 620,90 680,110 740,80 740,250 80,250"
                      />
                      
                      {/* Data points */}
                      {monthlyRevenue.slice(-6).map((month, index) => (
                        <circle key={index} cx={80 + index * 110} cy={220 - (month.revenue / 1000000) * 6} r="4" fill="#4285f4"/>
                      ))}
                      
                      {/* Month labels */}
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                        <text key={index} x={80 + index * 110} y={270} textAnchor="middle" fontSize="12" fill="#666">
                          {month}
                        </text>
                      ))}
                    </svg>
                    
                    <div className="chart-tooltip">
                      <div className="tooltip-content">
                        <strong>December 2024</strong><br />
                        Revenue: 28.75M VND<br />
                        Bookings: 95<br />
                        Growth: +15%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card booking-status">
                <div className="chart-header">
                  <h3>Booking Status</h3>
                  <p className="chart-subtitle">Current bookings breakdown</p>
                </div>
                <div className="booking-stats-container">
                  <div className="booking-donut">
                    <svg viewBox="0 0 200 200" className="donut-chart">
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#e2e8f0" strokeWidth="20"/>
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#22c55e" strokeWidth="20" 
                              strokeDasharray={`${(dashboardStats.bookings.completed / dashboardStats.bookings.total) * 440} 440`}
                              strokeDashoffset="0" transform="rotate(-90 100 100)"/>
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="20" 
                              strokeDasharray={`${(dashboardStats.bookings.pending / dashboardStats.bookings.total) * 440} 440`}
                              strokeDashoffset={`-${(dashboardStats.bookings.completed / dashboardStats.bookings.total) * 440}`} 
                              transform="rotate(-90 100 100)"/>
                      <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
                        {dashboardStats.bookings.total}
                      </text>
                      <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                        Total Bookings
                      </text>
                    </svg>
                  </div>
                  <div className="booking-legend">
                    <div className="legend-item">
                      <span className="legend-color completed"></span>
                      <span className="legend-text">Completed ({dashboardStats.bookings.completed})</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color pending"></span>
                      <span className="legend-text">Pending ({dashboardStats.bookings.pending})</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color confirmed"></span>
                      <span className="legend-text">Confirmed ({dashboardStats.bookings.confirmed})</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color inprogress"></span>
                      <span className="legend-text">In Progress ({dashboardStats.bookings.inProgress})</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color cancelled"></span>
                      <span className="legend-text">Cancelled ({dashboardStats.bookings.cancelled})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Analytics Section */}
            <div className="analytics-section">
              <div className="chart-card service-performance">
                <div className="chart-header">
                  <h3>Service Performance</h3>
                  <p className="chart-subtitle">Revenue by service category</p>
                </div>
                <div className="service-list">
                  {serviceStats.map((service, index) => (
                    <div key={index} className="service-item">
                      <div className="service-info">
                        <div className="service-name">{service.name}</div>
                        <div className="service-revenue">{service.revenue}</div>
                      </div>
                      <div className="service-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${service.percentage}%`, 
                              backgroundColor: service.color 
                            }}
                          ></div>
                        </div>
                        <span className="service-percentage">{service.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card city-performance">
                <div className="chart-header">
                  <h3>City Performance</h3>
                  <p className="chart-subtitle">Revenue and bookings by location</p>
                </div>
                <div className="city-list">
                  {cityPerformance.map((city, index) => (
                    <div key={index} className="city-item">
                      <div className="city-icon">{city.flag}</div>
                      <div className="city-details">
                        <div className="city-name">{city.city}</div>
                        <div className="city-metrics">
                          <span className="city-revenue">{city.revenue}</span>
                          <span className="city-bookings">{city.bookings} bookings</span>
                        </div>
                      </div>
                      <div className={`city-growth ${city.growth.includes('+') ? 'positive' : 'negative'}`}>
                        {city.growth}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card quick-stats">
                <div className="chart-header">
                  <h3>Quick Stats</h3>
                  <p className="chart-subtitle">Key business metrics</p>
                </div>
                <div className="quick-stats-grid">
                  <div className="quick-stat">
                    <div className="quick-stat-icon">💎</div>
                    <div className="quick-stat-info">
                      <div className="quick-stat-value">{dashboardStats.users.vipCustomers}</div>
                      <div className="quick-stat-label">VIP Customers</div>
                    </div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-icon">⭐</div>
                    <div className="quick-stat-info">
                      <div className="quick-stat-value">{dashboardStats.technicians.avgRating}</div>
                      <div className="quick-stat-label">Avg Tech Rating</div>
                    </div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-icon">💰</div>
                    <div className="quick-stat-info">
                      <div className="quick-stat-value">{dashboardStats.revenue.avgOrderValue}</div>
                      <div className="quick-stat-label">Avg Order Value</div>
                    </div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-icon">📈</div>
                    <div className="quick-stat-info">
                      <div className="quick-stat-value">{dashboardStats.revenue.totalRevenue}</div>
                      <div className="quick-stat-label">Total Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;