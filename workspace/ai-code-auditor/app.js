// Bolt ⚡ Performance Engine for AI Code & Performance Auditor

// Pre-compiled regex patterns for maximum execution speed
const PATTERNS = {
  javascript: [
    {
      id: 'eval-risk',
      severity: 'danger',
      regex: /\beval\s*\(/g,
      title: '🚨 Faille de Sécurité Majeure: Usage de eval()',
      desc: 'eval() permet l\'exécution de code arbitraire non sécurisé.',
      fix: 'Remplacer eval() par un parser JSON strict (JSON.parse) ou une fonction typée.'
    },
    {
      id: 'var-usage',
      severity: 'warning',
      regex: /\bvar\s+\w+/g,
      title: '⚠️ Performance/Scope: Usage de var',
      desc: 'var possède un hoisting global risqué et empêche les optimisations V8.',
      fix: 'Remplacer `var` par `const` ou `let`.'
    },
    {
      id: 'nested-loop',
      severity: 'warning',
      regex: /for\s*\(.*?\)\s*\{[\s\S]*?for\s*\(.*?\)/g,
      title: '⚡ Complexité Algorithmique $O(N^2)$: Boucles Imbriquées',
      desc: 'Boucles imbriquées détectées pouvant impacter les performances sur de grands jeux de données.',
      fix: 'Utiliser un Map / Set pour convertir la recherche en $O(N)$.'
    },
    {
      id: 'inner-html',
      severity: 'danger',
      regex: /\.innerHTML\s*=/g,
      title: '🚨 Faille XSS Potentielle: Usage de innerHTML',
      desc: 'Injecter du HTML directement peut exposer votre application aux attaques Cross-Site Scripting.',
      fix: 'Utiliser `textContent` ou `createElement()` avec `appendChild()`.'
    }
  ],
  python: [
    {
      id: 'exec-risk',
      severity: 'danger',
      regex: /\bexec\s*\(/g,
      title: '🚨 Risque d\'injection de code: exec()',
      desc: 'Exécution dynamique de code Python non assaini.',
      fix: 'Éviter exec() et utiliser des fonctions natives.'
    },
    {
      id: 'wildcard-import',
      severity: 'warning',
      regex: /from\s+\w+\s+import\s+\*/g,
      title: '⚠️ Pollution de l\'espace de nommage: Import *',
      desc: 'Empêche l\'optimisation de la mémoire et la clarté des dépendances.',
      fix: 'Importer uniquement les modules explicites.'
    }
  ],
  sql: [
    {
      id: 'sql-concat',
      severity: 'danger',
      regex: /SELECT\s+.*?\s+WHERE\s+.*?=\s*'\s*\+/gi,
      title: '🚨 Faille de Sécurité: Concaténation SQL (SQL Injection)',
      desc: 'Requête SQL construite par string concatenation sans requêtes préparées.',
      fix: 'Utiliser des requêtes préparées avec paramètres nommés (?)'
    },
    {
      id: 'select-star',
      severity: 'warning',
      regex: /SELECT\s+\*\s+FROM/gi,
      title: '⚡ Goulot d\'étranglement I/O: SELECT *',
      desc: 'Charge inutilement l\'ensemble des colonnes en mémoire.',
      fix: 'Lister explicitement uniquement les colonnes requises.'
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const languageSelect = document.getElementById('language-select');
  const lineCountEl = document.getElementById('line-count');
  const scanTimeEl = document.getElementById('scan-time');
  const healthScoreEl = document.getElementById('health-score');
  const auditBtn = document.getElementById('audit-btn');
  const issuesContainer = document.getElementById('issues-container');
  const refactoredCode = document.getElementById('refactored-code');
  const copyRefactorBtn = document.getElementById('copy-refactor-btn');

  // Sample buggy code for demonstration
  codeInput.value = `// Exemple de code JS avec failles et soucis de perf
var users = ["Alice", "Bob", "Charlie"];

function processData(userInput) {
  // Faille XSS et eval
  document.getElementById("output").innerHTML = "<h1>Welcome</h1>";
  eval(userInput);

  // Boucle O(N^2)
  for (var i = 0; i < users.length; i++) {
    for (var j = 0; j < users.length; j++) {
      console.log(users[i], users[j]);
    }
  }
}`;

  // Zero-allocation line counting algorithm to prevent GC pressure during live typing
  function countLines(str) {
    if (!str) return 0;
    let count = 1;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) === 10) count++;
    }
    return count;
  }

  lineCountEl.textContent = countLines(codeInput.value);

  codeInput.addEventListener('input', () => {
    lineCountEl.textContent = countLines(codeInput.value);
  });

  auditBtn.addEventListener('click', () => {
    const code = codeInput.value;
    const lang = languageSelect.value;
    const rules = PATTERNS[lang] || PATTERNS.javascript;

    const t0 = performance.now();

    let issues = [];
    let healthScore = 100;
    let refactored = code;

    // Single pass scan using precompiled regex
    rules.forEach(rule => {
      rule.regex.lastIndex = 0;
      if (rule.regex.test(code)) {
        issues.push(rule);
        if (rule.severity === 'danger') healthScore -= 30;
        if (rule.severity === 'warning') healthScore -= 15;
      }
    });

    healthScore = Math.max(0, healthScore);

    // Render Issues via DocumentFragment for batch DOM insertion
    const fragment = document.createDocumentFragment();
    if (issues.length === 0) {
      const okDiv = document.createElement('div');
      okDiv.className = 'issue-card info';
      okDiv.innerHTML = '<div class="issue-title">✅ Aucun problème détecté !</div><div>Votre code respecte les meilleures pratiques de sécurité et performance.</div>';
      fragment.appendChild(okDiv);
    } else {
      issues.forEach(issue => {
        const div = document.createElement('div');
        div.className = `issue-card ${issue.severity}`;
        div.innerHTML = `
          <div class="issue-title">${issue.title}</div>
          <div>${issue.desc}</div>
          <div style="margin-top: 0.3rem; color: #a371f7;">💡 Correction: ${issue.fix}</div>
        `;
        fragment.appendChild(div);
      });
    }

    issuesContainer.innerHTML = '';
    issuesContainer.appendChild(fragment);

    // Perform instant smart refactoring
    if (lang === 'javascript') {
      refactored = refactored
        .replace(/\bvar\b/g, 'const')
        .replace(/\.innerHTML\s*=/g, '.textContent =')
        .replace(/\beval\((.*?)\)/g, 'JSON.parse($1)');
    } else if (lang === 'sql') {
      refactored = refactored.replace(/SELECT\s+\*\s+FROM/gi, 'SELECT id, name, created_at FROM');
    }

    refactoredCode.textContent = refactored;

    const t1 = performance.now();
    scanTimeEl.textContent = `${(t1 - t0).toFixed(1)} ms ⚡`;

    healthScoreEl.textContent = `${healthScore} / 100`;
    if (healthScore > 80) {
      healthScoreEl.className = 'stat-val score-good';
    } else if (healthScore > 50) {
      healthScoreEl.className = 'stat-val score-warn';
    } else {
      healthScoreEl.className = 'stat-val score-bad';
    }
  });

  copyRefactorBtn.addEventListener('click', () => {
    if (refactoredCode.textContent) {
      navigator.clipboard.writeText(refactoredCode.textContent);
      copyRefactorBtn.textContent = '✅ Copié !';
      setTimeout(() => { copyRefactorBtn.textContent = '📋 Copier'; }, 1500);
    }
  });
});
