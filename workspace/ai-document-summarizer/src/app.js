/**
 * AI Legal & Contract Summarizer Engine
 * Performance-optimized single-pass regex parser & clause cache
 */

const SAMPLE_MSA = `MASTER SERVICES AGREEMENT

1. PAYMENT TERMS: Client shall pay all invoiced amounts within 30 days of receipt. Late payments shall accrue interest at 1.5% per month.

2. LIMITATION OF LIABILITY: Neither party shall be liable for indirect, incidental, or consequential damages. Maximum aggregate liability under this agreement shall not exceed $500,000 or total fees paid in the preceding 12 months.

3. TERMINATION: Either party may terminate this Agreement without cause upon providing 60 days written notice. In event of material breach, termination is immediate upon notice.

4. NON-COMPETE & CONFIDENTIALITY: Contractor agrees not to solicit Client's software engineers or key employees for a period of 12 months following termination of services. Confidential Information must be protected using reasonable commercial care.`;

// Clause cache to eliminate redundant regex parsing (Bolt Optimization)
const parseCache = new Map();

// DOM Elements
const docInputEl = document.getElementById('doc-input');
const btnLoadSample = document.getElementById('btn-load-sample');
const btnAnalyze = document.getElementById('btn-analyze');
const clausesContainerEl = document.getElementById('clauses-container');
const riskScoreEl = document.getElementById('risk-score');
const parsingSpeedEl = document.getElementById('parsing-speed');

/**
 * Single-pass regex parser for fast clause extraction
 */
function analyzeDocument(text) {
  if (parseCache.has(text)) {
    return parseCache.get(text);
  }

  const clauses = [];
  let overallRisk = "LOW";

  // Fast pattern definitions
  const patterns = [
    { type: "Payment Terms", regex: /PAYMENT TERMS:?([^\n]+)/i, risk: "Low" },
    { type: "Limitation of Liability", regex: /LIMITATION OF LIABILITY:?([^\n]+)/i, risk: "Medium" },
    { type: "Termination Clause", regex: /TERMINATION:?([^\n]+)/i, risk: "Low" },
    { type: "Non-Compete / Restrictive", regex: /NON-COMPETE[^\n]+/i, risk: "High" }
  ];

  patterns.forEach(p => {
    const match = text.match(p.regex);
    if (match) {
      clauses.push({
        title: p.type,
        snippet: match[0].trim(),
        risk: p.risk
      });
      if (p.risk === "High") overallRisk = "HIGH RISK";
      else if (p.risk === "Medium" && overallRisk !== "HIGH RISK") overallRisk = "MEDIUM RISK";
    }
  });

  const result = { clauses, overallRisk };
  parseCache.set(text, result);
  return result;
}

/**
 * Render analysis results to DOM
 */
function runAnalysis() {
  const t0 = performance.now();
  const text = docInputEl.value.trim();

  if (!text) {
    clausesContainerEl.innerHTML = `<div class="text-sm text-slate-500 italic p-4 text-center">Please enter contract text to analyze.</div>`;
    riskScoreEl.className = "text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-bold";
    riskScoreEl.textContent = "Unanalyzed";
    parsingSpeedEl.classList.add('hidden');
    return;
  }

  const { clauses, overallRisk } = analyzeDocument(text);
  const t1 = performance.now();

  // Render risk badge
  riskScoreEl.textContent = overallRisk;
  if (overallRisk === "HIGH RISK") {
    riskScoreEl.className = "text-xs bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded-full font-bold";
  } else if (overallRisk === "MEDIUM RISK") {
    riskScoreEl.className = "text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-1 rounded-full font-bold";
  } else {
    riskScoreEl.className = "text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full font-bold";
  }

  // Render clause cards using document fragment (Bolt Optimization)
  const fragment = document.createDocumentFragment();

  if (clauses.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = "text-sm text-slate-400 p-4 text-center";
    emptyMsg.textContent = "Analysis complete: No standard liability/payment/non-compete clauses detected.";
    fragment.appendChild(emptyMsg);
  } else {
    clauses.forEach(c => {
      const card = document.createElement('div');
      card.className = "p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5";
      card.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-amber-300">${c.title}</span>
          <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
            c.risk === 'High' ? 'bg-red-900/60 text-red-300' :
            c.risk === 'Medium' ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-900/60 text-emerald-300'
          }">${c.risk} Risk</span>
        </div>
        <p class="text-xs text-slate-300 font-mono bg-slate-950/60 p-2 rounded border border-slate-800/80">${c.snippet}</p>
      `;
      fragment.appendChild(card);
    });
  }

  clausesContainerEl.innerHTML = '';
  clausesContainerEl.appendChild(fragment);

  parsingSpeedEl.textContent = `Parsed in ${(t1 - t0).toFixed(2)}ms`;
  parsingSpeedEl.classList.remove('hidden');
}

// Event Listeners
btnLoadSample.addEventListener('click', () => {
  docInputEl.value = SAMPLE_MSA;
  runAnalysis();
});

btnAnalyze.addEventListener('click', runAnalysis);
