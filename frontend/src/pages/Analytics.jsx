import React, { useState, useEffect } from 'react';
import CustomSelect from '../components/CustomSelect';
import CalculationResultsView from '../components/CalculationResultsView';
import ComparisonChart from '../components/ComparisonChart'; // ✅ Новый компонент
import { departmentsAPI } from '../utils/api';
import '../styles/analytics.css';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [subdivision, setSubdivision] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [subA, setSubA] = useState('');
  const [subB, setSubB] = useState('');
  const [chartType, setChartType] = useState('hours'); // ✅ Новый стейт
  const [subdivisions, setSubdivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubdivisions = async () => {
      try {
        const response = await departmentsAPI.getAll();
        setSubdivisions(response.data);
        if (response.data.length > 0) {
          const firstId = response.data[0].id;
          setSubdivision(firstId);
          setSubA(firstId);
          setSubB(firstId);
        }
      } catch (error) {
        console.error("Ошибка загрузки подразделений", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubdivisions();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  const tabs = [
    { id: 'results', label: 'Результаты расчетов', component: <CalculationResultsView subdivision={subdivision} month={month} /> },
    { 
      id: 'comparison', 
      label: 'Сравнение подразделений', 
      component: (
        <>
          <div className="analytics-controls">
            <label>График:</label>
            <CustomSelect
              options={[
                { value: 'hours', label: 'Фонд времени (часы)' },
                { value: 'deficit', label: 'Дефицит/избыток персонала' },
                { value: 'efficiency', label: 'Общая эффективность' },
                { value: 'utilization', label: 'Загрузка персонала (%)' }
              ]}
              value={chartType}
              onChange={setChartType}
            />
          </div>
          <ComparisonChart 
            subA={subA} 
            subB={subB} 
            chartType={chartType} 
          />
        </>
      ) 
    },
  ];

  const monthsOptions = [
    { value: 1, label: 'Январь' },
    { value: 2, label: 'Февраль' },
    { value: 3, label: 'Март' },
    { value: 4, label: 'Апрель' },
    { value: 5, label: 'Май' },
    { value: 6, label: 'Июнь' },
    { value: 7, label: 'Июль' },
    { value: 8, label: 'Август' },
    { value: 9, label: 'Сентябрь' },
    { value: 10, label: 'Октябрь' },
    { value: 11, label: 'Ноябрь' },
    { value: 12, label: 'Декабрь' },
  ];

  return (
    <div className="analytics-container">
      <h2>Аналитика</h2>

      {activeTab === 'results' && (
        <div className="analytics-controls">
          <label>Подразделение:</label>
          <CustomSelect
            options={subdivisions.map(s => ({ value: s.id, label: s.name }))}
            value={subdivision}
            onChange={setSubdivision}
          />
          <label>Месяц:</label>
          <CustomSelect
            options={monthsOptions}
            value={month}
            onChange={setMonth}
          />
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="analytics-controls">
          <label>Подразделение A:</label>
          <CustomSelect
            options={subdivisions.map(s => ({ value: s.id, label: s.name }))}
            value={subA}
            onChange={setSubA}
          />
          <label>Подразделение B:</label>
          <CustomSelect
            options={subdivisions.map(s => ({ value: s.id, label: s.name }))}
            value={subB}
            onChange={setSubB}
          />
        </div>
      )}

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.find(t => t.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default Analytics;