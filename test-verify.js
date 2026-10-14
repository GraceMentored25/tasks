import fs from 'fs';
import path from 'path';

console.log('🔍 Running workspace verification tests...');

const requiredApps = [
  'ai-legal-contract-analyzer',
  'ai-ecommerce-copywriter',
  'ai-customer-support-copilot'
];

let errors = [];

// 1. Check workspace folder exists
const workspaceDir = path.join(process.cwd(), 'workspace');
if (!fs.existsSync(workspaceDir)) {
  errors.push('Missing workspace directory');
} else {
  // 2. Check each MVP app folder and required README
  for (const app of requiredApps) {
    const appDir = path.join(workspaceDir, app);
    if (!fs.existsSync(appDir)) {
      errors.push(`Missing app directory: workspace/${app}`);
      continue;
    }

    const readmePath = path.join(appDir, 'README.md');
    if (!fs.existsSync(readmePath)) {
      errors.push(`Missing README.md in workspace/${app}`);
    } else {
      const content = fs.readFileSync(readmePath, 'utf8');
      // Verify job reference and rate/TJM details exist
      if (!content.toLowerCase().includes('malt') && !content.toLowerCase().includes('freelance')) {
        errors.push(`workspace/${app}/README.md must reference a commercial listing (Malt/Freelance)`);
      }
      if (!content.includes('€') && !content.toLowerCase().includes('tjm') && !content.toLowerCase().includes('price')) {
        errors.push(`workspace/${app}/README.md must mention rate/price range/TJM`);
      }
    }

    const indexPath = path.join(appDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      errors.push(`Missing index.html in workspace/${app}`);
    }
  }
}

// 3. Check bolt journal
const boltJournalPath = path.join(process.cwd(), '.jules', 'bolt.md');
if (!fs.existsSync(boltJournalPath)) {
  errors.push('Missing .jules/bolt.md journal');
}

if (errors.length > 0) {
  console.error('❌ Verification failed with errors:');
  errors.forEach(err => console.error(` - ${err}`));
  process.exit(1);
} else {
  console.log('✅ All workspace structure & compliance tests passed!');
}
