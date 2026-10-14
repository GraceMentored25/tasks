import fs from 'fs';
import path from 'path';

console.log('📦 Starting build process for GitHub Pages static assets...');

const distDir = path.join(process.cwd(), 'dist');

// Clear existing dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

fs.mkdirSync(distDir, { recursive: true });

// Copy root index.html to dist
if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
  fs.copyFileSync(path.join(process.cwd(), 'index.html'), path.join(distDir, 'index.html'));
}

// Copy workspace directory into dist/workspace
const workspaceSrc = path.join(process.cwd(), 'workspace');
const workspaceDist = path.join(distDir, 'workspace');

if (fs.existsSync(workspaceSrc)) {
  fs.cpSync(workspaceSrc, workspaceDist, { recursive: true });
}

console.log('✅ Static build completed! Assets compiled into /dist.');
