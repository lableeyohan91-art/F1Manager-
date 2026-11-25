# Profils des voitures de départ — banc de la grille (25/11/2026)

> Demande du porteur : « une voiture peut être globalement meilleure sans être la meilleure partout ». Proposition de notes du porteur
> (avec ChatGPT) testée sur le moteur natif, **sans rien figer** : `data/grille-2026/voitures.csv` n'est pas modifié.
> Outil : `tools/banc-grille.mts` (sans hasard ; temps au tour physique des 11 voitures sur les 30 circuits, moteurs compris).
> Données complètes (classement de chaque circuit, pièces, caractéristiques physiques) : `donnees/`.

## 1. Conversion des notes en pièces (commit 1fe6e10)

Chaque pièce reçoit une efficacité (moyenne de ses notes) et, désormais, **un concept** tiré de l'écart entre deux notes :

| Pièce | Notes de l'efficacité | Concept + | Concept − |
| --- | --- | --- | --- |
| Châssis | virages lents, fiabilité | agilité mécanique (virages lents) | plateforme aéro (virages rapides) |
| Aileron avant / arrière | rapides + aéro / aéro + pointe | fort appui (virages rapides) | faible traînée (vitesse de pointe) |
| Pontons | pointe, aéro | refroidissement généreux (fiabilité) | carrosserie serrée (vitesse de pointe) |
| Fond plat | rapides, lents | effet de sol maximal (rapides) | plateforme tolérante (lents) |
| Suspensions | lents, pneus | souplesse et motricité (lents + pneus) | plateforme raide (rapides) |

Avant ce commit, seuls les deux ailerons avaient un concept.

## 2. Résultats

| Indicateur | Notes actuelles | Proposition du porteur |
| --- | --- | --- |
| Voitures les plus rapides sur au moins un circuit | 1 (Mercédès 30/30) | 3 (McLaren 18, Mercédès 6, Ferrari 6) |
| Paires de voitures qui s'inversent sur au moins un circuit | 10 / 55 | 17 / 55 |
| Écart moyen 1re–2e (points) | 1,18 | 0,62 |
| Meilleure voiture en moyenne | Mercédès 19,48 | **McLaren 18,89** (Mercédès 18,59) |
| Red Bull : circuits gagnés | 0 | 0 (meilleur rang 2) |

Classement global (proposition) : McLaren 18,89 · Mercédès 18,59 · Ferrari 17,47 · Red Bull 17,05 · Williams 14,36 · Racing Bulls 13,77 ·
Alpine 13,70 · Haas 13,33 · Aston 12,38 · Audi 11,41 · Cadillac 11,04.

Ce qui est cohérent : Ferrari (faible traînée) gagne Monza, Las Vegas, Bakou ; McLaren (virages lents, motricité, refroidissement) gagne
Monaco, Hongrie, Singapour, Zandvoort, Mexico ; Mercédès gagne Spa, Suzuka, Djeddah, Melbourne, Imola, Montréal.

## 3. Incohérences constatées (objectifs non atteints)

1. **D-083 non respectée** : McLaren devient la meilleure voiture en moyenne (+0,30 point) et gagne 18 circuits sur 30.
2. **Red Bull ne gagne nulle part** alors que son identité est « excellente en virages rapides ».
3. **Ferrari gagne Silverstone** (circuit de virages rapides) : effet de l'artefact de Silverstone (§4.2).

## 4. Causes : deux défauts de NOTRE moteur, pas des notes

1. **Le compromis appui / traînée est trop faible.** Avec l'aéro active, l'aileron chargé coûte peu en ligne droite : le meilleur
   réglage est l'aileron au maximum sur 25 circuits sur 30. Une voiture chargée et traînante (McLaren : appui +4,6 %, traînée +7,5 %) est
   donc presque toujours avantagée ; la faible traînée de Mercédès (−1,6 %) est sous-payée. Corriger les notes pour compenser serait
   masquer un défaut physique : **à corriger d'abord dans la physique** (phase 12, refonte D-163).
2. **Silverstone** : dérivées secondes ≈ 10 fois celles des autres circuits (bruit numérique du calcul des sensibilités) ; tout gros
   écart de voiture y est faussé.

Autres points :
- La note de **pneus** de la voiture est un bonus fixe provisoire (jusqu'à la phase 13) : McLaren à 19 en profite partout.
  Variante A (McLaren pneus 18) : McLaren 18,68 contre Mercédès 18,59, ne suffit pas.
- La **fiabilité** entre dans l'efficacité du châssis (choix de la 12a) : une voiture fragile est aussi plus lente, ce qui est discutable.
  Variante B (châssis = virages lents + rapides) : effet faible (Red Bull 17,33), même conclusion.
- Les identités **« motricité » et « freinage »** (McLaren, Haas) ne sont pas exprimables avec les six notes : elles passent par les virages
  lents et les pneus (suspensions). Une note « motricité/freinage » serait à décider par le porteur.

## 5. Proposition (rien n'est appliqué)

1. Corriger la physique : compromis appui/traînée (réglage optimal à l'intérieur de la plage sur la plupart des circuits, ordre public
   Monza/Las Vegas/Bakou/Spa < circuits moyens < Monaco/Hongrie/Singapour), sensibilités robustes (Silverstone), température du mois du GP.
2. Relancer ce banc avec la proposition du porteur, puis seulement ajuster les notes si un écart reste.
3. Décider : fiabilité hors du châssis (variante B) ; éventuelle note « motricité/freinage ».
