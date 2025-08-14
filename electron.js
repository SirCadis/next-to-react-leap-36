#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Electron application...\n');

// Check if dist-electron exists
if (!fs.existsSync('dist-electron')) {
  console.log('📦 Building Electron files...');
  try {
    execSync('npx vite build --config electron.vite.config.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to build Electron files');
    process.exit(1);
  }
}

// Check if main.js exists
if (!fs.existsSync('dist-electron/main.js')) {
  console.error('❌ Main Electron file not found. Please run build first.');
  process.exit(1);
}

// Start Electron
console.log('⚡ Launching Electron...\n');
const electronProcess = spawn('npx', ['electron', 'dist-electron/main.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

electronProcess.on('close', (code) => {
  console.log(`\n🏁 Electron exited with code ${code}`);
  process.exit(code);
});

electronProcess.on('error', (error) => {
  console.error('❌ Failed to start Electron:', error.message);
  process.exit(1);
});