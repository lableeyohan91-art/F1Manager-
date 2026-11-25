# Historique des modifications

## [Phase 0] — 21/11/2026

### Ajouté
- Structure documentaire du dépôt : README, CLAUDE.md, GAME_DESIGN.md, ROADMAP.md, docs/.
- Glossaire, journal des décisions (D-001 à D-039), architecture générale.
- Fiches : entités du monde, personnages en 5 couches, mémoire et relations, phases 1 à 3.
- Rapport de phase 0 pour relecture : `docs/echanges/2026-11-21-claude-rapport-phase-0.md`.

Aucun code à ce stade.

## [Phase 0] — 22/11/2026

### Modifié
- Décisions validées par le porteur : D-024, D-027 à D-035, D-037, D-038. Les 4 décisions bloquantes pour la phase 1 sont tranchées.
- Restent à discuter : D-025 et D-026 (traits et valeurs, à finaliser avec ChatGPT), D-036 (noms), D-039 (option Carrera), D-040 (fourchettes cibles de la phase 3).

## [Phase 0] — 22/11/2026 (2)

### Modifié
- Départ inspiré de la grille F1 2026 (D-041, D-042, D-047, D-048) ; D-008 remplacée.
- Nouvelle fiche `docs/systemes/donnees-initiales.md` : altération des noms, base CSV modifiable, histoire ancrée, mise en garde juridique.
- Mise à jour de CLAUDE.md, README, GAME_DESIGN, ROADMAP, glossaire, fiche phase 2.
- Nouvelles questions : D-043 à D-046.

## [Phase 0] — 22/11/2026 (3)

### Modifié
- Validées : D-043 (grille 2026 en fichier non publié), D-044 (postes non pilotes réels altérés), D-045 (circuits réels altérés), D-046 (histoire ancrée depuis 2010).

## [Phase 0] — 22/11/2026 (4)

### Ajouté
- Jeu de données `data/grille-2026/` : 11 écuries, 5 motoristes, 22 pilotes, team principals, quelques directeurs, contrats, carrières depuis 2010, palmarès 2010–2026, 24 circuits. Estimations signalées ligne par ligne.

### Modifié
- D-043 révisée (données dans le dépôt public). Nouvelles décisions à confirmer : D-049, D-030b, D-050.

## [Phase 1] — 22/11/2026

### Ajouté
- Noyau du moteur : hasard à graine par flux, calendrier, boucle hebdomadaire, événements avec causes et conservation bornée, Chronique, commandes, agenda, sauvegarde versionnée avec migration, empreinte.
- Lanceur sans écran (`npm run simuler`, `npm run rejouer`), vérification de pureté du moteur, 20 tests automatiques.
- Page web minimale (Preact) et intégration continue GitHub Actions avec publication GitHub Pages.
- Rapport `docs/rapports/2026-11-22-p1-noyau.md`.

## [Phase 2, en cours] — 22/11/2026

### Ajouté
- Chargement et validation des fichiers CSV (messages par fichier, ligne et colonne).
- Construction du monde 2027 : données de la grille 2026 + génération des couches cachées, des postes vacants, des départements, des installations et d'un réservoir de 110 personnes libres.
- Contrôles de cohérence automatiques.
- Liste de noms fictifs par nationalité (`data/commun/`).
- Interface de diagnostic v0 (écuries, personnes et leurs 5 couches, contrats, palmarès, circuits, cohérence, export JSON).
- 11 tests de plus (31 au total). Rapport `docs/rapports/2026-11-22-p2-monde.md`.

### Corrigé
- Données de la grille 2026 : points-virgules dans les colonnes de vérification, nationalités MON et THA ajoutées, potentiel d'Alonzo.

## [Phase 3] — 22/11/2026

### Corrigé
- La protection d'un événement se propage à ses causes (défaut signalé par ChatGPT).

### Ajouté
- Courbes d'âge par métier (D-051), élagage des causes (D-058), tirages locaux (D-057).
- Voitures à 7 caractéristiques (`data/grille-2026/voitures.csv`), profils de circuits.
- Saison complète : calendrier de 24 Grands Prix, résultats, classements, primes, titres, palmarès, évolution provisoire des voitures et des motoristes, chronique v1.
- Indicateurs de crédibilité et d'intérêt, rapport d'équilibrage sur 100 graines (`npm run equilibrage`).
- Diagnostic : onglets Saisons (classements, calendrier, résultats, « Pourquoi ? »), Bilan, Voitures ; boutons « Simuler 1 / 10 saisons ».
- 15 tests de plus (40 au total). Rapports `docs/rapports/2026-11-22-p3-*.md`.

## [Vérifications phase 3] — 22/11/2026

### Ajouté
- Décomposition de l'écart entre coéquipiers (compétences, forme, aléa), indicateurs de luttes pour le titre (coéquipiers / écuries différentes, retournements).
- Définition exacte du titre ouvert à la dernière manche (D-061), testée.
- Réglages d'expérience par monde (format de sauvegarde 3, migration testée) ; options `--alea`, `--param`, `--balayage-alea`, `--json`, `--reference` pour `npm run equilibrage`.
- Référence figée des résultats de la phase 3 (D-060). Rapports `2026-11-22-p3-verifications.md` et `2026-11-22-p3-balayage-alea.md`.

### Modifié
- D-054 validée (11 traits, mise en œuvre en phase 4). Proposition D-059 (poids du pilote et aléa) en attente.

## [Feuille de route] — 22/11/2026

### Modifié
- Phase 6 enrichie : écosystème de formation des pilotes (D-062), découpage proposé en 6a / 6b (D-063), questions sur les noms et les grilles juniors (D-064).
- Fiche d'orientations `docs/systemes/phase-6-cycle-de-vie-filieres.md` ; la conception de la phase 4 prévoit des contrats génériques compatibles (§12).

## [Décisions] — 22/11/2026

### Modifié
- Conception de la phase 4 validée par le porteur (D-065), sous réserve des points ouverts soumis à ChatGPT ; orientations de la phase 6 et découpage 6a / 6b validés (D-063).
- Message de synthèse pour ChatGPT : `docs/echanges/2026-11-22-claude-message-chatgpt-phases-4-6.md`.

## [Avant phase 4] — 22/11/2026

