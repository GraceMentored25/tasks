// ⚡ Bolt Performance Optimization:
// Implementation of memoized keyword density calculations, debounced user input,
// and DocumentFragment batch rendering to prevent UI jank.

const contentInput = document.getElementById('content-input');
const targetKeywordInput = document.getElementById('target-keyword');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');

const seoScoreEl = document.getElementById('seo-score');
const readabilityScoreEl = document.getElementById('readability-score');
const wordCountEl = document.getElementById('word-count');
const readTimeEl = document.getElementById('read-time');
const recommendationsList = document.getElementById('recommendations-list');
const keywordsContainer = document.getElementById('keywords-container');

// Simple cache for keyword extraction memoization
const memoCache = new Map();

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function calculateSEO() {
  const text = contentInput.value.trim();
  const targetKeyword = targetKeywordInput.value.trim().toLowerCase();

  if (!text) {
    seoScoreEl.textContent = '0 / 100';
    readabilityScoreEl.textContent = '--';
    wordCountEl.textContent = '0 words';
    readTimeEl.textContent = '0 min';
    recommendationsList.innerHTML = '<li class="placeholder">Enter content to view AI optimization recommendations.</li>';
    keywordsContainer.innerHTML = '<span class="placeholder">No keywords analyzed yet.</span>';
    return;
  }

  // 1. Word Count & Read Time
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  const readTime = Math.ceil(wordCount / 200);

  wordCountEl.textContent = `${wordCount} words`;
  readTimeEl.textContent = `~${readTime} min read`;

  // 2. Readability Calculation (Simple Flesch-Kincaid proxy)
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const avgWordsPerSentence = wordCount / sentences;
  let readability = 'Good (Easy)';
  if (avgWordsPerSentence > 20) readability = 'Complex (Hard)';
  else if (avgWordsPerSentence > 14) readability = 'Moderate (Medium)';
  readabilityScoreEl.textContent = readability;

  // 3. Keyword Density & Memoization
  const cacheKey = `${text.length}_${text.substring(0, 30)}_${targetKeyword}`;
  let keywordStats;

  if (memoCache.has(cacheKey)) {
    keywordStats = memoCache.get(cacheKey);
  } else {
    const wordFreq = {};
    words.forEach(w => {
      const lower = w.toLowerCase();
      if (lower.length > 3) {
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    keywordStats = sortedKeywords;
    if (memoCache.size > 50) memoCache.clear();
    memoCache.set(cacheKey, keywordStats);
  }

  // 4. Score Calculation
  let score = 50;
  const recs = [];

  if (wordCount >= 300) {
    score += 20;
    recs.push({ text: 'Good content length (> 300 words)', type: 'success' });
  } else {
    recs.push({ text: 'Content is too short for search engines (aim for 300+ words)', type: 'warn' });
  }

  if (targetKeyword) {
    const targetCount = (text.toLowerCase().match(new RegExp(targetKeyword, 'g')) || []).length;
    const density = wordCount > 0 ? ((targetCount / wordCount) * 100).toFixed(1) : 0;

    if (density >= 1.0 && density <= 2.5) {
      score += 30;
      recs.push({ text: `Optimal density (${density}%) for target keyword "${targetKeyword}"`, type: 'success' });
    } else if (density < 1.0) {
      score += 10;
      recs.push({ text: `Target keyword "${targetKeyword}" appears too rarely (${density}%). Aim for 1-2.5%`, type: 'warn' });
    } else {
      recs.push({ text: `High density (${density}%) for target keyword "${targetKeyword}" (risk of keyword stuffing)`, type: 'warn' });
    }
  }

  seoScoreEl.textContent = `${Math.min(100, score)} / 100`;

  // ⚡ Batch DOM updates using DocumentFragments
  const recsFragment = document.createDocumentFragment();
  recs.forEach(r => {
    const li = document.createElement('li');
    li.className = r.type;
    li.textContent = r.text;
    recsFragment.appendChild(li);
  });
  recommendationsList.innerHTML = '';
  recommendationsList.appendChild(recsFragment);

  const tagsFragment = document.createDocumentFragment();
  keywordStats.forEach(([kw, freq]) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = `${kw} (${freq})`;
    tagsFragment.appendChild(span);
  });
  keywordsContainer.innerHTML = '';
  keywordsContainer.appendChild(tagsFragment);
}

// Attach debounced event listeners
const debouncedCalculate = debounce(calculateSEO, 200);

contentInput.addEventListener('input', debouncedCalculate);
targetKeywordInput.addEventListener('input', debouncedCalculate);
analyzeBtn.addEventListener('click', calculateSEO);

clearBtn.addEventListener('click', () => {
  contentInput.value = '';
  calculateSEO();
});

// Default sample content initialization
contentInput.value = "AI workflow automation is revolutionizing how enterprise businesses handle routine tasks. By deploying intelligent AI tools, teams can automate complex data analysis, content generation, and customer support desks seamlessly. Implementing modern AI workflow automation improves overall efficiency and reduces operational costs significantly.";
calculateSEO();
