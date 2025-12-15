import os
import sys
import subprocess
import platform
from threading import Thread
import time

def activate_venv_and_run():
    """Активирует venv и запускает Flask-приложение"""
    # Определяем путь к venv
    venv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'venv')
    
    if platform.system() == 'Windows':
        python_executable = os.path.join(venv_path, 'Scripts', 'python.exe')
    else:
        python_executable = os.path.join(venv_path, 'bin', 'python')

    # Проверяем, существует ли venv
    if not os.path.exists(venv_path):
        print(f"Ошибка: виртуальное окружение не найдено по пути: {venv_path}")
        print("Создайте его командой: python -m venv venv")
        sys.exit(1)

    # Проверяем, существует ли интерпретатор Python в venv
    if not os.path.exists(python_executable):
        print(f"Ошибка: интерпретатор Python не найден по пути: {python_executable}")
        sys.exit(1)

    print(f"Используем Python из venv: {python_executable}")
    
    # Запускаем app.py через python из venv
    subprocess.run([python_executable, 'app.py'])

if __name__ == '__main__':
    print("Запуск бэкенда через venv...")
    activate_venv_and_run()