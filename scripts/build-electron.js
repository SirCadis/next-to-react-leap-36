const { execSync } = require('child_process');
const path = require('path');

// Build the React app
console.log('Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Build Electron files
console.log('Building Electron files...');
execSync('npx vite build --config electron.vite.config.ts', { stdio: 'inherit' });

console.log('Build completed!');