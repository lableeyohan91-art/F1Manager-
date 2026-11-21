# Feuille de route

> Mise à jour le 21/11/2026 pour intégrer les demandes de la validation : mémoire plus tôt, groupes sociaux, valeurs, simulation historique, interface de diagnostic et bac à sable.
> Statut : ordre des phases **PROPOSÉ**, à valider (décision D-024).

Règle : une phase est terminée quand **tous** ses critères de validation sont atteints et que le porteur du projet l'a validée. Pas de durée fixée, car elle dépend du temps disponible.

## Vue d'ensemble

| Phase | Nom | Résultat visible |
| --- | --- | --- |
| 0 | Cadrage | Documentation complète, décisions tracées |
| 1 | Noyau | Un moteur vide qui tourne 50 saisons, reproductible |
| 2 | Monde + diagnostic v0 | Un paddock fictif généré, consultable dans une page de diagnostic |
| 3 | Saison abstraite | Classements, points et primes sur 10 saisons |
| 4 | Contrats + mémoire v1 + bac à sable | Négocier, promettre, se souvenir ; premières interactions testables à la main |
| 5 | Économie | Sponsors, conseil d'administration, plafond budgétaire, installations |
| 6 | Cycle de vie | Vieillissement, progression, retraites, nouvelles générations |
| 7 | Marché du travail + IA des écuries + agents | Recrutement actif, débauchage, décisions de l'IA |
| 8 | Mémoire v2 + groupes sociaux + politique | Circulation de l'information, réputation, groupes émergents, votes du règlement |
| 9 | Simulation historique | Démarrage dans un paddock qui a N années d'histoire |
| **A** | **Jalon A** | **10 saisons observées après un historique, chronique lisible, rapport de diagnostic** |
| 10 | Le joueur | Prendre la tête d'une écurie, premiers écrans mobiles |
| 11 | Médias et archives | Actualités, rumeurs, records, chronologie |
| 12 | Monoplaces | Recherche, conception, fabrication, expertise, erreurs de concept |
| 13 | Courses en 2D | Moteur de course qui remplace le modèle abstrait (reprise des modèles pneus/essence/météo de Paddock) |
| 14 | Carrière du manager | Offres d'emploi, licenciement, changement d'écurie, héritage |

### Ce qui a changé par rapport à la proposition initiale

- **Mémoire v1 avancée en phase 4** (au lieu de 7), en même temps que les premiers contrats. Elle comprend les événements, les souvenirs, la mémoire résiduelle, les promesses, la confiance et la reconnaissance.
- **Diagnostic v0 dès la phase 2**, puis enrichi à chaque phase.
- **Bac à sable d'interactions en phase 4** : déclencher à la main une négociation, une promesse ou un refus, et observer la réaction et son « Pourquoi ? ».
- **Valeurs et convictions** intégrées au modèle de personnage dès la phase 2, et utilisées dans les décisions dès la phase 4.
- **Groupes sociaux** en phase 8, une fois qu'il existe assez de relations pour qu'ils émergent.
- **Simulation historique** en phase 9. Elle réutilise le moteur complet : elle ne peut pas venir avant les systèmes qu'elle fait tourner.

## Détail des phases 0 à 3

Fiches techniques détaillées : [phase 1](docs/systemes/phase-1-noyau.md), [phase 2](docs/systemes/phase-2-monde.md), [phase 3](docs/systemes/phase-3-saison.md).

### Phase 0 — Cadrage

Contenu : structure documentaire, glossaire, principes, architecture, entités, première structure des personnalités, détail des phases 1 à 3, journal des décisions, rapport pour ChatGPT.

Critères de validation :
- [ ] Tous les documents listés dans le README existent et sont relus par le porteur.
- [ ] Chaque décision est classée VALIDÉE ou À DISCUTER dans `docs/decisions.md`.
- [ ] Les décisions bloquantes pour la phase 1 sont tranchées (voir le rapport de phase 0).
- [ ] Le rapport de phase 0 a été relu par ChatGPT et ses remarques ont été traitées.

### Phase 1 — Noyau

