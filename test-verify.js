const fs = require('fs');
const path = require('path');

function runVerification() {
  console.log('🔍 Running workspace verification tests...');

  const workspaceDir = path.join(__dirname, 'workspace');
  if (!fs.existsSync(workspaceDir)) {
    console.error('❌ Workspace directory missing!');
    process.exit(1);
  }

  const apps = fs.readdirSync(workspaceDir).filter(file => {
    return fs.statSync(path.join(workspaceDir, file)).isDirectory();
  });

  if (apps.length < 3) {
    console.error(`❌ Expected at least 3 AI MVPs in workspace/, found ${apps.length}`);
    process.exit(1);
  }

  let errors = [];

  apps.forEach(app => {
    const appDir = path.join(workspaceDir, app);
    const readmePath = path.join(appDir, 'README.md');
    const htmlPath = path.join(appDir, 'index.html');
    const jsPath = path.join(appDir, 'app.js');

    if (!fs.existsSync(readmePath)) {
      errors.push(`${app}: Missing README.md`);
    } else {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      if (!readmeContent.includes('Malt') && !readmeContent.includes('Référence')) {
        errors.push(`${app}: README.md missing freelance platform (Malt) reference`);
      }
      if (!readmeContent.includes('Prix') && !readmeContent.includes('Price') && !readmeContent.includes('€')) {
        errors.push(`${app}: README.md missing price range estimation`);
      }
    }

    if (!fs.existsSync(htmlPath)) {
      errors.push(`${app}: Missing index.html`);
    } else {
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      if (!htmlContent.includes('Content-Security-Policy')) {
        errors.push(`${app}: index.html missing Content-Security-Policy meta tag`);
      }
    }

    if (!fs.existsSync(jsPath)) {
      errors.push(`${app}: Missing app.js`);
    }
  });

  if (errors.length > 0) {
    console.error('❌ Verification failed with the following errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`✅ All ${apps.length} AI MVP web applications successfully verified!`);
}

runVerification();
