# ⚡ AI Copywriter Pro - Studio Marketing High-Performance

## 📋 Référence Offre Commerciale (Malt / Freelance)
- **Titre de la mission**: Développeur / Expert IA - Création d'un générateur de contenus marketing IA multi-canal (LinkedIn, Ads, Email) avec optimisation de tokens et pré-visualisation temps réel.
- **Plateforme**: Malt France
- **Tarif Journalier Moyen (TJM)**: 600 € / jour
- **Fourchette de budget estimée**: 4 500 € - 6 000 € (Projet MVP livré en 8-10 jours)
- **Besoin client**: Une PME marketing cherche un outil web ultra-rapide capable de générer des variantes de copywriting multicanal sans latence, avec prévisualisation des tokens et coûts d'API.

---

## ⚡ Optimisations de Performance (Bolt)
1. **Compilation Mémoïsée**: Utilisation d'un cache `Map` pour stocker les templates générés et éviter les calculs redondants.
2. **Traitement Débouncé**: Pipeline de frappe optimisé (`debounce(100ms)`) garantissant 60 images par seconde sans blocage de saisie.
3. **Estimation de Tokens $O(N)$**: Algorithme de comptage et calcul de coûts ultra-léger sans appel réseau synchrone.
4. **Cache LocalStorage**: Persistance instantanée de l'historique sans rechargement de page.

---

## 🚀 Utilisation
Ouvrir `index.html` dans tout navigateur moderne ou consulter la version déployée sur GitHub Pages.
