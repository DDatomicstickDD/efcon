import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>efcon © 2025</p>
      <div>
        <a href="#">Поддержка</a>
        <a href="https://github.com/DDatomicstickDD/efcon" target="_blank" rel="noopener noreferrer">
          Документация
        </a>
        <a href="#">Контакты</a>
      </div>
    </footer>
  );
};

export default Footer;