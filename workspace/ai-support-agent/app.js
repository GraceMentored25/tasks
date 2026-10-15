// Bolt ⚡ Optimization: Debounced search & lightweight local similarity search
document.addEventListener('DOMContentLoaded', () => {
  const kbDocInput = document.getElementById('kb-doc');
  const kbSearchInput = document.getElementById('kb-search');
  const searchResults = document.getElementById('search-results');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // Initial sample Knowledge Base
  if (!kbDocInput.value) {
    kbDocInput.value = `[Doc 1 - Remboursement]: Politique de remboursement sous 14 jours satisfaits ou remboursés sans justification.\n[Doc 2 - Horaires]: Le support client est disponible du lundi au vendredi de 9h à 18h par email et chat.\n[Doc 3 - Tarification]: L'offre Premium est à 29€/mois et inclut un support prioritaire H24.`;
  }

  // Bolt ⚡ Lightweight Debounce implementation to avoid high-frequency reflows
  function debounce(func, wait) {
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

  function searchKnowledgeBase() {
    const query = (kbSearchInput.value || '').trim().toLowerCase();
    if (!query) {
      searchResults.textContent = 'Tapez votre recherche ci-dessus...';
      return;
    }

    const docs = kbDocInput.value.split('\n').filter(d => d.trim().length > 0);
    const queryTokens = query.split(/\s+/).filter(t => t.length > 2);

    // O(N) linear scan over split documents
    const scoredDocs = docs.map(doc => {
      const lowerDoc = doc.toLowerCase();
      let score = 0;
      queryTokens.forEach(token => {
        if (lowerDoc.includes(token)) score++;
      });
      return { doc, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);

    if (scoredDocs.length === 0) {
      searchResults.textContent = '❌ Aucun document correspondant trouvé.';
      return;
    }

    searchResults.innerHTML = scoredDocs.map(item => `
      <div style="margin-bottom:0.4rem; padding:0.4rem; background:#1e293b; border-radius:4px;">
        <strong>Match Score: ${item.score}</strong> - ${item.doc}
      </div>
    `).join('');
  }

  // Apply 150ms debounce window
  kbSearchInput.addEventListener('input', debounce(searchKnowledgeBase, 150));

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    // Render User Message
    const userBubble = document.createElement('div');
    userBubble.className = 'msg user';
    userBubble.textContent = userMsg;
    chatMessages.appendChild(userBubble);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate RAG Context Match
    setTimeout(() => {
      const docs = kbDocInput.value.split('\n').filter(d => d.trim().length > 0);
      const queryTokens = userMsg.toLowerCase().split(/\s+/).filter(t => t.length > 2);

      let bestMatch = null;
      let maxScore = 0;

      docs.forEach(doc => {
        const lowerDoc = doc.toLowerCase();
        let score = 0;
        queryTokens.forEach(t => { if (lowerDoc.includes(t)) score++; });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = doc;
        }
      });

      const botBubble = document.createElement('div');
      botBubble.className = 'msg bot';
      if (bestMatch) {
        botBubble.textContent = `🤖 [Réponse RAG Support]: D'après notre base de connaissances : "${bestMatch}"`;
      } else {
        botBubble.textContent = `🤖 [Réponse Support]: Je n'ai pas trouvé de document exact dans la base de données. Un conseiller vous recontactera sous peu.`;
      }
      chatMessages.appendChild(botBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 400);
  });
});
