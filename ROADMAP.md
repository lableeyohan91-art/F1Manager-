# Feuille de route

> Mise à jour le 21/11/2026 pour intégrer les demandes de la validation : mémoire plus tôt, groupes sociaux, valeurs, simulation historique, interface de diagnostic et bac à sable.
> Statut : ordre des phases **VALIDÉ** (D-024, 22/11/2026).

Règle : une phase est terminée quand **tous** ses critères de validation sont atteints et que le porteur du projet l'a validée. Pas de durée fixée, car elle dépend du temps disponible.

## Vue d'ensemble

| Phase | Nom | Résultat visible |
| --- | --- | --- |
| 0 | Cadrage | Documentation complète, décisions tracées |
| 1 | Noyau | Un moteur vide qui tourne 50 saisons, reproductible |
| 2 | Monde + diagnostic v0 | Grille inspirée de 2026 chargée depuis des CSV modifiables, générateur procédural, page de diagnostic |
| 3 | Saison abstraite | Classements, points et primes sur 10 saisons |
| 4 | Contrats + mémoire v1 + bac à sable | Négocier, promettre, se souvenir ; premières interactions testables à la main |
| 5 | Économie | Sponsors, conseil d'administration, plafond budgétaire, installations |
| 6a | Cycle de vie | Progression et déclin individualisés, retraites, reconversions, nouvelles générations, réservoir karting/F4, potentiel incertain et rapports de recrutement |
| 6a+ | Compléments | Compétences des pilotes (D-104), qualités mentales (D-105), expérience (D-106), exigences des circuits (D-107), affinités légères et mode développeur (D-108) |
| 6b | Filières juniors | Deux championnats juniors réellement simulés (écuries, calendriers, résultats, classements, palmarès), académies, contrats d'affiliation, financement des carrières, placement, renouvellement des grilles |
| 7 | Marché du travail + IA des écuries + agents | **7a** marché des pilotes (fenêtre, offres concurrentes, pré-accords, débauchage, lassitude) · **7b** personnel technique (débauchage, non-concurrence de 6 mois, lassitude, candidatures spontanées) · **7c** agents et valeur commerciale (D-116, D-117). Recrutement actif, débauchage (adultes **et jeunes talents**), clauses de rachat, décisions de l'IA, **valeur commerciale, sponsors personnels, pilotes payants, pouvoir de négociation** (D-096 à D-099) |
| 8 | Règlements + recherche + mémoire v2 + groupes sociaux + politique | **Phase 8 livrée le 23/11/2026 (8a à 8d)** · **8a** règlements (évolutions mineures annuelles, grandes réformes votées : aéro, motorisation et énergie, châssis et mécanique, refonte majeure ; pneus d'un manufacturier commun) · **8b** recherche (connaissances par domaine, deux programmes, horizons actuel / suivant / futur règlement) · **8c** mémoire v2 · **8d** groupes, politique et **équipe des stands** (dimension humaine, D-129). | Circulation de l'information, réputation, groupes émergents, votes du règlement, **grands changements de règlement tous les 4 à 6 ans** (accent aéro / moteur / pneus, anticipation, coups de génie — D-090) |
| 9 | Histoire ancrée (**livrée le 23/11/2026** ; simulation libre des mondes fictifs reportée après le jalon A, D-143) | Démarrage en 2027 avec la grille voulue, et des personnages qui partagent déjà un passé |
| **A** | **Jalon A** (mesuré le 23/11/2026 : 2 critères atteints sur 9, voir `docs/rapports/2026-11-23-jalon-a.md`) | **10 saisons observées après un historique, chronique lisible, rapport de diagnostic** |
| 10 | Le joueur (**livrée le 23/11/2026**, délégation D-147, relecture à faire) | Prendre la tête d'une écurie, premiers écrans mobiles ; délégations par domaine, décisions en attente, sauvegarde, page de mesure des performances |
| 11 | Médias et archives (**livrée le 24/11/2026**, D-149) | Actualités, rumeurs, records, chronologie, **popularité et image publique qui font évoluer la valeur commerciale** |
| 11c | **Refonte du sponsoring** (D-155) | Variantes de contrat (prudente, équilibrée, audacieuse) de même valeur attendue pour le sponsor ; objectif par Grand Prix du sponsor titre ; clauses annuelles variées ; opérations exceptionnelles après un exploit, au profit des petites écuries ; domaine délégable `commercial`. **Avant la phase 11b** |
| 11b | **Circuits en détail** (D-145) | Tracés **très détaillés** en segments (chaque virage, ligne droite, zone de freinage, zones d'aspiration), piste (abrasivité, adhérence et évolution, vibreurs, bosses), conditions selon la date (climat, température, altitude), course (dépassement, voiture de sécurité, temps de passage aux stands), **vivier de 30 circuits réels, calendrier de 20 Grands Prix dont 10 permanents, rotation** (D-107) ; données réelles autant que possible, saisies et relues avec le porteur. **Avant la phase 12** : les compromis de conception des voitures se jugent face aux circuits |
| 12 | Monoplaces | Conception à partir des connaissances de la phase 8 (D-128) · **12a** architecture, pièces, philosophies · **12b** recherche, conception, coûts, délais, risques · **12c** fabrication, stocks, garage · **12d** innovations majeures, veille technologique légale · **12e** compatibilité pilote-monoplace ; pas de voiture parfaite ; délégation par domaine (D-109) ; identités techniques et frontière de compromis (D-114) |
| 13 | Courses en 2D | **Arrêts aux stands simulés** (temps, erreurs, fatigue, cohésion de l'équipe des stands, D-129) · Moteur de course qui remplace le modèle abstrait (reprise des modèles pneus/essence/météo de Paddock) ; circuits en segments, thermique, énergie, aspiration et air perturbé, qualifications contre course (D-114) ; **affinités avec les circuits, forme du jour, forme à moyen terme** qui remplacent une partie de l'aléa générique (D-103) ; sang-froid (D-075) |
| 14 | Carrière du manager | Offres d'emploi, licenciement, changement d'écurie, héritage |
| 15 | Direction artistique et immersion | Portraits, QG, infrastructures, monoplaces, circuits, illustrations d'événements, identités graphiques ; packs de ressources remplaçables ; optimisation mobile |

### Ce qui a changé par rapport à la proposition initiale

- **Mémoire v1 avancée en phase 4** (au lieu de 7), en même temps que les premiers contrats. Elle comprend les événements, les souvenirs, la mémoire résiduelle, les promesses, la confiance et la reconnaissance.
- **Diagnostic v0 dès la phase 2**, puis enrichi à chaque phase.
- **Bac à sable d'interactions en phase 4** : déclencher à la main une négociation, une promesse ou un refus, et observer la réaction et son « Pourquoi ? ».
- **Valeurs et convictions** intégrées au modèle de personnage dès la phase 2, et utilisées dans les décisions dès la phase 4.
- **Groupes sociaux** en phase 8, une fois qu'il existe assez de relations pour qu'ils émergent.
- **Phase 15 ajoutée (22/11/2026)** : direction artistique (ChatGPT) et intégration (Claude Code), une fois les mécaniques terminées et équilibrées. Anticipation technique : clés de ressources liées aux entités, graine visuelle persistante par personne, images de remplacement, WebP, chargement différé, cache, packs remplaçables, séparation complète avec la simulation. Voir [phase-15-direction-artistique.md](docs/systemes/phase-15-direction-artistique.md).
- **Phase 6 enrichie (22/11/2026)** : écosystème complet de formation des pilotes, découpé en 6a (cycle de vie) et 6b (filières juniors). Le recrutement et le débauchage des jeunes sont rattachés au marché (phase 7). Orientations et dépendances : [phase-6-cycle-de-vie-filieres.md](docs/systemes/phase-6-cycle-de-vie-filieres.md). La phase 4 prévoit dès sa conception des contrats génériques (affiliation, financement, placement) et des organisations typées (écurie junior, académie, championnat).
- **Simulation historique** en phase 9. Elle réutilise le moteur complet : elle ne peut pas venir avant les systèmes qu'elle fait tourner.

## Détail des phases 0 à 3

Fiches techniques détaillées : [phase 1](docs/systemes/phase-1-noyau.md), [phase 2](docs/systemes/phase-2-monde.md), [phase 3](docs/systemes/phase-3-saison.md).

### Phase 0 — Cadrage

Contenu : structure documentaire, glossaire, principes, architecture, entités, première structure des personnalités, détail des phases 1 à 3, journal des décisions, rapport pour ChatGPT.

Critères de validation :
- [ ] Tous les documents listés dans le README existent et sont relus par le porteur.
- [ ] Chaque décision est classée VALIDÉE ou À DISCUTER dans `docs/decisions.md`.
- [x] Les décisions bloquantes pour la phase 1 sont tranchées (22/11/2026).
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

**Équilibrage (D-095)** : mesure et documentation après chaque phase ; grandes campagnes d'équilibrage après les phases 8, 12 et 13.

**Plateformes (D-110)** : Android, iPhone et PC avec un seul moteur ; interface mobile et interface PC ; Web Worker, page de mesure des performances et mises en page avant la première version jouable.
