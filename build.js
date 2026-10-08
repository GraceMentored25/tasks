import fs from 'fs';
import path from 'path';

console.log('📦 Building static web application assets for deployment...');

const srcDir = path.resolve('workspace');
const distDir = path.resolve('dist');

if (!fs.existsSync(srcDir)) {
  console.error('❌ FAIL: workspace/ source directory does not exist');
  process.exit(1);
}

// Clean and recreate dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(srcDir, distDir);

console.log(`✅ BUILD SUCCESSFUL: Assets compiled into ${distDir}/`);
