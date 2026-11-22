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

