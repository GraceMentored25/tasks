const fs = require('fs');
const path = require('path');

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
  console.error('❌ Error: No MVP projects found inside workspace/.');
  process.exit(1);
}

console.log(`Found ${projects.length} project(s) in workspace: ${projects.join(', ')}`);

let hasErrors = false;

projects.forEach(project => {
  const projDir = path.join(workspaceDir, project);
  const indexPath = path.join(projDir, 'index.html');
  const readmePath = path.join(projDir, 'README.md');

  // Check index.html exists
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ [${project}] Missing index.html`);
    hasErrors = true;
  } else {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    if (!indexContent.includes('Content-Security-Policy')) {
      console.error(`❌ [${project}] index.html missing Content-Security-Policy meta tag`);
      hasErrors = true;
    }
  }

  // Check README.md exists
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ [${project}] Missing README.md`);
    hasErrors = true;
  } else {
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    const hasRef = /Malt|Ref|Offre|Freelance/i.test(readmeContent);
    const hasPrice = /TJM|€|Prix|Price|Budget/i.test(readmeContent);

    if (!hasRef) {
      console.error(`❌ [${project}] README.md missing commercial offer reference`);
      hasErrors = true;
    }
    if (!hasPrice) {
      console.error(`❌ [${project}] README.md missing price range or TJM reference`);
      hasErrors = true;
    }
  }
});

if (hasErrors) {
  console.error('❌ Workspace verification failed.');
  process.exit(1);
} else {
  console.log('✅ All workspace projects verified successfully!');
}
