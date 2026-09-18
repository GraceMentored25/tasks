/**
 * Support Copilot AI App Engine
 * Optimized by Bolt ⚡ for sub-millisecond filtering and response generation
 */

// Sample support ticket database
const TICKETS = [
  {
    id: "TCK-101",
    customer: "Jane Doe",
    email: "jane@company.com",
    subject: "Refund request for subscription renewal",
    query: "Hi, I was accidentally charged for the annual plan yesterday. Can I get a refund?",
    priority: "High",
    tag: "billing",
    suggestedReply: "Hello Jane,\n\nI have reviewed your account and processed a full refund for your annual plan renewal. The amount should reflect on your statement within 3-5 business days.\n\nBest regards,\nSupport Team"
  },
  {
    id: "TCK-102",
    customer: "Alex Smith",
    email: "alex@techcorp.io",
    subject: "API Gateway 500 Internal Server Error",
    query: "Our webhooks are failing with HTTP 500 since 08:00 UTC. Is there an active incident?",
    priority: "Urgent",
    tag: "technical",
    suggestedReply: "Hi Alex,\n\nOur engineering team identified a transient database pool bottleneck impacting API webhooks between 08:00 and 08:30 UTC. The service has been fully restored. Please retry your queued requests.\n\nBest regards,\nDeveloper Support"
  },
  {
    id: "TCK-103",
    customer: "Maria Garcia",
    email: "m.garcia@design.co",
    subject: "Feature inquiry: SSO SAML integration",
    query: "Do you support Okta SAML 2.0 single sign-on on the Business Plan?",
    priority: "Medium",
    tag: "sales",
    suggestedReply: "Hello Maria,\n\nYes! SAML 2.0 SSO via Okta and Azure AD is natively supported on our Enterprise plan. I can arrange a demo with our solutions architect if helpful.\n\nBest regards,\nSales & Support"
  }
];

// O(1) Tag Index Map constructed once at load time (Bolt Optimization)
const tagIndexMap = new Map();
TICKETS.forEach(ticket => {
  if (!tagIndexMap.has(ticket.tag)) {
    tagIndexMap.set(ticket.tag, []);
  }
  tagIndexMap.get(ticket.tag).push(ticket);
});

// App State
let activeTicketId = null;

// DOM Elements
const ticketListEl = document.getElementById('ticket-list');
const ticketCountEl = document.getElementById('ticket-count');
const searchInputEl = document.getElementById('search-input');
const ticketTitleEl = document.getElementById('ticket-title');
const ticketMetaEl = document.getElementById('ticket-meta');
const ticketBodyContainerEl = document.getElementById('ticket-body-container');
const ticketCustomerQueryEl = document.getElementById('ticket-customer-query');
const aiReplyEl = document.getElementById('ai-reply');
const perfBadgeEl = document.getElementById('perf-badge');
const btnSendEl = document.getElementById('btn-send');

/**
 * Render tickets list cleanly
 * Uses fragment to minimize layout reflows (Bolt Optimization)
 */
function renderTickets(ticketsToRender) {
  const fragment = document.createDocumentFragment();
  ticketsToRender.forEach(ticket => {
    const card = document.createElement('div');
    card.className = `p-3 rounded-lg border transition cursor-pointer ${
      activeTicketId === ticket.id
        ? 'bg-blue-950/60 border-blue-500'
        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
    }`;
    card.onclick = () => selectTicket(ticket.id);

    card.innerHTML = `
      <div class="flex justify-between items-start mb-1">
        <span class="text-xs font-mono text-slate-400">${ticket.id}</span>
        <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
          ticket.priority === 'Urgent' ? 'bg-red-900/60 text-red-300' : 'bg-slate-800 text-slate-300'
        }">${ticket.priority}</span>
      </div>
      <div class="text-sm font-medium text-slate-200 truncate">${ticket.subject}</div>
      <div class="text-xs text-slate-400 mt-1 flex justify-between items-center">
        <span>${ticket.customer}</span>
        <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">#${ticket.tag}</span>
      </div>
    `;
    fragment.appendChild(card);
  });

  ticketListEl.innerHTML = '';
  ticketListEl.appendChild(fragment);
  ticketCountEl.textContent = `${ticketsToRender.length} ticket${ticketsToRender.length !== 1 ? 's' : ''}`;
}

/**
 * Select active ticket and instant draft generation
 */
function selectTicket(id) {
  const startTime = performance.now();
  activeTicketId = id;
  const ticket = TICKETS.find(t => t.id === id);
  if (!ticket) return;

  ticketTitleEl.textContent = ticket.subject;
  ticketMetaEl.textContent = `From: ${ticket.customer} (${ticket.email}) | Category: ${ticket.tag.toUpperCase()}`;
  ticketCustomerQueryEl.textContent = `"${ticket.query}"`;
  ticketBodyContainerEl.classList.remove('hidden');

  // Fast direct template injection
  aiReplyEl.value = ticket.suggestedReply;

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  perfBadgeEl.textContent = `Generated in ${duration}ms`;
  perfBadgeEl.classList.remove('hidden');

  renderTickets(getFilteredTickets());
}

/**
 * Search/Filter logic using linear filter or map lookup
 */
function getFilteredTickets() {
  const query = searchInputEl.value.trim().toLowerCase();
  if (!query) return TICKETS;

  // Direct O(1) match if searching exact tag
  if (tagIndexMap.has(query)) {
    return tagIndexMap.get(query);
  }

  // Standard filter for text queries
  return TICKETS.filter(t =>
    t.subject.toLowerCase().includes(query) ||
    t.customer.toLowerCase().includes(query) ||
    t.tag.toLowerCase().includes(query)
  );
}

// Event Listeners
searchInputEl.addEventListener('input', () => {
  window.requestAnimationFrame(() => {
    renderTickets(getFilteredTickets());
  });
});

btnSendEl.addEventListener('click', () => {
  if (!activeTicketId) {
    alert('Please select a ticket first.');
    return;
  }
  alert(`Response dispatched for ${activeTicketId}!`);
});

// Initial load
renderTickets(TICKETS);
if (TICKETS.length > 0) {
  selectTicket(TICKETS[0].id);
}
