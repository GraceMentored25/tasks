import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = path.resolve(process.cwd(), 'workspace');

function verifyWorkspace() {
  console.log('🔍 Running workspace verification tests...');

  if (!fs.existsSync(WORKSPACE_DIR)) {
    throw new Error('❌ Verification Failed: "workspace/" directory does not exist.');
  }

  const projects = fs.readdirSync(WORKSPACE_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (projects.length < 3) {
    throw new Error(`❌ Verification Failed: Expected at least 3 MVP projects in workspace/, found ${projects.length}`);
  }

  console.log(`✅ Found ${projects.length} MVP projects in workspace/: ${projects.join(', ')}`);

  for (const proj of projects) {
    const projPath = path.join(WORKSPACE_DIR, proj);
    const indexPath = path.join(projPath, 'index.html');
    const readmePath = path.join(projPath, 'README.md');

    if (!fs.existsSync(indexPath)) {
      throw new Error(`❌ Verification Failed: Missing index.html in ${proj}`);
    }

    if (!fs.existsSync(readmePath)) {
      throw new Error(`❌ Verification Failed: Missing README.md in ${proj}`);
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    if (!indexContent.includes('Content-Security-Policy')) {
      throw new Error(`❌ Security Check Failed: ${proj}/index.html is missing a Content-Security-Policy meta tag.`);
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    const lowerReadme = readmeContent.toLowerCase();
    if (!lowerReadme.includes('malt') && !lowerReadme.includes('freelance') && !lowerReadme.includes('offre')) {
      throw new Error(`❌ Business Check Failed: ${proj}/README.md should reference a commercial offer (e.g., Malt).`);
    }

    if (!readmeContent.includes('TJM') && !readmeContent.includes('€') && !readmeContent.includes('Budget')) {
      throw new Error(`❌ Business Check Failed: ${proj}/README.md should specify estimated TJM or budget.`);
    }

    console.log(`  ✓ ${proj}: HTML, CSP, and README commercial reference validated.`);
  }

  console.log('🎉 All workspace verification checks passed successfully!');
}

try {
  verifyWorkspace();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
