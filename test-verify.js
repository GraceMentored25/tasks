import fs from 'fs';
import path from 'path';

console.log('--- Running Bolt Verification Tests ---');

// Check workspace folder exists and has at least 3 apps
const workspaceDir = path.resolve('workspace');
if (!fs.existsSync(workspaceDir)) {
  console.error('❌ Missing workspace/ folder');
  process.exit(1);
}

const apps = fs.readdirSync(workspaceDir).filter(f => fs.statSync(path.join(workspaceDir, f)).isDirectory());
if (apps.length < 3) {
  console.error(`❌ Expected at least 3 AI MVP web apps in workspace/, found ${apps.length}`);
  process.exit(1);
}

// Verify each app has a README.md referencing Malt and an index.html
for (const app of apps) {
  const appPath = path.join(workspaceDir, app);
  const readmePath = path.join(appPath, 'README.md');
  const indexPath = path.join(appPath, 'index.html');

  if (!fs.existsSync(readmePath)) {
    console.error(`❌ App ${app} missing README.md`);
    process.exit(1);
  }

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ App ${app} missing index.html`);
    process.exit(1);
  }

  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  if (!readmeContent.toLowerCase().includes('malt') || (!readmeContent.includes('€') && !readmeContent.includes('TJM'))) {
    console.error(`❌ App ${app} README.md must reference Malt and price/TJM details`);
    process.exit(1);
  }
}

// Verify journal file .jules/bolt.md exists
const journalPath = path.resolve('.jules/bolt.md');
if (!fs.existsSync(journalPath)) {
  console.error('❌ Missing journal file .jules/bolt.md');
  process.exit(1);
}

console.log('✅ All verification checks passed successfully!');
