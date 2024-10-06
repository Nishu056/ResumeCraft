import React, { useState } from "react";
import './login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signp = ({ toggleToLogin }) => { 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
      e.preventDefault();
      axios.post("http://localhost:3000/signup", { name, email, password })
      .then(result => {
          toggleToLogin(); 
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="login">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signp;
