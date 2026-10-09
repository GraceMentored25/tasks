import fs from 'fs';
import path from 'path';

console.log('--- Running Workspace Verification Tests ---');

// Check workspace folder
if (!fs.existsSync('workspace')) {
  console.error('FAIL: workspace directory missing');
  process.exit(1);
}

const apps = ['ai-customer-support-agent', 'ai-copywriting-assistant', 'ai-document-summarizer'];

let failed = false;

for (const app of apps) {
  const appPath = path.join('workspace', app);
  if (!fs.existsSync(appPath)) {
    console.error(`FAIL: Missing app folder ${appPath}`);
    failed = true;
    continue;
  }

  // Check required files
  const requiredFiles = ['index.html', 'app.js', 'styles.css', 'README.md'];
  for (const file of requiredFiles) {
    const filePath = path.join(appPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`FAIL: Missing ${file} in ${appPath}`);
      failed = true;
    }
  }

  // Check README content for job ref and pricing
  const readmePath = path.join(appPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    if (!readmeContent.includes('Malt') && !readmeContent.includes('Offer')) {
      console.error(`FAIL: ${readmePath} missing commercial job reference`);
      failed = true;
    }
    if (!readmeContent.includes('TJM') && !readmeContent.includes('Price Range')) {
      console.error(`FAIL: ${readmePath} missing TJM or Price Range info`);
      failed = true;
    }
  }

  // Check HTML for Content Security Policy meta tag (Sentinel pre-requisite check)
  const htmlPath = path.join(appPath, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    if (!htmlContent.includes('http-equiv="Content-Security-Policy"')) {
      console.error(`FAIL: ${htmlPath} missing Content-Security-Policy meta header`);
      failed = true;
    }
  }
}

if (failed) {
  console.error('Verification tests failed!');
  process.exit(1);
}

console.log('SUCCESS: All workspace verification checks passed successfully.');
