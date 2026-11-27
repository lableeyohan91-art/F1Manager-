// Audit du modèle économique (27/11/2026) — génération du document Word.
// Données : docs/rapports/audit-economie-2026-11-27/donnees-audit.json (10 graines × 30 saisons pour les finances ; 20 × 30 pour les variantes).
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, HeadingLevel, LevelFormat, BorderStyle, Footer,
  AlignmentType, PageNumber,
} = require('docx');

const DOSSIER = path.join(__dirname, '..', 'docs', 'rapports', 'audit-economie-2026-11-27');
const D = JSON.parse(fs.readFileSync(path.join(DOSSIER, 'donnees-audit.json'), 'utf8'));
const LARGEUR = 9906;
const GRIS = 'E8ECF2', ROUGE = 'FCE4E4', VERT = 'E3F4E6', JAUNE = 'FFF4D6';

const n = (t) => new TextRun(t);
const gras = (t) => new TextRun({ text: t, bold: true });
const p = (contenu, opts = {}) => new Paragraph({ spacing: { after: 120 }, ...opts, children: Array.isArray(contenu) ? contenu : [n(contenu)] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const puce = (contenu) => new Paragraph({ numbering: { reference: 'puces', level: 0 }, spacing: { after: 60 }, children: Array.isArray(contenu) ? contenu : [n(contenu)] });
const r0 = (x) => String(Math.round(x));
const r1 = (x) => x.toFixed(1).replace('.', ',');

function tableau(entetes, lignes, largeurs, couleurs = {}) {
  const total = largeurs.reduce((a, b) => a + b, 0);
  const w = largeurs.map((x) => Math.round((x / total) * LARGEUR));
  w[w.length - 1] += LARGEUR - w.reduce((a, b) => a + b, 0);
  const bord = { style: BorderStyle.SINGLE, size: 4, color: 'B8C2CC' };
  const cellule = (texte, i, entete, fond) => new TableCell({
    width: { size: w[i], type: WidthType.DXA },
    shading: { fill: entete ? GRIS : fond ?? 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
    margins: { top: 50, bottom: 50, left: 80, right: 80 },
    borders: { top: bord, bottom: bord, left: bord, right: bord },
    children: [new Paragraph({ children: [new TextRun({ text: String(texte), bold: entete, size: 17 })] })],
  });
  return new Table({
    width: { size: LARGEUR, type: WidthType.DXA }, columnWidths: w,
    rows: [
      new TableRow({ tableHeader: true, children: entetes.map((t, i) => cellule(t, i, true)) }),
      ...lignes.map((l, k) => new TableRow({ children: l.map((t, i) => cellule(t, i, false, couleurs[k])) })),
    ],
  });
}

const E = D.ecuries;
const c = [];
const add = (...x) => c.push(...x);

add(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Audit du modèle économique')] }));
add(p([n('APEX Manager — 27 novembre 2026. Mesures sur 10 parties de 30 saisons (finances) et 20 parties de 30 saisons (variantes), mêmes graines, version actuelle du jeu (pistes D-184 et réduction des installations D-186 comprises). Aucun réglage du jeu n’a été modifié par cet audit : les deux variantes testées sont désactivées par défaut.')]));

add(h1('1. Ce qu’il faut retenir'));
add(puce([gras('L’argent va peu dans la voiture. '), n('Les grandes écuries encaissent 470 à 570 M€ par an mais n’en mettent que 54 à 58 dans le développement : le plafond de 215 M€ les bloque, et le reste part en dividendes (150 à 240 M€ par an) ou dort en trésorerie (jusqu’à 450 M€).')]));
add(puce([gras('Les petites écuries ont de la place sous le plafond, mais pas l’argent. '), n('Haas dépense 161 M€ sur 215 : 54 M€ de marge inutilisée. Et pourtant son propriétaire se verse 34 M€ de dividendes par an. C’est le défaut le plus net de l’audit.')]));
add(puce([gras('La limite de 25 M€ pour les infrastructures n’est atteinte par personne. '), n('Les écuries y dépensent 11 à 16 M€ par an. Ce n’est pas la limite qui empêche une écurie de rattraper son retard, c’est sa trésorerie. La variante « enveloppe modulée » ne change donc presque rien.')]));
add(puce([gras('Les primes à chaque Grand Prix (variante « à la F1 Manager ») '), n('ne changent pas l’équilibre (dans le bruit de la mesure), mais rendent chaque course visible dans les comptes : c’est un gain de ressenti, pas d’équilibrage.')]));
add(puce([gras('Le levier le plus fort n’est pas encore utilisé : '), n('les dividendes. Faire réinvestir le propriétaire d’une écurie en difficulté au lieu de se servir donnerait de l’argent réel aux petites écuries, sans rien retirer aux grandes.')]));

add(h1('2. Comment fonctionne notre économie'));
add(p('Les comptes sont écrits toutes les 4 semaines (13 fois par an). Trois contraintes séparées : la trésorerie (l’argent en banque), le plafond budgétaire (215 M€ de dépenses dites plafonnées par an) et l’enveloppe d’investissement (25 M€ par an pour les chantiers d’installations, hors plafond).'));
add(h2('2.1 Recettes'));
add(tableau(['Poste', 'Règle', 'Quand'], [
  ['Primes du championnat', 'Enveloppe de 1 100 M€ partagée selon le classement constructeurs de l’an dernier (14 parts pour le 1er, 5 pour les deux derniers : environ 147 à 52 M€)', '1/13 à chaque écriture'],
  ['Droits commerciaux', 'Base commerciale × popularité × force sportive', '1/13 à chaque écriture'],
  ['Sponsors', 'Contrats titre, principaux, secondaires ; objectifs et primes (podium, points, rang…)', '1/13 à chaque écriture, primes à l’échéance'],
  ['Apport du propriétaire', 'Selon le type de propriétaire, son ambition, les résultats et les pertes ; retrait possible', '1/13 à chaque écriture'],
  ['Exceptionnels', 'Sauvetage, rachat, indemnités reçues', 'Au moment du fait'],
], [3, 8, 3]));
add(h2('2.2 Dépenses sous le plafond (215 M€)'));
add(tableau(['Poste', 'Règle'], [
  ['Personnel plafonné', 'Salaires des cadres, sauf les trois mieux payés'],
  ['Départements', 'Effectif × (0,05 + 0,003 × niveau) M€ par personne'],
  ['Opérations', '1,2 M€ par Grand Prix'],
  ['Entretien des installations', '0,05 × niveau² × (1 + âge/30) M€ par installation (âge compté jusqu’à 15 ans)'],
  ['Développement', 'Recherche (part du budget) + projets de pièces payés au lancement'],
], [3, 9]));
add(h2('2.3 Dépenses hors plafond'));
add(p('Salaires des pilotes et des trois cadres les mieux payés ; marketing ; chantiers d’installations (25 M€ par an au plus) ; académie ; intérêts ; indemnités ; amendes ; dividendes versés au propriétaire.'));

add(h1('3. Comparaison avec le modèle de F1 Manager que tu décris'));
add(tableau(['Élément', 'F1 Manager (ta description)', 'Notre jeu', 'Écart'], [
  ['Enveloppe de départ', 'Oui', 'Oui (trésorerie de départ)', 'Aucun'],
  ['Améliorer installations et voiture', 'Oui', 'Oui (chantiers, projets de pièces)', 'Aucun'],
  ['Revenu fixe régulier', 'Tous les mois', 'Toutes les 4 semaines', 'Aucun'],
  ['Part fixe + part variable à chaque GP', 'Oui', 'Non : primes selon le classement de l’an dernier, étalées', 'Variante mesurée (§6)'],
  ['Salaires en enveloppe par catégorie', 'Oui', 'Départements : oui ; pilotes et cadres : contrats individuels', 'Partiel, voulu'],
  ['Plafond budgétaire', '—', '215 M€, avec amende et pénalité de soufflerie', 'Couche en plus'],
  ['Propriétaire, dividendes, dette, rachat', '—', 'Oui', 'Couche en plus : c’est là que l’argent se perd'],
], [3, 3, 4, 3]));

add(h1('4. Les chiffres par écurie (M€ par an, moyennes sur 30 saisons)'));
add(p('Classées par place moyenne au championnat constructeurs. « Fixes » = dépenses plafonnées hors développement (personnel, départements, opérations, entretien). « Marge » = place inutilisée sous le plafond.'));
add(tableau(['Écurie', 'Place', 'Recettes', 'Primes', 'Comm.', 'Sponsors', 'Apport', 'Fixes', 'Dév.', 'Marge', 'Dividendes', 'Tréso. fin'],
  E.map((x) => [x.nom, r1(x.place), r0(x.rec), r0(x.primes), r0(x.commercial), r0(x.sponsors), r0(x.apport), r0(x.fixes), r0(x.dev), r0(x.sousPlafond), r0(x.div), r0(x.treso)]),
  [3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  Object.fromEntries(E.map((x, i) => [i, x.nom === 'Haas' ? ROUGE : x.div > 140 ? JAUNE : undefined]).filter(([, v]) => v))));
add(p('Détail des installations : entretien de 15 à 24 M€ pour les écuries du milieu et du bas, 36 à 39 M€ pour les grandes ; chantiers d’installations : 11 à 16 M€ par an pour toutes (limite : 25).'));

add(h1('5. Les défauts trouvés'));
add(h2('5.1 Le plafond bloque les riches, l’argent part ailleurs'));
add(p('Les quatre grandes écuries ont 142 à 147 M€ de frais fixes sous le plafond : il ne leur reste que 54 à 58 M€ pour la voiture, moins que le milieu de grille (66 à 84 M€). Leur surplus (300 M€ et plus par an) n’a aucun usage sportif : dividendes et trésorerie dormante (Red Bull 454 M€, Aston Martin 402 M€ en moyenne). C’est cohérent avec la vraie F1 (le plafond sert à ça), mais pour le jeu cela veut dire que l’argent des grandes ne fait rien.'));
add(h2('5.2 Le piège de la pauvreté vient en partie des dividendes'));
add(p('Haas a 54 M€ de marge sous le plafond, des recettes de 271 M€, et verse 34 M€ de dividendes par an. La règle actuelle : au-delà d’une réserve de 3 mois de dépenses, le propriétaire prend une part du surplus (30 à 80 % selon son type), même quand l’écurie est dernière. Racing Bulls (47 M€) et Williams (68 M€) sont dans le même cas.'));
add(h2('5.3 La limite des infrastructures n’est pas la vraie limite'));
add(p('Personne n’atteint les 25 M€. Une écurie en retard n’agrandit pas faute de trésorerie (règle de prudence : au moins la moitié du coût du chantier en banque, au-delà de la réserve visée) et faute de marge sous le plafond pour l’entretien qui suivra. Augmenter la limite ne suffit donc pas : la variante modulée (jusqu’à +25 M€ pour les écuries en retard) ne change rien de mesurable.'));
add(h2('5.4 Une course réussie ne rapporte rien tout de suite'));
add(p('Les primes dépendent du classement de l’an dernier. Seules les primes d’objectifs des sponsors réagissent à une course. Le joueur ne voit pas l’argent bouger après un podium.'));

add(h1('6. Les deux variantes mesurées (20 parties × 30 saisons, mêmes graines)'));
add(p('Tous les indicateurs suivis, sans sélection (D-076). Primes à chaque GP : la moitié des primes est versée course par course selon le classement en cours. Enveloppe modulée : +8 M€ par niveau de retard d’installations, au plus +25 M€.'));
add(tableau(['Indicateur', 'Actuel', 'Primes à chaque GP', 'Enveloppe modulée'], D.comparaison, [8, 2, 2, 2]));
add(p([gras('Lecture : '), n('aucune des deux variantes ne change l’équilibre au-delà du bruit (les dynasties passent de 50 % à 60 % ou 35 %, mais elles bougent par pas de 5 % sur 20 parties ; les autres indicateurs bougent de 1 à 3 points). La variante des primes est un choix de ressenti ; l’enveloppe modulée n’est pas utile seule.')]));

add(h1('7. Solutions proposées (à toi de trancher)'));
add(tableau(['Solution', 'Ce que ça change', 'Effet attendu', 'Risque', 'Avis'], [
  ['A. Dividendes conditionnés aux résultats', 'Pas de dividendes (ou réduits) pour une écurie dans la seconde moitié du classement : le surplus reste disponible pour le développement', 'Haas +20 à 34 M€ de développement par an, Racing Bulls et Williams aussi ; aucun effet sur les grandes', 'Moyen : à mesurer (les écuries pauvres ont peu de surplus certaines années)', 'Recommandé'],
  ['B. Primes à chaque Grand Prix', 'Part variable (30 à 50 %) versée course par course', 'Ressenti : chaque course rapporte ; équilibre inchangé', 'Faible (mesuré)', 'Recommandé pour la V1'],
  ['C. Trésorerie dormante utilisée', 'Au-delà d’une réserve, l’IA finance ses chantiers d’installations (hors plafond) ou le propriétaire réduit son apport', 'Les grandes gardent leurs installations à jour ; moins d’argent inutile', 'Faible', 'Utile, pas urgent'],
  ['D. Aide aux chantiers des écuries en retard', 'Enveloppe modulée + règle de trésorerie assouplie pour les installations en retard (ou prêt)', 'Rattrapage des installations plus rapide', 'Moyen : la mesure montre que l’enveloppe seule ne suffit pas', 'À mesurer avec A'],
  ['E. Salaires en enveloppe par catégorie', 'Remplacer les salaires individuels des cadres par une enveloppe', 'Simplicité', 'Élevé : casse le marché du personnel et les contrats', 'Non recommandé'],
], [3, 4, 4, 3, 2], { 0: VERT, 1: VERT }));

add(h1('8. Suite proposée'));
add(puce('Tu choisis parmi A à E ; je code et mesure les solutions retenues (rapport complet, mêmes graines).'));
add(puce('Puis : objectifs chiffrés de la V1 (Audi, Alpine) et banc « joueur » qui dit si on les atteint.'));
add(puce('Puis : fiche de conception du mercato toute l’année (D-187), et réduction de l’avance de départ de McLaren.'));
add(p([gras('Provisoire : '), n('toutes ces mesures sont indicatives (D-120) ; la grande campagne d’équilibrage viendra après les phases 12 et 13.')]));

const doc = new Document({
  creator: 'APEX Manager', title: 'Audit du modèle économique',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, color: '1F3A5F' }, paragraph: { spacing: { before: 300, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 25, bold: true, color: '2E5C8A' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: 'puces', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT] })] })] }) },
    children: c,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(path.join(DOSSIER, 'audit-economie.docx'), b); console.log('écrit'); });
