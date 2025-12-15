import React, { useState, useEffect } from 'react';
import { calculationsAPI, departmentsAPI } from '../utils/api';
import '../styles/comparison-chart.css';

const ComparisonChart = ({ subA, subB, chartType }) => {
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subA && subB) {
      fetchComparisonData();
    }
  }, [subA, subB, chartType]);

  const fetchComparisonData = async () => {
    setLoading(true);
    setError('');
    try {
      const [deptA, deptB, resultA, resultB] = await Promise.all([
        departmentsAPI.get(subA),
        departmentsAPI.get(subB),
        calculationsAPI.getResults(subA),
        calculationsAPI.getResults(subB)
      ]);

      setDataA({
        name: deptA.data.name,
        ...resultA.data
      });
      setDataB({
        name: deptB.data.name,
        ...resultB.data
      });
    } catch (err) {
      console.error("Ошибка загрузки данных для сравнения", err);
      setError("Не удалось загрузить данные для сравнения");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка данных для сравнения...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!dataA || !dataB) return <div>Нет данных для сравнения</div>;

  // Определяем значения для графика
  const getValue = (data) => {
    switch (chartType) {
      case 'hours':
        return data.actual_hours;
      case 'deficit':
        return data.deficit_count;
      case 'efficiency':
        return data.efficiency_coefficient;
      case 'utilization':
        // Загрузку персонала нужно получить из расчета staff_result
        // Для упрощения, возьмем utilization_rate из результатов (если есть)
        // Или вычислим: actual_hours / required_hours * 100
        return data.utilization_rate || (data.required_hours ? (data.actual_hours / data.required_hours) * 100 : 0);
      default:
        return 0;
    }
  };

  const valueA = getValue(dataA);
  const valueB = getValue(dataB);
  const labelA = dataA.name;
  const labelB = dataB.name;

  // Определяем максимальное значение для шкалы
  const maxValue = Math.max(Math.abs(valueA), Math.abs(valueB)) * 1.2;

  // Определяем заголовок и единицы измерения
  const getChartTitle = () => {
    switch (chartType) {
      case 'hours': return 'Фонд времени (часы)';
      case 'deficit': return 'Дефицит/избыток персонала';
      case 'efficiency': return 'Общая эффективность';
      case 'utilization': return 'Загрузка персонала (%)';
      default: return 'Сравнение';
    }
  };

  const getUnit = () => {
    switch (chartType) {
      case 'hours': return 'часов';
      case 'deficit': return 'чел.';
      case 'efficiency': return '';
      case 'utilization': return '%';
      default: return '';
    }
  };

  return (
    <div className="comparison-chart">
      <h3>{getChartTitle()}</h3>
      <div className="chart-container">
        {/* Ось Y */}
        <div className="y-axis">
          {[0, 25, 50, 75, 100].map((percent, i) => (
            <div key={i} className="y-tick">
              <span className="y-label">
                {chartType === 'efficiency' 
                  ? (maxValue * (percent / 100)).toFixed(2)
                  : Math.round(maxValue * (percent / 100))
                }
              </span>
            </div>
          ))}
        </div>

        {/* Столбцы */}
        <div className="bars">
          <div className="bar-group">
            <div 
              className="bar bar-a" 
              style={{ height: `${Math.abs(valueA) / maxValue * 100}%` }}
            ></div>
            <div className="bar-label">{labelA}</div>
            <div className="bar-value">{valueA.toFixed(2)} {getUnit()}</div>
          </div>
          <div className="bar-group">
            <div 
              className="bar bar-b" 
              style={{ height: `${Math.abs(valueB) / maxValue * 100}%` }}
            ></div>
            <div className="bar-label">{labelB}</div>
            <div className="bar-value">{valueB.toFixed(2)} {getUnit()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;