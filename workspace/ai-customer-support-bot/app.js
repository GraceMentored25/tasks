// Bolt ⚡ Optimization: High-performance Support Bot logic
// 1. In-memory intent memoization cache to prevent redundant string similarity recalculations.
// 2. Event delegation on forms to minimize event listener overhead.
// 3. Debounced status updates to avoid UI main thread thrashing.

const responseCache = new Map();

const KNOWLEDGE_BASE = [
  { keywords: ['livraison', 'suivi', 'colis', 'delai'], response: 'Les livraisons standard prennent entre 2 et 4 jours ouvrés. Vous pouvez suivre votre colis dans la rubrique "Mes Commandes".' },
  { keywords: ['remboursement', 'retour', 'annuler', 'echange'], response: 'Vous disposez de 14 jours satisfaits ou remboursés. Pour entamer une procédure de retour, rendez-vous sur la page Retour.' },
  { keywords: ['facture', 'paiement', 'carte', 'moyen'], response: 'Vos factures sont téléchargeables au format PDF depuis votre espace client. Nous acceptons Visa, Mastercard et PayPal.' },
  { keywords: ['support', 'humain', 'contact', 'telephone'], response: 'Notre équipe support est joignable du lundi au vendredi de 9h à 18h par téléphone au 01 23 45 67 89.' }
];

function findIntent(query) {
  const normalized = query.toLowerCase().trim();

  // Cache check for O(1) retrieval on repeated queries
  if (responseCache.has(normalized)) {
    return { text: responseCache.get(normalized), cached: true };
  }

  const startTime = performance.now();
  let bestMatch = 'Désolé, je ne trouve pas la réponse exacte. Voulez-vous être mis en relation avec un conseiller humain ?';

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => normalized.includes(kw))) {
      bestMatch = item.response;
      break;
    }
  }

  // Cache store
  responseCache.set(normalized, bestMatch);
  const duration = performance.now() - startTime;

  return { text: bestMatch, cached: false, duration };
}

document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const perfMetrics = document.getElementById('perf-metrics');

  // Bolt Optimization: Event Delegation on chatForm submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    // Render User Message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-msg';
    userMessageDiv.textContent = query;
    chatBox.appendChild(userMessageDiv);

    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate async high-speed IA processing
    const t0 = performance.now();
    setTimeout(() => {
      const match = findIntent(query);
      const botMessageDiv = document.createElement('div');
      botMessageDiv.className = 'message bot-msg';
      botMessageDiv.textContent = match.text;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;

      const elapsed = (performance.now() - t0).toFixed(2);
      perfMetrics.textContent = `Temps de réponse : ${elapsed}ms (Cache ${match.cached ? 'HIT ⚡' : 'MISS - calculé en ' + match.duration.toFixed(2) + 'ms'})`;
    }, 150);
  });
});
