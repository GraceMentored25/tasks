/**
 * AI Content Repurposer Engine
 * Performance-optimized with debouncing and response memoization
 */

const SAMPLE_TEXT = `Artificial Intelligence is fundamentally shifting how software engineering teams build products. Rather than replacing developers, AI acts as a high-speed copilot that automates boilerplate code, assists with unit testing, and identifies subtle security vulnerabilities before production deployment. Companies embracing AI-assisted development report up to 40% faster release cycles while maintaining rigorous code quality standards.`;

// Cache matrix to avoid redundant AI generation calls (Bolt Optimization)
const transformCache = new Map();

let activePlatform = 'linkedin';

// DOM Elements
const sourceTextEl = document.getElementById('source-text');
const sourceCharCountEl = document.getElementById('source-char-count');
const btnSample1 = document.getElementById('btn-sample-1');
const btnClear = document.getElementById('btn-clear');
const btnTransform = document.getElementById('btn-transform');
const btnCopy = document.getElementById('btn-copy');
const outputBoxEl = document.getElementById('output-box');
const activePlatformTitleEl = document.getElementById('active-platform-title');
const renderPerfEl = document.getElementById('render-perf');
const tabBtns = document.querySelectorAll('.tab-btn');

/**
 * Debounce helper to prevent heavy execution during typing
 */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Update source text metrics
 */
const updateMetrics = debounce(() => {
  const count = sourceTextEl.value.length;
  sourceCharCountEl.textContent = `${count} chars`;
}, 100);

/**
 * Mock AI Transformation Engine for multi-platform repurposing
 */
function generateRepurposedContent(text, platform) {
  const cacheKey = `${platform}:${text}`;
  if (transformCache.has(cacheKey)) {
    return transformCache.get(cacheKey);
  }

  const snippet = text.slice(0, 150) || "your content";
  let result = "";

  if (platform === 'linkedin') {
    result = `🚀 AI is revolutionizing software engineering workflows.\n\nKey takeaways from our latest analysis:\n\n1. AI acts as a high-speed copilot, not a replacement.\n2. Automates boilerplate code and security checks.\n3. Enables up to 40% faster release cycles.\n\nSummary:\n"${snippet}..."\n\nWhat are your thoughts on AI-driven development? Drop a comment below! 👇\n\n#AI #SoftwareEngineering #TechTrends #Productivity`;
  } else if (platform === 'twitter') {
    result = `🧵 1/3 AI isn't replacing developers — it's supercharging them.\n\n2/3 Companies adopting AI copilots see ~40% faster release cycles by automating testing & security reviews.\n\n3/3 Full insight: "${snippet}..."`;
  } else if (platform === 'newsletter') {
    result = `Subject: Weekly Tech Brief: How AI Speeds Up Engineering\n\nHi Subscriber,\n\nIn this edition, we look at how engineering teams leverage AI copilots for faster iteration:\n\n• Key Context: ${snippet}...\n• Impact: 40% acceleration in cycle times with improved security automated checks.\n\nUntil next week!`;
  }

  // Store in cache for memoized sub-ms retrieval
  transformCache.set(cacheKey, result);
  return result;
}

/**
 * Render active output platform content
 */
function renderOutput() {
  const t0 = performance.now();
  const text = sourceTextEl.value.trim();

  if (!text) {
    outputBoxEl.textContent = "Please enter or paste source text first.";
    renderPerfEl.classList.add('hidden');
    return;
  }

  const generated = generateRepurposedContent(text, activePlatform);
  outputBoxEl.textContent = generated;

  const t1 = performance.now();
  renderPerfEl.textContent = `Rendered in ${(t1 - t0).toFixed(2)}ms`;
  renderPerfEl.classList.remove('hidden');
}

// Event handlers
sourceTextEl.addEventListener('input', updateMetrics);

btnSample1.addEventListener('click', () => {
  sourceTextEl.value = SAMPLE_TEXT;
  updateMetrics();
  renderOutput();
});

btnClear.addEventListener('click', () => {
  sourceTextEl.value = '';
  transformCache.clear();
  updateMetrics();
  renderOutput();
});

btnTransform.addEventListener('click', renderOutput);

tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    tabBtns.forEach(b => {
      b.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200';
    });

    e.currentTarget.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800';
    activePlatform = e.currentTarget.getAttribute('data-platform');
    activePlatformTitleEl.textContent = `${activePlatform.toUpperCase()} Format`;

    renderOutput();
  });
});

btnCopy.addEventListener('click', () => {
  const text = outputBoxEl.textContent;
  if (!text || text.startsWith("Please enter")) return;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy.");
  });
});

// Initial metrics update
updateMetrics();
