import fs from 'fs';
import path from 'path';

console.log('🧪 Running workspace verification tests...');

const workspaceDir = path.resolve('workspace');

if (!fs.existsSync(workspaceDir)) {
  console.error('❌ FAIL: workspace/ directory does not exist');
  process.exit(1);
}

const entries = fs.readdirSync(workspaceDir, { withFileTypes: true });
const subdirs = entries.filter(e => e.isDirectory()).map(e => e.name);

console.log(`Found ${subdirs.length} solution projects in workspace/: ${subdirs.join(', ')}`);

if (subdirs.length < 3) {
  console.error(`❌ FAIL: Expected at least 3 MVP project subdirectories in workspace/, found ${subdirs.length}`);
  process.exit(1);
}

let errors = [];

for (const subdir of subdirs) {
  const dirPath = path.join(workspaceDir, subdir);
  const readmePath = path.join(dirPath, 'README.md');
  const htmlPath = path.join(dirPath, 'index.html');

  if (!fs.existsSync(readmePath)) {
    errors.push(`Missing README.md in ${subdir}`);
    continue;
  }

  if (!fs.existsSync(htmlPath)) {
    errors.push(`Missing index.html in ${subdir}`);
    continue;
  }

  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  if (!readmeContent.includes('Malt') && !readmeContent.includes('Platform')) {
    errors.push(`${subdir}/README.md should reference commercial platform (e.g., Malt)`);
  }

  if (!/TJM|Budget|€|\$|EUR/i.test(readmeContent)) {
    errors.push(`${subdir}/README.md should specify estimated price range or TJM`);
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  if (!htmlContent.includes('Content-Security-Policy') && !htmlContent.includes('http-equiv="Content-Security-Policy"')) {
    errors.push(`${subdir}/index.html missing CSP meta tag for security compliance`);
  }
}

if (errors.length > 0) {
  console.error('❌ Test Verification Errors:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

console.log('✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
