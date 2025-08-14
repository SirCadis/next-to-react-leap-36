const fs = require('fs');
const path = require('path');

// Read the main package.json
const packagePath = path.join(process.cwd(), 'package.json');
const scriptPackagePath = path.join(process.cwd(), 'scripts', 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const scriptPackageJson = JSON.parse(fs.readFileSync(scriptPackagePath, 'utf8'));
  
  // Add the electron scripts and main field
  packageJson.main = "dist-electron/main.js";
  packageJson.scripts = {
    ...packageJson.scripts,
    ...scriptPackageJson.scripts
  };
  
  // Write back to package.json
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json updated with Electron scripts');
} catch (error) {
  console.error('❌ Failed to update package.json:', error.message);
  process.exit(1);
}