(function() {
  const contractInput = document.getElementById('contractInput');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clauseList = document.getElementById('clauseList');
  const riskScoreEl = document.getElementById('riskScore');
  const clausesCountEl = document.getElementById('clausesCount');
  const auditSpeedEl = document.getElementById('auditSpeed');

  // Pre-compiled regex patterns for zero-alloc matching performance
  const RISK_PATTERNS = [
    {
      level: 'high',
      title: 'Unlimited Liability Clause',
      regex: /without\s+limitation\s+of\s+liability|indemnify\s+and\s+hold\s+harmless\s+against\s+all\s+claims|unlimited\s+damages/i,
      recommendation: 'Cap total liability to 1x-2x total contract value or fees paid in preceding 12 months.'
    },
    {
      level: 'high',
      title: 'Broad IP Ownership Transfer',
      regex: /intellectual\ property\s+.*in\ perpetuity|all\ work\ product\ shall\ belong\ exclusively|prior\ intellectual\ property/i,
      recommendation: 'Carve out pre-existing IP and background tools. Transfer rights only upon receipt of full payment.'
    },
    {
      level: 'medium',
      title: 'Non-Compete / Exclusivity Restriction',
      regex: /shall\ not\ perform\ services\ for\ any\ competitor|exclusivity\ period\ of\ \d+\ months|non-compete/i,
      recommendation: 'Remove global non-compete clause or specify narrow industry/geographic scope with compensation.'
    },
    {
      level: 'medium',
      title: 'Strict Payment Terms / Late Fees Missing',
      regex: /payment\ terms\ \d+\ days|net\ 60|net\ 90/i,
      recommendation: 'Negotiate Net 30 or Net 15 days with statutory interest rate for overdue payments.'
    },
    {
      level: 'low',
      title: 'Standard Confidentiality / NDA',
      regex: /confidential\ information|disclose\ to\ third\ parties|secret/i,
      recommendation: 'Ensure mutual standard NDA terms with standard exceptions (public knowledge, legal order).'
    }
  ];

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runAudit() {
    const start = performance.now();
    const text = contractInput.value.trim();

    if (!text) {
      clauseList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem;">Please enter contract text above to audit.</div>';
      riskScoreEl.textContent = '--';
      clausesCountEl.textContent = '0';
      auditSpeedEl.textContent = '0ms';
      return;
    }

    // Split paragraphs efficiently
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 10);
    const flaggedClauses = [];
    let highCount = 0;
    let mediumCount = 0;

    paragraphs.forEach((para, idx) => {
      let matched = false;
      for (const pattern of RISK_PATTERNS) {
        if (pattern.regex.test(para)) {
          matched = true;
          if (pattern.level === 'high') highCount++;
          if (pattern.level === 'medium') mediumCount++;

          flaggedClauses.push({
            id: idx + 1,
            excerpt: para.length > 140 ? para.substring(0, 140) + '...' : para,
            title: pattern.title,
            level: pattern.level,
            recommendation: pattern.recommendation
          });
          break;
        }
      }
      if (!matched && para.length > 30) {
        flaggedClauses.push({
          id: idx + 1,
          excerpt: para.length > 140 ? para.substring(0, 140) + '...' : para,
          title: 'Standard Operational Clause',
          level: 'low',
          recommendation: 'Standard contractual clause reviewed.'
        });
      }
    });

    const totalScore = Math.min(100, (highCount * 35) + (mediumCount * 15) + 10);
    const elapsed = performance.now() - start;

    riskScoreEl.textContent = `${totalScore}/100`;
    riskScoreEl.style.color = totalScore >= 60 ? 'var(--danger)' : (totalScore >= 30 ? 'var(--warning)' : 'var(--success)');
    clausesCountEl.textContent = flaggedClauses.length.toString();
    auditSpeedEl.textContent = `${elapsed.toFixed(1)}ms`;

    // Render using DocumentFragment safely with escapeHTML
    const fragment = document.createDocumentFragment();
    flaggedClauses.forEach(c => {
      const card = document.createElement('div');
      card.className = `clause-card ${c.level}`;
      const safeTitle = escapeHTML(c.title);
      const safeExcerpt = escapeHTML(c.excerpt);
      const safeRecommendation = escapeHTML(c.recommendation);

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:0.9rem; color:var(--text);">${safeTitle}</strong>
          <span style="font-size:0.75rem; text-transform:uppercase; font-weight:bold; color:var(--${c.level === 'high' ? 'danger' : (c.level === 'medium' ? 'warning' : 'success')})">${c.level} Risk</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin: 6px 0;">"${safeExcerpt}"</p>
        <div style="font-size:0.8rem; color:var(--primary); background:#0f172a; padding:6px 10px; border-radius:4px; margin-top:6px;">💡 <strong>Fix:</strong> ${safeRecommendation}</div>
      `;
      fragment.appendChild(card);
    });

    clauseList.innerHTML = '';
    clauseList.appendChild(fragment);
  }

  analyzeBtn.addEventListener('click', runAudit);
})();
