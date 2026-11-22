# Fondations techniques des monoplaces — orientations pour les phases 12 et 13

> Statut : **ORIENTATIONS VALIDÉES** (D-114, 22/11/2026), demande du porteur et de ChatGPT. **Pas d'implémentation maintenant, pas de nouvelle phase.** Elles complètent D-107 (exigences des circuits), D-109 (phase 12) et D-103 (performance individuelle, phase 13). La modélisation détaillée sera proposée et validée au début des phases 12 et 13.
> Les exemples réels cités servent **uniquement à la conception**. Ils fixent des ordres de grandeur et ne seront jamais reproduits par des scripts. Dans le jeu, les noms restent altérés (D-042).

## 1. L'intention

Chaque monoplace doit avoir une **identité technique** : des forces, des faiblesses et des conditions optimales d'exploitation. **La meilleure voiture du championnat n'est pas la meilleure partout, dans toutes les conditions et dans toutes les situations de course.** Le développement ne consiste pas à monter toutes les notes jusqu'à une voiture parfaite (constat mesuré : c'est hélas le cas du modèle provisoire actuel, voir `phase-12-monoplaces.md` §5).

## 2. Situations de référence (ordres de grandeur, à faire émerger)

| Référence | Ce qu'elle doit pouvoir produire dans le jeu |
| --- | --- |
| Pole à Bakou 2023, puis 3e à plus de 20 s | Une voiture excellente sur un tour mais moins forte sur la durée (pneus, carburant, thermique) |
| Choix de 2021 : un peu de performance sur un tour contre la préservation des pneus | Un compromis de conception qualifications / course |
| Refroidissement insuffisant à Bahreïn 2024 (≈ 0,4 s par tour perdue) | Une gestion thermique qui coûte du rythme ; un arbitrage entre aérodynamique et refroidissement |
| Défense en ligne droite à Spa 2022 | Une vitesse de pointe qui permet de défendre face à une voiture plus rapide au tour |
| Difficultés sur bosses et vibreurs à Monaco 2024 | Une voiture globalement excellente gênée par la nature d'un circuit |
| Pole à Miami 2025, puis 4e à près de 40 s | Gestion des pneus et rythme de course déterminants |
| Mexico | Altitude, air peu dense, refroidissement et appui difficiles, trafic |

Sources indiquées par le porteur (à consulter lors de la conception détaillée) : rapports de Mercedes sur Bahreïn 2024 et sur l'altitude, articles de formula1.com (Ferrari 2021, Spa 2022, voitures 2022), résultats officiels de Bakou 2023 et de Miami 2025, communications de la FIA sur les règlements 2026.

## 3. Ce qu'il faut modéliser (paramètres synthétiques)

