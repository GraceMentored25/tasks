// Bolt ⚡ Optimization: O(1) keyword index matching with Set
document.addEventListener('DOMContentLoaded', () => {
  const jobDescInput = document.getElementById('job-desc');
  const userResumeInput = document.getElementById('user-resume');
  const atsScoreValue = document.getElementById('ats-score-value');
  const atsProgress = document.getElementById('ats-progress');
  const missingKeywordsContainer = document.getElementById('missing-keywords');
  const btnOptimize = document.getElementById('btn-optimize-bullets');
  const btnCover = document.getElementById('btn-gen-cover');
  const aiOutput = document.getElementById('ai-output');

  // Pre-compiled list of key tech & soft skill tokens for fast extraction
  const TECH_KEYWORDS = new Set([
    'react', 'vue', 'angular', 'node', 'express', 'typescript', 'javascript',
    'python', 'docker', 'kubernetes', 'aws', 'ci/cd', 'rag', 'llm', 'ai',
    'rest', 'graphql', 'mongodb', 'postgresql', 'agile', 'scrum', 'leadership'
  ]);

  function calculateAtsScore() {
    const jobText = (jobDescInput.value || '').toLowerCase();
    const resumeText = (userResumeInput.value || '').toLowerCase();

    if (!jobText.trim()) {
      atsScoreValue.textContent = '0%';
      atsProgress.style.width = '0%';
      missingKeywordsContainer.innerHTML = '';
      return;
    }

    // Bolt Performance Note: Using Set O(1) membership check instead of nested loops
    const jobWords = new Set(jobText.match(/\b[a-z]{2,}\b/g) || []);
    const resumeWords = new Set(resumeText.match(/\b[a-z]{2,}\b/g) || []);

    const extractedJobKeywords = Array.from(jobWords).filter(word => TECH_KEYWORDS.has(word));
    if (extractedJobKeywords.length === 0) {
      atsScoreValue.textContent = 'N/A';
      atsProgress.style.width = '0%';
      return;
    }

    let matchedCount = 0;
    const missing = [];

    for (const keyword of extractedJobKeywords) {
      if (resumeWords.has(keyword)) {
        matchedCount++;
      } else {
        missing.push(keyword);
      }
    }

    const percentage = Math.round((matchedCount / extractedJobKeywords.length) * 100);
    atsScoreValue.textContent = `${percentage}%`;
    atsProgress.style.width = `${percentage}%`;

    missingKeywordsContainer.innerHTML = extractedJobKeywords.map(kw => {
      const isMissing = !resumeWords.has(kw);
      return `<span class="tag ${isMissing ? 'missing' : ''}">${isMissing ? '❌' : '✅'} ${kw}</span>`;
    }).join('');
  }

  jobDescInput.addEventListener('input', calculateAtsScore);
  userResumeInput.addEventListener('input', calculateAtsScore);

  btnOptimize.addEventListener('click', () => {
    const resume = userResumeInput.value || 'Aucune expérience fournie';
    aiOutput.textContent = `🚀 [Optimisation IA] Puces Améliorées :\n\n• Conception et déploiement d'architectures scalables augmentant la vitesse de chargement de +40%.\n• Mise en place de pipelines CI/CD automatisés réduisant le temps de release de 2h à 10min.\n• Lead technique sur l'intégration de fonctionnalités IA/LLM avec suivi de performance en temps réel.\n\n(Basé sur votre profil: "${resume.slice(0, 40)}...")`;
  });

  btnCover.addEventListener('click', () => {
    const title = document.getElementById('job-title').value || 'Poste Cible';
    aiOutput.textContent = `✉️ [Lettre de Motivation IA Générée]\n\nMadame, Monsieur,\n\nC'est avec un grand enthousiasme que je vous adresse ma candidature pour le poste de ${title}.\n\nFort d'une solide expérience dans le développement logiciel et l'intégration de solutions innovantes, j'ai développé des compétences clés qui correspondent parfaitement aux exigences de votre entreprise.\n\nDisponible immédiatement, je serais ravi de vous présenter mon parcours lors d'un entretien.\n\nCordialement,\nVotre Candidat IA`;
  });
});
