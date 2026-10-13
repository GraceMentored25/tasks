import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');

console.log('--- BUILDING STATIC ASSETS FOR GITHUB PAGES DEPLOYMENT ---');

if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

fs.mkdirSync(DIST_DIR, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy root index.html to dist/
fs.copyFileSync(path.resolve('index.html'), path.join(DIST_DIR, 'index.html'));

// Copy workspace directory to dist/workspace
copyRecursiveSync(path.resolve('workspace'), path.join(DIST_DIR, 'workspace'));

console.log('✅ Build completed successfully! Production bundle written to dist/');
