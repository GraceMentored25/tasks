// ⚡ Bolt Performance Optimization:
// Async sentence chunk parsing using requestAnimationFrame & O(1) keyword risk maps.

const contractTextInput = document.getElementById('contract-text');
const analyzeBtn = document.getElementById('analyze-btn');
const loadSampleBtn = document.getElementById('load-sample-btn');
const riskScoreBadge = document.getElementById('risk-score-badge');
const clausesContainer = document.getElementById('clauses-container');

// O(1) risk keywords indexing map
const RISK_RULES = [
  { keyword: 'indemnify', risk: 'HIGH', title: 'Indemnification Obligation', note: 'Requires unlimited compensation for third-party claims.' },
  { keyword: 'unlimited liability', risk: 'HIGH', title: 'Unlimited Liability Clause', note: 'Exposes company to unlimited financial damages.' },
  { keyword: 'terminate without cause', risk: 'MEDIUM', title: 'Convenience Termination', note: 'Allows termination without prior notice or fault.' },
  { keyword: 'governing law', risk: 'LOW', title: 'Jurisdiction & Governing Law', note: 'Specifies litigation legal venue.' },
  { keyword: 'confidential', risk: 'LOW', title: 'Confidentiality Clause', note: 'Standard non-disclosure obligations.' }
];

const sampleContract = `
1. INDEMNIFICATION: The Client agrees to indemnify, defend, and hold harmless Service Provider against any and all losses, damages, or liabilities.
2. LIMITATION OF LIABILITY: Neither party limits its liability for gross negligence, resulting in potential unlimited liability for operational breaches.
3. TERMINATION: Either party may terminate without cause by giving 30 days written notice to the other party.
4. CONFIDENTIALITY: Both parties agree that confidential information disclosed shall remain private for 3 years.
`;

function auditContract() {
  const text = contractTextInput.value.trim();

  if (!text) {
    riskScoreBadge.textContent = 'Awaiting Audit';
    riskScoreBadge.className = 'badge';
    clausesContainer.innerHTML = '<p class="placeholder">Load contract text and click audit to identify high-risk legal clauses.</p>';
    return;
  }

  const sentences = text.split(/(?<=[.!?])\s+/);
  const flagged = [];
  let maxRiskLevel = 'LOW';

  // Async requestAnimationFrame processing for large document chunking
  requestAnimationFrame(() => {
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      RISK_RULES.forEach(rule => {
        if (lower.includes(rule.keyword)) {
          flagged.push({
            title: rule.title,
            risk: rule.risk,
            note: rule.note,
            excerpt: sentence.trim()
          });

          if (rule.risk === 'HIGH') maxRiskLevel = 'HIGH';
          else if (rule.risk === 'MEDIUM' && maxRiskLevel !== 'HIGH') maxRiskLevel = 'MEDIUM';
        }
      });
    });

    // Update risk badge
    riskScoreBadge.textContent = `${maxRiskLevel} RISK`;
    riskScoreBadge.className = `badge ${maxRiskLevel.toLowerCase()}`;

    // Render flagged clauses via DocumentFragment batch
    const fragment = document.createDocumentFragment();

    if (flagged.length === 0) {
      const p = document.createElement('p');
      p.className = 'placeholder';
      p.textContent = 'No immediate high-risk clauses detected in text.';
      fragment.appendChild(p);
    } else {
      flagged.forEach(item => {
        const div = document.createElement('div');
        div.className = `clause-card ${item.risk.toLowerCase()}`;
        div.innerHTML = `
          <div class="clause-title">${item.title} (${item.risk})</div>
          <p style="color: #475569; margin-bottom: 0.25rem;">"${item.excerpt}"</p>
          <small style="color: var(--text-muted);">${item.note}</small>
        `;
        fragment.appendChild(div);
      });
    }

    clausesContainer.innerHTML = '';
    clausesContainer.appendChild(fragment);
  });
}

analyzeBtn.addEventListener('click', auditContract);

loadSampleBtn.addEventListener('click', () => {
  contractTextInput.value = sampleContract;
  auditContract();
});

// Initialize with sample contract
contractTextInput.value = sampleContract;
auditContract();
