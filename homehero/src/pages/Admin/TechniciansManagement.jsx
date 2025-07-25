import React, { useState, useEffect } from 'react';
import '../../styles/Admin/TechniciansManagement.css';


const TechniciansManagement = () => {
  // State management
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'add', 'schedule'
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [formData, setFormData] = useState({});
  const [apiStats, setApiStats] = useState({
    totalCount: 0,
    totalPages: 1
  });

  // API Base URL
  const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/Technician';

  const statusOptions = ['All', 'Active', 'Inactive'];
  const skillsOptions = ['All', 'Plumbing', 'Electrical', 'HVAC', 'Appliance Repair', 'Carpentry', 'Painting', 'Cleaning', 'General Repair', 'Smart Home Installation'];
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // API Functions
  const fetchAllTechnicians = async (page = 1, pageSize = 100) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}?page=${page}&pageSize=${pageSize}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API data to match our component structure
      const transformedTechnicians = data.technicians.map(tech => ({
        id: tech.technicianId,
        name: tech.fullName,
        email: tech.email,
        phone: tech.phone,
        address: '', // Not provided by API
        status: tech.isActive ? 'Active' : 'Inactive',
        joinDate: tech.joinDate,
        rating: tech.rating || 0,
        completedJobs: tech.jobsCount || 0,
        avatar: '👨‍🔧',
        skills: tech.skills ? tech.skills.map(skill => ({
          name: skill,
          level: 'Intermediate', // Default level
          experience: tech.experienceYears ? `${tech.experienceYears} years` : 'N/A'
        })) : [],
        availability: {
          monday: { available: true, hours: '08:00-17:00' },
          tuesday: { available: true, hours: '08:00-17:00' },
          wednesday: { available: true, hours: '08:00-17:00' },
          thursday: { available: true, hours: '08:00-17:00' },
          friday: { available: true, hours: '08:00-17:00' },
          saturday: { available: false, hours: '' },
          sunday: { available: false, hours: '' }
        },
        certifications: [], // Not provided by API
        experienceYears: tech.experienceYears
      }));

      setTechnicians(transformedTechnicians);
      setApiStats({
        totalCount: data.totalCount,
        totalPages: data.totalPages
      });
      setError(null);
    } catch (err) {
      setError(`Failed to fetch technicians: ${err.message}`);
      console.error('Error fetching technicians:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTechnician = async (technicianData) => {
    try {
      const apiData = {
        fullName: technicianData.name,
        email: technicianData.email,
        phone: technicianData.phone,
        experienceYears: technicianData.experienceYears || null,
        skills: technicianData.skills ? technicianData.skills.map(skill => skill.name) : [],
        isActive: technicianData.status === 'Active'
      };

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create technician: ${response.status} - ${errorText}`);
      }

      await fetchAllTechnicians();
      return await response.json();
      
    } catch (err) {
      console.error('Create technician error:', err);
      throw new Error(`Failed to create technician: ${err.message}`);
    }
  };

  const updateTechnician = async (technicianData) => {
    try {
      const apiData = {
        technicianId: technicianData.id,
        fullName: technicianData.name,
        email: technicianData.email,
        phone: technicianData.phone,
        experienceYears: technicianData.experienceYears || null,
        skills: technicianData.skills ? technicianData.skills.map(skill => skill.name) : [],
        isActive: technicianData.status === 'Active'
      };

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update technician: ${response.status}`);
      }

      await fetchAllTechnicians();
      
    } catch (err) {
      throw new Error(`Failed to update technician: ${err.message}`);
    }
  };

  const deleteTechnician = async (technicianId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${technicianId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete technician: ${response.status}`);
      }

      await fetchAllTechnicians();
      
    } catch (err) {
      alert(`Failed to delete technician: ${err.message}`);
      console.error('Error deleting technician:', err);
    }
  };

  const updateTechnicianStatus = async (technicianId, isActive) => {
    try {
      const technician = technicians.find(t => t.id === technicianId);
      if (!technician) return;

      const apiData = {
        technicianId: technicianId,
        fullName: technician.name,
        email: technician.email,
        phone: technician.phone,
        experienceYears: technician.experienceYears || null,
        skills: technician.skills ? technician.skills.map(skill => skill.name) : [],
        isActive: isActive
      };

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      // Update local state
      setTechnicians(prev => prev.map(tech => 
        tech.id === technicianId ? { ...tech, status: isActive ? 'Active' : 'Inactive' } : tech
      ));
      
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
      console.error('Error updating technician status:', err);
    }
  };

  // Search and filter functions
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredTechnicians(technicians);
      return;
    }

    const filtered = technicians.filter(tech => 
      tech.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.phone?.includes(searchTerm) ||
      tech.id?.toString().includes(searchTerm) ||
      tech.skills?.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredTechnicians(filtered);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    if (status === 'All') {
      setFilteredTechnicians(technicians);
    } else {
      const filtered = technicians.filter(tech => tech.status === status);
      setFilteredTechnicians(filtered);
    }
    setCurrentPage(1);
  };

  const handleSkillFilter = (skill) => {
    if (skill === 'All') {
      setFilteredTechnicians(technicians);
    } else {
      const filtered = technicians.filter(tech => 
        tech.skills?.some(techSkill => techSkill.name === skill)
      );
      setFilteredTechnicians(filtered);
    }
    setCurrentPage(1);
  };

  // Initial data loading
  useEffect(() => {
    fetchAllTechnicians();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, technicians]);

  // Handle filters
  useEffect(() => {
    let filtered = technicians;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(tech => tech.status === statusFilter);
    }
    
    if (skillFilter !== 'All') {
      filtered = filtered.filter(tech => 
        tech.skills?.some(skill => skill.name === skillFilter)
      );
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(tech => 
        tech.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.phone?.includes(searchTerm) ||
        tech.id?.toString().includes(searchTerm) ||
        tech.skills?.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredTechnicians(filtered);
    setCurrentPage(1);
  }, [statusFilter, skillFilter, searchTerm, technicians]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTechnicians = filteredTechnicians.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage);

  // Event handlers
  const handleStatusChange = async (techId, newStatus) => {
    await updateTechnicianStatus(techId, newStatus === 'Active');
  };

  const handleDelete = async (techId) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      await deleteTechnician(techId);
    }
  };

  const handleEdit = (technician) => {
    setSelectedTechnician(technician);
    setFormData({
      id: technician.id,
      name: technician.name || '',
      email: technician.email || '',
      phone: technician.phone || '',
      address: technician.address || '',
      status: technician.status || 'Active',
      experienceYears: technician.experienceYears || '',
      skills: technician.skills || [],
      availability: technician.availability || {},
      certifications: technician.certifications || []
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleView = (technician) => {
    setSelectedTechnician(technician);
    setModalType('view');
    setShowModal(true);
  };

  const handleSchedule = (technician) => {
    setSelectedTechnician(technician);
    setFormData({ 
      id: technician.id,
      availability: { ...technician.availability } 
    });
    setModalType('schedule');
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active',
      experienceYears: '',
      skills: [],
      availability: {
        monday: { available: true, hours: '08:00-17:00' },
        tuesday: { available: true, hours: '08:00-17:00' },
        wednesday: { available: true, hours: '08:00-17:00' },
        thursday: { available: true, hours: '08:00-17:00' },
        friday: { available: true, hours: '08:00-17:00' },
        saturday: { available: false, hours: '' },
        sunday: { available: false, hours: '' }
      },
      certifications: []
    });
    setModalType('add');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.name?.trim()) {
        alert('Name is required');
        return;
      }
      if (!formData.email?.trim()) {
        alert('Email is required');
        return;
      }
      if (!formData.phone?.trim()) {
        alert('Phone is required');
        return;
      }

      if (modalType === 'edit') {
        await updateTechnician(formData);
        alert('Technician updated successfully!');
      } else if (modalType === 'add') {
        await createTechnician(formData);
        alert('Technician created successfully!');
      } else if (modalType === 'schedule') {
        // Schedule updates are handled locally for now
        setTechnicians(prev => prev.map(tech => 
          tech.id === selectedTechnician.id ? { ...tech, availability: formData.availability } : tech
        ));
        alert('Schedule updated successfully!');
      }
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const addSkill = () => {
    const newSkill = { name: '', level: 'Beginner', experience: '' };
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const updateAvailability = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRatingStars = (rating) => {
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

  const getStatusCount = (status) => {
    return technicians.filter(tech => tech.status === status).length;
  };

  const getAverageRating = () => {
    if (technicians.length === 0) return 0;
    const totalRating = technicians.reduce((sum, tech) => sum + (tech.rating || 0), 0);
    return Math.round(totalRating / technicians.length * 10) / 10;
  };

  const getTotalJobs = () => {
    return technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  };

  // Loading component
  if (loading) {
    return (
      <div className="technicians-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading technicians...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="technicians-management">
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={() => {
              setError(null);
              fetchAllTechnicians();
            }} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="technicians-management">
      {/* Header */}
      <div className="technicians-header">
        <div className="technicians-header-info">
          <h1>Technicians Management</h1>
          <p>Manage technicians, skills, and work schedules ({apiStats.totalCount} total)</p>
        </div>
        <button onClick={handleAdd} className="add-technician-btn">
          <span>👨‍🔧</span>
          Add New Technician
        </button>
      </div>

      {/* Filters and Search */}
      <div className="technicians-filters">
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
              <label className="filter-label">Skill Filter</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="filter-select"
              >
                {skillsOptions.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group search">
              <label className="filter-label">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <div className="results-count">
            Showing {currentTechnicians.length} of {filteredTechnicians.length} technicians
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="status-cards">
        <div className="status-card">
          <div className="status-card-count">{getStatusCount('Active')}</div>
          <div className="status-badge active">Active</div>
        </div>
        <div className="status-card">
          <div className="status-card-count">{getStatusCount('Inactive')}</div>
          <div className="status-badge inactive">Inactive</div>
        </div>
        <div className="status-card">
          <div className="status-card-count">{getAverageRating()}</div>
          <div className="status-badge rating">Avg Rating</div>
        </div>
        <div className="status-card">
          <div className="status-card-count">{getTotalJobs()}</div>
          <div className="status-badge jobs">Total Jobs</div>
        </div>
      </div>

      {/* Technicians Table */}
      <div className="technicians-table-container">
        <div className="technicians-table-wrapper">
          <table className="technicians-table">
            <thead>
              <tr>
                <th>Technician</th>
                <th>Contact</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Jobs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTechnicians.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="no-data-message">
                      <p>👨‍🔧 No technicians found</p>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentTechnicians.map((technician) => {
                  const statusClass = technician.status.toLowerCase();
                  return (
                    <tr key={technician.id}>
                      <td>
                        <div className="technician-info">
                          <div className="technician-avatar">{technician.avatar}</div>
                          <div className="technician-details">
                            <div className="technician-name">{technician.name}</div>
                            <div className="technician-id">ID: #{technician.id}</div>
                            <div className="join-date">Joined: {formatDate(technician.joinDate)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-email">{technician.email}</div>
                          <div className="contact-phone">{technician.phone}</div>
                        </div>
                      </td>
                      <td>
                        <div className="skills-list">
                          {technician.skills && technician.skills.length > 0 ? (
                            <>
                              {technician.skills.slice(0, 2).map((skill, index) => (
                                <span key={index} className={`skill-badge ${skill.level?.toLowerCase() || 'intermediate'}`}>
                                  {skill.name}
                                </span>
                              ))}
                              {technician.skills.length > 2 && (
                                <span className="skills-more">+{technician.skills.length - 2} more</span>
                              )}
                            </>
                          ) : (
                            <span className="no-skills">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="experience-years">
                        {technician.experienceYears ? `${technician.experienceYears} years` : 'N/A'}
                      </td>
                      <td>
                        <div className="rating-info">
                          <div className="rating-stars">{getRatingStars(technician.rating)}</div>
                          <div className="rating-number">{technician.rating || 0}</div>
                        </div>
                      </td>
                      <td className="jobs-completed">
                        {technician.completedJobs || 0}
                      </td>
                      <td>
                        <select
                          value={technician.status}
                          onChange={(e) => handleStatusChange(technician.id, e.target.value)}
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
                            onClick={() => handleView(technician)}
                            className="action-btn view"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleSchedule(technician)}
                            className="action-btn schedule"
                            title="Manage Schedule"
                          >
                            📅
                          </button>
                          <button
                            onClick={() => handleEdit(technician)}
                            className="action-btn edit"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(technician.id)}
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
                <span className="font-medium">{Math.min(indexOfLastItem, filteredTechnicians.length)}</span> of{' '}
                <span className="font-medium">{filteredTechnicians.length}</span> results
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
                {modalType === 'view' ? 'Technician Details' : 
                 modalType === 'edit' ? 'Edit Technician' : 
                 modalType === 'schedule' ? 'Manage Schedule' :
                 'Add New Technician'}
              </h3>
              
              {modalType === 'schedule' ? (
                // Schedule Management Form
                <div className="schedule-form">
                  <h4>Weekly Availability</h4>
                  <div className="schedule-grid">
                    {daysOfWeek.map(day => (
                      <div key={day} className="schedule-day">
                        <div className="day-header">
                          <label className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                          <input
                            type="checkbox"
                            checked={formData.availability?.[day]?.available || false}
                            onChange={(e) => updateAvailability(day, 'available', e.target.checked)}
                            className="availability-checkbox"
                          />
                        </div>
                        {formData.availability?.[day]?.available && (
                          <input
                            type="text"
                            placeholder="e.g., 08:00-17:00"
                            value={formData.availability?.[day]?.hours || ''}
                            onChange={(e) => updateAvailability(day, 'hours', e.target.value)}
                            className="hours-input"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Regular Form
                <div className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        value={modalType === 'view' ? selectedTechnician?.name || '' : formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                        placeholder="Enter technician name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        value={modalType === 'view' ? selectedTechnician?.email || '' : formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        value={modalType === 'view' ? selectedTechnician?.phone || '' : formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        value={modalType === 'view' ? selectedTechnician?.status || '' : formData.status || 'Active'}
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
                      <label className="form-label">Experience (Years)</label>
                      <input
                        type="number"
                        value={modalType === 'view' ? selectedTechnician?.experienceYears || '' : formData.experienceYears || ''}
                        onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || ''})}
                        disabled={modalType === 'view'}
                        className="form-input"
                        placeholder="Enter years of experience"
                        min="0"
                        max="50"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        value={modalType === 'view' ? selectedTechnician?.address || '' : formData.address || ''}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                        placeholder="Enter address (optional)"
                      />
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  <div className="form-section">
                    <div className="section-header">
                      <label className="form-label">Skills & Proficiency</label>
                      {modalType !== 'view' && (
                        <button type="button" onClick={addSkill} className="add-skill-btn">
                          ➕ Add Skill
                        </button>
                      )}
                    </div>
                    
                    <div className="skills-form">
                      {(modalType === 'view' ? selectedTechnician?.skills || [] : formData.skills || []).map((skill, index) => (
                        <div key={index} className="skill-row">
                          <select
                            value={skill.name}
                            onChange={(e) => modalType !== 'view' && updateSkill(index, 'name', e.target.value)}
                            disabled={modalType === 'view'}
                            className="skill-select"
                          >
                            <option value="">Select Skill</option>
                            {skillsOptions.slice(1).map(skillOption => (
                              <option key={skillOption} value={skillOption}>{skillOption}</option>
                            ))}
                          </select>
                          
                          <select
                            value={skill.level}
                            onChange={(e) => modalType !== 'view' && updateSkill(index, 'level', e.target.value)}
                            disabled={modalType === 'view'}
                            className="level-select"
                          >
                            {proficiencyLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            placeholder="Experience (e.g., 5 years)"
                            value={skill.experience}
                            onChange={(e) => modalType !== 'view' && updateSkill(index, 'experience', e.target.value)}
                            disabled={modalType === 'view'}
                            className="experience-input"
                          />
                          
                          {modalType !== 'view' && (
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="remove-skill-btn"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {(modalType === 'view' ? selectedTechnician?.skills || [] : formData.skills || []).length === 0 && (
                        <div className="no-skills-message">
                          <p>No skills added yet</p>
                          {modalType !== 'view' && <p>Click "Add Skill" to get started</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {modalType === 'view' && (
                    <div className="view-details">
                      <div className="detail-row">
                        <span className="detail-label">Technician ID:</span>
                        <span className="detail-value">#{selectedTechnician?.id}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Rating:</span>
                        <span className="detail-value">{getRatingStars(selectedTechnician?.rating || 0)} ({selectedTechnician?.rating || 0})</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Completed Jobs:</span>
                        <span className="detail-value">{selectedTechnician?.completedJobs || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Join Date:</span>
                        <span className="detail-value">{formatDate(selectedTechnician?.joinDate || '')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Experience:</span>
                        <span className="detail-value">
                          {selectedTechnician?.experienceYears ? `${selectedTechnician.experienceYears} years` : 'Not specified'}
                        </span>
                      </div>
                      {selectedTechnician?.certifications && selectedTechnician.certifications.length > 0 && (
                        <div className="detail-row">
                          <span className="detail-label">Certifications:</span>
                          <div className="certifications-list">
                            {selectedTechnician.certifications.map((cert, index) => (
                              <span key={index} className="certification-badge">{cert}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Weekly Schedule:</span>
                        <div className="schedule-preview">
                          {daysOfWeek.map(day => (
                            <div key={day} className="schedule-day-preview">
                              <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                              <span className={`day-status ${selectedTechnician?.availability?.[day]?.available ? 'available' : 'unavailable'}`}>
                                {selectedTechnician?.availability?.[day]?.available 
                                  ? selectedTechnician?.availability?.[day]?.hours || 'Available'
                                  : 'Not Available'
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
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
                    {modalType === 'edit' ? 'Update' : 
                     modalType === 'schedule' ? 'Save Schedule' : 'Create'}
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

        .no-skills {
          color: #999;
          font-style: italic;
          font-size: 12px;
        }

        .experience-years {
          font-weight: 500;
          color: #555;
        }

        .form-section {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .add-skill-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .add-skill-btn:hover {
          background: #218838;
        }

        .skills-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-row {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px;
          background: white;
          border-radius: 6px;
          border: 1px solid #ddd;
        }

        .skill-select, .level-select {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .experience-input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .remove-skill-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .remove-skill-btn:hover {
          background: #c82333;
        }

        .no-skills-message {
          text-align: center;
          padding: 20px;
          color: #666;
          background: white;
          border-radius: 6px;
          border: 1px dashed #ddd;
        }

        .no-skills-message p {
          margin: 5px 0;
        }

        .schedule-form {
          padding: 20px 0;
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .schedule-day {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .day-name {
          font-weight: 600;
          color: #333;
          text-transform: capitalize;
        }

        .availability-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .hours-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .view-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }

        .detail-label {
          font-weight: 600;
          color: #555;
          min-width: 150px;
          flex-shrink: 0;
        }

        .detail-value {
          color: #333;
          flex: 1;
        }

        .certifications-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .certification-badge {
          background: #17a2b8;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .schedule-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .schedule-day-preview {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: white;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        .day-status.available {
          color: #28a745;
          font-weight: 500;
        }

        .day-status.unavailable {
          color: #dc3545;
          font-style: italic;
        }

        .form-input:disabled, .form-select:disabled {
          background: #f5f5f5;
          color: #666;
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

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 5px;
          color: #333;
        }

        .form-input, .form-select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #0984e3;
          box-shadow: 0 0 0 3px rgba(9, 132, 227, 0.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          max-width: 800px;
          width: 90%;
        }

        .modal-title {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 24px;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .modal-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .modal-btn.primary {
          background: #0984e3;
          color: white;
        }

        .modal-btn.primary:hover {
          background: #0b7dda;
        }

        .modal-btn.secondary {
          background: #6c757d;
          color: white;
        }

        .modal-btn.secondary:hover {
          background: #5a6268;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
          
          .form-group {
            margin-bottom: 15px;
          }
          
          .skill-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .schedule-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 20px;
            margin: 10px;
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default TechniciansManagement;