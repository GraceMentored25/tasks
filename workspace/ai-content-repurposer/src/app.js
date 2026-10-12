/**
 * AI Content Repurposer - Application Logic
 * Single-pass regex parsing and memoized transform pipelines by Bolt ⚡.
 */

// Cache for generated format variations to avoid redundant processing
const transformCache = new Map();

let currentTab = 'twitter';

// Debounce helper for smooth user input
function debounce(fn, delayMs = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

// Single-pass regex counter for word and estimated token metrics
function computeMetrics(text) {
  if (!text.trim()) return { words: 0, tokens: 0 };

  // Single pass regex word boundary extraction
  const words = text.trim().match(/\S+/g) || [];
  const wordCount = words.length;
  // Standard token estimate (~1.3 tokens per word)
  const tokenCount = Math.ceil(wordCount * 1.3);

  return { words: wordCount, tokens: tokenCount };
}

// Single-pass parsing transformation
function processRepurposing(rawText) {
  if (!rawText.trim()) return;

  const t0 = performance.now();

  // Clean sentences using pre-compiled regex
  const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];

  // Build variations
  const twitterThread = sentences.map((s, i) => `${i + 1}/ ${s.trim()}`).join('\n\n');

  const linkedinPost = `🚀 UPDATE B2B :\n\n${sentences.slice(0, 3).join(' ')}\n\n💡 En résumé :\n• ${sentences[0]?.trim() || ''}\n• ${sentences[1]?.trim() || ''}\n\n#AI #Productivity #MarketingB2B`;

  const newsletter = `✉️ BULLETIN HEBDOMADAIRE\n-----------------------\n\nChers abonnés,\n\n${rawText}\n\nÀ la semaine prochaine !`;

  transformCache.set('twitter', twitterThread);
  transformCache.set('linkedin', linkedinPost);
  transformCache.set('newsletter', newsletter);

  const t1 = performance.now();

  document.getElementById('execution-time').textContent = `Transform pass: ${(t1 - t0).toFixed(2)}ms`;
  updateOutputView();
}

function updateOutputView() {
  const outputEl = document.getElementById('output-container');
  const content = transformCache.get(currentTab) || "Cliquez sur 'Générer Déclinaisons' pour rafraîchir.";
  outputEl.textContent = content;
}

// DOM Setup
document.addEventListener('DOMContentLoaded', () => {
  const sourceTextEl = document.getElementById('source-text');
  const wordCountEl = document.getElementById('word-count');

  function updateMetricsUI() {
    const { words, tokens } = computeMetrics(sourceTextEl.value);
    wordCountEl.textContent = `${words} mots | ~${tokens} tokens`;
  }

  updateMetricsUI();
  processRepurposing(sourceTextEl.value);

  // Debounced input handler
  sourceTextEl.addEventListener('input', debounce(() => {
    updateMetricsUI();
    processRepurposing(sourceTextEl.value);
  }, 200));

  // Tab Navigation
  const tabs = [
    { id: 'tab-twitter', key: 'twitter' },
    { id: 'tab-linkedin', key: 'linkedin' },
    { id: 'tab-newsletter', key: 'newsletter' }
  ];

  tabs.forEach(tab => {
    const btn = document.getElementById(tab.id);
    if (btn) {
      btn.addEventListener('click', () => {
        currentTab = tab.key;
        tabs.forEach(t => {
          const b = document.getElementById(t.id);
          if (t.key === currentTab) {
            b.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white';
          } else {
            b.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600';
          }
        });
        updateOutputView();
      });
    }
  });

  // Action Buttons
  document.getElementById('btn-repurpose')?.addEventListener('click', () => {
    processRepurposing(sourceTextEl.value);
  });

  document.getElementById('btn-copy-output')?.addEventListener('click', () => {
    const text = document.getElementById('output-container').textContent;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('btn-copy-output');
    btn.textContent = 'Copié !';
    setTimeout(() => { btn.textContent = 'Copier ce Format'; }, 1500);
  });
});
