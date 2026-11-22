/** Outil de contrôle phase 5a : simule N saisons et affiche les comptes de chaque écurie. */
import { creerScenarioGrille2026 } from '../src/engine/scenarios';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';
import { table } from '../src/engine/core/monde';
import { TABLES, type Ecurie, type Finances, type Saison } from '../src/engine/model/types';
import { totalDepenses, totalPlafonne, totalRecettes } from '../src/engine/model/finances';

const graine = Number(process.argv[2] ?? 1);
const saisons = Number(process.argv[3] ?? 5);
const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const monde = sc.creerMonde(graine);
const moteur = sc.creerMoteur();
const anneeFin = monde.date.annee + saisons;
while (monde.date.annee < anneeFin || monde.date.semaine < 2) moteur.avancerUneSemaine(monde);
const fins = Object.values(table(monde, TABLES.finances)) as unknown as Finances[];
for (const fi of fins) {
  const e = table(monde, TABLES.ecuries)[fi.ecurie] as unknown as Ecurie;
  const l = fi.historique.map((h) => `${h.annee}: R${totalRecettes(h).toFixed(0)} D${totalDepenses(h).toFixed(0)} cap${totalPlafonne(h).toFixed(0)} dev${h.developpement.toFixed(0)} T${h.tresorerieFin.toFixed(0)}${h.depassement > 0 ? ' DEPASSE' + h.depassement : ''}`);
  console.log(e.nom.padEnd(22), l.join(' | '), '| budget', fi.budget.annee, fi.budget.developpementMEUR, fi.budget.strategie);
}
const ss = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine);
for (const s of ss) console.log(s.annee, s.constructeurs.map((c) => (table(monde, TABLES.ecuries)[c.ecurie] as unknown as Ecurie).nom.slice(0, 8)).join(' > '));
const ev = Object.values(monde.evenements).filter((x) => x.type.startsWith('conseil') || x.type.startsWith('finances.dep') || x.type.startsWith('finances.coupe'));
console.log(ev.map((x) => `${x.date.annee}-${x.date.semaine} ${x.type} ${x.texte ?? JSON.stringify(x.contexte)}`).join('\n'));
