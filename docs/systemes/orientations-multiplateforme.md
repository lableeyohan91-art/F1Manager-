# Orientations — Application multiplateforme (Android, iPhone, PC) et performances

> Statut : **ORIENTATIONS VALIDÉES** (D-110, 22/11/2026). Elles complètent D-001 (TypeScript, Preact, Vite) et D-002 (application web installable, mobile d'abord, emballage Capacitor possible).

## 1. Principe

- **Un seul moteur de simulation** (`src/engine/`), identique sur toutes les plateformes. C'est déjà la règle : le moteur ne dépend ni de l'interface ni du navigateur.
- **Deux mises en page de l'interface** :
  - **mobile** : décisions essentielles, lecture rapide ;
  - **PC** : tableaux, graphiques, comparaisons et analyses côte à côte.
- **Toutes les fonctionnalités restent accessibles sur les deux supports.** Seule la présentation change.

## 2. Distribution

| Plateforme | Voie proposée |
| --- | --- |
| Android | Application web installable (déjà possible), puis emballage pour Google Play si souhaité |
| iPhone | Application web installable. À savoir : Safari impose des limites (stockage qui peut être effacé après une longue inactivité, moins d'arrière-plan). Pour l'App Store et un stockage fiable, il faudra un emballage natif (Capacitor, prévu par D-002) |
| PC | Navigateur, ou application installable ; emballage de bureau possible plus tard |

Le choix de l'emballage et la publication dans les magasins sont des décisions pour plus tard, sans effet sur le code du moteur.

## 3. Sauvegardes et synchronisation facultative

- Sauvegardes compactes, versionnées et migrées (déjà en place : format 8).
- **Synchronisation sans serveur à nous**, au début :
  1. exporter puis importer un fichier ;
  2. plus tard, et si le joueur le souhaite, le dépôt du fichier dans son propre espace de stockage en ligne.

  Un serveur dédié n'est pas nécessaire au départ.
- Le déterminisme et le journal des commandes permettent de vérifier qu'une sauvegarde reprise sur un autre appareil donne exactement la même suite.

## 4. Performances

| Moyen | État |
| --- | --- |
| Calculs lourds hors de l'interface (Web Worker) | Prévu par l'architecture ; le moteur est déjà compatible (aucun accès au navigateur) |
| Calculs regroupés (pas hebdomadaire, périodes de 4 semaines) | En place |
| Entités secondaires simulées à un niveau de détail adapté (karting et F4 abstraits) | En place (D-071) |
| Volumes bornés (souvenirs, événements, historiques) | En place |
| Chargement différé des images, qualité graphique adaptable en course 2D | Phases 13 et 15 |
| Taille des sauvegardes après plusieurs décennies | Mesurée par les tests (objectif < 12 Mo non compressé à 30 saisons) |

**Mesures sur de vrais appareils** : fluidité, temps de simulation d'une saison, mémoire, batterie, taille des sauvegardes à 10, 30 et 50 saisons, sur des Android et des iPhone de milieu de gamme.

- **Limite** : je ne peux pas faire ces mesures moi-même (pas d'accès à des téléphones).
- **Ce que je peux faire** : préparer une page de mesure intégrée au jeu, qui chronomètre la simulation et affiche les chiffres. Le porteur la lance sur ses appareils et me transmet les résultats.

Repère actuel, sur l'ordinateur de développement : environ 2,2 s pour 10 saisons, avec toute la simulation. Un téléphone de milieu de gamme sera plusieurs fois plus lent. C'est une raison de plus pour le Web Worker et la délégation.

## 5. Calendrier

| Quand | Quoi |
| --- | --- |
| Maintenant | Rien à coder. Les règles déjà en place (moteur pur, déterminisme, sauvegardes versionnées) rendent tout cela possible |
| Avant la première version jouable | Web Worker, page de mesure des performances, mises en page mobile et PC de l'interface de jeu (l'interface actuelle est un outil de diagnostic) |
| Plus tard | Emballage pour les magasins, synchronisation facultative |
