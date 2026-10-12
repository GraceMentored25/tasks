/**
 * Build Script for Static Assets Deployment (GitHub Pages)
 * Copies workspace/ applications into dist/ and creates dist/index.html catalog.
 */

const fs = require('fs');
const path = require('path');

function build() {
  console.log('📦 Compiling production static web application assets into dist/ ...');
  const distDir = path.join(__dirname, 'dist');
  const workspaceDir = path.join(__dirname, 'workspace');

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  if (!fs.existsSync(workspaceDir)) {
    console.error('❌ Error: workspace/ directory missing');
    process.exit(1);
  }

  const projects = fs.readdirSync(workspaceDir).filter(file => {
    return fs.statSync(path.join(workspaceDir, file)).isDirectory();
  });

  let htmlIndexContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;">
  <title>Catalogue des MVPs AI Commerciales</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen font-sans p-8">
  <div class="max-w-4xl mx-auto">
    <header class="mb-8 border-b border-slate-800 pb-6">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-3xl">⚡</span>
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Catalogue MVPs AI Commerciales
        </h1>
      </div>
      <p class="text-slate-400 text-lg">Solutions clés en main inspirées des missions d'expertise Freelance AI (Malt).</p>
    </header>
    <main class="grid md:grid-cols-3 gap-6">
`;

  for (const proj of projects) {
    const srcProjDir = path.join(workspaceDir, proj);
    const distProjDir = path.join(distDir, proj);

    fs.cpSync(srcProjDir, distProjDir, { recursive: true });

    htmlIndexContent += `
      <article class="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors shadow-lg">
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 mb-3">
            Commercial MVP
          </span>
          <h2 class="text-xl font-bold text-white capitalize mb-2">${proj.replace(/-/g, ' ')}</h2>
          <p class="text-slate-400 text-sm mb-4">Application web interactive autonome pré-optimisée pour la vitesse.</p>
        </div>
        <a href="./${proj}/index.html" class="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors">
          Ouvrir l'application &rarr;
        </a>
      </article>
    `;
  }

  htmlIndexContent += `
    </main>
  </div>
</body>
</html>
`;

  fs.writeFileSync(path.join(distDir, 'index.html'), htmlIndexContent);
  console.log('✅ Build completed successfully! Static output generated in dist/');
}

build();
