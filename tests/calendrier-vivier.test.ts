/**
 * Phase 11b — vivier de 30 circuits, calendrier de 20 Grands Prix (10 permanents, 10 en rotation), climat selon le mois,
 * archives conservées, sauvegardes et migration (format 29).
 */
import { describe, expect, it } from 'vitest';
import {
  avecVivier, circuitsDeLaSaison, copierMonde, creerScenarioGrille2026, deserialiser, evenementsDeType, moisDeSemaine, nombreGrandsPrix,
  saisonDe, serialiser, table, TABLES, VERSION_FORMAT, type Circuit, type Monde,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const circuits = (m: Monde) => Object.values(table(m, TABLES.circuits)) as unknown as Circuit[];

describe('Phase 11b — vivier et calendrier', () => {
  it('30 circuits au vivier, 10 permanents ; chaque circuit a son climat sur 12 mois', () => {
    const m = sc.creerMonde(1);
    expect(circuits(m)).toHaveLength(30);
    expect(circuits(m).filter((c) => c.vivier?.statut === 'permanent')).toHaveLength(10);
    for (const c of circuits(m)) { expect(c.pluieMensuelle).toHaveLength(12); for (const p of c.pluieMensuelle!) expect(p).toBeGreaterThanOrEqual(0); }
    expect(avecVivier(m)).toBe(true);
    expect(nombreGrandsPrix(m)).toBe(20);
  });

  it('sur 40 saisons : 20 Grands Prix, les 10 permanents chaque fois, pas de doublon, rotation réelle, ordre des dates', () => {
    const m = sc.creerMonde(2);
    const vus = new Set<string>();
    const permanents = circuits(m).filter((c) => c.vivier!.statut === 'permanent').map((c) => c.id);
    for (let a = 2027; a < 2067; a++) {
      const s = circuitsDeLaSaison(m, a, 20);
      expect(s).toHaveLength(20);
      expect(new Set(s.map((c) => c.id)).size).toBe(20);
      for (const p of permanents) expect(s.map((c) => c.id)).toContain(p);
      for (let i = 1; i < s.length; i++) expect(s[i]!.vivier!.jourHabituel).toBeGreaterThanOrEqual(s[i - 1]!.vivier!.jourHabituel);
      s.forEach((c) => vus.add(c.id));
    }
    // Tous les circuits du vivier finissent par courir (aucun n'est oublié pour toujours).
    expect(vus.size).toBe(30);
    expect(evenementsDeType(m, 'calendrier.rotation').length).toBeGreaterThan(5);
  });

  it('la règle est déterministe et sans tirage : deux mondes de graines différentes ont la même rotation', () => {
    const a = sc.creerMonde(3), b = sc.creerMonde(4);
    for (let an = 2027; an < 2040; an++) expect(circuitsDeLaSaison(a, an, 20).map((c) => c.id)).toEqual(circuitsDeLaSaison(b, an, 20).map((c) => c.id));
  });

  it('un vote à 22 Grands Prix ouvre deux places de plus en rotation', () => {
    const m = sc.creerMonde(5);
    const s = circuitsDeLaSaison(m, 2027, 22);
    expect(s).toHaveLength(22);
    expect(s.filter((c) => c.vivier!.statut === 'rotation')).toHaveLength(12);
  });

  it('climat selon le mois : un Grand Prix déplacé change de probabilité de pluie', () => {
    expect(moisDeSemaine(1)).toBe(1);
    expect(moisDeSemaine(26)).toBe(6);
    expect(moisDeSemaine(52)).toBe(12);
    const spa = circuits(sc.creerMonde(6)).find((c) => c.id === 'cir_spa')!;
    expect(spa.pluieMensuelle![moisDeSemaine(30) - 1]).not.toBe(spa.pluieMensuelle![moisDeSemaine(10) - 1]);
  });

  it('une saison jouée : 20 Grands Prix, un circuit sorti garde ses Grands Prix (archives), sauvegarde et reprise identiques', () => {
    const m = sc.creerMonde(7), moteur = sc.creerMoteur();
    moteur.avancer(m, 52 + 20);
    const s = saisonDe(m, 2027)!;
    expect(s.calendrier).toHaveLength(20);
    const gpAvant = Object.keys(table(m, TABLES.grandsPrix)).length;
    const repris = deserialiser(serialiser(m));
    expect(repris.versionFormat).toBe(VERSION_FORMAT);
    const suite = copierMonde(m);
    moteur.avancer(suite, 10);
    sc.creerMoteur().avancer(repris, 10);
    expect(serialiser(repris)).toBe(serialiser(suite));
    expect(Object.keys(table(suite, TABLES.grandsPrix)).length).toBeGreaterThanOrEqual(gpAvant);
  }, 60_000);

  it('migration v28 → v29 : une ancienne partie (sans vivier) garde son calendrier de 24 Grands Prix', () => {
    const m = sc.creerMonde(8);
    for (const c of circuits(m)) { delete c.vivier; delete c.pluieMensuelle; }
    const migre = deserialiser(serialiser(m).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":28'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(avecVivier(migre)).toBe(false);
    expect(nombreGrandsPrix(migre)).toBe(24);
    sc.creerMoteur().avancer(migre, 12);
    expect(saisonDe(migre, 2027)!.calendrier).toHaveLength(24);
  }, 60_000);
});