### Modifié
- Réglage B appliqué (D-059) : pilote 0,20 % par point, aléa 0,22. Réglages A, B, C archivés dans `docs/rapports/archives/`.
- Réponse de ChatGPT retranscrite (`docs/echanges/2026-11-22-chatgpt-reponse-phases-4-6.md`) ; décisions D-066 à D-073.

## [Phase 4] — 22/11/2026

### Ajouté
- Contrats génériques, 11 traits, format de sauvegarde 4 (migration testée).
- Mémoire v1 : souvenirs, relations, oubli selon les traits, résidu, saturation, réconciliation ; promesses ; réputation publique.
- Décisions par utilité (valeurs, convictions, lignes rouges situationnelles, relations, aspirations), négociations, IA des team principals, remplacement multi-écuries, réservoir.
- Interactions publiques et privées ; état émotionnel ; motivation du personnel technique → développement.
- Bac à sable mobile ; souvenirs et relations sur la fiche de chaque personne.
- Outil des dilemmes contrefactuels (`npm run dilemmes`), rapports P4 (équilibrage comparé à la référence, dilemmes).

### Constat
- Le réglage B (D-059) fait tomber « la dernière écurie marque un point » à 17 % : proposition de revenir au réglage A (D-074).

## [Feuille de route] — 22/11/2026 (2)

### Ajouté
- Phase 15 « Direction artistique et immersion » (D-080) et fiche d'orientations : clés de ressources, graine visuelle persistante, images de remplacement, optimisation mobile, packs remplaçables. Question D-079 sur les portraits des personnages inspirés du réel.

## [Campagne D-074] — 22/11/2026

### Ajouté
- Campagne de 21 réglages (100 graines × 10 saisons, mécaniques P4) et revalidation sur les graines 101–200 ; trois compromis présentés (rapport `docs/rapports/2026-11-22-p4-campagne-equilibrage.md`, tableaux et mesures archivés).
- Constats : hiérarchie et dynasties insensibles au modèle de course ; forme sans effet ; réglage B parmi les moins bons compromis.

## [Orientation compétitivité] — 22/11/2026

### Modifié
- Réglage C2 appliqué à titre provisoire (D-074 : pilote 0,15 / aléa 0,30), réglage B conservé comme référence ; nouvelle référence `docs/rapports/reference/p4-c2-reference.*`.
- Orientation fondamentale « compétitivité » (D-081) ajoutée au GAME_DESIGN (§7, principe 11) ; laboratoire d'équilibrage documenté (`docs/systemes/laboratoire-equilibrage.md`) avec les cibles du jeu final et l'état actuel ; cibles intégrées à l'outil de campagne et à la fiche de la phase 5.
- Propositions D-082 (indicateurs de tiers, mobilité, valeur des décisions) et question D-083 (départ 2027).

## [Phase 5a] — 22/11/2026

### Ajouté
- Économie de base : données financières de départ (`finances.csv`), propriétaires, comptabilité par période de 4 semaines, bilan annuel, contrôle du plafond et sanctions, budget décidé par l'IA, coupes, dividendes.
- Développement lié à l'effort technique sous plafond ; restrictions aéro selon le classement.
- Conseil d'administration : prolongation et licenciement du team principal (remplace la règle provisoire de la phase 4).
- Apparence persistante des personnes (D-080) ; format de sauvegarde 5 avec migration testée.
- Onglet « Finances » du diagnostic ; outils `npm run finances` et `npm run statistiques-finances`.
- Indicateurs de mobilité entre étages (D-082, D-088) dans le rapport d'équilibrage.
- 6 tests (62 au total).
- Rapport `docs/rapports/2026-11-22-p5a-economie.md` ; références conservées (`p4-c2-reference-v2`, `p4-c2-reference-20saisons`, `p5a-reference`, `p5a-reference-20saisons`).

### Constat
- Bas et milieu de grille resserrés (dernière écurie qui marque : 32 % → 44 % sur 10 saisons ; 47 % → 59 % sur 20), mobilité accrue ; sommet inchangé (dynasties 64 % → 66 %, dominations 8 % → 10 % sur 10 saisons). Économie encore très calme (aucune crise) : attendu avant la 5b.
- Écarts à la conception à valider : D-084 à D-088.


## [Phase 5b] — 22/11/2026

### Ajouté
- Sponsors fictifs (secteurs et racines de noms dans `data/commun`), marché annuel, objectifs, primes, départs, rancunes, conjoncture mondiale.
- Dette, intérêts, remboursements ; tension, crise, sauvetage, administration, rachat ; vente par lassitude ; retrait du propriétaire ; emprunt offensif.
- Projets d'infrastructure avec retards et surcoûts, enveloppe annuelle hors plafond, vieillissement des installations.
- Le conseil juge aussi le joueur (D-089). Orientations des grands changements de règlement pour la phase 8 (D-090).
- Onglet Finances enrichi ; format de sauvegarde 6 ; 4 tests (66 au total) ; références `p5b-reference*`.
- Rapport `docs/rapports/2026-11-22-p5b-economie.md`.

### Corrigé
- `npm run statistiques-finances` comptait les événements après élagage : fréquences très sous-estimées sur 20 saisons.

### Constat
- 5b quasi neutre pour le sport (différences dans le bruit). Aucune crise financière en 600 saisons : objectif « quelques crises par décennie » non atteint.
- Décisions à valider : D-092 à D-094.

## [Orientations après la phase 5] — 22/11/2026

### Modifié
- D-092 à D-094 validées (valeurs provisoires).
- Nouvelle méthode d'équilibrage D-095 : mesurer et documenter après chaque phase, grandes campagnes après les phases 8, 12 et 13 (CLAUDE.md, laboratoire, feuille de route) ; tableau des déséquilibres connus et de leurs remèdes attendus.

### Ajouté
- Orientations valeur commerciale, sponsors personnels et pilotes payants (D-096 à D-099) : `docs/systemes/orientations-valeur-commerciale.md`, réparties entre les phases 6b, 7, 8 et 11.
- Fiche de conception de la phase 6a (cycle de vie) soumise à validation : `docs/systemes/phase-6a-cycle-de-vie.md` (D-100).

## [Phase 6a] — 22/11/2026

