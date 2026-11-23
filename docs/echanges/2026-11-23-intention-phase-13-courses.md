# Fiche d'intention — phase 13 (courses) — reçue le 23/11/2026

> Texte transmis par le porteur (rédigé avec ChatGPT), recopié tel quel, sans les doublons du copier-coller.
> Statut : **fiche d'intention** (étape 1 du processus de CLAUDE.md). Aucune conception validée, donc aucun code.
> Réponse de Claude Code et questions : voir la fin de ce fichier.

## 2. Philosophie fondamentale

Le joueur doit avoir envie de diriger une course.

Il doit pouvoir prendre des décisions réellement importantes : tenter un undercut, prolonger un relais, attaquer, économiser des pneus, utiliser davantage sa batterie, anticiper la pluie ou attendre une Safety Car.

Ces décisions ne doivent pas toujours fonctionner.

Une bonne décision augmente les chances de réussir, mais une stratégie intelligente peut parfois échouer et un pari audacieux peut parfois rapporter énormément.

Une petite écurie partie 18e peut exceptionnellement entrer dans les points grâce à une excellente stratégie et des circonstances favorables. Cela doit rester rare, mais possible.

Il ne faut jamais favoriser artificiellement le joueur ni imposer des erreurs ou des victoires pour équilibrer le championnat.

## 3. Le moteur : simulation physique par portions

Nous voulons à terme observer la course en 2D.

Par conséquent, le moteur ne doit pas se contenter de calculer un temps au tour et d'accumuler des secondes.

Il doit simuler la progression des 22 voitures sur une piste découpée en portions :

- Lignes droites et zones d'accélération.
- Freinages.
- Virages lents, moyens et rapides.
- Relances et sorties de virage.
- Bosses, dénivelés et zones difficiles.
- Zones de dépassement et trajectoires défensives.
- Entrée, voie et sortie des stands.

Chaque voiture doit posséder une position réelle sur la piste, une vitesse, un temps absolu, des ressources et un état mécanique.

Les dépassements doivent être décidés à l'endroit où ils se produisent réellement, et non automatiquement au passage de la ligne.

Le trafic, l'aspiration, la difficulté de doubler, la défense et les écarts doivent avoir des conséquences physiques.

La représentation 2D doit afficher les événements calculés par le moteur, pas inventer une animation après le classement.

Attention : nos géométries de circuit actuelles sont encore partiellement schématiques. Il faudra intégrer progressivement des données réelles vérifiées.

## 4. Les quatre leviers indépendants du joueur

Chaque pilote doit pouvoir recevoir quatre consignes :

- Conduite : agressive, neutre ou conservatrice.
- Batterie/ERS : agressive, neutre ou conservatrice.
- Carburant : agressive, neutre ou conservatrice.
- Gestion des pneus : agressive, neutre ou conservatrice.

Ces réglages peuvent être changés en course ou programmés pour des tours précis.

Chaque réglage possède des avantages et des inconvénients :

- Conduite agressive : meilleur rythme potentiel, mais plus de fatigue, d'erreurs, de collisions et de pénalités.
- ERS agressif : davantage de puissance immédiate, mais batterie qui se vide et nécessite une récupération.
- Carburant agressif : meilleure performance, mais risque de ne pas pouvoir terminer sans économiser ensuite.
- Pneus agressifs : davantage d'adhérence exploitée immédiatement, mais hausse de température et usure accélérée.

Il ne faut jamais créer une vitesse gratuite sans conséquence.

Le joueur doit apprendre à combiner les quatre leviers selon son objectif.

## 5. Les statistiques des pilotes

Nous avons 13 notes de pilotes existantes, auxquelles nous souhaitons ajouter une véritable note indépendante de sang-froid.

Chaque statistique doit avoir un rôle distinct, mesurable et pertinent selon la situation.

| Statistique | Rôle principal |
| --- | --- |
| Freinage | Distance de freinage, stabilité, attaques en bout de ligne droite, blocages |
| Virages lents | Précision et vitesse dans les virages serrés |
| Virages rapides | Stabilité et vitesse dans les grandes courbes |
| Motricité | Accélération en sortie de virage, notamment sous la pluie |
| Régularité | Constance des chronos et erreurs de précision |
| Dépassement | Qualité et réussite des attaques |
| Défense | Capacité à protéger une position |
| Pluie | Adaptation à l'adhérence humide et réduction des fautes |
| Gestion des pneus | Usure, température et capacité à prolonger les relais |
| Départs | Réaction, envol et premières positions disputées |
| Retour technique | Qualité des informations fournies aux ingénieurs |
| Condition physique | Résistance à la fatigue |
| Intelligence de course | Gestion des risques, des ressources et des situations |
| Sang-froid | Résistance à la pression, surtout en fin de course |

Le freinage, par exemple, ne doit pas donner de vitesse de pointe : il doit permettre de freiner plus tard, mieux contrôler sa voiture et réussir certaines attaques.

La défense ne doit pas simplement rendre le pilote plus rapide.

Le retour technique doit surtout améliorer les diagnostics et les recommandations des ingénieurs.

