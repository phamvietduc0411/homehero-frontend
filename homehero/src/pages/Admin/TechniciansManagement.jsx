import React, { useState, useEffect } from 'react';
import '../../styles/Admin/TechniciansManagement.css';

const TechniciansManagement = () => {
  // Sample technicians data
  const [technicians, setTechnicians] = useState([
    {
      id: 1,
      name: 'Thanh Nguyen',
      email: 'thanh.nguyen@homehero.vn',
      phone: '0901234567',
      address: '123 Nguyen Hue Street, District 1, HCMC',
      status: 'Active',
      joinDate: '2023-06-15',
      rating: 4.8,
      completedJobs: 156,
      avatar: '👨‍🔧',
      skills: [
        { name: 'Plumbing', level: 'Expert', experience: '5 years' },
        { name: 'Electrical', level: 'Intermediate', experience: '3 years' },
        { name: 'General Repair', level: 'Expert', experience: '6 years' }
      ],
      availability: {
        monday: { available: true, hours: '08:00-17:00' },
        tuesday: { available: true, hours: '08:00-17:00' },
        wednesday: { available: true, hours: '08:00-17:00' },
        thursday: { available: true, hours: '08:00-17:00' },
        friday: { available: true, hours: '08:00-17:00' },
        saturday: { available: true, hours: '09:00-15:00' },
        sunday: { available: false, hours: '' }
      },
      certifications: ['Licensed Plumber', 'Electrical Safety Certificate']
    },
    {
      id: 2,
      name: 'Hung Tran',
      email: 'hung.tran@homehero.vn',
      phone: '0912345678',
      address: '456 Le Loi Avenue, District 1, HCMC',
      status: 'Active',
      joinDate: '2023-03-20',
      rating: 4.6,
      completedJobs: 89,
      avatar: '👨‍🔧',
      skills: [
        { name: 'Electrical', level: 'Expert', experience: '7 years' },
        { name: 'Air Conditioning', level: 'Expert', experience: '5 years' },
        { name: 'Appliance Repair', level: 'Intermediate', experience: '4 years' }
      ],
      availability: {
        monday: { available: true, hours: '09:00-18:00' },
        tuesday: { available: true, hours: '09:00-18:00' },
        wednesday: { available: false, hours: '' },
        thursday: { available: true, hours: '09:00-18:00' },
        friday: { available: true, hours: '09:00-18:00' },
        saturday: { available: true, hours: '08:00-16:00' },
        sunday: { available: true, hours: '10:00-14:00' }
      },
      certifications: ['Master Electrician', 'HVAC Certified']
    },
    {
      id: 3,
      name: 'Lan Vu',
      email: 'lan.vu@homehero.vn',
      phone: '0923456789',
      address: '789 Vo Van Tan Street, District 3, HCMC',
      status: 'Active',
      joinDate: '2023-08-10',
      rating: 4.9,
      completedJobs: 234,
      avatar: '👩‍🔧',
      skills: [
        { name: 'Furniture Assembly', level: 'Expert', experience: '8 years' },
        { name: 'Carpentry', level: 'Expert', experience: '10 years' },
        { name: 'Interior Installation', level: 'Advanced', experience: '6 years' }
      ],
      availability: {
        monday: { available: true, hours: '07:00-16:00' },
        tuesday: { available: true, hours: '07:00-16:00' },
        wednesday: { available: true, hours: '07:00-16:00' },
        thursday: { available: true, hours: '07:00-16:00' },
        friday: { available: true, hours: '07:00-16:00' },
        saturday: { available: false, hours: '' },
        sunday: { available: false, hours: '' }
      },
      certifications: ['Professional Carpenter', 'Furniture Design Certificate']
    },
    {
      id: 4,
      name: 'Cuong Do',
      email: 'cuong.do@homehero.vn',
      phone: '0934567890',
      address: '101 Bach Dang Street, Da Nang',
      status: 'Inactive',
      joinDate: '2022-11-05',
      rating: 4.2,
      completedJobs: 67,
      avatar: '👨‍🔧',
      skills: [
        { name: 'Air Conditioning', level: 'Expert', experience: '6 years' },
        { name: 'Refrigeration', level: 'Advanced', experience: '4 years' },
        { name: 'General Maintenance', level: 'Intermediate', experience: '3 years' }
      ],
      availability: {
        monday: { available: false, hours: '' },
        tuesday: { available: false, hours: '' },
        wednesday: { available: false, hours: '' },
        thursday: { available: false, hours: '' },
        friday: { available: false, hours: '' },
        saturday: { available: false, hours: '' },
        sunday: { available: false, hours: '' }
      },
      certifications: ['HVAC Master Technician']
    },
    {
      id: 5,
      name: 'Mai Hoang',
      email: 'mai.hoang@homehero.vn',
      phone: '0945678901',
      address: '202 Tran Phu Street, Hanoi',
      status: 'Active',
      joinDate: '2023-01-12',
      rating: 4.7,
      completedJobs: 123,
      avatar: '👩‍🔧',
      skills: [
        { name: 'Appliance Repair', level: 'Expert', experience: '9 years' },
        { name: 'Electrical', level: 'Advanced', experience: '5 years' },
        { name: 'Smart Home Installation', level: 'Intermediate', experience: '2 years' }
      ],
      availability: {
        monday: { available: true, hours: '08:30-17:30' },
        tuesday: { available: true, hours: '08:30-17:30' },
        wednesday: { available: true, hours: '08:30-17:30' },
        thursday: { available: true, hours: '08:30-17:30' },
        friday: { available: true, hours: '08:30-17:30' },
        saturday: { available: true, hours: '09:00-13:00' },
        sunday: { available: false, hours: '' }
      },
      certifications: ['Appliance Repair Specialist', 'Smart Home Certified']
    }
  ]);

  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'add', 'schedule'
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [formData, setFormData] = useState({});

  const statusOptions = ['All', 'Active', 'Inactive'];
  const skillsOptions = ['All', 'Plumbing', 'Electrical', 'Air Conditioning', 'Appliance Repair', 'Furniture Assembly', 'Carpentry', 'General Repair', 'Smart Home Installation'];
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Filter and search logic
  useEffect(() => {
    let filtered = technicians;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(tech => tech.status === statusFilter);
    }
    
    if (skillFilter !== 'All') {
      filtered = filtered.filter(tech => 
        tech.skills.some(skill => skill.name === skillFilter)
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.phone.includes(searchTerm) ||
        tech.id.toString().includes(searchTerm) ||
        tech.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleStatusChange = (techId, newStatus) => {
    setTechnicians(prev => prev.map(tech => 
      tech.id === techId ? { ...tech, status: newStatus } : tech
    ));
  };

  const handleDelete = (techId) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      setTechnicians(prev => prev.filter(tech => tech.id !== techId));
    }
  };

  const handleEdit = (technician) => {
    setSelectedTechnician(technician);
    setFormData(technician);
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
    setFormData({ availability: { ...technician.availability } });
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
      joinDate: new Date().toISOString().split('T')[0],
      rating: 0,
      completedJobs: 0,
      avatar: '👨‍🔧',
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

  const handleSave = () => {
    if (modalType === 'edit') {
      setTechnicians(prev => prev.map(tech => 
        tech.id === selectedTechnician.id ? { ...tech, ...formData } : tech
      ));
    } else if (modalType === 'add') {
      const newTechnician = {
        ...formData,
        id: Math.max(...technicians.map(t => t.id)) + 1
      };
      setTechnicians(prev => [...prev, newTechnician]);
    } else if (modalType === 'schedule') {
      setTechnicians(prev => prev.map(tech => 
        tech.id === selectedTechnician.id ? { ...tech, availability: formData.availability } : tech
      ));
    }
    setShowModal(false);
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

  const formatDate = (dateString) => {
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

  return (
    <div className="technicians-management">
      {/* Header */}
      <div className="technicians-header">
        <div className="technicians-header-info">
          <h1>Technicians Management</h1>
          <p>Manage technicians, skills, and work schedules</p>
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
          <div className="status-card-count">{technicians.filter(t => t.status === 'Active').length}</div>
          <div className="status-badge active">Active</div>
        </div>
        <div className="status-card">
          <div className="status-card-count">{technicians.filter(t => t.status === 'Inactive').length}</div>
          <div className="status-badge inactive">Inactive</div>
        </div>
        <div className="status-card">
          <div className="status-card-count">{Math.round(technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length * 10) / 10}</div>
          <div className="status-badge rating">Avg Rating</div>
        </div>
        <div className="status-card">
          <div className="status-card-count">{technicians.reduce((sum, t) => sum + t.completedJobs, 0)}</div>
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
                <th>Rating</th>
                <th>Jobs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTechnicians.map((technician) => {
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
                        {technician.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className={`skill-badge ${skill.level.toLowerCase()}`}>
                            {skill.name}
                          </span>
                        ))}
                        {technician.skills.length > 2 && (
                          <span className="skills-more">+{technician.skills.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="rating-info">
                        <div className="rating-stars">{getRatingStars(technician.rating)}</div>
                        <div className="rating-number">{technician.rating}</div>
                      </div>
                    </td>
                    <td className="jobs-completed">
                      {technician.completedJobs}
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
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        value={modalType === 'view' ? selectedTechnician?.name || '' : formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={modalType === 'view' ? selectedTechnician?.email || '' : formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        value={modalType === 'view' ? selectedTechnician?.phone || '' : formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={modalType === 'view'}
                        className="form-input"
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
                  
                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      value={modalType === 'view' ? selectedTechnician?.address || '' : formData.address || ''}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={modalType === 'view'}
                      className="form-input"
                    />
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
                    </div>
                  </div>
                  
                  {modalType === 'view' && (
                    <div className="view-details">
                      <div className="detail-row">
                        <span className="detail-label">Rating:</span>
                        <span className="detail-value">{getRatingStars(selectedTechnician?.rating || 0)} ({selectedTechnician?.rating})</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Completed Jobs:</span>
                        <span className="detail-value">{selectedTechnician?.completedJobs}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Join Date:</span>
                        <span className="detail-value">{formatDate(selectedTechnician?.joinDate || '')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Certifications:</span>
                        <div className="certifications-list">
                          {selectedTechnician?.certifications?.map((cert, index) => (
                            <span key={index} className="certification-badge">{cert}</span>
                          ))}
                        </div>
                      </div>
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
    </div>
  );
};

export default TechniciansManagement;