from flask import Blueprint, request, jsonify, current_app
from models import db, Department, Personnel, Equipment, SupervisedObjects, Statistics, Planning, CalculationResult
from utils import TimeFundCalculator, StaffCalculator
from datetime import datetime

calculations_bp = Blueprint('calculations', __name__)

@calculations_bp.route('/calculate/<int:department_id>', methods=['POST', 'OPTIONS'])
def calculate_time_funds(department_id):
    """Основной расчет фондов рабочего времени и потребности в персонале"""
    if request.method == 'OPTIONS':
        return '', 200
        
    current_app.logger.info(f"Начат расчёт для подразделения {department_id}")    
    try:
        data = request.get_json() or {}
        selected_month = data.get('month')
        
        print(f"=== START CALCULATION FOR DEPARTMENT {department_id}, MONTH: {selected_month} ===")
        
        department = Department.query.get_or_404(department_id)
        print(f"Department found: {department.name}")
        
        # Получаем связанные данные
        personnel = Personnel.query.filter_by(department_id=department_id).first()
        equipment = Equipment.query.filter_by(department_id=department_id).first()
        supervised_objects = SupervisedObjects.query.filter_by(department_id=department_id).first()
        statistics = Statistics.query.filter_by(department_id=department_id).first()
        planning = Planning.query.filter_by(department_id=department_id).first()
        
        if not all([personnel, equipment, supervised_objects, statistics, planning]):
            missing = []
            if not personnel: missing.append("personnel")
            if not equipment: missing.append("equipment")
            if not supervised_objects: missing.append("supervised_objects")
            if not statistics: missing.append("statistics")
            if not planning: missing.append("planning")
            
            return jsonify({
                "error": "Не все необходимые данные заполнены",
                "missing": missing
            }), 400
        
        # Расчет фактического фонда времени
        actual_result = TimeFundCalculator.calculate_actual_time_fund(personnel, equipment, selected_month)
        print(f"Actual fund: {actual_result}")
        
        # Расчет требуемого фонда времени
        required_result = TimeFundCalculator.calculate_required_time_fund(supervised_objects, statistics, planning)
        print(f"Required fund: {required_result}")
        
        # Расчет дефицита персонала
        staff_result = StaffCalculator.calculate_staff_deficit(
            actual_result['actual_hours'],
            required_result['required_hours'],
            personnel.total_count
        )
        print(f"Staff result: {staff_result}")
        
        # Сохраняем результаты расчета
        calculation = CalculationResult.query.filter_by(department_id=department_id).first()
        if not calculation:
            calculation = CalculationResult(department_id=department_id)  # СОЗДАЕМ НОВУЮ ЗАПИСЬ
            
        calculation.actual_hours = actual_result['actual_hours']
        calculation.actual_days = actual_result['actual_days']
        calculation.required_hours = required_result['required_hours']
        calculation.required_days = required_result['required_days']
        calculation.employee_count = personnel.total_count
        calculation.deficit_count = staff_result['deficit_count']
        calculation.efficiency_coefficient = actual_result['total_efficiency']
        calculation.calculation_month = selected_month
        calculation.calculated_at = datetime.utcnow()
        
        db.session.add(calculation)
        db.session.commit()
        
        # Формируем полный ответ
        response = {
            "success": True,
            "calculation": {
                "actual_fund": {
                    "hours": calculation.actual_hours,
                    "days": calculation.actual_days
                },
                "required_fund": {
                    "hours": calculation.required_hours,
                    "days": calculation.required_days
                },
                "personnel": {
                    "current_count": calculation.employee_count,
                    "deficit_count": calculation.deficit_count,
                    "required_count": staff_result['required_staff_count'],
                    "utilization_rate": staff_result['utilization_rate']
                },
                "efficiency": {
                    "total": calculation.efficiency_coefficient,
                    "personnel": actual_result['personnel_efficiency'],
                    "equipment": actual_result['equipment_efficiency']
                }
            },
            "month_info": {
                "month": selected_month,
                "month_name": get_month_name(selected_month),
                "month_hours": actual_result.get('month_hours', 0)
            },
            "recommendations": _generate_recommendations(staff_result, actual_result)
        }
        
        current_app.logger.info(f"Расчёт для подразделения {department_id} завершён успешно")
        return jsonify(response), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Ошибка расчёта для подразделения {department_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ошибка расчета: {str(e)}"}), 500

@calculations_bp.route('/results/<int:department_id>', methods=['GET', 'OPTIONS'])      
def get_calculation_results(department_id):
    """Получение результатов расчета для отдела"""
    if request.method == 'OPTIONS':
        return '', 200
        
    print(f"=== GET RESULTS FOR DEPARTMENT {department_id} ===")
    
    calculation = CalculationResult.query.filter_by(department_id=department_id).first()
    
    if not calculation:
        print(f"Calculation results not found for department {department_id}")
        return jsonify({"error": "Результаты расчета не найдены"}), 404
        
    print(f"Found calculation: {calculation.actual_hours} hours, {calculation.deficit_count} deficit")
    
    return jsonify({
        "actual_hours": calculation.actual_hours,
        "actual_days": calculation.actual_days,
        "required_hours": calculation.required_hours,
        "required_days": calculation.required_days,
        "employee_count": calculation.employee_count,
        "deficit_count": calculation.deficit_count,
        "efficiency_coefficient": calculation.efficiency_coefficient,
        "calculation_month": calculation.calculation_month,
        "calculated_at": calculation.calculated_at.isoformat()
    }), 200

# Вспомогательные функции
def get_month_name(month_number):
    """Получить название месяца по номеру"""
    months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ]
    return months[month_number - 1] if month_number and 1 <= month_number <= 12 else "Неизвестный месяц"

def _generate_recommendations(staff_result, efficiency_result):
    """Генерация рекомендаций на основе результатов расчета"""
    recommendations = []
    
    if staff_result['deficit_count'] > 0:
        recommendations.append({
            "type": "critical",
            "message": f"Обнаружен дефицит {staff_result['deficit_count']} сотрудников."
        })
    
    if efficiency_result['total_efficiency'] < 0.9:
        recommendations.append({
            "type": "warning",
            "message": "Низкая общая эффективность работы."
        })
    
    recommendations.append({
        "type": "info",
        "message": "Рекомендуется регулярный мониторинг показателей."
    })
    
    return recommendations

# Простые роуты для аналитики (возвращают заглушки)
@calculations_bp.route('/analytics/optimization', methods=['GET'])
def get_optimization_recommendations():
    return jsonify({
        "success": True,
        "total_departments": 3,
        "optimization_plan": []
    })

@calculations_bp.route('/analytics/efficiency-report', methods=['GET'])
def get_efficiency_report():
    return jsonify({
        "success": True,
        "report_date": datetime.utcnow().isoformat(),
        "departments": [],
        "summary": {}
    })

@calculations_bp.route('/analytics/department-comparison', methods=['GET'])
def get_department_comparison():
    return jsonify({
        "success": True,
        "comparison": [],
        "metrics_summary": {}
    })