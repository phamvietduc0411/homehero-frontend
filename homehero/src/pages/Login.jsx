import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    alert('Đăng nhập thành công!');
  };

  return (
    <div className="login-split-container">
      <div className="login-left">
        <div className="lotus-logo">
          {/* <svg width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10C55 30 80 30 80 50C80 60 60 65 50 60C40 65 20 60 20 50C20 30 45 30 50 10Z" fill="#E573B3"/>
            <path d="M50 10C52 25 70 30 70 45C70 55 55 60 50 55C45 60 30 55 30 45C30 30 48 25 50 10Z" fill="#FFB6B9"/>
            <path d="M50 10C51 20 60 25 60 40C60 50 53 53 50 50C47 53 40 50 40 40C40 25 49 20 50 10Z" fill="#FF8C8C"/>
          </svg> */}
        </div>
        <h1 className="lotus-title">We are the Home Hero Team</h1>
        <p className="lotus-sub">Please login to your account</p>
        <form onSubmit={handleSubmit} className="lotus-form">
          <input
            type="text"
            className="lotus-input"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="lotus-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="lotus-btn" type="submit">LOG IN</button>
        </form>
        <a href="#" className="lotus-forgot">Forgot password?</a>
        <div className="lotus-create-account">
          <span>Don't have an account?</span>
          <button className="lotus-create-btn" onClick={() => navigate('/register')}>CREATE NEW</button>
        </div>
      </div>
      <div className="login-right">
        <h2>We are more than just a company</h2>
        <p>
        A leading platform connecting customers with trusted repair, maintenance, and home improvement services. With a team of skilled professionals and a streamlined booking process, Home Hero ensures a quick, safe, and cost-effective experience to keep your home in top condition. 🛠️✨
        </p>
      </div>
    </div>
  );
}

export default Login; 