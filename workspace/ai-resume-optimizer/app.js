// Bolt ⚡ Optimization: Resume ATS Analyzer
// 1. O(N) Set matching algorithm instead of O(N^2) array search.
// 2. Fragment rendering to avoid multiple layout thrashing iterations.

function extractKeywords(text) {
  const words = text.toLowerCase().match(/\b[a-zà-ÿ0-9+#.]{3,}\b/gi) || [];
  return new Set(words);
}

function analyzeResume(cvText, jobText) {
  const t0 = performance.now();

  const cvKeywords = extractKeywords(cvText);
  const jobKeywords = extractKeywords(jobText);

  if (jobKeywords.size === 0) {
    return { score: 0, found: [], missing: [], duration: 0 };
  }

  const found = [];
  const missing = [];

  // O(N) lookup using Set
  jobKeywords.forEach(word => {
    if (cvKeywords.has(word)) {
      found.push(word);
    } else {
      missing.push(word);
    }
  });

  const score = Math.min(100, Math.round((found.length / jobKeywords.size) * 100));
  const duration = performance.now() - t0;

  return { score, found, missing, duration };
}

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const cvInput = document.getElementById('cv-text');
  const jobInput = document.getElementById('job-text');
  const resultsCard = document.getElementById('results-card');
  const scoreEl = document.getElementById('score');
  const foundTagsEl = document.getElementById('found-tags');
  const missingTagsEl = document.getElementById('missing-tags');
  const perfMetricsEl = document.getElementById('perf-metrics');

  analyzeBtn.addEventListener('click', () => {
    const cvText = cvInput.value;
    const jobText = jobInput.value;

    if (!cvText || !jobText) {
      alert('Veuillez remplir les deux champs CV et Offre d\'emploi.');
      return;
    }

    const res = analyzeResume(cvText, jobText);

    scoreEl.textContent = `${res.score}%`;

    // Fast Fragment Rendering
    const foundFrag = document.createDocumentFragment();
    res.found.slice(0, 15).forEach(kw => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = kw;
      foundFrag.appendChild(span);
    });
    foundTagsEl.replaceChildren(foundFrag);

    const missingFrag = document.createDocumentFragment();
    res.missing.slice(0, 15).forEach(kw => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.style.borderColor = '#f43f5e';
      span.textContent = kw;
      missingFrag.appendChild(span);
    });
    missingTagsEl.replaceChildren(missingFrag);

    perfMetricsEl.textContent = `Temps d'analyse O(N) : ${res.duration.toFixed(2)}ms`;
    resultsCard.style.display = 'block';
  });
});
