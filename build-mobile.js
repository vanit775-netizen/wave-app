const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'wave-music-app.html');
const destDir = path.join(__dirname, 'www');
const dest = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

fs.copyFileSync(src, dest);
console.log('✅ Copied wave-music-app.html to www/index.html');

// Run capacitor sync
const { execSync } = require('child_process');
console.log('🔄 Syncing with Capacitor Android...');
execSync('npx cap sync android', { stdio: 'inherit' });
console.log('🚀 Ready! Open Android Studio to build.');
