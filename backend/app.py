import logging
import os
from flask import Flask, jsonify
from flask_cors import CORS
from models import db, Department  
from routes import (
    departments_bp,
    personnel_bp,
    equipment_bp,
    objects_bp,
    statistics_bp,
    calculations_bp,
    planning_bp  
)
from datetime import datetime
from logging.handlers import RotatingFileHandler

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app, 
         origins=["http://localhost:3000"],  
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True)

    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler(
            'logs/efcon.log', maxBytes=10240, backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('EFCON startup')

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
        # _create_test_data()  

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)