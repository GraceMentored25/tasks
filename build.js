const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const WORKSPACE_DIR = path.join(ROOT_DIR, 'workspace');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function build() {
  console.log('⚡ Starting static web build...');

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  if (fs.existsSync(WORKSPACE_DIR)) {
    copyDirRecursive(WORKSPACE_DIR, path.join(DIST_DIR, 'workspace'));
  }

  // Create GitHub Pages root index.html hub
  const hubHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Commercial AI MVPs Hub</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 30px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; transition: transform 0.2s; }
    .card:hover { transform: translateY(-3px); }
    a { color: #38bdf8; text-decoration: none; font-weight: bold; }
    .badge { background: #0284c7; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Commercial AI MVPs Showcase ⚡</h1>
    <p>Applications IA clés en main construites à partir de missions réelles (Malt) - Déploiement GitHub Pages.</p>
    <div class="grid">
      <div class="card">
        <span class="badge">Malt • 550€ - 750€/j</span>
        <h3>AI Support Copilot</h3>
        <p>Assistance automatique et suggestions de réponses pour tickets support.</p>
        <a href="./workspace/ai-support-copilot/index.html">Lancer la WebApp &rarr;</a>
      </div>
      <div class="card">
        <span class="badge">Malt • 600€ - 850€/j</span>
        <h3>AI Contract Analyzer</h3>
        <p>Analyse automatique de conformité et détection de risques juridiques.</p>
        <a href="./workspace/ai-contract-analyzer/index.html">Lancer la WebApp &rarr;</a>
      </div>
      <div class="card">
        <span class="badge">Malt • 500€ - 700€/j</span>
        <h3>AI SEO Content Generator</h3>
        <p>Génération de contenus optimisés et densité de mots-clés en temps réel.</p>
        <a href="./workspace/ai-seo-content-generator/index.html">Lancer la WebApp &rarr;</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), hubHtml, 'utf8');
  console.log('✅ Static build complete! Output generated in dist/');
}

build();
