/**
 * Phase 12a — sensibilités du temps au tour aux paramètres physiques de la voiture, sur les 30 circuits (D-170 §4.4).
 *
 * Pour chaque circuit : réglage d'ailerons optimal de la voiture de référence, temps au tour, puis dérivées première et seconde du
 * temps au tour pour une variation relative de chaque paramètre (différences centrées à ± PAS %). Au réglage optimal, la dérivée
 * première tient déjà compte, au premier ordre, du nouveau réglage qu'une voiture différente choisirait (théorème de l'enveloppe).
 *
 * Le moteur du jeu lit data/grille-2026/sensibilites-circuits.csv (pas les tracés, trop lourds pour le téléphone) : l'écart de temps au tour d'une voiture est
 * Σ d1 × x + ½ × d2 × x², x étant l'écart du paramètre à la référence, en %. À régénérer après tout recalage de la voiture de référence.
 * Usage : npx tsx tools/circuits/sensibilites-voiture.mts
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, profilVitesse, type Trace, type VoiturePhysique } from '../../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../../src/engine/balance/profil';
import { PARAMETRES_SENSIBILITE } from '../../src/engine/balance/monoplaces';

/** Pas de la différence centrée (%) : assez grand pour dépasser le bruit de la discrétisation, assez petit pour rester local. */
const PAS = 3;
const dossiers = ['data/circuits', 'data/circuits/validation', 'data/circuits/reconstruits'];
const traces = dossiers.flatMap((d) => readdirSync(d).filter((f) => f.startsWith('cir_') && f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${d}/${f}`, 'utf8')) as Trace & { altitudeM?: number }));

/** Voiture avec un paramètre multiplié par (1 + x %) ; « puissance » touche le thermique et l'électrique. */
function varier(v: VoiturePhysique, cle: string, x: number): VoiturePhysique {
  const f = 1 + x / 100;
  if (cle === 'puissance') return { ...v, puissanceThermiqueW: v.puissanceThermiqueW * f, puissanceElectriqueW: v.puissanceElectriqueW * f };
  return { ...v, [cle]: (v[cle as keyof VoiturePhysique] as number) * f };
}

const res: Record<string, { tempsS: number; niveauAileron: number; d1: Record<string, number>; d2: Record<string, number> }> = {};
for (const t of traces.sort((a, b) => (a.circuit < b.circuit ? -1 : 1))) {
  const c = { altitudeM: t.altitudeM ?? 0 }, k = courbures(t);
  const { niveau, profil } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  const base = avecAilerons(VOITURE_REFERENCE, niveau);
  const d1: Record<string, number> = {}, d2: Record<string, number> = {};
  for (const cle of PARAMETRES_SENSIBILITE) {
    const plus = profilVitesse(t, varier(base, cle, PAS), c, k).tempsS, moins = profilVitesse(t, varier(base, cle, -PAS), c, k).tempsS;
    d1[cle] = +((plus - moins) / (2 * PAS)).toFixed(5);
    d2[cle] = +((plus - 2 * profil.tempsS + moins) / (PAS * PAS)).toFixed(6);
  }
  res[t.circuit] = { tempsS: +profil.tempsS.toFixed(3), niveauAileron: niveau, d1, d2 };
  console.log(t.circuit.padEnd(16), 'aileron', niveau.toFixed(2), 'temps', profil.tempsS.toFixed(2), JSON.stringify(d1));
}
// Fichier lu par le moteur (chargement des données), une ligne par circuit.
const entete = ['id', 'tempsS', 'niveauAileron', ...PARAMETRES_SENSIBILITE.map((k) => `d1_${k}`), ...PARAMETRES_SENSIBILITE.map((k) => `d2_${k}`)];
const lignes = Object.entries(res).map(([id, r]) => [id, r.tempsS, r.niveauAileron, ...PARAMETRES_SENSIBILITE.map((k) => r.d1[k]), ...PARAMETRES_SENSIBILITE.map((k) => r.d2[k])].join(';'));
writeFileSync('data/grille-2026/sensibilites-circuits.csv', [entete.join(';'), ...lignes].join('\n') + '\n');
console.log(`${lignes.length} circuits écrits dans data/grille-2026/sensibilites-circuits.csv (pas ${PAS} %)`);
