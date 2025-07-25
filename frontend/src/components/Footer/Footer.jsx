import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src={logo} alt="Digital Booking Logo" className="footer-logo" />
          <p>©{new Date().getFullYear()} Digital Booking</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;