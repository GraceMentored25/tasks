import fs from 'node:fs';
import path from 'node:path';

function runVerification() {
  console.log('🔍 Running workspace verification tests...\n');
  let errors = [];

  // Check .jules/bolt.md exists
  if (!fs.existsSync('.jules/bolt.md')) {
    errors.push('Missing .jules/bolt.md file');
  }

  // Check workspace directory exists
  const workspaceDir = path.join(process.cwd(), 'workspace');
  if (!fs.existsSync(workspaceDir)) {
    errors.push('Missing workspace/ directory');
    return report(errors);
  }

  // Find subdirectories in workspace/
  const items = fs.readdirSync(workspaceDir, { withFileTypes: true });
  const subdirs = items.filter(i => i.isDirectory()).map(i => i.name);

  if (subdirs.length < 3) {
    errors.push(`Expected at least 3 AI MVP project subdirectories in workspace/, found ${subdirs.length}`);
  }

  subdirs.forEach(dirName => {
    const projectPath = path.join(workspaceDir, dirName);
    const readmePath = path.join(projectPath, 'README.md');
    const indexPath = path.join(projectPath, 'index.html');

    // Check README.md
    if (!fs.existsSync(readmePath)) {
      errors.push(`[${dirName}] Missing README.md`);
    } else {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      if (!readmeContent.toLowerCase().includes('malt') && !readmeContent.toLowerCase().includes('freelance')) {
        errors.push(`[${dirName}] README.md must reference commercial freelance/Malt platform listing`);
      }
      if (!readmeContent.includes('TJM') && !readmeContent.includes('€') && !readmeContent.includes('price')) {
        errors.push(`[${dirName}] README.md must specify estimated price range / TJM`);
      }
    }

    // Check index.html
    if (!fs.existsSync(indexPath)) {
      errors.push(`[${dirName}] Missing index.html`);
    } else {
      const htmlContent = fs.readFileSync(indexPath, 'utf8');
      if (!htmlContent.includes('<meta') || !htmlContent.toLowerCase().includes('viewport')) {
        errors.push(`[${dirName}] index.html missing mobile viewport meta tag`);
      }
    }
  });

  // Check workspace root index.html
  const workspaceIndex = path.join(workspaceDir, 'index.html');
  if (!fs.existsSync(workspaceIndex)) {
    errors.push('Missing workspace/index.html hub launcher');
  }

  report(errors);
}

function report(errors) {
  if (errors.length > 0) {
    console.error('❌ Verification failed with errors:');
    errors.forEach(err => console.error('  - ' + err));
    process.exit(1);
  } else {
    console.log('✅ Workspace verification passed successfully!');
  }
}

runVerification();
