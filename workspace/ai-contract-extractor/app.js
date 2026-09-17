// Security Helper: DOM Sanitization to prevent XSS Attacks
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PATTERNS = [
  {
    type: 'Indemnification & Liability',
    regex: /(indemnif|hold harmless|unlimited liability|consequential damages)/gi,
    weight: 35,
    riskLevel: 'HIGH',
    explanation: 'Contains indemnity obligations or potential unlimited liability exposure.'
  },
  {
    type: 'Termination & Auto-Renewal',
    regex: /(auto-renew|automatic renewal|terminate without cause|30 days notice)/gi,
    weight: 25,
    riskLevel: 'MEDIUM',
    explanation: 'Specifies auto-renewal or unilateral cancellation terms.'
  },
  {
    type: 'Intellectual Property Rights',
    regex: /(intellectual property|work for hire|assignment of rights|ownership)/gi,
    weight: 20,
    riskLevel: 'MEDIUM',
    explanation: 'Defines IP ownership transfers or licensing grants.'
  },
  {
    type: 'Governing Law & Jurisdiction',
    regex: /(governing law|jurisdiction|arbitration|venue|courts of)/gi,
    weight: 10,
    riskLevel: 'LOW',
    explanation: 'Establishes legal jurisdiction and dispute resolution venue.'
  }
];

function parseContract(rawText) {
  const t0 = performance.now();
  // Bound max contract input length to 15,000 characters
  const boundedText = rawText.slice(0, 15000);

  if (!boundedText.trim()) {
    return { score: 0, rating: 'N/A', clauses: [], time: '0.0 ms' };
  }

  let totalScore = 0;
  let detectedClauses = [];

  const sentences = boundedText.split(/(?<=[.?!])\s+/);

  PATTERNS.forEach(pattern => {
    // Reset global regex index to prevent stateful .test() skips across sentences
    pattern.regex.lastIndex = 0;
    const matches = sentences.filter(sentence => {
      pattern.regex.lastIndex = 0;
      return pattern.regex.test(sentence);
    });
    if (matches.length > 0) {
      totalScore += pattern.weight;
      detectedClauses.push({
        type: sanitizeInput(pattern.type),
        riskLevel: sanitizeInput(pattern.riskLevel),
        weight: pattern.weight,
        explanation: sanitizeInput(pattern.explanation),
        snippet: sanitizeInput(matches[0])
      });
    }
  });

  const normalizedScore = Math.min(100, totalScore);
  let rating = 'Low Risk 🟢';
  if (normalizedScore >= 60) rating = 'High Risk 🔴';
  else if (normalizedScore >= 30) rating = 'Medium Risk 🟡';

  const t1 = performance.now();
  return {
    score: normalizedScore,
    rating,
    clauses: detectedClauses,
    time: `${(t1 - t0).toFixed(2)} ms`
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const contractInput = document.getElementById('contractInput');
  const extractBtn = document.getElementById('extractBtn');
  const sampleContractBtn = document.getElementById('sampleContractBtn');

  const riskScore = document.getElementById('riskScore');
  const riskRating = document.getElementById('riskRating');
  const clausesCount = document.getElementById('clausesCount');
  const parseTime = document.getElementById('parseTime');
  const clausesList = document.getElementById('clausesList');

  function render() {
    const res = parseContract(contractInput.value);
    riskScore.textContent = `${res.score} / 100`;
    riskRating.textContent = res.rating;
    clausesCount.textContent = res.clauses.length;
    parseTime.textContent = res.time;

    if (res.clauses.length === 0) {
      clausesList.innerHTML = `<p class="empty-msg">No key risk clauses detected.</p>`;
      return;
    }

    clausesList.innerHTML = res.clauses.map(c => `
      <div class="clause-card ${c.riskLevel.toLowerCase()}-risk">
        <div class="clause-title">
          <span>${c.type}</span>
          <span class="risk-tag tag-${c.riskLevel.toLowerCase()}">${c.riskLevel} RISK</span>
        </div>
        <p style="margin-bottom:0.5rem; font-size:0.9rem; color:#cbd5e1;">${c.explanation}</p>
        <blockquote style="font-size:0.85rem; font-style:italic; color:#94a3b8; border-left:2px solid #334155; padding-left:0.5rem;">
          "${c.snippet}"
        </blockquote>
      </div>
    `).join('');
  }

  extractBtn.addEventListener('click', render);
  sampleContractBtn.addEventListener('click', () => {
    contractInput.value = "This Agreement shall auto-renew annually unless terminated with 30 days notice. Contractor agrees to indemnify and hold harmless the Client against all consequential damages. All work for hire IP rights are hereby assigned completely.";
    render();
  });

  contractInput.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      render();
    }
  });
});
