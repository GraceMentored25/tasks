/**
 * AI Customer Support Copilot - Application Logic
 * Optimized by Bolt ⚡ for ultra-low latency response matching.
 */

// Sample support tickets dataset
const TICKETS = [
  { id: 'T-101', client: 'Alice M.', topic: 'refund', query: 'Je souhaite demander un remboursement pour ma commande #4812 non reçue.', category: 'Facturation' },
  { id: 'T-102', client: 'Bernard D.', topic: 'bug', query: 'Impossible de me connecter à mon compte utilisateur depuis ce matin.', category: 'Technique' },
  { id: 'T-103', client: 'Claire R.', topic: 'delivery', query: 'Où se trouve mon colis chronopost num XYZ987 ?', category: 'Logistique' },
  { id: 'T-104', client: 'David K.', topic: 'feature', query: 'Proposez-vous une API GraphQL pour l\'intégration de données ?', category: 'Produit' }
];

// Bolt Optimization: Pre-indexed Hash Map for O(1) instant suggestion retrieval
const SUGGESTIONS_MAP = new Map([
  ['refund', 'Bonjour, nous sommes désolés pour ce retard. Votre demande de remboursement pour la commande #4812 a été enregistrée et traitée sous 48h.'],
  ['bug', 'Bonjour, nous avons réinitialisé votre session de connexion. Merci de vider le cache de votre navigateur et de réessayer.'],
  ['delivery', 'Bonjour, votre colis est actuellement en cours de livraison par notre partenaire logistique. Statut mis à jour en temps réel.'],
  ['feature', 'Bonjour, notre API GraphQL est disponible en version Beta restreinte. Notre équipe technique va vous envoyer la documentation.']
]);

// Single-pass regex for keyword tagging
const CATEGORY_REGEX = /(remboursement|bug|colis|api)/i;

let activeTicketId = null;

// Debounce helper to prevent main thread blocking during continuous typing
function debounce(fn, delayMs = 150) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

// Render ticket list with current filter
function renderTicketList(filterText = '') {
  const container = document.getElementById('ticket-list');
  const lowerFilter = filterText.toLowerCase();

  // Filter in O(N) single pass
  const filtered = TICKETS.filter(t =>
    !lowerFilter || t.client.toLowerCase().includes(lowerFilter) || t.query.toLowerCase().includes(lowerFilter)
  );

  container.innerHTML = filtered.map(t => `
    <button
      data-id="${t.id}"
      class="ticket-item w-full text-left p-3 rounded-lg border border-slate-700/60 bg-slate-900/50 hover:bg-slate-700/50 transition-colors ${t.id === activeTicketId ? 'ring-2 ring-indigo-500 bg-slate-800' : ''}"
    >
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="font-bold text-indigo-400">${t.id}</span>
        <span class="text-slate-400">${t.client}</span>
      </div>
      <p class="text-xs text-slate-300 truncate">${t.query}</p>
    </button>
  `).join('');

  // Re-attach listeners efficiently
  container.querySelectorAll('.ticket-item').forEach(btn => {
    btn.addEventListener('click', () => selectTicket(btn.getAttribute('data-id')));
  });
}

// Select ticket and trigger O(1) response lookup
function selectTicket(ticketId) {
  const ticket = TICKETS.find(t => t.id === ticketId);
  if (!ticket) return;

  activeTicketId = ticketId;
  renderTicketList(document.getElementById('search-input').value);

  document.getElementById('ticket-title').textContent = `${ticket.id} - ${ticket.client}`;
  document.getElementById('ticket-category').textContent = `Catégorie: ${ticket.category}`;
  document.getElementById('ticket-body').textContent = ticket.query;

  // Measure O(1) retrieval benchmark
  const startTime = performance.now();

  // Bolt Optimization: O(1) Map lookup
  const suggestion = SUGGESTIONS_MAP.get(ticket.topic) || "Bonjour, nous traitons votre demande dans les plus brefs délais.";

  const endTime = performance.now();

  document.getElementById('copilot-suggestion').textContent = suggestion;
  document.getElementById('perf-metric').textContent = `Lookup match: ${(endTime - startTime).toFixed(3)} ms`;
}

// Initialize handlers
document.addEventListener('DOMContentLoaded', () => {
  renderTicketList();

  // Debounced search listener
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      renderTicketList(e.target.value);
    }, 150));
  }

  // Action buttons
  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const text = document.getElementById('copilot-suggestion').textContent;
      navigator.clipboard.writeText(text);
      btnCopy.textContent = 'Copié !';
      setTimeout(() => { btnCopy.textContent = 'Copier Réponse'; }, 1500);
    });
  }

  const btnSend = document.getElementById('btn-send');
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      if (!activeTicketId) return;
      alert(`Réponse envoyée pour le ticket ${activeTicketId}`);
    });
  }
});
