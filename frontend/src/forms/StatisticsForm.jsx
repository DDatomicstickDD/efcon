import React from 'react';
import Input from '../components/UI/Input';
import Slider from '../components/UI/Slider';
import Card from '../components/UI/Card';

const StatisticsForm = ({ data = {}, onChange }) => {
  // Убираем id и department_id из data
  const { id, department_id, ...formData } = data;

  const handleChange = (field, value) => {
    onChange({
      ...formData, // Используем formData, а не data
      [field]: value
    });
  };

  const handleInputChange = (field) => (e) => {
    const value = parseInt(e.target.value) || 0;
    handleChange(field, value);
  };

  return (
    <Card title="Статистика">
      <div className="space-y-8">
        {/* Статистика пожаров */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Статистика пожаров</h3>
          <div className="form-grid">
            <Slider
              label="Среднее количество пожаров за 5 лет"
              min={0}
              max={200}
              value={formData.avg_fires_5years || 0}
              onChange={(value) => handleChange('avg_fires_5years', value)}
              unit="пожаров"
            />
          </div>
        </div>
        {/* Статистика расследований */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Статистика расследований</h3>
          <div className="form-grid">
            <Slider
              label="Зарегистрировано сообщений о пожарах и иных происшествиях"
              min={0}
              max={300}
              value={formData.avg_fire_reports || 0}
              onChange={(value) => handleChange('avg_fire_reports', value)}
              unit="сообщений"
            />
            <Slider
              label="Количество сообщений о преступлениях"
              min={0}
              max={50}
              value={formData.avg_crime_reports || 0}
              onChange={(value) => handleChange('avg_crime_reports', value)}
              unit="сообщений"
            />
            <Slider
              label="Передано по подследственности"
              min={0}
              max={100}
              value={formData.avg_cases_transferred || 0}
              onChange={(value) => handleChange('avg_cases_transferred', value)}
              unit="дел"
            />
            <Slider
              label="Отказано в возбуждении УД"
              min={0}
              max={100}
              value={formData.avg_cases_rejected || 0}
              onChange={(value) => handleChange('avg_cases_rejected', value)}
              unit="дел"
            />
            <Slider
              label="Возбуждено УД"
              min={0}
              max={100}
              value={formData.avg_criminal_cases || 0}
              onChange={(value) => handleChange('avg_criminal_cases', value)}
              unit="дел"
            />
          </div>
        </div>
        {/* Административные дела */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Административные дела</h3>
          <div className="form-grid">
            <Slider
              label="Количество возбужденных административных дел"
              min={0}
              max={200}
              value={(formData.admin_cases_20_4 || 0) + 
                     (formData.admin_cases_19_5 || 0) + 
                     (formData.admin_cases_20_6_20_7 || 0) + 
                     (formData.admin_cases_20_25 || 0)}
              onChange={(value) => {
                // Равномерно распределяем общее количество по статьям
                const perArticle = Math.floor(value / 4);
                handleChange('admin_cases_20_4', perArticle);
                handleChange('admin_cases_19_5', perArticle);
                handleChange('admin_cases_20_6_20_7', perArticle);
                handleChange('admin_cases_20_25', perArticle);
              }}
              unit="дел"
            />
            <Slider
              label="ст. 20.4 КоАП РФ"
              min={0}
              max={100}
              value={formData.admin_cases_20_4 || 0}
              onChange={(value) => handleChange('admin_cases_20_4', value)}
              unit="дел"
            />
            <Slider
              label="ст. 19.5 КоАП РФ"
              min={0}
              max={100}
              value={formData.admin_cases_19_5 || 0}
              onChange={(value) => handleChange('admin_cases_19_5', value)}
              unit="дел"
            />
            <Slider
              label="ст. 20.6, 20.7 КоАП РФ"
              min={0}
              max={100}
              value={formData.admin_cases_20_6_20_7 || 0}
              onChange={(value) => handleChange('admin_cases_20_6_20_7', value)}
              unit="дел"
            />
            <Slider
              label="ст. 20.25 КоАП РФ"
              min={0}
              max={100}
              value={formData.admin_cases_20_25 || 0}
              onChange={(value) => handleChange('admin_cases_20_25', value)}
              unit="дел"
            />
          </div>
          {/* Сводка административных дел */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-3">Сводка административных дел</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.admin_cases_20_4 || 0}</div>
                <div className="text-gray-600">ст. 20.4</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.admin_cases_19_5 || 0}</div>
                <div className="text-gray-600">ст. 19.5</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.admin_cases_20_6_20_7 || 0}</div>
                <div className="text-gray-600">ст. 20.6-20.7</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.admin_cases_20_25 || 0}</div>
                <div className="text-gray-600">ст. 20.25</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="font-bold text-lg text-gray-900">
                Всего административных дел: {(formData.admin_cases_20_4 || 0) + 
                                           (formData.admin_cases_19_5 || 0) + 
                                           (formData.admin_cases_20_6_20_7 || 0) + 
                                           (formData.admin_cases_20_25 || 0)}
              </div>
            </div>
          </div>
        </div>
        {/* Обращения граждан */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Обращения граждан</h3>
          <div className="form-grid">
            <Slider
              label="Количество рассмотренных обращений (жалоб)"
              min={0}
              max={300}
              value={formData.appeals_processed || 0}
              onChange={(value) => handleChange('appeals_processed', value)}
              unit="обращений"
            />
            <Slider
              label="Перенаправлено в иные органы"
              min={0}
              max={formData.appeals_processed || 300}
              value={formData.appeals_redirected || 0}
              onChange={(value) => handleChange('appeals_redirected', value)}
              unit="обращений"
            />
            <Slider
              label="Подано без использования ЕСИА"
              min={0}
              max={formData.appeals_processed || 300}
              value={formData.appeals_without_esia || 0}
              onChange={(value) => handleChange('appeals_without_esia', value)}
              unit="обращений"
            />
            <Slider
              label="Не требовали проведения КНМ"
              min={0}
              max={formData.appeals_processed || 300}
              value={formData.appeals_no_knm_required || 0}
              onChange={(value) => handleChange('appeals_no_knm_required', value)}
              unit="обращений"
            />
          </div>
          {/* Сводка обращений */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3">Сводка по обращениям</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.appeals_processed || 0}</div>
                <div className="text-gray-600">Рассмотрено</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.appeals_redirected || 0}</div>
                <div className="text-gray-600">Перенаправлено</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.appeals_without_esia || 0}</div>
                <div className="text-gray-600">Без ЕСИА</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{formData.appeals_no_knm_required || 0}</div>
                <div className="text-gray-600">Без КНМ</div>
              </div>
            </div>
          </div>
        </div>
        {/* Документооборот */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Документооборот подразделения</h3>
          <div className="form-grid">
            <Slider
              label="Входящих документов"
              min={0}
              max={1000}
              step={10}
              value={formData.incoming_documents || 0}
              onChange={(value) => handleChange('incoming_documents', value)}
              unit="документов"
            />
            <Slider
              label="Исходящих документов"
              min={0}
              max={1000}
              step={10}
              value={formData.outgoing_documents || 0}
              onChange={(value) => handleChange('outgoing_documents', value)}
              unit="документов"
            />
          </div>
          {/* Сводка документооборота */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3">Сводка документооборота</h4>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-purple-600 text-xl">{formData.incoming_documents || 0}</div>
                <div className="text-gray-600">Входящих документов</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600 text-xl">{formData.outgoing_documents || 0}</div>
                <div className="text-gray-600">Исходящих документов</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="font-bold text-lg text-gray-900">
                Всего документов: {(formData.incoming_documents || 0) + (formData.outgoing_documents || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatisticsForm;