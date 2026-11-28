/**
 * Phase 12a — sensibilités du temps au tour aux paramètres physiques de la voiture, sur les 30 circuits (D-170 §4.4).
 *
 * Pour chaque circuit : réglage d'ailerons optimal de la voiture de référence, temps au tour, puis dérivées première et seconde du
 * temps au tour pour une variation relative de chaque paramètre (ajustement par moindres carrés de −10 % à +10 %, phase 12c). Au réglage optimal, la dérivée
 * première tient déjà compte, au premier ordre, du nouveau réglage qu'une voiture différente choisirait (théorème de l'enveloppe).
 *
 * Le moteur du jeu lit data/grille-2026/sensibilites-circuits.csv (pas les tracés, trop lourds pour le téléphone) : l'écart de temps au tour d'une voiture est
 * Σ d1 × x + ½ × d2 × x², x étant l'écart du paramètre à la référence, en %. À régénérer après tout recalage de la voiture de référence.
 * Usage : npx tsx tools/circuits/sensibilites-voiture.mts
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, profilVitesse, type Trace, type VoiturePhysique } from '../../src/engine/circuits/profil';
import { VOITURE_REFERENCE as VOITURE_QUALIF, voitureDeCourse } from '../../src/engine/balance/profil';
// 28/11 : COURSE=1 → voiture de course (CONDITIONS_COURSE) et fichier sensibilites-course.csv ; sinon, voiture de qualification.
const MODE_COURSE = process.env.COURSE === '1';
const VOITURE_REFERENCE = MODE_COURSE ? voitureDeCourse(VOITURE_QUALIF) : VOITURE_QUALIF;
import { PARAMETRES_SENSIBILITE } from '../../src/engine/balance/monoplaces';

/**
 * Phase 12c (D-175, chantier A2) : d1 et d2 sont AJUSTÉS par moindres carrés sur des écarts de −10 % à +10 % (la plage où vivent les
 * voitures du jeu), et non plus pris par différence centrée à ± 3 % : un virage qui bascule « à fond » dans un petit intervalle faisait
 * exploser la courbure (Silverstone : ≈ 10 fois les autres circuits).
 */
const ECARTS = [-10, -6, -3, 3, 6, 10];
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
    // Δt(x) ≈ d1 x + ½ d2 x² : équations normales à deux inconnues (a = d1, b = ½ d2).
    let sxx = 0, sx3 = 0, sx4 = 0, sxy = 0, sx2y = 0;
    for (const x of ECARTS) {
      const y = profilVitesse(t, varier(base, cle, x), c, k).tempsS - profil.tempsS;
      sxx += x * x; sx3 += x ** 3; sx4 += x ** 4; sxy += x * y; sx2y += x * x * y;
    }
    const det = sxx * sx4 - sx3 * sx3;
    const a = (sxy * sx4 - sx2y * sx3) / det, b = (sxx * sx2y - sx3 * sxy) / det;
    d1[cle] = +a.toFixed(5);
    d2[cle] = +(2 * b).toFixed(6);
  }
  res[t.circuit] = { tempsS: +profil.tempsS.toFixed(3), niveauAileron: niveau, d1, d2 };
  console.log(t.circuit.padEnd(16), 'aileron', niveau.toFixed(2), 'temps', profil.tempsS.toFixed(2), JSON.stringify(d1));
}
// Fichier lu par le moteur (chargement des données), une ligne par circuit.
const entete = ['id', 'tempsS', 'niveauAileron', ...PARAMETRES_SENSIBILITE.map((k) => `d1_${k}`), ...PARAMETRES_SENSIBILITE.map((k) => `d2_${k}`)];
const lignes = Object.entries(res).map(([id, r]) => [id, r.tempsS, r.niveauAileron, ...PARAMETRES_SENSIBILITE.map((k) => r.d1[k]), ...PARAMETRES_SENSIBILITE.map((k) => r.d2[k])].join(';'));
const fichier = MODE_COURSE ? 'data/grille-2026/sensibilites-course.csv' : 'data/grille-2026/sensibilites-circuits.csv';
writeFileSync(fichier, [entete.join(';'), ...lignes].join('\n') + '\n');
console.log(`${lignes.length} circuits écrits dans ${fichier} (ajustement sur ${ECARTS.join(', ')} %)`);
