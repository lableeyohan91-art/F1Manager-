/**
 * Rejoue une partie à partir de sa graine et de son journal de commandes, puis compare avec la sauvegarde.
 * Exemple : npm run rejouer -- sorties/partie.sav
 */

import { creerScenarioGrille2026, empreinte, enregistrerScenario, scenario } from './_moteur';
import { lireDonneesGrille2026 } from '../platform/node/donnees';
import { lireSauvegarde } from '../platform/node/stockage';

const chemin = process.argv[2];
if (!chemin) {
  console.error('Usage : npm run rejouer -- <fichier.sav>');
  process.exit(1);
}
const sauvee = lireSauvegarde(chemin);
if (sauvee.origine.scenario === 'grille-2026') enregistrerScenario(creerScenarioGrille2026(lireDonneesGrille2026()));
const sc = scenario(sauvee.origine.scenario);
const rejouee = sc.creerMoteur().rejouer(sc.creerMonde(sauvee.origine.graine), sauvee.journalCommandes, sauvee.date);
const a = empreinte(sauvee);
const b = empreinte(rejouee);
console.log(`Empreinte de la sauvegarde : ${a}`);
console.log(`Empreinte rejouée          : ${b}`);
if (a === b) console.log('Identiques : la partie se rejoue à l’octet près.');
else {
  console.error('DIFFÉRENTES : le déterminisme est rompu.');
  process.exit(2);
}
