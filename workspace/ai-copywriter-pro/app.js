// Bolt ⚡ Performance Engine for AI Copywriter Pro

// Memoization cache to avoid redundant content generation for duplicate inputs
const compilationCache = new Map();

// Debounce helper to optimize live preview input processing and reduce UI overhead
function debounce(func, wait = 150) {
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

// Optimized token counter estimation algorithm O(N)
function estimateTokensAndCost(text) {
  if (!text) return { tokens: 0, cost: "0.0000 $" };
  // Rough token estimate: ~4 chars per token for English/French
  const tokens = Math.ceil(text.length / 4);
  const cost = (tokens * 0.000002).toFixed(6) + ' $';
  return { tokens, cost };
}

// High performance template generation engine
function generateContent(type, tone, prompt) {
  const cacheKey = `${type}:${tone}:${prompt}`;
  if (compilationCache.has(cacheKey)) {
    return { content: compilationCache.get(cacheKey), cached: true };
  }

  let template = '';
  switch (type) {
    case 'linkedin':
      template = `🚀 EXCLUSIF: ${prompt.toUpperCase()}\n\n` +
        `Découvrez la méthode éprouvée pour maximiser votre impact.\n\n` +
        `• Bénéfe 1: Gain de productivité x3\n` +
        `• Bénéfe 2: Automatisation intelligente\n` +
        `• Bénéfe 3: Résultats mesurables dès aujourd'hui\n\n` +
        `👉 Et vous, quelle est votre stratégie ? Répondez en commentaire ! #Innovation #IA #Productivité`;
      break;

    case 'ad':
      template = `🔥 [OFFRE LIMITÉE] ${prompt}\n` +
        `Multipliez votre ROI avec notre solution IA de nouvelle génération.\n` +
        `Obtenez votre démonstration gratuite dès maintenant ➡️ `;
      break;

    case 'email':
      template = `Objet: Question concernant ${prompt}\n\n` +
        `Bonjour,\n\n` +
        `J'ai remarqué votre travail sur ${prompt} et souhaitais vous partager une approche innovante.\n\n` +
        `Seriez-vous disponible 5 minutes cette semaine pour en discuter ?\n\n` +
        `Bien cordialement,\nL'équipe AI Copywriter`;
      break;

    default:
      template = `✨ Proposition de valeur: ${prompt}\nSolution clé en main pour transformer votre workflow grâce à l'IA.`;
  }

  if (tone === 'urgency') {
    template = `⚠️ ALERTE: Plus que quelques places disponibles !\n\n` + template;
  } else if (tone === 'storytelling') {
    template = `Il y a 6 mois, tout semblait impossible concernant ${prompt}...\n\n` + template;
  }

  compilationCache.set(cacheKey, template);
  return { content: template, cached: false };
}

// DOM Elements & Initialization
document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const contentTypeSelect = document.getElementById('content-type');
  const toneSelect = document.getElementById('tone');
  const tokenCountEl = document.getElementById('token-count');
  const costEstimateEl = document.getElementById('cost-estimate');
  const renderTimeEl = document.getElementById('render-time');
  const outputBox = document.getElementById('output-box');
  const generateBtn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const historyList = document.getElementById('history-list');

  let history = JSON.parse(localStorage.getItem('bolt_copywriter_history') || '[]');

  function renderHistory() {
    historyList.innerHTML = '';
    history.slice(0, 5).forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.textContent = `${item.type.toUpperCase()} - ${item.prompt.substring(0, 30)}...`;
      li.onclick = () => {
        promptInput.value = item.prompt;
        contentTypeSelect.value = item.type;
        toneSelect.value = item.tone;
        triggerGeneration();
      };
      historyList.appendChild(li);
    });
  }

  function triggerGeneration() {
    const t0 = performance.now();
    const prompt = promptInput.value.trim();
    const type = contentTypeSelect.value;
    const tone = toneSelect.value;

    const { tokens, cost } = estimateTokensAndCost(prompt);
    tokenCountEl.textContent = tokens;
    costEstimateEl.textContent = cost;

    if (!prompt) {
      outputBox.innerHTML = '<p class="placeholder-text">Saisissez votre sujet pour générer le contenu en temps réel...</p>';
      renderTimeEl.textContent = '0 ms';
      return;
    }

    const { content, cached } = generateContent(type, tone, prompt);
    outputBox.textContent = content;

    const t1 = performance.now();
    const renderDuration = (t1 - t0).toFixed(1);
    renderTimeEl.textContent = `${renderDuration} ms ${cached ? '(Cache ⚡)' : ''}`;

    // Add to history if unique
    if (!history.some(h => h.prompt === prompt && h.type === type)) {
      history.unshift({ prompt, type, tone });
      if (history.length > 10) history.pop();
      localStorage.setItem('bolt_copywriter_history', JSON.stringify(history));
      renderHistory();
    }
  }

  const debouncedGenerate = debounce(triggerGeneration, 100);

  promptInput.addEventListener('input', debouncedGenerate);
  contentTypeSelect.addEventListener('change', triggerGeneration);
  toneSelect.addEventListener('change', triggerGeneration);
  generateBtn.addEventListener('click', triggerGeneration);

  copyBtn.addEventListener('click', () => {
    if (outputBox.textContent) {
      navigator.clipboard.writeText(outputBox.textContent);
      copyBtn.textContent = '✅ Copié !';
      setTimeout(() => { copyBtn.textContent = '📋 Copier'; }, 1500);
    }
  });

  renderHistory();
});
