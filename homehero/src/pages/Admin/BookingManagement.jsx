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
  
  // NEW: State cho service và technician data
  const [serviceData, setServiceData] = useState({
    services: [],
    filteredServices: []
  });
  const [technicianData, setTechnicianData] = useState({
    technicians: [],
    filteredTechnicians: []
  });
  
  // NEW: State cho address data
  const [addressData, setAddressData] = useState({
    districts: [],
    wards: {},
  });

  // API Base URL - adjust according to your backend
  const API_BASE_URL = 'https://localhost:7190/api/Booking';

  const statusOptions = ['All', 'Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'];

  // 🔧 NEW: Service và Technician API Functions
  const fetchServiceNames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Service/names`);
      if (response.ok) {
        const data = await response.json();
        console.log('Services loaded:', data);
        setServiceData(prev => ({ 
          ...prev, 
          services: data,
          filteredServices: data 
        }));
      } else {
        console.warn('Service API not available, using fallback data');
        // Fallback data
        const fallbackServices = [
          'Air Conditioner Repair', 'Air Conditioner Installation', 'Air Conditioner Cleaning',
          'Refrigerator Repair', 'Washing Machine Repair', 'Dishwasher Repair',
          'Oven Repair', 'Microwave Repair', 'Water Heater Repair',
          'Electrical Wiring', 'Plumbing Services', 'General Maintenance'
        ];
        setServiceData(prev => ({ 
          ...prev, 
          services: fallbackServices,
          filteredServices: fallbackServices 
        }));
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      // Fallback data
      const fallbackServices = [
        'Air Conditioner Repair', 'Air Conditioner Installation', 'Air Conditioner Cleaning',
        'Refrigerator Repair', 'Washing Machine Repair', 'Dishwasher Repair',
        'Oven Repair', 'Microwave Repair', 'Water Heater Repair',
        'Electrical Wiring', 'Plumbing Services', 'General Maintenance'
      ];
      setServiceData(prev => ({ 
        ...prev, 
        services: fallbackServices,
        filteredServices: fallbackServices 
      }));
    }
  };

  const fetchTechnicianNames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Technician/names`);
      if (response.ok) {
        const data = await response.json();
        console.log('Technicians loaded:', data);
        setTechnicianData(prev => ({ 
          ...prev, 
          technicians: data,
          filteredTechnicians: data 
        }));
      } else {
        console.warn('Technician API not available, using fallback data');
        // Fallback data
        const fallbackTechnicians = [
          'Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D',
          'Hoang Van E', 'Vu Thi F', 'Do Van G', 'Bui Thi H',
          'Dang Van I', 'Ngo Thi J', 'Ly Van K', 'Mai Thi L'
        ];
        setTechnicianData(prev => ({ 
          ...prev, 
          technicians: fallbackTechnicians,
          filteredTechnicians: fallbackTechnicians 
        }));
      }
    } catch (err) {
      console.error('Error fetching technicians:', err);
      // Fallback data
      const fallbackTechnicians = [
        'Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D',
        'Hoang Van E', 'Vu Thi F', 'Do Van G', 'Bui Thi H',
        'Dang Van I', 'Ngo Thi J', 'Ly Van K', 'Mai Thi L'
      ];
      setTechnicianData(prev => ({ 
        ...prev, 
        technicians: fallbackTechnicians,
        filteredTechnicians: fallbackTechnicians 
      }));
    }
  };

  const searchServices = async (keyword) => {
    if (!keyword.trim()) {
      setServiceData(prev => ({ ...prev, filteredServices: prev.services }));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Service/search?keyword=${encodeURIComponent(keyword)}`);
      if (response.ok) {
        const data = await response.json();
        setServiceData(prev => ({ ...prev, filteredServices: data }));
      } else {
        // Fallback: filter locally
        const filtered = serviceData.services.filter(service => 
          service.toLowerCase().includes(keyword.toLowerCase())
        );
        setServiceData(prev => ({ ...prev, filteredServices: filtered }));
      }
    } catch (err) {
      console.error('Error searching services:', err);
      // Fallback: filter locally
      const filtered = serviceData.services.filter(service => 
        service.toLowerCase().includes(keyword.toLowerCase())
      );
      setServiceData(prev => ({ ...prev, filteredServices: filtered }));
    }
  };

  const searchTechnicians = async (keyword) => {
    if (!keyword.trim()) {
      setTechnicianData(prev => ({ ...prev, filteredTechnicians: prev.technicians }));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Technician/search?keyword=${encodeURIComponent(keyword)}`);
      if (response.ok) {
        const data = await response.json();
        setTechnicianData(prev => ({ ...prev, filteredTechnicians: data }));
      } else {
        // Fallback: filter locally
        const filtered = technicianData.technicians.filter(technician => 
          technician.toLowerCase().includes(keyword.toLowerCase())
        );
        setTechnicianData(prev => ({ ...prev, filteredTechnicians: filtered }));
      }
    } catch (err) {
      console.error('Error searching technicians:', err);
      // Fallback: filter locally
      const filtered = technicianData.technicians.filter(technician => 
        technician.toLowerCase().includes(keyword.toLowerCase())
      );
      setTechnicianData(prev => ({ ...prev, filteredTechnicians: filtered }));
    }
  };

  // 🏙️ NEW: Address API Functions
  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Address/districts`);
      if (response.ok) {
        const data = await response.json();
        console.log('Districts loaded:', data);
        setAddressData(prev => ({ ...prev, districts: data }));
      } else {
        console.warn('Districts API not available, using fallback data');
        // Fallback data nếu API chưa có
        setAddressData(prev => ({ 
          ...prev, 
          districts: [
            'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
            'District 6', 'District 7', 'District 8', 'District 9', 'District 10',
            'District 11', 'District 12', 'Binh Thanh', 'Go Vap', 'Phu Nuan',
            'Tan Binh', 'Tan Phu', 'Thu Duc', 'Binh Tan', 'Cu Chi',
            'Hoc Mon', 'Nha Be', 'Can Gio'
          ]
        }));
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      // Fallback data nếu API lỗi
      setAddressData(prev => ({ 
        ...prev, 
        districts: [
          'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
          'District 6', 'District 7', 'District 8', 'District 9', 'District 10',
          'District 11', 'District 12', 'Binh Thanh', 'Go Vap', 'Phu Nuan',
          'Tan Binh', 'Tan Phu', 'Thu Duc', 'Binh Tan', 'Cu Chi',
          'Hoc Mon', 'Nha Be', 'Can Gio'
        ]
      }));
    }
  };

  const fetchWardsByDistrict = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Address/wards?district=${encodeURIComponent(district)}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Wards for ${district}:`, data);
        setAddressData(prev => ({ 
          ...prev, 
          wards: { ...prev.wards, [district]: data }
        }));
      } else {
        console.warn(`Wards API not available for ${district}, using fallback data`);
        // Fallback data mẫu
        const sampleWards = getSampleWards(district);
        setAddressData(prev => ({ 
          ...prev, 
          wards: { ...prev.wards, [district]: sampleWards }
        }));
      }
    } catch (err) {
      console.error('Error fetching wards:', err);
      // Fallback data mẫu
      const sampleWards = getSampleWards(district);
      setAddressData(prev => ({ 
        ...prev, 
        wards: { ...prev.wards, [district]: sampleWards }
      }));
    }
  };

  // Helper function để tạo sample wards
  const getSampleWards = (district) => {
    const wardMapping = {
      'District 1': ['Ben Nghe', 'Ben Thanh', 'Cau Kho', 'Cau Ong Lanh', 'Co Giang', 'Da Kao', 'Nguyen Cu Trinh', 'Nguyen Thai Binh', 'Pham Ngu Lao', 'Tan Dinh'],
      'District 2': ['An Khanh', 'An Loi Dong', 'An Phu', 'Binh An', 'Binh Khanh', 'Binh Trung Dong', 'Binh Trung Tay', 'Cat Lai', 'Thao Dien', 'Thu Thiem'],
      'District 3': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10', 'Ward 11', 'Ward 12', 'Ward 13', 'Ward 14'],
      'Binh Thanh': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 11', 'Ward 12', 'Ward 13', 'Ward 14', 'Ward 15', 'Ward 17', 'Ward 19', 'Ward 21', 'Ward 22', 'Ward 24', 'Ward 25', 'Ward 26', 'Ward 27', 'Ward 28']
    };
    
    return wardMapping[district] || [`Ward 1 of ${district}`, `Ward 2 of ${district}`, `Ward 3 of ${district}`];
  };

  const createOrGetAddress = async (street, ward, district, city = "Ho Chi Minh City") => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/Booking', '')}/Address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          street: street.trim(), 
          ward: ward.trim(), 
          district: district.trim(), 
          city: city.trim() 
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Address created/found:', result);
        return result.addressId;
      } else {
        const errorText = await response.text();
        console.error('Address API error:', errorText);
        throw new Error(`Address API failed: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Error creating address:', err);
      throw new Error(`Failed to create address: ${err.message}`);
    }
  };

  // 🔌 Existing API Functions (giữ nguyên)
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

  const fetchBookingStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (response.ok) {
        const stats = await response.json();
        setStatistics(stats);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const searchBookings = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        await fetchAllBookings();
        return;
      }
      
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
      console.error('Error searching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookingsByStatus = async (status) => {
    try {
      if (status === 'All') {
        await fetchAllBookings();
        return;
      }
      
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/filter?status=${encodeURIComponent(status)}`);
      
      if (!response.ok) {
        throw new Error(`Filter failed: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(`Filter failed: ${err.message}`);
      console.error('Error filtering bookings:', err);
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

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      // Refresh data to ensure consistency
      await fetchAllBookings();
      
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
      console.error('Error updating booking status:', err);
    }
  };

  // UPDATED: Create booking với address fields
  const createBooking = async (bookingData) => {
    try {
      console.log('Sending booking data:', bookingData);
      
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
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

  // UPDATED: Update booking với address fields
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

  // 🎯 Initial data loading
  useEffect(() => {
    fetchAllBookings();
    fetchBookingStatistics();
    fetchDistricts(); // NEW: Load districts on init
    fetchServiceNames(); // NEW: Load services on init
    fetchTechnicianNames(); // NEW: Load technicians on init
  }, []);

  // 🔍 Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchBookings(searchTerm);
      } else if (statusFilter === 'All') {
        fetchAllBookings();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 🎛️ Handle status filter
  useEffect(() => {
    setCurrentPage(1);
    if (statusFilter === 'All' && !searchTerm.trim()) {
      fetchAllBookings();
    } else if (statusFilter !== 'All') {
      filterBookingsByStatus(statusFilter);
    }
  }, [statusFilter]);

  // 📊 Update filtered bookings for local pagination/display
  useEffect(() => {
    setFilteredBookings(bookings);
    setCurrentPage(1);
  }, [bookings]);

  // 📄 Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // 🎯 Event handlers
  const handleStatusChange = async (bookingId, newStatus) => {
    await updateBookingStatus(bookingId, newStatus);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteBooking(bookingId);
    }
  };

  // UPDATED: handleEdit với address fields
  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      bookingId: booking.bookingId,
      customerName: booking.customerName,
      phone: booking.phone,
      serviceName: booking.serviceName,
      technicianName: booking.technicianName,
      bookingDate: booking.bookingDate ? booking.bookingDate.substring(0, 16) : '',
      status: booking.status,
      // Address fields - sử dụng individual fields từ backend response
      street: booking.street || '',
      city: booking.city || 'Ho Chi Minh City',
      district: booking.district || '',
      ward: booking.ward || '',
      note: booking.note || ''
    });
    
    // Load wards for selected district nếu có
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

  // UPDATED: handleAdd - bỏ price field
  const handleAdd = () => {
    setFormData({
      customerName: '',
      phone: '',
      serviceName: '',
      technicianName: '',
      bookingDate: '',
      status: 'Pending',
      // Address fields
      street: '',
      city: 'Ho Chi Minh City',
      district: '',
      ward: '',
      note: ''
    });
    setModalType('add');
    setShowModal(true);
  };

  // UPDATED: handleSave với validation và address handling
  const handleSave = async () => {
    try {
      // Enhanced validation
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
      if (!formData.technicianName?.trim()) {
        alert('Technician name is required');
        return;
      }
      if (!formData.street?.trim() || !formData.district || !formData.ward) {
        alert('Complete address (street, district, ward) is required');
        return;
      }
      if (!formData.bookingDate) {
        alert('Booking date is required');
        return;
      }

      // Validate booking date is not in the past (only for new bookings)
      if (modalType === 'add') {
        const bookingDate = new Date(formData.bookingDate);
        const now = new Date();
        // Allow booking từ hiện tại trở đi (có thể booking trong ngày)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        
        if (bookingDay < today) {
          alert('Booking date cannot be in the past');
          return;
        }
      }

      console.log('Creating/Getting address for:', {
        street: formData.street,
        ward: formData.ward,
        district: formData.district,
        city: formData.city
      });

      // Create or get address ID
      const addressId = await createOrGetAddress(
        formData.street,
        formData.ward,
        formData.district,
        formData.city
      );

      console.log('Address ID received:', addressId);

      // Format booking date properly for C# DateTime
      const formatDateForAPI = (dateString) => {
        const date = new Date(dateString);
        // Format: "YYYY-MM-DDTHH:mm:ss" (ISO format without milliseconds)
        return date.toISOString().split('.')[0];
      };

      // Prepare data for API
      const dataToSend = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        serviceName: formData.serviceName.trim(),
        technicianName: formData.technicianName.trim(),
        bookingDate: formatDateForAPI(formData.bookingDate), // Format date properly
        status: formData.status,
        addressId: addressId,
        note: formData.note?.trim() || '',
      };

      console.log('Sending booking data:', dataToSend);

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

  // Handle district change
  const handleDistrictChange = (district) => {
    setFormData({...formData, district, ward: ''});
    if (district) {
      fetchWardsByDistrict(district);
    }
  };

  // 📅 Format date function
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

  // 💰 Format price function (still used for display)
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (typeof price === 'string' && price.includes('VND')) {
      return price;
    }
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    }
    return price;
  };

  // 📊 Calculate status counts from current data
  const getStatusCount = (status) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  // 🎨 Loading component
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

  // ❌ Error component
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
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
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
                        {formatPrice(booking.price)}
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
        )}
      </div>

      {/* UPDATED Modal với address fields */}
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
                
                {/* NEW: Address Fields */}
                <div className="form-section">
                  <h4 className="form-section-title">📍 Address Information</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value="Ho Chi Minh City"
                        disabled
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">District *</label>
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
                      <label className="form-label">Ward *</label>
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
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedBooking?.street || selectedBooking?.address || '' : formData.street || ''}
                      onChange={(e) => modalType !== 'view' && setFormData({...formData, street: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                      placeholder="Enter street address (e.g., 123 Nguyen Hue)"
                    />
                  </div>
                </div>
                
                {/* Note */}
                <div className="form-group full-width">
                  <label className="form-label">Note</label>
                  <textarea
                    value={modalType === 'view' ? selectedBooking?.note || '' : formData.note || ''}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    disabled={modalType === 'view'}
                    rows={3}
                    className="form-textarea"
                    placeholder="Add any additional notes..."
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

      {/* Styling for new components */}
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

        /* NEW: Address form styling */
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

        .form-input:disabled {
          background: #f5f5f5;
          color: #666;
        }

        .form-select:disabled {
          background: #f5f5f5;
          color: #666;
        }

        /* NEW: Searchable dropdown styling */
        .searchable-dropdown {
          position: relative;
        }

        .searchable-dropdown input[list] {
          width: 100%;
        }

        .searchable-dropdown input[list]::-webkit-calendar-picker-indicator {
          display: none;
        }

        /* Enhanced form input for searchable fields */
        .form-input[list] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px 12px;
          padding-right: 40px;
        }

        .form-input[list]:focus {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%230984e3' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
        }

        /* Loading and data states */
        .form-input[list][placeholder*="search"]:empty::before {
          content: "Loading...";
          color: #999;
        }

        .form-label:has(~ .form-input[required])::after,
        .form-label:has(~ .form-select[required])::after {
          content: " *";
          color: #e74c3c;
        }

        /* Validation styles */
        .form-input.error,
        .form-select.error {
          border-color: #e74c3c;
          background-color: #fdf2f2;
        }

        .form-input.error:focus,
        .form-select.error:focus {
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }
      `}</style>
    </div>
  );
};

export default BookingManagement;