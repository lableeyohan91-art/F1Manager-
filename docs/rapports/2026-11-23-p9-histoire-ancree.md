# Rapport court — Phase 9 : histoire ancrée (et point de fin de phase 8)

> Date : 23/11/2026. Mesures **indicatives** (D-120), sans recalibrage (D-095).
> Mêmes graines que la référence `p8d` (100 graines × 10 saisons) ; diagnostic humain sur 20 graines × 15 saisons.
> Les écarts mesurés cumulent la phase 9 et les décisions du point de fin de phase 8 : D-139 (lien social dans toutes les relations, plafond jamais voté au-dessus de 100 %), D-140 (usure du succès), D-141 (nombre de Grands Prix voté).
> Références conservées : `docs/rapports/reference/p9-*`.

## 1. Ce qui a été fait (D-143)

- **Passé humain 2010–2026** construit au départ, sans rejouer les saisons. Il comprend :
  - la familiarité des anciens collègues ;
  - les 22 histoires et rivalités réelles connues (`histoires.csv`) ;
  - des souvenirs inventés autour des faits : coéquipier du champion, mentorat, départs, titres ;
  - l'oubli des années écoulées.
- **Dates d'arrivée des dirigeants réels** (`carrieres.csv`, dates estimées à vérifier) : leur ancienneté et l'usure du succès existent dès 2027. Les personnages générés démarrent sans passé.
- **Chronique** : les titres 2010–2026 et les grandes ères (Red Bul 2010–2013, Mercédes 2014–2021).
- **La grille, les contrats et les voitures de 2027 sont inchangés**, ce que vérifie un test. Le départ prend 0,1 s de plus.
- **193 tests.**

## 2. Mesures

| Indicateur | p8d | p9 |
| --- | --- | --- |
| **Dynasties** (5 titres consécutifs ou plus, séries de 10 saisons) | 60 % | **53 %** (favorable) |
| Plus longue série de titres | 5,3 | 5,0 |
| Champions constructeurs différents sur 10 saisons | 2,7 | 2,9 |
| Remontées de 3 places ou plus | 6,0 | 6,4 |
| Part des victoires de l'écurie dominante | 60 % | 59 % |
| Écart 1re–dernière voiture | 1,57 | 1,55 (**toujours hors objectif**) |
| Dominations (≥ 120 points d'écart) | 17 % | 18 % (défavorable, dans le bruit) |
| Demandes de départ par saison | 2,6 | 4,0 (usure du succès) |
| Démissions | 0 | 0 |
| Groupes sociaux / taille | 6,2 / 5,7 | 7,7 / 5,5 (le passé commun les fait naître plus tôt) |
| Plafond budgétaire après 15 saisons | 194 à 258 M€ | 204 à 215 M€ (jamais au-dessus de la valeur de départ) |

Toutes les autres lignes varient de ±1 point au plus (référence complète jointe).

## 3. Lecture franche

- **Les dynasties reculent un peu** (de 60 à 53 %) avec l'usure du succès, désormais active dès le départ grâce aux anciennetés. On reste loin de l'objectif indicatif, ce qui est attendu avant les phases 12 et 13.
- **Le passé existe enfin** : anciens coéquipiers, rivalités, réussites communes et vieilles rancœurs sont là en 2027. Les relations restent modestes, car c'est le poids voulu par la mémoire v1 : une rivalité pèse peu.
- **À vérifier par toi** : les dates d'arrivée des dirigeants et les 22 histoires réelles sont des estimations de ma part. Elles sont dans les fichiers CSV, modifiables dans Excel.
- **Risque d'image** (rappel de D-043 et D-044) : reprendre des querelles réelles connues de personnes réelles, même sous des noms altérés, accroît le risque si le jeu est publié.
