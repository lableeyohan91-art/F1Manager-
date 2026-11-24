# Phase 11c — refonte du sponsoring : rapport (24/11/2026)

> Décisions : D-155 (conception validée), D-156 (mise en œuvre et écarts à valider). Fiche : `docs/systemes/phase-11c-sponsoring.md`.
> Mesures **indicatives** (D-120) : 20 graines × 10 saisons, mêmes graines avant et après (`tools/diagnostic-sponsors.mts`).
> La référence d'avant est conservée : `docs/rapports/reference/p11c-avant.json`. **Aucun coefficient sportif modifié.**

## 1. Ce qui a été fait

| Élément | État |
| --- | --- |
| Variantes prudente, équilibrée, audacieuse (titre et principaux) | Fait. La prudente est le contrat d'avant la refonte |
| Clauses annuelles variées selon l'image du sponsor | Fait : rang, places gagnées, podium, victoire, arrivées dans les points. **Clause liée à un pilote : non faite** |
| Engagement ferme (moyens du sponsor), prime au plus 3 fois la valeur du contrat | Fait |
| Objectif par Grand Prix du sponsor titre, fourchette du directeur sportif (compétence stratégie) | Fait |
| Opérations exceptionnelles après un exploit, petites écuries d'abord, pilote affiché, 4 formats | Fait. **Déclencheur « record battu » : non fait** |
| Effets humains : exposition, image, souvenir selon la personnalité, satisfaction des sponsors, gêne du sponsor titre | Fait |
| Fatigue | Non (phase 13) : un fait « sollicitation » daté est laissé pour la jauge d'énergie |
| Domaine délégable `commercial` (non délégué au départ, repli à l'échéance) | Fait |
| Commandes communes `sponsor.signer`, `sponsor.objectif_gp`, `sponsor.operation` | Fait |
| Écran Finances → Sponsors (mobile) ; décisions en attente | Fait |
| Format de sauvegarde 28 et migration | Fait, testé |

## 2. Comment les sponsors chiffrent

Un sponsor ne connaît que le **rang attendu public** d'une écurie : ses deux derniers classements constructeurs. Il en déduit ses chances avec des **fréquences mesurées** sur la simulation (14 graines × 8 saisons), par exemple « une écurie attendue 9e finit au moins un podium dans 25 % des saisons ». Chaque prime vaut sa part du contrat divisée par cette probabilité. Ainsi :
- un pari ne rapporte en moyenne **que si l'écurie fait mieux que ce que le paddock attend d'elle** ;
- un pari réussi par une petite écurie rapporte beaucoup. Exemple mesuré pour une écurie attendue 11e : contrat prudent d'environ 12 M€ ; en audacieux, 6 M€ de fixe et 18,8 M€ de prime pour finir 9e (probabilité estimée 29 %).

## 3. Résultats (tous les indicateurs suivis)

Catégorie d'écurie = classement constructeurs de la saison précédente (tête 1–3, milieu 4–7, fond 8–11). Montants en M€ par écurie et par saison, sauf mention.

| Indicateur | Avant | Après (IA) | Toujours prudent | Toujours audacieux | Opérations toutes acceptées | Opérations toutes refusées | Objectifs de course audacieux | Aucun objectif de course |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fixe fond (M€) | 41,18 | 38,13 | 40,06 | 32,38 | 38,26 | 38,03 | 37,95 | 38,23 |
| fixe milieu (M€) | 75,95 | 68,26 | 73,48 | 55,60 | 68,14 | 68,24 | 68,32 | 68,15 |
| fixe tête (M€) | 150,44 | 133,24 | 143,77 | 102,43 | 133,08 | 133,03 | 133,40 | 133,16 |
| opérations exceptionnelles acceptées / saison | 0 | 2,16 | 2,18 | 2,09 | 2,15 | 0 | 2,15 | 2,17 |
| opérations exceptionnelles proposées / saison | 0 | 2,16 | 2,18 | 2,09 | 2,15 | 2,24 | 2,15 | 2,17 |
| opérations proposées fond / saison | — | 0,89 | 0,87 | 0,81 | 0,90 | 0,95 | 0,89 | 0,92 |
| opérations proposées milieu / saison | — | 1,22 | 1,29 | 1,25 | 1,21 | 1,24 | 1,22 | 1,21 |
| opérations proposées tête / saison | — | 0,04 | 0,03 | 0,03 | 0,03 | 0,05 | 0,04 | 0,04 |
| part des contrats titre/principaux audacieuse | — | 0,15 | 0 | 0,84 | 0,15 | 0,15 | 0,15 | 0,15 |
| part des contrats titre/principaux equilibree | — | 0,18 | 0 | 0 | 0,19 | 0,18 | 0,18 | 0,17 |
| part des contrats titre/principaux prudente | — | 0,67 | 1 | 0,16 | 0,66 | 0,67 | 0,67 | 0,67 |
| rapport premier / dernier | 9,04 | 9,69 | 9,06 | 11,04 | 9,67 | 9,64 | 9,69 | 9,62 |
| renouvellements / saison | 18,77 | 18,35 | 18,67 | 16,96 | 18,38 | 18,24 | 18,27 | 18,33 |
| ruptures de sponsors / saison | 0,71 | 0,67 | 0,77 | 0,76 | 0,74 | 0,72 | 0,65 | 0,69 |
| satisfaction moyenne des contrats actifs | 69,46 | 69,07 | 69,69 | 67,33 | 69,09 | 68,96 | 69,10 | 69,07 |
| signatures / saison | 28,09 | 28,40 | 28,29 | 29,79 | 28,55 | 28,78 | 28,42 | 28,42 |
| sponsoring total du plateau (M€) | 1 085,78 | 1 106,90 | 1 088,42 | 1 085,58 | 1 110,99 | 1 098,71 | 1 103,76 | 1 105,22 |
| sponsors dernier (M€) | 28,32 | 26,59 | 27,87 | 24,46 | 26,46 | 26,76 | 26,61 | 26,65 |
| sponsors premier (M€) | 213,23 | 219,41 | 212,91 | 236,79 | 217,85 | 219,50 | 219,77 | 218,29 |
| total fond (M€) | 48,33 | 50,12 | 48,51 | 45,53 | 50,94 | 49,11 | 49,88 | 50,27 |
| total milieu (M€) | 89,14 | 90,65 | 89,63 | 90,55 | 90,83 | 89,65 | 90,64 | 90,30 |
| total tête (M€) | 178,63 | 181,28 | 178,61 | 180,42 | 181,30 | 181,22 | 180,56 | 180,98 |
| variabilité d’une saison à l’autre (écart type, M€) | 14,59 | 19,42 | 15,15 | 29,89 | 19,40 | 19,17 | 19,43 | 19,04 |
| variable fond (M€) | 7,15 | 11,99 | 8,46 | 13,14 | 12,67 | 11,08 | 11,93 | 12,04 |
| variable milieu (M€) | 13,19 | 22,40 | 16,15 | 34,95 | 22,70 | 21,41 | 22,32 | 22,16 |
| variable tête (M€) | 28,19 | 48,03 | 34,84 | 77,99 | 48,22 | 48,19 | 47,16 | 47,82 |
| versements de primes annuelles (événements) / saison | — | 6,80 | 0 | 12,39 | 6,92 | 6,80 | 6,86 | 6,77 |

## 4. Lecture

**Contrôles demandés :**
- **Pas d'argent gratuit** : contrats toujours prudents = 1 088 M€ pour le plateau, contre 1 086 M€ avant. C'est le contrat d'avant.
- **Pas de stratégie universelle** :
  - parier toujours (audacieux pour tous) donne 1 086 M€, le même total moyen. Mais les petites écuries y perdent : 45,5 M€ contre 48,5 M€ en prudent (−6 %). Elles sont moins souvent sous-estimées que surestimées ;
  - choisir toujours l'objectif de course audacieux coûte 3 M€ au plateau par rapport au choix de l'IA.
- **Bonne décision récompensée** : avec l'IA normale, +21 M€ (+2 %) pour le plateau. Cela vient des écuries qui parient quand leur voiture vaut mieux que leur réputation. Le joueur a la même information sur sa propre voiture.

**Petites écuries (ta demande, question 6) :**
- Total du fond de grille : 48,3 → 50,1 M€ par écurie et par saison (+4 %).
- Opérations exceptionnelles : 0,9 par saison pour le fond, 1,2 pour le milieu, 0,04 pour la tête. La tête n'en reçoit presque jamais : ce sont des écuries que leurs deux dernières saisons classaient plus bas.
- **Écart en ta défaveur, je le signale** : l'écurie la moins dotée reçoit un peu moins (28,3 → 26,6 M€), et le rapport entre le premier et le dernier monte de 9,0 à 9,7. Les gains vont aux petites écuries qui réussissent leurs paris ou leurs exploits, pas à toutes.
- **Montant des opérations modeste** : tout accepter plutôt que tout refuser rapporte environ 1,8 M€ par saison à une écurie du fond. Si tu veux qu'elles pèsent davantage, il suffit de relever `OPERATIONS.partMax` (aujourd'hui 12 % du budget du sponsor).

