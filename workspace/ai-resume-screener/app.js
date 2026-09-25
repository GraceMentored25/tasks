// ⚡ Bolt Performance Optimization:
// Pre-compiled regular expression cache and DocumentFragment batching for high-throughput candidates screening.

const requiredSkillsInput = document.getElementById('required-skills');
const rescreenBtn = document.getElementById('rescreen-btn');
const addSampleBtn = document.getElementById('add-sample-btn');
const candidatesContainer = document.getElementById('candidates-container');

let candidates = [
  {
    id: 1,
    name: "Alex Morgan",
    experience: "6 years experience",
    summary: "Senior Full Stack Engineer proficient in React, Node.js, Python, PostgreSQL, and Docker containerization. Built scalable AI models."
  },
  {
    id: 2,
    name: "Sarah Chen",
    experience: "4 years experience",
    summary: "Frontend Developer specializing in JavaScript, React, CSS, and UI design. Learning Machine Learning and Python."
  },
  {
    id: 3,
    name: "David Kim",
    experience: "8 years experience",
    summary: "Lead AI Engineer experienced with Python, Machine Learning, TensorFlow, PostgreSQL, Docker, Node.js and AI model deployment."
  }
];

// Pre-compiled regex cache map to avoid regex re-creation overhead in loops
const regexCache = new Map();

function getSkillRegex(skill) {
  const cleanSkill = skill.trim().toLowerCase();
  if (!regexCache.has(cleanSkill)) {
    regexCache.set(cleanSkill, new RegExp(`\\b${cleanSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
  }
  return regexCache.get(cleanSkill);
}

function evaluateCandidates() {
  const rawSkills = requiredSkillsInput.value.split(',').map(s => s.trim()).filter(Boolean);

  if (rawSkills.length === 0) {
    candidatesContainer.innerHTML = '<p style="color: var(--text-muted);">Please define required skills to evaluate candidates.</p>';
    return;
  }

  // ⚡ Batch DOM insertion with DocumentFragment
  const fragment = document.createDocumentFragment();

  candidates.forEach(candidate => {
    let matchedCount = 0;
    const skillResults = [];

    rawSkills.forEach(skill => {
      const regex = getSkillRegex(skill);
      const isMatched = regex.test(candidate.summary);
      if (isMatched) matchedCount++;
      skillResults.push({ skill, isMatched });
    });

    const matchScore = Math.round((matchedCount / rawSkills.length) * 100);

    let scoreClass = 'low';
    if (matchScore >= 75) scoreClass = 'high';
    else if (matchScore >= 45) scoreClass = 'medium';

    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.innerHTML = `
      <div class="candidate-header">
        <div>
          <div class="candidate-name">${candidate.name}</div>
          <div class="candidate-experience">${candidate.experience}</div>
        </div>
        <span class="score-badge ${scoreClass}">${matchScore}% Match</span>
      </div>
      <p style="font-size: 0.85rem; color: #475569;">${candidate.summary}</p>
      <div class="skills-found">
        ${skillResults.map(s => `
          <span class="skill-tag ${s.isMatched ? '' : 'missing'}">${s.skill}</span>
        `).join('')}
      </div>
    `;

    fragment.appendChild(card);
  });

  candidatesContainer.innerHTML = '';
  candidatesContainer.appendChild(fragment);
}

rescreenBtn.addEventListener('click', evaluateCandidates);

addSampleBtn.addEventListener('click', () => {
  const sampleNames = ["Elena Rostova", "Marcus Vance", "Jordan Lee"];
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const newCandidate = {
    id: Date.now(),
    name: `${name} (New)`,
    experience: "5 years experience",
    summary: "Software Engineer skilled in JavaScript, React, AI integrations, PostgreSQL, and Node.js backend architecture."
  };
  candidates.push(newCandidate);
  evaluateCandidates();
});

// Initial evaluation
evaluateCandidates();
