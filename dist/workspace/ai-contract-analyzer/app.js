// Performance optimization by Bolt ⚡: Chunked non-blocking async text processing to preserve main thread FPS
const sampleContract = `CLAUSE 1: CONFIDENTIALITÉ
Les deux parties s'engagent à maintenir la confidentialité stricte des informations échangées.

CLAUSE 2: RESPONSABILITÉ ET LIMITATION
La responsabilité du prestataire est illimitée en cas de retard de livraison, incluant la perte de profits indirects.

CLAUSE 3: RÉSILIATION SANS PRÉAVIS
Le client se réserve le droit de résilier le présent contrat immédiatement et sans indemnité.

CLAUSE 4: PÉNALITÉS DE RETARD
Des pénalités forfaitaires de 10% par jour de retard seront appliquées automatiquement.`;

document.getElementById('contract-input').value = sampleContract;

const analyzeBtn = document.getElementById('analyze-btn');
const statusText = document.getElementById('status-text');
const riskScoreEl = document.getElementById('risk-score');
const progressFill = document.getElementById('progress-fill');
const findingsList = document.getElementById('findings-list');

// Cache to prevent re-parsing identical text
let lastAnalyzedText = '';
let cachedResults = null;

const RISK_PATTERNS = [
  { keyword: 'illimitée', level: 'high', title: 'Responsabilité Illimitée', desc: 'Risque financier majeur en cas de litige.' },
  { keyword: 'sans préavis', level: 'high', title: 'Résiliation Brutale', desc: 'Absence de délai de préavis pour la rupture.' },
  { keyword: 'pénalités', level: 'medium', title: 'Pénalités Strictes', desc: 'Vérifier le plafond des pénalités appliquées.' },
  { keyword: 'confidentialité', level: 'low', title: 'Engagements de Confidentialité', desc: 'Standard et conforme.' }
];

// Chunked processing engine (Bolt Optimization)
function processChunkedAnalysis(text, onProgress, onComplete) {
  const lines = text.split('\n');
  let index = 0;
  const findings = [];

  function processNext() {
    const startTime = performance.now();

    // Process lines for up to 12ms to avoid dropping UI frames
    while (index < lines.length && (performance.now() - startTime) < 12) {
      const line = lines[index].toLowerCase();
      RISK_PATTERNS.forEach(pattern => {
        if (line.includes(pattern.keyword)) {
          findings.push(pattern);
        }
      });
      index++;
    }

    const percent = Math.round((index / lines.length) * 100);
    onProgress(percent);

    if (index < lines.length) {
      setTimeout(processNext, 0); // Yield to main thread
    } else {
      onComplete(findings);
    }
  }

  processNext();
}

analyzeBtn.addEventListener('click', () => {
  const text = document.getElementById('contract-input').value.trim();
  if (!text) return;

  if (text === lastAnalyzedText && cachedResults) {
    statusText.textContent = 'Résultat récupéré du cache ⚡';
    displayResults(cachedResults);
    return;
  }

  statusText.textContent = 'Analyse en cours...';
  analyzeBtn.disabled = true;

  processChunkedAnalysis(
    text,
    (progress) => {
      progressFill.style.width = `${progress}%`;
    },
    (findings) => {
      lastAnalyzedText = text;
      cachedResults = findings;
      statusText.textContent = 'Analyse terminée !';
      analyzeBtn.disabled = false;
      displayResults(findings);
    }
  );
});

function displayResults(findings) {
  findingsList.innerHTML = '';

  if (findings.length === 0) {
    riskScoreEl.textContent = '100%';
    progressFill.style.width = '100%';
    findingsList.innerHTML = '<p class="empty-msg">Aucun risque majeur détecté dans ce document.</p>';
    return;
  }

  const highRisks = findings.filter(f => f.level === 'high').length;
  const score = Math.max(20, 100 - (highRisks * 25 + findings.length * 10));

  riskScoreEl.textContent = `${score}%`;
  progressFill.style.width = `${score}%`;

  const fragment = document.createDocumentFragment();
  findings.forEach(item => {
    const div = document.createElement('div');
    div.className = `finding-item ${item.level}`;
    div.innerHTML = `<strong>[${item.level.toUpperCase()}] ${item.title}</strong><p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;">${item.desc}</p>`;
    fragment.appendChild(div);
  });

  findingsList.appendChild(fragment);
}
