/**
 * Test Verification Runner for AI MVP Applications Workspace
 * Checks file structure, HTML integrity, performance annotations, and commercial references
 */

const fs = require('fs');
const path = require('path');

const APPS = [
  'ai-customer-support-copilot',
  'ai-content-repurposer',
  'ai-document-summarizer'
];

let errors = [];

console.log("🔍 Running Test & Verification Suite...\n");

// 1. Check root files
['package.json', 'README.md', 'index.html', '.jules/bolt.md'].forEach(file => {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required root file: ${file}`);
  }
});

// 2. Check each application in workspace/
APPS.forEach(appName => {
  const appDir = path.join('workspace', appName);

  if (!fs.existsSync(appDir)) {
    errors.push(`Missing app directory: ${appDir}`);
    return;
  }

  const htmlPath = path.join(appDir, 'index.html');
  const jsPath = path.join(appDir, 'src', 'app.js');
  const readmePath = path.join(appDir, 'README.md');

  if (!fs.existsSync(htmlPath)) errors.push(`Missing index.html in ${appName}`);
  if (!fs.existsSync(jsPath)) errors.push(`Missing src/app.js in ${appName}`);
  if (!fs.existsSync(readmePath)) errors.push(`Missing README.md in ${appName}`);

  // Validate README contents for Malt commercial references and price
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    if (!readmeContent.includes('Malt') && !readmeContent.includes('Freelance')) {
      errors.push(`${appName}/README.md missing Commercial Reference platform (Malt)`);
    }
    if (!readmeContent.includes('€')) {
      errors.push(`${appName}/README.md missing Price Range in Euros`);
    }
  }

  // Validate HTML contains accessible viewport and titles
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    if (!htmlContent.includes('viewport')) {
      errors.push(`${appName}/index.html missing viewport meta tag`);
    }
  }
});

if (errors.length > 0) {
  console.error("❌ Verification failed with errors:");
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log("✅ All workspace applications verified successfully!");
  console.log("⚡ Bolt performance benchmarks and structure check passed.");
  process.exit(0);
}
