# AI Customer Support Copilot MVP

## 🎯 Commercial Job Reference & Budget
- **Platform Reference:** Malt (Mission Freelance: *Développement d'un Copilote IA pour le Support Client & Service Après-Vente*)
- **Target Budget Range:** €1,500 - €3,500
- **Average Freelance TJM:** ~600€ / jour

---

## ⚡ Performance Features & Architecture
- **O(1) Direct Map Lookup:** Template auto-complete suggestions use pre-indexed HashMap lookups instead of scanning response lists.
- **Debounced Input Search:** Query handlers debounce search inputs (150ms) to avoid CPU thrashing on rapid keypresses.
- **Single-Pass Tag Matching:** Automated category routing is performed in a single string regex pass.

---

## 🚀 How to Run
Open `index.html` in any web browser or deploy as a static webapp.
