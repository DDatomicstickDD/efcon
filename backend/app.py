from flask import Flask, jsonify
from flask_cors import CORS
from models import db, Department  # ✅ Импортируем Department
from routes import (
    departments_bp,
    personnel_bp,
    equipment_bp,
    objects_bp,
    statistics_bp,
    calculations_bp,
    planning_bp  # ✅ Добавлен импорт
)
from datetime import datetime

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    CORS(app,
         resources={r"/api/*": {"origins": "http://localhost:3000"}},  # ✅ Изменили на 3000
         supports_credentials=True)

    # Инициализация расширений
    db.init_app(app)

    # Регистрация всех Blueprints
    app.register_blueprint(departments_bp, url_prefix='/api')
    app.register_blueprint(personnel_bp, url_prefix='/api')
    app.register_blueprint(equipment_bp, url_prefix='/api')
    app.register_blueprint(objects_bp, url_prefix='/api')
    app.register_blueprint(statistics_bp, url_prefix='/api')
    app.register_blueprint(calculations_bp, url_prefix='/api')
    app.register_blueprint(planning_bp, url_prefix='/api')

    @app.route('/')
    def hello():
        return jsonify({"message": "EFCON Backend is running!", "status": "OK"})

    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})

    # ✅ Новый маршрут для проверки, есть ли подразделения
    @app.route('/api/departments/status', methods=['GET'])
    def get_departments_status():
        total_count = Department.query.count()
        has_departments = total_count > 0
        return jsonify({
            "has_departments": has_departments,
            "total_count": total_count
        }), 200

    # Создание таблиц и тестовых данных
    with app.app_context():
        db.create_all()
        # _create_test_data()  # ✅ Закомментировано

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)