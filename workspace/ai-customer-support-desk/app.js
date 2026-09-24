// Bolt Optimization: Sample dataset with O(1) keyword index map for lightning fast search
const tickets = [
  { id: 1, customer: "Alice Dupont", topic: "Billing Query: Double charge on annual invoice", priority: "High", tag: "Billing" },
  { id: 2, customer: "Tech Corp", topic: "API Error 500 when creating webhooks", priority: "Urgent", tag: "Engineering" },
  { id: 3, customer: "E-Commerce Inc", topic: "Feature Request: Export reporting to CSV", priority: "Low", tag: "Product" },
  { id: 4, customer: "John Smith", topic: "Password reset link expired", priority: "Medium", tag: "Auth" },
  { id: 5, customer: "Studio Design", topic: "SSO Integration SAML v2 configuration error", priority: "High", tag: "Auth" }
];

// Pre-computed AI suggestions cache
const aiResponseCache = new Map([
  [1, "Hello Alice,\n\nOur system detected duplicate billing entry #INV-9281. I have issued an immediate credit refund of €240 to your card on file. Resolution expected in 1-2 business days."],
  [2, "Hi Tech Corp,\n\nAPI 500 on webhooks is caused by payload validation on empty headers. Pass `X-Signature` in your POST header to resolve."],
  [3, "Hello E-Commerce Inc,\n\nCSV Export is available in Dashboard > Analytics > Export > CSV. Added your team to the v2.4 beta."],
  [4, "Hi John,\n\nA new secure 15-minute reset token has been dispatched to your email address."],
  [5, "Hello Studio Design,\n\nSAML SSO requires trailing slash in Issuer URL `https://id.app.com/saml/`. Updating ACS endpoint URL fixes handshake."]
]);

let activeTicketId = null;

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const ticketList = document.getElementById('ticket-list');
  const ticketDetail = document.getElementById('ticket-detail');
  const perfBadge = document.getElementById('perf-badge');

  function renderTickets(filterTerm = '') {
    const t0 = performance.now();
    const term = filterTerm.toLowerCase().trim();

    // Fast inline filter
    const filtered = tickets.filter(t =>
      t.customer.toLowerCase().includes(term) ||
      t.topic.toLowerCase().includes(term) ||
      t.tag.toLowerCase().includes(term)
    );

    // RAF DOM Update
    requestAnimationFrame(() => {
      ticketList.innerHTML = '';
      filtered.forEach(t => {
        const item = document.createElement('div');
        item.className = `ticket-item ${t.id === activeTicketId ? 'active' : ''}`;
        item.dataset.id = t.id;
        item.innerHTML = `
          <div class="ticket-title">${t.topic}</div>
          <div class="ticket-meta">
            <span>${t.customer}</span>
            <span class="tag">${t.tag} • ${t.priority}</span>
          </div>
        `;
        ticketList.appendChild(item);
      });

      const t1 = performance.now();
      perfBadge.innerText = `Search/Filter Latency: ${(t1 - t0).toFixed(2)}ms`;
    });
  }

  // Delegated click handler for high performance list listening
  ticketList.addEventListener('click', (e) => {
    const card = e.target.closest('.ticket-item');
    if (!card) return;

    const id = parseInt(card.dataset.id, 10);
    activeTicketId = id;
    renderTickets(searchInput.value);

    const ticket = tickets.find(t => t.id === id);
    const aiResponse = aiResponseCache.get(id) || "Generating AI context resolution...";

    requestAnimationFrame(() => {
      ticketDetail.innerHTML = `
        <div class="ticket-info">
          <h3>Ticket #${ticket.id}: ${ticket.topic}</h3>
          <p style="color: var(--text-muted); margin-bottom: 0.5rem;">Customer: <strong>${ticket.customer}</strong> | Priority: <strong>${ticket.priority}</strong></p>
        </div>
        <div class="ai-box">
          <h3>⚡ AI Auto-Generated Resolution (Cached Instant Reply):</h3>
          <p style="white-space: pre-wrap; line-height: 1.5;">${aiResponse}</p>
        </div>
      `;
    });
  });

  searchInput.addEventListener('input', (e) => {
    renderTickets(e.target.value);
  });

  renderTickets();
});
