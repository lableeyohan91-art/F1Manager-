# Phase 3 — La saison abstraite

> Statut : **PROPOSÉ**. Le principe d'un modèle abstrait est **VALIDÉ** (D-007). Les formules et les fourchettes cibles sont à valider et à calibrer.
> Objectif : des saisons complètes, avec Grands Prix, points, classements et primes, sans course visible. Ce modèle sera remplacé plus tard par le moteur de course 2D, qui devra conserver le même équilibre.

## Contenu

### 1. Calendrier

20 Grands Prix (proposition D-030) sur des circuits fictifs de 5 types : rapide, lent et sinueux, mixte, urbain, altitude. Chaque circuit a un « climat » (probabilité de pluie).

### 2. Indice de performance d'une écurie

En attendant le développement des monoplaces (phase 12), chaque écurie a un **indice de performance** par type de circuit, calculé à partir de 4 caractéristiques de voiture :

| Caractéristique | Effet |
| --- | --- |
| Appui | Circuits lents et sinueux, urbains |
| Efficacité aérodynamique (vitesse de pointe) | Circuits rapides |
| Motorisation | Rapides, altitude (fournie par le motoriste) |
| Fiabilité | Probabilité d'abandon mécanique |

**Évolution provisoire** (remplacée en phase 12) : pendant la saison et à l'intersaison, chaque caractéristique progresse selon une formule simple. Elle dépend des compétences du directeur technique et des responsables aéro et conception, du niveau des installations, de la cohésion des départements et du budget de développement. Elle comprend aussi une part d'aléa (bonne ou mauvaise intuition technique) et un léger rappel vers la moyenne, pour éviter les dominations éternelles.

### 3. Modèle de résultat d'un Grand Prix

Pour chaque voiture :

```
score = indice_voiture(type de circuit)                       (poids principal)
      + niveau_pilote(vitesse, régularité, pluie si pluie)     (poids secondaire)
      + forme du jour (confiance en soi, moral)
      + aléa (loi normale)
```

Puis :

1. **Abandons mécaniques** : probabilité selon la fiabilité.
2. **Incidents de course** : probabilité selon la régularité du pilote, plus élevée sous la pluie et sur circuit urbain.
3. Classement des voitures restantes par score, puis attribution des points selon le règlement.
4. **Explication** conservée pour chaque résultat : part de la voiture, du pilote, de la forme et de l'aléa, cause d'un éventuel abandon. Elle alimente le « Pourquoi ? ».

Les écarts sont exprimés en **pourcentage de temps au tour** équivalent, pour rester compatibles avec le futur moteur de course.

### 4. Classements et primes

- Classement des pilotes et des constructeurs.
- Primes de fin de saison selon le classement constructeurs (répartition fixée par le règlement).
- Événements produits : victoire, podium, premiers points, abandon, titre. Ce sont les futures sources de souvenirs (phase 4).

### 5. Diagnostic et chronique

- Diagnostic : calendrier, résultats par Grand Prix avec leur explication, classements, historique des saisons.
- **Chronique v1** : un résumé lisible généré par saison (« Saison 2029 : X domine la première moitié, Y revient grâce aux circuits rapides… »), à partir de modèles de phrases fournis par ChatGPT.

## Fourchettes cibles (proposition)

Inspirées des ordres de grandeur de la F1 réelle sur les 20 dernières saisons. **À relire par ChatGPT et par le porteur.** Mesures sur 100 graines × 10 saisons.

| Indicateur | Fourchette cible |
| --- | --- |
| Vainqueurs de Grand Prix différents par saison | 3 à 8 |
| Écuries différentes victorieuses par saison | 2 à 5 |
| Part des victoires de l'écurie la plus performante d'une saison | 35 % à 80 % |
| Champions pilotes différents sur 10 saisons | 3 à 7 |
| Taux d'abandon par départ | 5 % à 15 % |
| Saisons où la dernière écurie marque au moins 1 point | 40 % à 90 % |
| Écart de performance entre la première et la dernière écurie | 1,5 % à 4 % du temps au tour |
| Une écurie reste-t-elle championne 5 saisons de suite ? | possible, mais dans moins de 25 % des séries de 10 saisons |

## Critères de validation

| # | Critère | Comment on le vérifie |
| --- | --- | --- |
| 1 | Tous les indicateurs dans les fourchettes cibles | Rapport automatique sur 100 graines × 10 saisons |
| 2 | La meilleure voiture ne gagne pas tout, la pire ne gagne presque jamais | Inclus dans le rapport |
| 3 | Chaque résultat a une explication | Test automatique + diagnostic |
| 4 | Tous les coefficients dans `balance/`, documentés | Relecture |
| 5 | Chronique de 10 saisons lisible et crédible | Lecture par le porteur et ChatGPT |
| 6 | Durée : une saison simulée en moins d'1 s sur PC | Lanceur sans écran |

## Hors du périmètre

Pas de qualifications ni de stratégie (elles viendront avec le moteur de course), pas de sponsors (phase 5), pas de souvenirs (phase 4). Les événements sont seulement produits et conservés.

## Décisions nécessaires avant de démarrer

D-030 (nombre de Grands Prix), D-031 (barème de points), validation des fourchettes cibles ci-dessus.
