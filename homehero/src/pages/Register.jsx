import React, { useState } from 'react';
import '../styles/Register.css';

function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    email: '',
    password: '',
    phone: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'radio' ? checked ? value : form[name] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    console.log('Form submitted:', form);
    alert('Đăng ký thành công!');
  };

  return (
    <div className="register-split-container">
      <div className="register-left">
        <div className="registration-form-card">
          <h2 className="registration-form-title">Registration Form</h2>
          <form onSubmit={handleSubmit} className="registration-form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                className="form-input"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="form-input"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                id="birthday"
                className="form-input"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="gender-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={form.gender === 'male'}
                    onChange={handleChange}
                    required
                  /> Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.gender === 'female'}
                    onChange={handleChange}
                    required
                  /> Female
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                name="email"
                placeholder=""
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className="form-input"
                name="phone"
                placeholder=""
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                className="form-input"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="">Choose option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
            </div>
            <div className="form-group full-width">
              <button className="submit-btn" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className="register-right">
        <h2>Join Home Hero Community</h2>
        <p>
          Become a part of our trusted network. Register now to access top-rated home services, manage your bookings, and enjoy a seamless experience with Home Hero!
        </p>
      </div>
    </div>
  );
}

export default Register;
