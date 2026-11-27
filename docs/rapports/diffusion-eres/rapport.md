# Diffusion du savoir et ères : mesure (27/11/2026)

Rapport court (D-120 : mesures indicatives). Conditions identiques : 10 graines × 30 saisons, scénario grille-2026, `npm run equilibrage` et `tools/diagnostic-hierarchies.mts`, analyse `tools/analyse-eres.py`.

## Ce qui est en place (depuis le rapport `equilibre-circuits`)

- Compromis de concept × 3 : améliorer un domaine en dégrade un autre.
- Diffusion du savoir en cours d'ère (part qui croît avec l'âge de l'ère) et copie des pièces des meilleurs.
- « Piste chez un concurrent » : un membre clé du personnel propose une piste trouvée en étudiant les voitures rivales ; le joueur choisit (étudier ou ignorer ; la piste peut être fausse).
- Nouvelle ère plus dure : perte du fondamental 0,75 × intensité, transfert de l'ancien savoir en (1 − I)³.
- Fiabilité et gestion des pneus plafonnées à 20 avec rattrapage (elles divergeaient sans fin).
- **Nouveau : rattrapage des motoristes**, 15 % par an de l'écart au meilleur moteur (`MOTORISTE_RATTRAPAGE`, `balance/developpement.ts`). Cause : les écarts de puissance restaient figés (Honda niveau 12 contre 19 chez Mercedes, environ 0,5 % du tour), ce qui empêchait le bas de grille de se resserrer.

## Resserrement au cours d'une ère (écart en % du temps au tour)

| Saison de l'ère | Avant (1re–11e / 1re–4e / 4e–11e) | Après rattrapage moteurs | Part du plafond (avant → après) |
| --- | --- | --- | --- |
| 1 | 0,84 / 0,26 / 0,57 | 0,77 / 0,21 / 0,56 | 66 → 69 % |
| 2 | 0,83 / 0,25 / 0,58 | 0,73 / 0,18 / 0,55 | 78 → 79 % |
| 3 | 0,83 / 0,22 / 0,62 | 0,72 / 0,16 / 0,56 | 85 → 86 % |
| 4 | 0,85 / 0,18 / 0,66 | 0,73 / 0,15 / 0,57 | 90 → 90 % |
| 5 | 0,88 / 0,17 / 0,71 | 0,65 / 0,11 / 0,54 | 91 → 93 % |
| 6 | 0,81 / 0,18 / 0,63 | 0,66 / 0,10 / 0,56 | 94 → 94 % |

(Saisons 7 et 8 : 3 à 4 ères seulement, non significatif.)

## Tous les indicateurs suivis

Tableaux complets : `campagne-avant-moteurs.md` et `campagne-apres-moteurs.md`. Principaux :

| Indicateur | Avant | Après | Sens |
| --- | --- | --- | --- |
| Séries de 30 saisons avec 5 titres consécutifs ou plus (dynasties) | 80 % | 70 % | mieux, objectif 0–25 % **non atteint** |
| Plus longue série de titres constructeurs | 5,3 | 5,2 | = |
| Champions constructeurs différents sur 30 saisons | 7,4 | 8,0 | mieux |
| Champions pilotes différents | 13,1 | 13,5 | hors cible (3–7), trop de rotation |
| Titres de McLaren (sur 300) | 74 | 57 | mieux, reste en tête |
| Titre ouvert avant la dernière manche | 28 % | 33 % | mieux |
| Lutte finale entre écuries différentes | 22 % | 29 % | mieux |
| Saisons très serrées entre écuries | 10 % | 15 % | mieux |
| Dominations entre écuries (≥ 120 pts) | 15 % | 14 % | = |
| Domination constructeurs (≥ 150 pts) | 31 % | 24 % | mieux |
| Remontées (+3 places) | 37,3 | 39,8 | mieux |
| Dernière écurie qui marque | 75 % | 81 % | mieux |
| Écart 1re–dernière voiture | 0,90 % | 0,79 % | **défavorable** : cible 1,5–4 % déjà manquée, s'éloigne |
| Vainqueurs de GP différents par saison | 8,0 | 8,5 | au-dessus de la cible (3–8) |
| Écuries victorieuses par saison | 5,9 | 6,2 | au-dessus de la cible (2–5) |
| Corrélation voiture ↔ points constructeurs | 0,68 | 0,64 | la voiture compte un peu moins |
| Transitions sans changement d'étage | 4 % | 8 % | légèrement plus figé |

## Lecture, dite franchement

- Le bas de grille ne diverge plus au cours d'une ère (4e–11e stable autour de 0,55 %) ; le haut se resserre nettement (0,21 → 0,10 %) : en fin d'ère, deux ou trois voitures quasi équivalentes, ce que voulait le porteur.
- Mais le bas de grille **ne se resserre pas** non plus : l'objectif « en fin d'ère, les pires à 16 et les meilleures à 18–19 » n'est atteint qu'en haut.
- L'écart en début d'ère (0,77 %) est plus faible qu'avant : on ne « repart pas de loin » autant que souhaité (« 15/20 »). La part du plafond au début d'ère est de 69 %. Le rattrapage moteur a aussi réduit l'écart de départ.
- La grille est globalement très serrée (0,79 % entre la 1re et la dernière voiture, cible 1,5–4 %) : beaucoup de vainqueurs différents. Ce choix est cohérent avec la demande du porteur (« si ça se joue en course en fin d'ère, c'est positif »), mais il s'éloigne des cibles D-081.
- Dynasties encore à 70 % : McLaren gagne par la régularité et ses pilotes, pas par sa voiture seule.

## Pistes (à décider, sans recalibrage prématuré, D-095)

1. Début d'ère plus éclaté : faire varier la perte de savoir selon les paris de concept, pour qu'une réforme rebatte vraiment les cartes.
2. Bas de grille : diffusion plus forte pour les écuries très en retard (elles copient plus facilement ce qui est loin devant).
3. Dynasties : moteur de course (prochaine étape) et usure du succès (D-140).
