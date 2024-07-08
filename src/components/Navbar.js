import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleReload = (e) => {
    e.preventDefault();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav>
      <ul>
        <li>
          <a href="/" onClick={handleReload}>Početna</a>
        </li>
        <li>
          <Link to="/login">Prijava</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
