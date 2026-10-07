const fs = require('fs');
const path = require('path');

console.log('⚡ Running Bolt Verification Test Suite...');

const workspaceDir = path.join(__dirname, 'workspace');
if (!fs.existsSync(workspaceDir)) {
  console.error('❌ workspace directory does not exist!');
  process.exit(1);
}

const requiredApps = [
  'ai-customer-support',
  'ai-seo-content-gen',
  'ai-code-auditor'
];

let failed = false;

for (const app of requiredApps) {
  const appPath = path.join(workspaceDir, app);
  if (!fs.existsSync(appPath)) {
    console.error(`❌ Missing project directory: workspace/${app}`);
    failed = true;
    continue;
  }

  const requiredFiles = ['index.html', 'app.js', 'styles.css', 'README.md'];
  for (const file of requiredFiles) {
    const filePath = path.join(appPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing required file: workspace/${app}/${file}`);
      failed = true;
    }
  }

  // Check README mentions Malt/Commercial reference and Price/TJM
  const readmePath = path.join(appPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    if (!content.includes('Malt') && !content.includes('Commercial Job Listing')) {
      console.error(`❌ README in workspace/${app} does not reference commercial job listing / Malt`);
      failed = true;
    }
    if (!content.includes('TJM') && !content.includes('Price')) {
      console.error(`❌ README in workspace/${app} does not specify TJM or price estimate`);
      failed = true;
    }
  }
}

if (failed) {
  console.error('❌ Verification failed!');
  process.exit(1);
}

console.log('✅ All workspace MVPs verified successfully!');
