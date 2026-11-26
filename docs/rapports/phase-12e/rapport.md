# Phase 12e — piège de la pauvreté, leviers A et C : rapport (26/11/2026)

> Décision : **D-179**. Fiche : `docs/systemes/phase-12e-piege-pauvrete.md`. Mesures **indicatives** (D-120), mêmes graines.
> Leviers mis en œuvre : **A**, investisseur d'opportunité ; **C**, objectifs du propriétaire. Levier B (sponsor d'opportunité et pilote
> payant) : à suivre. Levier D (partenariat technique) : non retenu pour l'instant (porteur).

## 1. Ce qui a été fait

- **A — investisseur d'opportunité** : une écurie dans les 3 dernières places au moins 3 des 4 dernières saisons, hors crise, peut être
  rachetée (chance 10 à 50 % par an selon l'impatience du propriétaire ; jamais moins de 5 ans après un rachat). Le repreneur apporte au moins
  1,4 fois l'apport de l'ancien propriétaire et son ambition vaut au moins 12. Il peut remplacer le team principal, y compris le joueur.
- **C — objectifs du propriétaire** : chaque saison, gagner une place au championnat constructeurs (le champion : garder la première).
  Objectif atteint par une écurie partie de la 5e place ou au-delà : apport +15 % la saison suivante. Affiché dans l'écran Finances.
- Format de sauvegarde 33 (migration et test) ; 4 tests ; 545 tests verts ; moteur pur.

## 2. Ce que les essais ont appris (corrections faites en cours de route)

| Essai (10 graines) | Titre ouvert avant la dernière manche | Lutte jusqu'à la dernière manche entre écuries | Séries à 5 titres |
| --- | --- | --- | --- |
| Sans levier | 38 % | 31 % | 30 % |
| A seul | 35 % | 26 % | 70 % |
| C seul (bonus pour toutes les progressions) | **27 %** | **18 %** | 60 % |
| A + C, bonus aussi pour garder la première place | 32 % | 25 % | 80 % |

- Un bonus pour le champion qui garde sa place, puis pour les écuries de tête qui progressent, rendait les championnats moins disputés : le
  bonus est désormais réservé aux progressions d'écuries parties de la 5e place ou au-delà (les grandes sont au plafond budgétaire).
- L'indicateur « séries à 5 titres consécutifs » porte sur une seule série par graine : sur 10 graines, il est trop bruité pour conclure.
  D'où la mesure finale sur **20 graines**.

## 3. Mesure finale (20 graines × 30 saisons, mêmes graines ; tous les indicateurs : `donnees/`)

| Indicateur | Objectif | Sans levier | **A + C** |
| --- | --- | --- | --- |
| Champions constructeurs différents | 5–8 / 20 saisons | 6,7 | **7,3** |
| Champions pilotes différents | — | 12,5 | **13,7** |
| Plus longue série de titres | — | 5,5 | **5,2** |
| Séries avec 5 titres consécutifs ou plus | dynasties rares | 50 % | **65 %** (défavorable, dans le bruit) |
| Titre ouvert avant la dernière manche | 30–50 % | 33 % | 33 % |
| Lutte jusqu'à la dernière manche entre écuries | — | 27 % | 26 % |
| Dominations (≥ 120 points) | < 5 % | 10 % | 10 % |
| Remontées (+3 places) | — | 29,8 | **33,5** |
| Écuries changeant d'étage par saison | 2,8–3,8 | 3,4 | **3,7** |
| Dernière écurie qui marque | 60–90 % | 60 % | **65 %** |
| Écuries sans aucune victoire | — | 0,3 | 0,2 |
| Vainqueurs différents par saison | — | 7,7 | 7,9 |
| Écart 1re–dernière voiture | — | 1,06 % | 1,02 % |
| Corrélation voiture ↔ points | — | 0,77 | 0,73 |
| Victoires inattendues par saison | — | 1,2 | 1,3 |
| Taux d'abandon | — | 6 % | 6 % |

## 4. Rotation du bas de grille (10 graines × 30 saisons)

| Indicateur | Critère | Sans levier | **A + C** |
| --- | --- | --- | --- |
| Écurie la plus souvent dans les 3 dernières places | ≤ 50 % | 86 % | **71 %** ✗ |
| Haas dans les 3 dernières places | — | 74 % | **50 %** |
| Plus longue série dans les 3 dernières places | ≤ 8 saisons | 21,2 | **14,1** ✗ |
| Écuries différentes passées par les 3 dernières places | — | 9,2 | **10,1** |
| Écuries différentes dernières au moins une fois | — | 4,9 | **6,6** |

**Lecture** : nette amélioration, objectifs **pas encore atteints** (une écurie reste encore trop longtemps en bas dans certaines parties).
Le levier B (sponsor d'opportunité et pilote payant) vise précisément les écuries qui restent sans sponsor.

## 5. Levier B (offre du pilote soutenu) : mesure du prototype (désactivé par défaut)

Mesure par paires (20 graines × 30 saisons, chaque partie jouée avec et sans l'offre ; 47 offres acceptées par l'IA ; chèque moyen
17 M€, groupe ≈ 28 M€ par an pendant 5 ans ; pilote 1,7 à 1,8 point sous la référence de l'écurie). Données : `donnees/pilote-soutenu-*`.

| Saison après l'offre | Sponsor à la place d'un emplacement : effet sur la place | Argent en plus des sponsors : effet | Développement payé (en plus) |
| --- | --- | --- | --- |
| +1 | −0,77 | −0,60 | 68 → 73 M€ |
| +2 | −0,89 | −0,69 | 68 → 75 M€ |
| +3 | −0,79 | −0,44 | 67 → 74 M€ |
| +4 | −0,52 | −0,14 | 67 → 73 M€ |
| +5 | +0,34 | +0,08 | 66 → 74 M€ |

- Version de la fiche : le sponsor du pilote prend la place d'un sponsor que l'écurie aurait eu de toute façon ; aucun argent en plus pour la
  voiture ; seul reste le coût sportif.
- Version additionnelle : 28 M€ par an ne deviennent que 5 à 8 M€ de développement (le reste est bloqué par le plafond budgétaire ou part en
  trésorerie et en dividendes) ; le pilote plus faible coûte plus qu'il ne rapporte pendant 3 à 4 saisons. Même chez Haas (12 cas) :
  développement +10 M€, place −0,1 à −0,5.
- **Conclusion : sous cette forme, l'offre n'aide pas l'écurie.** Elle confirme le diagnostic 12d : le niveau des pilotes compte plus que
  l'argent dépensé (corrélation avec la place 0,41 contre 0,14).
