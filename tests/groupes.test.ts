/** Phase 8d-3 — groupes sociaux émergents (docs/systemes/memoire.md §4). */
import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, detecterGroupes, groupes, lienSocial, relationBrute, serialiser, suivreLesLeaders, table, TABLES,
  teamPrincipal, VERSION_FORMAT, type Groupe, type Monde, type Personne,
} from '../src/engine';
import { OPPOSANTS } from '../src/engine/balance/groupes';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const equipe = (m: Monde, e: string) => personnes(m).filter((p) => p.statut === 'actif' && p.ecurie === e && !p.poste.startsWith('pilote') && p.poste !== 'team_principal').sort((a, b) => (a.id < b.id ? -1 : 1));

/** Lie fortement un ensemble de personnes (familiarité et affinité réciproques) ; `estime` reçoit en plus le respect de tous. */
function souder(m: Monde, ps: Personne[], estime: Personne) {
  for (const a of ps) for (const b of ps) {
    if (a === b) continue;
    const r = relationBrute(m, a.id, b.id, true)!;
    r.familiarite = 0.8;
    r.base.affinite = 0.6;
    r.base.respect = b === estime ? 0.9 : 0.1;
  }
}

describe('Phase 8d-3 — groupes sociaux', () => {
  it('lien social : la relation, plus une affinité née de valeurs proches et un respect né de la compétence, en proportion de la familiarité', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const [a, b] = equipe(m, 'eq_ferrari') as [Personne, Personne];
    const r = relationBrute(m, a.id, b.id, true)!;
    r.familiarite = 0;
    const inconnu = lienSocial(m, a, b);
    expect(inconnu.affinite).toBe(0);
    expect(inconnu.respect).toBe(0);
    r.familiarite = 0.8;
    for (const k of Object.keys(a.valeurs)) b.valeurs[k] = a.valeurs[k]!;
    expect(lienSocial(m, a, b).affinite).toBeGreaterThan(0);
    for (const k of Object.keys(a.valeurs)) b.valeurs[k] = 20 - a.valeurs[k]!;
    expect(lienSocial(m, a, b).affinite).toBeLessThan(lienSocial(m, a, { ...b, valeurs: { ...a.valeurs } }).affinite);
  });

  it('détection : un groupe soudé émerge autour de la personne la plus respectée ; type déduit', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const ps = equipe(m, 'eq_mclaren').slice(0, 4);
    souder(m, ps, ps[2]!);
    const g = detecterGroupes(m).find((x) => x.leader === ps[2]!.id);
    expect(g).toBeDefined();
    expect(g!.membres).toEqual(ps.filter((p) => p !== ps[2]).map((p) => p.id).sort());
    expect(['collegues', 'mentor']).toContain(g!.type);
  });

  it('opposants à la direction : type déduit, et le climat de l’écurie se dégrade (contrefactuel)', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const ps = equipe(m, 'eq_alpine').slice(0, 4);
    souder(m, ps, ps[0]!);
    const tp = teamPrincipal(m, 'eq_alpine')!;
    for (const p of ps) relationBrute(m, p.id, tp.id, true)!.base.confiance = -0.8;
    const g = detecterGroupes(m).find((x) => x.leader === ps[0]!.id)!;
    expect(g.type).toBe('opposants');
    const avec = copierMonde(m), sans = copierMonde(m);
    table(avec, TABLES.groupes)[g.id] = g as never;
    moteur.avancer(avec, 4);
    moteur.avancer(sans, 4);
    const motivation = (mm: Monde, id: string) => (table(mm, TABLES.personnes)[id] as unknown as Personne).etat.motivation;
    for (const p of ps) expect(motivation(avec, p.id)).toBeLessThan(motivation(sans, p.id)); // l’état mensuel ramène en partie la motivation vers son niveau naturel
    expect(OPPOSANTS.motivationMembres).toBeGreaterThan(OPPOSANTS.motivationEquipe);
  }, 60_000);

  it('le leader change d’écurie : un membre très attaché propose ses services à sa nouvelle écurie (candidature, règles de la 7b)', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const ps = equipe(m, 'eq_williams').filter((p) => ['responsable_aero', 'responsable_conception', 'directeur_sportif', 'directeur_financier', 'directeur_technique'].includes(p.poste)).slice(0, 3);
    const leader = ps[0]!;
    const g: Groupe = { id: `grp_${leader.id}`, type: 'collegues', leader: leader.id, membres: ps.slice(1).map((p) => p.id), ecurieLeader: 'eq_williams', depuis: 2027, annee: 2027 };
    table(m, TABLES.groupes)[g.id] = g as never;
    for (const p of ps.slice(1)) { const r = relationBrute(m, p.id, leader.id, true)!; r.familiarite = 0.9; r.base.affinite = 1; r.base.respect = 1; p.traits['loyaute'] = 1; }
    leader.ecurie = 'eq_haas';
    const cmd: string[] = [];
    suivreLesLeaders(m, (c) => { cmd.push(`${c.type}:${c.auteur}:${String(c.parametres['ecurie'])}`); return moteur.commandes.executer(m, { ...c, source: 'ia' }); });
    expect(cmd.length).toBeGreaterThan(0);
    expect(cmd.every((x) => x.startsWith('marche.candidature:') && x.endsWith(':eq_haas'))).toBe(true);
    expect(Object.values(m.evenements).some((e) => e.type === 'groupe.suit_leader')).toBe(true);
  });

  it('format 23 : migration depuis 22 ; groupes détectés par la simulation (8 saisons)', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 52 * 8);
    expect(groupes(m).length).toBeGreaterThan(0);
    const toutes = groupes(m).flatMap((g) => [g.leader, ...g.membres]);
    expect(new Set(toutes).size).toBe(toutes.length); // chacun dans un seul groupe
    const ancien = copierMonde(m) as unknown as { tables: Record<string, unknown> };
    delete ancien.tables['groupes'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":22'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(migre.tables['groupes']).toEqual({});
  }, 120_000);
});
