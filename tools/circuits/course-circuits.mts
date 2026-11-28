/**
 * Phase 13b (28/11) : extrait des fiches de circuits (data/grille-2026/circuits-fiches.json, phase 11b) les deux données lues par la
 * course sur la piste : difficulté de dépassement (1 facile → 5 très difficile) et perte d'un passage par la voie des stands (s,
 * hors immobilisation). Écrit data/grille-2026/course-circuits.csv. Usage : npx tsx tools/circuits/course-circuits.mts
 */
import { readFileSync, writeFileSync } from 'node:fs';

const fiches = JSON.parse(readFileSync('data/grille-2026/circuits-fiches.json', 'utf8')) as {
  circuits: Record<string, { id: string; strategie: { difficulteDepassement: number; stands: { perteHorsImmobilisationS: number } } }>;
};
const lignes = ['id;difficulteDepassement;perteVoieS'];
for (const c of Object.values(fiches.circuits)) lignes.push(`${c.id};${c.strategie.difficulteDepassement};${c.strategie.stands.perteHorsImmobilisationS}`);
writeFileSync('data/grille-2026/course-circuits.csv', lignes.join('\n') + '\n');
console.log(`${lignes.length - 1} circuits écrits dans data/grille-2026/course-circuits.csv`);
