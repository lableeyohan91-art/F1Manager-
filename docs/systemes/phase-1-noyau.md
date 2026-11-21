# Phase 1 — Le noyau

> Statut : **PROPOSÉ**. À valider avant le début de la phase 1.
> Objectif : un moteur vide, mais solide, qui fait avancer le temps sur 50 saisons, de façon reproductible, sauvegardable et testée. Aucune règle de jeu à ce stade.

## Contenu

### 1. Projet

- Projet TypeScript + Vite + Vitest, configuration stricte du typage.
- GitHub Actions : à chaque envoi, vérification des types, tests, construction. Publication sur GitHub Pages d'une page minimale (« moteur en construction ») pour valider la chaîne de déploiement.
- Règle automatique qui interdit `Math.random`, `Date`, `window` et `document` dans `src/engine/`.

### 2. Identifiants

- Générateur d'identifiants par type (`per_000001`…), compteur sauvegardé dans le monde.
- Jamais de réutilisation, même après suppression.

### 3. Hasard à graine

- Générateur pseudo-aléatoire rapide et reproductible (de la famille « PCG » ou « xoshiro »), implémenté dans le projet.
- **Flux nommés** : `rng.stream('resultats')`, `rng.stream('marche')`… Chaque flux est dérivé de la graine du monde et de son nom, et son état est sauvegardé.
- Fonctions utilitaires : entier dans un intervalle, tirage pondéré, loi normale, mélange.

### 4. Calendrier et temps

- Date de jeu = (année, semaine 1 à 52).
- Phases de saison : intersaison, présaison, saison, fin de saison, avec leurs dates paramétrables.
- Agenda : rendez-vous datés (« fin du contrat X », « échéance de la promesse Y ») déclenchés à la bonne semaine.

### 5. Boucle de simulation

- `avancer(monde, n semaines)` exécute les systèmes enregistrés dans un ordre fixe.
- Interface commune d'un système : nom, phases où il s'exécute, fonction d'exécution.
- Systèmes de démonstration : un système « vieillissement » minimal et un système « compteur », pour tester la mécanique.

### 6. Journal d'événements

- Ajout d'un événement avec type, acteurs, contexte, visibilité, importance, **causes**.
- Requêtes : par acteur, par type, par période. Remontée de la chaîne de causes.
- Politique de conservation (voir [memoire.md](memoire.md)), implémentée dès maintenant : c'est elle qui garantit la taille des sauvegardes.

### 7. Commandes

- Structure : auteur, date, type, paramètres.
- Chaîne : validation (motif de refus lisible) → application → événements.
- Journal des commandes sauvegardé, pour pouvoir rejouer.
- Commande de démonstration : « renommer une organisation ».

### 8. Sauvegarde

- Sérialisation de l'état (tables + compteurs + état des flux de hasard) → JSON compressé.
- En-tête : version de format, graine, date de jeu.
- Mécanisme de migration, avec une migration factice v1 → v2 pour le tester.
- Stockage IndexedDB (navigateur) et fichier (lanceur sans écran).

### 9. Lanceur sans écran

- `npm run simuler -- --graine 42 --saisons 50` : simule, sauvegarde et affiche un résumé (durée, nombre d'événements, taille de la sauvegarde).
- `npm run rejouer -- partie.sav` : rejoue depuis la graine et le journal des commandes, et compare.

## Critères de validation

| # | Critère | Comment on le vérifie |
| --- | --- | --- |
| 1 | 50 saisons simulées en moins de 5 s sur PC | Lanceur sans écran, durée affichée |
| 2 | Déterminisme : même graine + mêmes commandes = état identique | Test automatique (comparaison d'une empreinte de l'état) |
| 3 | Indépendance des flux de hasard | Test : un tirage de plus dans un flux ne modifie pas les autres |
| 4 | Sauvegarde/reprise transparente | Test : 10 saisons d'un trait = 5 saisons, sauvegarde, rechargement, 5 saisons |
| 5 | Migration testée | Test sur une sauvegarde v1 de référence |
| 6 | Moteur « pur » | Règle automatique dans l'intégration continue |
| 7 | Causes remontables | Test : une chaîne de 3 événements se remonte correctement |
| 8 | Conservation bornée | Test : après 50 saisons de faits mineurs factices, le journal reste sous un plafond |
| 9 | Chaîne de déploiement opérationnelle | Page visible sur GitHub Pages |

## Hors du périmètre

Aucune écurie, aucune personne réelle du jeu, aucune règle sportive, aucune interface autre que la page minimale.

## Décisions nécessaires avant de démarrer

D-024 (ordre des phases), D-028 (pas hebdomadaire), D-034 (accès de ChatGPT), D-035 (dépôt public ou privé).
