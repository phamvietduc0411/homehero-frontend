import React, { useState, useEffect } from 'react';
import '../../styles/Admin/UsersManagement.css';


const UsersManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'history', 'feedback'
  const [selectedUser, setSelectedUser] = useState(null);

  // API Base URL
  const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/AppUser';

  const statusOptions = ['All', 'Active', 'Inactive'];

  // API Functions
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Transform API data to match component structure
      const transformedUsers = result.data.map(user => ({
        id: user.userId,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address || 'No address provided',
        status: user.status,
        joinDate: user.joinDate,
        avatar: user.avatar,
        emailConfirmed: user.emailConfirmed,
        lastLoginDate: user.lastLoginDate,
        // Default values for missing fields (these would come from other API calls)
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        pendingBookings: 0,
        totalSpent: '0 VND',
        averageRating: 0,
        lastBooking: user.lastLoginDate,
        preferredServices: [],
        loyaltyLevel: 'Bronze',
        bookingHistory: [],
        feedbackHistory: []
      }));

      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const endpoint = newStatus === 'Active' 
        ? `${API_BASE_URL}/${userId}/activate`
        : `${API_BASE_URL}/${userId}/deactivate`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
      console.error('Error updating user status:', err);
    }
  };

  // Search and filter functions
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.id?.toString().includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    if (status === 'All') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.status === status);
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  // Initial data loading
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, users]);

  // Handle filters
  useEffect(() => {
    let filtered = users;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.id?.toString().includes(searchTerm)
      );
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, users]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Event handlers
  const handleStatusChange = async (userId, newStatus) => {
    await updateUserStatus(userId, newStatus);
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

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
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

  const getStatusBadgeClass = (status) => {
    return status?.toLowerCase().replace(' ', '-');
  };

  const getStatusCount = (status) => {
    return users.filter(user => user.status === status).length;
  };

  // Loading component
  if (loading) {
    return (
      <div className="users-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="users-management">
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={() => {
              setError(null);
              fetchAllUsers();
            }} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-management">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-info">
          <h1>Users Management</h1>
          <p>Manage customers, view profiles and account information ({users.length} total)</p>
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
            
            <div className="filter-group search">
              <label className="filter-label">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
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
          <div className="stats-card-count">{getStatusCount('Active')}</div>
          <div className="stats-badge active">Active Users</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{getStatusCount('Inactive')}</div>
          <div className="stats-badge inactive">Inactive Users</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{users.filter(u => u.emailConfirmed).length}</div>
          <div className="stats-badge verified">Email Verified</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{users.filter(u => u.lastLoginDate).length}</div>
          <div className="stats-badge recent">Recent Logins</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-count">{users.filter(u => u.address && u.address !== 'No address provided').length}</div>
          <div className="stats-badge address">With Address</div>
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
                <th>Address</th>
                <th>Account Status</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    <div className="no-data-message">
                      <p>👥 No users found</p>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const statusClass = getStatusBadgeClass(user.status);
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
                          <div className="email-status">
                            {user.emailConfirmed ? (
                              <span className="verified">✅ Verified</span>
                            ) : (
                              <span className="unverified">❌ Unverified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="address-info">
                          <div className="address-text">
                            {user.address === 'No address provided' ? (
                              <span className="no-address">No address</span>
                            ) : (
                              <span className="has-address">{user.address}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="account-status">
                          {user.emailConfirmed ? (
                            <span className="account-verified">✅ Verified</span>
                          ) : (
                            <span className="account-pending">⏳ Pending</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="last-login">
                          {user.lastLoginDate ? (
                            <span className="login-date">{formatDateTime(user.lastLoginDate)}</span>
                          ) : (
                            <span className="no-login">Never logged in</span>
                          )}
                        </div>
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
                            title="View Details"
                            disabled
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleViewFeedback(user)}
                            className="action-btn feedback"
                            title="Account Info"
                            disabled
                          >
                            💬
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
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
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h3 className="modal-title">
                {modalType === 'view' ? 'Customer Profile' : 
                 modalType === 'history' ? 'Account Details' : 
                 'Account Information'}
              </h3>
              
              {modalType === 'view' && (
                <div className="profile-details">
                  <div className="profile-header">
                    <div className="profile-avatar">{selectedUser?.avatar}</div>
                    <div className="profile-info">
                      <h4>{selectedUser?.name}</h4>
                      <p className="profile-email">{selectedUser?.email}</p>
                      <span className={`status-badge ${getStatusBadgeClass(selectedUser?.status)}`}>
                        {selectedUser?.status} User
                      </span>
                    </div>
                  </div>
                  
                  <div className="profile-details-section">
                    <div className="detail-row">
                      <span className="detail-label">User ID:</span>
                      <span className="detail-value">#{selectedUser?.id}</span>
                    </div>
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
                      <span className="detail-label">Email Status:</span>
                      <span className="detail-value">
                        {selectedUser?.emailConfirmed ? (
                          <span className="verified">✅ Verified</span>
                        ) : (
                          <span className="unverified">❌ Not Verified</span>
                        )}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Last Login:</span>
                      <span className="detail-value">
                        {selectedUser?.lastLoginDate ? 
                          formatDateTime(selectedUser.lastLoginDate) : 
                          'Never logged in'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {modalType === 'history' && (
                <div className="info-message">
                  <p>📋 Account details and booking history features will be available soon.</p>
                  <p>Currently showing basic user profile information only.</p>
                </div>
              )}
              
              {modalType === 'feedback' && (
                <div className="info-message">
                  <p>💬 Account information and feedback features will be available soon.</p>
                  <p>Currently showing basic user profile information only.</p>
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

        .no-data {
          text-align: center;
          padding: 50px 20px;
        }

        .no-data-message p {
          margin: 10px 0;
          color: #666;
        }

        .no-data-message p:first-child {
          font-size: 18px;
          font-weight: 500;
        }

        .email-status .verified {
          color: #28a745;
          font-size: 12px;
          font-weight: 500;
        }

        .email-status .unverified {
          color: #dc3545;
          font-size: 12px;
          font-weight: 500;
        }

        .address-info .no-address {
          color: #999;
          font-style: italic;
          font-size: 13px;
        }

        .address-info .has-address {
          font-size: 13px;
          color: #333;
        }

        .account-status .account-verified {
          color: #28a745;
          font-size: 13px;
          font-weight: 500;
        }

        .account-status .account-pending {
          color: #ffc107;
          font-size: 13px;
          font-weight: 500;
        }

        .last-login .login-date {
          font-size: 12px;
          color: #666;
        }

        .last-login .no-login {
          font-size: 12px;
          color: #999;
          font-style: italic;
        }

        .action-buttons .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .info-message {
          text-align: center;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
        }

        .info-message p {
          margin: 10px 0;
        }

        .stats-badge.verified { background: #28a745; }
        .stats-badge.recent { background: #17a2b8; }
        .stats-badge.address { background: #6f42c1; }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .users-table-container {
            overflow-x: auto;
          }
          
          .users-table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
};

export default UsersManagement;