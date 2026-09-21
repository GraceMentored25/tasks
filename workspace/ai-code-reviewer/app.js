// ⚡ Bolt Performance Optimization: Code hash lookup cache
const auditCache = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const auditBtn = document.getElementById('audit-btn');
  const cacheHitTag = document.getElementById('cache-hit-tag');
  const auditStatus = document.getElementById('audit-status');
  const auditResults = document.getElementById('audit-results');
  const charCount = document.getElementById('char-count');
  const scoreVal = document.getElementById('score-val');
  const riskCount = document.getElementById('risk-count');

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ⚡ Fast rAF stream renderer
  function streamText(targetEl, text, onComplete) {
    targetEl.textContent = '';
    let idx = 0;
    function renderStep() {
      if (idx < text.length) {
        targetEl.textContent += text[idx];
        idx += 2; // Stream 2 chars per frame for speed
        requestAnimationFrame(renderStep);
      } else {
        targetEl.textContent = text; // Ensure clean end
        if (onComplete) onComplete();
      }
    }
    requestAnimationFrame(renderStep);
  }

  // Debounce char count update
  codeInput.addEventListener('input', debounce(() => {
    charCount.textContent = `${codeInput.value.length} caractères`;
  }, 100));

  auditBtn.addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (!code) {
      auditResults.textContent = '// Erreur : Veuillez fournir un extrait de code à analyser.';
      return;
    }

    const start = performance.now();

    // ⚡ Fast path: O(1) cache check
    if (auditCache.has(code)) {
      const cached = auditCache.get(code);
      auditResults.textContent = cached.report;
      scoreVal.textContent = `${cached.score} / 100`;
      riskCount.textContent = cached.risks;
      cacheHitTag.classList.remove('hidden');
      const timeTaken = (performance.now() - start).toFixed(2);
      auditStatus.textContent = `⚡ Servit du cache en ${timeTaken}ms`;
      return;
    }

    cacheHitTag.classList.add('hidden');
    auditStatus.textContent = '⚡ Analyse en cours...';

    // Heuristic analysis simulation
    let risks = 0;
    let report = '🔍 RAPPORT D\'AUDIT AUTOMATISÉ IA :\n\n';

    if (code.includes('SELECT') || code.includes('+') && code.includes('WHERE')) {
      report += '⚠️ [SÉCURITÉ] Vulnérabilité potentielle : Injection SQL détectée lors de la concaténation de requêtes.\nRecommandation : Utilisez des requêtes préparées avec paramètres.\n\n';
      risks += 1;
    }

    if (code.includes('var ')) {
      report += '💡 [QUALITÉ] Utilisation de "var" détectée.\nRecommandation : Remplacez par "const" ou "let" pour éviter les fuites de portée.\n\n';
      risks += 1;
    }

    if (risks === 0) {
      report += '✅ Aucun risque critique immédiat détecté.\nLe code suit les bonnes pratiques de lisibilité et de structure.\n';
    }

    const calculatedScore = Math.max(50, 95 - (risks * 20));

    // Save result to cache
    auditCache.set(code, { report, score: calculatedScore, risks });

    streamText(auditResults, report, () => {
      scoreVal.textContent = `${calculatedScore} / 100`;
      riskCount.textContent = `${risks}`;
      const timeTaken = (performance.now() - start).toFixed(2);
      auditStatus.textContent = `⚡ Complété en ${timeTaken}ms`;
    });
  });
});
