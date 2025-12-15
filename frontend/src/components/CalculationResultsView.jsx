import React, { useState, useEffect } from 'react';
import { calculationsAPI } from '../utils/api';
import '../styles/calculation-results-view.css';

const CalculationResultsView = ({ subdivision, month }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subdivision && month) {
      fetchResults();
    }
  }, [subdivision, month]);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await calculationsAPI.calculate(subdivision, month);
      // response.data — это { success, calculation, month_info, recommendations }
      // Нам нужен только response.data.calculation
      const calculationData = response.data.calculation;
      const monthInfo = response.data.month_info;
      const recommendations = response.data.recommendations || [];

      setResults({
        calculation: calculationData,
        month_info: monthInfo,
        recommendations: recommendations
      });
    } catch (err) {
      console.error("Ошибка расчета", err);
      setError("Ошибка при выполнении расчета");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Расчет для месяца {getMonthName(month)}...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!results) return <div>Нет данных для отображения</div>;

  const { calculation, month_info, recommendations } = results;

  // Теперь calculation — это тот самый объект с actual_fund, personnel и т.д.
  const actualFund = calculation?.actual_fund || { hours: 0, days: 0 };
  const requiredFund = calculation?.required_fund || { hours: 0, days: 0 };
  const personnel = calculation?.personnel || { 
    current_count: 0, 
    deficit_count: 0, 
    required_count: 0, 
    utilization_rate: 0 
  };
  const efficiency = calculation?.efficiency || { total: 0, personnel: 0, equipment: 0 };

  // Используем MONTH из пропсов, но fallback на month_info
  const displayMonth = month;
  const monthHours = getMonthHours(displayMonth);

  // Определяем статус подразделения
  const getStatus = () => {
    const deficit = personnel.deficit_count || 0;
    const totalEfficiency = efficiency.total || 0;
    
    if (deficit > 3 || totalEfficiency < 0.7) {
      return { type: 'critical', text: 'Критическое состояние', color: 'red' };
    } else if (deficit >= 1 || totalEfficiency < 0.9) {
      return { type: 'warning', text: 'Требует внимания', color: 'yellow' };
    } else {
      return { type: 'good', text: 'Все показатели в норме', color: 'green' };
    }
  };

  const status = getStatus();

  return (
    <div className="calculation-results-view">
      <div className="results-header">
        <h3>Результаты расчета для подразделения</h3>
      </div>
      
      <div className="results-grid">
        {/* Статус подразделения */}
        <div className="result-card status-card">
          <h4>Статус подразделения</h4>
          <div className={`status-content ${
            status.color === 'red' ? 'bg-red-50 border-red-200' :
            status.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                status.color === 'red' ? 'bg-red-500' :
                status.color === 'yellow' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
              <div>
                <h3 className={`font-semibold ${
                  status.color === 'red' ? 'text-red-800' :
                  status.color === 'yellow' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {status.text}
                </h3>
                <p className={`text-sm ${
                  status.color === 'red' ? 'text-red-600' :
                  status.color === 'yellow' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {status.color === 'red' ? 'Требуется срочное вмешательство' :
                   status.color === 'yellow' ? 'Рекомендуется оптимизация' :
                   'Показатели в пределах нормы'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Информация о месяце */}
        <div className="result-card">
          <h4>Информация о расчете</h4>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-800">{getMonthName(displayMonth)}</p>
            <p className="text-blue-600">Рабочих часов в месяце: <strong>{monthHours}</strong></p>
            <p className="text-blue-600">Формула: Tfakt = {personnel.current_count} × {monthHours}</p>
          </div>
        </div>

        <div className="result-card">
          <h4>Фактический фонд рабочего времени</h4>
          <div className="space-y-2">
            <p>Рабочих часов: <strong>{actualFund.hours}</strong></p>
            <p>Рабочих дней: <strong>{actualFund.days}</strong></p>
            <p>Количество сотрудников: <strong>{personnel.current_count}</strong></p>
          </div>
        </div>

        <div className="result-card">
          <h4>Требуемый фонд рабочего времени</h4>
          <div className="space-y-2">
            <p>Рабочих часов: <strong>{requiredFund.hours}</strong></p>
            <p>Рабочих дней: <strong>{requiredFund.days}</strong></p>
            <p>Необходимо сотрудников: <strong>{personnel.required_count || 'N/A'}</strong></p>
          </div>
        </div>

        <div className="result-card result-card-highlight">
          <h4>Результаты расчета</h4>
          <div className="space-y-3">
            <div className={`text-xl font-bold ${
              personnel.deficit_count > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {personnel.deficit_count > 0 
                ? `Дефицит: ${personnel.deficit_count} сотрудников`
                : `Избыток: ${Math.abs(personnel.deficit_count)} сотрудников`
              }
            </div>
            <p>Загрузка персонала: <strong>{personnel.utilization_rate}%</strong></p>
            <p>Общая эффективность: <strong>{efficiency.total}</strong></p>
          </div>
        </div>

        <div className="result-card">
          <h4>Рекомендации</h4>
          <div className="recommendations">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-item ${rec.type || 'info'}`}>
                  {rec.message}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Нет рекомендаций</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getMonthName = (monthNumber) => {
  const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  return months[monthNumber - 1] || "Неизвестный месяц";
};

const getMonthHours = (monthNumber) => {
  const hours = {
    1: 120, 2: 125, 3: 130, 4: 135, 5: 140, 6: 145,
    7: 150, 8: 145, 9: 140, 10: 135, 11: 130, 12: 125
  };
  return hours[monthNumber] || 0;
};

export default CalculationResultsView;