/**
 * ⚡ BOLT PERFORMANCE OPTIMIZATIONS:
 * 1. O(1) Skill Intersection Scoring using JavaScript Set lookup.
 * 2. Virtualized Pagination (5 items per page) preventing heavy DOM tree re-renderings.
 * 3. Memoized Score Map preventing re-computation during pagination and search filters.
 */

// Helper to escape HTML characters safely
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}

// State
let candidates = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 4;
const scoreCache = new Map();

// Fast Skill Tokenizer & O(1) Matcher
function calculateMatchScore(candidateText, requiredSkillsStr) {
  const reqSkills = requiredSkillsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (reqSkills.length === 0) return { score: 100, matched: [], missing: [] };

  const cacheKey = `${candidateText.toLowerCase()}|${reqSkills.join(',')}`;
  if (scoreCache.has(cacheKey)) {
    return scoreCache.get(cacheKey);
  }

  // Linear scan token extraction into Set for O(1) checks
  const candidateTokens = new Set(candidateText.toLowerCase().match(/\b[a-z0-9.#+]+\b/gi) || []);

  const matched = [];
  const missing = [];

  reqSkills.forEach(skill => {
    if (candidateTokens.has(skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const score = Math.round((matched.length / reqSkills.length) * 100);

  const result = { score, matched, missing };
  scoreCache.set(cacheKey, result);

  return result;
}

// DOM References
const jobTitleInput = document.getElementById('job-title');
const requiredSkillsInput = document.getElementById('required-skills');
const candidateCvInput = document.getElementById('candidate-cv');
const screenBtn = document.getElementById('screen-candidate-btn');
const seedBtn = document.getElementById('seed-candidates-btn');
const candidatesList = document.getElementById('candidates-list');
const candidateCountSpan = document.getElementById('candidate-count');
const perfMetrics = document.getElementById('perf-metrics');
const searchInput = document.getElementById('search-input');
const scoreFilter = document.getElementById('score-filter');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

// Fast Pagination & DOM Batch Render
function renderCandidates() {
  const startTime = performance.now();
  const search = searchInput.value.toLowerCase().trim();
  const minScore = parseInt(scoreFilter.value, 10) || 0;
  const reqSkillsStr = requiredSkillsInput.value;

  // Filter & calculate scores
  const filtered = candidates.map(c => {
    const evaluation = calculateMatchScore(c.cv, reqSkillsStr);
    return { ...c, ...evaluation };
  }).filter(c => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search) || c.matched.some(m => m.includes(search));
    const matchesScore = c.score >= minScore;
    return matchesSearch && matchesScore;
  });

  // Sort by match score descending
  filtered.sort((a, b) => b.score - a.score);

  candidateCountSpan.textContent = filtered.length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  currentPageSpan.textContent = currentPage;
  totalPagesSpan.textContent = totalPages;

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageCandidates = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const fragment = document.createDocumentFragment();

  pageCandidates.forEach(candidate => {
    const card = document.createElement('div');
    card.className = 'candidate-card';

    let scoreClass = 'score-low';
    if (candidate.score >= 75) scoreClass = 'score-high';
    else if (candidate.score >= 50) scoreClass = 'score-med';

    const safeName = escapeHTML(candidate.name);
    const safeSnippet = escapeHTML(candidate.cv.substring(0, 120));

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${safeName}</strong>
        <span class="score-badge ${scoreClass}">${candidate.score}% Match</span>
      </div>
      <div style="font-size:0.85rem; color:var(--muted);">${safeSnippet}...</div>
      <div>
        <span style="font-size:0.75rem; color:var(--muted);">Matched Skills:</span>
        ${candidate.matched.map(m => `<span class="tag">${escapeHTML(m)}</span>`).join('') || '<span class="tag">None</span>'}
      </div>
      ${candidate.missing.length > 0 ? `
        <div>
          <span style="font-size:0.75rem; color:var(--muted);">Missing Requirements:</span>
          ${candidate.missing.map(m => `<span class="tag missing-tag">${escapeHTML(m)}</span>`).join('')}
        </div>
      ` : ''}
    `;

    fragment.appendChild(card);
  });

  candidatesList.innerHTML = '';
  candidatesList.appendChild(fragment);

  const endTime = performance.now();
  perfMetrics.textContent = `⚡ Scoring Time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Add Candidate
screenBtn.addEventListener('click', () => {
  const text = candidateCvInput.value.trim();
  if (!text) return;

  const nameMatch = text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/);
  const name = nameMatch ? nameMatch[0] : `Candidate #${candidates.length + 1}`;

  candidates.unshift({
    id: Date.now(),
    name,
    cv: text
  });

  currentPage = 1;
  renderCandidates();
});

// Seed Sample Candidates
seedBtn.addEventListener('click', () => {
  const samples = [
    { name: 'Sarah Jenkins', cv: 'Sarah Jenkins - Senior Full Stack Engineer proficient in React, TypeScript, Node.js, Python, PostgreSQL, and LLM integrations.' },
    { name: 'David Chen', cv: 'David Chen - Backend Developer with Python, PostgreSQL, Docker, Redis, and FastAPI experience.' },
    { name: 'Elena Rostova', cv: 'Elena Rostova - AI Researcher with Python, LLM, PyTorch, React, and TypeScript background.' },
    { name: 'Marcus Vance', cv: 'Marcus Vance - Junior Frontend Developer with React, JavaScript, CSS, HTML, and Git.' },
    { name: 'Amina Diallo', cv: 'Amina Diallo - Cloud Engineer expert in Docker, Kubernetes, PostgreSQL, TypeScript, and Node.js.' },
    { name: 'Lucas Meyer', cv: 'Lucas Meyer - Senior Engineer skilled in Python, React, TypeScript, Docker, PostgreSQL, Node.js, LLM.' }
  ];

  samples.forEach(s => {
    candidates.push({ id: Date.now() + Math.random(), ...s });
  });

  renderCandidates();
});

// Event Listeners for Filters & Pagination
searchInput.addEventListener('input', () => { currentPage = 1; renderCandidates(); });
scoreFilter.addEventListener('change', () => { currentPage = 1; renderCandidates(); });
requiredSkillsInput.addEventListener('input', () => renderCandidates());

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderCandidates();
  }
});

nextPageBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderCandidates();
  }
});

// Initial screening
screenBtn.click();
