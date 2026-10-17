// Performance-optimized Copilot Engine with Debounce and Memoized Caching
(function() {
  const ticketInput = document.getElementById('ticketInput');
  const suggestionsList = document.getElementById('suggestionsList');
  const intentTag = document.getElementById('intentTag');
  const sentimentTag = document.getElementById('sentimentTag');
  const latencyTag = document.getElementById('latencyTag');

  // In-memory response cache to avoid duplicate CPU work
  const responseCache = new Map();

  // Knowledge base intent rules
  const KNOWLEDGE_BASE = [
    {
      keywords: ['charged', 'refund', 'double', 'payment', 'billing', 'invoice'],
      intent: 'Billing / Refund',
      sentiment: 'Negative 😠',
      templates: [
        { text: "Hello! I deeply apologize for the double billing. I have reviewed your invoice and initiated a full refund of the duplicate charge. It will reflect in 3-5 business days.", confidence: "98%" },
        { text: "Hi there, I can immediately verify your payment history. Could you please confirm the last 4 digits of the payment method used?", confidence: "89%" }
      ]
    },
    {
      keywords: ['password', 'login', 'access', 'reset', 'account', 'sign in'],
      intent: 'Account Access',
      sentiment: 'Neutral 😐',
      templates: [
        { text: "Hello! You can reset your password instantly by clicking 'Forgot Password' on the login screen, or I can send a secure reset link directly to your registered email.", confidence: "96%" },
        { text: "Hi, I can help restore access to your account. Please verify your account email address.", confidence: "91%" }
      ]
    },
    {
      keywords: ['feature', 'api', 'docs', 'integration', 'export', 'setup'],
      intent: 'Technical Support',
      sentiment: 'Inquisitive 🤔',
      templates: [
        { text: "Hello! Our API integration guide and SDK documentation can be found directly at docs.example.com. Let me know if you need code snippets for your stack!", confidence: "94%" },
        { text: "Hi, our system supports Webhooks and REST endpoints for custom exports. I'd be happy to guide you through the setup.", confidence: "88%" }
      ]
    }
  ];

  // Debounce utility to prevent UI blocking during fast keypresses
  function debounce(fn, delayMs) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delayMs);
    };
  }

  function analyzeAndSuggest(text) {
    const startTime = performance.now();
    const cleanText = text.trim().toLowerCase();

    if (!cleanText) {
      intentTag.textContent = '--';
      sentimentTag.textContent = '--';
      latencyTag.textContent = '0ms';
      suggestionsList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem;">Start typing a customer query to receive real-time AI copilot suggestions...</div>';
      return;
    }

    // Check cache
    if (responseCache.has(cleanText)) {
      const cached = responseCache.get(cleanText);
      renderResults(cached.intent, cached.sentiment, cached.templates, performance.now() - startTime);
      return;
    }

    // Find match in Knowledge Base
    let bestMatch = KNOWLEDGE_BASE[0];
    let maxHits = 0;

    for (const item of KNOWLEDGE_BASE) {
      let hits = 0;
      for (const kw of item.keywords) {
        if (cleanText.includes(kw)) hits++;
      }
      if (hits > maxHits) {
        maxHits = hits;
        bestMatch = item;
      }
    }

    // Fallback if no explicit keywords matched
    if (maxHits === 0) {
      bestMatch = {
        intent: 'General Inquiry',
        sentiment: 'Neutral 😐',
        templates: [
          { text: "Thank you for reaching out! I've logged your request with our senior support team and will update you shortly.", confidence: "75%" }
        ]
      };
    }

    const elapsed = performance.now() - startTime;
    responseCache.set(cleanText, bestMatch);
    renderResults(bestMatch.intent, bestMatch.sentiment, bestMatch.templates, elapsed);
  }

  // Efficient DOM update using DocumentFragment
  function renderResults(intent, sentiment, templates, latencyMs) {
    intentTag.textContent = intent;
    sentimentTag.textContent = sentiment;
    latencyTag.textContent = `${latencyMs.toFixed(1)}ms`;

    const fragment = document.createDocumentFragment();

    templates.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'suggestion-card';
      card.innerHTML = `
        <span class="confidence">Match: ${tpl.confidence}</span>
        <p style="font-size:0.9rem; margin-top:4px;">${tpl.text}</p>
        <button class="btn" style="margin-top:8px; font-size:0.75rem; padding:4px 8px;" onclick="navigator.clipboard.writeText('${tpl.text.replace(/'/g, "\\'")}')">📋 Copy Response</button>
      `;
      fragment.appendChild(card);
    });

    suggestionsList.innerHTML = '';
    suggestionsList.appendChild(fragment);
  }

  ticketInput.addEventListener('input', debounce((e) => {
    analyzeAndSuggest(e.target.value);
  }, 250));
})();
