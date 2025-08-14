const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Build Electron files first
console.log('Building Electron files...');
try {
  execSync('npx vite build --config electron.vite.config.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to build Electron files:', error.message);
  process.exit(1);
}

// Check if dist-electron/main.js exists
if (!fs.existsSync('dist-electron/main.js')) {
  console.error('Electron main file not found at dist-electron/main.js');
  process.exit(1);
}

// Start Vite dev server
console.log('Starting Vite dev server...');
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:5173' }
});

// Wait for Vite to start, then start Electron
setTimeout(() => {
  console.log('Starting Electron...');
  const electronProcess = spawn('npx', ['electron', 'dist-electron/main.js'], {
    stdio: 'inherit',
    env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:5173' }
  });

  electronProcess.on('close', (code) => {
    console.log(`Electron exited with code ${code}`);
    viteProcess.kill();
    process.exit(0);
  });

  electronProcess.on('error', (error) => {
    console.error('Failed to start Electron:', error);
    viteProcess.kill();
    process.exit(1);
  });
}, 4000);

process.on('SIGINT', () => {
  viteProcess.kill();
  process.exit(0);
});