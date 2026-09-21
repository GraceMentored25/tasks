// ⚡ Bolt Performance Optimization: Lead cache
const leadCache = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const companyInput = document.getElementById('company-input');
  const budgetSelect = document.getElementById('budget-select');
  const needDesc = document.getElementById('need-desc');
  const qualifyBtn = document.getElementById('qualify-btn');
  const leadCacheBadge = document.getElementById('lead-cache-badge');

  const leadPerf = document.getElementById('lead-perf');
  const scoreDisplay = document.getElementById('score-display');
  const leadTier = document.getElementById('lead-tier');
  const actionRecommendation = document.getElementById('action-recommendation');

  function streamText(targetEl, text, done) {
    targetEl.textContent = '';
    let i = 0;
    function tick() {
      if (i < text.length) {
        targetEl.textContent += text[i];
        i++;
        requestAnimationFrame(tick);
      } else if (done) {
        done();
      }
    }
    requestAnimationFrame(tick);
  }

  qualifyBtn.addEventListener('click', () => {
    const company = companyInput.value.trim() || 'Entreprise Anonyme';
    const budget = budgetSelect.value;
    const need = needDesc.value.trim();

    const cacheKey = `${company}|${budget}|${need}`;
    const startTime = performance.now();

    // ⚡ Fast path check
    if (leadCache.has(cacheKey)) {
      const cached = leadCache.get(cacheKey);
      scoreDisplay.textContent = `${cached.score} / 100`;
      leadTier.textContent = cached.tierLabel;
      leadTier.className = `text-xs px-3 py-1 rounded-full font-medium ${cached.tierClass}`;
      actionRecommendation.textContent = cached.action;

      leadCacheBadge.classList.remove('hidden');
      const timeTaken = (performance.now() - startTime).toFixed(2);
      leadPerf.textContent = `⚡ Servit du cache en ${timeTaken}ms`;
      return;
    }

    leadCacheBadge.classList.add('hidden');
    leadPerf.textContent = '⚡ Évaluation en cours...';

    // Scoring logic
    let score = 30;
    if (budget === 'medium') score += 30;
    if (budget === 'high') score += 50;
    if (need.length > 20) score += 20;

    score = Math.min(score, 100);

    let tierLabel = 'Lead Froid';
    let tierClass = 'bg-slate-800 text-slate-400';
    let action = 'Placer le lead dans une séquence de nurturing email automatique.';

    if (score >= 70) {
      tierLabel = '🔥 Lead Chaud (High Priority)';
      tierClass = 'bg-amber-900/60 text-amber-300 border border-amber-700';
      action = 'Proposer un rendez-vous téléphonique sous 24 heures avec un Account Executive.';
    } else if (score >= 50) {
      tierLabel = '⚡ Lead Tiède';
      tierClass = 'bg-blue-900/60 text-blue-300 border border-blue-700';
      action = 'Envoyer une étude de cas personnalisée et relancer dans 3 jours.';
    }

    const payload = { score, tierLabel, tierClass, action };
    leadCache.set(cacheKey, payload);

    scoreDisplay.textContent = `${score} / 100`;
    leadTier.textContent = tierLabel;
    leadTier.className = `text-xs px-3 py-1 rounded-full font-medium ${tierClass}`;

    streamText(actionRecommendation, action, () => {
      const timeTaken = (performance.now() - startTime).toFixed(2);
      leadPerf.textContent = `⚡ Évalué en ${timeTaken}ms`;
    });
  });
});
