import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../styles/header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">efcon</h1>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/calculation">Расчет</Link>
        <Link to="/analytics">Аналитика</Link>
        <Link to="/subdivisions">Подразделения</Link>
      </nav>
      <button className="login-btn">
        <FaUser size={16} /> Войти
      </button>
    </header>
  );
};

export default Header;