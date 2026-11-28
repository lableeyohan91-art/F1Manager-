# Phase 13e — la course en direct (conception et mise en œuvre, 28/11/2026)

> Cadre : audit du moteur de course (D-194, ligne 13e : « préparer la stratégie, laisser l'ingénieur gérer, alertes aux moments clés,
> consignes en direct, explication de chaque gain ou perte ») ; porteur le 28/11 : « go ». Carte blanche de la phase 13 (D-192).

## 1. Principe : ce qu'on regarde est ce qui compte

La semaine d'un Grand Prix, la partie s'arrête avant la course et propose : **regarder la course en direct** ou **la simuler** (l'ingénieur
et le stratège gèrent, comme pour l'IA).
- L'écran ne calcule rien. Il demande au moteur un **aperçu** : qualifications, puis course jusqu'à la fin du tour voulu, avec les mêmes
  tirages et les mêmes règles que la vraie course, **sans rien modifier du monde** (`apercuGrandPrix`).
- Les ordres du joueur passent par la commande commune `course.ordre` et sont gardés dans le Grand Prix. La vraie course, quand la semaine
  avance, les rejoue au même tour : le résultat est exactement celui qui a été regardé (testé).
- Coût : ≈ 15 à 20 ms par aperçu sur ordinateur ; la lecture va de 1 à 8 tours par seconde.

## 2. Ce que le joueur peut faire

- Lecture, pause, +1 tour, +5 tours, aller à l'arrivée ; pause automatique aux **moments clés** (voiture de sécurité, VSC, drapeau rouge,
  changement de météo, arrêt d'un adversaire juste devant ou juste derrière, abandon d'un de ses pilotes).
- Pour chacun de ses pilotes : **rentrer au stand** (tendre, moyen, dur, pluie) à la fin du tour suivant, puis un seul relais jusqu'à
  l'arrivée (le stratège peut encore proposer un arrêt) ; changer la **conduite**, la gestion des **pneus** ou la **batterie** (l'usure
  suit la nouvelle consigne).
- Ne rien faire : l'ingénieur et le stratège gèrent, avec les règles de l'IA.

## 3. Ce qui est expliqué

Journal « En direct » : dépassements faits et subis, places perdues (et si c'est après une erreur), arrêts et pneus choisis, abandons,
neutralisations et leur cause, météo, arrêts des adversaires directs.

## 4. Limites (assumées pour cette version)

- Une course commencée et quittée sans la terminer n'est pas reprise au même tour : les ordres déjà donnés sont gardés dans la sauvegarde,
  et la course se rejoue avec eux. (Format 37 inchangé : le champ `direct` du Grand Prix est facultatif.)
- Pas encore de vue de la piste : la vue 2D est la phase 13f.
- Les ordres d'arrêt remplacent toute la fin de la stratégie (un seul relais) ; pas de plan à plusieurs arrêts saisi en direct.

## 5. Phase 13f — vue 2D (28/11, porteur : « lance la 13f »)

Au-dessus du classement, le **vrai tracé** du circuit (fiche 11b, `A.carte`) et un point par voiture : couleur par écurie (palette neutre,
pas de couleurs de marques réelles), vos pilotes plus gros et nommés. La place d'une voiture sur le tracé vient de son **retard sur le
leader en tours** au moment où il boucle le tour affiché ; entre deux tours, les points glissent le long du tracé. Piste bleutée quand elle
est mouillée, filet jaune pendant une neutralisation. La vue ne fait qu'afficher l'aperçu du moteur : ce qui est vu est ce qui est calculé.
Limites : pas de voie des stands dessinée (une voiture qui s'arrête recule simplement sur le tracé) ; la position dans le tour est
reconstituée à partir des écarts, pas simulée mètre par mètre.
