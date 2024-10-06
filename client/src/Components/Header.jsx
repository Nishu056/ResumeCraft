import React, { useState, useEffect } from 'react';
import './header.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Header = ({ searchTerm, setSearchTerm }) => {  // Pass props from a parent component
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); 
    
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 2000);
    }, []);

    const handleSearchTerm = (e) => {
        setSearchTerm(e.target.value); 
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);                  
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin')
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className='header'>

        <img src={logo} alt="logo" className='logo' />

        <div className='fields'>
                <input type="text" className='field' placeholder='Search here...' onChange={handleSearchTerm} value={searchTerm} />
        </div>
                <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>   
    );
};

export default Header;
