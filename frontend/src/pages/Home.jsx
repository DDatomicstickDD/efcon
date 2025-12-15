import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Система управления и расчета эффективности подразделений МЧС</h1>
        <p>Рассчитывайте, анализируйте и управляйте ресурсами оперативно и точно.</p>
        <Link to="/calculation" className="primary-btn">Начать расчет</Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Расчет эффективности</h3>
          <p>Интерактивный калькулятор для анализа работы подразделений.</p>
          <Link to="/calculation">Перейти →</Link>
        </div>
        <div className="feature-card">
          <h3>Сравнительная аналитика</h3>
          <p>Сравните два подразделения в наглядном виде.</p>
          <Link to="/analytics">Перейти →</Link>
        </div>
        <div className="feature-card">
          <h3>Управление подразделениями</h3>
          <p>Добавляйте, редактируйте и удаляйте подразделения.</p>
          <Link to="/subdivisions">Перейти →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;