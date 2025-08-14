const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  // Build the React app
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Build Electron files
  console.log('Building Electron files...');
  execSync('npx vite build --config electron.vite.config.ts', { stdio: 'inherit' });

  // Verify build output
  if (!fs.existsSync('dist-electron/main.js')) {
    throw new Error('Electron main file not generated');
  }
  if (!fs.existsSync('dist-electron/preload.js')) {
    throw new Error('Electron preload file not generated');
  }

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}