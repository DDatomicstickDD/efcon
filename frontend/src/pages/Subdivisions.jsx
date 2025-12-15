import React, { useState, useEffect } from 'react';
import { departmentsAPI } from '../utils/api';
import '../styles/subdivisions.css';

const Subdivisions = () => {
  const [subdivisions, setSubdivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', leader: '', count: '', tech: '' });

  useEffect(() => {
    const fetchSubdivisions = async () => {
      try {
        const response = await departmentsAPI.getAll();
        setSubdivisions(response.data);
      } catch (error) {
        console.error("Ошибка загрузки подразделений", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubdivisions();
  }, []);

  const handleAdd = () => setShowModal(true);
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Введите название подразделения");
      return;
    }
    try {
      await departmentsAPI.create({ name: formData.name });
      const response = await departmentsAPI.getAll();
      setSubdivisions(response.data);
      setShowModal(false);
      setFormData({ name: '', leader: '', count: '', tech: '' });
    } catch (error) {
      console.error("Ошибка создания подразделения", error);
      alert("Ошибка при создании подразделения");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить это подразделение?")) return;
    try {
      await departmentsAPI.delete(id);
      setSubdivisions(subdivisions.filter(s => s.id !== id));
    } catch (error) {
      console.error("Ошибка удаления подразделения", error);
      alert("Ошибка при удалении подразделения");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'critical': return 'Критическое состояние';
      case 'warning': return 'Предупреждение';
      case 'none': return 'Нет данных';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'critical': return 'red';
      case 'warning': return 'yellow';
      case 'none': return 'white';
      default: return 'gray';
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="subdivisions-container">
      <h2>Управление подразделениями</h2>
      <button onClick={handleAdd} className="primary-btn">Добавить подразделение</button>

      <table className="subdivisions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Создано</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {subdivisions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.name}</td>
              <td>{new Date(sub.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(sub.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Добавить подразделение</h3>
            <input name="name" placeholder="Название" value={formData.name} onChange={handleChange} />
            <div>
              <button onClick={handleSave}>Сохранить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subdivisions;