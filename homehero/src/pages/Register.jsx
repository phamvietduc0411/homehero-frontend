import React, { useState } from 'react';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Wrench, ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net';

const authService = {
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/AppUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          passwordHash: userData.password // Note: Should be hashed on server
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          isSuccess: true,
          message: data.message || 'Đăng ký thành công',
          data: data.data
        };
      } else {
        return {
          isSuccess: false,
          message: data.message || 'Đăng ký thất bại'
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: 'Lỗi kết nối đến server. Vui lòng thử lại.'
      };
    }
  }
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
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
    
    return true;
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
      const response = await authService.register(formData);

      if (response.isSuccess) {
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
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
              <User className="w-8 h-8" />
            </div>
          </div>
          <h1 className="register-title">Đăng ký tài khoản khách hàng</h1>
          <p className="register-subtitle">Tạo tài khoản để sử dụng dịch vụ HomeHero</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
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
              <User className="w-5 h-5" />
              {loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
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
          <p>Bằng cách đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của HomeHero</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
