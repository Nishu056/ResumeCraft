import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Components/Home";
import Login from './Components/Login';
import Signp from './Components/Signp';
import AdminLogin from './Components/AdminLogin'
import Template from './Components/Template';
import Filter from './Components/Filter';
import Header from './Components/Header';
import HomeContainer from './Components/HomeContainer';
import Template1 from './Components/Template1';
import ProtectedLayout from './Components/ProtectedLayout';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signp />} />
                <Route path="/admin" element={<AdminLogin />} />
                {/* Passing searchTerm and setSearchTerm to Filter and Header */}
                <Route path="/homeContainer/Template1" element={<Template1 />} />
                <Route path="/homeContainer" element={<HomeContainer />} />
                <Route path="/filter" element={<Filter searchTerm={searchTerm} />} />
                <Route path="/header" element={<Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />

                <Route element={<ProtectedLayout />}>
                    <Route path="/template" element={<Template />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
