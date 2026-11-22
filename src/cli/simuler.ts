/**
 * Lanceur sans écran.
 * Exemple : npm run simuler -- --graine 42 --saisons 50 --scenario vide-demo --sortie sorties/partie.sav
 */

import { performance } from 'node:perf_hooks';
import { creerScenarioGrille2026, empreinte, enregistrerScenario, formaterDate, scenario, SEMAINES_PAR_AN_EXPORT, verifierCoherence } from './_moteur';
import { lireDonneesGrille2026 } from '../platform/node/donnees';
import { ecrireSauvegarde } from '../platform/node/stockage';
import { lireArguments } from './arguments';

const args = lireArguments(process.argv.slice(2));
const graine = Number(args['graine'] ?? 42);
const saisons = Number(args['saisons'] ?? 10);
const nomScenario = args['scenario'] ?? 'vide-demo';
const sortie = args['sortie'] ?? `sorties/${nomScenario}-g${graine}-s${saisons}.sav`;

if (!Number.isInteger(graine) || !Number.isInteger(saisons) || saisons < 0) {
  console.error('Arguments invalides : --graine et --saisons doivent être des entiers positifs.');
  process.exit(1);
}

if (nomScenario === 'grille-2026') enregistrerScenario(creerScenarioGrille2026(lireDonneesGrille2026()));
const sc = scenario(nomScenario);
const monde = sc.creerMonde(graine);
const moteur = sc.creerMoteur();

const debut = performance.now();
moteur.avancer(monde, saisons * SEMAINES_PAR_AN_EXPORT);
const duree = performance.now() - debut;

const taille = ecrireSauvegarde(sortie, monde);
// Sans vieillissement ni retraites (phase 6), la plausibilité des âges n'est vérifiée qu'au départ.
const problemes = verifierCoherence(monde, { ages: saisons === 0 });

console.log(`Scénario      : ${sc.nom} (graine ${graine})`);
console.log(`Simulé        : ${saisons} saisons, jusqu'à ${formaterDate(monde.date)}`);
console.log(`Durée         : ${(duree / 1000).toFixed(2)} s`);
console.log(`Événements    : ${Object.keys(monde.evenements).length} au journal, ${monde.chronique.length} dans la Chronique`);
console.log(`Sauvegarde    : ${sortie} (${(taille / 1024).toFixed(1)} Ko compressés)`);
console.log(`Empreinte     : ${empreinte(monde)}`);
console.log(`Personnes     : ${Object.keys(monde.tables['personnes'] ?? {}).length}, écuries : ${Object.keys(monde.tables['ecuries'] ?? {}).length}`);
console.log(problemes.length === 0 ? 'Cohérence     : OK' : `Cohérence     : ${problemes.length} problème(s)\n- ${problemes.slice(0, 20).join('\n- ')}`);
