const { spawn, execSync } = require('child_process');
const path = require('path');

// Build Electron files first
console.log('Building Electron files...');
execSync('npx vite build --config electron.vite.config.ts', { stdio: 'inherit' });

// Start Vite dev server
console.log('Starting Vite dev server...');
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:8080' }
});

// Wait for Vite to start, then start Electron
setTimeout(() => {
  console.log('Starting Electron...');
  const electronProcess = spawn('npx', ['electron', 'dist-electron/main.js'], {
    stdio: 'inherit',
    env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:8080' }
  });

  electronProcess.on('close', () => {
    viteProcess.kill();
    process.exit(0);
  });
}, 3000);

process.on('SIGINT', () => {
  viteProcess.kill();
  process.exit(0);
});