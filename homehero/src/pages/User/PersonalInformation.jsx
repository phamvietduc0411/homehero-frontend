import React, { useState, useEffect } from 'react';
import '../../styles/User/PersonalInformation.css';

const PersonalInformation = ({ userData }) => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: ''
    }
  });
  const [updating, setUpdating] = useState(false);
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch personal information
  const fetchPersonalInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/AppUser/${userData.id}/personal-information`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch personal information`);
      }

      const result = await response.json();
      console.log('Personal info API response:', result);
      
      if (result.data) {
        setPersonalInfo(result.data);
        setFormData({
          fullName: result.data.fullName || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          address: {
            street: result.data.address?.street || '',
            ward: result.data.address?.ward || '',
            district: result.data.address?.district || '',
            city: result.data.address?.city || ''
          }
        });
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching personal info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update personal information
  const updatePersonalInfo = async () => {
    // Validate form data
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.email.trim()) {
      alert('Vui lòng nhập email');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    try {
      setUpdating(true);
      console.log('Updating personal info with data:', formData);
      
      const response = await fetch(
        `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/AppUser/${userData.id}/personal-information`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      );

      const result = await response.json();
      console.log('Update API response:', result);

      if (response.ok && result.data) {
        setPersonalInfo(result.data);
        setIsEditing(false);
        setError(null);
        alert('Cập nhật thông tin thành công!');
      } else {
        throw new Error(result.message || 'Failed to update personal information');
      }
    } catch (err) {
      console.error('Error updating personal info:', err);
      alert('Có lỗi xảy ra khi cập nhật thông tin: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Change password
  const changePassword = async () => {
    // Validate password data
    if (!passwordData.currentPassword) {
      alert('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (!passwordData.newPassword) {
      alert('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      setChangingPassword(true);
      console.log('Changing password for user:', userData.id);
      
      const response = await fetch(
        `https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net/api/AppUser/${userData.id}/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordData)
        }
      );

      const result = await response.json();
      console.log('Change password API response:', result);
      
      if (response.ok && result.data?.success) {
        alert('Đổi mật khẩu thành công!');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(result.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Có lỗi xảy ra khi đổi mật khẩu: ' + err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  // Initialize data
  useEffect(() => {
    console.log('PersonalInformation - UserData received:', userData);
    if (userData?.id) {
      fetchPersonalInfo();
    } else {
      setLoading(false);
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    }
  }, [userData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle password input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling
      setFormData({
        fullName: personalInfo?.fullName || '',
        email: personalInfo?.email || '',
        phone: personalInfo?.phone || '',
        address: {
          street: personalInfo?.address?.street || '',
          ward: personalInfo?.address?.ward || '',
          district: personalInfo?.address?.district || '',
          city: personalInfo?.address?.city || ''
        }
      });
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  // Toggle password form
  const handlePasswordFormToggle = () => {
    setShowPasswordForm(!showPasswordForm);
    if (showPasswordForm) {
      // Reset password form when closing
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Không hợp lệ';
    }
  };

  // Format short date for display
  const formatShortDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Không hợp lệ';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div className="breadcrumb">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Hồ sơ cá nhân</span>
          </div>
          <h1 className="page-title">👤 Hồ sơ cá nhân</h1>
          <p className="page-subtitle">
            Quản lý thông tin tài khoản và xem thống kê sử dụng dịch vụ
          </p>
        </div>
        <div className="personal-info-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin cá nhân...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div className="breadcrumb">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Hồ sơ cá nhân</span>
          </div>
          <h1 className="page-title">👤 Hồ sơ cá nhân</h1>
          <p className="page-subtitle">
            Quản lý thông tin tài khoản và xem thống kê sử dụng dịch vụ
          </p>
        </div>
        <div className="personal-info-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchPersonalInfo}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Pages</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Hồ sơ cá nhân</span>
        </div>
        <h1 className="page-title">👤 Hồ sơ cá nhân</h1>
        <p className="page-subtitle">
          Quản lý thông tin tài khoản và xem thống kê sử dụng dịch vụ
        </p>
      </div>

      <div className="personal-info-container">
        {/* Personal Information Card */}
        <div className="info-card main-info-card">
          <div className="card-header">
            <h3>Thông tin cá nhân</h3>
            <div className="header-actions">
              {personalInfo?.canChangePassword && (
                <button 
                  className="password-btn"
                  onClick={handlePasswordFormToggle}
                  disabled={updating || changingPassword}
                  title="Đổi mật khẩu tài khoản"
                >
                  🔒 Đổi mật khẩu
                </button>
              )}
              <button 
                className={`edit-btn ${isEditing ? 'cancel' : 'edit'}`}
                onClick={handleEditToggle}
                disabled={updating || changingPassword}
                title={isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
              >
                {isEditing ? '❌ Hủy' : '✏️ Chỉnh sửa'}
              </button>
            </div>
          </div>

          <div className="card-content">
            {/* Basic Information Grid */}
            <div className="info-section">
              <h4 className="section-title">Thông tin cơ bản</h4>
              <div className="info-grid">
                <div className="info-field">
                  <label>Họ và tên *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nhập họ và tên đầy đủ"
                      required
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.fullName || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="info-field">
                  <label>Email *</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nhập địa chỉ email"
                      required
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.email || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="info-field">
                  <label>Số điện thoại *</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.phone || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="info-field">
                  <label>Trạng thái tài khoản</label>
                  <span className={`status-badge ${personalInfo?.isActive ? 'active' : 'inactive'}`}>
                    {personalInfo?.isActive ? '✅ Hoạt động' : '❌ Không hoạt động'}
                  </span>
                </div>

                <div className="info-field">
                  <label>Email đã xác thực</label>
                  <span className={`status-badge ${personalInfo?.emailConfirmed ? 'verified' : 'unverified'}`}>
                    {personalInfo?.emailConfirmed ? '✅ Đã xác thực' : '⚠️ Chưa xác thực'}
                  </span>
                </div>

                <div className="info-field">
                  <label>Ngày tham gia</label>
                  <span className="info-value">{formatDate(personalInfo?.createdAt)}</span>
                </div>

                <div className="info-field">
                  <label>Cập nhật lần cuối</label>
                  <span className="info-value">{formatDate(personalInfo?.updatedAt)}</span>
                </div>

                <div className="info-field">
                  <label>Đăng nhập lần cuối</label>
                  <span className="info-value">{formatDate(personalInfo?.lastLoginDate)}</span>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="info-section address-section">
              <h4 className="section-title">Địa chỉ liên hệ</h4>
              <div className="address-grid">
                <div className="info-field">
                  <label>Số nhà, tên đường</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Số 123, Đường ABC..."
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.address?.street || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="info-field">
                  <label>Phường/Xã</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.ward"
                      value={formData.address.ward}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Phường 1, Xã ABC..."
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.address?.ward || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="info-field">
                  <label>Quận/Huyện</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.district"
                      value={formData.address.district}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Quận 1, Huyện ABC..."
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.address?.district || 'Chưa cập nhật'}</span>
                  )}
                </div>

                <div className="info-field">
                  <label>Tỉnh/Thành phố</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Hồ Chí Minh, Hà Nội..."
                    />
                  ) : (
                    <span className="info-value">{personalInfo?.address?.city || 'Chưa cập nhật'}</span>
                  )}
                </div>
              </div>

              {personalInfo?.address?.fullAddress && (
                <div className="full-address">
                  <label>Địa chỉ đầy đủ:</label>
                  <span className="full-address-text">{personalInfo.address.fullAddress}</span>
                </div>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="form-actions">
                <button 
                  className="save-btn"
                  onClick={updatePersonalInfo}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Đang lưu...
                    </>
                  ) : (
                    '💾 Lưu thay đổi'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="info-card password-card">
            <div className="card-header">
              <h3>🔒 Đổi mật khẩu</h3>
              <button 
                className="close-btn"
                onClick={handlePasswordFormToggle}
                title="Đóng form đổi mật khẩu"
              >
                ✕
              </button>
            </div>
            <div className="card-content">
              <div className="password-form">
                <div className="password-info">
                  <p>Để bảo mật tài khoản, vui lòng nhập mật khẩu hiện tại và mật khẩu mới.</p>
                </div>

                <div className="info-field">
                  <label>Mật khẩu hiện tại *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="form-input"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div className="info-field">
                  <label>Mật khẩu mới *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="form-input"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    minLength="6"
                    required
                  />
                </div>

                <div className="info-field">
                  <label>Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="form-input"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={changePassword}
                    disabled={
                      changingPassword || 
                      !passwordData.currentPassword || 
                      !passwordData.newPassword || 
                      !passwordData.confirmPassword
                    }
                  >
                    {changingPassword ? (
                      <>
                        <span className="loading-spinner-small"></span>
                        Đang đổi...
                      </>
                    ) : (
                      '🔐 Đổi mật khẩu'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Card */}
        {personalInfo?.statistics && (
          <div className="info-card statistics-card">
            <div className="card-header">
              <h3>📊 Thống kê sử dụng dịch vụ</h3>
            </div>
            <div className="card-content">
              {personalInfo.statistics.totalBookings > 0 ? (
                <div className="stats-grid">
                  <div className="stat-item total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                      <div className="stat-number">{personalInfo.statistics.totalBookings}</div>
                      <div className="stat-label">Tổng đơn hàng</div>
                    </div>
                  </div>

                  <div className="stat-item completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <div className="stat-number">{personalInfo.statistics.completedBookings}</div>
                      <div className="stat-label">Đã hoàn thành</div>
                    </div>
                  </div>

                  <div className="stat-item pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <div className="stat-number">{personalInfo.statistics.pendingBookings}</div>
                      <div className="stat-label">Đang xử lý</div>
                    </div>
                  </div>

                  <div className="stat-item cancelled">
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                      <div className="stat-number">{personalInfo.statistics.cancelledBookings}</div>
                      <div className="stat-label">Đã hủy</div>
                    </div>
                  </div>

                  <div className="stat-item money">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <div className="stat-number">{personalInfo.statistics.formattedTotalSpent}</div>
                      <div className="stat-label">Tổng chi tiêu</div>
                    </div>
                  </div>

                  {personalInfo.statistics.averageRating && personalInfo.statistics.averageRating > 0 && (
                    <div className="stat-item rating">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-content">
                        <div className="stat-number">{personalInfo.statistics.averageRating.toFixed(1)}</div>
                        <div className="stat-label">Đánh giá trung bình</div>
                      </div>
                    </div>
                  )}

                  {personalInfo.statistics.lastBookingDate && (
                    <div className="stat-item date">
                      <div className="stat-icon">📅</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatShortDate(personalInfo.statistics.lastBookingDate)}</div>
                        <div className="stat-label">Đơn hàng gần nhất</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-stats">
                  <div className="no-stats-icon">📈</div>
                  <h4>Chưa có hoạt động nào</h4>
                  <p>Bạn chưa có đơn hàng nào. Hãy đặt dịch vụ đầu tiên để xem thống kê chi tiết!</p>
                  <div className="no-stats-actions">
                    <button className="primary-btn" onClick={() => window.location.href = '#booking'}>
                      🛠️ Đặt dịch vụ ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;