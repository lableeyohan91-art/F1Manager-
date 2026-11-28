// Conversion simple d'un rapport Markdown du projet en document Word (titres #, ##, ###, paragraphes, puces « - », tableaux « | »,
// gras **…**). Usage : node tools/md-vers-docx.cjs entree.md sortie.docx
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, HeadingLevel, LevelFormat, BorderStyle, Footer, AlignmentType, PageNumber } = require('docx');

const [entree, sortie] = process.argv.slice(2);
const LARGEUR = 9906, GRIS = 'E8ECF2';
const runs = (t, taille) => t.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((x) => x.startsWith('**') ? new TextRun({ text: x.slice(2, -2), bold: true, size: taille }) : new TextRun({ text: x.replace(/`/g, ''), size: taille }));
function tableau(lignes) {
  const c = lignes.map((l) => l.split('|').slice(1, -1).map((y) => y.trim()));
  const n = c[0].length;
  const poids = c[0].map((_, i) => Math.max(...c.map((r) => (r[i] ?? '').length)) + 4);
  const tot = poids.reduce((a, b) => a + b, 0);
  const w = poids.map((x) => Math.round((x / tot) * LARGEUR)); w[n - 1] += LARGEUR - w.reduce((a, b) => a + b, 0);
  const b = { style: BorderStyle.SINGLE, size: 4, color: 'B8C2CC' };
  const cel = (t, i, e) => new TableCell({ width: { size: w[i], type: WidthType.DXA }, shading: { fill: e ? GRIS : 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 40, bottom: 40, left: 70, right: 70 }, borders: { top: b, bottom: b, left: b, right: b }, children: [new Paragraph({ children: e ? [new TextRun({ text: t, bold: true, size: 16 })] : runs(t, 16) })] });
  return new Table({ width: { size: LARGEUR, type: WidthType.DXA }, columnWidths: w, rows: c.map((r, k) => new TableRow({ tableHeader: k === 0, children: r.map((t, i) => cel(t, i, k === 0)) })) });
}
const enfants = [];
const lignes = fs.readFileSync(entree, 'utf8').split('\n');
for (let i = 0; i < lignes.length; i++) {
  const l = lignes[i];
  if (l.startsWith('|')) {
    const bloc = [];
    while (i < lignes.length && lignes[i].startsWith('|')) { if (!/^\|\s*-+/.test(lignes[i])) bloc.push(lignes[i]); i++; }
    i--; enfants.push(tableau(bloc)); enfants.push(new Paragraph({ children: [] })); continue;
  }
  if (l.startsWith('# ')) enfants.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(l.slice(2))] }));
  else if (l.startsWith('## ')) enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(l.slice(3))] }));
  else if (l.startsWith('### ')) enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(l.slice(4))] }));
  else if (/^\s*[-*] /.test(l)) enfants.push(new Paragraph({ numbering: { reference: 'puces', level: l.startsWith('  ') ? 1 : 0 }, spacing: { after: 50 }, children: runs(l.replace(/^\s*[-*] /, ''), 20) }));
  else if (/^\d+\. /.test(l)) enfants.push(new Paragraph({ spacing: { after: 60 }, children: runs(l, 20) }));
  else if (l.startsWith('> ')) enfants.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: l.slice(2), italics: true, size: 19 })] }));
  else if (l.trim()) enfants.push(new Paragraph({ spacing: { after: 110 }, children: runs(l, 20) }));
}
const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 20 } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, color: '1F3A5F' }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, color: '2E5C8A' }, paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: 'puces', levels: [0, 1].map((level) => ({ level, format: LevelFormat.BULLET, text: level ? '◦' : '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540 + 360 * level, hanging: 270 } } } })) }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT] })] })] }) }, children: enfants }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(sortie, b); console.log('écrit', sortie); });
