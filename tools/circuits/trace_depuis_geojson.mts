/**
 * Phase 11b — trace d'un circuit SANS relevé réel de vitesse (Kyalami : configuration actuelle jamais courue en F1), à partir du
 * tracé public GeoJSON (bacinger/f1-circuits, licence MIT). Statut E : géométrie estimée, vitesses CALCULÉES par le moteur.
 *
 * Étapes : projection locale (m) → spline de Catmull-Rom fermée (centripète) → rééchantillonnage tous les 5 m → mise à l'échelle de
 * la longueur officielle → vitesses du profil du moteur (voiture de référence, réglage d'ailerons calculé). Altitude relative : 0 (H).
 * Usage : npx tsx tools/circuits/trace_depuis_geojson.mts <geojson> <id GeoJSON> <id circuit> <longueur m> <virages> <altitude m> <sortie>
 * Contrôle de la méthode : la même chaîne appliquée à un circuit relevé (ex. Portimão) donne l'erreur attendue (voir le rapport).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, courbures, type Trace } from '../../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../../src/engine/balance/profil';

const [fichier, idGeo, id, longueurTxt, viragesTxt, altitudeTxt, sortie] = process.argv.slice(2);
const longueur = Number(longueurTxt), PAS = 5;
const geo = JSON.parse(readFileSync(fichier!, 'utf8')) as { features: { properties: { id: string }; geometry: { coordinates: [number, number][] } }[] };
const f = geo.features.find((x) => x.properties.id === idGeo)!;
let c = f.geometry.coordinates;
if (c.length > 2 && c[0]![0] === c[c.length - 1]![0] && c[0]![1] === c[c.length - 1]![1]) c = c.slice(0, -1);
const lat0 = c.reduce((a, p) => a + p[1], 0) / c.length, lon0 = c.reduce((a, p) => a + p[0], 0) / c.length;
const R = 6371000, k = Math.PI / 180;
const P = c.map(([lon, lat]) => [(lon - lon0) * k * R * Math.cos(lat0 * k), (lat - lat0) * k * R] as [number, number]);

// Spline de Catmull-Rom centripète fermée, échantillonnée finement.
const n = P.length, fin: [number, number][] = [];
for (let i = 0; i < n; i++) {
  const p0 = P[(i - 1 + n) % n]!, p1 = P[i]!, p2 = P[(i + 1) % n]!, p3 = P[(i + 2) % n]!;
  const d = (a: [number, number], b: [number, number]) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-6;
  const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
  const pas = Math.max(4, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1])));
  for (let s = 0; s < pas; s++) {
    const t = t1 + ((t2 - t1) * s) / pas;
    const L = (a: [number, number], b: [number, number], ta: number, tb: number): [number, number] => [((tb - t) * a[0] + (t - ta) * b[0]) / (tb - ta), ((tb - t) * a[1] + (t - ta) * b[1]) / (tb - ta)];
    const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3);
    const B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
    fin.push(L(B1, B2, t1, t2));
  }
}
const cumul = [0];
for (let i = 1; i <= fin.length; i++) cumul.push(cumul[i - 1]! + Math.hypot(fin[i % fin.length]![0] - fin[i - 1]![0], fin[i % fin.length]![1] - fin[i - 1]![1]));
const total = cumul[fin.length]!, echelle = longueur / total;
const npts = Math.floor(longueur / PAS), pts: { x: number; y: number }[] = [];
let j = 0;
for (let i = 0; i < npts; i++) {
  const s = (i * PAS) / echelle;
  while (cumul[j + 1]! < s) j++;
  const a = fin[j]!, b = fin[(j + 1) % fin.length]!, u = (s - cumul[j]!) / (cumul[j + 1]! - cumul[j]!);
  pts.push({ x: (a[0] + (b[0] - a[0]) * u) * echelle, y: (a[1] + (b[1] - a[1]) * u) * echelle });
}
const x0 = pts[0]!.x, y0 = pts[0]!.y;
const base = { circuit: id!, longueurM: longueur, pasM: PAS, points: pts.map((p) => ({ x: +(p.x - x0).toFixed(1), y: +(p.y - y0).toFixed(1), z: 0, v: 0 })) } as unknown as Trace & { points: Record<string, number>[] };
const cond = { altitudeM: Number(altitudeTxt) };
const { niveau, profil } = appuiNaturel(base, VOITURE_REFERENCE, cond, courbures(base));
const kmh = profil.vitesses.map((v) => Math.round(v * 3.6));
const sortieD = {
  circuit: id, longueurM: longueur, viragesOfficiels: Number(viragesTxt), pasM: PAS,
  source: { nom: 'Tracé public GeoJSON bacinger/f1-circuits (licence MIT)', idGeoJSON: idGeo, usage: 'géométrie seulement ; aucune vitesse réelle (configuration jamais courue en F1)' },
  statuts: { trace: 'E (tracé GeoJSON lissé par spline, mis à l’échelle de la longueur officielle ; détails des chicanes approximatifs)', altitude: 'H (relief inconnu : plat)', vitesses: 'calculées par le moteur (voiture de référence), AUCUN relevé réel', longueur: 'V (Wikipédia)', virages: 'V (Wikipédia)', altitudeM: 'V (Wikipédia)' },
  echelleTrace: +echelle.toFixed(4),
  tempsTourS: { min: +profil.tempsS.toFixed(3), mediane: +profil.tempsS.toFixed(3), statut: 'calculé par le moteur, pas un tour réel' },
  voieStandsS: null,
  altitudeM: Number(altitudeTxt),
  sansReleveReel: true,
  niveauAileronsCalcul: niveau,
  points: base.points.map((p, i) => ({ x: p.x, y: p.y, z: 0, v: kmh[i], vMin: kmh[i], vMax: kmh[i], gaz: profil.limites[i] === 'puissance' || profil.limites[i] === 'butee' ? 100 : 0, frein: profil.limites[i] === 'freinage' ? 1 : 0 })),
};
writeFileSync(sortie!, JSON.stringify(sortieD));
console.log(id, npts, 'points ; échelle', echelle.toFixed(4), '; tour calculé', profil.tempsS.toFixed(2), 's');
