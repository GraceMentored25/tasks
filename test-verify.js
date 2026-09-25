import fs from 'fs';
import path from 'path';

console.log('🔍 Running workspace test verification...');

const workspaceDir = path.resolve('workspace');

if (!fs.existsSync(workspaceDir)) {
  console.error('❌ Error: workspace directory does not exist!');
  process.exit(1);
}

const apps = fs.readdirSync(workspaceDir).filter(f => {
  return fs.statSync(path.join(workspaceDir, f)).isDirectory();
});

if (apps.length === 0) {
  console.error('❌ Error: No apps found in workspace directory!');
  process.exit(1);
}

console.log(`Found ${apps.length} application(s) in workspace: ${apps.join(', ')}`);

let hasError = false;

apps.forEach(app => {
  const appPath = path.join(workspaceDir, app);
  const readmePath = path.join(appPath, 'README.md');
  const indexPath = path.join(appPath, 'index.html');

  if (!fs.existsSync(readmePath)) {
    console.error(`❌ Error in ${app}: Missing README.md`);
    hasError = true;
  } else {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    if (!readmeContent.includes('Malt') && !readmeContent.includes('Commercial Job Reference')) {
      console.error(`❌ Error in ${app}: README.md does not reference a commercial job listing (Malt/TJM).`);
      hasError = true;
    }
  }

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error in ${app}: Missing index.html`);
    hasError = true;
  } else {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('<meta http-equiv="Content-Security-Policy"')) {
      console.error(`❌ Warning/Error in ${app}: index.html missing Content-Security-Policy meta tag.`);
      hasError = true;
    }
  }
});

if (hasError) {
  console.error('❌ Workspace verification failed.');
  process.exit(1);
}

console.log('✅ All workspace verification checks passed successfully!');
