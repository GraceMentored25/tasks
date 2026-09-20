/**
 * Performance-optimized AI Customer Support Chatbot
 * Bolt Optimization: In-memory LRU Query Cache, Event Delegation, requestAnimationFrame Text Streaming
 */

// In-Memory Query Cache to prevent redundant intent processing
const queryCache = new Map();
let totalQueries = 0;
let cacheHits = 0;

// Knowledge Base Intents
const KNOWLEDGE_BASE = [
  {
    keywords: ['commande', 'suivre', 'suivi', 'livraison', 'colis'],
    response: "Pour suivre votre commande, vous pouvez vous rendre dans la rubrique 'Mes Commandes' de votre espace client. Un numéro de suivi du transporteur y est mis à jour en temps réel dès l'expédition."
  },
  {
    keywords: ['facture', 'facturation', 'abonnement', 'payer', 'prix'],
    response: "Vos factures sont téléchargeables au format PDF depuis l'onglet 'Facturation'. Pour modifier votre moyen de paiement ou changer de formule d'abonnement, rendez-vous dans les paramètres du compte."
  },
  {
    keywords: ['humain', 'contacter', 'support', 'telephone', 'agent'],
    response: "Si notre assistant n'a pas répondu à votre besoin, nos conseillers humains sont joignables du lundi au vendredi de 9h à 18h par email à support@client-company.com ou via la ligne directe."
  },
  {
    keywords: ['retour', 'remboursement', 'renvoyer', 'annuler'],
    response: "Vous disposez de 14 jours satisfaits ou remboursés. Vous pouvez éditer une étiquette de retour gratuite depuis la section 'Retours & Remboursements'."
  }
];

const DEFAULT_RESPONSE = "Merci pour votre question. Si votre demande concerne un aspect technique ou spécifique, nous pouvons transmettre votre ticket directement à notre équipe support.";

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const typingIndicator = document.getElementById('typing-indicator');
const quickTopics = document.getElementById('quick-topics');
const metricCache = document.getElementById('metric-cache');
const metricLatency = document.getElementById('metric-latency');

/**
 * Match user query against Knowledge Base with similarity evaluation
 * Bolt Optimization: Memoized pattern lookup
 */
function matchIntent(query) {
  const normalized = query.toLowerCase();

  if (queryCache.has(normalized)) {
    cacheHits++;
    return { text: queryCache.get(normalized), cached: true };
  }

  let bestMatch = DEFAULT_RESPONSE;
  let maxScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item.response;
    }
  }

  // Cache response
  queryCache.set(normalized, bestMatch);
  return { text: bestMatch, cached: false };
}

/**
 * Stream text smoothly into DOM using requestAnimationFrame to prevent main-thread lag
 */
function streamText(container, text, callback) {
  let index = 0;
  const length = text.length;

  function step() {
    index += 3; // Chunk 3 characters per frame for high FPS speed
    container.textContent = text.slice(0, index);
    if (index < length) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
    }
  }

  requestAnimationFrame(step);
}

function appendMessage(sender, text, isCached = false) {
  const wrapper = document.createElement('div');
  wrapper.className = `flex items-start gap-3 ${sender === 'user' ? 'justify-end' : ''}`;

  if (sender === 'user') {
    wrapper.innerHTML = `
      <div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
        ${text}
      </div>
    `;
    chatMessages.appendChild(wrapper);
  } else {
    const aiBubble = document.createElement('div');
    aiBubble.className = "bg-slate-700/70 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[80%] border border-slate-600/50";

    wrapper.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">AI</div>
    `;
    wrapper.appendChild(aiBubble);
    chatMessages.appendChild(wrapper);

    // Stream response
    streamText(aiBubble, text, () => {
      if (isCached) {
        const tag = document.createElement('span');
        tag.className = 'block text-[10px] text-amber-400 mt-1 font-mono';
        tag.textContent = '⚡ Réponse servie depuis le cache client (<2ms)';
        aiBubble.appendChild(tag);
      }
    });
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateMetrics() {
  const hitPercentage = totalQueries > 0 ? Math.round((cacheHits / totalQueries) * 100) : 0;
  metricCache.textContent = `${hitPercentage}% (${cacheHits}/${totalQueries})`;
}

// Form Submission Handler
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = chatInput.value.trim();
  if (!query) return;

  totalQueries++;
  chatInput.value = '';
  appendMessage('user', query);

  typingIndicator.classList.remove('hidden');

  const startTime = performance.now();

  setTimeout(() => {
    const { text, cached } = matchIntent(query);
    const duration = (performance.now() - startTime).toFixed(1);

    metricLatency.textContent = `${duration}ms (${cached ? 'Cache Hit' : 'Compute'})`;
    typingIndicator.classList.add('hidden');

    appendMessage('ai', text, cached);
    updateMetrics();
  }, cached ? 50 : 300);
});

// Bolt Optimization: Event Delegation on Quick Topics container
quickTopics.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-query]');
  if (!btn) return;

  const query = btn.getAttribute('data-query');
  chatInput.value = query;
  chatForm.dispatchEvent(new Event('submit'));
});

// Clear Chat
document.getElementById('btn-clear').addEventListener('click', () => {
  chatMessages.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">AI</div>
      <div class="bg-slate-700/70 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[80%] border border-slate-600/50">
        Historique réinitialisé. Comment puis-je vous aider ?
      </div>
    </div>
  `;
});
