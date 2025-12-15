import React, { useState, useEffect } from 'react';
import CustomSelect from '../components/CustomSelect';
import PersonnelForm from '../forms/PersonnelForm';
import EquipmentForm from '../forms/EquipmentForm';
import ObjectsForm from '../forms/ObjectsForm';
import StatisticsForm from '../forms/StatisticsForm';
import PlanningForm from '../forms/PlanningForm';
import EfficiencyChart from '../components/EfficiencyChart';
import Recommendations from '../components/Recommendations';
import { departmentsAPI, personnelAPI, equipmentAPI, objectsAPI, statisticsAPI, planningAPI, calculationsAPI } from '../utils/api';
import '../styles/calculation.css';

const Calculation = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [subdivision, setSubdivision] = useState('');
  const [subdivisions, setSubdivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Состояния для форм
  const [personnelData, setPersonnelData] = useState({});
  const [equipmentData, setEquipmentData] = useState({});
  const [objectsData, setObjectsData] = useState({});
  const [statisticsData, setStatisticsData] = useState({});
  const [planningData, setPlanningData] = useState({});

  // Состояния для результатов
  const [calculationResult, setCalculationResult] = useState(null);
  const [efficiency, setEfficiency] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchSubdivisions = async () => {
      try {
        const response = await departmentsAPI.getAll();
        setSubdivisions(response.data);
        if (response.data.length > 0) {
          setSubdivision(response.data[0].id);
        }
      } catch (error) {
        console.error("Ошибка загрузки подразделений", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubdivisions();
  }, []);

  useEffect(() => {
    if (subdivision) {
      // Загружаем данные для выбранного подразделения
      const fetchData = async () => {
        try {
          const [personnel, equipment, objects, statistics, planning, results] = await Promise.allSettled([
            personnelAPI.get(subdivision),
            equipmentAPI.get(subdivision),
            objectsAPI.get(subdivision),
            statisticsAPI.get(subdivision),
            planningAPI.get(subdivision),
            calculationsAPI.getResults(subdivision), // Загружаем результаты расчета
          ]);

          if (personnel.status === 'fulfilled') setPersonnelData(personnel.value.data);
          if (equipment.status === 'fulfilled') setEquipmentData(equipment.value.data);
          if (objects.status === 'fulfilled') setObjectsData(objects.value.data);
          if (statistics.status === 'fulfilled') setStatisticsData(statistics.value.data);
          if (planning.status === 'fulfilled') setPlanningData(planning.value.data);
          if (results.status === 'fulfilled') {
            setCalculationResult(results.value.data);
            // Здесь можно обновить `efficiency` и `recommendations` из результатов
            // Пример: setEfficiency(results.value.data.efficiency);
            // Пример: setRecommendations(results.value.data.recommendations);
          }
        } catch (error) {
          console.error("Ошибка загрузки данных", error);
        }
      };

      fetchData();
    }
  }, [subdivision]);

  const handleSave = async (apiFunction, data) => {
    if (!subdivision) {
      alert("Сначала выберите подразделение");
      return;
    }
    try {
      // Удаляем поля, которые не нужны бэкенду
      const { id, department_id, ...cleanData } = data;

      // Убедимся, что обязательные поля присутствуют (для personnel)
      if (apiFunction === personnelAPI.save) {
        const requiredFields = ['total_count', 'avg_experience', 'avg_age'];
        requiredFields.forEach(field => {
          if (cleanData[field] === undefined) {
            cleanData[field] = 0;
          }
        });
      }

      await apiFunction(subdivision, cleanData);
      alert("Данные сохранены успешно");
    } catch (error) {
      console.error("Ошибка сохранения", error);
      alert("Ошибка сохранения данных");
    }
  };

  const handleCalculate = async () => {
    if (!subdivision) {
      alert("Сначала выберите подразделение");
      return;
    }
    try {
      const response = await calculationsAPI.calculate(subdivision);
      console.log("Результаты расчета:", response.data);
      setCalculationResult(response.data.calculation);
      setEfficiency(response.data.calculation.efficiency);
      setRecommendations(response.data.recommendations);
      alert("Расчет завершен");
    } catch (error) {
      console.error("Ошибка расчета", error);
      alert("Ошибка при выполнении расчета");
    }
  };

  const tabs = [
    { id: 'staff', label: 'Личный состав', component: <PersonnelForm data={personnelData} onChange={setPersonnelData} /> },
    { id: 'equipment', label: 'Оснащение', component: <EquipmentForm data={equipmentData} onChange={setEquipmentData} /> },
    { id: 'supervision', label: 'Объекты надзора', component: <ObjectsForm data={objectsData} onChange={setObjectsData} /> },
    { id: 'statistics', label: 'Статистика', component: <StatisticsForm data={statisticsData} onChange={setStatisticsData} /> },
    { id: 'planning', label: 'Планирование', component: <PlanningForm data={planningData} onChange={setPlanningData} /> },
  ];

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="calculation-container">
      <h2>Калькулятор эффективности</h2>

      <div className="input-form">
        <label>Выберите подразделение</label>
        <CustomSelect
          options={subdivisions.map(s => ({ value: s.id, label: s.name }))}
          value={subdivision}
          onChange={setSubdivision}
        />
      </div>

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

      {/* Отображение результатов и рекомендаций */}
      {calculationResult && (
        <div className="results-section">
          <EfficiencyChart efficiency={efficiency} />
          <Recommendations recommendations={recommendations} />
        </div>
      )}

      <div className="form-actions">
        <button
          className="secondary-btn"
          onClick={() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (currentTab) {
              let apiFunction;
              switch (activeTab) {
                case 'staff': apiFunction = personnelAPI.save; break;
                case 'equipment': apiFunction = equipmentAPI.save; break;
                case 'supervision': apiFunction = objectsAPI.save; break;
                case 'statistics': apiFunction = statisticsAPI.save; break;
                case 'planning': apiFunction = planningAPI.save; break;
                default: return;
              }
              const dataToSave = {
                'staff': personnelData,
                'equipment': equipmentData,
                'supervision': objectsData,
                'statistics': statisticsData,
                'planning': planningData
              }[activeTab];

              handleSave(apiFunction, dataToSave);
            }
          }}
        >
          Сохранить
        </button>
        <button className="primary-btn" onClick={handleCalculate}>
          Рассчитать
        </button>
      </div>
    </div>
  );
};

export default Calculation;