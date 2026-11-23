/** Phase 9 — histoire ancrée : la couche humaine du passé, sans toucher à la grille de 2027 (D-046, D-048, D-143). */
import { describe, expect, it } from 'vitest';
import { chargerDonnees, creerScenarioGrille2026, empreinte, relation, souvenirsDe, table, TABLES, usureSucces, type Contrat, type Personne } from '../src/engine';
import { SOUVENIRS_MAX_PAR_PERSONNE } from '../src/engine/balance/memoire';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const fichiers = lireDonneesGrille2026();
const sc = creerScenarioGrille2026(fichiers);
const donnees = chargerDonnees(fichiers);

describe('Phase 9 — histoire ancrée', () => {
  it('la grille de 2027 est celle des données : chaque contrat des données, à l’identique', () => {
    const m = sc.creerMonde(1);
    const contrats = Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
    for (const c of donnees.contrats) {
      const x = contrats.find((y) => y.personne === c.personne && y.organisation === c.organisation && y.statut === 'actif');
      expect(x, `${c.personne} chez ${c.organisation}`).toBeDefined();
      expect([x!.debut, x!.fin, x!.poste]).toEqual([c.debut, c.fin, c.poste]);
    }
    for (const p of donnees.personnes) expect((table(m, TABLES.personnes)[p.id] as unknown as Personne).ecurie).toBe(p.ecurie);
  });

  it('le passé est daté avant 2027 ; souvenirs inventés privés, histoires réelles publiques et tirées des données seulement', () => {
    const m = sc.creerMonde(1);
    const passes = Object.values(m.evenements).filter((e) => e.type.startsWith('histoire.'));
    expect(passes.length).toBeGreaterThan(0);
    for (const e of passes) expect(e.date.annee).toBeLessThan(2027);
    for (const e of passes.filter((x) => x.type !== 'histoire.reelle' && x.type !== 'histoire.titre' && x.type !== 'histoire.ere')) expect(e.visibilite).toBe('prive');
    const reelles = passes.filter((e) => e.type === 'histoire.reelle');
    for (const e of reelles) {
      expect(e.visibilite).toBe('public');
      expect(donnees.histoires.some((h) => h.id === e.contexte['histoire'])).toBe(true);
    }
  });

  it('chronique : un titre par saison passée et les grandes ères, dans l’ordre', () => {
    const m = sc.creerMonde(1);
    const titres = m.chronique.filter((c) => c.type === 'histoire.titre');
    expect(titres).toHaveLength(donnees.palmares.length);
    expect(m.chronique.some((c) => c.type === 'histoire.ere')).toBe(true);
    for (let i = 1; i < m.chronique.length; i++) expect(m.chronique[i]!.date.annee).toBeGreaterThanOrEqual(m.chronique[i - 1]!.date.annee);
  });

  it('un passé partagé : familiarité des anciens coéquipiers, usure du succès déjà présente chez Mercédes', () => {
    const m = sc.creerMonde(1);
    expect(relation(m, 'per_hammilton', 'per_wolf').familiarite).toBeGreaterThan(0.5);
    expect(relation(m, 'per_noris', 'per_piastry').familiarite).toBeGreaterThan(0.3);
    expect(relation(m, 'per_verstapen', 'per_hammilton').familiarite).toBe(0);
    expect(usureSucces(m, table(m, TABLES.personnes)['per_wolf'] as unknown as Personne).usure).toBeGreaterThan(0);
    for (const id of Object.keys(table(m, TABLES.personnes))) expect(souvenirsDe(m, id).length).toBeLessThanOrEqual(SOUVENIRS_MAX_PAR_PERSONNE);
  });

  it('déterminisme : même graine, même passé ; une autre graine, d’autres souvenirs inventés', () => {
    expect(empreinte(sc.creerMonde(7))).toBe(empreinte(sc.creerMonde(7)));
    const a = Object.values(sc.creerMonde(1).evenements).filter((e) => e.type.startsWith('histoire.') && e.visibilite === 'prive').map((e) => e.texte).sort().join('|');
    const b = Object.values(sc.creerMonde(2).evenements).filter((e) => e.type.startsWith('histoire.') && e.visibilite === 'prive').map((e) => e.texte).sort().join('|');
    expect(a).not.toBe(b);
  });

  it('données : une histoire qui cite une personne inconnue est refusée au chargement', () => {
    const f = { ...fichiers, 'histoires.csv': `${fichiers['histoires.csv']!.trimEnd()}\nhis_99;2020;per_inconnu;per_wolf;rivalite;1;non;Test;test\n` };
    expect(() => chargerDonnees(f)).toThrow(/per_inconnu/);
  });
});
