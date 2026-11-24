# Phase 11b-1 — Test hors échantillon du modèle de vitesse (24/11/2026)

> Idée : figer le modèle calé sur les 5 circuits test, puis le confronter **sans aucun nouveau réglage** à 21 circuits qu'il n'a jamais vus.
> Traces : `data/circuits/validation/` (5 tours de qualification chacun, même méthode). Le calage ne lit pas ce dossier.
> Reproduire : `npx tsx tools/diagnostic-circuits.mts sortie.json data/circuits/validation` et `npx tsx tools/validation-categories-piste.mts`.
> Données : `donnees/validation-hors-echantillon.json`.

## 1. Résultat brut (adhérence de piste neutre, 1,0)

| Groupe | Écart moyen du tour | Écart absolu moyen | Pire cas |
| --- | --- | --- | --- |
| 15 circuits 2026 | +3,2 % (modèle trop lent) | 4,0 % | Zandvoort +10,1 % |
| 6 circuits 2025 (ancien règlement : comparaison indicative seulement) | +6,9 % | 6,9 % | Lusail +16,0 % |

Circuits 2026 : Bakou −0,1 % · Sepang −0,1 % · Las Vegas −0,8 % · Hungaroring +0,8 % · Barcelone +1,3 % · Spielberg +1,9 % · Miami +2,3 % ·
Austin +3,5 % · Albert Park +4,3 % · Montréal −4,9 % · Madrid +6,3 % · Silverstone +6,7 % · Spa +7,4 % · Shanghai +9,1 % · Zandvoort +10,1 %.

## 2. Lecture

- Le modèle **généralise raisonnablement**, avec un écart absolu de 4 % en moyenne sur des circuits jamais vus. Il n'est donc pas un simple ajustement aux 5 circuits test.
- Il a un **biais systématique** : trop lent dans les **courbes rapides** (Zandvoort, Spa, Silverstone, Shanghai) et en vitesse de pointe (10 à 30 km/h de moins sur la plupart des circuits). C'est **le même défaut qu'à Suzuka** : la cause est dans le modèle ou dans la mesure des courbes rapides, pas propre à Suzuka.
- **Hypothèse testée : l'adhérence par catégorie de piste.** Permanent 1,067 (moyenne de Monza et Suzuka), urbain 0,935, semi-urbain 1,0 : une prédiction, pas un calage.
  - Le biais moyen passe de +3,2 % à +2,0 %, l'écart absolu de 4,0 % à 3,7 %.
  - L'amélioration est **réelle mais modeste**, et Madrid se dégrade (+10 %) : la catégorie « urbain » ne lui convient pas.
  - **Non adoptée** à ce stade.
- **Effets physiques encore absents**, à étudier sur l'ensemble des courbes rapides avec ces 21 circuits comme juges :
  1. **le relèvement des virages** (Zandvoort, la grande courbe relevée de Madrid) ;
  2. **la mesure des rayons dans les courbes rapides** (positions espacées de 18 m à haute vitesse) ;
  3. **l'appui à haute vitesse** (forme de la courbe d'appui).

## 3. Conséquence pour la suite

- On **ne corrige plus Suzuka seule** : on corrige le défaut commun, en mesurant chaque correction sur les 21 circuits de validation.
- Les 5 circuits test restent la base à valider par le porteur ; les 21 autres servent de juges, **sans entrer dans le jeu**.
