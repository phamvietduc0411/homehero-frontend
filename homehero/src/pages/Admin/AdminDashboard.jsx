import React, { useState, useEffect } from 'react';
import '../../styles/Admin/AdminDashboard.css';
import BookingManagement from './BookingManagement';
import TechniciansManagement from './TechniciansManagement';
import UsersManagement from './UsersManagement';


function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Dashboard';

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/statistics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setDashboardData(result.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch dashboard data: ${err.message}`);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === 'Dashboard') {
      fetchDashboardStats();
    }
  }, [activeMenu]);

  // Get stats data for cards
  const getStatsData = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "TODAY'S REVENUE",
        value: dashboardData.revenue.todayFormatted,
        change: dashboardData.revenue.todayGrowthPercentage >= 0 
          ? `+${dashboardData.revenue.todayGrowthPercentage}% since yesterday`
          : `${dashboardData.revenue.todayGrowthPercentage}% since yesterday`,
        changeType: dashboardData.revenue.todayGrowthPercentage >= 0 ? "positive" : "negative",
        icon: "💰",
        subtitle: "From completed bookings"
      },
      {
        title: "ACTIVE BOOKINGS",
        value: `${dashboardData.bookings.pending + dashboardData.bookings.confirmed + dashboardData.bookings.inProgress}`,
        change: `${dashboardData.bookings.total} total bookings`,
        changeType: "neutral",
        icon: "📅",
        subtitle: "Pending, Confirmed, In Progress"
      },
      {
        title: "ACTIVE TECHNICIANS",
        value: `${dashboardData.technicians.active}`,
        change: `${dashboardData.technicians.avgRating}⭐ avg rating`,
        changeType: "positive",
        icon: "👨‍🔧",
        subtitle: `${dashboardData.technicians.totalJobs} total jobs completed`
      },
      {
        title: "CUSTOMER SATISFACTION",
        value: `${dashboardData.users.avgRating}⭐`,
        change: `${dashboardData.users.vipCustomers} VIP customers`,
        changeType: "positive",
        icon: "😊",
        subtitle: `${dashboardData.users.active} active users`
      }
    ];
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Booking Management', icon: '📅', active: false },
    { name: 'Technicians Management', icon: '👨‍🔧', active: false },
    { name: 'Users Management', icon: '👥', active: false },
    { name: 'Profile', icon: '👤', active: false, isAccount: true }
  ];

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Generate chart points from monthly revenue data
  const generateChartPoints = () => {
    if (!dashboardData || !dashboardData.monthlyRevenue) return "80,220 140,220 200,220 260,220 320,220 380,220";
    
    const lastSixMonths = dashboardData.monthlyRevenue.slice(-6);
    const maxRevenue = Math.max(...lastSixMonths.map(m => m.revenue), 1);
    
    return lastSixMonths.map((month, index) => {
      const x = 80 + index * 110;
      const y = 220 - (month.revenue / maxRevenue) * 140; // Scale to chart height
      return `${x},${y}`;
    }).join(' ');
  };

  // Generate chart area points
  const generateAreaPoints = () => {
    const linePoints = generateChartPoints();
    return `${linePoints} 740,250 80,250`;
  };

  // Get last 6 months labels
  const getLastSixMonthsLabels = () => {
    if (!dashboardData || !dashboardData.monthlyRevenue) {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    }
    
    return dashboardData.monthlyRevenue.slice(-6).map(month => {
      const [monthName] = month.month.split(' ');
      return monthName.slice(0, 3);
    });
  };

  // Calculate booking chart segments
  const getBookingChartData = () => {
    if (!dashboardData) return [];
    
    const total = dashboardData.bookings.total || 1;
    const circumference = 440; // 2 * PI * radius (70)
    
    let offset = 0;
    const segments = [];
    
    // Completed
    const completedLength = (dashboardData.bookings.completed / total) * circumference;
    segments.push({
      color: '#22c55e',
      length: completedLength,
      offset: offset
    });
    offset += completedLength;
    
    // Pending
    const pendingLength = (dashboardData.bookings.pending / total) * circumference;
    segments.push({
      color: '#f59e0b',
      length: pendingLength,
      offset: offset
    });
    offset += pendingLength;
    
    // Confirmed
    const confirmedLength = (dashboardData.bookings.confirmed / total) * circumference;
    segments.push({
      color: '#3b82f6',
      length: confirmedLength,
      offset: offset
    });
    offset += confirmedLength;
    
    // In Progress
    const inProgressLength = (dashboardData.bookings.inProgress / total) * circumference;
    segments.push({
      color: '#8b5cf6',
      length: inProgressLength,
      offset: offset
    });
    
    return segments;
  };

  // Loading component
  if (loading && activeMenu === 'Dashboard') {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error && activeMenu === 'Dashboard') {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Error Loading Dashboard</h3>
            <p>{error}</p>
            <button onClick={() => {
              setError(null);
              fetchDashboardStats();
            }} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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

            {dashboardData && (
              <>
                {/* Key Stats Cards */}
                <div className="stats-grid">
                  {getStatsData().map((stat, index) => (
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
                        <span className="revenue-amount">{dashboardData.revenue.thisMonthFormatted}</span>
                        <span className={`growth-indicator ${dashboardData.revenue.monthGrowthPercentage >= 0 ? 'positive' : 'negative'}`}>
                          📈 {dashboardData.revenue.monthGrowthPercentage >= 0 ? '+' : ''}{dashboardData.revenue.monthGrowthPercentage}% from last month
                        </span>
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
                            points={generateChartPoints()}
                          />
                          
                          {/* Fill area */}
                          <polygon
                            fill="url(#revenueGradient)"
                            points={generateAreaPoints()}
                          />
                          
                          {/* Data points */}
                          {dashboardData.monthlyRevenue.slice(-6).map((month, index) => {
                            const maxRevenue = Math.max(...dashboardData.monthlyRevenue.slice(-6).map(m => m.revenue), 1);
                            const x = 80 + index * 110;
                            const y = 220 - (month.revenue / maxRevenue) * 140;
                            return (
                              <circle key={index} cx={x} cy={y} r="4" fill="#4285f4"/>
                            );
                          })}
                          
                          {/* Month labels */}
                          {getLastSixMonthsLabels().map((month, index) => (
                            <text key={index} x={80 + index * 110} y={270} textAnchor="middle" fontSize="12" fill="#666">
                              {month}
                            </text>
                          ))}
                        </svg>
                        
                        <div className="chart-tooltip">
                          <div className="tooltip-content">
                            <strong>{getCurrentMonth()}</strong><br />
                            Revenue: {dashboardData.revenue.thisMonthFormatted}<br />
                            Growth: {dashboardData.revenue.monthGrowthPercentage >= 0 ? '+' : ''}{dashboardData.revenue.monthGrowthPercentage}%
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
                          
                          {/* Render booking segments */}
                          {getBookingChartData().map((segment, index) => (
                            <circle 
                              key={index}
                              cx="100" 
                              cy="100" 
                              r="70" 
                              fill="none" 
                              stroke={segment.color} 
                              strokeWidth="20" 
                              strokeDasharray={`${segment.length} 440`}
                              strokeDashoffset={-segment.offset} 
                              transform="rotate(-90 100 100)"
                            />
                          ))}
                          
                          <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
                            {dashboardData.bookings.total}
                          </text>
                          <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                            Total Bookings
                          </text>
                        </svg>
                      </div>
                      <div className="booking-legend">
                        <div className="legend-item">
                          <span className="legend-color completed"></span>
                          <span className="legend-text">Completed ({dashboardData.bookings.completed})</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color pending"></span>
                          <span className="legend-text">Pending ({dashboardData.bookings.pending})</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color confirmed"></span>
                          <span className="legend-text">Confirmed ({dashboardData.bookings.confirmed})</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color inprogress"></span>
                          <span className="legend-text">In Progress ({dashboardData.bookings.inProgress})</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color cancelled"></span>
                          <span className="legend-text">Cancelled ({dashboardData.bookings.cancelled})</span>
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
                      {dashboardData.servicePerformance && dashboardData.servicePerformance.length > 0 ? (
                        dashboardData.servicePerformance.map((service, index) => (
                          <div key={index} className="service-item">
                            <div className="service-info">
                              <div className="service-name">{service.name}</div>
                              <div className="service-revenue">{service.revenueFormatted}</div>
                            </div>
                            <div className="service-progress">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ 
                                    width: `${service.percentage}%`, 
                                    backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                                  }}
                                ></div>
                              </div>
                              <span className="service-percentage">{service.percentage}%</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-data-message">
                          <p>📊 No service performance data available</p>
                          <p>Complete some bookings to see service statistics</p>
                        </div>
                      )}
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
                          <div className="quick-stat-value">{dashboardData.users.vipCustomers}</div>
                          <div className="quick-stat-label">VIP Customers</div>
                        </div>
                      </div>
                      <div className="quick-stat">
                        <div className="quick-stat-icon">⭐</div>
                        <div className="quick-stat-info">
                          <div className="quick-stat-value">{dashboardData.technicians.avgRating}</div>
                          <div className="quick-stat-label">Avg Tech Rating</div>
                        </div>
                      </div>
                      <div className="quick-stat">
                        <div className="quick-stat-icon">💰</div>
                        <div className="quick-stat-info">
                          <div className="quick-stat-value">{dashboardData.revenue.avgOrderValueFormatted}</div>
                          <div className="quick-stat-label">Avg Order Value</div>
                        </div>
                      </div>
                      <div className="quick-stat">
                        <div className="quick-stat-icon">📈</div>
                        <div className="quick-stat-info">
                          <div className="quick-stat-value">{dashboardData.revenue.totalRevenueFormatted}</div>
                          <div className="quick-stat-label">Total Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card monthly-summary">
                    <div className="chart-header">
                      <h3>Monthly Summary</h3>
                      <p className="chart-subtitle">Last 6 months performance</p>
                    </div>
                    <div className="monthly-list">
                      {dashboardData.monthlyRevenue.slice(-6).map((month, index) => (
                        <div key={index} className="monthly-item">
                          <div className="month-info">
                            <div className="month-name">{month.month}</div>
                            <div className="month-metrics">
                              <span className="month-revenue">{month.revenue.toLocaleString()} VND</span>
                              <span className="month-bookings">{month.bookings} bookings</span>
                            </div>
                          </div>
                          <div className={`month-growth ${month.growth.includes('+') ? 'positive' : month.growth.includes('-') ? 'negative' : 'neutral'}`}>
                            {month.growth}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Styling */}
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .error-message {
          text-align: center;
          padding: 30px;
          border: 1px solid #ff6b6b;
          border-radius: 8px;
          background: #ffe6e6;
          max-width: 500px;
        }

        .error-message h3 {
          color: #d63031;
          margin-bottom: 10px;
        }

        .error-message p {
          color: #636e72;
          margin-bottom: 20px;
        }

        .retry-btn {
          background: #0984e3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .retry-btn:hover {
          background: #0b7dda;
        }

        .no-data-message {
          text-align: center;
          padding: 30px;
          color: #666;
        }

        .no-data-message p {
          margin: 10px 0;
        }

        .monthly-summary {
          min-height: 300px;
        }

        .monthly-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .monthly-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .month-info {
          display: flex;
          flex-direction: column;
        }

        .month-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .month-metrics {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: #666;
        }

        .month-revenue {
          font-weight: 500;
        }

        .month-growth {
          font-weight: 600;
          font-size: 14px;
        }

        .month-growth.positive { color: #28a745; }
        .month-growth.negative { color: #dc3545; }
        .month-growth.neutral { color: #666; }

        .growth-indicator.negative {
          color: #dc3545;
        }

        .stat-change.negative {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;