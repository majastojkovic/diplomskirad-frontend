import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false); // Stanje za prikaz forme za registraciju
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      navigate('/');
    } else {
      alert(data.detail);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: registerUsername, password: registerPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registracija uspešna!');
      navigate('/');
    } else {
      alert(data.detail);
    }
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm); // Menja stanje prikaza forme za registraciju
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Prijava</h1>
        <div>
          <label>Korisničko ime:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Lozinka:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-buttons">
          <button type="submit">Prijavi se</button>
          <button type="button" onClick={toggleRegisterForm}>
            Registruj se
          </button>
        </div>
      </form>

      {showRegisterForm && (
        <form className="register-form" onSubmit={handleRegister}>
          <h1>Registracija</h1>
          <div>
            <label>Korisničko ime:</label>
            <input type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
          </div>
          <div>
            <label>Lozinka:</label>
            <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
          </div>
          <button type="submit">Registruj se</button>
        </form>
      )}
    </div>
  );
};

export default Login;
