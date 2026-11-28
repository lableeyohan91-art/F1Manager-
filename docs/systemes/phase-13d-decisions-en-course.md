# Phase 13d — décisions en course (conception technique, 28/11/2026)

> Cadre : audit du moteur de course (D-194, ligne 13d : « IA de course réactive avec personnalités liées au personnel ; ingénieur de
> course ; même commande pour tous ») ; porteur le 28/11 : « go ». Carte blanche de la phase 13 (D-192). Valeurs PROVISOIRES (D-120).

## 1. Principe

Chaque écurie a un **stratège** : son directeur sportif. Pendant la course, à chaque tour, il peut décider d'arrêter un pilote plus tôt que
prévu. Ses décisions suivent un **style** et dépendent de sa **compétence stratégie** :
- le style vient de la commande commune `course.style` (joueur) ; sans choix, il vient de la personnalité du directeur sportif
  (propension au risque ≥ 13 : offensif ; ≤ 8 : prudent ; sinon équilibré) ;
- la compétence **stratégie** du directeur sportif (jusqu'ici lue nulle part en course) règle la qualité : précision de l'estimation de
  l'usure, chance de voir une occasion à temps, réaction à la météo.
Le stratège ne voit que ce que voit le joueur : positions, écarts, arrêts des autres, tours faits sur les pneus. Il ne connaît pas l'usure
réelle des autres ni leur plan.

## 2. Les décisions

| Décision | Quand | Styles |
| --- | --- | --- |
| **Undercut** (s'arrêter avant l'adversaire pour le passer grâce aux pneus neufs) | bloqué depuis au moins 3 tours à moins de 1,5 s, à moins de 1,8 s (offensif : 2,5 s) de la voiture devant, d'une autre écurie, qui doit encore s'arrêter et dont les pneus ont au moins autant de tours, et au moins 85 % (offensif : 80 %) du relais prévu fait | équilibré, offensif |
| **Couverture** (répondre à l'arrêt de la voiture derrière pour garder la place) | la voiture qui était juste derrière (moins de 2,5 s ; prudent : 3 s), d'une autre écurie, s'est arrêtée au tour précédent, et au moins 65 % (prudent : 60 %) du relais fait | prudent, équilibré |
| **Arrêt sous neutralisation** | part du relais faite au moins 65 % (prudent), 60 % (équilibré), 55 % (offensif) | tous |
| **Changement de pneus quand la météo change** | délai : prudent +1 tour, offensif −1 tour, et −0,1 tour par point de stratégie au-dessus de 12 | tous |

Chaque occasion n'est vue qu'avec une probabilité par tour : 0,35 + 0,04 × (stratégie − 12), bornée à [0,1 ; 0,8]. Pas d'undercut contre
son propre coéquipier. Après un arrêt anticipé, les tours restants sont répartis entre les relais suivants (même règle qu'en 13c).
L'**overcut** (rester dehors pendant que l'autre s'arrête) n'est pas une décision à part : c'est ce qui arrive quand on ne couvre pas.

## 3. Ingénieur de course

L'erreur d'estimation de l'usure (13a) est multipliée par 1 − 0,03 × (stratégie − 12), bornée à [0,5 ; 1,5], en plus de l'effet des longs
relais des essais libres.

## 4. Mesures

Nombre d'undercuts et de couvertures par course ; part des undercuts qui font gagner la place ; résultats des styles à voiture égale
(aucun style ne doit gagner partout) ; campagne courte contre la 13c.

## 5. Sauvegarde

Format 37 inchangé : style facultatif par écurie (absent = style de la personnalité) ; nombre de décisions dans le détail du résultat
(omis quand nul).

## 6. Mise au point (28/11, mesure sur 3 écuries du milieu, 4 saisons)

Première version : le style prudent dominait (+25 % de points) ; les undercuts coûtaient plus qu'ils ne rapportaient (dépasser est assez
facile dans le modèle, et beaucoup d'écuries couvrent). Règles resserrées (bloqué depuis 3 tours, pneus de l'autre au moins aussi usés,
relais presque fini). Résultat : écarts de 0,1 à 0,3 place par course entre styles ; prudent reste légèrement devant (proche du bruit).
