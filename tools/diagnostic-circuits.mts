/**
 * Phase 11b — diagnostic reproductible des circuits détaillés (data/circuits/*.json) : modèle de vitesse contre vitesses réelles,
 * parts du tour, sensibilités, virages. Usage : npx tsx tools/diagnostic-circuits.mts [fichier JSON de sortie] [dossier, défaut data/circuits]
 * Le dossier data/circuits/validation contient des circuits JAMAIS utilisés pour le calage : test hors échantillon.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, partsDuTour, sensibilites, viragesDetectes, type Trace } from '../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';

const sortie = process.argv[2] || undefined;
const dossier = process.argv[3] ?? 'data/circuits';
const res: Record<string, unknown> = {};
for (const f of readdirSync(dossier).filter((x) => x.startsWith('cir_') && x.endsWith('.json')).sort()) {
  const tr = JSON.parse(readFileSync(`${dossier}/${f}`, 'utf8')) as Trace & { tempsTourS: { mediane: number }; points: { v: number }[]; altitudeM: number; annee: number };
  const c = { altitudeM: tr.altitudeM ?? 0 };
  const t0 = performance.now();
  const { niveau, profil: p } = appuiNaturel(tr, VOITURE_REFERENCE, c);
  const ms = performance.now() - t0;
  const reel = tr.points.map((x) => x.v);
  const modele = p.vitesses.map((v) => v * 3.6);
  const ecart = modele.map((v, i) => v - reel[i]!);
  const virages = viragesDetectes(tr, reel);
  const vModeleVirages = viragesDetectes(tr, modele);
  const s = sensibilites(tr, avecAilerons(VOITURE_REFERENCE, niveau), c);
  const parts = partsDuTour(tr, p);
  const r = {
    annee: tr.annee, niveauAilerons: niveau, coupureKmh: p.coupureKmh, tempsModele: +p.tempsS.toFixed(1), tempsReel: tr.tempsTourS.mediane,
    vmaxModele: Math.round(Math.max(...modele)), vmaxReel: Math.max(...reel), vminModele: Math.round(Math.min(...modele)), vminReel: Math.min(...reel),
    ecartMoyenKmh: +(ecart.reduce((a, b) => a + b, 0) / ecart.length).toFixed(1), ecartAbsMoyenKmh: +(ecart.reduce((a, b) => a + Math.abs(b), 0) / ecart.length).toFixed(1),
    virages: virages.length, ecartVitesseVirages: +(virages.reduce((a, v, i) => a + (vModeleVirages[i] ? vModeleVirages[i]!.vMinKmh - v.vMinKmh : 0), 0) / virages.length).toFixed(1),
    parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, Math.round(v * 100)])),
    sensibilites: Object.fromEntries(Object.entries(s).map(([k, v]) => [k, +v.toFixed(3)])),
    calculMs: +ms.toFixed(1),
  };
  res[tr.circuit] = r;
  console.log(tr.circuit, JSON.stringify(r));
}
if (sortie) writeFileSync(sortie, JSON.stringify(res, null, 1));
void courbures;
