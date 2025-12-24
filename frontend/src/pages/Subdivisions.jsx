// frontend/src/pages/Subdivisions.jsx

import React, { useState, useEffect } from 'react';
import { departmentsAPI, calculationsAPI } from '../utils/api';
import '../styles/subdivisions.css';

const Subdivisions = () => {
  const [subdivisions, setSubdivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // ✅ Новое: режим редактирования
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    const fetchSubdivisionsWithCalculations = async () => {
      try {
        const deptsResponse = await departmentsAPI.getAll();
        const depts = deptsResponse.data;

        const deptsWithCalc = await Promise.all(
          depts.map(async (dept) => {
            try {
              const calcResponse = await calculationsAPI.getResults(dept.id);
              return { ...dept, calculation: calcResponse.data };
            } catch (error) {
              return { ...dept, calculation: null };
            }
          })
        );

        setSubdivisions(deptsWithCalc);
      } catch (error) {
        console.error("Ошибка загрузки подразделений", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubdivisionsWithCalculations();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  const openEditModal = (subdivision) => {
    setEditMode(true);
    setCurrentId(subdivision.id);
    setFormData({ name: subdivision.name });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Введите название подразделения");
      return;
    }

    try {
      if (editMode) {
        // Обновление
        await departmentsAPI.update(currentId, { name: formData.name.trim() });
        // Обновляем список локально
        setSubdivisions(subdivisions.map(sub =>
          sub.id === currentId ? { ...sub, name: formData.name } : sub
        ));
        alert("Подразделение обновлено");
      } else {
        // Создание
        await departmentsAPI.create({ name: formData.name });
        const response = await departmentsAPI.getAll();
        setSubdivisions(response.data.map(sub => ({ ...sub, calculation: null })));
        alert("Подразделение создано");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Ошибка сохранения", error);
      alert("Ошибка при сохранении подразделения");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить это подразделение?")) return;
    try {
      await departmentsAPI.delete(id);
      setSubdivisions(subdivisions.filter(s => s.id !== id));
    } catch (error) {
      console.error("Ошибка удаления", error);
      alert("Ошибка при удалении подразделения");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusInfo = (calculation) => {
    if (!calculation) {
      return { color: 'gray', tooltip: 'Расчёт не выполнялся' };
    }
    const deficit = calculation.deficit_count || 0;
    const efficiency = calculation.efficiency_coefficient || 0;
    if (deficit > 3 || efficiency < 0.7) {
      return { color: 'red', tooltip: 'Критическое состояние\nТребуется срочное вмешательство' };
    } else if (deficit >= 1 || efficiency < 0.9) {
      return { color: 'yellow', tooltip: 'Требует внимания\nРекомендуется оптимизация' };
    } else {
      return { color: 'green', tooltip: 'Все показатели в норме\nПоказатели в пределах нормы' };
    }
  };

  if (loading) return <div className="subdivisions-container">Загрузка...</div>;

  return (
    <div className="subdivisions-container">
      <h2>Управление подразделениями</h2>
      <button onClick={openCreateModal} className="primary-btn">Добавить подразделение</button>

      <table className="subdivisions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Создано</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {subdivisions.map(sub => {
            const status = getStatusInfo(sub.calculation);
            return (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.name}</td>
                <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="status-indicator-wrapper">
                    <div
                      className={`status-indicator status-${status.color}`}
                      title={status.tooltip}
                    ></div>
                  </div>
                </td>
                <td>
                  <button onClick={() => openEditModal(sub)}>Редактировать</button>
                  <button onClick={() => handleDelete(sub.id)}>Удалить</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? 'Редактировать подразделение' : 'Добавить подразделение'}</h3>
            <input
              name="name"
              placeholder="Название подразделения"
              value={formData.name}
              onChange={handleChange}
              className="modal-input"
            />
            <div className="modal-actions">
              <button onClick={handleSave} className="primary-btn">
                {editMode ? 'Сохранить' : 'Создать'}
              </button>
              <button onClick={() => setShowModal(false)} className="secondary-btn">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subdivisions;