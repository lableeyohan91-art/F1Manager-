/** Phase 8c — qui sait quoi : fuites, rumeurs, révélations, réputation perçue, avant-projets de règlement. */
import { describe, expect, it } from 'vitest';
import {
  ajouterEvenement, avantProjets, copierMonde, creerScenarioGrille2026, deserialiser, faitsSuivis, intensitePercue, reputation, serialiser, table, TABLES,
  teamPrincipal, VERSION_FORMAT, type Ecurie, type FaitSuivi, type Monde, type Personne,
} from '../src/engine';
import { DIFFUSION, RUMEURS } from '../src/engine/balance/information';
import { LISTE_DOMAINES } from '../src/engine/balance/technique';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

/** Un team principal rompt une promesse en privé envers un de ses pilotes. */
function promesseRompue(m: Monde) {
  const tp = teamPrincipal(m, 'eq_ferrari')!;
  const pilote = personnes(m).find((p) => p.statut === 'actif' && p.ecurie === 'eq_ferrari' && p.poste === 'pilote_titulaire')!;
  const e = ajouterEvenement(m, { type: 'promesse.rompue', acteurs: [{ id: tp.id, role: 'auteur' }, { id: pilote.id, role: 'beneficiaire' }], importance: 2, visibilite: 'prive' });
  return { tp, pilote, e };
}

describe('Phase 8c — fuites et rumeurs', () => {
  it('un fait privé est suivi, circule le long des relations, reste borné ; les rumeurs pèsent plus, selon la croyance', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 30);
    const { tp, pilote, e } = promesseRompue(m);
    moteur.avancer(m, 1);
    const f = faitsSuivis(m)[e.id] as unknown as FaitSuivi;
    expect(f).toBeDefined();
    // Les participants savent (phase 9 : avec les relations du passé, le fait peut déjà fuiter dès sa première semaine).
    expect(e.connuPar).toEqual(expect.arrayContaining([tp.id, pilote.id]));
    moteur.avancer(m, DIFFUSION.dureeDiffusion);
    expect(e.connuPar.length).toBeGreaterThan(2); // ça a fuité
    expect(e.connuPar.length).toBeLessThanOrEqual(DIFFUSION.connaisseursMax);
    for (const [id, poids] of Object.entries(f.perception)) {
      expect(e.connuPar).toContain(id);
      expect(poids).toBeGreaterThanOrEqual(0);
      expect(poids).toBeLessThanOrEqual(f.rumeur.includes(id) ? RUMEURS.amplification : 1);
      expect(e.connuPar).toContain(f.source[id]); // chacun l'a appris de quelqu'un qui savait
    }
  }, 60_000);

  it('la discrétion freine les fuites (contrefactuel : mêmes tirages, seule la discrétion change)', () => {
    const base = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    moteur.avancer(base, 30);
    const faits = [promesseRompue(base).e, promesseRompue(base).e, promesseRompue(base).e];
    moteur.avancer(base, 1);
    const etendue = (discretion: number) => {
      const m = copierMonde(base);
      for (const p of personnes(m)) p.traits['discretion'] = discretion;
      moteur.avancer(m, 26);
      return faits.reduce((a, e) => a + (m.evenements[e.id]?.connuPar.length ?? 0), 0);
    };
    expect(etendue(2)).toBeGreaterThan(etendue(19));
  }, 60_000);

  it('trop de monde au courant : le fait devient public, avec un événement de révélation qui le cite', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 30);
    const { e } = promesseRompue(m);
    moteur.avancer(m, 1);
    e.connuPar = personnes(m).filter((p) => p.statut === 'actif').slice(0, DIFFUSION.connaisseursMax).map((p) => p.id).sort();
    moteur.avancer(m, 1);
    expect(e.visibilite).toBe('public');
    expect(Object.values(m.evenements).some((x) => x.type === 'information.revelee' && x.causes.includes(e.id))).toBe(true);
  }, 60_000);
});

