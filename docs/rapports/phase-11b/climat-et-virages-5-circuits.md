# Phase 11b-1 — Climat et numérotation des virages des 5 circuits test (24/11/2026)

## 1. Climat (dans chaque trace, champ `climat`)

Source : tableaux climatiques de Wikipédia, qui reprennent les normales mensuelles des services météo nationaux :
- Monza : armée de l'air italienne, 1971–2000 ;
- Monaco : Météo-France, 1981–2010 ;
- Suzuka : agence météo japonaise, station de Tsu, 1991–2020 ;
- Singapour : agence nationale de l'environnement, 1991–2020 ;
- Mexico : service météo mexicain, 1991–2020.

Les 12 mois sont stockés : si le calendrier déplace un Grand Prix, son climat suit. Les archives horaires (Open-Meteo) étaient bloquées par un quota ; elles serviront plus tard à affiner l'heure de la course.

| Circuit | Mois du GP 2026 | Air pendant la course | Jours de pluie dans le mois | Pluie pendant la course (estimée) | Repère réel |
| --- | --- | --- | --- | --- | --- |
| Monzza | septembre | 23,6 °C | 8,7 (E : millimètres ÷ 10) | ≈ 10 % | — |
| Monacco | juin | 23,7 °C | 4,1 | ≈ 5 % | — |
| Suzuca | mars | 13,4 °C | 10,5 | ≈ 12 % | — |
| Marinna Bay | octobre (course de nuit) | 29,4 °C | 15 | ≈ 17 % | 2 courses humides sur 16 (12,5 %, chiffre réel cité par APEX Lab) |
| Hermanos Rodrigues | novembre | 22,8 °C | 3,7 | ≈ 4 % | — |

Statuts :
- normales mensuelles : **V** ;
- température pendant la course : **E** (maximum moyen du mois ; de nuit, moyenne plus 1 °C) ;
- pluie pendant la course : **E**, avec une part **H** de 35 % des jours pluvieux où il pleut pendant les 2 heures de course.

Ces chiffres sont des **probabilités** pour le moteur, jamais des certitudes.

## 2. Numérotation officielle des virages (`data/circuits/virages-officiels.json`)

| Circuit | Rapprochement | Remarques |
| --- | --- | --- |
| Monzza | 11 sur 11, sûr | La Curva Grande contient 3 portions de tracé |
| Suzuca | 18 sur 18, sûr ou probable | Virages 1 et 2 dans une même portion (même sens), Spoon aussi ; 200R et « sous le pont » probables |
| Hermanos Rodrigues | 17 sur 17 | Virages 14–15 et 16–17 non séparés (à vérifier) |
| Monacco | 19 sur 19 | Mirabeau Bas et Portier dans une même portion, de même pour Rascasse et Anthony-Noghes ; **Piscine à vérifier** |
| Marinna Bay | Par l'ordre seulement | **À vérifier sur un plan officiel** (tracé modifié en 2023) |

Méthode : ordre, sens et vitesse réelle de chaque portion, rapprochés de la liste officielle. Statut **R**.
