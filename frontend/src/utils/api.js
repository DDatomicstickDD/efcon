import axios from 'axios';

// Базовый URL API
const API_BASE_URL = 'http://localhost:5000/api';

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API для подразделений
export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  get: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  getStatus: () => api.get('/departments/status'),
};

// API для персонала
export const personnelAPI = {
  get: (departmentId) => api.get(`/personnel/${departmentId}`),
  save: (departmentId, data) => api.post(`/personnel/${departmentId}`, data),
};

// API для оборудования
export const equipmentAPI = {
  get: (departmentId) => api.get(`/equipment/${departmentId}`),
  save: (departmentId, data) => api.post(`/equipment/${departmentId}`, data),
};

// API для объектов надзора
export const objectsAPI = {
  get: (departmentId) => api.get(`/objects/${departmentId}`),
  save: (departmentId, data) => api.post(`/objects/${departmentId}`, data),
};

// API для статистики
export const statisticsAPI = {
  get: (departmentId) => api.get(`/statistics/${departmentId}`),
  save: (departmentId, data) => api.post(`/statistics/${departmentId}`, data),
};

// API для планирования
export const planningAPI = {
  get: (departmentId) => api.get(`/planning/${departmentId}`),
  save: (departmentId, data) => api.post(`/planning/${departmentId}`, data),
};

// API для расчетов
export const calculationsAPI = {
  calculate: (departmentId, month = null) => {
    const data = month ? { month } : {};
    return api.post(`/calculate/${departmentId}`, data);
  },
  getResults: (departmentId) => api.get(`/results/${departmentId}`),
  getOptimization: () => api.get('/analytics/optimization'),
  getEfficiencyReport: () => api.get('/analytics/efficiency-report'),
  // TODO: Добавить метод для сравнения, когда будет готов на бэкенде
  // getDepartmentComparison: (idA, idB) => api.get(`/analytics/comparison/${idA}/${idB}`),
  getDepartmentComparison: () => api.get('/analytics/department-comparison'),
};

export default api;