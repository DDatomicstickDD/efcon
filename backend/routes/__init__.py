"""
Routes package for EFCON API
"""
from .departments import departments_bp
from .personnel import personnel_bp
from .equipment import equipment_bp
from .objects import objects_bp
from .statistics import statistics_bp
from .calculations import calculations_bp
from .planning import planning_bp  # ✅ Добавлен импорт

__all__ = [
    'departments_bp',
    'personnel_bp', 
    'equipment_bp',
    'objects_bp',
    'statistics_bp',
    'calculations_bp',
    'planning_bp'  # ✅ Добавлен в список
]