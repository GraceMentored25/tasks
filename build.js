import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const WORKSPACE_DIR = path.resolve('workspace');

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function build() {
  console.log('🏗️  Building AI Commercial Web Applications for GitHub Pages deployment...');

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }

  fs.mkdirSync(DIST_DIR, { recursive: true });

  const workspaceDest = path.join(DIST_DIR, 'workspace');
  copyRecursive(WORKSPACE_DIR, workspaceDest);

  // Read applications
  const appDirs = fs.readdirSync(WORKSPACE_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  const appCardsHtml = appDirs.map(appName => {
    const readmePath = path.join(WORKSPACE_DIR, appName, 'README.md');
    let title = appName;
    let description = 'Commercial AI MVP Application';

    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf-8');
      const firstLine = content.split('\n')[0].replace('#', '').trim();
      if (firstLine) title = firstLine;
    }

    return `
      <div class="card">
        <h2>${title}</h2>
        <p>Application Web Commerciale IA (MVP)</p>
        <div class="actions">
          <a href="./workspace/${appName}/index.html" class="btn btn-primary">Lancer la WebApp ⚡</a>
          <a href="./workspace/${appName}/README.md" class="btn btn-secondary">Consulter l'Offre Malt</a>
        </div>
      </div>
    `;
  }).join('\n');

  const portalHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: https:;">
  <title>AI Commercial MVPs Portal ⚡</title>
  <style>
    :root {
      --bg: #030712;
      --card: #111827;
      --accent: #3b82f6;
      --text: #f9fafb;
      --muted: #9ca3af;
      --border: #1f2937;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 2rem; min-height: 100vh; }
    header { text-align: center; max-width: 800px; margin: 0 auto 3rem auto; }
    header h1 { font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--text); }
    header p { color: var(--muted); font-size: 1.1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
    .card h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .card p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn { padding: 0.6rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 600; text-align: center; flex: 1; }
    .btn-primary { background: var(--accent); color: white; }
    .btn-secondary { background: #374151; color: white; }
  </style>
</head>
<body>
  <header>
    <h1>⚡ AI Commercial MVPs Suite</h1>
    <p>Solutions Web3 / IA prêtes à l'emploi inspirées de vraies opportunités freelances & entreprises (Malt)</p>
  </header>

  <div class="grid">
    ${appCardsHtml}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), portalHtml, 'utf-8');
  console.log('✅ Built successfully into dist/ directory!');
}

build();
