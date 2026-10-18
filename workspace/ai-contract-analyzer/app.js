// Fast single-pass regex contract parsing strategy (O(N))
function analyzeContractText(text) {
  const startTime = performance.now();
  if (!text || text.trim().length === 0) {
    return {
      score: "Indéterminé",
      scoreClass: "risk-medium",
      findings: ["Veuillez saisir ou coller un texte de contrat valablement formé."],
      executionTime: (performance.now() - startTime).toFixed(2)
    };
  }

  const findings = [];
  let highRiskCount = 0;
  let mediumRiskCount = 0;

  const rules = [
    { regex: /responsabilit[eé]\s+illimit[eé]e/i, risk: "high", msg: "Responsabilité illimitée détectée (Risque Majeur)." },
    { regex: /r[eé]siliation\s+sans\s+pr[eé]avis/i, risk: "high", msg: "Clause de résiliation sans préavis défavorable." },
    { regex: /propri[eé]t[eé]\s+exclusive/i, risk: "medium", msg: "Transfert exclusif de propriété intellectuelle à vérifier." },
    { regex: /penalit[eé]s?\s+de\s+retard/i, risk: "medium", msg: "Pénalités de retard applicables." },
    { regex: /juridiction\s+étrang[eè]re/i, risk: "high", msg: "Attribution de juridiction à un tribunal étranger." }
  ];

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule.regex.test(text)) {
      findings.push(rule.msg);
      if (rule.risk === "high") highRiskCount++;
      if (rule.risk === "medium") mediumRiskCount++;
    }
  }

  if (findings.length === 0) {
    findings.push("Aucune clause critique détectée selon les règles standard.");
  }

  let score = "Faible";
  let scoreClass = "risk-low";

  if (highRiskCount > 0) {
    score = "Élevé";
    scoreClass = "risk-high";
  } else if (mediumRiskCount > 0) {
    score = "Modéré";
    scoreClass = "risk-medium";
  }

  return {
    score,
    scoreClass,
    findings,
    executionTime: (performance.now() - startTime).toFixed(2)
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('contract-input');
  const btnEl = document.getElementById('analyze-btn');
  const outputCard = document.getElementById('output-card');
  const scoreEl = document.getElementById('risk-score');
  const listEl = document.getElementById('clauses-list');
  const perfEl = document.getElementById('perf-metrics');

  if (btnEl && inputEl) {
    btnEl.addEventListener('click', () => {
      const result = analyzeContractText(inputEl.value);
      outputCard.style.display = 'block';
      scoreEl.textContent = result.score;
      scoreEl.className = result.scoreClass;

      // Batch DOM update with Fragment to avoid reflow overhead
      const fragment = document.createDocumentFragment();
      result.findings.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        fragment.appendChild(li);
      });

      listEl.innerHTML = '';
      listEl.appendChild(fragment);

      perfEl.textContent = `Temps de traitement: ${result.executionTime} ms (Analyse Regex O(N))`;
    });
  }
});