### Ajouté
- Cycle de vie des personnages : profils de carrière (6 archétypes), progression et déclin par compétence, environnement (temps de jeu, encadrement, mentor, motivation, travail), déclics et stagnations.
- Potentiel estimé par chaque écurie : l'IA ne lit plus le vrai potentiel.
- Retraites, départs du milieu, abandon des jeunes qui n'ont pas percé (D-101), retours, reconversions, promotions entre métiers.
- Jeunes pilotes de 14 à 22 ans dès 2027 ; cohortes annuelles ; accès à la F1 dès 18 ans.
- Format de sauvegarde 7 ; 8 tests (74 au total) ; outils `npm run demographie` et `npm run persistance` ; références `p6a-reference*`.
- Rapport `docs/rapports/2026-11-22-p6a-cycle-de-vie.md`.

### Constat
- Hiérarchie beaucoup plus vivante (dernière écurie qui marque 43 % → 64 %, top 3 qui chute 27 % → 52 %), mais dominations doublées sur 10 saisons (9 % → 20 %).

## [Orientations performance pilote] — 22/11/2026

### Ajouté
- D-102 : pilotes d'exception rares (≈ 2 par décennie), distribution des potentiels des cohortes resserrée.
- D-103 : affinités avec les circuits, forme du jour, forme à moyen terme (orientations, intégration en phase 13) : `docs/systemes/orientations-performance-pilote.md`.

## [Phase 6a complémentaire] — 22/11/2026

### Ajouté
- Compétences des pilotes refondues (vitesse supprimée ; freinage, virages lents, virages rapides, motricité, intelligence de course), trait résilience, erreurs sous pression, expérience réelle, exigences propres aux 24 circuits, affinités légères (D-104 à D-108).
- Mode développeur : commande `dev.modifier_personne` et éditeur dans l'interface de diagnostic.
- Nouvelles notes des pilotes réels ; format de sauvegarde 8 ; 10 tests de laboratoire (84 au total) ; références `p6a-complement-reference*`.
- Rapport `docs/rapports/2026-11-22-p6a-complement-competences.md`.

