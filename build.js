import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

// Clean or create dist folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy root index.html to dist
fs.copyFileSync('index.html', path.join(distDir, 'index.html'));

// Copy workspace apps to dist
const workspaceDir = path.resolve('workspace');
if (fs.existsSync(workspaceDir)) {
  const apps = fs.readdirSync(workspaceDir);
  for (const app of apps) {
    const srcAppDir = path.join(workspaceDir, app);
    if (fs.statSync(srcAppDir).isDirectory()) {
      const destAppDir = path.join(distDir, app);
      fs.cpSync(srcAppDir, destAppDir, { recursive: true });
    }
  }
}

console.log('Successfully built static assets into dist/ directory.');
