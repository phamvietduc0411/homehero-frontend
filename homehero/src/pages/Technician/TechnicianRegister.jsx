import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wrench, ArrowLeft, MapPin, Briefcase, User } from 'lucide-react';
import emailjs from '@emailjs/browser';
import '../../styles/Technician/TechnicianRegister.css';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_vgxk4zo', // Thay bằng service ID của bạn
  templateId: 'template_q5ryvfh', // Thay bằng template ID
  publicKey: 'sRe_wqnmfOrvSIi0Q' // Thay bằng public key của bạn
};

const TechnicianRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    experienceYears: '',
    skills: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: ''
    },
    motivation: '',
    portfolio: '',
    availability: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Basic info validation
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ (10-11 số)');
      return false;
    }
    
    // Password validation
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    // Professional info validation
    if (!formData.experienceYears) {
      setError('Vui lòng nhập số năm kinh nghiệm');
      return false;
    }
    
    if (parseInt(formData.experienceYears) < 0 || parseInt(formData.experienceYears) > 50) {
      setError('Số năm kinh nghiệm không hợp lệ (0-50 năm)');
      return false;
    }
    
    if (!formData.skills.trim()) {
      setError('Vui lòng nhập kỹ năng chuyên môn');
      return false;
    }
    
    // Address validation
    if (!formData.address.city.trim()) {
      setError('Vui lòng nhập thành phố');
      return false;
    }
    
    if (!formData.address.district.trim()) {
      setError('Vui lòng nhập quận/huyện');
      return false;
    }
    
    if (!formData.motivation.trim()) {
      setError('Vui lòng nhập lý do muốn trở thành thợ sửa chữa');
      return false;
    }
    
    return true;
  };

  const sendEmailNotification = async () => {
    try {
      const fullAddress = [
        formData.address.street,
        formData.address.ward,
        formData.address.district,
        formData.address.city
      ].filter(Boolean).join(', ');

      const templateParams = {
        to_email: 'admin@homehero.vn', // Admin email
        applicant_name: formData.fullName,
        applicant_email: formData.email,
        applicant_phone: formData.phone,
        experience_years: formData.experienceYears,
        skills: formData.skills,
        address: fullAddress,
        motivation: formData.motivation,
        portfolio: formData.portfolio || 'Không có',
        availability: formData.availability || 'Không có',
        application_date: new Date().toLocaleString('vi-VN'),
        subject: `Đơn đăng ký thợ sửa chữa - ${formData.fullName}`
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send email to admin
      const emailSent = await sendEmailNotification();
      
      if (emailSent) {
        setSuccess('Đơn đăng ký đã được gửi thành công! Admin sẽ xem xét và liên hệ với bạn trong vòng 2-3 ngày làm việc.');
        
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          experienceYears: '',
          skills: '',
          address: {
            street: '',
            ward: '',
            district: '',
            city: ''
          },
          motivation: '',
          portfolio: '',
          availability: ''
        });
        
        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        setError('Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại hoặc liên hệ trực tiếp với admin.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="technician-register-container">
      <div className="technician-register-card">
        <div className="register-header">
          <button 
            onClick={() => navigate('/login')} 
            className="back-button"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại đăng nhập
          </button>
          
          <div className="register-logo">
            <div className="logo-icon">
              <Wrench className="w-8 h-8" />
            </div>
          </div>
          <h1 className="register-title">Đăng ký làm thợ sửa chữa</h1>
          <p className="register-subtitle">Gửi thông tin để trở thành thành viên của HomeHero</p>
        </div>

        <form onSubmit={handleSubmit} className="technician-register-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">
              <User className="w-5 h-5" />
              Thông tin cá nhân
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập họ và tên đầy đủ"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập số điện thoại (10-11 số)"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nhập địa chỉ email"
                disabled={loading}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mật khẩu *</label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu *</label>
                <div className="password-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    placeholder="Nhập lại mật khẩu"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h3 className="section-title">
              <Briefcase className="w-5 h-5" />
              Thông tin chuyên môn
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số năm kinh nghiệm *</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập số năm kinh nghiệm"
                  min="0"
                  max="50"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Kỹ năng chuyên môn *</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Ví dụ: Sửa chữa điều hòa, máy giặt, tủ lạnh, điện nước, ống nước..."
                rows="3"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lý do muốn trở thành thợ sửa chữa *</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Chia sẻ lý do bạn muốn tham gia HomeHero..."
                rows="3"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio/Kinh nghiệm cụ thể (Tùy chọn)</label>
              <textarea
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Mô tả các dự án, công việc đã làm..."
                rows="3"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời gian có thể làm việc (Tùy chọn)</label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ví dụ: Thứ 2-6, 8h-17h hoặc Cuối tuần..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h3 className="section-title">
              <MapPin className="w-5 h-5" />
              Địa chỉ
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Thành phố *</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ví dụ: TP.HCM, Hà Nội..."
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quận/Huyện *</label>
                <input
                  type="text"
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ví dụ: Quận 1, Huyện Củ Chi..."
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phường/Xã</label>
                <input
                  type="text"
                  name="address.ward"
                  value={formData.address.ward}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ví dụ: Phường Bến Nghé..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đường/Số nhà</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ví dụ: 123 Nguyễn Huệ..."
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >
              <Wrench className="w-5 h-5" />
              {loading ? 'Đang gửi đơn đăng ký...' : 'Gửi đơn đăng ký'}
            </button>
          </div>

          <div className="login-link">
            <span>Đã có tài khoản? </span>
            <button
              type="button"
              className="login-link-button"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>

        <div className="register-info">
          <p>
            <strong>Lưu ý:</strong> Đơn đăng ký sẽ được gửi đến admin để xem xét. 
            Chúng tôi sẽ liên hệ với bạn trong vòng 2-3 ngày làm việc để thông báo kết quả.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechnicianRegister;