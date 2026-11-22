import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, empreinte, serialiser, verifierCoherence,
  type GrandPrix, type Palmares, type Saison,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const S = 52;
const saisons = (m: ReturnType<typeof sc.creerMonde>) => Object.values(m.tables['saisons'] ?? {}) as unknown as Saison[];
const gps = (m: ReturnType<typeof sc.creerMonde>) => Object.values(m.tables['grandsprix'] ?? {}) as unknown as GrandPrix[];

describe('Phase 3 — saison abstraite', () => {
  it('une saison : 24 Grands Prix, 22 partants, points cohérents', () => {
    const m = sc.creerMonde(42);
    sc.creerMoteur().avancer(m, S);
    const [s] = saisons(m);
    expect(s!.termine).toBe(true);
    expect(s!.calendrier).toHaveLength(24);
    for (const gp of gps(m)) {
      expect(gp.termine).toBe(true);
      expect(gp.resultats).toHaveLength(22);
      const positions = gp.resultats.filter((r) => r.position !== null).map((r) => r.position);
      expect(positions).toEqual(positions.map((_, i) => i + 1));
    }
    const totalPilotes = s!.pilotes.reduce((a, l) => a + l.points, 0);
    const totalConstructeurs = s!.constructeurs.reduce((a, l) => a + l.points, 0);
    expect(totalPilotes).toBe(totalConstructeurs);
    // Au plus 101 points par course (25+18+…+1), moins s'il y a moins de 10 arrivants.
    expect(totalPilotes).toBeLessThanOrEqual(24 * 101);
  });

  it('palmarès, titres et chronique à la fin de la saison', () => {
    const m = sc.creerMonde(42);
    sc.creerMoteur().avancer(m, S);
    const pal = m.tables['palmares']!['pal_2027'] as unknown as Palmares;
    expect(pal).toBeDefined();
    expect(pal.championPilote).toBe(saisons(m)[0]!.pilotes[0]!.pilote);
    expect(saisons(m)[0]!.chronique.length).toBeGreaterThan(0);
    expect(m.chronique.some((c) => c.type === 'titre.pilotes')).toBe(true);
  });

  it('déterministe sur 3 saisons, et sauvegarde/reprise transparente', () => {
    const a = sc.creerMonde(5);
    sc.creerMoteur().avancer(a, 3 * S);
    const b = sc.creerMonde(5);
    const mb = sc.creerMoteur();
    mb.avancer(b, 2 * S);
    const recharge = deserialiser(serialiser(b));
    mb.avancer(recharge, S);
    expect(empreinte(recharge)).toBe(empreinte(a));
  }, 90_000); // référence locale ≈ 4 à 7 s

  it('10 saisons : cohérent (hors âges, phase 6) et sauvegarde bornée', () => {
    const m = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 10 * S);
    expect(saisons(m).filter((s) => s.termine)).toHaveLength(10);
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
    // Explications détaillées conservées seulement sur les 2 dernières saisons.
    const vieux = gps(m).filter((g) => g.saison <= 2034);
    expect(vieux.every((g) => g.resultats.every((r) => r.explication === undefined))).toBe(true);
    // Phase 6b : +≈ 0,2 Mo (juniors). Le plus lourd reste le détail des Grands Prix de F1 (≈ 1 Mo), optimisation à prévoir avant la version mobile.
    // Phase 6b-2 : relations et souvenirs nés des académies. Limite à 30 saisons inchangée (12 Mo, test humain).
    expect(serialiser(m).length).toBeLessThan(4_000_000);
  }, 90_000); // référence locale ≈ 4 à 7 s

  it('tirages locaux : changer la météo d’une course ne change pas l’aléa des autres courses', () => {
    const a = sc.creerMonde(11);
    const ma = sc.creerMoteur();
    ma.avancer(a, 14); // avant le 2e Grand Prix
    const b = copierMonde(a);
    // Contrefactuel : on modifie un pilote du 2e GP (confiance) ; le résultat du 3e GP d'un autre pilote garde le même aléa.
    (b.tables['personnes']!['per_leclerq'] as unknown as { etat: { confiance: number } }).etat.confiance = 20;
    const mb = sc.creerMoteur();
    ma.avancer(a, 6);
    mb.avancer(b, 6);
    const r = (m: typeof a) => (m.tables['grandsprix']!['gp_2027_03'] as unknown as GrandPrix).resultats.find((x) => x.pilote === 'per_verstapen')!.explication!.alea;
    expect(r(a)).toBe(r(b));
  });
});
