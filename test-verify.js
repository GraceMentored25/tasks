const fs = require('fs');
const path = require('path');

function runVerification() {
  console.log('⚡ Starting Commercial AI MVPs Verification Test Suite...\n');

  const requiredPaths = [
    '.jules/bolt.md',
    'workspace/index.html',
    'workspace/ai-seo-content-generator/README.md',
    'workspace/ai-seo-content-generator/index.html',
    'workspace/ai-customer-lead-scoring/README.md',
    'workspace/ai-customer-lead-scoring/index.html',
    'workspace/ai-code-reviewer-assistant/README.md',
    'workspace/ai-code-reviewer-assistant/index.html',
  ];

  let errors = 0;

  requiredPaths.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing required file: ${filePath}`);
      errors++;
    } else {
      console.log(`✅ File exists: ${filePath}`);
    }
  });

  // Verify Malt offer references & TJM in READMEs
  const projects = [
    'ai-seo-content-generator',
    'ai-customer-lead-scoring',
    'ai-code-reviewer-assistant'
  ];

  projects.forEach((proj) => {
    const readmePath = path.join('workspace', proj, 'README.md');
    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf8');
      if (!content.includes('Malt') && !content.includes('Offer') && !content.includes('Référence') && !content.includes('Reference')) {
        console.error(`❌ ${readmePath} must include a commercial job listing reference (e.g., Malt).`);
        errors++;
      }
      if (!content.includes('TJM') && !content.includes('Prix') && !content.includes('Budget')) {
        console.error(`❌ ${readmePath} must include price range / TJM estimate.`);
        errors++;
      }
    }
  });

  if (errors > 0) {
    console.error(`\n❌ Verification failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log('\n⚡ All commercial AI MVP verification checks passed successfully!');
}

runVerification();
