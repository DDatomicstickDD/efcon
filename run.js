const { spawn } = require('child_process');
const path = require('path');

function runBackend() {
  const backendDir = path.join(__dirname, 'backend');

  // Запускаем backend/run.py через python
  const pythonRun = spawn('python', ['run.py'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });

  pythonRun.on('error', (err) => {
    console.error('Ошибка запуска бэкенда:', err.message);
  });

  pythonRun.on('close', (code) => {
    console.log(`Бэкенд завершен с кодом ${code}`);
  });
}

function runFrontend() {
  const frontendDir = path.join(__dirname, 'frontend');

  const npmStart = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });

  npmStart.on('error', (err) => {
    console.error('Ошибка запуска фронта:', err.message);
  });

  npmStart.on('close', (code) => {
    console.log(`Фронтенд завершен с кодом ${code}`);
  });
}

if (require.main === module) {
  console.log('Запуск бэкенда...');
  runBackend();

  // Ждем 3 секунды, чтобы бэкенд успел запуститься
  setTimeout(() => {
    console.log('Запуск фронта...');
    runFrontend();
  }, 3000);
}