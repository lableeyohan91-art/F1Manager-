/**
 * Phase 13b (D-194, D-195) — qualifications Q1/Q2/Q3, départ, course sur la piste (positions, dépassements, arrêts), données des fiches
 * de circuits (difficulté de dépassement, perte de la voie des stands).
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, table, TABLES, type Circuit, type GrandPrix } from '../src/engine';
import { Flux, etatInitialFlux } from '../src/engine/core/hasard';
import { PISTE } from '../src/engine/balance/course';
import { courirSurPiste, qualifier, type Partant } from '../src/engine/systems/saison/course-piste';
import { CONSIGNES_NEUTRES, meilleureStrategie } from '../src/engine/systems/saison/course-tours';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const tirage = (graine: number) => (cle: string) => new Flux(etatInitialFlux(graine, cle));

function partants(n: number, ecartPct: number): Partant[] {
  const strategie = meilleureStrategie(50, 1, 25, false);
  return Array.from({ length: n }, (_, i) => ({
    id: `p${String(i).padStart(2, '0')}`, base: i * ecartPct, strategie, fReel: 1, consignes: CONSIGNES_NEUTRES,
    depart: 12, depassement: 12, defense: 12, abandonTour: null,
  }));
}

describe('Phase 13b — qualifications', () => {
  it('vrai format : 22 voitures → Q1 élimine 6, Q2 en élimine 6, 10 en Q3 ; grille complète et sans doublon', () => {
    const q = qualifier(Array.from({ length: 22 }, (_, i) => ({ id: `p${i}`, rythme: -i * 0.2, regularite: 15 })), 0.05, tirage(1));
    expect(q.grille.length).toBe(22);
    expect(new Set(q.grille).size).toBe(22);
    // Écarts de rythme nets : les 10 plus rapides forment le haut de la grille.
    expect(q.grille.slice(0, 10).sort()).toEqual(Array.from({ length: 10 }, (_, i) => `p${i}`).sort());
  });
});

describe('Phase 13b — course sur la piste', () => {
  it('une voiture nettement plus rapide partie dernière remonte ; positions et abandons cohérents', () => {
    const ps = partants(10, 0.3);
    ps[9] = { ...ps[9]!, base: -1.5 };
    const grille = ps.map((p) => p.id);
    const e = courirSurPiste(grille, ps, 50, 90, { facilite: 1, airPerturbe: 0.2, perteVoieS: 20 }, 0, tirage(2));
    expect(e.ordre.indexOf('p09')).toBeLessThan(3);
    expect(e.voitures['p09']!.depassements).toBeGreaterThan(5);
  });
  it('un circuit difficile (Monaco) laisse moins dépasser qu’un circuit facile (Monza), à voitures égales', () => {
    const compter = (facilite: number) => {
      let n = 0;
      for (let g = 1; g <= 5; g++) {
        const ps = partants(12, 0).map((p, i) => ({ ...p, base: (11 - i) * 0.15 })); // grille à l'envers du rythme
        const e = courirSurPiste(ps.map((p) => p.id), ps, 50, 90, { facilite, airPerturbe: 0.2, perteVoieS: 20 }, 0, tirage(g));
        n += Object.values(e.voitures).reduce((s, v) => s + v.depassements, 0);
      }
      return n;
    };
    expect(compter(PISTE.faciliteParDifficulte[4]!)).toBeLessThan(compter(PISTE.faciliteParDifficulte[0]!) / 2);
  });
  it('déterminisme : mêmes tirages, même course', () => {
    const ps = partants(8, 0.1);
    const a = courirSurPiste(ps.map((p) => p.id), ps, 40, 90, { facilite: 0.5, airPerturbe: 0.2, perteVoieS: 20 }, 0.3, tirage(7));
    const b = courirSurPiste(ps.map((p) => p.id), ps, 40, 90, { facilite: 0.5, airPerturbe: 0.2, perteVoieS: 20 }, 0.3, tirage(7));
    expect(a).toEqual(b);
  });
});

describe('Phase 13b — données des fiches et saison', () => {
  it('chaque circuit reçoit sa difficulté de dépassement et sa perte de voie des stands (Monaco difficile, Monza facile)', () => {
    const m = sc.creerMonde(1);
    const cs = Object.values(table(m, TABLES.circuits)) as unknown as Circuit[];
    expect(cs.every((c) => c.course && c.course.perteVoieS > 5)).toBe(true);
    expect(cs.find((c) => c.id === 'cir_monaco')!.course!.difficulteDepassement).toBe(5);
    expect(cs.find((c) => c.id === 'cir_monza')!.course!.difficulteDepassement).toBe(1);
  });
  it('une saison : chaque résultat porte sa place de grille ; la pole est unique', () => {
    const m = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 20);
    const gps = (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => g.termine);
    expect(gps.length).toBeGreaterThan(0);
    for (const g of gps) {
      const places = g.resultats.map((r) => r.explication?.grille);
      expect(places.every((x) => typeof x === 'number')).toBe(true);
      expect(places.filter((x) => x === 1).length).toBe(1);
    }
  }, 120_000);
});
