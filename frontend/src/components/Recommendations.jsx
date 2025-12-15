import React from 'react';
import Card from './UI/Card';

const Recommendations = ({ recommendations = [] }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card title="Рекомендации">
        <div className="text-center p-20">
          <p>Нет рекомендаций для отображения</p>
        </div>
      </Card>
    );
  }

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'suggestion': return '🔵';
      case 'info': return 'ℹ️';
      default: return '📌';
    }
  };

  return (
    <Card title="Рекомендации по оптимизации">
      <div className="recommendations">
        {recommendations.map((rec, index) => (
          <div key={index} className={`recommendation-item ${rec.type}`}>
            <div className="recommendation-header">
              <span className="recommendation-icon">
                {getRecommendationIcon(rec.type)}
              </span>
              <span className="recommendation-type">
                {getRecommendationTypeText(rec.type)}
              </span>
            </div>
            <div className="recommendation-message">
              {rec.message}
            </div>
            {rec.department && (
              <div className="recommendation-department">
                Подразделение: <strong>{rec.department}</strong>
              </div>
            )}
            {(rec.required || rec.surplus) && (
              <div className="recommendation-details">
                {rec.required && `Требуется: ${rec.required} сотрудников`}
                {rec.surplus && `Избыток: ${rec.surplus} сотрудников`}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const getRecommendationTypeText = (type) => {
  switch (type) {
    case 'critical': return 'Критически важно';
    case 'warning': return 'Внимание';
    case 'suggestion': return 'Рекомендация';
    case 'info': return 'Информация';
    case 'feasible': return 'Возможное решение';
    case 'partial': return 'Частичное решение';
    case 'need_staff': return 'Требуется персонал';
    case 'surplus_staff': return 'Избыток персонала';
    default: return 'Рекомендация';
  }
};

export default Recommendations;