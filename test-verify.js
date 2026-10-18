const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const WORKSPACE_DIR = path.join(ROOT_DIR, 'workspace');

const requiredApps = [
  'ai-support-copilot',
  'ai-contract-analyzer',
  'ai-seo-content-generator'
];

function runTests() {
  console.log('🧪 Running workspace verification tests...');
  const errors = [];

  if (!fs.existsSync(WORKSPACE_DIR)) {
    errors.push('Workspace directory does not exist.');
  }

  for (const app of requiredApps) {
    const appDir = path.join(WORKSPACE_DIR, app);
    if (!fs.existsSync(appDir)) {
      errors.push(`App directory missing: ${app}`);
      continue;
    }

    const files = ['index.html', 'app.js', 'README.md'];
    for (const f of files) {
      if (!fs.existsSync(path.join(appDir, f))) {
        errors.push(`Missing file ${f} in ${app}`);
      }
    }

    const readmePath = path.join(appDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      if (!readmeContent.includes('Malt')) {
        errors.push(`README in ${app} must reference Malt job listing`);
      }
      if (!readmeContent.includes('TJM')) {
        errors.push(`README in ${app} must specify estimated TJM daily rate`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Tests Failed:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('✅ All workspace tests passed successfully!');
  }
}

runTests();
