import fs from 'fs';
import path from 'path';

console.log('⚡ Running verification suite for AI MVP Workspace...');

const workspaceDir = path.join(process.cwd(), 'workspace');
const requiredApps = [
  'ai-contract-analyzer',
  'ai-support-chatbot',
  'ai-seo-content-generator'
];

let errors = 0;

if (!fs.existsSync(workspaceDir)) {
  console.error('❌ Error: workspace/ directory does not exist.');
  errors++;
} else {
  console.log('✅ workspace/ directory exists.');
}

requiredApps.forEach(appName => {
  const appDir = path.join(workspaceDir, appName);
  if (!fs.existsSync(appDir)) {
    console.error(`❌ Error: App directory missing: workspace/${appName}`);
    errors++;
    return;
  }

  const readmePath = path.join(appDir, 'README.md');
  const indexPath = path.join(appDir, 'index.html');

  if (!fs.existsSync(readmePath)) {
    console.error(`❌ Error: README.md missing in workspace/${appName}`);
    errors++;
  } else {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    if (!readmeContent.toLowerCase().includes('malt') && !readmeContent.toLowerCase().includes('offre')) {
      console.error(`❌ Error: README.md in workspace/${appName} must mention offer reference.`);
      errors++;
    }
    if (!readmeContent.includes('€')) {
      console.error(`❌ Error: README.md in workspace/${appName} must specify price range in €.`);
      errors++;
    }
  }

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: index.html missing in workspace/${appName}`);
    errors++;
  } else {
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    if (!htmlContent.includes('<!DOCTYPE html>') && !htmlContent.includes('<html')) {
      console.error(`❌ Error: index.html in workspace/${appName} does not contain valid HTML.`);
      errors++;
    }
  }
});

if (errors > 0) {
  console.error(`\n❌ Verification failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n🎉 Verification passed! All AI MVP web applications are properly structured and ready.');
}
