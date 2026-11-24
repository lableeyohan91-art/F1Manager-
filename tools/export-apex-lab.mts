/**
 * Phase 11b — export pour APEX Lab (audit, point 8) : les résultats DU MOTEUR DU JEU, pour que le laboratoire les lise sans
 * recalculer (un seul moteur de référence, pas deux moteurs concurrents). Aucune réécriture du laboratoire.
 *
 * Contenu (format JSON, version FORMAT_EXPORT) :
 *  - voitures : la voiture de référence et les voitures spécialisées du banc (paramètres physiques complets) ;
 *  - caracteristiques : le registre (statut modélisée / future, leviers, compromis, canal météo) ;
 *  - circuits : pour chacun, longueur, adhérence de piste, altitude, temps réel, réglage d'ailerons calculé, temps au tour,
 *    sensibilités (+2 %), parts du tour par limite, et la trace point par point (abscisse, x, y, courbure effective, vitesse
 *    réelle, vitesse du modèle, limite) ;
 *  - banc : temps et écarts de chaque voiture spécialisée, gains par portion (issus de tools/banc-specialisation.mts).
 * Chaque valeur est marquée « reel » (relevé OpenF1 dérivé) ou « modele » (calculé par le moteur).
 * Usage : npx tsx tools/export-apex-lab.mts [dossier de sortie, défaut export/apex-lab] [circuits séparés par des virgules | tous]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, partsDuTour, sensibilites, type Trace } from '../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';
import { CARACTERISTIQUES } from '../src/engine/circuits/specialisation';

const FORMAT_EXPORT = 1;
const dossier = process.argv[2] ?? 'export/apex-lab';
const TEST = ['cir_monza', 'cir_monaco', 'cir_suzuka', 'cir_singapour', 'cir_mexico'];
const choix = process.argv[3] ?? TEST.join(',');
const calendrier = readFileSync('data/grille-2026/circuits.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')[0]!);
const fichier = (id: string) => (existsSync(`data/circuits/${id}.json`) ? `data/circuits/${id}.json` : `data/circuits/validation/${id}.json`);
const ids = (choix === 'tous' ? [...new Set([...TEST, ...calendrier, 'cir_madrid', 'cir_imola', 'cir_sepang'])] : choix.split(',')).filter((id) => existsSync(fichier(id)));
const banc = existsSync('docs/rapports/phase-11b/donnees/audit/banc-specialisation.json')
  ? (JSON.parse(readFileSync('docs/rapports/phase-11b/donnees/audit/banc-specialisation.json', 'utf8')) as { dosage: Record<string, number>; circuits: Record<string, unknown> })
  : null;

mkdirSync(dossier, { recursive: true });
const index: Record<string, unknown>[] = [];
for (const id of ids) {
  const t = JSON.parse(readFileSync(fichier(id), 'utf8')) as Trace & { altitudeM: number; tempsTourS: { mediane: number }; points: { x: number; y: number; v: number }[]; adherencePiste?: { valeur: number } };
  const c = { altitudeM: t.altitudeM ?? 0 }, k = courbures(t);
  const { niveau, profil: p } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  const sortie = {
    formatExport: FORMAT_EXPORT,
    circuit: id,
    origine: { reel: 'trace dérivée de tours de qualification OpenF1 (positions moyennées, voir tools/circuits/LISEZMOI.md)', modele: 'profil de vitesse du moteur APEX Manager (src/engine/circuits/profil.ts)' },
    longueurM: t.longueurM,
    pasM: t.pasM,
    altitudeM: t.altitudeM ?? 0,
    adherencePiste: t.adherencePiste?.valeur ?? 1,
    reel: { tempsTourS: t.tempsTourS.mediane },
    modele: {
      tempsTourS: +p.tempsS.toFixed(3),
      niveauAilerons: niveau,
      coupureElectriqueKmh: p.coupureKmh,
      energieElectriqueJ: Math.round(p.energieElectriqueJ),
      sensibilitesS: Object.fromEntries(Object.entries(sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), c)).map(([a, b]) => [a, +b.toFixed(4)])),
      partsDuTour: Object.fromEntries(Object.entries(partsDuTour(t, p)).map(([a, b]) => [a, +b.toFixed(4)])),
    },
    banc: banc?.circuits[id] ?? null,
    /** Colonnes de la trace : s (m), x, y (m), courbure effective (1/m), vitesse réelle (km/h), vitesse modèle (km/h), limite du modèle. */
    colonnes: ['s', 'x', 'y', 'courbure', 'vReelleKmh', 'vModeleKmh', 'limite'],
    points: t.points.map((q, i) => [i * t.pasM, +q.x.toFixed(1), +q.y.toFixed(1), +p.courbures[i]!.toExponential(3), Math.round(q.v), Math.round(p.vitesses[i]! * 3.6), p.limites[i]]),
  };
  writeFileSync(`${dossier}/${id}.json`, JSON.stringify(sortie));
  index.push({ circuit: id, tempsReelS: t.tempsTourS.mediane, tempsModeleS: sortie.modele.tempsTourS, niveauAilerons: niveau });
  console.error(id, 'exporté');
}
writeFileSync(`${dossier}/index.json`, JSON.stringify({
  formatExport: FORMAT_EXPORT,
  voitureReference: VOITURE_REFERENCE,
  dosageBancPourcent: banc?.dosage ?? null,
  caracteristiques: CARACTERISTIQUES,
  circuits: index,
}, null, 1));
