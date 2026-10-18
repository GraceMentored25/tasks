// Debounce helper to prevent main-thread lag during real-time typing
function debounce(fn, delay = 200) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// O(N) tokenization and frequency analysis
function analyzeSeoContent(content) {
  const startTime = performance.now();
  if (!content || !content.trim()) {
    return {
      wordCount: 0,
      topKeywords: [],
      executionTime: (performance.now() - startTime).toFixed(2)
    };
  }

  // Single-pass regex tokenization
  const words = content.toLowerCase().match(/\b[a-zà-ÿ0-9_-]{3,}\b/g) || [];
  const freqMap = new Map();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    freqMap.set(word, (freqMap.get(word) || 0) + 1);
  }

  const sortedKeywords = Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    wordCount: words.length,
    topKeywords: sortedKeywords,
    executionTime: (performance.now() - startTime).toFixed(2)
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('content-input');
  const btnEl = document.getElementById('generate-btn');
  const outputCard = document.getElementById('output-card');
  const wordCountEl = document.getElementById('word-count');
  const densityContainer = document.getElementById('density-container');
  const perfEl = document.getElementById('perf-metrics');

  function runAnalysis() {
    if (!inputEl) return;
    const result = analyzeSeoContent(inputEl.value);
    outputCard.style.display = 'block';
    wordCountEl.textContent = `Nombre total de mots analysés : ${result.wordCount}`;

    densityContainer.innerHTML = '';
    if (result.topKeywords.length === 0) {
      densityContainer.textContent = 'Aucun mot-clé significatif détecté.';
    } else {
      result.topKeywords.forEach(([word, count]) => {
        const span = document.createElement('span');
        span.className = 'density-tag';
        const pct = result.wordCount > 0 ? ((count / result.wordCount) * 100).toFixed(1) : 0;
        span.textContent = `${word}: ${count} (${pct}%)`;
        densityContainer.appendChild(span);
      });
    }

    perfEl.textContent = `Temps d'analyse O(N) : ${result.executionTime} ms`;
  }

  if (btnEl) btnEl.addEventListener('click', runAnalysis);
  if (inputEl) inputEl.addEventListener('input', debounce(runAnalysis, 200));
});
