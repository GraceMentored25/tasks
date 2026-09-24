// Pre-compiled regular expressions for static analysis rules
const RULES = [
  {
    id: 'eval_use',
    type: 'danger',
    title: '🚨 Critical Security Risk: `eval()` Detected',
    regex: /\beval\s*\(/g,
    suggestion: 'Avoid using eval() as it enables arbitrary code execution / command injection.'
  },
  {
    id: 'inner_html',
    type: 'warning',
    title: '⚠️ Security Risk: Unsanitized `innerHTML` Assignment',
    regex: /\.innerHTML\s*=/g,
    suggestion: 'Use textContent or sanitized DOM elements to prevent Cross-Site Scripting (XSS).'
  },
  {
    id: 'hardcoded_secret',
    type: 'danger',
    title: '🚨 Hardcoded Secret / API Key Detected',
    regex: /(api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-]{8,}['"]/gi,
    suggestion: 'Store sensitive keys in environment variables or secure key vaults.'
  },
  {
    id: 'sync_xhr',
    type: 'warning',
    title: '⚡ Performance Issue: Synchronous Operation or Loop Bottleneck',
    regex: /(for\s*\(.*\)\s*\{[\s\S]*for\s*\(.*\)|XMLHttpRequest)/g,
    suggestion: 'Refactor nested loops or synchronous network requests to async fetch/Worker.'
  }
];

// Bolt Cache: Stores rule evaluation results by snippet hash
const auditCache = new Map();

const SAMPLE_CODE = `// Sample JS Code
const apiKey = "sk_live_99481a8c7df92";
function processData(input) {
  eval(input); // unsafe
  document.getElementById("output").innerHTML = input;
}
`;

document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const auditBtn = document.getElementById('audit-btn');
  const reportOutput = document.getElementById('report-output');
  const perfMetrics = document.getElementById('perf-metrics');

  codeInput.value = SAMPLE_CODE;

  function runAudit() {
    const t0 = performance.now();
    const code = codeInput.value;

    if (!code.trim()) {
      reportOutput.innerHTML = `<p class="placeholder">Please enter code to audit.</p>`;
      return;
    }

    if (auditCache.has(code)) {
      const cached = auditCache.get(code);
      const t1 = performance.now();
      renderReport(cached, (t1 - t0).toFixed(2), true);
      return;
    }

    const issues = [];
    RULES.forEach(rule => {
      rule.regex.lastIndex = 0; // Reset stateful global regex
      if (rule.regex.test(code)) {
        issues.push({
          type: rule.type,
          title: rule.title,
          suggestion: rule.suggestion
        });
      }
    });

    if (issues.length === 0) {
      issues.push({
        type: 'success',
        title: '✅ Clean Audit Pass',
        suggestion: 'No critical security vulnerabilities or immediate performance bottlenecks detected.'
      });
    }

    auditCache.set(code, issues);
    const t1 = performance.now();
    renderReport(issues, (t1 - t0).toFixed(2), false);
  }

  function renderReport(issues, durationMs, isCached) {
    requestAnimationFrame(() => {
      reportOutput.innerHTML = '';
      issues.forEach(issue => {
        const item = document.createElement('div');
        item.className = `issue-item ${issue.type}`;
        item.innerHTML = `
          <div class="issue-title">${issue.title}</div>
          <div class="issue-desc" style="font-size: 0.85rem; color: var(--text-muted);">${issue.suggestion}</div>
        `;
        reportOutput.appendChild(item);
      });
      perfMetrics.innerText = `Scan Time: ${durationMs}ms (${isCached ? 'Cache Hit' : 'Computed'})`;
    });
  }

  auditBtn.addEventListener('click', runAudit);

  // Initial audit
  runAudit();
});
