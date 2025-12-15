// hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunction, executeImmediately = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      // Не устанавливаем ошибку для 404 - это нормально
      if (err.response?.status !== 404) {
        setError(err.response?.data?.error || err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (executeImmediately) {
      execute();
    }
  }, []);

  return { data, loading, error, execute };
};