Chaque note doit produire des effets dans les bonnes circonstances, sans être systématiquement utile sur toutes les portions.

## 6. Énergie physique des pilotes

Nous voulons une jauge d'énergie de 0 à 100, avec trois zones :

- Verte : fonctionnement normal.
- Orange : fatigue visible et risques progressivement accrus.
- Rouge : forte vulnérabilité aux fautes.

La fatigue dépend du circuit, de la durée, de la température, de la condition physique, des duels et du rythme choisi.

Le sang-froid et la régularité permettent aux meilleurs pilotes de mieux résister sous pression.

Un pilote épuisé ne doit pas automatiquement commettre une erreur : sa probabilité d'en commettre augmente.

## 7. Profils spécialisés et équilibrage des notes

Nous avons effectué des tests avec les 22 pilotes dans une voiture identique sur les 24 circuits, en calculant leurs temps totaux de course.

Un problème est apparu : les classements étaient beaucoup trop similaires entre circuits.

Le pilote le mieux noté remportait presque toutes les courses parce que son profil était excellent partout.

Une expérimentation de spécialisation modérée a rendu les résultats plus variés, sans nécessiter de bonus artificiel par circuit.

Il faut poursuivre cet équilibrage.

Nous pouvons modifier, ajouter ou supprimer des notes si cela améliore la cohérence du moteur.

Mais nous ne voulons pas fabriquer des victoires. Les classements doivent émerger des compétences réelles dans le modèle.

Un spécialiste des virages lents doit être avantagé à Monaco. Un spécialiste des grandes courbes doit progresser à Suzuka. Un excellent gestionnaire de pneus doit gagner de la valeur pendant les longs relais.

## 8. Les voitures et les circuits

Les voitures doivent posséder des qualités et défauts différents : vitesse de pointe, aérodynamique, virages lents et rapides, motricité, freinage, refroidissement, efficience moteur, ERS, gestion des pneus, fiabilité et performances dans l'air sale.

Une écurie peut être très performante sur certains circuits et moins bonne sur d'autres.

La chaleur, la pluie, la dégradation, les pneus et l'altitude doivent modifier la hiérarchie des voitures.

Il faut éviter qu'une seule caractéristique domine toutes les courses.

## 9. Intelligence artificielle des écuries

L'IA adverse doit être compétente mais imparfaite.

Même les meilleurs ingénieurs peuvent se tromper : des équipes extrêmement compétentes peuvent perdre des positions sur de mauvais appels stratégiques.

Mais aucune équipe ne doit être programmée pour se tromper régulièrement par principe.

Chaque écurie doit posséder des qualités propres : ingénieurs, analyse des données, anticipation météo, communication, vitesse de réaction, confiance, pression et tolérance au risque.

Les meilleures équipes doivent prendre davantage de bonnes décisions en moyenne, sans connaître l'avenir.

Nous voulons également des cycles de confiance, limités et réversibles. Une petite équipe qui réussit plusieurs paris peut prendre confiance et devenir plus audacieuse pendant quelques courses. Une équipe qui accumule les erreurs peut hésiter davantage ou mal évaluer ses risques.

Les décisions doivent dépendre des objectifs au championnat. Une équipe sans point peut tenter un pari risqué pour accrocher P10. Une équipe qui défend une deuxième place au championnat peut préférer assurer ses points.

L'IA ne doit pas recevoir de handicap artificiel : ses erreurs doivent provenir de mauvaises analyses ou de décisions dont le moteur simule ensuite les conséquences.

## 10. Ingénieur de course

Le joueur doit disposer d'un ingénieur qui l'aide à préparer le week-end et à prendre des décisions pendant la course.

Il analyse les pneus, le carburant, la batterie, la météo, le trafic, les opportunités d'undercut et les neutralisations.

Ses conseils doivent être compréhensibles et intégrer des incertitudes. Il peut avoir raison, être trop prudent ou se tromper.

Le joueur doit pouvoir suivre ses conseils ou prendre ses responsabilités.

L'ingénieur ne doit jamais disposer des résultats futurs de la simulation.

## 11. Stratégies et événements de course

Le moteur doit offrir de vrais choix :

- Undercut ou overcut.
- Arrêt anticipé sous SC/VSC.
- Prolongation d'un relais en espérant une neutralisation.
- Pari sur l'arrivée ou la fin de la pluie.
- Changement précoce ou tardif vers intermédiaires ou pneus pluie.
- Sprint final en pneus tendres.
- Économie puis attaque sur quelques tours.
- Gestion d'un manque de carburant.
- Adaptation face à un adversaire qui tente lui aussi un pari.

SC, VSC, drapeaux rouges, accidents, abandons et pénalités doivent se produire avec des probabilités plausibles, dépendant des circonstances.

Problème déjà détecté en expérimentation : quand les adversaires ne réagissent pas aux événements, les stratégies du joueur semblent artificiellement trop efficaces. Toujours mesurer les choix contre 21 IA réactives.

## 12. Les futurs pilotes « Next Gen »

Toutes les mécaniques de notes, spécialisations, fatigue, sang-froid, progression et prise de décision doivent également fonctionner avec les futurs pilotes générés.

Ne pas créer simplement des jeunes pilotes dotés d'une note générale.

Chaque génération doit proposer des profils différents : grands freineurs, spécialistes de la pluie, excellents gestionnaires de pneus, pilotes très rapides mais irréguliers, bons défenseurs, profils sensibles à la pression, etc.

Il faudra gérer leur potentiel, leur développement, leurs faiblesses, leur expérience, leur progression et leur déclin.

Le système doit rester équilibré entre les pilotes existants et les futures générations : pas d'inflation systématique des notes.

## 13. Tests, validation et méthode de travail

Nous voulons des tests réels, sur de grandes campagnes, pas seulement des idées de fonctionnalités.

Comparer les 22 pilotes à voiture identique sur les 24 circuits, puis tester séparément les compétences en modifiant une note à la fois.

Tester les voitures avec différents profils de circuit, météo et pneus.

Tester les décisions du joueur contre plusieurs comportements d'IA : prudent, aléatoire, agressif, ingénieur compétent et ingénieur imparfait.

Mesurer les places gagnées et perdues, les points, les abandons, les temps totaux, les stratégies réussies et les paris catastrophiques.

Vérifier les contraintes physiques : batterie limitée, carburant non négatif, immobilisation réelle, usure cohérente, temps croissants, pas de dépassement impossible, pas de téléportation.

Ne jamais affirmer qu'un moteur est équilibré sur la base de quelques courses favorables.

Ne jamais confondre résultats du laboratoire et intégration réelle dans GitHub.

## 14. Priorités pour reprendre le développement

1. Vérifier les fichiers les plus récents d'APEX Lab et le véritable état du dépôt GitHub.
2. Auditer concrètement les 13 notes existantes et le sang-froid, puis corriger les statistiques trop passives.
3. Faire du moteur spatial par portions la source unique des temps, des positions, des ressources et des événements des 22 voitures.
4. Développer progressivement la géométrie et les trajectoires nécessaires à une vraie course 2D.
5. Améliorer l'IA stratégique imparfaite, les ingénieurs et les objectifs au championnat.
6. Tester toutes les décisions du joueur et leurs conséquences.
7. Préparer une documentation de transfert vers Claude Code, notamment pour la génération et l'évolution des pilotes Next Gen.

Règle ultime : nous voulons un jeu où le joueur peut réellement faire la différence grâce à son intelligence, mais où rien n'est garanti.

---

## Réponse de Claude Code (23/11/2026)

### État réel du dépôt (vérifié)

- Les **13 notes** de la fiche existent déjà dans le moteur, avec les mêmes noms (`balance/personnages.ts`, D-104). Le **sang-froid** existe aussi, mais comme **trait de personnalité** (D-105), pas comme note de pilotage : il règle la pression en lutte pour le titre et le stress.
- La course actuelle est un **modèle abstrait** (phases 3 et 6a+) : une note de course par pilote et par circuit, faite d'une **somme pondérée** des 13 notes selon les exigences du circuit, plus un aléa. Il n'y a ni position sur la piste, ni dépassement localisé, ni pneus, ni carburant, ni batterie, ni stands.
- **Conséquence (audit, priorité 2)** : défense, dépassement, départs, retour technique, condition et intelligence de course ne sont aujourd'hui qu'un **poids** dans cette somme (5 à 12 %). Elles rendent le pilote « un peu plus rapide partout » : c'est exactement le défaut décrit au §5. Seuls freinage, virages lents et rapides, motricité, pluie et gestion des pneus varient selon le circuit. Le retour technique ne sert pas encore aux ingénieurs.
- « APEX Lab » et « Paddock » (cités par la ROADMAP comme source des modèles pneus, essence et météo) ne sont **pas dans le dépôt**. Je n'y ai pas accès.

### Critique

1. **Ordre des phases.** Cette fiche décrit la phase 13. La ROADMAP prévoit 10 (joueur), 11 (médias), 11b (circuits en détail, D-145) et 12 (monoplaces) avant. Le moteur par portions a besoin des **tracés réels en segments** (11b) et des **caractéristiques des voitures** (§8, phase 12). Commencer par lui obligerait à bâtir sur des circuits schématiques, puis à tout recalibrer. Changer l'ordre est une décision structurante : c'est au porteur de trancher.
2. **Coût de calcul.** Aujourd'hui une saison complète se simule en environ 2 s. Une course de 22 voitures par portions, pour 20 à 24 Grands Prix, plus les championnats juniors et les saisons simulées sans le joueur, peut coûter 100 à 1000 fois plus. Il faudra sans doute **un seul moteur à deux finesses** (fine pour la course regardée, plus grossière pour les autres), avec la même physique, et le mesurer tôt sur téléphone.
3. **Sang-froid.** En faire une note de pilotage indépendante doublerait le trait de personnalité existant. Je propose de garder **une seule valeur** (le trait), lue par le moteur de course en fin de course et sous pression. Cela respecte la règle « un terme, un sens » du glossaire.
4. **Le reste est cohérent** avec les décisions existantes : aucune aide au joueur, IA sans handicap artificiel, mêmes commandes pour le joueur et l'IA, mesures contre 21 IA réactives.
