import React from 'react';
import Card from './UI/Card';

const EfficiencyChart = ({ efficiency }) => {
  // Проверяем что efficiency существует
  if (!efficiency) {
    return (
      <Card title="Показатели эффективности">
        <div className="text-center p-8">
          <p className="text-gray-500">Нет данных об эффективности</p>
        </div>
      </Card>
    );
  }

  // Безопасное извлечение данных
  const total = efficiency.total || 0;
  const personnel = efficiency.personnel || 0;
  const equipment = efficiency.equipment || 0;

  return (
    <Card title="Показатели эффективности">
      <div className="analytics-grid">
        <div className="metric-card">
          <div className="metric-label">Общая эффективность</div>
          <div className="metric-value" style={{ color: getEfficiencyColor(total) }}>
            {total.toFixed(2)}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Эффективность персонала</div>
          <div className="metric-value" style={{ color: getEfficiencyColor(personnel) }}>
            {personnel.toFixed(2)}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Эффективность оснащения</div>
          <div className="metric-value" style={{ color: getEfficiencyColor(equipment) }}>
            {equipment.toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};

const getEfficiencyColor = (value) => {
  if (value >= 1.1) return '#27ae60'; // зеленый
  if (value >= 0.9) return '#f39c12'; // оранжевый
  return '#e74c3c'; // красный
};

export default EfficiencyChart;