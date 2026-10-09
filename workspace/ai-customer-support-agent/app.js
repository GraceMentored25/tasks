/**
 * Bolt ⚡ Performance Strategy:
 * 1. Memoized RAG Knowledge Base queries via LRU Cache (`ragCache`).
 * 2. High-frequency search input debouncing to prevent excessive filtering overhead.
 * 3. O(1) direct dictionary lookups for instant response generation.
 */

// Simulated Knowledge Base Articles
const KNOWLEDGE_BASE = [
  { id: 1, keywords: ['refund', 'money', 'cancel'], title: 'Refund Policy & SLA', snippet: 'Full refunds are processed within 14 business days of account cancellation.' },
  { id: 2, keywords: ['api', 'rate', 'limit', '429'], title: 'API Rate Limits & Quotas', snippet: 'Standard tiers allow up to 100 requests per minute. Contact support for Enterprise quotas.' },
  { id: 3, keywords: ['password', 'login', '2fa', 'auth'], title: 'Authentication & 2FA Setup', snippet: 'Reset password via account settings or request a secure magic link reset email.' },
  { id: 4, keywords: ['billing', 'invoice', 'vat'], title: 'Invoicing & Tax Info', snippet: 'Download monthly PDF invoices from Billing > Invoice History tab.' }
];

// Sample Support Tickets
const SAMPLE_TICKETS = [
  { id: 'TCK-101', customer: 'Alice Smith', priority: 'High', issue: 'Requesting refund for unused enterprise seats', category: 'Billing' },
  { id: 'TCK-102', customer: 'DevCorp Inc', priority: 'Critical', issue: 'Receiving HTTP 429 rate limit error on production API', category: 'API' },
  { id: 'TCK-103', customer: 'Bob Johnson', priority: 'Medium', issue: 'How do I setup 2FA authentication for my team members?', category: 'Security' }
];

// Performance Metrics Tracking
let totalSearches = 0;
let cacheHits = 0;

// LRU Cache Implementation (Capacity: 20 entries)
class SearchCacheMap {
  constructor(capacity = 20) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  set(key, val) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, val);
  }
}

const ragCache = new SearchCacheMap();

// Debounce Utility (Bolt Optimization)
function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// DOM Elements
const queryInput = document.getElementById('rag-query');
const resultsContainer = document.getElementById('rag-results');
const searchTimeEl = document.getElementById('search-time');
const hitRateEl = document.getElementById('cache-hit-rate');

const btnGenerateTicket = document.getElementById('btn-generate-ticket');
const activeTicketEl = document.getElementById('active-ticket');
const aiSuggestionBox = document.getElementById('ai-suggestion-box');
const aiDraftText = document.getElementById('ai-draft-text');
const btnSendReply = document.getElementById('btn-send-reply');

// Fast RAG Lookup Routine
function executeRAGSearch(query) {
  const startTime = performance.now();
  totalSearches++;

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    resultsContainer.innerHTML = '<p class="placeholder-text">Type above to test instant RAG lookup...</p>';
    searchTimeEl.textContent = '0 ms';
    return;
  }

  // Check Cache
  const cachedResults = ragCache.get(trimmed);
  let matched;

  if (cachedResults) {
    cacheHits++;
    matched = cachedResults;
  } else {
    // Perform Lookup
    matched = KNOWLEDGE_BASE.filter(item =>
      item.keywords.some(k => trimmed.includes(k)) ||
      item.title.toLowerCase().includes(trimmed) ||
      item.snippet.toLowerCase().includes(trimmed)
    );
    ragCache.set(trimmed, matched);
  }

  const duration = (performance.now() - startTime).toFixed(2);
  searchTimeEl.textContent = `${duration} ms ${cachedResults ? '(Cached)' : ''}`;

  // Update Hit Rate
  const hitPercentage = Math.round((cacheHits / totalSearches) * 100);
  hitRateEl.textContent = `${hitPercentage}%`;

  // Render
  renderResults(matched);
}

function renderResults(results) {
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="placeholder-text">No knowledge base articles found for query.</p>';
    return;
  }

  resultsContainer.innerHTML = results.map(item => `
    <div class="result-item">
      <div class="result-title">${item.title}</div>
      <div class="result-snippet">${item.snippet}</div>
    </div>
  `).join('');
}

// Attach Debounced Input Listener
queryInput.addEventListener('input', debounce((e) => {
  executeRAGSearch(e.target.value);
}, 150));

// Ticket Auto-Triage Handler
btnGenerateTicket.addEventListener('click', () => {
  const randomTicket = SAMPLE_TICKETS[Math.floor(Math.random() * SAMPLE_TICKETS.length)];

  activeTicketEl.innerHTML = `
    <div style="display:flex; justify-between; align-items:center; margin-bottom:0.5rem;">
      <strong style="color:#fff;">${randomTicket.id} - ${randomTicket.customer}</strong>
      <span style="background:rgba(239, 68, 68, 0.2); color:#f87171; padding:0.2rem 0.5rem; border-radius:4px; font-size:0.75rem;">${randomTicket.priority} Priority</span>
    </div>
    <p style="color:#cbd5e1; font-size:0.9rem;">${randomTicket.issue}</p>
  `;

  // AI Response Draft Generation
  aiSuggestionBox.classList.remove('hidden');
  if (randomTicket.category === 'Billing') {
    aiDraftText.value = `Hello ${randomTicket.customer},\n\nThank you for reaching out. I have reviewed your account details and initiated the refund request in according with our 14-day policy. You will receive a confirmation email shortly.`;
  } else if (randomTicket.category === 'API') {
    aiDraftText.value = `Hello ${randomTicket.customer},\n\nOur system detected temporary burst traffic causing HTTP 429 rate limits. I have temporarily increased your API limit buffer while we process your quota upgrade.`;
  } else {
    aiDraftText.value = `Hello ${randomTicket.customer},\n\nYou can easily setup 2FA by navigating to Settings > Security > Enable Two-Factor Authentication. Let us know if you need step-by-step assistance!`;
  }
});

btnSendReply.addEventListener('click', () => {
  alert('Response sent successfully to customer!');
  aiSuggestionBox.classList.add('hidden');
  activeTicketEl.innerHTML = '<p class="placeholder-text">Click "Generate Sample Ticket" to simulate incoming customer requests.</p>';
});
