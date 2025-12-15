import React from 'react';
import Input from '../components/UI/Input';
import Slider from '../components/UI/Slider';
import Select from '../components/UI/Select';
import Card from '../components/UI/Card';

const EquipmentForm = ({ data = {}, onChange }) => {
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

  const handleSelectChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'has_service_cars') {
      handleChange(field, value === 'true');
    } else {
      handleChange(field, value);
    }
  };

  return (
    <Card title="Оснащение">
      <div className="form-grid">
        <Input
          label="Обслуживаемая площадь"
          type="number"
          step="0.1"
          min="0"
          value={formData.service_area || ''}
          onChange={handleInputChange('service_area')}
          placeholder="0.0"
          unit="км²"
        />
        <Slider
          label="Количество точек доступа в интернет"
          min={0}
          max={50}
          value={formData.internet_access_points || 0}
          onChange={(value) => handleChange('internet_access_points', value)}
          unit="шт."
        />
        <Slider
          label="Количество точек доступа в интранет"
          min={0}
          max={50}
          value={formData.intra_access_points || 0}
          onChange={(value) => handleChange('intra_access_points', value)}
          unit="шт."
        />
        <Select
          label="Тип местности"
          value={formData.locality_type || 'urban'}
          onChange={handleSelectChange('locality_type')}
          options={[
            { value: 'urban', label: 'Городская местность' },
            { value: 'rural', label: 'Сельская местность' },
            { value: 'regional_center', label: 'Областной центр' }
          ]}
        />
        <Slider
          label="Количество рабочих мест (ПК)"
          min={0}
          max={50}
          value={formData.workstations || 0}
          onChange={(value) => handleChange('workstations', value)}
          unit="шт."
        />
        <Slider
          label="Количество принтеров"
          min={0}
          max={20}
          value={formData.printers || 0}
          onChange={(value) => handleChange('printers', value)}
          unit="шт."
        />
        <Select
          label="Наличие служебных автомобилей"
          value={formData.has_service_cars ? 'true' : 'false'}
          onChange={handleSelectChange('has_service_cars')}
          options={[
            { value: 'true', label: 'Имеется' },
            { value: 'false', label: 'Отсутствует' }
          ]}
        />
        <Slider
          label="Количество МФУ"
          min={0}
          max={10}
          value={formData.mfu_count || 0}
          onChange={(value) => handleChange('mfu_count', value)}
          unit="шт."
        />
        <Slider
          label="Количество МФУ с возможностью поточного копирования"
          min={0}
          max={formData.mfu_count || 10}
          value={formData.mfu_stream_copy || 0}
          onChange={(value) => handleChange('mfu_stream_copy', value)}
          unit="шт."
        />
      </div>
    </Card>
  );
};

export default EquipmentForm;