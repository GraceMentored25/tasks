const fs = require('fs');
const path = require('path');

function runVerification() {
  console.log('🔍 Running workspace verification tests...');
  const workspaceDir = path.join(__dirname, 'workspace');

  if (!fs.existsSync(workspaceDir)) {
    console.error('❌ Error: workspace directory does not exist.');
    process.exit(1);
  }

  const projects = fs.readdirSync(workspaceDir).filter(file => {
    return fs.statSync(path.join(workspaceDir, file)).isDirectory();
  });

  if (projects.length === 0) {
    console.error('❌ Error: No AI projects found in workspace/');
    process.exit(1);
  }

  console.log(`Found ${projects.length} project(s) in workspace:`, projects);

  let errors = 0;

  for (const proj of projects) {
    const projPath = path.join(workspaceDir, proj);
    const readmePath = path.join(projPath, 'README.md');
    const indexPath = path.join(projPath, 'index.html');

    if (!fs.existsSync(readmePath)) {
      console.error(`❌ Project ${proj} is missing README.md`);
      errors++;
    } else {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      if (!readmeContent.toLowerCase().includes('malt') || !readmeContent.toLowerCase().includes('tjm')) {
        console.error(`❌ Project ${proj} README.md must reference Malt and TJM / price range.`);
        errors++;
      }
    }

    if (!fs.existsSync(indexPath)) {
      console.error(`❌ Project ${proj} is missing index.html`);
      errors++;
    } else {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      if (!indexContent.includes('http-equiv="Content-Security-Policy"')) {
        console.error(`❌ Project ${proj} index.html is missing Content Security Policy (CSP) header.`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Verification failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log('\n✅ All workspace tests passed successfully!');
}

runVerification();
