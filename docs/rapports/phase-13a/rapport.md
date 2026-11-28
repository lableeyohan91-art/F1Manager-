# Phase 13a — course tour par tour : rapport (nuit du 27 au 28/11/2026)

Mesures indicatives (D-120). Conception : `docs/systemes/phase-13a-ressources-au-tour.md` (carte blanche du porteur, D-192).

## Ce qui est en place

Chaque Grand Prix est couru tour par tour (40 à 80 tours selon le circuit) : trois composés secs et un composé pluie (écart de rythme, usure
par tour, falaise), carburant (économie forcée si la consigne agressive l'épuise), batterie (réserve dépensée puis rechargée), quatre
consignes par pilote (commande commune `course.consignes`, réglables dans la fiche du pilote), stratégie choisie par l'ingénieur sur une
estimation de l'usure (erreur de 10 %), arrêts selon l'équipe des stands (rapidité, précision, fatigue : l'exception de D-132 est levée).
Pas encore de positions sur la piste (13b) : classement au temps total. L'IA garde des consignes neutres (13d).
Coût : une saison simulée passe de 3,1 à 3,3 s (+6 %).

## Campagne (20 graines × 30 saisons ; référence : économie v2 activée)

Tableau complet de tous les indicateurs : `comparaison.md`.

| Indicateur | Avant | Avec 13a |
| --- | --- | --- |
| Vainqueurs de GP différents par saison | 8,6 | 8,0 |
| Victoires inattendues par saison | 1,1 | 1,4 |
| Champions constructeurs différents | 8,1 | 8,8 |
| Plus longue série | 4,6 | 4,3 |
| Dynasties | 55 % | 45 % |
| Remontées | 42,8 | 41,8 |
| Titre ouvert | 33 % | 32 % |
| Lutte finale entre écuries | 30 % | 27 % (défavorable) |
| Saisons très serrées entre écuries | 15 % | 12 % (défavorable) |
| Dominations entre écuries | 12 % | **17 %** (défavorable) |
| Dernière écurie qui marque | 83 % | **73 %** (défavorable) |
| Taux d'abandon | 7 % | 7 % |

Lecture : les pneus et les arrêts ajoutent un écart réel entre écuries (gestion des pneus des pilotes et des voitures, qualité de l'équipe
des stands), ce qui creuse un peu le haut de grille. Stratégies observées : surtout un arrêt (moyen → dur), deux arrêts sur les circuits
dégradants.

## Bancs des consignes (8 saisons, une écurie change de consigne, les autres neutres ; contrefactuel)

1er banc : « pneus conservateurs » gagnait partout (+25 à +30 % de points) → valeurs revues. 2e banc : « conduite agressive » +5 % →
revue. **3e banc (valeurs actuelles)** : aucune consigne ne domine (écarts de −5 % à +1 % autour du neutre) ; « tout agressif » et « tout
conservateur » sont nettement moins bons ; la conduite agressive coûte un abandon de plus par saison et par écurie, la conservatrice en
évite un. Le neutre reste légèrement le meilleur en moyenne : les consignes deviendront utiles selon la situation avec 13b et 13c
(dépassements, défense, voiture de sécurité, fin de course). Tableaux : `banc1-*`, `banc2-*`, `banc3-*`.

## À faire

13b (positions sur la piste, dépassements, aspiration, vue 2D schématique), 13c (voiture de sécurité, pluie évolutive, undercut), 13d (IA
des consignes et de la stratégie, ingénieur imparfait selon ses compétences).
