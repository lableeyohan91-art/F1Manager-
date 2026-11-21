// Vérifie que le moteur (src/engine) reste « pur » : pas de navigateur, pas d'interface,
// pas de hasard ni d'heure non contrôlés (règles techniques de CLAUDE.md).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const INTERDITS = [
  { motif: /Math\.random\s*\(/, raison: 'Math.random : utiliser un flux de hasard à graine' },
  { motif: /Date\.now\s*\(/, raison: "Date.now : l'heure réelle est interdite dans le moteur" },
  { motif: /new\s+Date\s*\(/, raison: "new Date : l'heure réelle est interdite dans le moteur" },
  { motif: /performance\.now\s*\(/, raison: "performance.now : l'heure réelle est interdite dans le moteur" },
  { motif: /\bwindow\./, raison: 'window : le moteur ne connaît pas le navigateur' },
  { motif: /\bdocument\./, raison: 'document : le moteur ne connaît pas le navigateur' },
  { motif: /\blocalStorage\b|\bindexedDB\b/, raison: 'stockage navigateur : passer par src/platform' },
  { motif: /from\s+['"](preact|preact\/.*|node:.*)['"]/, raison: 'import interdit dans le moteur (interface ou Node)' },
  { motif: /from\s+['"](\.\.\/)+(ui|platform|cli)\//, raison: "le moteur n'importe ni l'interface, ni la plateforme, ni les outils" },
];

function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : /\.tsx?$/.test(nom) ? [chemin] : [];
  });
}

const erreurs = [];
for (const f of fichiers('src/engine')) {
  readFileSync(f, 'utf8').split('\n').forEach((ligne, i) => {
    const code = ligne.replace(/\/\/.*$/, '').replace(/^\s*\*.*$/, '');
    for (const { motif, raison } of INTERDITS) if (motif.test(code)) erreurs.push(`${f}:${i + 1} — ${raison}`);
  });
}
if (erreurs.length > 0) {
  console.error('Moteur impur :\n' + erreurs.join('\n'));
  process.exit(1);
}
console.log('Pureté du moteur : OK');
