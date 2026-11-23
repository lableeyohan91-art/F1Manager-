# Règles du projet

Ce fichier est relu au début de chaque session de Claude Code. Il prime sur les habitudes par défaut.

## Langue et communication

- Tout est rédigé en français : documentation, messages de commit, commentaires du code, textes du jeu.
- Le porteur du projet n'est pas développeur. Il faut des explications claires et concrètes, et lui dire franchement quand une idée pose problème.
- Avant de répondre, poser des questions s'il manque des éléments, plutôt que de deviner.

## Rôles

- Claude Code est le seul à écrire le code du dépôt. ChatGPT peut proposer du code dans `docs/echanges/` : Claude Code l'intègre ou le critique.
- Le porteur du projet tranche. Aucune décision structurante n'est prise sans lui.

## Processus pour chaque système

1. Fiche d'intention (porteur + ChatGPT).
2. Conception technique dans `docs/systemes/` (Claude Code), avec critique.
3. Validation par le porteur, inscrite dans `docs/decisions.md`.
4. Implémentation + tests + simulation de contrôle + rapport dans `docs/rapports/`.
5. Relecture (porteur + ChatGPT), puis corrections.

**Jamais de code pour un système dont la conception n'est pas validée.**

## Mémoire du projet

- Toute décision importante est inscrite dans `docs/decisions.md` : date, décision, raison, statut (VALIDÉE / À DISCUTER / ABANDONNÉE).
- Ne jamais rouvrir une décision VALIDÉE sans le signaler explicitement comme une remise en cause.
- Mettre à jour `CHANGELOG.md` à chaque livraison.
- Un terme du glossaire (`docs/glossaire.md`) a un seul sens. Un terme nouveau doit y être ajouté.

## Règles techniques non négociables (dès la phase 1)

- Le moteur (`src/engine/`) n'importe jamais rien de l'interface, ni du navigateur (pas de `window`, pas de `document`).
- Le moteur n'utilise jamais `Math.random`, `Date.now`, `new Date()` ni d'autre source non déterministe. Le hasard passe par le générateur à graine, avec un flux séparé par système.
- Toute modification de l'état passe par une commande ou par un système du moteur. Toute modification significative produit un événement, avec ses causes.
- Le joueur et l'IA utilisent les mêmes commandes, validées par les mêmes règles.
- Tous les coefficients d'équilibrage sont rangés dans `src/engine/balance/` : nommés, commentés, avec leur unité. Pas de nombre « magique » dans le code.
- Un attribut qui n'est lu par aucune formule n'existe pas. Chaque attribut est référencé dans sa fiche système, avec la liste des systèmes qui le lisent.
- Les volumes sont bornés : souvenirs par personne, événements détaillés conservés, etc. (voir `docs/systemes/memoire.md`).
- Les sauvegardes portent un numéro de version. Toute évolution de format s'accompagne d'une migration et d'un test.
- Aucun nom réel **exact** d'écurie, de pilote, de circuit ni de marque. La grille de départ s'inspire de la F1 2026 avec des noms altérés (D-042), qui ne figurent que dans les fichiers de données, jamais dans le code. Personnalités des personnages inspirés de personnes réelles : toujours fictives. Leurs relations : fictives, sauf les rivalités et histoires **publiquement connues**, saisies dans les données (`histoires.csv`, D-143), jamais dans le code. Publication du jeu de données réel : voir D-043.

## Équilibrage (D-076)

- Toute modification d'équilibrage s'accompagne d'un rapport complet, avec une comparaison dans des conditions identiques (mêmes graines, mêmes mécaniques) à la référence précédente, qui est conservée.
- Les indicateurs défavorables sont présentés autant que les favorables. Un tableau soumis pour décision contient **tous** les indicateurs suivis, pas une sélection.
- Les objectifs non atteints sont signalés explicitement. Le provisoire est distingué du définitif.
- Claude Code critique aussi les propositions de ChatGPT ; le porteur a le dernier mot.
- Aucun bonus caché pour l'IA, aucun équilibrage artificiel des résultats. **Exception décidée par le porteur** : l'usure du succès (D-140), assumée et documentée.
- **D-120** : jusqu'aux phases 12 et 13, les mesures sont **indicatives** ; rapport court après chaque phase, sans analyse approfondie.
- **Méthode D-095** : après chaque phase, on vérifie, on corrige les bugs, on **mesure et documente** les déséquilibres et les mécaniques futures susceptibles de les résoudre, sans recalibrage prématuré. Grandes campagnes d'équilibrage après les phases 8, 12 et 13.

## Git

- Messages de commit en français, à l'impératif, avec un résumé court (« Ajoute le glossaire »).
- Ne pas pousser de secrets. Pas de dépendance ajoutée sans la justifier dans `docs/decisions.md`.