Contenu : projet TypeScript/Vite, identifiants, générateur à graine avec flux séparés, calendrier, boucle hebdomadaire, journal d'événements avec causes, commandes, sauvegarde versionnée, lanceur sans écran, tests automatiques, intégration continue (GitHub Actions).

Critères de validation :
- [ ] 50 saisons « vides » simulées en moins de 5 secondes sur PC.
- [ ] Même graine + mêmes commandes = état final identique, octet pour octet (test automatique).
- [ ] Changer le tirage d'un flux ne modifie pas les autres flux (test automatique).
- [ ] Sauvegarde → rechargement → poursuite = même résultat qu'une simulation sans interruption.
- [ ] Une migration de sauvegarde de démonstration (v1 → v2) est testée.
- [ ] Aucun accès au navigateur ni hasard non contrôlé dans le moteur (vérification automatique).
- [ ] Tests et construction lancés automatiquement à chaque envoi sur GitHub.

### Phase 2 — Monde + diagnostic v0

Contenu : 10 écuries fictives, personnes (9 postes individualisés par écurie, pilotes, agents, réservoir de libres), contrats, installations, finances de départ, organisations (motoristes, instance dirigeante). Données de départ éditables en CSV (Excel). Page de diagnostic en lecture seule.

Critères de validation :
- [ ] Génération d'un monde complet à partir d'une graine, en moins d'1 seconde.
- [ ] Chaque personne a ses 5 couches (personnalité, valeurs, compétences, aspirations, état).
- [ ] Le monde peut être modifié dans Excel (CSV) puis rechargé sans erreur. Une donnée invalide produit un message clair.
- [ ] Contrôles de cohérence automatiques : aucun poste clé vide, aucun contrat orphelin, des âges plausibles.
- [ ] Page de diagnostic : listes et fiches des écuries, personnes et contrats, consultables sur téléphone.
- [ ] Le porteur juge le paddock généré crédible et varié (relecture de 3 mondes générés avec 3 graines).

### Phase 3 — Saison abstraite

Contenu : calendrier fictif, indice de performance des écuries, modèle de résultat abstrait par Grand Prix, points, classements, primes, statistiques, rapport de saison.

Critères de validation :
- [ ] 10 saisons simulées. Sur 100 graines × 10 saisons, les indicateurs restent dans les fourchettes cibles de la fiche phase 3 (écart entre équipes, abandons, nombre de vainqueurs différents…).
- [ ] La meilleure voiture ne gagne pas toutes les courses. La pire n'en gagne presque jamais.
- [ ] Chaque résultat est expliqué (« Pourquoi ? » : performance, pilote, fiabilité, aléa).
- [ ] Diagnostic : classements et historique des saisons consultables.
- [ ] Chaque coefficient est rangé dans le fichier d'équilibrage et documenté.

## Phases 4 à 14

Elles seront détaillées une par une, avant leur démarrage, dans `docs/systemes/`. Les critères du jalon A sont fixés dès maintenant :

### Jalon A — critères

- [ ] Simulation historique de N années (configurable), puis 10 saisons observées, sans plantage, sur 100 graines.
- [ ] Indicateurs de crédibilité dans les fourchettes cibles : champions différents, durée des dominations, rotation du personnel, carrières, faillites et rachats.
- [ ] Tests contrefactuels : au moins 5 dilemmes types produisent un écart mesurable au-delà du bruit, sur 1, 3 et 10 saisons.
- [ ] Aucun dilemme type n'a d'option gagnante dans plus de 80 % des contextes.
- [ ] Chaînes de causes : au moins 10 % des événements significatifs ont 3 maillons ou plus.
- [ ] Au moins un groupe social émergent par écurie en moyenne. Le départ d'un leader entraîne parfois des départs (mesuré).
- [ ] Audit des attributs : aucun attribut sans effet mesurable.
- [ ] Chronique de 10 saisons lue par le porteur et par ChatGPT, jugée crédible **et** intéressante.
- [ ] Taille de sauvegarde après 50 saisons : moins de 5 Mo compressés.
