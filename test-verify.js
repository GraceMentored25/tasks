import fs from 'fs';
import path from 'path';

console.log('🔍 Running MVP Workspace Verification Tests...');

const workspaceDir = path.join(process.cwd(), 'workspace');

if (!fs.existsSync(workspaceDir)) {
  console.error('❌ FAIL: workspace/ directory missing');
  process.exit(1);
}

const apps = fs.readdirSync(workspaceDir).filter(f => {
  return fs.statSync(path.join(workspaceDir, f)).isDirectory();
});

if (apps.length < 3) {
  console.error(`❌ FAIL: Expected at least 3 MVP directories in workspace/, found ${apps.length}`);
  process.exit(1);
}

let errors = 0;

for (const app of apps) {
  const appPath = path.join(workspaceDir, app);
  const readmePath = path.join(appPath, 'README.md');
  const indexPath = path.join(appPath, 'index.html');

  if (!fs.existsSync(readmePath)) {
    console.error(`❌ FAIL: ${app} missing README.md`);
    errors++;
  } else {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    if (!readmeContent.toLowerCase().includes('malt') && !readmeContent.toLowerCase().includes('tjm')) {
      console.error(`⚠️ WARNING: ${app}/README.md should mention Malt job offer or TJM reference`);
    }
  }

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ FAIL: ${app} missing index.html`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`❌ Verification failed with ${errors} error(s).`);
  process.exit(1);
}

console.log('✅ PASS: All workspace MVP apps verified successfully!');
