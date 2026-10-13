import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_DIR = path.resolve('workspace');
const REQUIRED_APPS = ['ai-support-bot', 'ai-contract-analyzer', 'ai-content-generator'];

let failures = 0;

function logPass(msg) {
  console.log(`[PASS] ${msg}`);
}

function logFail(msg) {
  console.error(`[FAIL] ${msg}`);
  failures++;
}

console.log('--- RUNNING WORKSPACE & CSP VERIFICATION TESTS ---');

if (!fs.existsSync(WORKSPACE_DIR)) {
  logFail('workspace directory does not exist!');
  process.exit(1);
}

// 1. Verify required apps exist in workspace
REQUIRED_APPS.forEach(app => {
  const appDir = path.join(WORKSPACE_DIR, app);
  if (!fs.existsSync(appDir)) {
    logFail(`Missing application directory: workspace/${app}`);
    return;
  }
  logPass(`Found app directory: workspace/${app}`);

  // Check required files inside app directory
  const requiredFiles = ['index.html', 'app.js', 'style.css', 'README.md'];
  requiredFiles.forEach(file => {
    const filePath = path.join(appDir, file);
    if (!fs.existsSync(filePath)) {
      logFail(`Missing file in ${app}: ${file}`);
    } else {
      logPass(`File exists in ${app}: ${file}`);
    }
  });

  // Check README content for Malt reference and pricing
  const readmePath = path.join(appDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    if (readmeContent.includes('Malt') && (readmeContent.includes('TJM') || readmeContent.includes('€'))) {
      logPass(`${app}/README.md contains Malt reference and commercial pricing.`);
    } else {
      logFail(`${app}/README.md lacks explicit Malt reference or pricing info.`);
    }
  }

  // Check HTML file for CSP meta tag
  const htmlPath = path.join(appDir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    if (htmlContent.includes('http-equiv="Content-Security-Policy"')) {
      logPass(`${app}/index.html contains CSP meta tag.`);
    } else {
      logFail(`${app}/index.html missing Content-Security-Policy meta tag.`);
    }
  }
});

// Summary
if (failures > 0) {
  console.error(`\n❌ Verification failed with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log('\n✅ All workspace and CSP verification checks passed successfully.');
}
