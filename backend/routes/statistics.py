from flask import Blueprint, request, jsonify
from models import db, Statistics

statistics_bp = Blueprint('statistics', __name__)

@statistics_bp.route('/statistics/<int:department_id>', methods=['GET', 'POST', 'PUT'])
def handle_statistics(department_id):
    """Работа со статистическими данными подразделения"""
    
    if request.method == 'GET':
        stats = Statistics.query.filter_by(department_id=department_id).first()
        if not stats:
            return jsonify({"error": "Статистические данные не найдены"}), 404
            
        return jsonify(_statistics_to_dict(stats)), 200
    
    elif request.method in ['POST', 'PUT']:
        data = request.get_json()
        
        stats = Statistics.query.filter_by(department_id=department_id).first()
        if not stats:
            stats = Statistics(department_id=department_id)
        
        # Статистика пожаров
        stats.avg_fires_5years = data.get('avg_fires_5years', 0)
        
        # Статистика расследований
        stats.avg_fire_reports = data.get('avg_fire_reports', 0)
        stats.avg_crime_reports = data.get('avg_crime_reports', 0)
        stats.avg_cases_transferred = data.get('avg_cases_transferred', 0)
        stats.avg_cases_rejected = data.get('avg_cases_rejected', 0)
        stats.avg_criminal_cases = data.get('avg_criminal_cases', 0)
        
        # Административные дела
        stats.admin_cases_20_4 = data.get('admin_cases_20_4', 0)
        stats.admin_cases_19_5 = data.get('admin_cases_19_5', 0)
        stats.admin_cases_20_6_20_7 = data.get('admin_cases_20_6_20_7', 0)
        stats.admin_cases_20_25 = data.get('admin_cases_20_25', 0)
        
        # Обращения граждан
        stats.appeals_processed = data.get('appeals_processed', 0)
        stats.appeals_redirected = data.get('appeals_redirected', 0)
        stats.appeals_without_esia = data.get('appeals_without_esia', 0)
        stats.appeals_no_knm_required = data.get('appeals_no_knm_required', 0)
        
        # Документооборот
        stats.incoming_documents = data.get('incoming_documents', 0)
        stats.outgoing_documents = data.get('outgoing_documents', 0)
        
        db.session.add(stats)
        db.session.commit()
        
        return jsonify({
            "message": "Статистические данные сохранены успешно",
            "data": _statistics_to_dict(stats)
        }), 200

def _statistics_to_dict(stats):
    """Конвертация объекта Statistics в словарь"""
    return {
        'id': stats.id,
        'department_id': stats.department_id,
        'avg_fires_5years': stats.avg_fires_5years,
        'avg_fire_reports': stats.avg_fire_reports,
        'avg_crime_reports': stats.avg_crime_reports,
        'avg_cases_transferred': stats.avg_cases_transferred,
        'avg_cases_rejected': stats.avg_cases_rejected,
        'avg_criminal_cases': stats.avg_criminal_cases,
        'admin_cases_20_4': stats.admin_cases_20_4,
        'admin_cases_19_5': stats.admin_cases_19_5,
        'admin_cases_20_6_20_7': stats.admin_cases_20_6_20_7,
        'admin_cases_20_25': stats.admin_cases_20_25,
        'appeals_processed': stats.appeals_processed,
        'appeals_redirected': stats.appeals_redirected,
        'appeals_without_esia': stats.appeals_without_esia,
        'appeals_no_knm_required': stats.appeals_no_knm_required,
        'incoming_documents': stats.incoming_documents,
        'outgoing_documents': stats.outgoing_documents
    }