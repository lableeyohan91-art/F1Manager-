/** Phase 11b — mesure statique avant/après : diversité des caractéristiques n° 1 et écarts entre voitures spécialisées de même valeur moyenne. */
import { readFileSync } from 'node:fs';
import { poidsVoiture } from '../../src/engine/systems/saison/performance';
const csv = readFileSync('data/grille-2026/circuits.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';'));
const CH = ['lents', 'rapides', 'freinage', 'motricite', 'lignesDroites', 'degradationPneus', 'exigencePhysique', 'difficulte', 'risqueAccident'];
const profil = JSON.parse(readFileSync('data/circuits/poids-voiture-profil.json', 'utf8')).poids as Record<string, Record<string, number>>;
// Voitures de même moyenne (13) avec une spécialité (+3) et une faiblesse compensée (−3 réparties) : effet du circuit seulement.
const base = { viragesLents: 13, viragesRapides: 13, vitessePointe: 13, efficaciteAero: 13, motorisation: 13, gestionPneus: 13 };
const VOITURES: Record<string, Record<string, number>> = {
  'fort appui': { ...base, viragesRapides: 16, efficaciteAero: 14.5, vitessePointe: 10, motorisation: 11.5 },
  'faible traînée': { ...base, vitessePointe: 16, motorisation: 14.5, viragesRapides: 10, viragesLents: 11.5 },
  'virages lents': { ...base, viragesLents: 16, vitessePointe: 10, gestionPneus: 13 },
  'pneus': { ...base, gestionPneus: 16, viragesRapides: 11.5, vitessePointe: 11.5 },
  'polyvalente': base,
};
for (const [nom, poidsDe] of [['avant (D-107)', (l: string[]) => poidsVoiture({ exigences: Object.fromEntries(CH.map((k, i) => [k, Number(l[7 + i])])) as never, altitudeM: Number(l[5]) })], ['après (profil)', (l: string[]) => profil[l[0]!]!]] as const) {
  const premiers = new Map<string, number>();
  const indices: Record<string, number[]> = {};
  const meilleure = new Map<string, number>();
  for (const l of csv) {
    const w = poidsDe(l) as Record<string, number>;
    const n1 = Object.entries(w).sort((a, b) => b[1] - a[1])[0]![0];
    premiers.set(n1, (premiers.get(n1) ?? 0) + 1);
    const sc = Object.entries(VOITURES).map(([v, c]) => [v, Object.entries(w).reduce((a, [k, x]) => a + x * c[k]!, 0)] as const);
    for (const [v, s] of sc) (indices[v] ??= []).push(s);
    const top = [...sc].sort((a, b) => b[1] - a[1])[0]![0]; meilleure.set(top, (meilleure.get(top) ?? 0) + 1);
  }
  console.log(`== ${nom}`);
  console.log('  caractéristique n° 1 :', Object.fromEntries(premiers));
  console.log('  voiture la plus rapide par circuit :', Object.fromEntries(meilleure));
  for (const [v, x] of Object.entries(indices)) console.log(`  ${v.padEnd(15)} indice de ${Math.min(...x).toFixed(2)} à ${Math.max(...x).toFixed(2)} (écart ${(Math.max(...x) - Math.min(...x)).toFixed(2)})`);
}
