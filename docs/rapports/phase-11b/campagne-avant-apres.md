# Phase 11b — Campagne avant/après : brancher les poids issus des tracés réels ? (24/11/2026)

> D-076 : mêmes graines (20 graines × 5 saisons), mêmes mécaniques ; seule différence, les poids des caractéristiques de la voiture par
> circuit. **Avant** : poids D-107, calculés à partir des 9 notes saisies à la main. **Après** : poids calculés par le profil de vitesse
> sur les tracés réels des 24 circuits (`data/circuits/poids-voiture-profil.json`, `tools/circuits/poids-voiture.mts`).
> Le jeu par défaut **n'est pas modifié** : les poids « après » ne sont injectés que pendant la mesure (`tools/campagne-circuits.mts`).

## 1. Courses (tous les indicateurs suivis)

| Indicateur | Avant | Après |
| --- | --- | --- |
| Écuries différentes victorieuses par saison | 3,48 | 3,48 |
| Part des Grands Prix gagnés par l'écurie championne | 62,1 % | 63,7 % |
| Concentration des victoires (0 = dispersées, 1 = une seule écurie) | 0,498 | 0,514 |
| Ressemblance entre chaque GP et le classement final (Spearman) | 0,863 | 0,869 |
| Écart entre le vainqueur et le 2e (% du temps au tour) | 0,265 | 0,261 |
| Temps de calcul par saison | 1,30 s | 1,29 s |

## 2. Identité des circuits (mesure statique sur les 24 circuits)

| Indicateur | Avant | Après |
| --- | --- | --- |
| Caractéristique n° 1 : virages lents / virages rapides / vitesse de pointe / moteur / pneus | 7 / **8** / 2 / 6 / 1 | 9 / **1** / 9 / 3 / 2 |
| Voiture spécialisée la plus rapide (fort appui / faible traînée / virages lents / pneus) | **8** / 9 / 6 / 1 | **4** / 11 / 8 / 1 |
| Écart d'indice d'une voiture « fort appui » entre son meilleur et son pire circuit | 1,11 | 1,04 |
| Idem « faible traînée » / « virages lents » / « pneus » | 1,26 / 1,73 / 0,70 | 1,41 / 1,34 / 0,62 |

Voitures de même valeur moyenne (13), avec une spécialité : `tools/circuits/identite-statique.mts`.

## 3. Lecture

1. **Effet sur les courses : quasi nul**, et plutôt dans le mauvais sens (victoires un peu plus concentrées).
   - Les voitures du jeu se ressemblent encore trop pour que les circuits les départagent : le modèle de développement provisoire les fait converger (constat de `phase-12-monoplaces.md` §5).
   - **Les circuits ne créeront de vraies différences de hiérarchie qu'avec des voitures réellement spécialisées, donc en phase 12.**
2. **Défaut confirmé : les virages rapides disparaissent presque comme caractéristique n° 1** (8 circuits → 1). C'est le biais déjà vu à Suzuka et dans le test hors échantillon : le modèle est trop lent dans les grandes courbes, donc il sous-estime ce que l'appui y rapporte. Silverstone, Spa, Suzuka et Barcelone en souffrent.
3. Les autres familles sont justes et plus nettes qu'avant : Monaco, Mexico et Singapour pour les virages lents ; Monza, Las Vegas, Djeddah et Spa pour la vitesse de pointe.

## 4. Recommandation (à arbitrer par le porteur)

**Ne pas brancher ces poids maintenant.** Ils n'apportent rien aux courses actuelles, et ils introduiraient un biais contre l'appui.
- Garder le profil de vitesse pour la **fiche circuit** et pour préparer les phases 12 et 13.
- **Corriger d'abord le défaut des courbes rapides**, avec les 21 circuits de validation comme juges.
- Rebrancher et refaire cette campagne **au début de la phase 12**, quand les voitures auront de vraies identités.