### Constat
- Dominations en recul sur 10 saisons (23 % → 19 %), mais hiérarchie plus figée (hypothèse : l'expérience favorise les pilotes établis) ; documenté, non recalibré (D-095).

## [Laboratoire — toutes les positions] — 22/11/2026

### Ajouté
- Indicateurs de compétitivité à toutes les positions (D-113) pour les pilotes et les constructeurs : mobilité à 25, 50 et 75 % de la saison, écarts entre voisins par étage, changements de position, positions disputées et acquises à 3 manches de la fin, gains et pertes en seconde moitié, positions stables mais disputées et positions isolées.
- Premières mesures et limite connue (égalités à 0 point en bas de classement) dans `docs/systemes/laboratoire-equilibrage.md` §7 ; référence `p6a-complement-reference-v2`.
- Documentation de la phase 12 (D-109), du multiplateforme (D-110), de la règle sur l'âge des champions (D-111) ; fiche de la phase 6b proposée (D-112).

## [Phase 6b-1] — 22/11/2026

### Ajouté
- Filières juniors : écuries juniors (Apex 3 et Apex 2), courses sur les circuits du calendrier, marché annuel des baquets, budget familial, réputation des jeunes (karting et Apex 4 abstraits), rivalités, passé simulé de 3 saisons.
- Expérience et connaissance des circuits acquises chez les juniors ; recrutement F1 sensible à la réputation junior.
- Format de sauvegarde 9 ; onglet Juniors ; 4 tests (89 au total) ; indicateurs de parcours dans `npm run demographie` ; références `p6b1-reference*`.
- Rapport `docs/rapports/2026-11-22-p6b1-filieres-juniors.md`.

### Constat
- La filière fonctionne (61 % des débutants viennent du top 5 de l'Apex 2) ; effet sportif légèrement favorable sur 20 saisons.
- Débutants trop âgés (24,9 ans) et champions encore trop âgés (30,5 ans) : cause identifiée (recrutement F1 provisoire), remèdes en 6b-2 et en phase 7.

## [Orientations techniques des monoplaces] — 22/11/2026

### Ajouté
- Fondations techniques des monoplaces pour les phases 12 et 13 (D-114) : `docs/systemes/fondations-techniques-monoplaces.md`. Principe proposé : frontière de compromis et circuits en segments types.

## [Phase 6b-2] — 22/11/2026

### Ajouté
- Académies (une par écurie de F1), contrats d'affiliation (financement, option prioritaire, promesses tenables), placement et promotion préférentiels, mécènes, missions de repérage (commande commune au joueur et à l'IA), ligne « académie » dans les comptes.
- Suites de l'audit indépendant de ChatGPT (D-115) : connaissance progressive et oubli, vérification financière des missions, prix réel des baquets juniors conservé.
- Formats de sauvegarde 10 et 11 ; 9 tests (98 au total) ; indicateurs d'académies dans `npm run demographie` ; références `p6b2-reference*`.
- Rapport `docs/rapports/2026-11-22-p6b2-academies.md`.

### Corrigé
- Promesses d'académie intenables (7 tenues pour 56 rompues → 50 pour 2).

### Constat
- Filière complète fonctionnelle (90 % des débutants passent par une académie) ; âges en baisse mais encore trop tardifs (champions 30,1 ans, débutants 24,0 ans) ; effet sportif globalement neutre.


## [Phase 7a] — 22/11/2026

### Ajouté
- Conception de la phase 7 validée (D-116, D-117) : découpage 7a (pilotes), 7b (personnel), 7c (agents et valeur commerciale) ; lassitude ; candidatures spontanées ; non-concurrence de 6 mois ; commission des agents négociée.
- **Marché des transferts des pilotes** (`src/engine/systems/marche/`, coefficients dans `balance/marche.ts`) :
  - fenêtre (semaines 26 à 48) ;
  - plan de personnel de l'IA avec pari sur la progression ;
  - offres concurrentes et contre-offres (3 tours) ;
  - pré-accords à deux saisons (rares) ;
  - débauchage contre indemnité, versée à l'ancienne écurie ;
  - contre-attaque de l'employeur ;
  - lassitude des pilotes ;
  - réputation de prédatrice.
  - Commandes `marche.offre` et `marche.retirer_offre`, communes au joueur et à l'IA.
- Format de sauvegarde 12 (offres, contrats « signés », réputation de prédatrice), avec migration et test.
- Indicateurs du marché, causes des talents bloqués et inflation salariale dans `npm run demographie`.
- Rapport : `docs/rapports/2026-11-22-p7a-marche-pilotes.md` ; références `docs/rapports/reference/p7a-*`.

### Corrigé (audit n°2, D-118)
- Capacité des académies évolutive (moyens, politique, choix du team principal ; commande `academie.capacite`), sans rupture de contrat.
- Talents jamais arrivés en F1 : causes classées dans l'outil ; erratum dans le rapport 6b-2.

### Corrigé (audit n°3, D-119)
- Règles d'effectif centralisées (`systems/humain/effectifs.ts`) pour toutes les commandes et décisions de l'IA.
- Validation numérique des contrats. Arbitrage du conseil pour les salaires de pilotes élevés. Revalidation complète à la signature.
- Promesses :
  - statut de n°1 exclusif ;
  - paramètres obligatoires ;
  - promesse rompue (départ provoqué par l'employeur) distinguée de la promesse caduque (départ volontaire).
- Chantiers : date prévue, date réelle, temps de travail et semaines de suspension ; retard calendaire.
- Tests d'invariants entre systèmes et décisions extrêmes d'un joueur (`tests/invariants.test.ts`). 112 tests.

## [Audit n°4] — 22/11/2026

### Corrigé (D-121)
- Sauvegardes validées avant chargement (structure, version, date, identifiants, références), messages en français, sauvegarde de secours.
- CSV : colonnes en double ou sans nom et guillemets non refermés signalés.
- Indemnités de licenciement réellement débitées, une seule fois, quel que soit le déclencheur.
- Contrôles de cohérence étendus ; finances orphelines d'une écurie retirée des données corrigées.
- Spearman à rangs moyens (série constante indéfinie) ; classements successifs départagés comme le championnat.
- Indicateurs historiques calculés sur les niveaux contemporains (format de sauvegarde 13, migration et test).
- Clôture du marché en semaine 49 avec expiration notifiée.

### Performances
- Outil `npm run performance`. 50 saisons : 97 s → 57 s, résultats identiques (empreintes vérifiées).
- Délais des simulations longues adaptés aux machines d'intégration, avec durées de référence documentées.

## [Audit n°5] — 22/11/2026

### Corrigé (D-122)
- Mémoire résiduelle formée progressivement pendant l'oubli ; effacement continu ; réconciliation sans aggravation (format de sauvegarde 14, migration et test).
- Idempotence : Grand Prix et manches juniors jamais rejoués ; prise d'effet des contrats limitée à la semaine 50 ; tests d'idempotence de la fin de saison et de la clôture du marché (`tests/audit-5.test.ts`). 128 tests.

## [Archivage des retraités] — 22/11/2026

### Ajouté (D-121)
- Les personnes retirées depuis 5 saisons deviennent des fiches légères (table `archives` : nom, dates, poste, saisons en F1, titres). Leurs relations, souvenirs, contrats terminés, repérages et promesses closes sont effacés. Format de sauvegarde 15 (migration et test).
- Interface de diagnostic : les noms des personnes archivées restent affichés dans l'historique.
- Performances : coût par saison stable (≈ 0,75 s) ; 50 saisons en 36 s (57 s avant, 97 s avant l'audit n°4) ; population stable (≈ 490 personnes).

## [Phase 7b] — 22/11/2026

### Ajouté (D-123)
- Marché du personnel technique et dirigeant (`systems/marche/personnel.ts`) : offres, contre-offres, indemnités, contre-attaques ; remplacement d'un responsable en place (libéré avec indemnité) ; non-concurrence de 6 mois ; départs en groupe ; lassitude du personnel ; attrait d'un poste plus important ; candidatures spontanées (`marche.candidature`).
- Règle commune des effectifs : une personne remplacée libère sa place à la prise d'effet du contrat qui la remplace.
- Format de sauvegarde 16 (candidatures), migration et test. Tests `tests/personnel.test.ts`. 136 tests.

## [Phase 7c] — 23/11/2026

### Ajouté (D-124)
- `systems/marche/commercial.ts`, coefficients `balance/commercial.ts` : popularité, valeur commerciale, sponsors personnels (accompagnant, personnel, familial, national), pilotes payants, motivations des sponsors, agents (commission négociée, surenchère, poussée au transfert, démarchage).
- Format de sauvegarde 17 (agents), migration et test. Tests `tests/commercial.test.ts`. 141 tests.

## [Remplacements par calcul] — 23/11/2026

### Modifié (D-126)
- Le remplacement d'une personne en place n'obéit plus à des seuils fixes : décision coût/bénéfice de l'IA (gain comparé aux indemnités, à la non-concurrence, à la continuité et à l'instabilité ; goût du risque du team principal). Tous les postes du personnel sont concernés.
- Le sponsor accompagnant suit son pilote dès la prise d'effet du transfert (semaine 50).

## [Non-concurrence revue] — 23/11/2026

### Modifié (D-127)
- Une personne débauchée travaille dès son arrivée, à 50 % de son efficacité pendant 6 mois (au lieu de ne pas contribuer du tout). Les secrets de l'ancienne écurie viendront en phase 12.

## [Audit de la phase 7] — 23/11/2026

### Corrigé (D-130)
- Engagements uniques des sponsors (`sponsorsEngages`), apport commercial réel par écurie (`apportCommercialPour`), entreprises liées plafonnées (format de sauvegarde 18).
- Outils de démographie et d'équilibrage fiables malgré l'archivage des retraités.
- Délais explicites pour les tests de simulation ; performances du marché améliorées sans changer les résultats.
- Rapport : `docs/rapports/2026-11-23-audit-p7.md` ; références `p7-complete-*`. 146 tests.

## [Pilotes payants réels] — 23/11/2026

### Ajouté (D-131)
- Remplacement rentable d'un sponsor par celui qui suit un pilote (indemnité de rupture payée, exclusivités respectées).
- Engagements conditionnels de partenaires réels dès les juniors, déclenchés à l'arrivée en F1 (format de sauvegarde 19).
- Le marché examine aussi les pilotes au soutien commercial réel (niveau minimal). Mesures dans `docs/rapports/2026-11-23-d131-pilotes-payants.md`. 147 tests.

## [Phases 8a et 8b] — 23/11/2026

### Ajouté (D-128, D-132, D-133)
- Règlements (`systems/technique/`, coefficients `balance/technique.ts`) : règlement en vigueur, propositions de réformes (aéro, motorisation et énergie, châssis et mécanique, refonte), pneumatiques, prolongation, vote en deux tours, annonce, entrée en vigueur avec obsolescence partielle du savoir, évolutions mineures annuelles.
- Recherche : savoir fondamental et propre à chaque règlement, 12 domaines techniques et leurs voisins, deux programmes par écurie (domaine, horizon, part des moyens), remise en route, suspension sans perte, découvertes rares et expliquées, historique borné, délégation au directeur technique.
- Commandes `recherche.programme`, `recherche.suspendre`, `recherche.deleguer`, `reglement.vote` (mêmes règles pour le joueur et l'IA) ; décisions de l'IA.
- Conversion PROVISOIRE du savoir en performance, isolée dans `systems/technique/conception.ts` : coût de la recherche sur le développement, bonus du savoir, préparation de la saison suivante, reconception relative au plateau.
- Format de sauvegarde 20, migration et test. Tests `tests/technique.test.ts`. Outil `tools/diagnostic-reglements.mts`. 157 tests.
- Rapport : `docs/rapports/2026-11-23-p8ab-reglements-recherche.md` ; références `p8ab-*`.

## [Phase 8c] — 23/11/2026

### Ajouté (D-134)
- Qui sait quoi (`systems/information/`, coefficients `balance/information.ts`) : faits privés suivis, fuites le long des relations freinées par la discrétion, rumeurs (récits déformés) crues selon la confiance envers la source, révélations par la presse, volumes bornés.
- Réputation perçue : la réputation d'un dirigeant aux yeux d'une personne tient compte des faits privés qu'elle connaît (utilisée dans l'évaluation des offres).
- Avant-projets de règlement : préparés dès la semaine 2, connus approximativement des écuries qui en ont vent, recherche exploratoire possible avant la publication.
- Format de sauvegarde 21, migration et test. Tests `tests/information.test.ts`. 163 tests. Diagnostic `tools/diagnostic-reglements.mts` étendu.
- Rapport : `docs/rapports/2026-11-23-p8c-qui-sait-quoi.md` ; références `p8c-*`.

## [Phase 8d-1 : équipe des stands] — 23/11/2026

### Ajouté (D-129, D-135)
- Équipe des stands par écurie (`systems/stands/`, coefficients `balance/stands.ts`) : rapidité et précision avec plafond, cohésion, fatigue, expérience collective, part de mécaniciens expérimentés, plan d'entraînement, recrutement par vagues, départs naturels chaque hiver, historique borné.
- Nouveau poste de chef d'équipe des stands (génération, recrutement, marché du personnel).
- Commandes `stands.plan`, `stands.recrutement`, `stands.deleguer` ; décisions de l'IA.
- Format de sauvegarde 22, migration et test. Tests `tests/stands.test.ts`. 170 tests.

### Corrigé
- Un sponsor accompagnant ne reste plus lié à un pilote qui a quitté l'écurie hors marché : il le suit ou prend fin.
- Limite de taille de sauvegarde (10 saisons) relevée de 4 à 4,5 Mo, mesures à l'appui (données de la phase 8).

## [Phase 8d-2 : démissions et ruptures négociées] — 23/11/2026

### Ajouté (D-077, D-136)
- Envie de partir, demandes de départ à l'amiable, démissions (non-concurrence, trahison ressentie), ruptures négociées proposées par l'employeur (`systems/humain/departs.ts`, `balance/departs.ts`).
- Commandes `contrat.rupture_negociee` et `contrat.repondre_depart` ; décisions de l'IA ; postes libérés pourvus par le recrutement habituel.
- Demandes de départ et refus suivis par la diffusion de l'information (8c). Tests `tests/departs.test.ts`. 174 tests.

## [Phase 8d-3 : groupes sociaux] — 23/11/2026

### Ajouté (D-137)
- Groupes sociaux émergents (`systems/humain/groupes.ts`, `balance/groupes.ts`) : lien social, détection annuelle, leader, types déduits (clan, opposants, mentor, anciens collaborateurs, collègues).
- Effets : membres qui suivent leur leader (candidatures), climat dégradé par un groupe d'opposants.
- Format de sauvegarde 23, migration et test. Tests `tests/groupes.test.ts`. 179 tests.

## [Phase 8d-4 : politique] — 23/11/2026

### Ajouté (D-138)
- Fédération et président élu tous les 4 ans (intérim si le président est recruté), profil politique déduit de la personne (`systems/politique/`, `balance/politique.ts`).
- Lobbying sur les propositions de réforme, autres votes (plafond budgétaire, restrictions aérodynamiques), alliances d'écuries pesant dans les votes.
- Commandes `politique.lobbying` et `federation.vote`. Format de sauvegarde 24, migration et test. Tests `tests/politique.test.ts`. 184 tests.

### Performances
- Démissions et ruptures : index des souvenirs, contrats et anciennetés pendant le passage mensuel (29 s → 5,8 s sur 50 saisons), résultats identiques (empreintes vérifiées).

## [Fin de la phase 8] — 23/11/2026

### Mesures
- Rapport court de fin de phase : `docs/rapports/2026-11-23-p8d-fin-de-phase-8.md` ; références `p8d-*` ; outil `tools/diagnostic-8d.mts`.

## [Point de fin de phase 8] — 23/11/2026

### Modifié (D-139, D-140)
- Lien social étendu à toutes les relations (affinité naturelle et respect professionnel, selon la familiarité).
- Plafond budgétaire jamais voté au-dessus de sa valeur de départ.
- Usure du succès : seuil personnel de 3 à 5 titres, très loyaux épargnés, signal précurseur (« besoin d'un nouveau défi »), motivation en baisse, développement freiné, départs. Tests `tests/usure.test.ts`. 186 tests.
- Nombre de Grands Prix soumis au vote des écuries (20 à 24), règles votées appliquées après la fin de saison (D-141). 187 tests.

## [Phase 9 : histoire ancrée] — 23/11/2026

### Ajouté (D-143)
- Couche humaine du passé 2010–2026 construite au départ (`generation/histoire.ts`, coefficients `balance/histoire.ts`) : familiarité des anciens collègues, histoires et rivalités réelles connues (`data/grille-2026/histoires.csv`), souvenirs plausibles inventés autour des faits (coéquipier du champion, mentorat, départs, titres), oubli des années écoulées.
- Dates d'arrivée des dirigeants réels dans `carrieres.csv` : ancienneté et usure du succès dès le départ.
- Chronique du passé : titres 2010–2026 et grandes ères.
- La grille, les contrats et les voitures de 2027 restent ceux des données (test). Tests `tests/histoire.test.ts`. 193 tests.
- Rapport court : `docs/rapports/2026-11-23-p9-histoire-ancree.md` ; références `p9-*`.

## [Jalon A — corrections] — 23/11/2026

### Corrigé
- Recrutement de dernier recours : durée bornée par un successeur déjà signé (deux directeurs au même poste).
- Rupture négociée : jamais proposée à une personne qui part déjà.
- Titularisation d'un réserviste : contrat borné par les places réellement libres (trois titulaires prévus).
- Retraite d'un dirigeant en fin de saison : poste pourvu aussitôt (écurie sans team principal pendant une semaine).
- Chronique : phrases pour les demandes de départ, groupes, alliances et lobbying ; révélations de presse qui citent le fait ; transferts avec le poste.
- Test de cohérence semaine par semaine (`tests/jalon-a.test.ts`). 194 tests.
- Rapport du jalon A : `docs/rapports/2026-11-23-jalon-a.md` (critères, dilemmes, chronique de la graine 42 à lire).

## [Jalon A — chaînes de causes] — 23/11/2026

### Ajouté (D-144)
- Liens directs entre faits : départs, décisions de l'employeur, marché (candidature, offre, signature, arrivée), recrutements de secours, groupes, stands, règlement et votes (`systems/humain/causes.ts`). 27 % des faits importants ont au moins 3 maillons (0 % avant). Résultats de simulation inchangés.
- Corrigé : les saisons de F1 courues avant 2027 (données) comptent dans la carrière des pilotes (ancienneté, popularité, statistiques). Carrière moyenne mesurée : 10,6 saisons (cible 6 à 10).

## [Jalon A bis] — 23/11/2026

### Modifié (D-146)
- Groupes sociaux plus fréquents : 0,59 → 0,95 groupe par écurie (seuils de détection abaissés, 5 membres au plus). Comparaison sur les mêmes graines : `docs/rapports/jalon-a/groupes-avant-apres.md`. Leurs effets restent rares (suivre son leader, opposants).
- Trois dilemmes de plus (accepter un départ, licencier un directeur technique décevant, prolonger un vétéran). Campagne de 20 graines : `docs/rapports/jalon-a/dilemmes-6-dilemmes-20-graines.md` ; rapport du jalon A mis à jour (§2 quater).

## [Phase 10 : le joueur] — 23/11/2026 (nuit, délégation D-147)

### Ajouté
- Fiche `docs/systemes/phase-10-joueur.md` (validée par délégation du porteur).
- Moteur (`systems/joueur/`, `balance/joueur.ts`) : prise de fonction (`joueur.prendre_ecurie`), délégations par domaine (`joueur.deleguer`), budget de développement (`budget.developpement`), décisions en attente (consultation), fin de partie si le conseil remplace le joueur, commandes du joueur exécutées tout de suite et journalisées (`executerCommandeJoueur`).
- Le manager du joueur n'est jamais sur le marché ni mis à la retraite par l'IA ; son contrat reste jugé par le conseil (D-089).
- Filet de sécurité commun : un poste vacant de l'écurie du joueur est pourvu par le recrutement d'urgence, comme pour l'IA.
- Format de sauvegarde 25 (champ `joueur`, délégations) et migration 24 → 25.
- Interface du joueur (`src/ui/jeu/`), mobile d'abord : accueil (nouvelle partie, reprise), tableau de bord, messages, équipe et fiches, marché, technique, finances, championnat, direction (délégations, votes, lobbying), réglages (sauvegarde, téléchargement, mesure des performances). Avance par tranches (« Continuer » s'arrête sur une nouvelle décision, une échéance proche, l'ouverture du marché, la fin de saison). Le diagnostic reste à l'adresse `#diagnostic`.
- Tests : `tests/joueur.test.ts` (11 tests), parcours complet dans un navigateur sur téléphone et ordinateur (`tools/parcours-joueur.mjs`), mesure joueur passif contre IA (`tools/diagnostic-joueur.mts`).

### Corrigé
- Des prolongations successives pouvaient porter un contrat très au-delà de 5 saisons (jusqu'en 2045 dans un test) : borne commune au joueur et à l'IA.

## [Phase 11 : médias et archives] — 24/11/2026

### Ajouté (D-149)
- 9 médias fictifs (`data/commun/medias.csv`) ; articles tirés des seuls faits du moteur, selon la ligne éditoriale ; rumeurs étiquetées (vraies ou fausses, le joueur ne le sait pas).
- Image publique des personnes et des écuries (lue par la valeur commerciale, les sponsors, le conseil, les candidats) ; exposition médiatique (lue par la popularité).
- Scandales professionnels issus de la simulation ; conférences de presse (commande `media.declaration`, commune au joueur et à l'IA ; délégation « communication ») ; objectif annoncé lu par le conseil.
- Archives : records (titres depuis 2010, victoires et podiums depuis 2027), palmarès, classement d'image ; record battu = fait et article.
- Écrans Actualités et Archives ; image sur le tableau de bord et les fiches. Format de sauvegarde 26 et migration.
- Tests `tests/medias.test.ts` (11). 216 tests. Mesures : `docs/rapports/2026-11-24-p11-medias.md`.

### Corrigé
- Accord des phrases des infrastructures (« son nouveau simulateur »).

## [Audit de la phase 9] — 24/11/2026

### Corrigé (D-151)
- Saisons juniors du passé simulées à leur vraie date, dans la chronologie du passé humain : titres juniors datés de 2024–2026 (et non 2027), rivalités juniors conservées au départ (0 → environ 6 par monde).
- Horloge du passé : chaque souvenir ne vieillit que du temps écoulé depuis son fait, jusqu'au départ.
- Transferts en cours de saison : colonnes `moisDe` et `moisA` de `carrieres.csv` (5 cas renseignés) ; familiarité au mois près ; expérience initiale sans double compte.
- Validation de `carrieres.csv` et `histoires.csv` : messages explicites (fichier, ligne, raison).

### Ajouté
- `tests/audit-p9.test.ts` (22 tests, dont 13 échouent avec l'ancien code), `tools/diagnostic-histoire.mts`.
- Mesures de D-150 (lassitude du public) ajoutées au rapport de la phase 11.

## [D-152, audit de la phase 10] — 24/11/2026

### Modifié (D-152)
- Proximité : le lien social s'estompe (moitié en 5 ans) sans contact ; la familiarité reste. Format de sauvegarde 27.

### Corrigé (D-153)
- Échéance des demandes de départ en fin d'année ; échéance des questions de la presse en fin d'année.
- Reprise par la sauvegarde de secours (avec message) ; une sauvegarde illisible ne remplace plus le secours.
- Places à pourvoir signalées seulement tant que le marché est ouvert ; contre-propositions orphelines effacées.
- Import d'une sauvegarde téléchargée (Réglages). Outil `diagnostic-joueur` : toutes les délégations.
- Tests `tests/audit-p10.test.ts` (13) ; parcours navigateur : 26 étapes (import, secours, double corruption).

## [Phase 11c — refonte du sponsoring] — 24/11/2026

### Ajouté (D-155, D-156)
- Contrats titre et principaux en trois variantes (prudente, équilibrée, audacieuse), de même valeur attendue pour le sponsor, à sa marge de risque près. Chaque variante est chiffrée d'après le rang attendu public de l'écurie et des fréquences mesurées sur la simulation.
- Clauses annuelles variées selon l'image recherchée par le sponsor : rang, places gagnées, podium, victoire, arrivées dans les points. Engagement ferme dans la limite des moyens du sponsor, avec une prime plafonnée à 3 fois la valeur du contrat.
- Sponsor titre : un objectif par Grand Prix (prudent, intermédiaire, audacieux, ou aucun), payé sur une enveloppe de 20 % du contrat. L'estimation affichée vient du directeur sportif, plus précise selon sa compétence stratégie.
- Opérations exceptionnelles après un podium ou une victoire inattendus, réservées aux petites écuries. 4 formats ; le pilote demandé est affiché avant d'accepter ; effets sur l'exposition, l'image, les souvenirs du pilote et la satisfaction des sponsors ; un fait « sollicitation » daté, pour la phase 13.
- Domaine délégable `commercial`, non délégué au départ. Offres et opérations s'affichent dans les décisions en attente ; à l'échéance, l'équipe tranche.
- Commandes communes au joueur et à l'IA : `sponsor.signer`, `sponsor.objectif_gp`, `sponsor.operation`.
- Écran Finances → Sponsors.
- Format de sauvegarde 28 : les contrats existants deviennent prudents.
- Tests `tests/sponsoring.test.ts` (15). Outil `tools/diagnostic-sponsors.mts`. Étape « offre de sponsor » dans le parcours navigateur.

## [Phase 11c — arbitrages du porteur] — 24/11/2026

### Modifié (D-157, D-158)
- Opérations exceptionnelles : déclenchées par le premier top 5, podium ou victoire de l'écurie depuis 3 saisons. Une seule par saison. Montants relevés pour le fond de grille (environ 14 M€ par opération acceptée).
- Rumeurs de presse : fiabilité inchangée (décision du porteur).

## [Phase 11b — audit APEX Lab] — 24/11/2026

### Corrigé
- GitHub Actions : délai justifié (60 s) pour le test D-157, assertions inchangées ; chaîne verte et site publié.
- Profil de vitesse : électrique compté en sortie de virage (motricité jamais négative), recherche de la coupure plus fine (16 étapes).
- Virages rapides : courbure lissée sur 0,25 s de trajet à la vitesse calculée. Validation (21 circuits jamais calés) : 4,8 % → 3,4 % d'écart de temps au tour.

### Ajouté
- Registre des caractéristiques (`src/engine/circuits/specialisation.ts`) : modélisées ou futures (non testées), compromis, canal météo unique.
- Banc de spécialisation (`tools/banc-specialisation.mts`), étude de la normalisation (`tools/circuits/etude-normalisation.mts`), export APEX Lab (`tools/export-apex-lab.mts`, `export/apex-lab/`).
- Outil de calage : écart de temps au tour dans le critère, contrainte « moins d'appui à Monza qu'à Monaco », recalage partiel (`pistes`).
- Rapport `docs/rapports/phase-11b/audit-apex-lab.md` ; décisions D-162 et D-163 (validées par le porteur le 24/11/2026) ; 8 tests.

## [Phase 11b — les 30 circuits] — 24/11/2026

### Ajouté
- Vivier de 30 circuits : Imola, Sepang, Portimão, Istanbul, Paul-Ricard et Kyalami rejoignent les 24 (noms altérés).
- Calendrier de 20 Grands Prix : 10 permanents, 10 places en rotation (contrats, puis circuits absents depuis le plus longtemps) ; archives conservées.
- Climat réel sur 12 mois pour les 30 circuits : la pluie dépend du mois où le Grand Prix a lieu.
- Écran « Circuits » : 30 fiches (tracé et virages, exigences provisoires, conditions, historique, stratégie et incidents, préparation du week-end).
- Données préparées pour les phases 12 et 13 (contraintes techniques, stands, dépassements, zones à risque), sans effet sur les courses.
- Export APEX Lab des 30 circuits ; 186 tests de données, 7 tests du calendrier.

### Modifié
- Format de sauvegarde 29 (une ancienne partie garde son calendrier de 24 Grands Prix).
- D-164 inscrite. Rapport : `docs/rapports/phase-11b/rapport-final-30-circuits.md`.

## [Audit des phases 1 à 11] — 25/11/2026

### Corrigé
- 92 constats relevés par six relectures indépendantes : 67 corrigés, 8 en partie, 16 documentés, 1 écarté (D-158). Détail : `docs/rapports/audit-phases-1-11/constats.md`.
- Les plus importants :
  - deux parties partageaient des objets (déterminisme) ;
  - l'anti-répétition des gestes réduisait tous les soutiens ;
  - un plafond voté sanctionnait l'année écoulée ;
  - le plafond était contournable par le joueur ;
  - double contrat après une prolongation ;
  - pilotes titulaires à 51 ans ;
  - égalités départagées par l'identifiant ;
  - communication déléguée qui critiquait le pilote ;
  - décisions sautées par « Continuer » ;
  - pertes de sauvegarde silencieuses.

### Modifié
- Part pluvieuse 0,35 → 0,43, vérifiée sur 258 éditions réelles.
- Grands Prix à la semaine de leur date habituelle.
- Budget de développement modifiable une fois par trimestre.
- D-165 ; rapport `docs/rapports/audit-phases-1-11/rapport.md` ; 16 tests (`tests/audit-nuit.test.ts`).

## [D-166 à D-168 — réponses du porteur sur l'audit] — 25/11/2026

### Modifié
- Budget (D-166) :
  - la voiture progresse selon l'argent réellement payé (dernière écriture comptable) ;
  - le budget de développement se modifie à tout moment (fin de la limite trimestrielle).
- Retraites des pilotes (D-167) :
  - annoncées en semaine 24, avant le marché ;
  - plus aucune protection par le contrat ;
  - retraite surprise rare en fin de saison ;
  - carrières plus courtes : âge moyen de retraite volontaire des titulaires 37,4 → 34,5 ans, plus aucun titulaire de 40 ans ou plus.
- Demandes bloquantes (D-168) :
  - augmentation, départ et contre-proposition (domaine non délégué) arrêtent le temps, marquées « ❗ » ;
  - nouveau choix « Ne pas répondre » (commande `demande.ignorer`).
- Format de sauvegarde 30 (migration testée).
- Rapport `docs/rapports/d166-d168/rapport.md` ; outil `tools/retraites-pilotes.mts` ; laboratoire de démographie enrichi.

## [Phase 12 — conception détaillée soumise] — 25/11/2026

### Ajouté (documentation seulement, aucun code)
- `docs/systemes/phase-12-conception-detaillee.md` :
  - audit de l'existant ;
  - articulation avec la recherche de la phase 8 ;
  - pièces et valeurs de F1 Manager 2024 ;
  - soufflerie et CFD ;
  - fabrication ;
  - renouvellement des hiérarchies ;
  - découpage 12a–12d ;
  - laboratoire ;
  - 13 questions.
- `docs/systemes/phase-12-fatigue-evenements.md` : fatigue, stress, alertes, événements de conception et de recherche, découvertes, exploitations et parades.
- D-169 (projet de reformulation de D-081) et D-170, toutes deux à discuter.

## [Phase 12 — conception validée] — 25/11/2026

### Modifié
- D-169 validée : D-081 est nuancée (équilibrage déclaré des opportunités et des moyens, jamais des résultats).
- D-170 validée avec les réponses du porteur :
  - ADUO conservé comme futur levier d'équilibrage ;
  - surcoût de l'intensif variable ;
  - dilemmes techniques bloquants, à confirmer.

## [Phase 12a — architecture et physique des monoplaces] — 25/11/2026

### Ajouté
- Voitures en six pièces : efficacité et concept, valeurs de F1 Manager 2024.
- Temps au tour physique sur les 30 circuits, branché sur les courses.
- Refroidissement selon la chaleur du mois et l'altitude.
- Frontière de compromis, projets de conception, paris d'architecture.
- Écran Technique (voiture circuit par circuit, pièces, projets, architecture).
- Format 31.

### Modifié
- Aérodynamique du profil de vitesse refondue (D-163, partielle).
- Reconception aux réformes désormais absolue.
- Développement abstrait limité à la fiabilité et aux pneus.

### À signaler
- La hiérarchie se fige sur 30 saisons : voir `docs/rapports/phase-12a/rapport.md`, variantes mesurées, décision D-171 à prendre.

## [Phase 12b — soufflerie, rythmes, fatigue, alertes, événements] — 25/11/2026

### Ajouté
- Barème réel 2026 de soufflerie et de CFD, avec ses trois usages.
- Recherche aéro dopée par les heures.
- Rythmes de travail et fatigue des pôles.
- Incidents, défauts cachés, pièces fragiles.
- Alertes des responsables et événements de conception.
- Dilemmes bloquants pour le joueur non délégué.
- Écran Technique enrichi.
- Laboratoire `tools/labo-conception.mts`.
- Format 32.

### À signaler
- Les heures de soufflerie pèsent encore trop peu : voir `docs/rapports/phase-12b/rapport.md`, D-172.


## [Phase 12b bis] — 25/11/2026

### Modifié (réglage provisoire, mesuré : `docs/rapports/phase-12b-bis/rapport.md`, D-173)
- Variante V5 adoptée (frontière : échelle de savoir 12, part fondamentale aux réformes 0,3 ; pénalités d'architecture 0,2 à 0,5).
- Soufflerie renforcée : 4 jours de projet par heure, recherche aéro multipliée de 0,3 à 1,8 selon les heures.
- ADUO (rattrapage des motoristes) : +1 évolution au-delà de 2 % de retard de puissance, +2 (et +2 la saison suivante) au-delà de 4 %.
- IA : rythme intensif ponctuel sur les 14 derniers jours d'un projet, si l'équipe n'est pas fatiguée.
- Correction : l'IA gardait trop peu d'argent pour ses programmes de recherche en début d'année et pouvait dépasser le plafond ; une
  vérification demandée sans argent devient un ralentissement ; l'enveloppe des projets est aussi bornée par la place réelle sous le plafond.
- Outils : stratégie « ponctuel » du laboratoire de conception ; `tools/tendances-voitures.mts` (indice moyen par saison, effet des réformes).

### Ajouté (25/11/2026, suite)
- Conversion de départ : chacune des six pièces reçoit un concept tiré du profil des notes de la voiture.
- `tools/banc-grille.mts` : les 11 voitures classées sur les 30 circuits (sans hasard), pièces et caractéristiques physiques ;
  rapport `docs/rapports/phase-12-profils/` (proposition de notes du porteur, non appliquée).
- Mesures de la 12b bis : 30 saisons (α=1, α=2, sans ADUO), laboratoire Williams et Haas, tendances de vitesse et réformes.
- Fiabilité retirée de l'efficacité du châssis (D-174) ; refroidissement lu selon le mois du Grand Prix ; paramètres de banc d'essai
  (`course.meteoForcee`, `course.abandons`, `course.pression`) et leur test.
- Analyse approfondie : `docs/systemes/phase-12c-analyse-approfondie.md`.
