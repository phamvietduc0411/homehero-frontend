import React, { useState } from 'react';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    alert('Đăng nhập thành công!');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">🏠 <span>Home</span><span className="green">Hero</span></div>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button className="login-btn big" type="submit">Đăng nhập</button>
        </form>
        <div className="login-links">
          <a href="#" className="forgot">Quên mật khẩu?</a>
          <span> | </span>
          <a href="#" className="register">Đăng ký tài khoản mới</a>
        </div>
      </div>
    </div>
  );
}

export default Login; 