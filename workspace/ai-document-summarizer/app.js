// Bolt ⚡ Performance Engine for AI Document Summarizer

// Term frequency memoization cache
const tfCache = new Map();

// Helper to yield execution to the main thread (non-blocking async)
function yieldToMain() {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });
}

// Stop words filter for fast NLP frequency analysis
const STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'en', 'à', 'pour', 'que', 'qui', 'dans', 'sur',
  'par', 'pas', 'plus', 'avec', 'est', 'sont', 'ce', 'cette', 'nos', 'vos', 'au', 'aux', 'ne', 'se', 'ou',
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'is', 'are', 'this', 'that'
]);

// Non-blocking term frequency algorithm split into async chunks
async function extractKeywordsAsync(text, updateStatus) {
  if (tfCache.has(text)) {
    return tfCache.get(text);
  }

  updateStatus('Découpage...');
  await yieldToMain();

  const words = text.toLowerCase().match(/[a-zàâäéèêëîïôöùûüç0-9]+/gi) || [];
  const freqMap = {};

  updateStatus('Comptage TF-IDF...');
  // Process in chunks of 2000 words
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > 3 && !STOP_WORDS.has(word)) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }

    if (i % 2000 === 0) {
      await yieldToMain();
    }
  }

  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);

  tfCache.set(text, sorted);
  return sorted;
}

// Sentiment & Risk evaluation
function analyzeSentimentAndRisk(text) {
  const lower = text.toLowerCase();
  const posHits = (lower.match(/(croissance|opportunité|succès|bénéfice|amélioration|innovant|performant)/g) || []).length;
  const negHits = (lower.match(/(risque|erreur|perte|défaillance|menace|baisse|retard)/g) || []).length;

  let sentiment = 'Neutre';
  if (posHits > negHits) sentiment = 'Positif ✨';
  if (negHits > posHits) sentiment = 'Préoccupant ⚠️';

  let risk = 'Faible';
  if (negHits > 3) risk = 'Modéré';
  if (negHits > 7) risk = 'Élevé 🔴';

  return { sentiment, risk };
}

document.addEventListener('DOMContentLoaded', () => {
  const docContent = document.getElementById('doc-content');
  const wordCountEl = document.getElementById('word-count');
  const parseTimeEl = document.getElementById('parse-time');
  const statusBadge = document.getElementById('status-badge');
  const analyzeBtn = document.getElementById('analyze-btn');

  const sentimentVal = document.getElementById('sentiment-val');
  const riskVal = document.getElementById('risk-val');
  const keywordsBox = document.getElementById('keywords-box');
  const summaryBox = document.getElementById('summary-box');
  const actionsBox = document.getElementById('actions-box');

  // Pre-fill sample executive report
  docContent.value = `RAPPORT STRATÉGIQUE D'ADOPTION DE L'INTELLIGENCE ARTIFICIELLE 2026

1. Contexte & Enjeux
L'intégration des technologies d'intelligence artificielle générative dans notre infrastructure SI constitue une opportunité majeure d'amélioration de la productivité globale (+35%). Les équipes opérationnelles constatent une réduction significative du temps passé sur la création de rapports et l'analyse documentaire.

2. Opportunités & Croissance
- Optimisation des processus métier via l'automatisation intelligente des flux.
- Réduction du délai de réponse client de 4h à 10 minutes.
- Innovation produit permettant de capturer de nouveaux marchés en Europe.

3. Gestion des Risques & Conformité
Certains risques de confidentialité des données et de gouvernance doivent être encadrés. Un audit de sécurité strict et la mise en place de politiques CSP et RGPD sont recommandés pour éviter toute perte de données sensibles.

4. Plan d'Action Recommandé
- Valider le budget alloué aux projets IA pour Q4.
- Former les collaborateurs à l'ingénierie de prompt et aux bonnes pratiques de sécurité.
- Déployer la première version du portail de synthèse automatisé.`;

  wordCountEl.textContent = docContent.value.trim().split(/\s+/).length;

  docContent.addEventListener('input', () => {
    const words = docContent.value.trim() ? docContent.value.trim().split(/\s+/).length : 0;
    wordCountEl.textContent = words;
  });

  analyzeBtn.addEventListener('click', async () => {
    const text = docContent.value.trim();
    if (!text) return;

    const t0 = performance.now();
    statusBadge.textContent = 'En cours...';
    statusBadge.className = 'stat-val status-running';

    // 1. Keyword extraction (async chunked)
    const keywords = await extractKeywordsAsync(text, (msg) => { statusBadge.textContent = msg; });

    // 2. Sentiment & Risk
    const { sentiment, risk } = analyzeSentimentAndRisk(text);

    // 3. Render Keywords
    keywordsBox.innerHTML = '';
    keywords.forEach(kw => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = `#${kw}`;
      keywordsBox.appendChild(tag);
    });

    sentimentVal.textContent = sentiment;
    riskVal.textContent = risk;

    // 4. Generate Summary & Actions
    const sentences = text.split('\n').filter(s => s.trim().length > 20);
    summaryBox.textContent = sentences.slice(0, 3).join(' ') || "Synthèse indisponible.";

    actionsBox.innerHTML = '';
    const actions = sentences.filter(s => s.includes('-') || s.toLowerCase().includes('recommand') || s.toLowerCase().includes('plan'));
    const finalActions = actions.length > 0 ? actions : ["- Définir une feuille de route claire.", "- Effectuer un suivi hebdomadaire des jalons."];

    finalActions.forEach(act => {
      const li = document.createElement('li');
      li.textContent = act.replace(/^-/, '').trim();
      actionsBox.appendChild(li);
    });

    const t1 = performance.now();
    parseTimeEl.textContent = `${(t1 - t0).toFixed(1)} ms`;
    statusBadge.textContent = 'Terminé ⚡';
    statusBadge.className = 'stat-val status-done';
  });
});
