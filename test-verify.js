const fs = require('fs');
const path = require('path');

const workspaceDir = path.join(__dirname, 'workspace');
const requiredApps = [
  'ai-customer-support-bot',
  'ai-resume-optimizer',
  'ai-content-generator'
];

if (!fs.existsSync(workspaceDir)) {
  console.error('Error: workspace directory missing');
  process.exit(1);
}

let hasError = false;

requiredApps.forEach(appName => {
  const appPath = path.join(workspaceDir, appName);
  if (!fs.existsSync(appPath)) {
    console.error(`Error: Missing app directory ${appName}`);
    hasError = true;
    return;
  }

  ['index.html', 'app.js', 'README.md'].forEach(file => {
    const filePath = path.join(appPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Error: Missing ${file} in ${appName}`);
      hasError = true;
    }
  });

  const readmeContent = fs.readFileSync(path.join(appPath, 'README.md'), 'utf-8');
  if (!readmeContent.includes('Malt') && !readmeContent.includes('Prix moyen')) {
    console.error(`Error: README.md in ${appName} does not contain Malt reference or pricing`);
    hasError = true;
  }
});

if (hasError) {
  process.exit(1);
}

console.log('All workspace apps and required files verified successfully!');