describe('Phase 8c — réputation perçue', () => {
  it('chacun juge sur ce qu’il sait : témoin, ouï-dire (croyance), rumeur (amplifiée), ignorance', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const { tp, pilote, e } = promesseRompue(m);
    const autres = personnes(m).filter((p) => p.statut === 'actif' && p.id !== tp.id && p.id !== pilote.id);
    const [ignorant, croyant, sceptique, rumeur] = autres as [Personne, Personne, Personne, Personne];
    faitsSuivis(m)[e.id] = { id: e.id, interet: 1, debut: { ...m.date }, perception: { [croyant.id]: 1, [sceptique.id]: 0.3, [rumeur.id]: 1.5 }, rumeur: [rumeur.id], source: {} } as never;
    e.connuPar = [tp.id, pilote.id, croyant.id, sceptique.id, rumeur.id].sort();
    const publique = reputation(m, tp.id).paroleTenue;
    expect(reputation(m, tp.id, ignorant.id).paroleTenue).toBe(publique);
    const temoin = reputation(m, tp.id, pilote.id).paroleTenue;
    expect(temoin).toBeLessThan(publique);
    expect(reputation(m, tp.id, croyant.id).paroleTenue).toBeCloseTo(temoin, 9);
    expect(reputation(m, tp.id, sceptique.id).paroleTenue).toBeGreaterThan(temoin);
    expect(reputation(m, tp.id, rumeur.id).paroleTenue).toBeLessThan(temoin);
  });
});

describe('Phase 8c — avant-projets de règlement', () => {
  it('seules les écuries qui en ont vent peuvent y orienter leur recherche ; perception approximative, puis exacte à la publication', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    while (!avantProjets(m).length) moteur.avancer(m, 1);
    const r = avantProjets(m)[0]!;
    const ecuries = (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).filter((e) => e.statut === 'active');
    const ignorante = ecuries.find((e) => !(r.connuPar ?? []).includes(e.id))!;
    const tp = teamPrincipal(m, ignorante.id)!;
    const prg = () => moteur.commandes.executer(m, { type: 'recherche.programme', auteur: tp.id, source: 'exterieur', parametres: { ecurie: ignorante.id, emplacement: 1, domaine: 'energie', horizon: r.id, part: 0.1 } });
    expect(prg().ok).toBe(false);
    for (const d of LISTE_DOMAINES) expect(intensitePercue(m, ignorante.id, r, d)).toBe(0);
    r.connuPar = [...(r.connuPar ?? []), ignorante.id];
    expect(prg().ok).toBe(true);
    const percues = LISTE_DOMAINES.map((d) => intensitePercue(m, ignorante.id, r, d));
    for (const x of percues) { expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(1); }
    expect(LISTE_DOMAINES.some((d, i) => Math.abs(percues[i]! - (r.intensites[d] ?? 0)) > 1e-6)).toBe(true);
    while (m.date.semaine <= 12) moteur.avancer(m, 1);
    expect(r.statut).toBe('propose');
    for (const d of LISTE_DOMAINES) expect(intensitePercue(m, ignorante.id, r, d)).toBe(r.intensites[d] ?? 0);
  }, 120_000);
});

describe('Phase 8c — format et volumes', () => {
  it('format 21 : migration depuis 20 (la diffusion part des faits nouveaux) ; volumes bornés sur 8 saisons', () => {
    const m = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 52 * 8);
    expect(Object.keys(faitsSuivis(m)).length).toBeLessThanOrEqual(DIFFUSION.faitsMax);
    for (const e of Object.values(m.evenements)) expect(e.connuPar.length).toBeLessThanOrEqual(DIFFUSION.connaisseursMax);
    const ancien = copierMonde(m) as unknown as { tables: Record<string, unknown> };
    delete ancien.tables['faitsSuivis'];
    delete ancien.tables['information'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":20'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(migre.tables['faitsSuivis']).toEqual({});
    expect((migre.tables['information'] as unknown as Record<string, { dernier: number }>)['etat']!.dernier).toBe(m.compteurs['evt']);
  }, 120_000);
});
