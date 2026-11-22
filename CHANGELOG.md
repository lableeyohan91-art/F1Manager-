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
