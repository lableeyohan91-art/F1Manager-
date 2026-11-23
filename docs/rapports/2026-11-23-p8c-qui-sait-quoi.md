# Rapport court — Phase 8c : qui sait quoi (fuites, rumeurs, réputation perçue)

> Date : 23/11/2026. Mesures **indicatives** (D-120), sans recalibrage (D-095).
> Mêmes graines avant et après :
> - 100 graines × 10 saisons, comparées à la référence `p8ab` ;
> - diagnostic sur 20 graines × 20 saisons.
>
> Fiche technique : `docs/systemes/phase-8c-qui-sait-quoi.md`. Décision : D-134 (choix de mise en œuvre, à valider).
> Nouvelles références conservées : `docs/rapports/reference/p8c-*`.

## 1. Ce qui a été fait

- **Faits suivis.** Les faits privés qui intéressent les autres sont suivis : promesse rompue, découverte, tension financière, débauchage, critique privée, emprunt… Pour chacun, on tient la liste de ceux qui le connaissent : les participants au départ, puis ceux qui l'apprennent. Cette liste est bornée à 25 personnes.
- **Fuites.**
  - Chaque semaine, une personne au courant peut en parler à l'une de ses relations, parfois dans une autre écurie, sinon à un collègue.
  - La **discrétion** freine les fuites.
  - Le récit est parfois **déformé** : on parle alors de **rumeur**. Cela arrive plus souvent avec une personne peu professionnelle.
  - Chacun croit ce qu'on lui dit selon sa **confiance envers la source**.
- **Révélations.** La presse peut révéler un fait. Un fait connu de 25 personnes devient public d'office.
- **Réputation perçue.** On juge un dirigeant sur les faits publics et sur ce qu'on sait de lui en privé, pondéré par ce qu'on en croit. Une rumeur pèse plus lourd qu'un fait exact. Elle sert quand une personne évalue une offre d'un team principal qu'elle ne connaît pas.
- **Avant-projets de règlement** (lien avec la 8b) :
  - la fédération prépare ses réformes dès la semaine 2, et ne les publie qu'en semaine 12 ;
  - une écurie peut en avoir vent avant, grâce à la compétence « politique » de son team principal et à son prestige ;
  - elle perçoit alors les changements **approximativement**, et peut y orienter sa recherche à ses risques. L'IA le fait.
- **Format de sauvegarde 21**, avec migration et test. La diffusion démarre avec les faits nouveaux. **163 tests**, dont 6 nouveaux dans `tests/information.test.ts`.
- **Performances.** Une première version coûtait 7,4 s sur 50 saisons. Deux optimisations la ramènent à 4,2 s : ne lire que les nouveaux événements, et construire l'index des relations seulement si quelqu'un parle. **Les résultats sont strictement identiques** (empreintes vérifiées sur deux graines).

## 2. Mesures

### Information (20 graines × 20 saisons)

| Indicateur | Valeur |
| --- | --- |
| Écuries qui ont vent d'un avant-projet, par réforme préparée | 7,3 sur 11 |
| Faits privés révélés publiquement par saison | 3,8 (tous par la presse) |
| Personnes au courant d'un fait privé suivi (moyenne) | 5,7 |
| … dont informées par ouï-dire / par une rumeur | 2,2 / 0,5 |

### Règlements et recherche (même diagnostic, comparé à la 8b)

| Indicateur | 8b | 8c |
| --- | --- | --- |
| Réformes / prolongations pour 10 saisons | 2,08 / 0,17 | 2,05 / 0,23 |
| Champion qui garde son titre, année d'une réforme / autres années | 51 % / 62 % | **47 % / 61 %** |
| Stabilité du classement (Spearman), année d'une réforme / autres | 0,77 / 0,81 | 0,75 / 0,80 |
| Programmes orientés vers un futur règlement | 23 % | 24 % |

### Équilibrage général (100 graines × 10 saisons, toutes les lignes dans la référence jointe)

Aucune ligne ne bouge de plus d'un point, ce qui est dans le bruit statistique. Lignes à surveiller :

| Indicateur | 8b | 8c |
| --- | --- | --- |
| Dynasties (5 titres consécutifs ou plus, séries de 10 saisons) | 54 % | 55 % |
| Part des victoires de l'écurie dominante | 60 % | 60 % |
| Écart 1re–dernière voiture | 1,56 | 1,56 |
| La dernière écurie marque | 62 % | 62 % |

### Performances (50 saisons, graine 1)

| | 8b | 8c |
| --- | --- | --- |
| Total | 81,6 s | 73,5 s (variations de la machine comprises) |
| Diffusion de l'information | — | 4,2 s (5,7 %) |

## 3. Lecture franche

- **Le système fonctionne et reste discret**, ce qui est voulu. Les informations circulent, se déforment parfois et finissent souvent dans la presse. Les écuries bien introduites apprennent les réformes avant les autres.
- **Effet sportif nul à ce stade, c'est normal.** La 8c change ce que les personnages *savent*, pas la vitesse des voitures. Les avant-projets donnent un peu plus d'avance aux écuries informées. La légère baisse du maintien du champion lors des réformes (51 % → 47 %) va dans ce sens, mais elle reste dans le bruit.
- **Effet humain encore faible.** La réputation perçue n'intervient que lorsqu'on ne connaît pas le team principal. L'impact réel viendra en 8d, avec les groupes sociaux et la possibilité que les tiers se fassent un avis (« injustice » envers un collègue).
- **Signaux à surveiller** :
  - aucun fait n'atteint 25 personnes : la presse révèle tout avant. Le seuil de « trop de monde » ne sert donc presque jamais ;
  - 3,8 révélations par saison, c'est peut-être beaucoup pour une F1 où les secrets tiennent. C'est à juger quand on pourra les lire, en phase 11 (médias) ;
  - les rumeurs restent rares (0,5 personne par fait).
- **Ce qui n'est pas fait (volontairement)** : souvenirs des tiers qui apprennent un fait (8d), affichage des rumeurs au joueur (phases 10 et 11).
