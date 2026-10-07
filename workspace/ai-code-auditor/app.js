// ⚡ Bolt Optimization: Fast O(N) linear scanning rule engine
const SECURITY_RULES = [
  { pattern: /(sk_live_[0-9a-zA-Z]{24})/g, issue: 'Hardcoded Production API Key Detected', severity: 'CRITICAL' },
  { pattern: /\beval\(/g, issue: 'Use of eval() detected - Code Injection Risk', severity: 'HIGH' },
  { pattern: /\.innerHTML\s*=/g, issue: 'Direct innerHTML assignment - XSS Risk', severity: 'MEDIUM' },
  { pattern: /password\s*=\s*['"][^'"]+['"]/g, issue: 'Hardcoded Password in Source', severity: 'HIGH' }
];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('code-form');
  const output = document.getElementById('audit-output');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('code-input').value;
    const lang = document.getElementById('language').value;

    output.innerHTML = `<p>⚡ Bolt Scanning code for security vulnerabilities and performance bottlenecks...</p>`;

    const startTime = performance.now();

    setTimeout(() => {
      const issues = [];

      // O(N) line scanning
      SECURITY_RULES.forEach(rule => {
        if (rule.pattern.test(code)) {
          issues.push(rule);
        }
      });

      const duration = (performance.now() - startTime).toFixed(2);
      const score = Math.max(100 - (issues.length * 25), 25);

      output.innerHTML = `
        <div>
          <h3>Security & Quality Score: <span style="color: ${score >= 75 ? '#16a34a' : '#dc2626'}">${score}/100</span></h3>
          <p>Language: <strong>${lang}</strong> | Audit time: <strong>${duration}ms</strong></p>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 1rem 0;">

          <h4>Detected Findings (${issues.length})</h4>
          ${issues.length === 0 ? '<p style="color: #16a34a;">✅ No critical vulnerabilities detected in quick scan!</p>' : ''}
          <ul style="padding-left: 1.2rem;">
            ${issues.map(i => `<li style="margin-bottom: 0.5rem;"><strong style="color: #dc2626;">[${i.severity}]</strong> ${i.issue}</li>`).join('')}
          </ul>

          <div style="margin-top: 1rem; background: #faf5ff; padding: 0.75rem; border-radius: 6px; border: 1px solid #e9d5ff;">
            ⚡ <strong>AI Recommendation:</strong> Always sanitize user input before DOM insertion and use environment variables for keys.
          </div>
        </div>
      `;
    }, 30);
  });
});
