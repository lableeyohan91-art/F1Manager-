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
