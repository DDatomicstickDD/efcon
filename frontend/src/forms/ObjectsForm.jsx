import React from 'react';
import Slider from '../components/UI/Slider';
import Card from '../components/UI/Card';

const ObjectsForm = ({ data = {}, onChange }) => {
  // Убираем id и department_id из data
  const { id, department_id, ...formData } = data;

  const handleChange = (field, value) => {
    onChange({
      ...formData, // Используем formData, а не data
      [field]: value
    });
  };

  return (
    <Card title="Объекты надзора">
      <div className="space-y-8">
        {/* Объекты защиты (ФГПН) */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Объекты защиты (ФГПН)</h3>
          <div className="form-grid">
            <Slider
              label="Общее количество объектов защиты"
              min={0}
              max={1000}
              step={10}
              value={formData.fgpn_count || 0}
              onChange={(value) => handleChange('fgpn_count', value)}
              unit="объектов"
            />
          </div>
          <h4 className="font-medium text-gray-900 mb-4 mt-6">Распределение по категориям риска ФГПН</h4>
          <div className="form-grid">
            <Slider
              label="Категория А - Чрезвычайно высокий риск"
              min={0}
              max={formData.fgpn_count || 1000}
              value={formData.risk_category_a || 0}
              onChange={(value) => handleChange('risk_category_a', value)}
              unit="объектов"
            />
            <Slider
              label="Категория Б - Высокий риск"
              min={0}
              max={formData.fgpn_count || 1000}
              value={formData.risk_category_b || 0}
              onChange={(value) => handleChange('risk_category_b', value)}
              unit="объектов"
            />
            <Slider
              label="Категория В - Средний риск"
              min={0}
              max={formData.fgpn_count || 1000}
              value={formData.risk_category_v || 0}
              onChange={(value) => handleChange('risk_category_v', value)}
              unit="объектов"
            />
            <Slider
              label="Категория Г - Пониженный риск"
              min={0}
              max={formData.fgpn_count || 1000}
              value={formData.risk_category_g || 0}
              onChange={(value) => handleChange('risk_category_g', value)}
              unit="объектов"
            />
            <Slider
              label="Категория Д - Низкий риск"
              min={0}
              max={formData.fgpn_count || 1000}
              value={formData.risk_category_d || 0}
              onChange={(value) => handleChange('risk_category_d', value)}
              unit="объектов"
            />
          </div>
          {/* Сводка ФГПН */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">Сводка по категориям риска ФГПН</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-red-600">{formData.risk_category_a || 0}</div>
                <div className="text-gray-600">Кат. А</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">{formData.risk_category_b || 0}</div>
                <div className="text-gray-600">Кат. Б</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-600">{formData.risk_category_v || 0}</div>
                <div className="text-gray-600">Кат. В</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{formData.risk_category_g || 0}</div>
                <div className="text-gray-600">Кат. Г</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{formData.risk_category_d || 0}</div>
                <div className="text-gray-600">Кат. Д</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="font-bold text-lg text-gray-900">
                Всего объектов ФГПН: {formData.fgpn_count || 0} / 
                Распределено: {(formData.risk_category_a || 0) + 
                             (formData.risk_category_b || 0) + 
                             (formData.risk_category_v || 0) + 
                             (formData.risk_category_g || 0) + 
                             (formData.risk_category_d || 0)}
              </div>
            </div>
          </div>
        </div>
        {/* Населенные пункты (ОМС) */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Населенные пункты (ОМС)</h3>
          <div className="form-grid">
            <Slider
              label="Количество населенных пунктов"
              min={0}
              max={100}
              value={formData.oms_settlements_count || 0}
              onChange={(value) => handleChange('oms_settlements_count', value)}
              unit="пунктов"
            />
            <Slider
              label="Городских населенных пунктов"
              min={0}
              max={formData.oms_settlements_count || 100}
              value={formData.urban_settlements || 0}
              onChange={(value) => handleChange('urban_settlements', value)}
              unit="пунктов"
            />
            <Slider
              label="Сельских населенных пунктов"
              min={0}
              max={formData.oms_settlements_count || 100}
              value={formData.rural_settlements || 0}
              onChange={(value) => handleChange('rural_settlements', value)}
              unit="пунктов"
            />
          </div>
        </div>
        {/* Контролируемые лица (ФНТС) */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Контролируемые лица (ФНТС)</h3>
          <div className="form-grid">
            <Slider
              label="Общее количество контролируемых лиц"
              min={0}
              max={500}
              value={formData.fnts_count || 0}
              onChange={(value) => handleChange('fnts_count', value)}
              unit="лиц"
            />
          </div>
          <h4 className="font-medium text-gray-900 mb-4 mt-6">Распределение по категориям риска ФНТС</h4>
          <div className="form-grid">
            <Slider
              label="Категория А - Чрезвычайно высокий риск"
              min={0}
              max={formData.fnts_count || 500}
              value={formData.fnts_risk_a || 0}
              onChange={(value) => handleChange('fnts_risk_a', value)}
              unit="лиц"
            />
            <Slider
              label="Категория Б - Высокий риск"
              min={0}
              max={formData.fnts_count || 500}
              value={formData.fnts_risk_b || 0}
              onChange={(value) => handleChange('fnts_risk_b', value)}
              unit="лиц"
            />
            <Slider
              label="Категория В - Средний риск"
              min={0}
              max={formData.fnts_count || 500}
              value={formData.fnts_risk_v || 0}
              onChange={(value) => handleChange('fnts_risk_v', value)}
              unit="лиц"
            />
            <Slider
              label="Категория Г - Пониженный риск"
              min={0}
              max={formData.fnts_count || 500}
              value={formData.fnts_risk_g || 0}
              onChange={(value) => handleChange('fnts_risk_g', value)}
              unit="лиц"
            />
            <Slider
              label="Категория Д - Низкий риск"
              min={0}
              max={formData.fnts_count || 500}
              value={formData.fnts_risk_d || 0}
              onChange={(value) => handleChange('fnts_risk_d', value)}
              unit="лиц"
            />
          </div>
        </div>
        {/* Чрезвычайные ситуации (ФНЭНТЧС) */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Чрезвычайные ситуации (ФНЭНТЧС)</h3>
          <div className="form-grid">
            <Slider
              label="Общее количество объектов ЧС"
              min={0}
              max={500}
              value={formData.fnentchs_count || 0}
              onChange={(value) => handleChange('fnentchs_count', value)}
              unit="объектов"
            />
          </div>
          <h4 className="font-medium text-gray-900 mb-4 mt-6">Распределение по категориям риска ФНЭНТЧС</h4>
          <div className="form-grid">
            <Slider
              label="Категория А - Чрезвычайно высокий риск"
              min={0}
              max={formData.fnentchs_count || 500}
              value={formData.fnentchs_risk_a || 0}
              onChange={(value) => handleChange('fnentchs_risk_a', value)}
              unit="объектов"
            />
            <Slider
              label="Категория Б - Высокий риск"
              min={0}
              max={formData.fnentchs_count || 500}
              value={formData.fnentchs_risk_b || 0}
              onChange={(value) => handleChange('fnentchs_risk_b', value)}
              unit="объектов"
            />
            <Slider
              label="Категория В - Средний риск"
              min={0}
              max={formData.fnentchs_count || 500}
              value={formData.fnentchs_risk_v || 0}
              onChange={(value) => handleChange('fnentchs_risk_v', value)}
              unit="объектов"
            />
            <Slider
              label="Категория Г - Пониженный риск"
              min={0}
              max={formData.fnentchs_count || 500}
              value={formData.fnentchs_risk_g || 0}
              onChange={(value) => handleChange('fnentchs_risk_g', value)}
              unit="объектов"
            />
            <Slider
              label="Категория Д - Низкий риск"
              min={0}
              max={formData.fnentchs_count || 500}
              value={formData.fnentchs_risk_d || 0}
              onChange={(value) => handleChange('fnentchs_risk_d', value)}
              unit="объектов"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ObjectsForm;