**Ce qui change pour l'équilibre :**
- La part variable augmente nettement. Exemple, la tête : 28 → 48 M€ de primes par saison, pour un fixe en baisse de 150 à 133 M€.
- Les revenus sont donc plus incertains d'une saison à l'autre : écart type de 14,6 à 19,4 M€, et 29,9 M€ si tout le monde parie. C'est l'effet voulu du risque, mais la direction financière planifie sur le fixe seul (prudence).
- **Les grandes écuries gagnent aussi** (+2,6 M€) : leurs sponsors parient sur des victoires qu'elles obtiennent souvent. C'est une conséquence du principe « même valeur attendue », sans bonus.
- Ruptures, satisfaction, signatures et renouvellements : stables.

## 5. Tests

- **272 tests sur 272**, dont 15 nouveaux (`tests/sponsoring.test.ts`). Ils couvrent :
  - même valeur attendue des variantes ;
  - engagement ferme et sponsor trop petit (scénario 6) ;
  - pari réussi d'une petite écurie ;
  - podium inattendu, clause audacieuse ratée moins décevante (scénarios 2 et 3) ;
  - offres : signature, refus d'un non-dirigeant, déclin, repli à l'échéance ;
  - objectifs de course : ordre, valeur, jugement réel, choix automatique, fourchette selon la stratégie ;
  - opérations : proposition, pilote affiché, acceptation, sollicitation lourde, rareté, refus, écurie de tête exclue, IA (scénarios 7 et 8) ;
  - migration 27 → 28.
