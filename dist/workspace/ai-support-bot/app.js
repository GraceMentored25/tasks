// Performance optimization by Bolt ⚡: Cache simulated LLM query results & debounce user filtering
const responseCache = new Map();
const messages = [];

// Debounce helper to prevent excessive DOM filtering operations
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const chatHistoryEl = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const filterInput = document.getElementById('filter-input');
const langSelect = document.getElementById('lang-select');

function renderMessages(filterText = '') {
  const fragment = document.createDocumentFragment();
  const lowerFilter = filterText.toLowerCase();

  messages.forEach(msg => {
    if (filterText && !msg.text.toLowerCase().includes(lowerFilter)) {
      return;
    }
    const div = document.createElement('div');
    div.className = `message ${msg.sender}`;
    div.textContent = msg.text;
    fragment.appendChild(div);
  });

  chatHistoryEl.innerHTML = '';
  chatHistoryEl.appendChild(fragment);
  chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
}

function getAiResponse(question, lang) {
  const cacheKey = `${lang}:${question.trim().toLowerCase()}`;

  // Bolt Optimization: Instant lookup if query answered previously
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  const responses = {
    fr: [
      "Merci pour votre message. Notre agent IA analyse votre demande.",
      "Votre ticket d'assistance a été automatiquement indexé.",
      "Une solution rapide est disponible dans notre centre d'aide."
    ],
    en: [
      "Thank you for your message. Our AI agent is analyzing your query.",
      "Your support ticket has been indexed automatically.",
      "A quick solution is available in our help center."
    ],
    es: [
      "Gracias por su mensaje. Nuestro agente IA está analizando su solicitud.",
      "Su ticket de soporte se ha indexado automáticamente.",
      "Una solución rápida está disponible en nuestro centro de ayuda."
    ]
  };

  const pool = responses[lang] || responses.fr;
  const reply = pool[Math.floor(Math.random() * pool.length)] + ` [Query: "${question}"]`;

  // Cache response
  responseCache.set(cacheKey, reply);
  return reply;
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  messages.push({ sender: 'user', text });
  renderMessages(filterInput.value);
  userInput.value = '';

  setTimeout(() => {
    const lang = langSelect.value;
    const aiReply = getAiResponse(text, lang);
    messages.push({ sender: 'bot', text: aiReply });
    renderMessages(filterInput.value);
  }, 200);
});

// Apply 300ms debounce on filter search to protect performance during fast typing
filterInput.addEventListener('input', debounce((e) => {
  renderMessages(e.target.value);
}, 300));
