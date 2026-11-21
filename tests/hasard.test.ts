import { describe, expect, it } from 'vitest';
import { etatInitialFlux, Flux } from '../src/engine';

describe('Hasard à graine', () => {
  it('même graine et même nom de flux ⇒ mêmes tirages', () => {
    const a = new Flux(etatInitialFlux(42, 'marche'));
    const b = new Flux(etatInitialFlux(42, 'marche'));
    for (let i = 0; i < 1000; i++) expect(a.suivant()).toBe(b.suivant());
  });

  it('flux de noms différents ⇒ tirages différents', () => {
    const a = new Flux(etatInitialFlux(42, 'marche'));
    const b = new Flux(etatInitialFlux(42, 'resultats'));
    const ta = Array.from({ length: 20 }, () => a.suivant());
    const tb = Array.from({ length: 20 }, () => b.suivant());
    expect(ta).not.toEqual(tb);
  });

  it('distribution plausible (moyenne ≈ 0,5, entiers bornés, normale centrée)', () => {
    const f = new Flux(etatInitialFlux(7, 'test'));
    let s = 0, sn = 0;
    for (let i = 0; i < 20000; i++) {
      s += f.suivant();
      const n = f.entier(3, 9);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(9);
      sn += f.normale(10, 2);
    }
    expect(s / 20000).toBeCloseTo(0.5, 1);
    expect(sn / 20000).toBeCloseTo(10, 0);
  });

  it('tirage pondéré respecte les poids', () => {
    const f = new Flux(etatInitialFlux(1, 'poids'));
    const compte = { a: 0, b: 0 };
    for (let i = 0; i < 10000; i++) compte[f.choisirPondere(['a', 'b'] as const, [3, 1])]++;
    expect(compte.a / 10000).toBeGreaterThan(0.7);
    expect(compte.a / 10000).toBeLessThan(0.8);
  });
});
