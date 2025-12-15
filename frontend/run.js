const { spawn } = require('child_process');
const path = require('path');

function runFrontend() {
  const frontendDir = path.join(__dirname);

  const npmStart = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });

  npmStart.on('error', (err) => {
    console.error('Ошибка запуска фронта:', err.message);
  });
}

if (require.main === module) {
  console.log('Запуск фронта...');
  runFrontend();
}

module.exports = { runFrontend };