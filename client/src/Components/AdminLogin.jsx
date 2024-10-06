import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/admin', { email, password })
      .then(result => {
        localStorage.setItem('admin', true)
        navigate("/template");
      })
      .catch(err => {
        console.error('Error:', err);
      });

  };

  return (
    <div className="login">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
