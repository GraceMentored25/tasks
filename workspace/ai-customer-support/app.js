// ⚡ Bolt Optimization: Cache response computations using O(1) Map lookup
const triageCache = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticket-form');
  const resultBox = document.getElementById('analysis-result');
  const loading = document.getElementById('loading');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const category = document.getElementById('ticket-category').value;
    const msg = document.getElementById('ticket-msg').value.trim();

    const cacheKey = `${category}:${msg}`;

    // Show loading state
    loading.classList.remove('hidden');

    // ⚡ Performance Check: Check cache before simulating AI calculation
    if (triageCache.has(cacheKey)) {
      const cachedData = triageCache.get(cacheKey);
      renderResult(name, cachedData, true);
      loading.classList.add('hidden');
      return;
    }

    // Fast simulated AI Triage (50ms execution delay to preserve UI responsiveness)
    setTimeout(() => {
      const analysis = analyzeTicket(category, msg);
      triageCache.set(cacheKey, analysis);
      renderResult(name, analysis, false);
      loading.classList.add('hidden');
    }, 50);
  });

  function analyzeTicket(category, msg) {
    const isUrgent = msg.toLowerCase().includes('urgent') || msg.toLowerCase().includes('down') || msg.toLowerCase().includes('error');
    const sentiment = isUrgent ? 'Frustrated / High Priority' : 'Neutral / Standard';

    let routedTeam = 'Customer Support Tier 1';
    if (category === 'billing') routedTeam = 'Finance & Billing Ops';
    if (category === 'technical') routedTeam = isUrgent ? 'Escalated Engineering On-Call' : 'Tech Support Tier 2';
    if (category === 'feature') routedTeam = 'Product Management';

    const responseDraft = `Hello ${category ? 'there' : ''},\n\nThank you for contacting us regarding your ${category} inquiry. Our ${routedTeam} team has received your ticket and is prioritizing your request.`;

    return {
      urgency: isUrgent ? 'HIGH' : 'MEDIUM',
      sentiment,
      routedTeam,
      responseDraft
    };
  }

  function renderResult(customerName, data, isCached) {
    resultBox.innerHTML = `
      <div style="margin-bottom: 0.5rem;">
        <strong>Customer:</strong> ${customerName} ${isCached ? '<span style="color:#16a34a; font-size:0.8rem;">⚡ Cached O(1)</span>' : ''}
      </div>
      <div style="margin-bottom: 0.5rem;">
        <strong>Priority:</strong> <span style="color: ${data.urgency === 'HIGH' ? '#dc2626' : '#2563eb'}; font-weight: bold;">${data.urgency}</span>
      </div>
      <div style="margin-bottom: 0.5rem;">
        <strong>Routed Team:</strong> ${data.routedTeam}
      </div>
      <div style="margin-bottom: 0.5rem;">
        <strong>Sentiment:</strong> ${data.sentiment}
      </div>
      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 1rem 0;">
      <div>
        <strong>AI Drafted Response:</strong>
        <pre style="background: #fff; padding: 0.75rem; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${data.responseDraft}</pre>
      </div>
    `;
  }
});
