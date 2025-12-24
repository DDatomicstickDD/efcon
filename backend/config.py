# config.py
import os
from dotenv import load_dotenv  # ← ДОБАВЬТЕ

# Загружаем переменные окружения из .env
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Получаем DATABASE_URL из переменных окружения
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # Если DATABASE_URL не задан, используем SQLite
    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Fallback на SQLite
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'efcon.db')
        print(f"⚠️ DATABASE_URL не найден, использую SQLite: {SQLALCHEMY_DATABASE_URI}")