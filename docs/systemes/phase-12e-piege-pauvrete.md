# Phase 12e — sortir du piège de la pauvreté (fiche de conception, 26/11/2026)

> Chantier 2 de l'ordre convenu avec le porteur (après la nouvelle ère, D-178). Objectif du porteur : une écurie pauvre peut rester dans le
> bas de grille, mais **pas 30 ans de suite** ; le bas de grille doit s'inverser ; avec le joueur, progresser doit être gratifiant.
> Statut : **conception soumise au porteur**, aucun code. Diagnostic : `tools/diagnostic-finances.mts` (10 graines × 30 saisons, code D-178),
> données `docs/rapports/phase-12e/`.

## 1. Le diagnostic

| M€ par an, 2027–2036 | Haass | Cadillac | Williams | Racing Bulls | Mercédès |
| --- | --- | --- | --- | --- | --- |
| Place moyenne | 9,2 | 8,9 | 5,2 | 8,0 | 2,5 |
| Apport du propriétaire | **59** | 150 | 69 | 101 | 142 |
| Sponsors | **36** | 44 | 106 | 46 | 192 |
| Droits commerciaux | 40 | 37 | 60 | 34 | 136 |
| Primes | 68 | 67 | 109 | 79 | 140 |
| Dividendes versés au propriétaire | **6** | 57 | 75 | 23 | 274 |
| Développement payé | **50** | 83 | 85 | 73 | 60 |

- **Ma première hypothèse était fausse** : Haas ne verse presque pas de dividendes (6 M€ par an). Les supprimer ne changerait rien.
- La cause est dans les **recettes** : le plus petit apport de propriétaire (une famille, 60 M€ de base) **et** les plus faibles sponsors.
  Williams a un propriétaire aussi modeste, mais ses sponsors (106 M€) la sauvent.
- Les sponsors suivent la popularité, le prestige et les résultats : une écurie de fond de grille n'en attire pas, donc reste en fond de
  grille. Rien, aujourd'hui, ne casse ce cercle tant que l'écurie n'est pas en crise (aucun rachat de Haas en 10 graines × 30 saisons).
- Une fois l'argent manquant, tout suit : moins de recherche, donc moins de savoir, une frontière plus basse (diagnostic 12d).

## 2. Comment les vraies écuries en sont sorties (repères publics)

- **Un repreneur ou un investisseur** arrive quand l'écurie stagne et vaut peu : Williams (fonds d'investissement, 2020), Force India devenue
  Racing Point puis Aston Martin, Sauber reprise par Audi.
- **Un grand sponsor titre** qui cherche de la visibilité à bon prix (Haas et son sponsor titre de 2024).
- **Un partenariat technique** avec un grand constructeur : pièces achetées, soufflerie, simulateur, personnel (Haas avec Ferrari, puis avec
  Toyota en 2025).
- **Des pilotes soutenus** par un grand groupe de leur pays.

## 3. Les leviers proposés (mêmes règles pour le joueur et l'IA, visibles, jamais garantis)

| Levier | Mécanisme | Ce que le joueur vit | Complexité |
| --- | --- | --- | --- |
| **A. Investisseur d'opportunité** | Une écurie qui stagne dans le bas (plusieurs saisons dans les 3 dernières places) et vaut peu attire, de temps en temps, un repreneur ou un investisseur (prise de participation) : nouvel apport, plus d'ambition, mais des exigences (objectifs, patience plus courte). On réutilise le mécanisme de rachat existant, aujourd'hui réservé aux crises. | Un événement qui change le destin de l'écurie ; un nouveau patron à satisfaire. | faible |
| **B. Sponsor d'opportunité et pilote payant** | Une écurie sans sponsor titre ou principal reçoit des offres « valeur » : un sponsor qui cherche une visibilité bon marché (montant plus modeste, bonus aux résultats), ou un **pilote soutenu par un grand groupe de son pays** (chèque d'entrée + sponsor principal plusieurs années, contre une titularisation garantie et le statut de n°1). Dilemme bloquant pour le joueur (D-168), décision immédiate pour l'IA. | Le dilemme « FM » : de l'argent contre un baquet ; un pilote moyen imposé. | moyenne |
| **C. Objectifs gradués du propriétaire** | Le propriétaire fixe un objectif réaliste chaque saison (sortir des 3 dernières places, marquer des points, top 8…) ; s'il est atteint, son apport augmente la saison suivante ; s'il est raté longtemps, sa patience baisse. | Des paliers clairs et gratifiants. | faible |
| **D. Partenariat technique** | Une écurie cliente peut acheter à son motoriste ou à une grande écurie une partie de son savoir et de ses pièces (suspensions, boîte, heures de soufflerie), contre de l'argent et un alignement politique. | Le levier le plus réaliste et le plus fort ; un vrai choix stratégique. | **élevée** : à faire avec les contrats moteur |

**Écarté** : supprimer les dividendes (sans effet, §1) ; resserrer les primes (proches de la vraie F1, et cela aiderait aussi des écuries qui
n'en ont pas besoin).

## 4. Ordre proposé et critères de réussite

1. **A (investisseur) et C (objectifs)** d'abord : peu de code, effet direct sur l'argent des écuries bloquées.
2. **B (sponsor d'opportunité et pilote payant)** ensuite : le plus « jeu », avec un vrai dilemme.
3. **D (partenariat technique)** avec le chantier des contrats moteur.

Critères (10 graines × 30 saisons, mêmes graines, tous les indicateurs D-076) :
- aucune écurie dans les 3 dernières places plus de **50 %** des saisons (aujourd'hui 81 à 84 %) ;
- plus longue série d'une écurie dans les 3 dernières places : **8 saisons au plus** (aujourd'hui environ 20) ;
- dernière écurie qui marque : **60 à 90 %** des saisons (61 % après D-178) ;
- les dynasties ne remontent pas (30 % des séries après D-178) ;
- avec le joueur à la tête de Haas (laboratoire) : des points réguliers en 3 à 4 saisons quand il gère bien.

## 5. Questions au porteur

1. Valider les leviers A et C pour commencer, puis B ?
2. Levier A : un investisseur peut-il aussi arriver chez l'écurie **du joueur** ? Je propose oui : c'est un événement du monde, avec un
   nouveau patron, donc de nouvelles exigences et un risque de licenciement si l'on déçoit.
3. Levier D (partenariat technique) : d'accord pour le traiter avec les contrats moteur ?
