import React, { useState, useEffect } from 'react';
import '../../styles/Admin/BookingManagement.css';



const BookingManagement = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'add'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [statistics, setStatistics] = useState({});
  
  // Service và technician data
  const [serviceData, setServiceData] = useState({
    services: [],
    filteredServices: []
  });
  const [technicianData, setTechnicianData] = useState({
    technicians: [],
    filteredTechnicians: []
  });
  
  // Address data
  const [addressData, setAddressData] = useState({
    districts: [],
    wards: {},
  });

  // API Base URL - Updated to Azure deployment
  const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Booking';

  const statusOptions = ['All', 'Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'];

  // Service và Technician API Functions
  const fetchServiceNames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Service/names`);
      if (response.ok) {
        const data = await response.json();
        setServiceData(prev => ({ 
          ...prev, 
          services: data,
          filteredServices: data 
        }));
      } else {
        // Fallback data từ booking data hiện có
        const fallbackServices = [
          'Sửa lò vi sóng',
          'Sửa máy giặt', 
          'Lắp đặt đèn LED',
          'Sửa vòi nước bị rò rỉ',
          'Sửa bồn cầu',
          'Sửa ổ cắm điện',
          'Thông tắc cống',
          'Sửa chữa cầu dao',
          'Đóng tủ bếp theo yêu cầu',
          'Lắp đặt điều hòa mới',
          'Vệ sinh điều hòa'
        ];
        setServiceData(prev => ({ 
          ...prev, 
          services: fallbackServices,
          filteredServices: fallbackServices 
        }));
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchTechnicianNames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Technician/names`);
      if (response.ok) {
        const data = await response.json();
        setTechnicianData(prev => ({ 
          ...prev, 
          technicians: data,
          filteredTechnicians: data 
        }));
      } else {
        // Fallback data từ booking data hiện có
        const fallbackTechnicians = [
          'Cuong Do',
          'Hung Tran',
          'Lan Vu',
          'Mai Hoang'
        ];
        setTechnicianData(prev => ({ 
          ...prev, 
          technicians: fallbackTechnicians,
          filteredTechnicians: fallbackTechnicians 
        }));
      }
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  const searchServices = async (keyword) => {
    if (!keyword.trim()) {
      setServiceData(prev => ({ ...prev, filteredServices: prev.services }));
      return;
    }

    const filtered = serviceData.services.filter(service => 
      service.toLowerCase().includes(keyword.toLowerCase())
    );
    setServiceData(prev => ({ ...prev, filteredServices: filtered }));
  };

  const searchTechnicians = async (keyword) => {
    if (!keyword.trim()) {
      setTechnicianData(prev => ({ ...prev, filteredTechnicians: prev.technicians }));
      return;
    }

    const filtered = technicianData.technicians.filter(technician => 
      technician.toLowerCase().includes(keyword.toLowerCase())
    );
    setTechnicianData(prev => ({ ...prev, filteredTechnicians: filtered }));
  };

  // Address API Functions
  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Address/districts`);
      if (response.ok) {
        const data = await response.json();
        setAddressData(prev => ({ ...prev, districts: data }));
      } else {
        // Fallback data từ booking data hiện có
        const fallbackDistricts = [
          'Quận 1', 'Quận 3', 'Quận 9', 'QUẬN 9', 'quận 9',
          'Hai Chau', 'Ba Dinh', 'District 1', 'District 3'
        ];
        setAddressData(prev => ({ 
          ...prev, 
          districts: [...new Set(fallbackDistricts)] // Remove duplicates
        }));
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
    }
  };

  const fetchWardsByDistrict = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Address/wards?district=${encodeURIComponent(district)}`);
      if (response.ok) {
        const data = await response.json();
        setAddressData(prev => ({ 
          ...prev, 
          wards: { ...prev.wards, [district]: data }
        }));
      } else {
        const sampleWards = getSampleWards(district);
        setAddressData(prev => ({ 
          ...prev, 
          wards: { ...prev.wards, [district]: sampleWards }
        }));
      }
    } catch (err) {
      console.error('Error fetching wards:', err);
    }
  };

  const getSampleWards = (district) => {
    const wardMapping = {
      'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho'],
      'Quận 3': ['Ward 5', 'Ward 6', 'Ward 7'],
      'Quận 9': ['P.Long Thanh My', 'phường Long thạnh mỹ', 'Tăng nhơn phú B', 'phước long B'],
      'District 1': ['Ben Thanh Ward'],
      'District 3': ['Ward 5']
    };
    
    return wardMapping[district] || [`Ward 1 of ${district}`, `Ward 2 of ${district}`];
  };

  // Main API Functions
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch bookings: ${err.message}`);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status?id=${bookingId}&status=${encodeURIComponent(newStatus)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
      console.error('Error updating booking status:', err);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create booking: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      await fetchAllBookings();
      return result;
      
    } catch (err) {
      console.error('Create booking error:', err);
      throw new Error(`Failed to create booking: ${err.message}`);
    }
  };

  const updateBooking = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update booking: ${response.status}`);
      }

      await fetchAllBookings();
      
    } catch (err) {
      throw new Error(`Failed to update booking: ${err.message}`);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}?id=${bookingId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete booking: ${response.status}`);
      }

      setBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
      
    } catch (err) {
      alert(`Failed to delete booking: ${err.message}`);
      console.error('Error deleting booking:', err);
    }
  };

  // Search và filter functions
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter(booking => 
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm) ||
      booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.technicianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId?.toString().includes(searchTerm)
    );
    
    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    if (status === 'All') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => booking.status === status);
      setFilteredBookings(filtered);
    }
    setCurrentPage(1);
  };

  // Initial data loading
  useEffect(() => {
    fetchAllBookings();
    fetchDistricts();
    fetchServiceNames();
    fetchTechnicianNames();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, bookings]);

  // Handle status filter
  useEffect(() => {
    handleStatusFilter(statusFilter);
  }, [statusFilter, bookings]);

  // Update filtered bookings when bookings change
  useEffect(() => {
    if (statusFilter === 'All' && !searchTerm.trim()) {
      setFilteredBookings(bookings);
    }
  }, [bookings]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Event handlers
  const handleStatusChange = async (bookingId, newStatus) => {
    await updateBookingStatus(bookingId, newStatus);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteBooking(bookingId);
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      bookingId: booking.bookingId,
      customerName: booking.customerName || '',
      phone: booking.phone || '',
      serviceName: booking.serviceName || '',
      technicianName: booking.technicianName || '',
      bookingDate: booking.bookingDate ? booking.bookingDate.substring(0, 16) : '',
      status: booking.status || 'Pending',
      price: booking.price || '',
      street: booking.street || '',
      city: booking.city || 'TP.HCM',
      district: booking.district || '',
      ward: booking.ward || '',
      note: booking.note || '',
      problemDescription: booking.problemDescription || '',
      preferredTimeSlot: booking.preferredTimeSlot || '',
      urgencyLevel: booking.urgencyLevel || 'normal'
    });
    
    if (booking.district) {
      fetchWardsByDistrict(booking.district);
    }
    
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
      phone: '',
      serviceName: '',
      technicianName: '',
      bookingDate: '',
      status: 'Pending',
      price: '',
      street: '',
      city: 'TP.HCM',
      district: '',
      ward: '',
      note: '',
      problemDescription: '',
      preferredTimeSlot: '',
      urgencyLevel: 'normal'
    });
    setModalType('add');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.customerName?.trim()) {
        alert('Customer name is required');
        return;
      }
      if (!formData.phone?.trim()) {
        alert('Phone number is required');
        return;
      }
      if (!formData.serviceName?.trim()) {
        alert('Service name is required');
        return;
      }
      if (!formData.bookingDate) {
        alert('Booking date is required');
        return;
      }

      // Format booking date properly
      const formatDateForAPI = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('.')[0];
      };

      // Prepare data for API
      const dataToSend = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        serviceName: formData.serviceName.trim(),
        technicianName: formData.technicianName?.trim() || '',
        bookingDate: formatDateForAPI(formData.bookingDate),
        status: formData.status,
        price: parseFloat(formData.price) || 0,
        street: formData.street?.trim() || '',
        ward: formData.ward?.trim() || '',
        district: formData.district?.trim() || '',
        city: formData.city?.trim() || 'TP.HCM',
        note: formData.note?.trim() || '',
        problemDescription: formData.problemDescription?.trim() || '',
        preferredTimeSlot: formData.preferredTimeSlot?.trim() || '',
        urgencyLevel: formData.urgencyLevel || 'normal'
      };

      if (modalType === 'edit') {
        dataToSend.bookingId = formData.bookingId;
        await updateBooking(dataToSend);
        alert('Booking updated successfully!');
      } else if (modalType === 'add') {
        await createBooking(dataToSend);
        alert('Booking created successfully!');
      }
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDistrictChange = (district) => {
    setFormData({...formData, district, ward: ''});
    if (district) {
      fetchWardsByDistrict(district);
    }
  };

  // Format functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    }
    return price;
  };

  // Calculate status counts
  const getStatusCount = (status) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  // Loading component
  if (loading) {
    return (
      <div className="booking-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="booking-management">
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={() => {
              setError(null);
              fetchAllBookings();
            }} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          const count = getStatusCount(status);
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
                <th>Address</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    <div className="no-data-message">
                      <p>📋 No bookings found</p>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking) => {
                  const statusClass = booking.status.toLowerCase().replace('inprogress', 'in-progress');
                  return (
                    <tr key={booking.bookingId}>
                      <td>
                        <span className="booking-id">#{booking.bookingId}</span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{booking.customerName || 'N/A'}</div>
                          <div className="customer-phone">{booking.phone || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="service-name">{booking.serviceName || 'N/A'}</div>
                      </td>
                      <td className="technician-name">
                        {booking.technicianName || 'Not assigned'}
                      </td>
                      <td className="booking-date">
                        {formatDate(booking.bookingDate)}
                      </td>
                      <td className="booking-address">
                        <div className="address-short">
                          {booking.street && booking.ward && booking.district 
                            ? `${booking.street}, ${booking.ward}, ${booking.district}`
                            : booking.address || 'N/A'
                          }
                        </div>
                      </td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                          className={`status-select ${statusClass}`}
                        >
                          {statusOptions.slice(1).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="booking-price">
                        {formatPrice(booking.price || booking.totalPrice)}
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
                            onClick={() => handleDelete(booking.bookingId)}
                            className="action-btn delete"
                            title="Delete"
                          >
                            🗑️
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
        )}
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
                {/* Customer Information */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Customer Name *</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.customerName || '' : formData.customerName || ''}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.phone || '' : formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                {/* Service Information */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Name *</label>
                    {modalType === 'view' ? (
                      <input
                        type="text"
                        value={selectedBooking?.serviceName || ''}
                        disabled
                        className="form-input"
                      />
                    ) : (
                      <div className="searchable-dropdown">
                        <input
                          type="text"
                          value={formData.serviceName || ''}
                          onChange={(e) => {
                            setFormData({...formData, serviceName: e.target.value});
                            searchServices(e.target.value);
                          }}
                          className="form-input"
                          placeholder="Type to search services..."
                          list="service-options"
                        />
                        <datalist id="service-options">
                          {serviceData.filteredServices.map(service => (
                            <option key={service} value={service} />
                          ))}
                        </datalist>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Technician</label>
                    {modalType === 'view' ? (
                      <input
                        type="text"
                        value={selectedBooking?.technicianName || ''}
                        disabled
                        className="form-input"
                      />
                    ) : (
                      <div className="searchable-dropdown">
                        <input
                          type="text"
                          value={formData.technicianName || ''}
                          onChange={(e) => {
                            setFormData({...formData, technicianName: e.target.value});
                            searchTechnicians(e.target.value);
                          }}
                          className="form-input"
                          placeholder="Type to search technicians..."
                          list="technician-options"
                        />
                        <datalist id="technician-options">
                          {technicianData.filteredTechnicians.map(technician => (
                            <option key={technician} value={technician} />
                          ))}
                        </datalist>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Booking Details */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Booking Date *</label>
                    <input
                      type="datetime-local"
                      value={modalType === 'view' ? selectedBooking?.bookingDate?.substring(0, 16) || '' : formData.bookingDate || ''}
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

                {/* Price and Time Slot */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (VND)</label>
                    <input
                      type="number"
                      value={modalType === 'view' ? selectedBooking?.price || selectedBooking?.totalPrice || '' : formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                      placeholder="Enter service price"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.preferredTimeSlot || '' : formData.preferredTimeSlot || ''}
                      onChange={(e) => setFormData({...formData, preferredTimeSlot: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                      placeholder="e.g., 14:00 - 16:00"
                    />
                  </div>
                </div>
                
                {/* Address Fields */}
                <div className="form-section">
                  <h4 className="form-section-title">📍 Address Information</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value={modalType === 'view' ? selectedBooking?.city || 'TP.HCM' : formData.city || 'TP.HCM'}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <select
                        value={modalType === 'view' ? selectedBooking?.district || '' : formData.district || ''}
                        onChange={(e) => modalType !== 'view' && handleDistrictChange(e.target.value)}
                        disabled={modalType === 'view'}
                        className="form-select"
                      >
                        <option value="">Select District</option>
                        {addressData.districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Ward</label>
                      <select
                        value={modalType === 'view' ? selectedBooking?.ward || '' : formData.ward || ''}
                        onChange={(e) => modalType !== 'view' && setFormData({...formData, ward: e.target.value})}
                        disabled={modalType === 'view' || !formData.district}
                        className="form-select"
                      >
                        <option value="">Select Ward</option>
                        {modalType === 'view' 
                          ? selectedBooking?.ward && [selectedBooking.ward].map(ward => (
                              <option key={ward} value={ward}>{ward}</option>
                            ))
                          : (addressData.wards[formData.district] || []).map(ward => (
                              <option key={ward} value={ward}>{ward}</option>
                            ))
                        }
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.street || '' : formData.street || ''}
                      onChange={(e) => modalType !== 'view' && setFormData({...formData, street: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                      placeholder="Enter street address"
                    />
                  </div>
                </div>

                {/* Problem Description and Urgency */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Urgency Level</label>
                    <select
                      value={modalType === 'view' ? selectedBooking?.urgencyLevel || 'normal' : formData.urgencyLevel || 'normal'}
                      onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-select"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                {/* Problem Description */}
                <div className="form-group full-width">
                  <label className="form-label">Problem Description</label>
                  <textarea
                    value={modalType === 'view' ? selectedBooking?.problemDescription || '' : formData.problemDescription || ''}
                    onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
                    disabled={modalType === 'view'}
                    rows={3}
                    className="form-textarea"
                    placeholder="Describe the problem or service requirements..."
                  />
                </div>
                
                {/* Note */}
                <div className="form-group full-width">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    value={modalType === 'view' ? selectedBooking?.note || '' : formData.note || ''}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    disabled={modalType === 'view'}
                    rows={2}
                    className="form-textarea"
                    placeholder="Add any additional notes..."
                  />
                </div>

                {/* View Mode: Additional Info Display */}
                {modalType === 'view' && selectedBooking && (
                  <div className="form-section">
                    <h4 className="form-section-title">📊 Additional Information</h4>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Total Price</label>
                        <input
                          type="text"
                          value={formatPrice(selectedBooking.totalPrice || selectedBooking.price)}
                          disabled
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Urgency Fee</label>
                        <input
                          type="text"
                          value={formatPrice(selectedBooking.urgencyFee || 0)}
                          disabled
                          className="form-input"
                        />
                      </div>
                    </div>

                    {selectedBooking.address && (
                      <div className="form-group full-width">
                        <label className="form-label">Full Address</label>
                        <input
                          type="text"
                          value={selectedBooking.address}
                          disabled
                          className="form-input"
                        />
                      </div>
                    )}
                  </div>
                )}
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

        .address-short {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: #666;
        }

        .form-section {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .form-section-title {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }

        .form-group.full-width {
          width: 100%;
        }

        .form-input:disabled, .form-select:disabled, .form-textarea:disabled {
          background: #f5f5f5;
          color: #666;
        }

        .searchable-dropdown {
          position: relative;
        }

        .searchable-dropdown input[list] {
          width: 100%;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px 12px;
          padding-right: 40px;
        }

        .form-input[list]:focus {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%230984e3' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
        }

        .form-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #0984e3;
          box-shadow: 0 0 0 3px rgba(9, 132, 227, 0.1);
        }

        .modal-container {
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-form {
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 10px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
          
          .form-group {
            margin-bottom: 15px;
          }
          
          .address-short {
            max-width: none;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingManagement;