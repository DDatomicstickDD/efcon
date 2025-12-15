from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    personnel = db.relationship('Personnel', backref='department', lazy=True, uselist=False)
    equipment = db.relationship('Equipment', backref='department', lazy=True, uselist=False)
    supervised_objects = db.relationship('SupervisedObjects', backref='department', lazy=True, uselist=False)
    statistics = db.relationship('Statistics', backref='department', lazy=True, uselist=False)
    planning = db.relationship('Planning', backref='department', lazy=True, uselist=False)

class Personnel(db.Model):
    __tablename__ = 'personnel'
    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), unique=True)
    
    # Quantitative characteristics
    total_count = db.Column(db.Integer, default=0)
    avg_experience = db.Column(db.Float, default=0)  # years
    no_prof_education_count = db.Column(db.Integer, default=0)
    avg_age = db.Column(db.Float, default=0)
    female_percentage = db.Column(db.Float, default=0)  # 0-100%
    legal_education_count = db.Column(db.Integer, default=0)
    
    # Productivity coefficients (will be calculated)
    experience_coef = db.Column(db.Float, default=1.0)
    education_coef = db.Column(db.Float, default=1.0)
    age_coef = db.Column(db.Float, default=1.0)

class Equipment(db.Model):
    __tablename__ = 'equipment'
    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), unique=True)
    
    # Техническое оснащение
    service_area = db.Column(db.Float, default=0)  # km²
    internet_access_points = db.Column(db.Integer, default=0)
    intra_access_points = db.Column(db.Integer, default=0)  # Новое поле: точки доступа в интранет
    locality_type = db.Column(db.String(50), default='urban')
    workstations = db.Column(db.Integer, default=0)
    printers = db.Column(db.Integer, default=0)
    has_service_cars = db.Column(db.Boolean, default=False)
    mfu_count = db.Column(db.Integer, default=0)
    mfu_stream_copy = db.Column(db.Integer, default=0)  # Новое поле: МФУ с поточным копированием
    
    # Equipment efficiency coefficient
    equipment_coef = db.Column(db.Float, default=1.0)

    risk_equipment_count_a = db.Column(db.Integer, default=0)  # ✅ Новое поле
    risk_equipment_count_b = db.Column(db.Integer, default=0)
    risk_equipment_count_v = db.Column(db.Integer, default=0)
    risk_equipment_count_g = db.Column(db.Integer, default=0)
    risk_equipment_count_d = db.Column(db.Integer, default=0)

class SupervisedObjects(db.Model):
    __tablename__ = 'supervised_objects'
    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), unique=True)
    
    # Fire safety supervision objects (ФГПН)
    fgpn_count = db.Column(db.Integer, default=0)
    
    # Категории риска объектов ФГПН (поля ввода)
    risk_category_a = db.Column(db.Integer, default=0)  # Категория А
    risk_category_b = db.Column(db.Integer, default=0)  # Категория Б  
    risk_category_v = db.Column(db.Integer, default=0)  # Категория В
    risk_category_g = db.Column(db.Integer, default=0)  # Категория Г
    risk_category_d = db.Column(db.Integer, default=0)  # Категория Д
    
    # Settlements (ОМС)
    oms_settlements_count = db.Column(db.Integer, default=0)
    urban_settlements = db.Column(db.Integer, default=0)
    rural_settlements = db.Column(db.Integer, default=0)
    
    # Controlled entities (ФНТС)
    fnts_count = db.Column(db.Integer, default=0)
    
    # Категории риска ФНТС (поля ввода)
    fnts_risk_a = db.Column(db.Integer, default=0)
    fnts_risk_b = db.Column(db.Integer, default=0)
    fnts_risk_v = db.Column(db.Integer, default=0)
    fnts_risk_g = db.Column(db.Integer, default=0)
    fnts_risk_d = db.Column(db.Integer, default=0)
    
    # Emergency situations (ФНЭНТЧС)
    fnentchs_count = db.Column(db.Integer, default=0)
    
    # Категории риска ФНЭНТЧС (поля ввода)
    fnentchs_risk_a = db.Column(db.Integer, default=0)
    fnentchs_risk_b = db.Column(db.Integer, default=0)
    fnentchs_risk_v = db.Column(db.Integer, default=0)
    fnentchs_risk_g = db.Column(db.Integer, default=0)
    fnentchs_risk_d = db.Column(db.Integer, default=0)

class Statistics(db.Model):
    __tablename__ = 'statistics'
    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), unique=True)
    
    # Fire statistics (5-year average)
    avg_fires_5years = db.Column(db.Integer, default=0)
    
    # Investigation statistics
    avg_fire_reports = db.Column(db.Integer, default=0)
    avg_crime_reports = db.Column(db.Integer, default=0)
    avg_cases_transferred = db.Column(db.Integer, default=0)  # Передано по подследственности
    avg_cases_rejected = db.Column(db.Integer, default=0)     # Отказано в возбуждении УД
    avg_criminal_cases = db.Column(db.Integer, default=0)     # Возбуждено УД
    
    # Administrative cases by article
    admin_cases_20_4 = db.Column(db.Integer, default=0)  # ст. 20.4 КоАП РФ
    admin_cases_19_5 = db.Column(db.Integer, default=0)  # ст. 19.5 КоАП РФ
    admin_cases_20_6_20_7 = db.Column(db.Integer, default=0)  # ст. 20.6, 20.7 КоАП РФ
    admin_cases_20_25 = db.Column(db.Integer, default=0)  # ст. 20.25 КоАП РФ
    
    # Citizen appeals
    appeals_processed = db.Column(db.Integer, default=0)  # Количество рассмотренных обращений
    appeals_redirected = db.Column(db.Integer, default=0)  # Перенаправлено в иные органы
    appeals_without_esia = db.Column(db.Integer, default=0)  # Подано без использования ЕСИА
    appeals_no_knm_required = db.Column(db.Integer, default=0)  # Не требовали проведения КНМ
    
    # Document flow
    incoming_documents = db.Column(db.Integer, default=0)  # Входящих документов
    outgoing_documents = db.Column(db.Integer, default=0)  # Исходящих документов

class CalculationResult(db.Model):
    __tablename__ = 'calculation_results'
    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    
    # Actual working time fund
    actual_hours = db.Column(db.Float, default=0)
    actual_days = db.Column(db.Float, default=0)
    
    # Required working time fund
    required_hours = db.Column(db.Float, default=0)
    required_days = db.Column(db.Float, default=0)
    
    # Results
    employee_count = db.Column(db.Integer, default=0)
    deficit_count = db.Column(db.Integer, default=0)
    efficiency_coefficient = db.Column(db.Float, default=0)
    
    # Month for calculation
    calculation_month = db.Column(db.Integer, default=datetime.now().month)
    
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow)

class Planning(db.Model):
    __tablename__ = 'planning'
    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), unique=True)
    
    # Плановые и внеплановые проверки
    planned_inspections = db.Column(db.Integer, default=0)
    unplanned_inspections = db.Column(db.Integer, default=0)
    
    # Пропагандистские материалы
    propaganda_materials = db.Column(db.Integer, default=0)
    
    # Отчетные сведения
    reports_count = db.Column(db.Integer, default=0)
    
    # Профилактические мероприятия
    preventive_measures = db.Column(db.Integer, default=0)
    
    # Консультации и разъяснения
    consultations = db.Column(db.Integer, default=0)
    
    # Аналитические материалы
    analytical_materials = db.Column(db.Integer, default=0)
    
    # Совещания
    meetings_count = db.Column(db.Integer, default=0)
    
    # Уголовные дела
    criminal_cases = db.Column(db.Integer, default=0)