import React from 'react';
import Input from '../components/UI/Input';
import Slider from '../components/UI/Slider';
import Card from '../components/UI/Card';

const PersonnelForm = ({ data = {}, onChange }) => {
  // Убираем id и department_id из data
  const { id, department_id, ...formData } = data;

  const handleChange = (field, value) => {
    onChange({
      ...formData, // Используем formData, а не data
      [field]: value
    });
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    handleChange(field, value);
  };

  return (
    <Card title="Личный состав">
      <div className="form-grid">
        <Slider
          label="Общее количество сотрудников"
          min={0}
          max={50}
          value={formData.total_count || 0}
          onChange={(value) => handleChange('total_count', value)}
          unit="чел."
        />
        <Slider
          label="Средний стаж работы"
          min={0}
          max={25}
          value={formData.avg_experience || 0}
          onChange={(value) => handleChange('avg_experience', value)}
          unit="лет"
        />
        <Input
          label="Количество сотрудников без проф. образования"
          type="number"
          min="0"
          max={formData.total_count || 50}
          value={formData.no_prof_education_count || ''}
          onChange={handleInputChange('no_prof_education_count')}
          placeholder="0"
        />
        <Slider
          label="Средний возраст сотрудников"
          min={20}
          max={60}
          value={formData.avg_age || 30}
          onChange={(value) => handleChange('avg_age', value)}
          unit="лет"
        />
        <Slider
          label="Процент женщин в подразделении"
          min={0}
          max={100}
          value={formData.female_percentage || 0}
          onChange={(value) => handleChange('female_percentage', value)}
          unit="%"
        />
        <Input
          label="Количество сотрудников с юридическим образованием"
          type="number"
          min="0"
          max={formData.total_count || 50}
          value={formData.legal_education_count || ''}
          onChange={handleInputChange('legal_education_count')}
          placeholder="0"
        />
      </div>
    </Card>
  );
};

export default PersonnelForm;