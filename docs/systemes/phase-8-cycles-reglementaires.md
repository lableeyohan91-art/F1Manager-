# Phase 8 — Grands changements de règlement (cycles réglementaires)

> Statut : **ORIENTATIONS VALIDÉES** (D-090, 22/11/2026). La conception technique détaillée sera faite au début de la phase 8, puis soumise à validation. **Aucun code avant.**
> Origine : proposition du porteur (« de gros changements de réglementation tous les x années, votés ; un cycle met l'accent sur l'aéro, un autre sur le moteur… »).

## 1. Pourquoi

Dans la vraie F1, presque toutes les grandes séries de titres se sont terminées sur un changement de règlement : 2009 (double diffuseur), 2014 (moteurs hybrides), 2017 (voitures plus larges), 2022 (effet de sol), 2026. La phase 5a l'a mesuré : l'argent ne suffit pas à casser les dynasties (88 % des séries de 20 saisons en contiennent une, rapport P5a). Le changement de règlement est le levier **systémique et réaliste** qui manque (D-081).

## 2. Orientations validées

| Sujet | Décision |
| --- | --- |
| Fréquence | **Votée**, dans une fenêtre de **4 à 6 ans**. Le règlement est **annoncé 2 ans avant** son entrée en vigueur. |
| Qui décide du contenu | **La fédération propose** 2 ou 3 options (par exemple : accent aéro, accent moteur, accent pneus et mécanique, statu quo) ; **les écuries votent**, chacune selon son intérêt calculé (l'IA estime ce qui l'avantage) ; la fédération tranche en cas d'égalité. Le joueur vote comme les autres. Les alliances, le lobbying et les groupes viendront avec la politique de la phase 8. |
| Coups de génie | **Oui, rares et mérités** : une écurie peut trouver une astuce réglementaire (comme le double diffuseur). La probabilité augmente avec un directeur technique visionnaire et un fort investissement anticipé. L'effet est temporaire, car les autres copient en 1 à 2 saisons. |
| Calendrier | **Phase 8**, comme prévu par la feuille de route (avec la mémoire v2, les groupes sociaux et la politique). |

## 3. Principe à respecter : récompenser les choix, pas le hasard

Une simple remise à zéro serait un tirage au sort déguisé, contraire à D-081. Le changement doit **redistribuer selon les décisions et les forces de chacun** :

1. **Accent du cycle.** Un règlement modifie le poids des caractéristiques dans la performance. Exemples :
   - cycle aéro : virages rapides et efficacité aéro pèsent plus ;
   - cycle moteur : la motorisation pèse plus, ce qui redistribue les cartes entre motoristes ;
   - cycle pneus et mécanique : gestion des pneus et virages lents pèsent plus.

   Concrètement, ce sont les profils de circuit (`balance/circuits.ts`) que l'on multiplie.
2. **Convergence partielle.** À l'entrée en vigueur, les caractéristiques des voitures se rapprochent d'une base commune. Une part du savoir est conservée (ordre de grandeur : 30 à 50 %, à régler en laboratoire).
3. **Anticipation (le vrai dilemme).** Pendant les 2 ans d'annonce, chaque écurie choisit la part de son effort technique consacrée à la future voiture, au détriment de la saison en cours (« sacrifier une saison », déjà prévu par la fiche de la phase 5 §6). L'IA décide par utilité : un prétendant au titre investit moins, une écurie distancée investit plus. Le joueur décide par une commande.
4. **Forces dans le domaine mis en avant.** L'avantage de départ dépend de l'investissement anticipé et des compétences liées : département et responsable aéro pour un cycle aéro, niveau et investissement du motoriste pour un cycle moteur, etc.
5. **Motoristes.** Un cycle moteur fait évoluer les niveaux des motoristes selon leurs investissements, ce qui peut amener des changements de fournisseur (lien avec la phase 7 et les contrats moteurs).

## 4. Ce qu'il faut déjà anticiper (sans coder de nouveau système)

- Le règlement est déjà paramétré par monde (`parametre(monde, 'reglement.…')`) : les poids par caractéristique pourront y être rangés.
- Le budget de l'IA (phase 5) devra recevoir une ligne « voiture suivante ». Elle sera ajoutée au moment de la phase 8, avec migration de sauvegarde.
- Laboratoire : nouveaux indicateurs prévus :
  - dynasties qui survivent à un changement de règlement ;
  - part des titres qui changent de mains dans les 2 saisons suivant un changement ;
  - **valeur des décisions** (D-082) : les écuries qui ont anticipé en profitent-elles plus que les autres ?

## 5. Questions pour la conception détaillée (phase 8)

1. Liste exacte des options proposées par la fédération et leurs effets (poids par caractéristique).
2. Force de la convergence et durée de l'avantage d'un coup de génie.
3. Règles de vote : une voix par écurie, ou une pondération ? Unanimité pour les changements anticipés ?
4. Le plafond budgétaire et les restrictions aéro font-ils eux aussi partie des sujets de vote ? (D-012 l'envisage.)
