/**
 * ⚡ BOLT PERFORMANCE OPTIMIZATIONS:
 * 1. O(1) Keyword Classifier Hash Table: Maps priority & category triggers to constant time dictionary lookups.
 * 2. Memoized Ticket Filter: Prevents unnecessary filtering iterations on UI updates.
 * 3. requestAnimationFrame Batch Rendering: Schedules list DOM insertion in sync with display refresh cycles.
 */

// Helper to escape HTML characters safely
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}

// 1. O(1) Classification Hash Table
const CLASSIFICATION_DICTIONARY = {
  billing: { category: 'Billing & Finance', priority: 'High', department: 'Finance Tier 2' },
  refund: { category: 'Billing & Finance', priority: 'High', department: 'Finance Tier 2' },
  charge: { category: 'Billing & Finance', priority: 'High', department: 'Finance Tier 1' },
  invoice: { category: 'Billing & Finance', priority: 'Medium', department: 'Finance Tier 1' },
  down: { category: 'Technical Support', priority: 'High', department: 'DevOps / On-Call' },
  crash: { category: 'Technical Support', priority: 'High', department: 'Tech Support Tier 2' },
  bug: { category: 'Technical Support', priority: 'Medium', department: 'Tech Support Tier 1' },
  error: { category: 'Technical Support', priority: 'Medium', department: 'Tech Support Tier 1' },
  password: { category: 'Account Access', priority: 'Medium', department: 'Identity & Access' },
  login: { category: 'Account Access', priority: 'High', department: 'Identity & Access' },
  pricing: { category: 'General Inquiry', priority: 'Low', department: 'Sales Team' },
  feature: { category: 'General Inquiry', priority: 'Low', department: 'Product Management' }
};

// State
let tickets = [];
let memoizedFilter = { priority: 'ALL', category: 'ALL', cachedResult: null, isDirty: true };

// Fast Classifier Function using Hash Lookup
function classifyTicket(subject, message) {
  const text = `${subject} ${message}`.toLowerCase();
  const words = text.match(/\w+/g) || [];

  let detectedCategory = 'General Inquiry';
  let detectedPriority = 'Low';
  let detectedDepartment = 'Customer Success';

  for (const word of words) {
    if (CLASSIFICATION_DICTIONARY[word]) {
      const match = CLASSIFICATION_DICTIONARY[word];
      detectedCategory = match.category;
      detectedPriority = match.priority;
      detectedDepartment = match.department;
      // Stop early if High priority matched
      if (detectedPriority === 'High') break;
    }
  }

  const suggestedReply = `Hello,\nThank you for reaching out regarding "${subject}". Our ${detectedDepartment} team is reviewing your ticket (${detectedPriority} priority). We will follow up shortly.`;

  return {
    category: detectedCategory,
    priority: detectedPriority,
    department: detectedDepartment,
    suggestedReply
  };
}

// DOM Elements
const customerEmailInput = document.getElementById('customer-email');
const ticketSubjectInput = document.getElementById('ticket-subject');
const ticketMessageInput = document.getElementById('ticket-message');
const addTicketBtn = document.getElementById('add-ticket-btn');
const seedTicketsBtn = document.getElementById('seed-tickets-btn');
const filterPriority = document.getElementById('filter-priority');
const filterCategory = document.getElementById('filter-category');
const ticketsContainer = document.getElementById('tickets-container');
const totalTicketsSpan = document.getElementById('total-tickets');
const perfIndicator = document.getElementById('perf-indicator');

// Memoized Ticket Filter
function getFilteredTickets() {
  const selectedPriority = filterPriority.value;
  const selectedCategory = filterCategory.value;

  if (
    !memoizedFilter.isDirty &&
    memoizedFilter.priority === selectedPriority &&
    memoizedFilter.category === selectedCategory &&
    memoizedFilter.cachedResult !== null
  ) {
    return memoizedFilter.cachedResult;
  }

  const result = tickets.filter(t => {
    const matchP = selectedPriority === 'ALL' || t.priority === selectedPriority;
    const matchC = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchP && matchC;
  });

  memoizedFilter.priority = selectedPriority;
  memoizedFilter.category = selectedCategory;
  memoizedFilter.cachedResult = result;
  memoizedFilter.isDirty = false;

  return result;
}

