/** Jalon A — non-régression : effectifs cohérents chaque semaine (hors semaine de transition 50 : retraites de fin de saison, puis marché). */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, verifierCoherence } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('Jalon A — cohérence semaine par semaine', () => {
  it('3 parties × 6 saisons : aucun poste en double, aucun baquet surréservé, aucun poste de dirigeant vacant', () => {
    for (const g of [4, 12, 14]) {
      const m = sc.creerMonde(g);
      const moteur = sc.creerMoteur();
      for (let k = 0; k < 52 * 6; k++) {
        moteur.avancer(m, 1);
        if (m.date.semaine === 50) continue;
        expect({ g, date: m.date, pb: verifierCoherence(m, { ages: false }) }).toEqual({ g, date: m.date, pb: [] });
      }
    }
  }, 300_000);
});
