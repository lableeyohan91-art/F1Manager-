# Phase 13c — aléas de course (conception technique, 28/11/2026)

> Cadre : audit du moteur de course (`docs/rapports/audit-moteur-course/`, plan D-194 : « voiture de sécurité, VSC, drapeau rouge ;
> pluie qui évolue ; undercut et overcut ; erreurs graduées ; fiabilité ; fatigue ; sang-froid en course ») ; porteur le 28/11 : « fais ce
> qui est prévu » ; carte blanche de la phase 13 (D-192). Valeurs PROVISOIRES (D-120). Statut : à relire.

La 13c est découpée en trois tranches, chacune mesurée :
- **13c-1** : neutralisations (voiture de sécurité, VSC, drapeau rouge), erreurs graduées, arrêts sous neutralisation ;
- **13c-2** : pluie qui commence ou s'arrête pendant la course, changement de pneus, réaction selon l'intelligence de course ;
- **13c-3** : fiabilité selon l'usure et la chaleur, fatigue physique, sang-froid dans les moments chauds.

## 1. 13c-1 — neutralisations et erreurs graduées

### 1.1 D'où viennent les neutralisations

Les abandons gardent leurs probabilités actuelles (taux mesuré ≈ 7 % par départ, à ne pas changer) ; ce qui change, c'est leur **effet sur la
course**, au tour où ils arrivent :
- abandon sur **accident** : voiture de sécurité avec la probabilité 0,25 + 0,12 × (risque d'accident du circuit − 1), sinon VSC avec 0,6 ;
  drapeau rouge (au lieu de la voiture de sécurité) avec 0,06 sur les circuits à risque 4 ou 5 ;
- abandon sur **panne** : VSC 0,35, voiture de sécurité 0,1 ;
- **débris** ou incident sans abandon : voiture de sécurité avec 0,08 par course, à un tour tiré.
Cibles (références publiques F1 récentes, à mesurer) : au moins une voiture de sécurité dans 40 à 55 % des courses, nettement plus sur les
circuits urbains ; VSC dans 25 à 40 % ; drapeau rouge dans 3 à 10 %.

### 1.2 Ce qui se passe pendant une neutralisation

| | Voiture de sécurité | VSC | Drapeau rouge |
| --- | --- | --- | --- |
| Durée | 3 à 5 tours | 1 à 3 tours | comme la voiture de sécurité, puis relance |
| Rythme | tour × 1,35 pour tous | tour × 1,3 pour tous | — |
| Écarts | regroupés (0,8 s entre deux voitures) | conservés | regroupés |
| Dépassements | interdits | interdits | interdits |
| Arrêt aux stands | perte de la voie × 0,45 | × 0,6 | changement de pneus gratuit pour tous |

Après une voiture de sécurité ou un drapeau rouge, la relance se fait peloton groupé : dépassements de nouveau possibles, souvent nombreux.

### 1.3 S'arrêter sous neutralisation (même règle pour toutes les écuries ; la vraie décision viendra en 13d)

Une voiture qui doit encore s'arrêter et qui a parcouru au moins 60 % de son relais prévu s'arrête pendant la neutralisation ; la suite
de sa stratégie est recalculée (les tours restants sont répartis entre les relais restants, dans les mêmes proportions). C'est ce qui
rend une voiture de sécurité « chanceuse » pour certains et coûteuse pour d'autres.

### 1.4 Erreurs graduées

À chaque tour, chaque pilote peut commettre une **petite erreur** (sortie large, blocage de roue) : probabilité 0,002 + 0,0004 ×
(20 − régularité), × consigne de conduite (incident), × 2 sous la pluie, × risque du circuit / 3 ; elle coûte 1 à 3 s. C'est la
situation de la compétence **régularité** (son poids dans le rythme moyen est gardé jusqu'à la campagne d'équilibrage).
Les erreurs graves restent les abandons sur accident (inchangés).

### 1.5 Ce que l'on garde

Grand Prix : liste des neutralisations (type, tour, durée, cause) — lue par la fiche du Grand Prix et la chronique ; explication du
résultat : nombre de petites erreurs. Événement `course.neutralisation` (causes : pilote et type d'abandon, ou débris).

### 1.6 Mesures

Fréquences par circuit ; part des victoires depuis la pole (13b : 75 %, beaucoup trop) ; corrélation grille → arrivée par circuit ;
dépassements ; campagne courte contre la 13b+.

## 2. 13c-2 — la pluie qui arrive ou qui s'arrête

### 2.1 La météo de la course

La probabilité de pluie du mois (climat réel du circuit, phase 11b) se répartit désormais entre trois cas :
- **départ sous la pluie** : probabilité × 0,65 ; la piste peut **sécher** pendant la course (35 % des cas, à un tour tiré entre 25 % et
  80 % de la course) ;
- **départ au sec, pluie en cours de course** : probabilité × 0,5 ; la pluie arrive à un tour tiré entre 20 % et 85 % de la course et dure
  8 à 30 tours (elle peut durer jusqu'à l'arrivée) ;
- sinon, course au sec.
« Courses sous la pluie » (indicateur) compte les départs sous la pluie : il baissera mécaniquement, à lire avec le nouvel indicateur
« courses avec pluie à un moment ».

### 2.2 Ce que la pluie change à chaque tour

- Un tour mouillé est plus lent pour tous (+8 %) ; l'écart entre pilotes suit leur **compétence pluie** (rythme sous la pluie − rythme au sec).
- Pneus inadaptés : pneus secs sur piste mouillée +15 % ; pneus pluie sur piste sèche +4 %.
- La règle des deux composés secs ne s'applique plus dès qu'il a plu (comme en F1).

### 2.3 Réagir : quand changer de pneus (même règle pour toutes les écuries)

Quand la piste change, chaque voiture rentre changer de pneus après un **délai** de 0 à 4 tours : 2 tours − 0,25 × (intelligence de course
− 10), plus un aléa (écart type 1 tour), borné. C'est la **situation de la compétence intelligence de course**. Si la piste redevient comme
avant pendant le délai, la voiture ne rentre pas. Pneus pluie jusqu'à la fin (ou jusqu'à ce que la piste sèche) ; au retour du sec, le
composé sec qui tient jusqu'au bout (tendre, moyen ou dur selon les tours restants).

Le choix volontaire (anticiper, tenter le coup) viendra avec les décisions en course (13d) : à ce stade, seule la règle commune s'applique.

### 2.4 Ce que l'on garde

Grand Prix : départ sous la pluie ou non, tours où la piste change (fiche du Grand Prix, chronique).

## 3. 13c-3 — chaleur, fatigue, sang-froid

- **Fiabilité et chaleur** : la probabilité de panne est multipliée par 1 + 0,03 × (température du mois − 28 °C) au-delà de 28 °C
  (≈ × 1,2 à 35 °C). L'usure des composants sur la saison (moteurs, boîtes) n'est pas modélisée à ce stade.
- **Fatigue physique** (situation de la compétence **condition**) : à partir de la mi-course, perte de rythme qui grandit jusqu'à
  l'arrivée : 0,02 % × (exigence physique du circuit − 2) × avancement, × (1 − 0,07 × (condition − 12)), bornée à [0,3 ; 1,5] ; la
  fatigue augmente aussi la probabilité de petite erreur (× 1 + 2 × part de la fatigue maximale).
- **Sang-froid en course** (trait caché) : dans les 15 derniers % de la course, un pilote du podium avec une voiture à moins d'1 s derrière
  voit sa probabilité de petite erreur multipliée par 1 + 0,1 × (12 − sang-froid), au moins 0,5.
Ces effets sont petits et mesurés : ils doivent créer des histoires (une fin de course craquée, un pilote endurant qui revient), pas
changer la hiérarchie.
