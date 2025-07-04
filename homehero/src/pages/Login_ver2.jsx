// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Wrench, ChevronDown } from 'lucide-react';
import '../styles/Login_ver2.css';


const API_BASE_URL = 'https://homeheroapi-c6hngtg0ezcyeggg.southeastasia-01.azurewebsites.net';

const authService = {
  async login(loginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          userType: loginData.userType
        })
      });

      const data = await response.json();

      if (response.ok && data.isSuccess) {
        return {
          isSuccess: true,
          message: data.message,
          data: {
            accessToken: data.data.accessToken,
            userType: data.data.userType,
            user: {
              id: data.data.userId,
              email: data.data.email,
              name: data.data.fullName,
              phone: data.data.phone,
              userType: data.data.userType,
              experienceYears: data.data.experienceYears,
              skills: data.data.skills,
              address: data.data.address
            }
          }
        };
      } else {
        return {
          isSuccess: false,
          message: data.message || 'Đăng nhập thất bại'
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

const tokenManager = {
  setToken(token) {
    sessionStorage.setItem('authToken', token);
  },
  
  getToken() {
    return sessionStorage.getItem('authToken');
  },
  
  removeToken() {
    sessionStorage.removeItem('authToken'); 
    sessionStorage.removeItem('userData'); 
  },
  
  setUserData(userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  },
  
  getUserData() {
    const data = sessionStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  },
  
  removeUserData() {
    sessionStorage.removeItem('userData');
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUserData(); 
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);

  useEffect(() => {
    if (tokenManager.isAuthenticated()) {
      const userData = tokenManager.getUserData();
      if (userData.userType === 'User') {
        navigate('/user');
      } else if (userData.userType === 'Technician') {
        navigate('/technician');
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (userType) => {
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      setLoading(false);
      return;
    }

    try {
      const loginData = { ...formData, userType };
      const response = await authService.login(loginData);

      if (response.isSuccess) {
        tokenManager.setToken(response.data.accessToken);
        tokenManager.setUserData(response.data.user);
        
        // ✅ CLEAN: navigation without excessive logging
        if (response.data.user.userType === 'User') {
          navigate('/user');
        } else if (response.data.user.userType === 'Technician') {
          navigate('/technician');
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = (userType) => {
  setShowRegisterDropdown(false);
  if (userType === 'User') {
    navigate('/register');
  } else if (userType === 'Technician') {
    navigate('/register-technician');
  }
};
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.register-dropdown-container')) {
      setShowRegisterDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <Wrench className="w-8 h-8" />
            </div>
          </div>
          <h1 className="login-title">Chào mừng đến HomeHero</h1>
          <p className="login-subtitle">Đăng nhập để tiếp tục</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input password-input"
                placeholder="Nhập mật khẩu"
                disabled={loading}
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

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-buttons">
            <button
              type="button"
              onClick={() => handleSubmit('User')}
              disabled={loading}
              className="login-button login-button-user"
            >
              <User className="w-5 h-5" />
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập với tư cách Khách hàng'}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('Technician')}
              disabled={loading}
              className="login-button login-button-technician"
            >
              <Wrench className="w-5 h-5" />
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập với tư cách Thợ sửa chữa'}
            </button>
          </div>

          <div className="register-link">
  <div className="register-dropdown-container">
    <button
      type="button"
      className="register-dropdown-button"
      onClick={() => setShowRegisterDropdown(!showRegisterDropdown)}
      disabled={loading}
    >
      Đăng ký tài khoản mới
      <ChevronDown className={`w-4 h-4 transition-transform ${showRegisterDropdown ? 'rotate-180' : ''}`} />
    </button>
    
    {showRegisterDropdown && (
      <div className="register-dropdown-menu">
        <button
          type="button"
          className="register-dropdown-item"
          onClick={() => handleRegisterNavigation('User')}
        >
          <User className="w-4 h-4" />
          Đăng ký làm khách hàng
        </button>
        <button
          type="button"
          className="register-dropdown-item"
          onClick={() => handleRegisterNavigation('Technician')}
        >
          <Wrench className="w-4 h-4" />
          Đăng ký làm thợ sửa chữa
        </button>
      </div>
    )}
  </div>
</div>
        </div>

        <div className="test-info">
          <p>Nhập thông tin đăng nhập của bạn</p>
          <p>Liên hệ admin nếu chưa có tài khoản</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
export { tokenManager };