// High performance DOM rendering using requestAnimationFrame & DocumentFragment
function renderTickets() {
  const startTime = performance.now();
  const filtered = getFilteredTickets();

  totalTicketsSpan.textContent = filtered.length;

  requestAnimationFrame(() => {
    const fragment = document.createDocumentFragment();

    filtered.forEach(ticket => {
      const card = document.createElement('div');
      card.className = 'ticket-item';

      const safeSubject = escapeHTML(ticket.subject);
      const safeEmail = escapeHTML(ticket.email);
      const safeMessage = escapeHTML(ticket.message);
      const safeReply = escapeHTML(ticket.suggestedReply.replace('\n', ' '));

      card.innerHTML = `
        <div class="ticket-header">
          <strong>${safeSubject}</strong>
          <span class="priority-pill p-${ticket.priority}">${ticket.priority}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--muted)">
          From: ${safeEmail} | Dept: <strong>${ticket.department}</strong> (${ticket.category})
        </div>
        <div style="font-size:0.85rem; margin-top:4px;">${safeMessage}</div>
        <div style="font-size:0.75rem; background:#0f172a; padding:6px; border-radius:4px; margin-top:4px; color:#cbd5e1;">
          💡 <strong>Auto-Response:</strong> ${safeReply}
        </div>
      `;

      fragment.appendChild(card);
    });

    ticketsContainer.innerHTML = '';
    ticketsContainer.appendChild(fragment);

    const endTime = performance.now();
    perfIndicator.textContent = `⚡ Render Time: ${(endTime - startTime).toFixed(2)} ms`;
  });
}

// Add Single Ticket
addTicketBtn.addEventListener('click', () => {
  const email = customerEmailInput.value || 'user@example.com';
  const subject = ticketSubjectInput.value || 'No Subject';
  const message = ticketMessageInput.value || '';

  const classification = classifyTicket(subject, message);

  tickets.unshift({
    id: Date.now(),
    email,
    subject,
    message,
    ...classification
  });

  memoizedFilter.isDirty = true;
  renderTickets();
});

// Seed Batch Sample Tickets
seedTicketsBtn.addEventListener('click', () => {
  const samples = [
    { subject: 'Cannot login to account', msg: 'Password reset link is expired and gives error 500', email: 'john@corp.com' },
    { subject: 'System downtime on EU server', msg: 'Our API integration is down completely', email: 'tech@partner.io' },
    { subject: 'Invoice query for May', msg: 'Can you send us the VAT tax breakdown invoice?', email: 'accts@freelance.fr' },
    { subject: 'Feature request: Dark mode', msg: 'Would love to see a native dark theme in the web dashboard', email: 'dev@studio.org' },
    { subject: 'Refund request for unused subscription', msg: 'Accidentally renewed annual plan, please refund charge', email: 'kate@gmail.com' },
    { subject: 'Mobile app crash on startup', msg: 'App closes immediately on iOS 17 update', email: 'mobile@user.net' },
    { subject: 'Pricing plans for enterprise', msg: 'We have 200 seats, what is the custom volume discount pricing?', email: 'procurement@enterprise.com' },
  ];

  samples.forEach(s => {
    const classification = classifyTicket(s.subject, s.msg);
    tickets.unshift({
      id: Date.now() + Math.random(),
      email: s.email,
      subject: s.subject,
      message: s.msg,
      ...classification
    });
  });

  memoizedFilter.isDirty = true;
  renderTickets();
});

filterPriority.addEventListener('change', renderTickets);
filterCategory.addEventListener('change', renderTickets);

// Initial Ticket Add
addTicketBtn.click();
