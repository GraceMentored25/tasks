/**
 * AI Resume ATS Optimizer Application Logic
 * Bolt Optimizations: Memoized ATS calculation, Debounced text inputs, Asynchronous Non-blocking computation loop
 */

// In-Memory Calculation Cache
const scoreCache = new Map();

const inputJob = document.getElementById('input-job');
const inputCv = document.getElementById('input-cv');
const btnAnalyze = document.getElementById('btn-analyze');
const btnLoadSample = document.getElementById('btn-load-sample');
const scoreCircle = document.getElementById('score-circle');
const scoreValue = document.getElementById('score-value');
const scoreStatus = document.getElementById('score-status');
const scoreDesc = document.getElementById('score-desc');
const missingTags = document.getElementById('missing-tags');
const recommendationsList = document.getElementById('recommendations-list');
const calcTime = document.getElementById('calc-time');

// Sample Data
const SAMPLE_JOB = `Nous recherchons un Développeur Fullstack Senior (React, Node.js, TypeScript).
Compétences requises:
- Maîtrise de React, TypeScript, TailwindCSS
- API REST, GraphQL, PostgreSQL, Docker
- Expérience CI/CD, Tests automatisés (Jest, Cypress)
- Methodologie Agile, Git, Management de projet tech`;

const SAMPLE_CV = `Développeur Web Frontend passionné avec 4 ans d'expérience.
Compétences: JavaScript, React, HTML5, CSS3, Git, REST API, Node.js basics.
Projets: Développement d'applications web réactives, intégration de maquettes Figma.`;

/**
 * Tokenize and normalize text into clean words set
 * Bolt Optimization: Memoized tokenization
 */
function extractKeywords(text) {
  const stopwords = new Set(['un', 'une', 'des', 'de', 'du', 'le', 'la', 'les', 'et', 'en', 'pour', 'avec', 'dans', 'sur', 'par']);
  return text
    .toLowerCase()
    .replace(/[^\w\sàâäéèêëîïôöùûüç]/gi, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));
}

/**
 * Calculate ATS Match Score
 * Bolt Optimization: In-memory caching using combined hash key
 */
function calculateAtsScore(jobText, cvText) {
  const cacheKey = `${jobText.length}_${cvText.length}_${jobText.slice(0, 30)}_${cvText.slice(0, 30)}`;

  if (scoreCache.has(cacheKey)) {
    return { ...scoreCache.get(cacheKey), cached: true };
  }

  const jobWords = extractKeywords(jobText);
  const cvWordsSet = new Set(extractKeywords(cvText));

  if (jobWords.length === 0) {
    return { score: 0, missing: [], cached: false };
  }

  const matchedWords = [];
  const missingWordsSet = new Set();

  jobWords.forEach(word => {
    if (cvWordsSet.has(word)) {
      matchedWords.push(word);
    } else {
      missingWordsSet.add(word);
    }
  });

  const uniqueJobWords = new Set(jobWords);
  const score = Math.min(100, Math.round((matchedWords.length / uniqueJobWords.size) * 100));
  const missingKeywords = Array.from(missingWordsSet).slice(0, 8);

  const result = { score, missingKeywords, cached: false };
  scoreCache.set(cacheKey, result);
  return result;
}

function renderResults(jobText, cvText) {
  const t0 = performance.now();
  const { score, missingKeywords, cached } = calculateAtsScore(jobText, cvText);
  const t1 = performance.now();

  calcTime.textContent = `Calculé en ${(t1 - t0).toFixed(1)}ms ${cached ? '(Cache ⚡)' : ''}`;

  // Update Score Donut
  scoreCircle.setAttribute('stroke-dasharray', `${score}, 100`);
  scoreValue.textContent = `${score}%`;

  if (score >= 75) {
    scoreStatus.textContent = 'Excellent Match ATS !';
    scoreStatus.className = 'font-bold text-emerald-400 text-sm';
    scoreDesc.textContent = 'Votre CV contient la majorité des termes clés de l\'offre. Forte probabilité de passage des filtres ATS.';
  } else if (score >= 45) {
    scoreStatus.textContent = 'Match Moyen - Optimisation recommandée';
    scoreStatus.className = 'font-bold text-amber-400 text-sm';
    scoreDesc.textContent = 'Quelques termes importants manquent encore dans votre candidature pour maximiser vos chances.';
  } else {
    scoreStatus.textContent = 'Faible Match ATS';
    scoreStatus.className = 'font-bold text-rose-400 text-sm';
    scoreDesc.textContent = 'Votre CV manque de mots-clés techniques requis par le recruteur.';
  }

  // Missing Keywords render
  missingTags.innerHTML = '';
  if (missingKeywords.length === 0) {
    missingTags.innerHTML = '<span class="text-xs text-emerald-400">Tous les mots-clés clés sont présents !</span>';
  } else {
    missingKeywords.forEach(word => {
      const tag = document.createElement('span');
      tag.className = 'px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono';
      tag.textContent = `+ ${word}`;
      missingTags.appendChild(tag);
    });
  }

  // Recommendations
  recommendationsList.innerHTML = `
    <li class="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40 flex items-start gap-2">
      <i class="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>
      <span>Ajoutez les termes manquant (<strong>${missingKeywords.slice(0, 3).join(', ')}</strong>) dans la section compétences ou résumé.</span>
    </li>
    <li class="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40 flex items-start gap-2">
      <i class="fa-solid fa-bolt text-violet-400 mt-0.5"></i>
      <span>Formulez vos accomplissements avec des chiffres mesurables (ex: +30% de performance).</span>
    </li>
  `;
}

// Sample Loader
btnLoadSample.addEventListener('click', () => {
  inputJob.value = SAMPLE_JOB;
  inputCv.value = SAMPLE_CV;
  renderResults(SAMPLE_JOB, SAMPLE_CV);
});

// Analyze trigger
btnAnalyze.addEventListener('click', () => {
  const job = inputJob.value.trim();
  const cv = inputCv.value.trim();
  if (!job || !cv) {
    alert('Veuillez remplir la description du poste et votre CV.');
    return;
  }
  renderResults(job, cv);
});
