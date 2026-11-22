# Rapport — Phase 7a : marché des transferts des pilotes

> Date : 22/11/2026. Conception : `docs/systemes/phase-7-marche-du-travail.md` (D-116, D-117, validées).
> Code mesuré : commit c341064, c'est-à-dire la phase 7a **avant** la correction de la capacité des académies (audit n°2, D-118, commit 05bc1ff), mesurée à part (§7).
> Référence de comparaison : 6b-2, mêmes graines, même outil, même machine (D-076). Références conservées : `docs/rapports/reference/p6b2-*` et `p7a-*`.

## 1. Ce qui a été livré

| Élément | Contenu |
| --- | --- |
| **Fenêtre de transferts** | Semaines 26 à 48, un tour toutes les deux semaines. À chaque tour, les personnes répondent d'abord aux offres reçues, puis les écuries font leurs nouvelles offres. Les contrats prennent effet en semaine 50 |
| **Plan de personnel de l'IA** | Besoins : places de titulaire non couvertes pour la saison suivante (ou celle d'après). Cibles : vivier de 40 pilotes présélectionnés sur l'opinion du paddock, puis notés par chaque écurie avec **sa** propre estimation du potentiel. **Pari sur l'avenir** : la progression estimée pendant le contrat entre dans la note. Promesses d'académie servies en premier |
| **Offres concurrentes** | Plusieurs écuries peuvent viser la même personne, qui choisit l'offre la plus utile pour elle (utilité de la phase 4). Jusqu'à 3 tours de contre-offres. Le salaire offert dépend de la valeur du pilote **au poste de titulaire**, de l'audace du team principal et du budget |
| **Pré-accords** | Contrat à deux saisons réservé aux 5 meilleurs du vivier, au plus 1 par écurie et par saison. Il reste au statut « signé » jusqu'à son début |
| **Débauchage** | Un pilote encore sous contrat à la date de début s'obtient en versant sa clause de rachat, ou l'indemnité exigée par son écurie (salaire × années restantes × 2, majorée pour son meilleur pilote ou face à une écurie prédatrice). L'indemnité est versée à l'ancienne écurie et inscrite dans les comptes (dépense pour l'acheteur, recette « transferts » pour le vendeur, hors plafond). Le pilote ne part que si l'offre le séduit nettement plus que rester. Un affilié d'académie se rachète aussi |
| **Contre-attaque** | L'employeur d'un pilote courtisé peut le prolonger et l'augmenter, s'il le juge précieux |
| **Lassitude des pilotes** (D-117) | Calculée, non stockée : saisons dans la même écurie au-delà de 5, et titres avec elle. Elle est accélérée par le goût du défi et l'ambition, freinée par la loyauté, et plafonnée à 0,2 d'utilité |
| **Réputation de prédatrice** (D-117) | +1 par débauchage, multipliée par 0,6 chaque année. Malus d'utilité borné (0,15 au plus) et indemnités plus chères. **Jamais une interdiction** |
| **Commandes communes** | `marche.offre` et `marche.retirer_offre`, validées par les mêmes règles pour le joueur et l'IA : fenêtre ouverte, team principal, place libre pendant toute la durée, trésorerie suffisante, pas de crise, capacité d'approche du département recrutement |
| **Fin du provisoire D-066 pour les pilotes** | Le remplacement provisoire ne sert plus que de filet de sécurité en semaine 50 (0,02 personne générée par saison). Le personnel technique garde l'ancien système jusqu'à la 7b |
| **Sauvegardes** | Format 12 : table des offres (effacée chaque fin de saison), contrats « signés », réputation de prédatrice. Migration 11 → 12 testée |

Hors du périmètre de la 7a (prévu en 7b et 7c) : personnel technique, agents, valeur commerciale, sponsors personnels, primes de performance, clause de départ.

## 2. Défauts trouvés et corrigés pendant la mesure

| Défaut | Correction |
| --- | --- |
| Des écuries se retrouvaient avec **3 titulaires** : un pré-accord signé un an avant, puis une prolongation du pilote en place | Une prolongation (ou une contre-attaque) ne peut plus empiéter sur une saison où les deux baquets sont déjà attribués. Une offre doit trouver une place libre **pendant toute sa durée** |
| Les jeunes étaient payés comme des juniors (0,3 M€) une fois titulaires, ce qui faussait le calcul du coût | Le salaire et la valeur se calculent au poste de titulaire |
| **Presque toutes les signatures étaient des pré-accords à deux saisons** (8 sur 8,5 par saison). Le marché « glissait » d'un an d'avance, ce qui n'est pas réaliste | Pré-accords réservés aux candidats d'exception et limités à un par écurie et par saison |
| Promesses d'académie : 34 tenues pour 19 rompues. Le jeune promis n'était proposé qu'à l'échéance de la promesse, et son baquet était donné à un autre entre-temps | Le jeune promis passe en premier dès qu'un baquet se libère avant l'échéance : 48 tenues pour 2 rompues |
| Un jeune pouvait abandonner, ou un pilote prendre sa retraite, juste après avoir signé | Pas de retraite ni d'abandon l'année d'une signature |

## 3. Parcours et carrières — 10 graines × 30 saisons

| Indicateur | 6b-2 | **7a** | Lecture |
| --- | --- | --- | --- |
| **Âge des débutants en F1** | 24,0 (10 % 20 – 90 % 28) | **22,8** (19 – 27) | ✔ **favorable** : effet direct du pari sur l'avenir |
| **Âge des champions** (D-111) | 30,1 (23 – 36) | **31,3** (24 – 40) | ✘ **défavorable**, objectif non atteint (voir §5) |
| Débutants par saison | 2,94 | 2,40 | ✔ dans la cible 2 à 4, mais en baisse |
| Durée de carrière en F1 | 6,4 saisons | 7,2 | ✔ dans la cible 6 à 10 ; maximum 24 → 29 saisons |
| Âge de retraite des pilotes de F1 | 33,3 (90 % : 41) | 34,5 (90 % : 42) | défavorable (léger) |
| Âge moyen des titulaires en 2056 | 29,2 | 29,0 | ≈ |
| Niveau moyen des titulaires 2027 → 2056 | 15,91 → 15,90 | 15,72 → 16,15 (pic 16,70 en 2036) | Les meilleurs pilotes circulent mieux, la grille est plus forte |
| Débutants passés par le top 5 de l'Apex 2 | 46 % | 58 % | favorable |
| Champions d'Apex 2 promus en F1 | 59 % | 69 % | favorable |
| **Talents (potentiel ≥ 17) jamais arrivés en F1** | 13 % (38/288) | **7 %** (22/313) | ✔ favorable |
| … causes probables : financière / sportive / contractuelle / opportunités / indéterminée (audit n°2) | 10 / 7 / 0 / 16 / 5 | 4 / 5 / 1 / 8 / 4 | Le manque d'opportunités reste la première cause, mais il est divisé par deux |
| Débutants passés par une académie | 90 % | 90 % | ≈ |
| Promesses tenues / rompues | 50 / 2 | 48 / 2 | ≈ (après correction) |
| Pilotes payants moyens arrivés en F1 | 2 % | 1 % | ✘ attendu : la valeur commerciale arrive en 7c |
| Titularisations de réservistes (filet D-066) | 2,53 par saison | 0,10 | Le marché remplace le provisoire |
| Pépites (potentiel ≥ 18) devenues championnes | 34 | 43 | favorable |

### Indicateurs du marché (nouveaux)

| Indicateur | 7a |
| --- | --- |
| Signatures par saison | 6,5 |
| … face à des offres concurrentes | 36 % |
| Pré-accords à deux saisons | 2,4 par saison |
| Débauchages | 0,15 par saison (indemnités 1,1 M€ par saison) |
| Contre-attaques | 0,00 |
| Signatures de moins de 23 ans (au début du contrat) | 20 % |
| Salaire moyen des 5 pilotes les mieux payés | 30,1 → 32,6 (2036) → 23,9 M€ (2056) ; référence 6b-2 : 30,3 → 30,7 → 22,2 |

## 4. Équilibrage sportif — conditions identiques (référence 6b-2)

### 4.1 100 graines × 10 saisons

Détail complet, y compris tous les indicateurs de compétitivité à toutes les positions (D-113) : `docs/rapports/reference/p7a-reference.md`. Ces derniers restent tous dans le bruit statistique (écart ≤ 4 points), sauf ceux repris ci-dessous.

| Indicateur | 6b-2 | **7a** | Sens |
| --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 5,83 | 6,0 | favorable |
| Écuries victorieuses / saison | 3,89 | 4,1 | favorable |
| Part des victoires de l'écurie dominante | 60,8 % | 60 % | ≈ |
| Taux d'abandon | 6,8 % | 7 % | ≈ |
| Écart 1re–dernière voiture (%) | 1,52 | 1,53 | ≈ |
| Écart de points P1–P2 | 74,8 | 67 | favorable |
| Changements de leader | 2,73 | 2,9 | favorable (léger) |
| Doublés / saison | 5,91 | 5,7 | ≈ |
| Corrélation voiture ↔ points | 0,900 | 0,90 | ≈ |
| Plus forte progression d'une voiture | 1,02 | 1,01 | ≈ |
| Victoires inattendues / saison | 2,00 | 2,4 | favorable |
| Courses sous la pluie | 2,73 | 2,7 | identique |
| **Champions pilotes / 10 saisons** | 3,03 | **4,6** | **très favorable** (dans l'objectif 3 à 7 : 66 % → 95 %) |
| Champions constructeurs / 10 saisons | 2,26 | 2,6 | favorable |
| Plus longue série de titres | 6,42 | 5,4 | favorable |
| Écuries sans victoire | 3,57 | 3,0 | favorable |
| Remontées | 4,67 | 5,6 | favorable |
| Écuries changeant d'étage / saison | 2,21 | 2,6 | favorable |
| Transitions sans changement d'étage | 20,6 % | 15 % | favorable (cible < 20 % atteinte) |
| La dernière écurie marque | 56,3 % | 61 % | favorable (≈ 70 % jugé satisfaisant) |
| **Dynasties** (5 titres de suite ou plus sur 10 saisons) | 73 % | **57 %** | **favorable**, encore loin de l'objectif 0–25 % |
| Titre ouvert avant la dernière manche | 23,6 % | 25 % | ≈ |
| Retournement à la dernière manche | 5,0 % | 5 % | ≈ |
| Champion et dauphin coéquipiers | 41,9 % | 44 % | défavorable (léger) |
| Luttes finales entre coéquipiers / entre écuries | 10,9 % / 12,7 % | 11 % / 14 % | ≈ / favorable |
| Saisons très serrées | 8,9 % | 10 % | favorable (léger) |
| Dominations | 20,2 % | 18 % | favorable (léger) |
| Coéquipiers : part compétences / forme / aléa | 31 / 0 / 69 % | 29 / 0 / 70 % | ≈ (la forme ne pèse toujours rien) |
| Constructeurs : frontières raisonnablement disputées — milieu | 72 % | 68 % | défavorable (léger) |
| Pilotes : écart moyen entre voisins — bas (points) | 3,2 | 3,7 | défavorable (léger) |
| Constructeurs : écart moyen entre voisins — milieu / bas (points) | 31,0 / 9,9 | 34,2 / 11,2 | défavorable (léger) |

### 4.2 50 graines × 20 saisons

TABLEAU_20

### 4.3 Hiérarchie dans le temps et dominations (30 graines)

| Indicateur | 6b-2 | **7a** |
| --- | --- | --- |
| Persistance du classement N ↔ N+3 | 0,697 | **0,644** (favorable : hiérarchie moins figée) |
| Dernier tiers 2027 → top 3 un jour / top 5 un jour | 51 % / 81 % | 56 % / 80 % |
| Top 3 2027 → dernier tiers un jour | 36 % | 47 % |
| Dominations : champion dans la meilleure voiture | 77 % | 79 % |

### 4.4 Finances (20 graines × 10 saisons)

| Indicateur | 6b-2 | **7a** |
| --- | --- | --- |
| Crises financières | 0,01 par saison | 0 |
| Emprunts | 0,53 par saison | 0,60 |
| Trésorerie finale médiane (10 % – 90 %) | 133 (41 – 338) M€ | 124 (37 – 349) M€ |
| Années sous le plafond | 15,2 % | 17,4 % |
| Sponsoring selon le rang : 1er / 6e / 11e | 185 / 73 / 38 M€ | 192 / 77 / 46 M€ |

Les indemnités de transfert sont trop rares (1,1 M€ par saison pour toute la grille) pour peser sur les finances. **Aucune crise financière** : le déséquilibre documenté depuis la 5b n'est pas résolu par la 7a.

## 5. Lecture franche

- **Le marché fonctionne et change en profondeur la vie de la grille.** Le titre ne dépend plus seulement de la meilleure voiture : les meilleurs pilotes circulent et rejoignent les voitures qui gagnent. D'où **plus de champions différents** (3,0 → 4,6 sur 10 saisons), **moins de dynasties** (73 % → 57 %), une hiérarchie moins figée (persistance 0,70 → 0,64), plus de remontées et une dernière écurie qui marque plus souvent.
- **Débutants plus jeunes (24,0 → 22,8 ans), talents moins souvent bloqués (13 % → 7 %)** : le pari sur la progression fait son effet.
- **Champions plus âgés (30,1 → 31,3 ans) : objectif D-111 non atteint, et en recul.** Cause observée dans les parties : les **vedettes expérimentées changent d'écurie pour rejoindre la meilleure voiture**. On voit des titres à 38–42 ans dans une voiture rejointe sur le tard. Le marché rend la grille plus efficace : le meilleur pilote encore performant trouve la meilleure voiture, même à 38 ans. Remèdes attendus, sans recalibrage maintenant (D-095) :
  - le déclin physique et les réflexes après 35 ans (à revoir lors de la grande campagne d'après la phase 8) ;
  - la **valeur commerciale** (7c), qui pousse les écuries vers des pilotes jeunes et populaires ;
  - le **moteur de course** (phase 13), où la forme et l'aléa individualisés comptent ;
  - les règlements (phase 8), qui redistribuent la meilleure voiture.
- **Débauchages rares (0,15 par saison) et contre-attaques nulles.** C'est voulu par les règles : on ne débauche que pour combler une place libre, avec une nette avance sur le meilleur candidat libre. Le pilote doit aussi être nettement séduit, car il honore volontiers son contrat. En F1 réelle, les rachats de pilotes sont rares aussi. Le **levier fort contre les dominations par la voiture reste le débauchage des ingénieurs (7b)**.
- **Salaires** : pas d'inflation. Les salaires des vedettes montent un peu les 10 premières années (30 → 32,6 M€), puis baissent comme dans la référence, avec le renouvellement de la grille. La concurrence entre offres existe (36 % des signatures), sans emballement. Les écuries riches n'ont pas accaparé les vedettes : plus de champions différents, et non moins.
- **Toujours pas de pilotes payants (1 %) ni de crises financières** : attendus en 7c (valeur commerciale, sponsors personnels) et plus tard (coûts de conception, phase 12).
- **Performance** : 30 saisons en environ 30 secondes par partie. Le marché est borné : vivier de 40, capacité d'approche limitée, offres effacées chaque saison.

## 6. Déséquilibres mis à jour (laboratoire, §6)

| Déséquilibre | Avant | Après la 7a | Remède attendu |
| --- | --- | --- | --- |
| Dynasties (10 saisons) | 73 % | 57 % | 7b (ingénieurs), 8 (règlements), 12 |
| Champions trop âgés | 30,1 ans | **31,3 ans** (défavorable) | 7c (valeur commerciale), déclin après 35 ans (campagne d'après la phase 8), 13 |
| Débutants trop âgés | 24,0 ans | 22,8 ans | Objectif quasiment atteint ; à confirmer en 7b et 7c |
| Pilotes payants | 2 % | 1 % | 7c |
| Aucune crise financière | 0,01 par saison | 0 | 7b (salaires du personnel, indemnités), 12 |
| La forme ne pèse rien | 0 % | 0 % | 13 |

## 7. Audit n°2 de ChatGPT : capacité des académies (mesurée à part)

ACADEMIES

## 8. Suite

**Phase 7b** : personnel technique (débauchage des ingénieurs et des dirigeants, non-concurrence de 6 mois, départs en groupe, lassitude du personnel, candidatures spontanées, conséquences humaines). C'est le levier principal attendu contre les dominations par la voiture.
