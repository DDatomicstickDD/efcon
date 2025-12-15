import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { departmentsAPI } from './utils/api';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Calculation from './pages/Calculation';
import Analytics from './pages/Analytics';
import Subdivisions from './pages/Subdivisions';
import Loader from './components/Loader';
import './App.css';

// Компонент для проверки статуса подразделений перед доступом к "Расчетам" и "Аналитике"
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasDepartments, setHasDepartments] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDepartments = async () => {
      try {
        const response = await departmentsAPI.getStatus();
        setHasDepartments(response.data.has_departments);
      } catch (error) {
        console.error("Ошибка проверки подразделений", error);
        setHasDepartments(true);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname === '/calculation' || location.pathname === '/analytics') {
      checkDepartments();
    } else {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if ((location.pathname === '/calculation' || location.pathname === '/analytics') && !hasDepartments && !loading) {
      alert("Для выполнения расчетов необходимо сначала создать подразделение.");
      navigate('/subdivisions');
    }
  }, [location.pathname, hasDepartments, loading, navigate]);

  if (loading && (location.pathname === '/calculation' || location.pathname === '/analytics')) {
    return <Loader />;
  }

  if ((location.pathname === '/calculation' || location.pathname === '/analytics') && hasDepartments) {
    return children;
  }

  return null;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculation" element={
              <ProtectedRoute>
                <Calculation />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/subdivisions" element={<Subdivisions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;