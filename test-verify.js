import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_DIR = path.resolve('workspace');

function runTests() {
  console.log('🧪 Running workspace structure & verification tests...');

  if (!fs.existsSync(WORKSPACE_DIR)) {
    console.error('❌ FAIL: workspace/ directory does not exist');
    process.exit(1);
  }

  const entries = fs.readdirSync(WORKSPACE_DIR, { withFileTypes: true });
  const appDirs = entries.filter(e => e.isDirectory()).map(e => e.name);

  if (appDirs.length === 0) {
    console.error('❌ FAIL: No app directories found in workspace/');
    process.exit(1);
  }

  console.log(`📁 Found ${appDirs.length} application(s) in workspace/`);

  for (const appName of appDirs) {
    const appPath = path.join(WORKSPACE_DIR, appName);
    const readmePath = path.join(appPath, 'README.md');
    const indexPath = path.join(appPath, 'index.html');

    if (!fs.existsSync(readmePath)) {
      console.error(`❌ FAIL: App ${appName} missing README.md`);
      process.exit(1);
    }

    if (!fs.existsSync(indexPath)) {
      console.error(`❌ FAIL: App ${appName} missing index.html`);
      process.exit(1);
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    if (!readmeContent.toLowerCase().includes('malt') && !readmeContent.toLowerCase().includes('freelance')) {
      console.error(`❌ FAIL: App ${appName} README.md does not reference Malt or commercial job offer`);
      process.exit(1);
    }

    if (!readmeContent.includes('€') && !readmeContent.toLowerCase().includes('tjm')) {
      console.error(`❌ FAIL: App ${appName} README.md missing TJM or price estimation`);
      process.exit(1);
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    if (!indexContent.includes('meta http-equiv="Content-Security-Policy"') && !indexContent.includes('<!DOCTYPE html>')) {
      console.error(`❌ FAIL: App ${appName} index.html invalid HTML format`);
      process.exit(1);
    }

    console.log(`✅ Verified app: ${appName}`);
  }

  console.log('🎉 All workspace verification tests passed successfully!');
}

runTests();
