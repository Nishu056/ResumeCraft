import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; 

const Login =   ({ toggleToAdmin, toggleToSignup }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const UserLogin = (e) => {
      e.preventDefault();
      axios.post('http://localhost:3000/login', { email, password })
          .then(result => {
              localStorage.setItem('token', result.data.token);
              navigate("/homeContainer");
          })
          .catch(err => {
              setError('Login failed. Please check your credentials and try again.');
          });
  };

  return (
    <div className="login">
      <h1>Login</h1>
       <div>{error}</div>
      <form onSubmit={UserLogin}>
        <div className="form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email"  value={email}  onChange={(e) => setEmail(e.target.value)} required  />
        </div>
        <div className="form">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button type="submit">Login</button>
        <p>
          Login as Admin?{' '}
          <span onClick={toggleToAdmin} style={{ cursor: 'pointer', color: 'blue' }}>
            Click here
          </span>
        </p>
        <p>
          Don't have an account?{' '}
          <span onClick={toggleToSignup} style={{ cursor: 'pointer', color: 'blue' }}>
            Signup now
          </span>
          </p>
      </form>
    </div>
  )
}

export default Login;
