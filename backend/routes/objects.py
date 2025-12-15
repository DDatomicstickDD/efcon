from flask import Blueprint, request, jsonify
from models import db, SupervisedObjects

objects_bp = Blueprint('objects', __name__)

@objects_bp.route('/objects/<int:department_id>', methods=['GET', 'POST', 'PUT'])
def handle_objects(department_id):
    """Работа с данными об объектах надзора"""
    
    if request.method == 'GET':
        objects_data = SupervisedObjects.query.filter_by(department_id=department_id).first()
        if not objects_data:
            return jsonify({"error": "Данные об объектах надзора не найдены"}), 404
            
        return jsonify(_objects_to_dict(objects_data)), 200
    
    elif request.method in ['POST', 'PUT']:
        data = request.get_json()
        
        objects_data = SupervisedObjects.query.filter_by(department_id=department_id).first()
        if not objects_data:
            objects_data = SupervisedObjects(department_id=department_id)
        
        # Обновление данных объектов ФГПН
        objects_data.fgpn_count = data.get('fgpn_count', 0)
        
        # Категории риска ФГПН
        objects_data.risk_category_a = data.get('risk_category_a', 0)
        objects_data.risk_category_b = data.get('risk_category_b', 0)
        objects_data.risk_category_v = data.get('risk_category_v', 0)
        objects_data.risk_category_g = data.get('risk_category_g', 0)
        objects_data.risk_category_d = data.get('risk_category_d', 0)
        
        # Обновление данных населенных пунктов
        objects_data.oms_settlements_count = data.get('oms_settlements_count', 0)
        objects_data.urban_settlements = data.get('urban_settlements', 0)
        objects_data.rural_settlements = data.get('rural_settlements', 0)
        
        # Обновление данных контролируемых лиц
        objects_data.fnts_count = data.get('fnts_count', 0)
        
        # Категории риска ФНТС
        objects_data.fnts_risk_a = data.get('fnts_risk_a', 0)
        objects_data.fnts_risk_b = data.get('fnts_risk_b', 0)
        objects_data.fnts_risk_v = data.get('fnts_risk_v', 0)
        objects_data.fnts_risk_g = data.get('fnts_risk_g', 0)
        objects_data.fnts_risk_d = data.get('fnts_risk_d', 0)
        
        # Обновление данных ЧС
        objects_data.fnentchs_count = data.get('fnentchs_count', 0)
        
        # Категории риска ФНЭНТЧС
        objects_data.fnentchs_risk_a = data.get('fnentchs_risk_a', 0)
        objects_data.fnentchs_risk_b = data.get('fnentchs_risk_b', 0)
        objects_data.fnentchs_risk_v = data.get('fnentchs_risk_v', 0)
        objects_data.fnentchs_risk_g = data.get('fnentchs_risk_g', 0)
        objects_data.fnentchs_risk_d = data.get('fnentchs_risk_d', 0)
        
        db.session.add(objects_data)
        db.session.commit()
        
        return jsonify({
            "message": "Данные об объектах надзора сохранены успешно",
            "data": _objects_to_dict(objects_data)
        }), 200

def _objects_to_dict(objects_data):
    """Конвертация объекта SupervisedObjects в словарь"""
    return {
        'id': objects_data.id,
        'department_id': objects_data.department_id,
        'fgpn_count': objects_data.fgpn_count,
        
        # Категории риска ФГПН
        'risk_category_a': objects_data.risk_category_a,
        'risk_category_b': objects_data.risk_category_b,
        'risk_category_v': objects_data.risk_category_v,
        'risk_category_g': objects_data.risk_category_g,
        'risk_category_d': objects_data.risk_category_d,
        
        'oms_settlements_count': objects_data.oms_settlements_count,
        'urban_settlements': objects_data.urban_settlements,
        'rural_settlements': objects_data.rural_settlements,
        'fnts_count': objects_data.fnts_count,
        
        # Категории риска ФНТС
        'fnts_risk_a': objects_data.fnts_risk_a,
        'fnts_risk_b': objects_data.fnts_risk_b,
        'fnts_risk_v': objects_data.fnts_risk_v,
        'fnts_risk_g': objects_data.fnts_risk_g,
        'fnts_risk_d': objects_data.fnts_risk_d,
        
        'fnentchs_count': objects_data.fnentchs_count,
        
        # Категории риска ФНЭНТЧС
        'fnentchs_risk_a': objects_data.fnentchs_risk_a,
        'fnentchs_risk_b': objects_data.fnentchs_risk_b,
        'fnentchs_risk_v': objects_data.fnentchs_risk_v,
        'fnentchs_risk_g': objects_data.fnentchs_risk_g,
        'fnentchs_risk_d': objects_data.fnentchs_risk_d,
    }