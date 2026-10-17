import fs from 'fs';
import path from 'path';

console.log('📦 Building static site bundle into dist/...');

const distDir = path.join(process.cwd(), 'dist');
const workspaceDir = path.join(process.cwd(), 'workspace');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy workspace files into dist
if (fs.existsSync(workspaceDir)) {
  fs.cpSync(workspaceDir, path.join(distDir, 'workspace'), { recursive: true });
}

// Generate index.html in dist root for GitHub Pages navigation
const apps = fs.existsSync(workspaceDir) ? fs.readdirSync(workspaceDir).filter(f => fs.statSync(path.join(workspaceDir, f)).isDirectory()) : [];

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Commercial AI Web Applications Workspace</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; line-height: 1.6; background: #0f172a; color: #f8fafc; }
    h1 { color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 12px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 24px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; transition: transform 0.2s; }
    .card:hover { transform: translateY(-3px); border-color: #38bdf8; }
    a { color: #38bdf8; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 10px; }
    a:hover { text-decoration: underline; }
    .badge { background: #0284c7; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>⚡ Commercial AI Web Applications Workspace</h1>
  <p>Collection of high-performance AI MVP web applications built based on real commercial freelance client briefs (Malt).</p>
  <div class="grid">
    ${apps.map(app => `
      <div class="card">
        <h3>${app.replace(/-/g, ' ').toUpperCase()}</h3>
        <span class="badge">Commercial MVP</span>
        <br>
        <a href="./workspace/${app}/index.html">Launch Application &rarr;</a>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('✅ Build complete! Assets saved to dist/');
