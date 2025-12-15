from flask import Blueprint, request, jsonify
from models import db, Planning

planning_bp = Blueprint('planning', __name__)

@planning_bp.route('/planning/<int:department_id>', methods=['GET', 'POST', 'PUT'])
def handle_planning(department_id):
    """Работа с данными планирования и отчетности"""
    
    if request.method == 'GET':
        planning = Planning.query.filter_by(department_id=department_id).first()
        if not planning:
            return jsonify({"error": "Данные планирования не найдены"}), 404
            
        return jsonify(_planning_to_dict(planning)), 200
    
    elif request.method in ['POST', 'PUT']:
        data = request.get_json()
        
        planning = Planning.query.filter_by(department_id=department_id).first()
        if not planning:
            planning = Planning(department_id=department_id)
        
        # Обновление данных
        planning.planned_inspections = data.get('planned_inspections', 0)
        planning.unplanned_inspections = data.get('unplanned_inspections', 0)
        planning.propaganda_materials = data.get('propaganda_materials', 0)
        planning.reports_count = data.get('reports_count', 0)
        planning.preventive_measures = data.get('preventive_measures', 0)
        planning.consultations = data.get('consultations', 0)
        planning.analytical_materials = data.get('analytical_materials', 0)
        planning.meetings_count = data.get('meetings_count', 0)
        planning.criminal_cases = data.get('criminal_cases', 0)
        
        db.session.add(planning)
        db.session.commit()
        
        return jsonify({
            "message": "Данные планирования сохранены успешно",
            "data": _planning_to_dict(planning)
        }), 200

def _planning_to_dict(planning):
    """Конвертация объекта Planning в словарь"""
    return {
        'id': planning.id,
        'department_id': planning.department_id,
        'planned_inspections': planning.planned_inspections,
        'unplanned_inspections': planning.unplanned_inspections,
        'propaganda_materials': planning.propaganda_materials,
        'reports_count': planning.reports_count,
        'preventive_measures': planning.preventive_measures,
        'consultations': planning.consultations,
        'analytical_materials': planning.analytical_materials,
        'meetings_count': planning.meetings_count,
        'criminal_cases': planning.criminal_cases
    }