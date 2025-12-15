import React, { useState, useEffect } from 'react';
import CustomSelect from '../components/CustomSelect';
import { calculationsAPI, departmentsAPI } from '../utils/api';
import '../styles/department-comparison-view.css';

const DepartmentComparisonView = ({ subA, subB }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subA && subB) {
      fetchComparison();
    }
  }, [subA, subB]);

  const fetchComparison = async () => {
    setLoading(true);
    setError('');
    try {
      // TODO: Реализовать роут сравнения на бэкенде
      // const response = await calculationsAPI.getDepartmentComparison(subA, subB);
      // setComparisonData(response.data);

      // Пока что используем заглушку
      setComparisonData({
        departments: [
          {
            id: subA,
            name: `Подразделение A (${subA})`,
            actual_hours: 1680,
            required_hours: 1800,
            efficiency: 0.93,
            employee_count: 10,
            deficit_count: 2
          },
          {
            id: subB,
            name: `Подразделение B (${subB})`,
            actual_hours: 1720,
            required_hours: 1650,
            efficiency: 1.04,
            employee_count: 12,
            deficit_count: 0
          }
        ]
      });
    } catch (err) {
      console.error("Ошибка загрузки сравнения", err);
      setError("Не удалось загрузить данные для сравнения");
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка сравнения...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!comparisonData) return <div>Нет данных для сравнения</div>;

  const [deptA, deptB] = comparisonData.departments;

  return (
    <div className="department-comparison-view">
      <h3>Сравнение подразделений</h3>
      <div className="comparison-grid">
        <div className="comparison-card">
          <h4>{deptA.name}</h4>
          <p>Факт. часы: <strong>{deptA.actual_hours}</strong></p>
          <p>Треб. часы: <strong>{deptA.required_hours}</strong></p>
          <p>Эффективность: <strong>{deptA.efficiency}</strong></p>
          <p>Сотрудников: <strong>{deptA.employee_count}</strong></p>
          <p>Дефицит: <strong>{deptA.deficit_count}</strong></p>
        </div>
        <div className="comparison-card">
          <h4>{deptB.name}</h4>
          <p>Факт. часы: <strong>{deptB.actual_hours}</strong></p>
          <p>Треб. часы: <strong>{deptB.required_hours}</strong></p>
          <p>Эффективность: <strong>{deptB.efficiency}</strong></p>
          <p>Сотрудников: <strong>{deptB.employee_count}</strong></p>
          <p>Дефицит: <strong>{deptB.deficit_count}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentComparisonView;