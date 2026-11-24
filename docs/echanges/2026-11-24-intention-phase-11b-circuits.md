# Fiche d'intention — phase 11b (circuits) — reçue le 24/11/2026

> Texte transmis par le porteur (rédigé avec ChatGPT), en deux messages, recopié fidèlement (mise en forme légère).
> Statut : **fiche d'intention** (étape 1 du processus de CLAUDE.md). Conception : `docs/systemes/phase-11b-circuits.md`.
> Demande explicite : audit, recherche documentaire, conception détaillée, mise à jour du plan ; **pas d'implémentation massive sans validation des choix structurants**.
> Message d'accompagnement du porteur : « On va faire les choses bien, ça devrait nous aider à dérouler plus simplement la phase 13 ; on ajustera si besoin, et la 12 aussi, parce que la mécanique des voitures va clairement dépendre des circuits. Comme d'habitude, dis-moi ce que tu en penses si tu es en désaccord. »

## Titre

APEX MANAGER — PHASE 11b : REFONTE COMPLÈTE DES CIRCUITS ET DE LEUR IDENTITÉ TECHNIQUE. Une fondation majeure, avant la phase 12 (développement des monoplaces) et la phase 13 (moteur de course détaillé). Objectif : des circuits assez différents pour que les caractéristiques des voitures, les compétences des pilotes, la météo et la stratégie aient de vraies conséquences.

## 1. Étudier le travail existant

Lire : ROADMAP (11b, D-145), `fondations-techniques-monoplaces.md`, `phase-12-monoplaces.md`, `2026-11-23-intention-phase-13-courses.md`, `phase-6a-complement-competences.md`, `orientations-performance-pilote.md`, `circuits.csv`, `balance/circuits.ts`, `saison/performance.ts`, les modèles Circuit, ExigencesCircuit, Voiture, GrandPrix. Ne pas détruire les fondations (exigences 1–5, pondérations voiture et pilote) : étudier leurs limites et préparer leur enrichissement.

Référence APEX Lab v0.9 (laboratoire indépendant) : pluie propre aux circuits, pluie intermittente, averses, humidité de piste ; SC, VSC, drapeaux rouges, jaunes et doubles jaunes ; undercut, overcut, opportunités sous neutralisation ; comparaisons à événements identiques. Campagne de 48 000 profils sur 24 circuits : 47,7 % de courses avec au moins une SC, 35,5 % avec une VSC, 7,7 % avec un drapeau rouge, 14,1 % avec de la pluie — **résultats du générateur du laboratoire, pas des statistiques réelles ni des cibles**. Rapport « APEX-Lab-rapport-v0.9.md » : signaler s'il n'est pas accessible.

## 2. Philosophie : des circuits réellement différents

Pas quatre ou cinq catégories. Chaque circuit a une identité technique et peut favoriser : vitesse de pointe, virages lents, rapides, intermédiaires, freinage, motricité, appui, efficacité aérodynamique, faible traînée, adhérence mécanique, bosses et vibreurs, gestion des pneus, refroidissement, efficacité énergétique, récupération et déploiement électriques, fortes chaleurs, temps froid, stabilité sur le mouillé, altitude. Exemples de travail (non définitifs) : Monza, Monaco, Suzuka, Spa, Singapour, Mexico, Bahreïn, Barcelone, Las Vegas. S'appuyer sur les caractéristiques réelles. La meilleure voiture peut rester globalement la meilleure, mais pas obligatoirement partout. **Aucune pénalité artificielle pour les équipes dominantes.**

## 3. Circuits en segments détaillés

Le moteur de phase 13 suivra 22 voitures sur une piste : il faut une géométrie exploitable, en portions ordonnées (lignes droites, accélération, freinage, virages lents, moyens, rapides, enchaînements, relances, bosses, vibreurs, montées et descentes, zones favorables ou difficiles pour dépasser, entrée et sortie des stands, voie des stands). Paramètres : longueur, position, courbure, rayon représentatif, vitesse de passage selon les conditions, importance de l'appui, de la motricité, intensité du freinage, abrasivité, adhérence, bosses et vibreurs, dénivelé, risque d'incident, possibilité de dépassement, contraintes énergétiques, sensibilité à la pluie. Physique simplifiée mais cohérente : dépassements à un endroit logique, vrais avantages et faiblesses par portion. L'affichage 2D représente ce que le moteur calcule. **Exactitude** : données géométriques réelles vérifiables, pas de tracés fictifs ; distinguer donnée réelle vérifiée, reconstruite, estimation technique, hypothèse de game design ; structure capable de conserver plusieurs configurations historiques.

## 4. Analyse technique approfondie

- **4.1 Aérodynamique** : appui, traînée, efficacité, équilibre avant/arrière, stabilité de plateforme, hauteur de caisse, vent, air perturbé, vitesse en virage et de pointe, compromis appui/traînée.
- **4.2 Mécanique** : adhérence mécanique, motricité, stabilité au freinage, train avant, train arrière, bosses, vibreurs, suspension, rigidité, irrégularités. Monaco doit pouvoir gêner une voiture excellente en aéro mais mauvaise sur les bosses.
- **4.3 Groupe propulseur et énergie** : puissance, couple, efficacité, consommation, chaleur, récupération et déploiement électriques, répétition des accélérations, zones énergivores, recharge. Respecter le règlement de l'année (2026 : architecture énergétique et aérodynamique différente) ; ne pas tout concevoir autour de l'ancien DRS ; architecture adaptable.
- **4.4 Refroidissement et thermique** (point important) : air, piste, altitude, moteur, freins, électrique, pneus, trafic, coût aéro des ouvertures, surchauffe. Progressif : température élevée → recommandation → baisse de performance → usure accélérée → défaillance possible en extrême. Pas de double comptage.
- **4.5 Pneumatiques et revêtement** : abrasivité, adhérence, évolution, énergie latérale et longitudinale, dégradation thermique et mécanique, usure avant/arrière, mise en température, surchauffe, froid, conséquences stratégiques. Distinguer gestion des pneus de la voiture et du pilote.
- **4.6 Altitude, météo et climat** : altitude, date, température moyenne et variabilité, probabilité et intensité de pluie, averses, humidité, vent, séchage, risques particuliers. Les fréquences historiques donnent des distributions, jamais des certitudes. La météo dépend de la date réelle du Grand Prix simulé.

## 5. Fiche circuit : deux caractéristiques essentielles et une moins importante

Afficher les deux caractéristiques de voiture les plus importantes et la moins influente. **Calculées avec les mêmes données et la même logique que le moteur de performance**, pas une liste écrite à la main. Distinguer : importance intrinsèque ; niveau réel de notre voiture ; avantage ou handicap face à la concurrence. Préciser à quelles conditions correspond le classement (normales, qualifications, rythme de course, prévision météo). Affichage simple par défaut, détails à ouvrir.

## 6. Fiche circuit : présentation au joueur (mobile)

- **A Présentation** : nom, pays, ville, tracé, longueur, virages, tours, distance, dénivelé ou altitude, sens, nature, historique succinct.
- **B Exigences** : les deux essentielles, la moins importante, une explication accessible.
- **C Conditions de course** : températures habituelles, probabilité climatique de pluie, dégradation, abrasivité, difficulté de dépassement, difficulté physique, risque d'incident, temps perdu au stand. Historique et prévision du week-end clairement distingués.
- **D Statistiques des neutralisations** (§7).
- **E Préparation sportive** (phases 12 et 13) : compatibilité voiture et pilotes, prévision, risques, conseils de réglage et de stratégie, incertitudes. La fiche doit aider à décider.

## 7. Historique SC, VSC et drapeaux rouges sur dix saisons

Pour les dix dernières éditions : nombre total d'interventions **et** nombre de Grands Prix concernés (deux statistiques différentes). Au départ d'une carrière : données réelles des dix éditions précédant le début du jeu, recherchées et vérifiées ; jamais dix éditions inventées pour un circuit récent ; distinguer éditions anciennes et récentes après une longue absence. Ensuite, les statistiques viennent progressivement des courses simulées, enregistrées durablement. Sources : FIA, F1DB, TracingInsights, OpenF1 (Race Control), comptes rendus officiels ; vérifier la couverture temporelle ; ne pas recopier les totaux cumulés d'APEX Lab. Si seul le nombre de courses concernées est connu, n'afficher que lui. Une saison sans Grand Prix n'est pas une édition sans incident.

## 8. Statistiques météorologiques historiques

Courses humides, pluie intermittente, forte pluie, températures, particularités saisonnières. Limites des archives ; distinguer données réelles, estimations climatologiques et probabilités du moteur. Une course humide n'est pas pluvieuse de bout en bout.

## 9. Direction de course : SC, VSC, drapeaux jaunes et rouges

Pas de SC déclenchée sans cause : erreur ou incident → danger → intervention nécessaire → décision (jaune local, double jaune, VSC, SC, drapeau rouge). Causes : accident, voiture immobilisée, débris, incident en zone dangereuse, météo, obstacle ou détérioration de la piste. Le circuit influence la fréquence des erreurs, la gravité, la difficulté de dégagement, les zones de sortie, les moyens d'intervention, les conséquences d'une voiture immobilisée (Monaco, Singapour contre grands dégagements). **Pas de SC artificielles pour atteindre une fréquence cible** : l'historique sert à vérifier. APEX Lab avait une fréquence insuffisante dans certaines simulations : tester sérieusement. Drapeaux rouges : interruption réelle, immobilisation, durée, reprise, écarts, changements de pneus autorisés, influence stratégique ; règles selon l'année.

## 10. Dépassement et stratégie

Identité stratégique : dépassement facile, qualification cruciale, opportunités liées aux pneus, undercut ou overcut intéressants, arrêts coûteux, neutralisations décisives. Données : lignes droites, zones d'attaque, freinages, largeur et difficulté des virages, possibilité de suivre, air perturbé, temps perdu au stand, traversée de la voie des stands, trafic après l'arrêt, dégradation, évolution de l'adhérence. Undercut et overcut peuvent fonctionner, aucun n'est systématiquement optimal ; succès selon pneus, températures, rythme, trafic, météo, écarts, moment, réactions, événements. Le personnel estime et explique, et peut se tromper.

## 11. Mettre en valeur les pilotes

Freineurs, spécialistes des virages lents ou des grandes courbes, gestionnaires de pneus, pilotes de pluie, défenseurs, pilotes intelligents (énergie). Problème identifié dans APEX Lab : des compétences ajoutées à une note globale font gagner le même pilote partout. Les compétences agissent **là où elles ont un sens** : le freinage ne donne pas de vitesse générale, la défense ne rend pas plus rapide, la gestion des pneus agit sur températures, usure et relais.

## 12. Lien avec la phase 12

La phase 11b fournit à la phase 12 de quoi rendre les choix de développement stratégiques (aileron faible traînée, grandes courbes, motricité, refroidissement, suspension pour les bosses, thermique des pneus, efficacité énergétique), avec des contreparties crédibles. **Aucune caractéristique décorative** : pour chaque paramètre technique, indiquer les contraintes de circuit qui le sollicitent, la formule qui le lit, les conséquences, les interactions, la phase où il devient opérationnel.

## 13. Vivier et calendrier

30 circuits, 20 Grands Prix, 10 permanents, rotation (feuille de route) ; 24 circuits aujourd'hui. Entrer, sortir, revenir, garder l'historique, configurations selon les époques. Ne pas effacer les statistiques d'un circuit qui quitte le championnat. Anticiper les changements de règlement et de date, et leurs conséquences météo.

## 14. Documentation et sources

Données réelles plutôt que des notes inventées : FIA, Formula1.com, F1DB, TracingInsights, OpenF1, rapports techniques et analyses d'ingénierie, sources météo fiables, plans officiels. Pour chaque donnée : provenance, année, fiabilité. Paramètres non observables estimés, marqués comme tels, méthode expliquée. Vérifier les conditions d'utilisation et de redistribution.

## 15. Tests obligatoires

- Voitures à caractéristiques globales comparables (faible traînée, fort appui, virages lents, virages rapides, pneus, mal refroidie, polyvalente), sur plusieurs circuits et météos : les hiérarchies changent naturellement.
- Les 22 pilotes en voiture identique, une compétence modifiée à la fois, sans fabriquer de victoires.
- Une même voiture au frais, en forte chaleur, sous la pluie, en altitude, dans le trafic, en air libre : différences explicables.
- Distributions de SC, VSC, drapeaux rouges, accidents, abandons, pluie par circuit sur de nombreuses graines, confrontées aux historiques.
- Undercut, overcut, arrêt sous neutralisation, échec par le trafic, pluie, coup d'éclat d'une petite écurie : contre 21 adversaires réactifs.
- Performance mobile : granularité des segments, calcul, mémoire.

## 16. Livrable de l'étude

1. Audit de l'existant. 2. Liste exhaustive des caractéristiques des circuits et de leur utilité. 3. Modèle de segments compatible avec le moteur 2D. 4. Méthode de calcul des deux points forts et du point le moins important. 5. Prototype de la structure de la fiche circuit mobile. 6. Plan de collecte SC/VSC/drapeaux rouges sur dix éditions, sources et limites. 7. Plan de collecte météo et température. 8. Différences techniques entre les 24 circuits et proposition de vivier. 9. Dépendances exactes avec les phases 12 et 13. 10. Tests et diagnostics, indicateurs mesurables. 11. Points à valider.

Précautions finales : ne pas modifier artificiellement les performances des écuries ; ne pas corriger les dynasties avant la fin de la phase 12 ; ne pas forcer SC ou VSC ; aucune stratégie systématiquement gagnante ; aucune donnée historique fictive ; ne pas révéler au joueur les résultats futurs ni les probabilités cachées. But : pouvoir se dire avant un Grand Prix « notre voiture devrait être forte ici grâce à son efficacité aérodynamique, mais la chaleur risque de nous pénaliser ; notre pilote est excellent dans les grandes courbes, mais il faudra surveiller les pneus », puis retrouver ces mêmes causes dans les performances simulées. **Circuit, voiture, pilote, conditions et stratégie : un seul système cohérent.**
