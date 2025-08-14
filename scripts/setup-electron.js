const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Setting up Electron configuration...\n');

// Make electron.js executable
if (process.platform !== 'win32') {
  try {
    execSync('chmod +x electron.js');
    console.log('✅ Made electron.js executable');
  } catch (error) {
    console.log('⚠️  Could not make electron.js executable:', error.message);
  }
}

// Create simple runner scripts
const runnerScript = process.platform === 'win32' ? 
`@echo off
echo Starting Electron...
node electron.js
` : 
`#!/bin/bash
echo "Starting Electron..."
node electron.js
`;

const scriptName = process.platform === 'win32' ? 'electron.bat' : 'electron.sh';
fs.writeFileSync(scriptName, runnerScript);

if (process.platform !== 'win32') {
  try {
    execSync(`chmod +x ${scriptName}`);
  } catch (error) {
    console.log(`⚠️  Could not make ${scriptName} executable:`, error.message);
  }
}

console.log(`✅ Created ${scriptName} runner script`);
console.log('\n🎉 Electron setup complete!');
console.log('\nYou can now run Electron with:');
console.log('  node electron.js');
console.log(`  ./${scriptName}`);
console.log('  npm run electron');