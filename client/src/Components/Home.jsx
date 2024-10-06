import React, { useState } from 'react';
import './home.css';
import res from '../assets/res.jpg';
import Login from './Login';
import Signp from './Signp';
import AdminLogin from './AdminLogin';

const Home = () => {
  const [authType, setAuthType] = useState('login'); 

  const toggleToSignup = () => {
    setAuthType('signup'); 
  };

  const toggleToAdmin = () => {
    setAuthType('admin'); 
  };

  return (
    <div>
      <div className="hero" style={{ backgroundImage: `url(${res})` }}>
        <div className="hero-left"></div>
        <div className="hero-content">
          <div className="hero-heading"><h1>A <span>Resume</span> that stands out!</h1></div>
          <div className="hero-title">Make your own resume <span>It's free</span></div>
        </div>
        <div className="hero-right">
          {authType === 'login' && <Login toggleToAdmin={toggleToAdmin} toggleToSignup={toggleToSignup} />}
          {authType === 'signup' && <Signp toggleToLogin={() => setAuthType('login')} />}
            
          {authType === 'admin' && <AdminLogin toggleToLogin={() => setAuthType('login')} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
