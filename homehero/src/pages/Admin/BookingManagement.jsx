import React, { useState, useEffect } from 'react';
import '../../styles/Admin/BookingManagement.css';

const BookingManagement = () => {
  // Sample data dựa trên SQL của bạn
  const [bookings, setBookings] = useState([
    {
      id: 1,
      userId: 1,
      technicianId: 1,
      serviceId: 1,
      bookingDate: '2024-12-20T09:00:00',
      status: 'Completed',
      customerName: 'Minh Tran',
      technicianName: 'Thanh Nguyen',
      serviceName: 'Leaky Faucet Repair',
      price: '200,000 VND',
      address: '123 Nguyen Hue Street, District 1, HCMC',
      note: 'Bathroom sink faucet',
      phone: '0901234567'
    },
    {
      id: 2,
      userId: 2,
      technicianId: 2,
      serviceId: 4,
      bookingDate: '2024-12-23T14:00:00',
      status: 'Confirmed',
      customerName: 'Linh Nguyen',
      technicianName: 'Hung Tran',
      serviceName: 'Light Fixture Installation',
      price: '250,000 VND',
      address: '456 Le Loi Avenue, District 1, HCMC',
      note: 'Living room ceiling light',
      phone: '0912345678'
    },
    {
      id: 3,
      userId: 3,
      technicianId: 3,
      serviceId: 7,
      bookingDate: '2025-01-05T10:30:00',
      status: 'Pending',
      customerName: 'Khanh Le',
      technicianName: 'Lan Vu',
      serviceName: 'Furniture Assembly',
      price: '350,000 VND',
      address: '789 Vo Van Tan Street, District 3, HCMC',
      note: 'IKEA wardrobe assembly',
      phone: '0923456789'
    },
    {
      id: 4,
      userId: 4,
      technicianId: 4,
      serviceId: 10,
      bookingDate: '2025-01-06T08:00:00',
      status: 'InProgress',
      customerName: 'Hoa Pham',
      technicianName: 'Cuong Do',
      serviceName: 'AC Maintenance',
      price: '450,000 VND',
      address: '101 Bach Dang Street, Da Nang',
      note: 'Annual AC maintenance',
      phone: '0934567890'
    },
    {
      id: 5,
      userId: 5,
      technicianId: 5,
      serviceId: 13,
      bookingDate: '2024-12-15T16:00:00',
      status: 'Cancelled',
      customerName: 'Tuan Vo',
      technicianName: 'Mai Hoang',
      serviceName: 'Refrigerator Repair',
      price: '400,000 VND',
      address: '202 Tran Phu Street, Hanoi',
      note: 'Fridge not cooling properly',
      phone: '0945678901'
    },
    {
      id: 6,
      userId: 1,
      technicianId: 2,
      serviceId: 5,
      bookingDate: '2025-01-07T13:00:00',
      status: 'Pending',
      customerName: 'Minh Tran',
      technicianName: 'Hung Tran',
      serviceName: 'Outlet Repair',
      price: '180,000 VND',
      address: '123 Nguyen Hue Street, District 1, HCMC',
      note: 'Kitchen outlets not working',
      phone: '0901234567'
    }
  ]);

  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'add'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});

  const statusOptions = ['All', 'Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'];

  // Filter and search logic
  useEffect(() => {
    let filtered = bookings;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm)
      );
    }
    
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, bookings]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const handleDelete = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData(booking);
    setModalType('edit');
    setShowModal(true);
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setModalType('view');
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({
      customerName: '',
      technicianName: '',
      serviceName: '',
      bookingDate: '',
      status: 'Pending',
      price: '',
      address: '',
      note: '',
      phone: ''
    });
    setModalType('add');
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalType === 'edit') {
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id ? { ...booking, ...formData } : booking
      ));
    } else if (modalType === 'add') {
      const newBooking = {
        ...formData,
        id: Math.max(...bookings.map(b => b.id)) + 1,
        userId: Math.floor(Math.random() * 5) + 1,
        technicianId: Math.floor(Math.random() * 5) + 1,
        serviceId: Math.floor(Math.random() * 15) + 1
      };
      setBookings(prev => [...prev, newBooking]);
    }
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="booking-management">
      {/* Header */}
      <div className="booking-header">
        <div className="booking-header-info">
          <h1>Booking Management</h1>
          <p>Manage all customer bookings and appointments</p>
        </div>
        <button onClick={handleAdd} className="add-booking-btn">
          <span>➕</span>
          Add New Booking
        </button>
      </div>

      {/* Filters and Search */}
      <div className="booking-filters">
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
                placeholder="Search by customer, technician, service, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <div className="results-count">
            Showing {currentBookings.length} of {filteredBookings.length} bookings
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="status-cards">
        {statusOptions.slice(1).map(status => {
          const count = bookings.filter(b => b.status === status).length;
          const statusClass = status.toLowerCase().replace('inprogress', 'in-progress');
          return (
            <div key={status} className="status-card">
              <div className="status-card-count">{count}</div>
              <div className={`status-badge ${statusClass}`}>
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings Table */}
      <div className="booking-table-container">
        <div className="booking-table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Technician</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => {
                const statusClass = booking.status.toLowerCase().replace('inprogress', 'in-progress');
                return (
                  <tr key={booking.id}>
                    <td>
                      <span className="booking-id">#{booking.id}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{booking.customerName}</div>
                        <div className="customer-phone">{booking.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="service-name">{booking.serviceName}</div>
                    </td>
                    <td className="technician-name">
                      {booking.technicianName}
                    </td>
                    <td className="booking-date">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`status-select ${statusClass}`}
                      >
                        {statusOptions.slice(1).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="booking-price">
                      {booking.price}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleView(booking)}
                          className="action-btn view"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(booking)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          🗑️
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
              <span className="font-medium">{Math.min(indexOfLastItem, filteredBookings.length)}</span> of{' '}
              <span className="font-medium">{filteredBookings.length}</span> results
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
                {modalType === 'view' ? 'Booking Details' : 
                 modalType === 'edit' ? 'Edit Booking' : 'Add New Booking'}
              </h3>
              
              <div className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.customerName || '' : formData.customerName || ''}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.phone || '' : formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Name</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.serviceName || '' : formData.serviceName || ''}
                      onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Technician</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.technicianName || '' : formData.technicianName || ''}
                      onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Booking Date</label>
                    <input
                      type="datetime-local"
                      value={modalType === 'view' ? selectedBooking?.bookingDate || '' : formData.bookingDate || ''}
                      onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      value={modalType === 'view' ? selectedBooking?.status || '' : formData.status || 'Pending'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-select"
                    >
                      {statusOptions.slice(1).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.price || '' : formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={modalType === 'view' ? selectedBooking?.address || '' : formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={modalType === 'view'}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Note</label>
                  <textarea
                    value={modalType === 'view' ? selectedBooking?.note || '' : formData.note || ''}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    disabled={modalType === 'view'}
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-btn secondary"
                >
                  {modalType === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalType !== 'view' && (
                  <button
                    onClick={handleSave}
                    className="modal-btn primary"
                  >
                    {modalType === 'edit' ? 'Update' : 'Create'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;