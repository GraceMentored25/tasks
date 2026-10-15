import fs from 'fs';
import path from 'path';

console.log('⚡ Running verification tests...');

const workspaceDir = path.join(process.cwd(), 'workspace');
const requiredApps = ['ai-resume-generator', 'ai-support-agent', 'ai-content-studio'];

if (!fs.existsSync(workspaceDir)) {
  console.error('❌ Error: workspace directory missing!');
  process.exit(1);
}

let hasError = false;

for (const app of requiredApps) {
  const appPath = path.join(workspaceDir, app);
  if (!fs.existsSync(appPath)) {
    console.error(`❌ Missing app directory: ${app}`);
    hasError = true;
    continue;
  }

  const requiredFiles = ['index.html', 'app.js', 'style.css', 'README.md'];
  for (const file of requiredFiles) {
    const filePath = path.join(appPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing file ${file} in ${app}`);
      hasError = true;
    }
  }

  const readmePath = path.join(appPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    if (!readmeContent.includes('Malt') && !readmeContent.includes('Référence')) {
      console.error(`❌ README in ${app} lacks commercial Malt reference/pricing`);
      hasError = true;
    }
  }

  const htmlPath = path.join(appPath, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    if (!htmlContent.includes('Content-Security-Policy')) {
      console.warn(`⚠️ Warning: ${app}/index.html missing meta CSP tag`);
    }
  }
}

if (hasError) {
  console.error('❌ Verification failed!');
  process.exit(1);
} else {
  console.log('✅ All workspace applications verified successfully!');
}