| Domaine | Paramètres de la voiture (proposition de regroupement) | Ce qu'ils produisent |
| --- | --- | --- |
| **Aérodynamique** | Appui, traînée, efficacité (appui par traînée), équilibre avant/arrière, stabilité de l'appui (hauteur de caisse, vent), sensibilité à l'air perturbé | Vitesse en virage selon le type de virage, vitesse de pointe, comportement en trafic |
| **Mécanique** | Adhérence mécanique, rigidité de la plateforme, motricité, stabilité au freinage, réactivité du train avant, stabilité du train arrière, comportement sur bosses et vibreurs | Circuits lents ou bosselés, freinages, sorties de virage |
| **Groupe propulseur** (motoriste) | Puissance thermique, couple et réponse, efficacité énergétique, consommation, production de chaleur, fiabilité et durabilité, récupération et déploiement électriques, rendement de la batterie, encombrement et masse | Accélération, vitesse de pointe dans la durée, énergie disponible, chaleur à évacuer |
| **Intégration** (écurie) | Refroidissement (capacité, coût aérodynamique des entrées d'air), placement des radiateurs, masse, interfaces | Même moteur, résultats différents selon l'écurie |
| **Pneumatiques** (interaction voiture-pneus) | Vitesse de mise en température, largeur de la fenêtre de fonctionnement, sensibilité à la surchauffe, usure avant et arrière | Qualifications contre longs relais |
| **Fenêtre d'exploitation** | Étroitesse de la plage où la voiture donne son maximum (températures, piste, réglages, carburant, pilote) | Voitures pointues contre voitures polyvalentes |

## 4. Principe de modélisation proposé (à valider en phase 12)

L'objectif : une modélisation **simple, rapide sur téléphone, mais profonde**.

1. **Une frontière de compromis, pas des notes indépendantes.** Pour un règlement donné, chaque écurie dispose d'un « budget technique » qui délimite les combinaisons possibles. Par exemple, beaucoup d'appui **ou** peu de traînée, et une meilleure efficacité aérodynamique qui repousse la frontière sans la supprimer.
   - Le **concept** (la philosophie) est le point choisi sur cette frontière.
   - Le **développement** repousse la frontière, avec des rendements décroissants et des limites propres à chaque architecture.
   - Le **règlement** (phase 8) en fixe les bornes.

   C'est ce qui empêche la voiture parfaite et crée des identités, sans pénalité imposée.
2. **Des circuits découpés en segments types** : virages lents, moyens et rapides, lignes droites, freinages, zones bosselées, zones de récupération d'énergie. C'est le prolongement naturel des exigences de D-107, avec quelques colonnes de plus (bosses, vibreurs, température habituelle, potentiel de récupération). La performance d'une voiture s'évalue segment par segment. **Les dépassements et la défense naissent des écarts locaux** : vitesse de pointe, freinage, motricité. Ils ne dépendent pas de la moyenne au tour.
3. **Des états dynamiques bornés**, mis à jour par tour ou par segment, jamais au mètre près :
   - température du groupe propulseur, des freins et des pneus, niveau de la batterie, usure des pneus ;
   - chacun évolue selon l'effort, l'air ambiant (température, altitude), le trafic et la capacité de refroidissement ;
   - une surchauffe entraîne d'abord une consigne de gestion, puis une perte de performance, une réduction de puissance, une usure accélérée et, dans les cas graves, une défaillance. **Jamais d'abandon instantané au franchissement d'un seuil.**
4. **Une chaîne de causes, sans double comptage.** Par exemple : air perturbé → perte d'appui → glissement → échauffement des pneus → usure. Chaque maillon n'agit **qu'une fois**, et l'on n'ajoute pas un malus « trafic » séparé qui recompterait la même perte.
5. **Qualifications et course ne sont pas deux notes.** Les mêmes paramètres, appliqués à des conditions différentes (carburant, pneus neufs, déploiement d'énergie, trafic, thermique dans la durée), produisent naturellement des voitures fortes sur un tour et d'autres fortes sur un relais. Les règles du parc fermé et des modes moteur sont respectées.
6. **Aspiration et air perturbé sont distincts.**
   - En ligne droite, suivre réduit la traînée (aspiration).
   - En virage, suivre fait perdre de l'appui et de l'équilibre, chauffer les pneus et gêne le refroidissement, selon la sensibilité propre de chaque voiture et le règlement aérodynamique.
7. **Énergie** : une batterie qui se vide et se recharge selon les zones, avec un déploiement offensif ou défensif et des limites réglementaires. L'**aérodynamique active** (configurations virage et ligne droite, règlement réel de 2026) est prévue comme une option du règlement, sans figer le jeu dans un seul cycle.
8. **Motoristes** :
   - qualités intrinsèques du groupe propulseur, et qualité de son **intégration** propre à chaque écurie (refroidissement, masse, carrosserie) ;
   - les clients reçoivent **la même spécification**, selon les règles d'égalité de fourniture du cycle réglementaire.
9. **Pièces** (phase 12, D-109) :
   - chaque pièce agit sur plusieurs paramètres (aileron avant, aileron arrière, fond plat, carrosserie et pontons, châssis, suspensions, refroidissement, freins, transmission) ;
   - les pièces interagissent, et la **cohérence du concept** compte : assembler les meilleures notes ne donne pas la meilleure voiture ;
   - on peut développer des versions par type de circuit (spécification faible traînée, fort appui) ;
   - les effets estimés diffèrent des effets réels selon la corrélation entre simulation, soufflerie et piste.
10. **Spécialisation ouverte à tous** : une écurie peut miser sur la faible traînée, l'adhérence mécanique, la préservation des pneus, le refroidissement et la fiabilité, ou les qualifications. **Aucun bonus réservé aux petites écuries** : une grande peut faire le même choix. Les résultats dépendent des décisions, des moyens et des compétences.
11. **Compatibilité pilote-monoplace** (D-107, phase 12e) : style de pilotage (les compétences freinage, virages lents et rapides, motricité existent déjà), préférences d'équilibre, adaptabilité, expérience, confiance, réglages. Adaptation progressive, parfois incomplète, y compris pour les meilleurs.

## 5. Ce qui existe déjà et servira de base

| Existant | Rôle futur |
| --- | --- |
| Exigences des circuits (D-107) : virages lents et rapides, freinage, motricité, lignes droites, pneus, effort physique, difficulté, risque | Base du découpage en segments |
| Compétences des pilotes (D-104) | Compatibilité et exploitation des segments |
| Altitude des circuits, poids de la motorisation en altitude | Thermique et densité de l'air |
| Compétences des ingénieurs (corrélation, innovation, conception) | Écart entre estimation et réalité, recherche avancée |
| Budget, plafond, installations, enveloppe d'investissement (phase 5) | Moyens du développement |
| Forme, affinités, sang-froid (D-103, D-105) | Autres sources de variété du moteur de course, dans le même budget de variance |

## 6. Interface et rapports (même information pour le joueur et l'IA)

- Forces et faiblesses ; performance attendue par circuit ; rythme estimé en qualifications et en course ; sensibilité au trafic ; risque de surchauffe ; énergie ; dégradation des pneus ; compatibilité avec les pilotes ; effets attendus des nouvelles pièces, **avec leur incertitude**.
- Les rapports d'ingénieurs expliquent les causes. Par exemple : « excellent rythme en air libre, mais nous perdons beaucoup de temps derrière les autres voitures : sensibilité aérodynamique et refroidissement insuffisant ». Ces rapports s'appuient sur la chaîne de causes du §4.4.
- La gestion peut être déléguée aux ingénieurs (D-109).

## 7. Laboratoire (scénarios contrefactuels à prévoir)

- Voiture à fort appui contre voiture à faible traînée, à Monacco et à Monzza.
- Rythme de qualifications contre rythme de course.
- La même voiture en air libre et dans le trafic.
- Deux systèmes de refroidissement à Mexico.
- Deux moteurs de puissance proche mais d'efficacité différente.
- Une voiture qui préserve ses pneus contre une voiture très rapide sur un tour.
- Deux pilotes dans la même voiture.
- Une évolution moins bonne que prévu.
- Une petite écurie spécialisée qui défend sa position.
- La diversité des concepts après 10, 30 et 50 saisons.

Il faut mesurer l'effet de chaque mécanisme **et leurs interactions**, et vérifier qu'aucune philosophie n'est toujours la meilleure. Aucun résultat n'est forcé (D-081, D-095).

## 8. Points de vigilance (avis de Claude Code)

1. **La frontière de compromis est la pièce maîtresse.** Bien posée, elle règle d'un coup la voiture parfaite, l'identité des voitures et la spécialisation. Mal posée, elle devient un système arbitraire de bonus et de malus. C'est donc la première chose à concevoir et à tester en laboratoire, dès la phase 12a.
2. **Le moteur de course de la phase 13 est le vrai lecteur de tous ces paramètres.** Avant lui, le modèle abstrait n'en exploitera qu'une partie (rythme par segment, qualifications contre course). Certains paramètres (air perturbé, thermique dans le trafic, énergie) n'auront d'effet réel qu'en phase 13. Il faudra respecter la règle « pas d'attribut sans formule » : on n'ajoute un paramètre que lorsqu'une formule le lit.
3. **Performance mobile** : 22 voitures × 60 tours × une dizaine de segments, cela fait environ 13 000 évaluations par course, ce qui reste léger. Il faut éviter tout calcul continu (au mètre ou à la milliseconde) et toute physique détaillée.
4. **Données** : il faudra de nouvelles colonnes pour les circuits (bosses, vibreurs, températures, récupération d'énergie) et des profils de départ pour les 11 voitures et les 5 motoristes. C'est un travail de données important, à prévoir avec ChatGPT.
5. **Double comptage avec l'existant** : la « gestion des pneus » est aujourd'hui une caractéristique de la voiture **et** une compétence du pilote. En phase 12, il faudra séparer clairement ce qui revient à la voiture (chauffe, usure par essieu) de ce qui revient au pilote (gestion, adaptation).
