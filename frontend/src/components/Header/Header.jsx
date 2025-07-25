import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="Digital Booking Logo" className="logo" />
          <span className="slogan">Encuentra tu lugar perfecto</span>
        </Link>
      </div>
      <div className="header-right">
        <button className="btn-login">Iniciar sesión</button>
        <button className="btn-signup">Crear cuenta</button>
      </div>
    </header>
  );
};

export default Header;