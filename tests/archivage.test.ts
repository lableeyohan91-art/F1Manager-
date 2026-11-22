/** D-121 — archivage des retraités anciens : volumes bornés, histoire préservée. */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, deserialiser, serialiser, table, TABLES, verifierCoherence, VERSION_FORMAT, type Monde } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('D-121 — archivage des retraités', () => {
  it('après 15 saisons : fiches légères, plus aucune relation, souvenir ni contrat terminé les concernant, palmarès lisible', () => {
    const m: Monde = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 15 * 52);
    const archives = Object.keys(table(m, TABLES.archives));
    expect(archives.length).toBeGreaterThan(20);
    const ids = new Set(archives);
    for (const id of ids) expect(table(m, TABLES.personnes)[id]).toBeUndefined();
    expect(Object.values(table(m, 'souvenirs')).some((s) => ids.has(String(s['porteur'])) || ids.has(String(s['cible'])))).toBe(false);
    expect(Object.values(table(m, 'relations')).some((r) => ids.has(String(r['de'])) || ids.has(String(r['vers'])))).toBe(false);
    expect(Object.values(table(m, TABLES.contrats)).some((c) => ids.has(String(c['personne'])))).toBe(false);
    // Chaque champion reste identifiable (personne active ou fiche archivée).
    for (const p of Object.values(table(m, TABLES.palmares))) {
      const id = String(p['championPilote']);
      expect(table(m, TABLES.personnes)[id] ?? table(m, TABLES.archives)[id]).toBeDefined();
    }
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  }, 120_000);

  it('une sauvegarde au format 14 est migrée (table des archives créée)', () => {
    const m = sc.creerMonde(1);
    delete (m.tables as Record<string, unknown>)['archives'];
    const migre = deserialiser(serialiser(m).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":14'));
    expect(migre.tables['archives']).toEqual({});
  });
});