- **Moteur pur** : aucune source non déterministe dans les nouveaux fichiers.
- **Parcours navigateur** : 32 étapes sur téléphone et ordinateur, dont une offre de sponsor signée depuis l'écran Finances.
- **Ce qui n'a pas pu être vérifié** : un vrai téléphone ; le site publié (inaccessible d'ici).

## 6. Questions pour toi

1. **Seuil du podium exploit** : je l'ai abaissé de la 9e à la 7e place attendue (sinon presque jamais). D'accord ?
2. **Montant des opérations** : environ 1,8 M€ par saison pour une écurie du fond qui accepte tout. Suffisant, ou faut-il le relever ?
3. **Écurie la moins dotée** : elle reçoit un peu moins qu'avant, si elle ne prend pas de pari. Veux-tu un coup de pouce, ou est-ce acceptable que l'argent aille à celles qui osent ?

## 7. Réponses du porteur et nouvelle règle des opérations (D-157, D-158)

Le porteur a choisi :
- **Déclencheur** : premier top 5, premier podium ou première victoire depuis 3 saisons. Une seule opération par saison, la première.
- **Montants** : relevés pour le fond de grille.
- **Écurie la moins dotée** : coup de pouce reporté à la phase 12.
- **Rumeurs** : fiabilité inchangée.

En début de partie, les données ne contiennent pas les résultats d'avant 2027. L'ancienne règle s'applique donc tant que 3 saisons n'ont pas été jouées (recommandation, à confirmer).

Mesures (mêmes 20 graines × 10 saisons ; montants par écurie et par saison) :

| Indicateur | Avant la refonte | Phase 11c (1re règle) | D-157, IA | D-157, tout accepter | D-157, tout refuser |
| --- | --- | --- | --- | --- | --- |
| Opérations proposées / saison (plateau) | 0 | 2,16 | 1,43 | 1,44 | 1,45 |
| dont fond / milieu / tête | — | 0,89 / 1,22 / 0,04 | 0,70 / 0,70 / 0,02 | 0,71 / 0,71 / 0,02 | 0,72 / 0,71 / 0,02 |
| Total fond (M€) | 48,33 | 50,12 | 51,16 | 52,12 | 49,55 |
| Total milieu (M€) | 89,14 | 90,65 | 92,14 | 92,50 | 90,38 |
| Total tête (M€) | 178,63 | 181,28 | 180,91 | 181,26 | 180,28 |
| Écurie la moins dotée (M€) | 28,32 | 26,59 | 27,26 | 27,02 | 26,70 |
| Rapport premier / dernier | 9,04 | 9,69 | 9,56 | 9,63 | 9,62 |
| Variabilité d'une saison à l'autre (M€) | 14,59 | 19,42 | 20,36 | 20,87 | 19,36 |
| Sponsoring total du plateau (M€) | 1 085,8 | 1 106,9 | 1 115,9 | 1 122,3 | 1 100,6 |
| Ruptures / saison | 0,71 | 0,67 | 0,70 | 0,73 | 0,76 |
| Satisfaction moyenne | 69,5 | 69,1 | 69,1 | 69,0 | 69,0 |

Toutes les colonnes : `docs/rapports/phase-11c/d157-*.json`.

Lecture :
- **Plus rare** (1,4 par saison au lieu de 2,2), mais **bien plus forte**. Pour une écurie du fond, accepter plutôt que refuser rapporte en moyenne 2,6 M€ par saison. Comme elle n'a une opération qu'environ une saison sur six, cela fait **environ 14 M€ par opération**, près d'un tiers de son sponsoring annuel. C'est l'effet « qui change la donne » demandé.
- Les écuries de tête n'en reçoivent pratiquement jamais (0,02 par saison).
- **Défavorable** : le rapport entre l'écurie la mieux dotée et la moins dotée reste au-dessus d'avant (9,56 contre 9,04). Le coup de pouce est attendu en phase 12.
- **Défavorable** : le sponsoring total du plateau augmente de 30 M€ par rapport à avant la refonte (+2,8 %). C'est l'argent des exploits, assumé par le porteur (D-157) ; ce n'est plus « pas d'argent gratuit » au sens strict.
