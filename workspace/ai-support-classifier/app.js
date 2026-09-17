function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const KEYWORD_MAP = {
  urgent: ['urgent', 'emergency', 'down', 'broken', 'outage', 'critical', 'immediately', 'crash', 'fail'],
  billing: ['billing', 'invoice', 'charge', 'payment', 'refund', 'credit card', 'subscription'],
  security: ['security', 'breach', 'unauthorized', 'hacked', 'password', 'leak', '2fa'],
  technical: ['bug', 'error', 'api', 'code', '404', '500', 'slow', 'timeout'],
  negative: ['terrible', 'angry', 'disappointed', 'useless', 'horrible', 'worst', 'cancel']
};

const COMPILED_PATTERNS = Object.fromEntries(
  Object.entries(KEYWORD_MAP).map(([key, words]) => [
    key,
    new RegExp(`\\b(${words.join('|')})\\b`, 'gi')
  ])
);

function analyzeTicket(rawText) {
  const t0 = performance.now();
  const boundedText = rawText.slice(0, 10000);

  if (!boundedText.trim()) {
    return {
      priority: 'N/A',
      category: 'N/A',
      sentiment: 'N/A',
      time: '0.0 ms',
      response: 'Please enter ticket text to analyze.'
    };
  }

  let urgentMatches = (boundedText.match(COMPILED_PATTERNS.urgent) || []).length;
  let billingMatches = (boundedText.match(COMPILED_PATTERNS.billing) || []).length;
  let securityMatches = (boundedText.match(COMPILED_PATTERNS.security) || []).length;
  let techMatches = (boundedText.match(COMPILED_PATTERNS.technical) || []).length;
  let negMatches = (boundedText.match(COMPILED_PATTERNS.negative) || []).length;

  let priority = 'Low 🟢';
  if (urgentMatches > 0 || securityMatches > 0) priority = 'Urgent 🚨';
  else if (negMatches > 1 || techMatches > 2) priority = 'High 🔴';
  else if (billingMatches > 0 || techMatches > 0) priority = 'Medium 🟡';

  let category = 'General Inquiry';
  const categoryScores = {
    'Security & Auth': securityMatches,
    'Billing & Subscriptions': billingMatches,
    'Technical Support': techMatches
  };
  const highestCategory = Object.entries(categoryScores).sort((a,b) => b[1] - a[1])[0];
  if (highestCategory && highestCategory[1] > 0) {
    category = highestCategory[0];
  }

  let sentiment = 'Neutral 😐';
  if (negMatches > 0 || urgentMatches > 0) sentiment = 'Negative / Frustrated 😡';
  else if (boundedText.includes('thanks') || boundedText.includes('great') || boundedText.includes('love')) sentiment = 'Positive 😊';

  const t1 = performance.now();
  const executionTime = `${(t1 - t0).toFixed(2)} ms`;

  let responseDraft = `Hello,\n\nThank you for reaching out to customer support. We have triaged your inquiry under [${category}] with priority [${priority}].\n\nOur specialized team is investigating your concern and will contact you shortly with an update.\n\nBest regards,\nCustomer Success Team`;

  return {
    priority: sanitizeInput(priority),
    category: sanitizeInput(category),
    sentiment: sanitizeInput(sentiment),
    time: executionTime,
    response: sanitizeInput(responseDraft)
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const ticketInput = document.getElementById('ticketInput');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const sampleBtn = document.getElementById('sampleBtn');

  const priorityResult = document.getElementById('priorityResult');
  const categoryResult = document.getElementById('categoryResult');
  const sentimentResult = document.getElementById('sentimentResult');
  const executionTime = document.getElementById('executionTime');
  const autoResponse = document.getElementById('autoResponse');

  function renderAnalysis() {
    const res = analyzeTicket(ticketInput.value);
    priorityResult.textContent = res.priority;
    categoryResult.textContent = res.category;
    sentimentResult.textContent = res.sentiment;
    executionTime.textContent = res.time;
    autoResponse.textContent = res.response;
  }

  analyzeBtn.addEventListener('click', renderAnalysis);
  sampleBtn.addEventListener('click', () => {
    ticketInput.value = "URGENT: Our production database crashed after the latest billing update. Unauthorized charges were logged and system is slow!";
    renderAnalysis();
  });

  ticketInput.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      renderAnalysis();
    }
  });
});
