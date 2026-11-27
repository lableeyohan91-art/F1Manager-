# Phase 13a — la course tour par tour : pneus, carburant, batterie, consignes, arrêts (conception, 27/11/2026)

> Porteur (27/11, soir) : « allez go coder tout ça, on fait le point demain, tu as carte blanche, on ajuste après ». Les 5 décisions du bilan
> préparatoire (`phase-13-bilan-preparatoire.md` §6) sont prises selon les recommandations de Claude Code (D-192) : découpage 13a → 13f,
> un seul moteur à deux finesses, sang-froid = le trait existant, énergie physique des pilotes en 13c, vue 2D schématique dès 13b.
> Fiche d'intention : `docs/echanges/2026-11-23-intention-phase-13-courses.md` (§4 les quatre leviers, §5 les pneus et le carburant).
> Statut : conception validée par carte blanche ; **à relire avec le porteur**. Valeurs PROVISOIRES (D-120).

## 1. Ce qui change

Avant : une course = un seul tirage (voiture + pilote + forme + aléa), sans pneus, carburant, batterie ni arrêt.
Après (13a) : chaque pilote fait **tous les tours** de la course. Son temps total est la somme de ses tours et de ses arrêts. La base de
rythme reste la même (voiture, pilote, forme, aléa de course : l'équilibre actuel est conservé) ; s'y ajoutent les ressources.
Pas encore de positions sur la piste ni de dépassements localisés (13b) : le classement se fait au temps total.

## 2. Unités

Tout est en **% du temps au tour de référence du circuit** (comme les écarts actuels). Nombre de tours : durée cible d'une course
(`COURSE_TOURS.dureeCibleS`, 5 000 s) divisée par le temps au tour de référence du circuit (profil de vitesse, phase 12), borné à 40–80.
Le temps « de course » d'un pilote = moyenne de ses tours en % + arrêts ramenés au tour.

## 3. Les pneus

Trois composés secs (tendre, moyen, dur) : un écart de rythme à neuf et une usure par tour (en % du tour, linéaire), puis une « falaise »
après une durée de vie (usure beaucoup plus forte). L'usure est multipliée par :
- la dégradation propre au circuit (exigence `degradationPneus`, 1 à 5) ;
- la gestion des pneus du pilote (compétence) et de la voiture (caractéristique) : ±3 % par point autour de la référence ;
- les consignes de conduite et de pneus (§5).
Sous la pluie : un composé pluie unique, pas d'arrêt obligatoire. Sur le sec : **au moins deux composés** (donc au moins un arrêt).

## 4. Carburant et batterie

- **Carburant** : la charge de départ est calculée pour finir au rythme neutre. Consigne agressive : plus rapide, consomme plus ; si le
  carburant manque, le pilote doit économiser (perte de temps nettement plus forte que le gain). Conservatrice : plus lent, consomme moins.
- **Batterie (ERS)** : une réserve d'énergie de déploiement. Agressive : plus rapide tant qu'il reste de l'énergie ; à vide, plus lent le
  temps de recharger. Conservatrice : recharge, un peu plus lent. Au total, sur une course entière, la batterie ne crée pas de temps : elle
  le **déplace** (utile en 13b et 13c pour attaquer ou défendre au bon moment).

## 5. Les quatre consignes (même commande pour le joueur et l'IA : `course.consignes`)

Pour chaque pilote : conduite, batterie, carburant, pneus ∈ {agressive, neutre, conservatrice}. Avantages et inconvénients :
| Consigne | Agressive | Conservatrice |
| --- | --- | --- |
| Conduite | plus rapide ; pneus usés plus vite ; plus d'incidents | plus lente ; pneus préservés ; moins d'incidents |
| Pneus | plus rapide ; usure plus forte | plus lente ; usure plus faible (relais plus longs, arrêt en moins possible) |
| Carburant | plus rapide ; consommation plus forte (risque d'économie forcée) | plus lente ; marge de carburant |
| Batterie | plus rapide tant que la réserve tient, puis plus lente | recharge |
Aucune consigne ne doit dominer partout (bancs prévus). En 13a, l'IA garde les consignes neutres (13d : IA qui choisit).

## 6. Stratégie et arrêts

- Chaque écurie choisit **sa stratégie avant la course** : nombre d'arrêts (1 à 3) et composés, en calculant le temps prévu avec **son
  estimation** de l'usure (l'ingénieur se trompe un peu : erreur selon la qualité du directeur sportif, 13d l'approfondira). Mêmes règles
  pour tous.
- **Arrêt** = perte dans la voie des stands (`COURSE_TOURS.perteVoieS`) + immobilisation selon l'équipe des stands (phase 8d : rapidité
  0–100 → 2,0 à 3,5 s ; fatigue en plus) + erreur possible selon la précision (quelques secondes). **L'équipe des stands compte enfin**
  (exception temporaire de D-132 levée).

## 7. Ce qui est conservé et ce qui est mesuré

Conservé : barème des points, abandons (mécaniques, incidents ; la conduite agressive augmente le risque d'incident), pression, forme,
affinités, expérience, explication du résultat (complétée : pneus, arrêts, consignes).
Bancs (rapport 13a) : campagne complète 20 × 30 contre la référence ; consignes « tout agressif », « tout neutre », « tout conservateur »
(aucune ne doit dominer) ; effet de l'équipe des stands ; coût de calcul.

## 8. Format

Format 36 : consignes de course facultatives par pilote (`Ecurie.consignesCourse`), détail du résultat facultatif. Migration et test.
