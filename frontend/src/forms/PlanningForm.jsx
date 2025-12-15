import React from 'react';
import Input from '../components/UI/Input';
import Slider from '../components/UI/Slider';
import Card from '../components/UI/Card';

const PlanningForm = ({ data = {}, onChange }) => {
  // Убираем id и department_id из data
  const { id, department_id, ...formData } = data;

  const handleChange = (field, value) => {
    onChange({
      ...formData, // Используем formData, а не data
      [field]: value
    });
  };

  return (
    <Card title="Планирование">
      <div className="form-grid">
        <Slider
          label="Запланировано плановых проверок"
          min={0}
          max={200}
          value={formData.planned_inspections || 0}
          onChange={(value) => handleChange('planned_inspections', value)}
        />
        <Slider
          label="Запланировано внеплановых проверок"
          min={0}
          max={100}
          value={formData.unplanned_inspections || 0}
          onChange={(value) => handleChange('unplanned_inspections', value)}
        />
        <Input
          label="Количество пропагандистских материалов (памяток, буклетов)"
          type="number"
          min="0"
          value={formData.propaganda_materials || ''}
          onChange={(e) => handleChange('propaganda_materials', parseInt(e.target.value) || 0)}
        />
        <Input
          label="Количество отчетных сведений"
          type="number"
          min="0"
          value={formData.reports_count || ''}
          onChange={(e) => handleChange('reports_count', parseInt(e.target.value) || 0)}
        />
        <Slider
          label="Запланировано профилактических мероприятий"
          min={0}
          max={50}
          value={formData.preventive_measures || 0}
          onChange={(value) => handleChange('preventive_measures', value)}
        />
        <Input
          label="Количество консультаций, разъяснений"
          type="number"
          min="0"
          value={formData.consultations || ''}
          onChange={(e) => handleChange('consultations', parseInt(e.target.value) || 0)}
        />
        <Input
          label="Количество анализов и аналитических материалов"
          type="number"
          min="0"
          value={formData.analytical_materials || ''}
          onChange={(e) => handleChange('analytical_materials', parseInt(e.target.value) || 0)}
        />
        <Input
          label="Количество совещаний"
          type="number"
          min="0"
          value={formData.meetings_count || ''}
          onChange={(e) => handleChange('meetings_count', parseInt(e.target.value) || 0)}
        />
        <Input
          label="Количество уголовных дел"
          type="number"
          min="0"
          value={formData.criminal_cases || ''}
          onChange={(e) => handleChange('criminal_cases', parseInt(e.target.value) || 0)}
        />
      </div>
    </Card>
  );
};

export default PlanningForm;