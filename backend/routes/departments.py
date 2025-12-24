from flask import Blueprint, request, jsonify
from models import db, Department, Personnel, Equipment, SupervisedObjects, Statistics, CalculationResult

departments_bp = Blueprint('departments', __name__)

@departments_bp.route('/departments', methods=['GET'])
def get_departments():
    """Получение списка всех подразделений"""
    departments = Department.query.all()
    return jsonify([{
        'id': dept.id,
        'name': dept.name,
        'created_at': dept.created_at.isoformat()
    } for dept in departments]), 200

@departments_bp.route('/departments/<int:department_id>', methods=['GET'])
def get_department(department_id):
    """Получение информации о конкретном подразделении"""
    department = Department.query.get_or_404(department_id)
    return jsonify({
        'id': department.id,
        'name': department.name,
        'created_at': department.created_at.isoformat()
    }), 200

@departments_bp.route('/departments', methods=['POST'])
def create_department():
    """Создание нового подразделения"""
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({"error": "Название подразделения обязательно"}), 400
    
    department = Department(name=data['name'])
    db.session.add(department)
    db.session.commit()
    
    return jsonify({
        "message": "Подразделение создано успешно",
        "id": department.id,
        "name": department.name
    }), 201

@departments_bp.route('/departments/<int:department_id>', methods=['PUT'])
def update_department(department_id):
    data = request.get_json()
    if not data or 'name' not in data or not data['name'].strip():
        return jsonify({"error": "Название подразделения обязательно"}), 400

    department = Department.query.get_or_404(department_id)
    department.name = data['name'].strip()
    db.session.commit()
    return jsonify({"message": "Обновлено", "data": _department_to_dict(department)}), 200

@departments_bp.route('/departments/<int:department_id>', methods=['DELETE'])
def delete_department(department_id):
    """Удаление подразделения и всех связанных данных"""
    try:
        department = Department.query.get_or_404(department_id)
        
        Personnel.query.filter_by(department_id=department_id).delete()
        Equipment.query.filter_by(department_id=department_id).delete()
        SupervisedObjects.query.filter_by(department_id=department_id).delete()
        Statistics.query.filter_by(department_id=department_id).delete()
        CalculationResult.query.filter_by(department_id=department_id).delete()
        
        db.session.delete(department)
        db.session.commit()
        
        return jsonify({
            "message": "Подразделение и все связанные данные успешно удалены",
            "deleted_id": department_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Ошибка при удалении: {str(e)}"}), 500

def _department_to_dict(department):
    return {
        'id': department.id,
        'name': department.name,
        'created_at': department.created_at.isoformat() if department.created_at else None
    }