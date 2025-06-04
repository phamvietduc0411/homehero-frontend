import React, { useState, useEffect } from 'react';
import '../../styles/Admin/UsersManagement.css';

const UsersManagement = () => {
  // Sample users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Minh Tran',
      email: 'minh.tran@email.com',
      phone: '0901234567',
      address: '123 Nguyen Hue Street, District 1, HCMC',
      status: 'Active',
      joinDate: '2023-05-15',
      avatar: '👤',
      totalBookings: 8,
      completedBookings: 6,
      cancelledBookings: 1,
      pendingBookings: 1,
      totalSpent: '2,150,000 VND',
      averageRating: 4.5,
      lastBooking: '2024-12-20',
      preferredServices: ['Plumbing', 'Electrical'],
      loyaltyLevel: 'Gold',
      bookingHistory: [
        {
          id: 1,
          serviceId: 1,
          serviceName: 'Leaky Faucet Repair',
          technicianName: 'Thanh Nguyen',
          date: '2024-12-20T09:00:00',
          status: 'Completed',
          price: '200,000 VND',
          rating: 5,
          feedback: 'Excellent service! Very professional and quick.'
        },
        {
          id: 6,
          serviceId: 5,
          serviceName: 'Outlet Repair',
          technicianName: 'Hung Tran',
          date: '2025-01-07T13:00:00',
          status: 'Pending',
          price: '180,000 VND',
          rating: null,
          feedback: null
        },
        {
          id: 12,
          serviceId: 3,
          serviceName: 'Ceiling Fan Installation',
          technicianName: 'Thanh Nguyen',
          date: '2024-11-15T14:30:00',
          status: 'Completed',
          price: '350,000 VND',
          rating: 4,
          feedback: 'Good work, but took longer than expected.'
        }
      ],
      feedbackHistory: [
        {
          bookingId: 1,
          serviceName: 'Leaky Faucet Repair',
          rating: 5,
          feedback: 'Excellent service! Very professional and quick.',
          date: '2024-12-20',
          technicianName: 'Thanh Nguyen'
        },
        {
          bookingId: 12,
          serviceName: 'Ceiling Fan Installation',
          rating: 4,
          feedback: 'Good work, but took longer than expected.',
          date: '2024-11-15',
          technicianName: 'Thanh Nguyen'
        }
      ]
    },
    {
      id: 2,
      name: 'Linh Nguyen',
      email: 'linh.nguyen@email.com',
      phone: '0912345678',
      address: '456 Le Loi Avenue, District 1, HCMC',
      status: 'Active',
      joinDate: '2023-08-22',
      avatar: '👩',
      totalBookings: 12,
      completedBookings: 10,
      cancelledBookings: 0,
      pendingBookings: 2,
      totalSpent: '3,800,000 VND',
      averageRating: 4.8,
      lastBooking: '2024-12-23',
      preferredServices: ['Electrical', 'Air Conditioning'],
      loyaltyLevel: 'Platinum',
      bookingHistory: [
        {
          id: 2,
          serviceId: 4,
          serviceName: 'Light Fixture Installation',
          technicianName: 'Hung Tran',
          date: '2024-12-23T14:00:00',
          status: 'Confirmed',
          price: '250,000 VND',
          rating: null,
          feedback: null
        },
        {
          id: 15,
          serviceId: 10,
          serviceName: 'AC Repair',
          technicianName: 'Cuong Do',
          date: '2024-12-01T10:00:00',
          status: 'Completed',
          price: '500,000 VND',
          rating: 5,
          feedback: 'Perfect service! AC working like new.'
        }
      ],
      feedbackHistory: [
        {
          bookingId: 15,
          serviceName: 'AC Repair',
          rating: 5,
          feedback: 'Perfect service! AC working like new.',
          date: '2024-12-01',
          technicianName: 'Cuong Do'
        }
      ]
    },
    {
      id: 3,
      name: 'Khanh Le',
      email: 'khanh.le@email.com',
      phone: '0923456789',
      address: '789 Vo Van Tan Street, District 3, HCMC',
      status: 'Active',
      joinDate: '2023-12-10',
      avatar: '👨',
      totalBookings: 3,
      completedBookings: 2,
      cancelledBookings: 0,
      pendingBookings: 1,
      totalSpent: '850,000 VND',
      averageRating: 4.0,
      lastBooking: '2025-01-05',
      preferredServices: ['Furniture Assembly'],
      loyaltyLevel: 'Silver',
      bookingHistory: [
        {
          id: 3,
          serviceId: 7,
          serviceName: 'Furniture Assembly',
          technicianName: 'Lan Vu',
          date: '2025-01-05T10:30:00',
          status: 'Pending',
          price: '350,000 VND',
          rating: null,
          feedback: null
        }
      ],
      feedbackHistory: []
    },
    {
      id: 4,
      name: 'Hoa Pham',
      email: 'hoa.pham@email.com',
      phone: '0934567890',
      address: '101 Bach Dang Street, Da Nang',
      status: 'Active',
      joinDate: '2022-03-08',
      avatar: '👩',
      totalBookings: 25,
      completedBookings: 22,
      cancelledBookings: 2,
      pendingBookings: 1,
      totalSpent: '8,750,000 VND',
      averageRating: 4.7,
      lastBooking: '2025-01-06',
      preferredServices: ['AC Maintenance', 'Appliance Repair'],
      loyaltyLevel: 'Diamond',
      bookingHistory: [
        {
          id: 4,
          serviceId: 10,
          serviceName: 'AC Maintenance',
          technicianName: 'Cuong Do',
          date: '2025-01-06T08:00:00',
          status: 'InProgress',
          price: '450,000 VND',
          rating: null,
          feedback: null
        }
      ],
      feedbackHistory: [
        {
          bookingId: 20,
          serviceName: 'Refrigerator Repair',
          rating: 5,
          feedback: 'Outstanding work! Fridge works perfectly now.',
          date: '2024-11-20',
          technicianName: 'Mai Hoang'
        }
      ]
    },
    {
      id: 5,
      name: 'Tuan Vo',
      email: 'tuan.vo@email.com',
      phone: '0945678901',
      address: '202 Tran Phu Street, Hanoi',
      status: 'Inactive',
      joinDate: '2023-02-14',
      avatar: '👨',
      totalBookings: 5,
      completedBookings: 3,
      cancelledBookings: 2,
      pendingBookings: 0,
      totalSpent: '1,200,000 VND',
      averageRating: 3.5,
      lastBooking: '2024-12-15',
      preferredServices: ['Appliance Repair'],
      loyaltyLevel: 'Bronze',
      bookingHistory: [
        {
          id: 5,
          serviceId: 13,
          serviceName: 'Refrigerator Repair',
          technicianName: 'Mai Hoang',
          date: '2024-12-15T16:00:00',
          status: 'Cancelled',
          price: '400,000 VND',
          rating: null,
          feedback: 'Had to cancel due to emergency.'
        }
      ],
      feedbackHistory: [
        {
          bookingId: 18,
          serviceName: 'Washing Machine Repair',
          rating: 3,
          feedback: 'Service was okay, but technician was late.',
          date: '2024-10-05',
          technicianName: 'Mai Hoang'
        }
      ]
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loyaltyFilter, setLoyaltyFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'history', 'feedback'
  const [selectedUser, setSelectedUser] = useState(null);

  const statusOptions = ['All', 'Active', 'Inactive'];
  const loyaltyLevels = ['All', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  // Filter and search logic
  useEffect(() => {
    let filtered = users;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    if (loyaltyFilter !== 'All') {
      filtered = filtered.filter(user => user.loyaltyLevel === loyaltyFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.id.toString().includes(searchTerm) ||
        user.preferredServices.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [statusFilter, loyaltyFilter, searchTerm, users]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  const handleViewHistory = (user) => {
    setSelectedUser(user);
    setModalType('history');
    setShowModal(true);
  };

  const handleViewFeedback = (user) => {
    setSelectedUser(user);
    setModalType('feedback');
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingStars = (rating) => {
    if (!rating) return 'No rating';
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('🌟');
    }
    return stars.join('');
  };

  const getLoyaltyBadgeClass = (level) => {
    const classes = {
      'Bronze': 'bronze',
      'Silver': 'silver', 
      'Gold': 'gold',
      'Platinum': 'platinum',
      'Diamond': 'diamond'
    };
    return classes[level] || 'bronze';
  };

  const getStatusBadgeClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="users-management">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-info">
          <h1>Users Management</h1>
          <p>Manage customers, view booking history and feedback</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="users-filters">
        <div className="filters-row">
          <div className="filters-left">
            <div className="filter-group">
              <label className="filter-label">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Loyalty Level</label>
              <select
                value={loyaltyFilter}
                onChange={(e) => setLoyaltyFilter(e.target.value)}
                className="filter-select"
              >
                {loyaltyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group search">
              <label className="filter-label">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, or preferred services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <div className="results-count">
            Showing {currentUsers.length} of {filteredUsers.length} customers
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-count">{users.filter(u => u.status === 'Active').length}</div>
          <div className="stats-badge active">Active Users</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{users.filter(u => u.status === 'Inactive').length}</div>
          <div className="stats-badge inactive">Inactive Users</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{users.reduce((sum, u) => sum + u.totalBookings, 0)}</div>
          <div className="stats-badge bookings">Total Bookings</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{Math.round(users.reduce((sum, u) => sum + u.averageRating, 0) / users.length * 10) / 10}</div>
          <div className="stats-badge rating">Avg Rating</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{users.filter(u => u.loyaltyLevel === 'Diamond' || u.loyaltyLevel === 'Platinum').length}</div>
          <div className="stats-badge vip">VIP Customers</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Bookings</th>
                <th>Loyalty</th>
                <th>Rating</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => {
                const statusClass = getStatusBadgeClass(user.status);
                const loyaltyClass = getLoyaltyBadgeClass(user.loyaltyLevel);
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.avatar}</div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: #{user.id}</div>
                          <div className="join-date">Joined: {formatDate(user.joinDate)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-email">{user.email}</div>
                        <div className="contact-phone">{user.phone}</div>
                        <div className="last-booking">Last: {formatDate(user.lastBooking)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="booking-stats">
                        <div className="total-bookings">Total: {user.totalBookings}</div>
                        <div className="booking-breakdown">
                          <span className="completed">✅ {user.completedBookings}</span>
                          <span className="pending">⏳ {user.pendingBookings}</span>
                          <span className="cancelled">❌ {user.cancelledBookings}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`loyalty-badge ${loyaltyClass}`}>
                        {user.loyaltyLevel}
                      </span>
                    </td>
                    <td>
                      <div className="rating-info">
                        <div className="rating-stars">{getRatingStars(user.averageRating)}</div>
                        <div className="rating-number">{user.averageRating}</div>
                      </div>
                    </td>
                    <td className="total-spent">
                      {user.totalSpent}
                    </td>
                    <td>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`status-select ${statusClass}`}
                      >
                        {statusOptions.slice(1).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleView(user)}
                          className="action-btn view"
                          title="View Profile"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleViewHistory(user)}
                          className="action-btn history"
                          title="Booking History"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleViewFeedback(user)}
                          className="action-btn feedback"
                          title="Feedback History"
                        >
                          💬
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-mobile">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
          <div className="pagination-desktop">
            <div className="pagination-info">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </div>
            <div>
              <nav className="pagination-nav">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn nav-btn"
                >
                  ❮
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn nav-btn"
                >
                  ❯
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h3 className="modal-title">
                {modalType === 'view' ? 'Customer Profile' : 
                 modalType === 'history' ? 'Booking History' : 
                 'Feedback History'}
              </h3>
              
              {modalType === 'view' && (
                <div className="profile-details">
                  <div className="profile-header">
                    <div className="profile-avatar">{selectedUser?.avatar}</div>
                    <div className="profile-info">
                      <h4>{selectedUser?.name}</h4>
                      <p className="profile-email">{selectedUser?.email}</p>
                      <span className={`loyalty-badge ${getLoyaltyBadgeClass(selectedUser?.loyaltyLevel)}`}>
                        {selectedUser?.loyaltyLevel} Member
                      </span>
                    </div>
                  </div>
                  
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Bookings</span>
                      <span className="stat-value">{selectedUser?.totalBookings}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{selectedUser?.completedBookings}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Spent</span>
                      <span className="stat-value">{selectedUser?.totalSpent}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average Rating</span>
                      <span className="stat-value">{selectedUser?.averageRating} ⭐</span>
                    </div>
                  </div>
                  
                  <div className="profile-details-section">
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedUser?.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedUser?.address}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Join Date:</span>
                      <span className="detail-value">{formatDate(selectedUser?.joinDate || '')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Preferred Services:</span>
                      <div className="preferred-services">
                        {selectedUser?.preferredServices?.map((service, index) => (
                          <span key={index} className="service-tag">{service}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {modalType === 'history' && (
                <div className="history-list">
                  {selectedUser?.bookingHistory?.length > 0 ? (
                    selectedUser.bookingHistory.map((booking, index) => (
                      <div key={index} className="history-item">
                        <div className="history-header">
                          <h4>{booking.serviceName}</h4>
                          <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="history-details">
                          <div className="history-info">
                            <span>📅 {formatDateTime(booking.date)}</span>
                            <span>👨‍🔧 {booking.technicianName}</span>
                            <span>💰 {booking.price}</span>
                          </div>
                          {booking.rating && (
                            <div className="history-rating">
                              <span>Rating: {getRatingStars(booking.rating)} ({booking.rating})</span>
                              {booking.feedback && (
                                <p className="booking-feedback">"{booking.feedback}"</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">
                      <p>No booking history available</p>
                    </div>
                  )}
                </div>
              )}
              
              {modalType === 'feedback' && (
                <div className="feedback-list">
                  {selectedUser?.feedbackHistory?.length > 0 ? (
                    selectedUser.feedbackHistory.map((feedback, index) => (
                      <div key={index} className="feedback-item">
                        <div className="feedback-header">
                          <h4>{feedback.serviceName}</h4>
                          <div className="feedback-rating">
                            {getRatingStars(feedback.rating)} ({feedback.rating}/5)
                          </div>
                        </div>
                        <div className="feedback-content">
                          <p className="feedback-text">"{feedback.feedback}"</p>
                          <div className="feedback-meta">
                            <span>👨‍🔧 {feedback.technicianName}</span>
                            <span>📅 {formatDate(feedback.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">
                      <p>No feedback available</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-actions">
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-btn secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;