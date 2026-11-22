# Phase 15 — Direction artistique et immersion

> Statut : **ORIENTATIONS** (22/11/2026), demande du porteur. **Pas d'implémentation avant la fin des mécaniques et de l'équilibrage.** Ce document fixe ce qu'il faut anticiper techniquement dès maintenant, pour que la phase 15 ne demande aucune refonte.
> Rôles : **ChatGPT** assure la direction artistique et la génération des ressources graphiques ; **Claude Code** assure l'intégration technique (format, chargement, liaison aux entités, packs) ; **le porteur** valide le style.

## 1. Ambition

Une interface premium, immersive, sportive et moderne. Les courses restent en 2D, mais l'environnement de management bénéficie de visuels réalistes et cinématographiques. Les illustrations servent l'**attachement** aux personnages, aux écuries et à leur histoire.

## 2. Ressources envisagées (plusieurs centaines d'images)

| Famille | Exemples | Lien avec la simulation |
| --- | --- | --- |
| Portraits | Pilotes, ingénieurs, dirigeants, agents ; vieillissement visible | Une identité visuelle persistante par personne |
| Écuries | Quartiers généraux, logos, couleurs, livrées | Identité de l'écurie ; livrée qui change avec les sponsors |
| Infrastructures | Soufflerie, simulateur, usine, garages, à plusieurs niveaux | Niveau et état de l'installation |
| Monoplaces et pièces | Voitures, ailerons, plancher, unité de puissance | Concepts techniques (phase 12) |
| Circuits | Environnements, vues de piste, météo | Circuit et conditions du Grand Prix |
| Événements | Signature de contrat, présentation de voiture, victoire, podium, retraite, crise, titre | Type d'événement du journal |
| Organisations | Logos de l'instance dirigeante, des sponsors fictifs, des motoristes | Organisations du monde |

## 3. Anticipation technique (à prévoir dès maintenant)

### 3.1 Séparation complète ressources / simulation

- Le moteur **ne connaît aucune image**. Il ne manipule que des **clés de ressources** (texte), jamais des fichiers.
- Les images sont résolues **par l'interface**, au moment de l'affichage, à partir de ces clés.
- La simulation et ses tests tournent sans aucune image : rien ne change pour le moteur si les ressources sont absentes.

### 3.2 Clés de ressources associées aux entités

Chaque entité affichable reçoit une **clé visuelle stable**, qui ne dépend pas de son nom (un nom altéré ou modifié ne casse pas le lien) :

| Entité | Clé | Règle |
| --- | --- | --- |
| Personne | `portrait:<id personne>` + **graine visuelle** (nombre tiré une fois à la création, sauvegardé) | La graine visuelle garantit la même apparence toute la carrière, et sert à choisir un portrait dans la bibliothèque procédurale |
| Écurie | `ecurie:<id>:logo`, `ecurie:<id>:qg`, `ecurie:<id>:livree:<saison>` | La livrée peut varier par saison |
| Installation | `installation:<type>:<niveau>` (+ variante d'écurie facultative) | Le visuel suit le niveau |
| Circuit | `circuit:<id>` (+ `:pluie`) | |
| Événement | `evenement:<type>` (+ variante selon le contexte : pluie, titre, première victoire…) | Illustration contextuelle choisie par règles d'affichage |
| Organisation | `organisation:<id>:logo` | |

**À faire dès la phase 5** (coût minime) : ajouter le champ facultatif `apparence` (graine visuelle, et plus tard traits physiques simples : âge apparent, teint, cheveux, signes distinctifs) aux personnes **à leur création**. Il est tiré dans le flux local de la personne (`generation:<id>`), donc déterministe, et sans effet sur la simulation. Une migration de sauvegarde ajoutera ce champ aux personnes existantes.

### 3.3 Bibliothèque de portraits pour les générations procédurales

- Un **catalogue** de portraits génériques, classés par critères (tranche d'âge, genre, origine, style), pour les personnes générées.
- Le choix se fait par la **graine visuelle**, parmi les portraits compatibles. Il est toujours le même pour une personne donnée, et deux personnes d'une même écurie évitent d'avoir le même portrait.
- **Vieillissement** : une personne qui change de tranche d'âge passe au portrait de la même « famille » dans la tranche suivante, si le catalogue en propose.

### 3.4 Images de remplacement

Chaque famille de ressources a une **image de remplacement** neutre et élégante : silhouette pour un portrait, blason généré à partir des couleurs pour un logo, pictogramme pour une installation. L'interface ne montre jamais d'image cassée.

### 3.5 Optimisation mobile

- Format **WebP** (AVIF à étudier), plusieurs tailles par image (vignette, carte, plein écran) et chargement de la bonne taille.
- **Chargement différé** : une image n'est téléchargée que lorsqu'elle devient visible.
- **Cache** : service worker de la PWA ; l'application et les ressources déjà vues restent disponibles hors ligne.
- **Budget de poids** : à fixer, par exemple 40 à 80 Mo pour le jeu complet. Les ressources lourdes (illustrations plein écran) se téléchargent à la demande, pas à l'installation.

### 3.6 Packs de ressources remplaçables

- Un **pack** = un manifeste (JSON) qui associe des clés de ressources à des fichiers, plus les fichiers eux-mêmes.
- **Ordre de résolution** : pack personnalisé du joueur → pack officiel → image de remplacement.
- Un pack peut ne couvrir qu'une partie des clés (seulement les portraits, par exemple).
- C'est la même logique que les données modifiables en CSV (D-047) : le monde et son apparence restent séparés et remplaçables.

## 4. Points d'attention (avis franc de Claude Code)

1. **Personnes inspirées du réel : pas de portraits réalistes qui leur ressemblent.** Générer des visages réalistes reconnaissables de Leclerc, Verstappen ou de leurs dirigeants pose un vrai problème : droit à l'image, et risque de contenu trompeur. C'est plus grave que les noms altérés, surtout dans un dépôt public. Je recommande :
   - des portraits **fictifs** pour tout le monde (aucune ressemblance volontaire avec une personne réelle) ;
   - ou, pour les personnages inspirés du réel, un style volontairement **non photoréaliste** (illustration, silhouette).

   Décision du porteur (D-079).
2. **Logos et livrées** : ils ne doivent imiter aucune marque, aucun logo ni aucune livrée réels (Ferrari, Red Bull…). Les écuries « inspirées » doivent avoir une identité visuelle propre.
3. **Droits sur les images générées** : vérifier les conditions d'utilisation de l'outil de génération (usage commercial, publication), et garder une trace de l'origine de chaque ressource (fichier de crédits dans chaque pack).
4. **Cohérence de style sur des centaines d'images** : prévoir une **charte graphique** (palette, éclairage, cadrage, gabarits de prompts) validée avant la production en masse, puis des lots de contrôle.
5. **Poids et performance** : c'est sur téléphone que l'ambition visuelle se heurte aux limites. Le budget de poids et le chargement différé ne sont pas des options.

## 5. Critères de validation (première version)

- Aucune image cassée : toutes les clés se résolvent vers une ressource ou une image de remplacement.
- Chaque personne garde le même portrait toute sa carrière (test automatique sur 50 saisons).
- Un pack partiel remplace exactement les clés qu'il couvre.
- Poids total et temps de chargement sur téléphone dans le budget fixé.
- Aucun portrait réaliste ressemblant volontairement à une personne réelle ; aucun logo ou livrée imitant une marque réelle (revue avant publication).
