import React, { useState, useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto'
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Predikcija from './pages/Predikcija.js';

const App = () => {

  return (
    <div>
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/predikcija" element={<Predikcija />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
