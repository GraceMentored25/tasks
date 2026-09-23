import fs from 'fs';
import path from 'path';

console.log("⚡ Starting Workspace Verification Test Suite...");

const requiredFiles = [
  'workspace/index.html',
  'workspace/ai-doc-qa-assistant/index.html',
  'workspace/ai-doc-qa-assistant/README.md',
  'workspace/ai-seo-content-generator/index.html',
  'workspace/ai-seo-content-generator/README.md',
  'workspace/ai-code-reviewer/index.html',
  'workspace/ai-code-reviewer/README.md',
  '.jules/bolt.md'
];

let errors = 0;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ Found: ${file}`);
  } else {
    console.error(`  ✗ Missing file: ${file}`);
    errors++;
  }
});

// Check Malt References in READMEs
const apps = ['ai-doc-qa-assistant', 'ai-seo-content-generator', 'ai-code-reviewer'];
apps.forEach(app => {
  const readmePath = path.join('workspace', app, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    if (content.includes('Malt Reference:')) {
      console.log(`  ✓ Malt reference present in ${app}/README.md`);
    } else {
      console.error(`  ✗ Missing Malt reference in ${app}/README.md`);
      errors++;
    }
  }
});

if (errors > 0) {
  console.error(`\n❌ Verification Failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log("\n✅ All workspace apps and verification checks PASSED successfully!");
}
