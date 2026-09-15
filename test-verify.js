const fs = require('fs');
const path = require('path');

console.log('🔍 Running automated verification test suite...');

const requiredFiles = [
  '.jules/bolt.md',
  '.jules/palette.md',
  '.jules/sentinel.md',
  'index.html',
  'style.css',
  'workspace/ai-support-classifier/README.md',
  'workspace/ai-support-classifier/index.html',
  'workspace/ai-support-classifier/style.css',
  'workspace/ai-support-classifier/app.js',
  'workspace/ai-contract-extractor/README.md',
  'workspace/ai-contract-extractor/index.html',
  'workspace/ai-contract-extractor/style.css',
  'workspace/ai-contract-extractor/app.js',
  'workspace/ai-copy-generator/README.md',
  'workspace/ai-copy-generator/index.html',
  'workspace/ai-copy-generator/style.css',
  'workspace/ai-copy-generator/app.js'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Verification failed! Missing files:', missingFiles);
  process.exit(1);
}

// Verify CSP Meta Tag Presence in index.html files
const htmlFiles = [
  'index.html',
  'workspace/ai-support-classifier/index.html',
  'workspace/ai-contract-extractor/index.html',
  'workspace/ai-copy-generator/index.html'
];

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(path.join(__dirname, htmlFile), 'utf-8');
  if (!content.includes('Content-Security-Policy')) {
    console.error(`❌ Security check failed: CSP header missing in ${htmlFile}`);
    process.exit(1);
  }
});

console.log('✅ All 17 workspace files, journals, and CSP security configurations verified successfully!');
