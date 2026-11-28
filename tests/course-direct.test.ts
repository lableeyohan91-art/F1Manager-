/**
 * Phase 13e — course regardée en direct : l'aperçu tour par tour ne modifie rien et donne exactement le résultat final ; ordres du joueur.
 */
import { describe, expect, it } from 'vitest';
import { apercuGrandPrix, creerScenarioGrille2026, serialiser, table, TABLES, teamPrincipal, type GrandPrix, type Personne } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const prochainGp = (m: ReturnType<typeof sc.creerMonde>) => (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => !g.termine).sort((a, b) => a.manche - b.manche)[0]!;

describe('Phase 13e — course en direct', () => {
  it('l’aperçu ne modifie pas le monde, et l’arrivée vue en direct est le vrai résultat', () => {
    const m = sc.creerMonde(5), mo = sc.creerMoteur();
    mo.avancer(m, 14); // au moins un Grand Prix déjà couru
    const gp = prochainGp(m);
    const avant = serialiser(m);
    const a10 = apercuGrandPrix(m, gp.id, 10)!;
    expect(a10.tour).toBe(10);
    const fin = apercuGrandPrix(m, gp.id, 999)!;
    expect(serialiser(m)).toBe(avant);
    while (!(table(m, TABLES.grandsPrix)[gp.id] as unknown as GrandPrix).termine) mo.avancerUneSemaine(m);
    const vrai = (table(m, TABLES.grandsPrix)[gp.id] as unknown as GrandPrix).resultats.filter((r) => r.position).map((r) => r.pilote);
    expect(fin.etat.ordre.filter((id) => fin.etat.voitures[id]!.enCourse)).toEqual(vrai);
  }, 180_000);

  it('ordre en direct : un arrêt demandé au tour 5 change les pneus du pilote, dans l’aperçu comme dans le résultat', () => {
    const m = sc.creerMonde(6), mo = sc.creerMoteur();
    mo.avancer(m, 14);
    const gp = prochainGp(m);
    const e = 'eq_alpine', tp = teamPrincipal(m, e)!;
    const pilote = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((p) => p.ecurie === e && p.poste === 'pilote_titulaire' && p.statut === 'actif')!;
    const cmd = (prm: Record<string, unknown>) => mo.commandes.executer(m, { type: 'course.ordre', auteur: tp.id, source: 'exterieur', parametres: { grandPrix: gp.id, ecurie: e, pilote: pilote.id, ...prm } });
    expect(cmd({ tour: 5, arret: 'caoutchouc' }).ok).toBe(false);
    expect(cmd({ tour: 0, arret: 'dur' }).ok).toBe(false);
    expect(cmd({ tour: 5, arret: 'dur', consignes: { conduite: 'agressive' } }).ok).toBe(true);
    const a = apercuGrandPrix(m, gp.id, 6)!;
    const v = a.etat.voitures[pilote.id]!;
    expect(v.relais).toBeGreaterThanOrEqual(1);
    expect(v.composes[1]).toBe('dur');
    const fin = apercuGrandPrix(m, gp.id, 999)!;
    while (!(table(m, TABLES.grandsPrix)[gp.id] as unknown as GrandPrix).termine) mo.avancerUneSemaine(m);
    const r = (table(m, TABLES.grandsPrix)[gp.id] as unknown as GrandPrix).resultats.find((x) => x.pilote === pilote.id)!;
    if (r.position) expect(fin.etat.ordre.filter((id) => fin.etat.voitures[id]!.enCourse).indexOf(pilote.id) + 1).toBe(r.position);
    expect(r.explication?.strategie?.split('-')[1]).toBe('D');
  }, 180_000);
});
