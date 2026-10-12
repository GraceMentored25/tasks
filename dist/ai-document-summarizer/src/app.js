/**
 * AI Document Summarizer - Application Logic
 * Pre-compiled regex pattern matching and chunk processing by Bolt ⚡.
 */

// Pre-compiled regex patterns compiled once at initialization to prevent repetitive GC & compilation
const KEY_PATTERNS = [
  { name: 'Prix / Tarifs', regex: /(?:prix|montant|forfait|acompte|€|\$|EUR)/i, color: 'text-emerald-400' },
  { name: 'Engagements / Obligations', regex: /(?:engage|obligation|conception|déploiement|livraison)/i, color: 'text-indigo-400' },
  { name: 'Confidentialité / RGPD', regex: /(?:confidentialité|rgpd|données|secret)/i, color: 'text-amber-400' }
];

// Debounce helper
function debounce(fn, delayMs = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

function processDocument(rawText) {
  if (!rawText.trim()) return;

  const t0 = performance.now();

  // Chunk paragraphs in single-pass split
  const paragraphs = rawText.split(/\n+/).filter(p => p.trim().length > 0);
  const summaryBullets = [];

  paragraphs.forEach((p, idx) => {
    let matchedTag = null;
    let matchedColor = 'text-slate-300';

    for (const pat of KEY_PATTERNS) {
      if (pat.regex.test(p)) {
        matchedTag = pat.name;
        matchedColor = pat.color;
        break;
      }
    }

    summaryBullets.push({
      index: idx + 1,
      tag: matchedTag || 'Général',
      color: matchedColor,
      text: p.length > 150 ? p.substring(0, 150) + '...' : p
    });
  });

  const t1 = performance.now();

  // Compression metrics calculation
  const originalLen = rawText.length;
  const summaryLen = summaryBullets.reduce((acc, b) => acc + b.text.length, 0);
  const ratio = originalLen > 0 ? Math.round((1 - (summaryLen / originalLen)) * 100) : 0;

  // Render UI
  document.getElementById('compression-ratio').textContent = `${Math.max(0, ratio)}%`;
  document.getElementById('bullet-count').textContent = `${summaryBullets.length} points`;
  document.getElementById('scan-perf').textContent = `Scan speed: ${(t1 - t0).toFixed(2)}ms`;

  const outputContainer = document.getElementById('summary-output');
  outputContainer.innerHTML = summaryBullets.map(b => `
    <div class="p-2.5 rounded bg-slate-800/80 border border-slate-700/60 mb-2">
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="font-bold uppercase ${b.color}">${b.tag}</span>
        <span class="text-slate-500">Paragraphe #${b.index}</span>
      </div>
      <p class="text-slate-300 text-xs">${b.text}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const docInput = document.getElementById('doc-input');
  const docLength = document.getElementById('doc-length');

  function updateInputMetrics() {
    docLength.textContent = `${docInput.value.length} caractères`;
  }

  updateInputMetrics();
  processDocument(docInput.value);

  docInput.addEventListener('input', debounce(() => {
    updateInputMetrics();
    processDocument(docInput.value);
  }, 200));

  document.getElementById('btn-analyze')?.addEventListener('click', () => {
    processDocument(docInput.value);
  });

  document.getElementById('btn-copy-summary')?.addEventListener('click', () => {
    const text = document.getElementById('summary-output').innerText;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('btn-copy-summary');
    btn.textContent = 'Copié !';
    setTimeout(() => { btn.textContent = 'Copier la Synthèse'; }, 1500);
  });
});
