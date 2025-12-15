from flask import Blueprint, request, jsonify
from models import db, Personnel

personnel_bp = Blueprint('personnel', __name__)

@personnel_bp.route('/personnel/<int:department_id>', methods=['GET', 'POST', 'PUT'])
def handle_personnel(department_id):
    """Работа с данными о персонале подразделения"""
    
    if request.method == 'GET':
        personnel = Personnel.query.filter_by(department_id=department_id).first()
        if not personnel:
            return jsonify({"error": "Данные о персонале не найдены"}), 404
            
        return jsonify(_personnel_to_dict(personnel)), 200
    
    elif request.method in ['POST', 'PUT']:
        data = request.get_json()
        
        # Валидация обязательных полей
        required_fields = ['total_count', 'avg_experience', 'avg_age']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Обязательное поле отсутствует: {field}"}), 400
        
        # Поиск или создание записи
        personnel = Personnel.query.filter_by(department_id=department_id).first()
        if not personnel:
            personnel = Personnel(department_id=department_id)
        
        # Обновление данных
        personnel.total_count = data.get('total_count', 0)
        personnel.avg_experience = data.get('avg_experience', 0)
        personnel.no_prof_education_count = data.get('no_prof_education_count', 0)
        personnel.avg_age = data.get('avg_age', 0)
        personnel.female_percentage = data.get('female_percentage', 0)
        personnel.legal_education_count = data.get('legal_education_count', 0)
        
        db.session.add(personnel)
        db.session.commit()
        
        return jsonify({
            "message": "Данные о персонале сохранены успешно",
            "data": _personnel_to_dict(personnel)
        }), 200

def _personnel_to_dict(personnel):
    """Конвертация объекта Personnel в словарь"""
    return {
        'id': personnel.id,
        'department_id': personnel.department_id,
        'total_count': personnel.total_count,
        'avg_experience': personnel.avg_experience,
        'no_prof_education_count': personnel.no_prof_education_count,
        'avg_age': personnel.avg_age,
        'female_percentage': personnel.female_percentage,
        'legal_education_count': personnel.legal_education_count,
        'experience_coef': personnel.experience_coef,
        'education_coef': personnel.education_coef,
        'age_coef': personnel.age_coef
    }