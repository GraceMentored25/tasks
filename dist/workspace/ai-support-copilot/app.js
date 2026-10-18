// High performance LRU Cache for AI support response generation
class ResponseLRUCache {
  constructor(limit = 50) {
    this.limit = limit;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.limit) {
      // Evict oldest entry (O(1) iteration)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

const responseCache = new ResponseLRUCache(50);

function processSupportTicket(ticketText) {
  const startTime = performance.now();
  const normalized = ticketText.trim().toLowerCase();

  if (!normalized) {
    return {
      draft: "Veuillez fournir un détail plus explicite sur la demande du client.",
      executionTime: (performance.now() - startTime).toFixed(2),
      cached: false
    };
  }

  // Check LRU cache for identical queries
  const cachedResult = responseCache.get(normalized);
  if (cachedResult) {
    return {
      draft: cachedResult,
      executionTime: (performance.now() - startTime).toFixed(2),
      cached: true
    };
  }

  let draft = "";
  if (normalized.includes("facture") || normalized.includes("double")) {
    draft = "Bonjour, nous avons bien pris en compte le problème de double facturation. Notre équipe comptable procède au versement du remboursement sous 24h à 48h.";
  } else if (normalized.includes("remboursement") || normalized.includes("annuler")) {
    draft = "Bonjour, nous procédons à l'annulation immédiate de votre commande et à la réémission du montant directement sur votre carte de paiement.";
  } else if (normalized.includes("bug") || normalized.includes("erreur")) {
    draft = "Bonjour, notre équipe technique a été notifiée de l'anomalie. Un correctif est en cours de déploiement et nous vous recontacterons dès résolution.";
  } else {
    draft = "Bonjour, votre demande a bien été transmise à notre support client expert. Un conseiller dédié traitera votre ticket dans un délai maximal de 2 heures.";
  }

  responseCache.set(normalized, draft);

  return {
    draft,
    executionTime: (performance.now() - startTime).toFixed(2),
    cached: false
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('ticket-input');
  const btnEl = document.getElementById('analyze-btn');
  const outputCard = document.getElementById('output-card');
  const responseText = document.getElementById('response-text');
  const perfMetrics = document.getElementById('perf-metrics');

  if (btnEl && inputEl) {
    btnEl.addEventListener('click', () => {
      const result = processSupportTicket(inputEl.value);
      outputCard.style.display = 'block';
      responseText.textContent = result.draft;
      perfMetrics.textContent = `Temps de réponse: ${result.executionTime} ms | Cache LRU: ${result.cached ? 'Hit (O(1))' : 'Miss'}`;
    });
  }
});
