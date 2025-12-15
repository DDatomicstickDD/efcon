import numpy as np
from datetime import datetime

class TimeFundCalculator:
    """Калькулятор фондов рабочего времени с расширенной аналитикой"""
    
    # Базовые нормативы (в часах)
    BASE_WORKING_HOURS_PER_DAY = 8
    WORKING_DAYS_PER_MONTH = 21
    WORKING_DAYS_PER_YEAR = 252
    
    # Часы работы по месяцам (примерные значения)
    MONTHLY_WORKING_HOURS = {
        1: 120,   # Январь
        2: 125,   # Февраль
        3: 130,   # Март
        4: 135,   # Апрель
        5: 140,   # Май
        6: 145,   # Июнь
        7: 150,   # Июль
        8: 145,   # Август
        9: 140,   # Сентябрь
        10: 135,  # Октябрь
        11: 130,  # Ноябрь
        12: 125   # Декабрь
    }

    TIME_STANDARDS = {
        # Плановые проверки по рискам
        'inspection_category_a': 20,    # Категория А
        'inspection_category_b': 16,    # Категория Б  
        'inspection_category_v': 12,    # Категория В
        'inspection_category_g': 10,    # Категория Г
        'inspection_category_d': 8,     # Категория Д
        
        # Административные дела
        'admin_case_simple': 4,           # Простое адм. дело
        'admin_case_complex': 8,          # Сложное адм. дело
        
        # Расследование пожаров
        'fire_investigation_simple': 8,   # Простое дознание
        'fire_investigation_complex': 24, # Сложное дознание
        
        # Работа с обращениями
        'appeal_processing': 2,           # Обработка обращения
        'document_processing': 0.5,       # Обработка документа
    }
    
    @classmethod
    def calculate_actual_time_fund(cls, personnel, equipment, month=None):
        """Расчет фактического фонда рабочего времени с учетом месяца"""
        if month and month in cls.MONTHLY_WORKING_HOURS:
            # Расчет по формуле Tfakt = sotr * chas
            month_hours = cls.MONTHLY_WORKING_HOURS[month]
            actual_hours = personnel.total_count * month_hours
            actual_days = actual_hours / cls.BASE_WORKING_HOURS_PER_DAY
        else:
            # Старый расчет (годовой)
            base_hours = personnel.total_count * cls.BASE_WORKING_HOURS_PER_DAY * cls.WORKING_DAYS_PER_YEAR
            personnel_coef = cls.calculate_personnel_coefficients(personnel)
            personnel_efficiency = (personnel_coef['experience'] + 
                                  personnel_coef['education'] + 
                                  personnel_coef['age']) / 3
            equipment_efficiency = cls.calculate_equipment_coefficient(equipment)
            total_efficiency = personnel_efficiency * equipment_efficiency
            actual_hours = base_hours * total_efficiency
            actual_days = actual_hours / cls.BASE_WORKING_HOURS_PER_DAY
        
        return {
            'actual_hours': round(actual_hours),
            'actual_days': round(actual_days, 2),
            'personnel_efficiency': 1.0,  # Для месячного расчета
            'equipment_efficiency': 1.0,  # Для месячного расчета
            'total_efficiency': 1.0,      # Для месячного расчета
            'month_hours': month_hours if month else None
        }
    
    @classmethod
    def calculate_personnel_coefficients(cls, personnel):
        """Расчет коэффициентов эффективности персонала"""
        coefficients = {
            'experience': 1.0,
            'education': 1.0, 
            'age': 1.0
        }
        
        # Коэффициент опыта (стаж)
        if personnel.avg_experience >= 15:
            coefficients['experience'] = 1.2
        elif personnel.avg_experience >= 10:
            coefficients['experience'] = 1.1
        elif personnel.avg_experience <= 3:
            coefficients['experience'] = 0.8
            
        # Коэффициент образования
        if personnel.total_count > 0:
            education_ratio = (personnel.total_count - personnel.no_prof_education_count) / personnel.total_count
            coefficients['education'] = 0.8 + (education_ratio * 0.4)  # 0.8-1.2
        else:
            coefficients['education'] = 1.0
        
        # Коэффициент возраста
        if 30 <= personnel.avg_age <= 45:
            coefficients['age'] = 1.1
        elif personnel.avg_age > 55:
            coefficients['age'] = 0.9
            
        return coefficients
    
    @classmethod
    def calculate_equipment_coefficient(cls, equipment):
        """Расчет коэффициента оснащенности"""
        base_coef = 1.0
        
        # Коэффициент компьютеризации
        if equipment.workstations > 0:
            workstations_ratio = equipment.workstations / 10  # на 10 сотрудников
            base_coef += min(workstations_ratio - 1, 0.3)  # + до 30%
            
        # Коэффициент мобильности
        if equipment.has_service_cars:
            base_coef += 0.2
            
        # Коэффициент связи
        if equipment.internet_access_points >= equipment.workstations:
            base_coef += 0.1
            
        # Коэффициент территории
        if equipment.locality_type == 'rural':
            base_coef *= 0.9  # Сельская местность -10% эффективности
        elif equipment.locality_type == 'regional_center':
            base_coef *= 1.1  # Областной центр +10%
            
        return round(base_coef, 2)
    
    @classmethod
    def calculate_actual_time_fund(cls, personnel, equipment, month=None):
        """Расчет фактического фонда рабочего времени с учетом месяца"""
        if month and month in cls.MONTHLY_WORKING_HOURS:
            # Расчет по формуле Tfakt = sotr * chas
            month_hours = cls.MONTHLY_WORKING_HOURS[month]
            actual_hours = personnel.total_count * month_hours
            actual_days = actual_hours / cls.BASE_WORKING_HOURS_PER_DAY
        else:
            # Старый расчет (годовой)
            base_hours = personnel.total_count * cls.BASE_WORKING_HOURS_PER_DAY * cls.WORKING_DAYS_PER_YEAR
            personnel_coef = cls.calculate_personnel_coefficients(personnel)
            personnel_efficiency = (personnel_coef['experience'] + 
                                  personnel_coef['education'] + 
                                  personnel_coef['age']) / 3
            equipment_efficiency = cls.calculate_equipment_coefficient(equipment)
            total_efficiency = personnel_efficiency * equipment_efficiency
            actual_hours = base_hours * total_efficiency
            actual_days = actual_hours / cls.BASE_WORKING_HOURS_PER_DAY
        
        return {
            'actual_hours': round(actual_hours),
            'actual_days': round(actual_days, 2),
            'personnel_efficiency': 1.0,  # Для месячного расчета
            'equipment_efficiency': 1.0,  # Для месячного расчета
            'total_efficiency': 1.0,      # Для месячного расчета
            'month_hours': month_hours if month else None
        }
    
    @classmethod
    def calculate_required_time_fund(cls, supervised_objects, statistics, planning):
        """Расчет требуемого фонда рабочего времени с исправленной формулой"""
    
        prov = (planning.planned_inspections + planning.unplanned_inspections + 
                planning.preventive_measures + planning.consultations + 
                planning.analytical_materials + planning.meetings_count)
    
        st20_4 = statistics.admin_cases_20_4
        st19_5 = statistics.admin_cases_19_5
        st20_6 = statistics.admin_cases_20_6_20_7
        pozh = statistics.avg_fires_5years
        prest = statistics.avg_crime_reports
        ygdelo = planning.criminal_cases
        pam = planning.propaganda_materials
        otsved = planning.reports_count
        sovesh = planning.meetings_count or 5  # значение по умолчанию 5
        vhod = statistics.incoming_documents
        ishod = statistics.outgoing_documents
        konsult = planning.consultations
        obrgr = statistics.appeals_processed
        plan = planning.planned_inspections
        vneplan = planning.unplanned_inspections

        total_hours = (
            prov * 19.94 +
            st20_4 * 4.74 +
            (st19_5 + st20_6) * 3.63 +  
            pozh * 1.83 +
            prest * 7.49 +
            ygdelo * 77.65 +
            pam * 2.85 +
            otsved * 5.6 +
            sovesh * 2.73 +  
            (vhod + ishod) * 0.51 +
            konsult * 23.37 +
            obrgr * 2.71 +
            plan * 5.3 +
            vneplan * 5.3
        )

        required_days = total_hours / cls.BASE_WORKING_HOURS_PER_DAY

        return {
            'required_hours': round(total_hours),
            'required_days': round(required_days, 2),
            'formula_breakdown': {
                'prov_hours': round(prov * 19.94),
                'st20_4_hours': round(st20_4 * 4.74),
                'st19_5_20_6_hours': round((st19_5 + st20_6) * 3.63),
                'pozh_hours': round(pozh * 1.83),
                'prest_hours': round(prest * 7.49),
                'ygdelo_hours': round(ygdelo * 77.65),
                'pam_hours': round(pam * 2.85),
                'otsved_hours': round(otsved * 5.6),
                'sovesh_hours': round(sovesh * 2.73),
                'documents_hours': round((vhod + ishod) * 0.51),
                'konsult_hours': round(konsult * 23.37),
                'obrgr_hours': round(obrgr * 2.71),
                'plan_hours': round(plan * 5.3),
                'vneplan_hours': round(vneplan * 5.3)
            }
    }
    
    @classmethod
    def _calculate_risk_based_inspections(cls, supervised_objects):
        """Расчет времени на проверки с учетом категорий риска"""
        total_hours = 0
        
        # Проверки объектов ФГПН по категориям риска
        risk_standards = {
            'a': {'time': 20, 'frequency': 1},  # Категория А - ежегодно
            'b': {'time': 16, 'frequency': 1},  # Категория Б - ежегодно
            'v': {'time': 12, 'frequency': 2},  # Категория В - раз в 2 года
            'g': {'time': 10, 'frequency': 3},  # Категория Г - раз в 3 года
            'd': {'time': 8, 'frequency': 0}    # Категория Д - по заявлению
        }
        
        # Объекты ФГПН
        fgpn_categories = {
            'a': supervised_objects.risk_category_a or 0,
            'b': supervised_objects.risk_category_b or 0,
            'v': supervised_objects.risk_category_v or 0,
            'g': supervised_objects.risk_category_g or 0,
            'd': supervised_objects.risk_category_d or 0
        }
        
        for category, count in fgpn_categories.items():
            standard = risk_standards[category]
            if standard['frequency'] > 0:
                annual_inspections = count / standard['frequency']
                total_hours += annual_inspections * standard['time']
        
        return total_hours
    
    @classmethod
    def _calculate_admin_cases_time(cls, statistics):
        """Расчет времени на административные дела"""
        total_cases = (statistics.admin_cases_20_4 + statistics.admin_cases_19_5 + 
                      statistics.admin_cases_20_6_20_7 + statistics.admin_cases_20_25)
        
        # 70% простых дел (4 часа), 30% сложных (8 часов)
        simple_cases = total_cases * 0.7
        complex_cases = total_cases * 0.3
        
        return (simple_cases * cls.TIME_STANDARDS['admin_case_simple'] + 
                complex_cases * cls.TIME_STANDARDS['admin_case_complex'])
    
    @classmethod
    def _calculate_fire_investigation_time(cls, statistics):
        """Расчет времени на расследование пожаров"""
        # 80% простых расследований, 20% сложных
        simple_investigations = statistics.avg_fires_5years * 0.8
        complex_investigations = statistics.avg_fires_5years * 0.2
        
        return (simple_investigations * cls.TIME_STANDARDS['fire_investigation_simple'] +
                complex_investigations * cls.TIME_STANDARDS['fire_investigation_complex'])
    
    @classmethod
    def _calculate_appeals_processing_time(cls, statistics):
        """Расчет времени на обработку обращений"""
        return statistics.appeals_processed * cls.TIME_STANDARDS['appeal_processing']
    
    @classmethod
    def _calculate_documentation_time(cls, statistics):
        """Расчет времени на документооборот"""
        total_documents = statistics.incoming_documents + statistics.outgoing_documents
        return total_documents * cls.TIME_STANDARDS['document_processing']


class StaffCalculator:
    """Калькулятор потребности в персонале"""
    
    @classmethod
    def calculate_staff_deficit(cls, actual_hours, required_hours, current_staff_count):
        """Расчет дефицита/избытка персонала"""
        # Часов работы на 1 сотрудника в год
        hours_per_employee_per_year = 8 * 21 * 12  # 8 часов * 21 день * 12 месяцев
        
        if actual_hours >= required_hours:
            # Избыток времени - персонала достаточно
            deficit_count = 0
        else:
            # Дефицит времени - вычисляем сколько сотрудников не хватает
            deficit_hours = required_hours - actual_hours
            deficit_count = max(1, round(deficit_hours / hours_per_employee_per_year))
            
        utilization_rate = min(actual_hours / required_hours, 1.0) if required_hours > 0 else 0
            
        return {
            'deficit_count': deficit_count,
            'current_staff_count': current_staff_count,
            'required_staff_count': current_staff_count + deficit_count,
            'utilization_rate': round(utilization_rate * 100, 1)
        }