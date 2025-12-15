from flask import Blueprint, request, jsonify
from models import db, Equipment

equipment_bp = Blueprint('equipment', __name__)

@equipment_bp.route('/equipment/<int:department_id>', methods=['GET', 'POST', 'PUT'])
def handle_equipment(department_id):
    """Работа с данными об оснащении подразделения"""
    
    if request.method == 'GET':
        equipment = Equipment.query.filter_by(department_id=department_id).first()
        if not equipment:
            return jsonify({"error": "Данные об оснащении не найдены"}), 404
            
        return jsonify(_equipment_to_dict(equipment)), 200
    
    elif request.method in ['POST', 'PUT']:
        data = request.get_json()
        
        equipment = Equipment.query.filter_by(department_id=department_id).first()
        if not equipment:
            equipment = Equipment(department_id=department_id)
        
        # Обновление основных данных
        equipment.service_area = data.get('service_area', 0)
        equipment.internet_access_points = data.get('internet_access_points', 0)
        equipment.intra_access_points = data.get('intra_access_points', 0)  # Новое поле
        equipment.locality_type = data.get('locality_type', 'urban')
        equipment.workstations = data.get('workstations', 0)
        equipment.printers = data.get('printers', 0)
        equipment.has_service_cars = data.get('has_service_cars', False)
        equipment.mfu_count = data.get('mfu_count', 0)
        equipment.mfu_stream_copy = data.get('mfu_stream_copy', 0)  # Новое поле
        
        # Обновление данных по категориям риска
        equipment.risk_equipment_count_a = data.get('risk_equipment_count_a', 0)
        equipment.risk_equipment_count_b = data.get('risk_equipment_count_b', 0)
        equipment.risk_equipment_count_v = data.get('risk_equipment_count_v', 0)
        equipment.risk_equipment_count_g = data.get('risk_equipment_count_g', 0)
        equipment.risk_equipment_count_d = data.get('risk_equipment_count_d', 0)
        
        db.session.add(equipment)
        db.session.commit()
        
        return jsonify({
            "message": "Данные об оснащении сохранены успешно",
            "data": _equipment_to_dict(equipment)
        }), 200

def _equipment_to_dict(equipment):
    """Конвертация объекта Equipment в словарь"""
    return {
        'id': equipment.id,
        'department_id': equipment.department_id,
        'service_area': equipment.service_area,
        'internet_access_points': equipment.internet_access_points,
        'intra_access_points': equipment.intra_access_points,  # Новое поле
        'locality_type': equipment.locality_type,
        'workstations': equipment.workstations,
        'printers': equipment.printers,
        'has_service_cars': equipment.has_service_cars,
        'mfu_count': equipment.mfu_count,
        'mfu_stream_copy': equipment.mfu_stream_copy,  # Новое поле
        
        # Категории риска
        'risk_equipment_count_a': equipment.risk_equipment_count_a,
        'risk_equipment_count_b': equipment.risk_equipment_count_b,
        'risk_equipment_count_v': equipment.risk_equipment_count_v,
        'risk_equipment_count_g': equipment.risk_equipment_count_g,
        'risk_equipment_count_d': equipment.risk_equipment_count_d,
        
        'equipment_coef': equipment.equipment_coef
    }