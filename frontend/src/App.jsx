import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    avatar: null,
    coverImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('fullName', form.fullName);
      if (form.avatar) formData.append('avatar', form.avatar);
      if (form.coverImage) formData.append('coverImage', form.coverImage);

      const response = await axios.post('/api/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('User registered successfully!');
      setForm({ username: '', email: '', password: '', fullName: '', avatar: null, coverImage: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>User Registration</h1>
      <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username:</label>
          <input className="form-input" id="username" type="text" name="username" value={form.username} onChange={handleChange} required autoComplete="username" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email:</label>
          <input className="form-input" id="email" type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password:</label>
          <input className="form-input" id="password" type="password" name="password" value={form.password} onChange={handleChange} required autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name:</label>
          <input className="form-input" id="fullName" type="text" name="fullName" value={form.fullName} onChange={handleChange} required autoComplete="name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="avatar">Avatar:</label>
          <input className="form-input" id="avatar" type="file" name="avatar" accept="image/*" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="coverImage">Cover Image:</label>
          <input className="form-input" id="coverImage" type="file" name="coverImage" accept="image/*" onChange={handleChange} />
        </div>
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default App
