import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    setShowMenu(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="Digital Booking Logo" className="logo" />
          <span className="slogan">Encuentra tu lugar perfecto</span>
        </Link>
      </div>
      
      <div className="header-right">
        {user ? (
          <div className="user-menu-container">
            <button 
              className="avatar-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menú de usuario"
            >
              <div className="user-avatar">
                <div className="avatar-circle">
                  {user.initials}
                </div>
                <span className="user-name">{user.firstName}</span>
              </div>
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <Link 
                  to="/profile" 
                  className="menu-item"
                  onClick={() => setShowMenu(false)}
                >
                  Mi perfil
                </Link>
                <button 
                  className="menu-item"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate('/login')}>Iniciar sesión</button>
            <button className="btn-signup" onClick={() => navigate('/register')}>Crear cuenta</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;