/** Audit de la phase 7 — non-régression : engagements des sponsors, apport commercial réel, entreprises liées. */
import { describe, expect, it } from 'vitest';
import {
  apportCommercialPour, bonusPilotePayant, creerScenarioGrille2026, marcheSponsors, sponsorsEngages, table, TABLES,
  type ContratSponsoring, type Ecurie, type Monde, type Personne, type Sponsor,
} from '../src/engine';
import { ENTREPRISES_LIEES } from '../src/engine/balance/commercial';
import { VIVIER_SPONSORS } from '../src/engine/balance/finances';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const sponsors = (m: Monde) => Object.values(table(m, TABLES.sponsors)) as unknown as Sponsor[];
const contrats = (m: Monde) => Object.values(table(m, TABLES.contratsSponsoring)) as unknown as ContratSponsoring[];

describe('Audit de la phase 7 — sponsors et apport commercial', () => {
  it('priorité 1 : un sponsor qui paie un pilote n’est pas engagé une seconde fois par le marché général (scénario de l’audit)', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const engages = sponsorsEngages(m, 2028);
    const s = sponsors(m).find((x) => x.actif && !x.lie && !engages.has(x.id))!;
    const p = personnes(m).find((x) => x.poste === 'pilote_titulaire' && x.statut === 'actif')!;
    p.sponsorPersonnel = { sponsor: s.id, montantMEUR: 8, jusqua: 2028 };
    expect(sponsorsEngages(m, 2028).has(s.id)).toBe(true);
    marcheSponsors(m, 2028);
    expect(contrats(m).some((c) => c.sponsor === s.id && c.statut === 'actif' && c.debut <= 2028 && c.fin >= 2028)).toBe(false);
  });

  it('priorité 1 : conservation — sur 10 saisons, aucun sponsor n’a deux engagements la même saison', () => {
    const m = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    for (let s = 0; s < 10; s++) {
      moteur.avancer(m, 52);
      const annee = m.date.annee;
      const compte = new Map<string, number>();
      for (const c of contrats(m)) if (c.statut === 'actif' && c.debut <= annee && c.fin >= annee) compte.set(c.sponsor, (compte.get(c.sponsor) ?? 0) + 1);
      for (const p of personnes(m)) if (p.statut !== 'retraite' && p.sponsorPersonnel && p.sponsorPersonnel.jusqua >= annee) compte.set(p.sponsorPersonnel.sponsor, (compte.get(p.sponsorPersonnel.sponsor) ?? 0) + 1);
      for (const [id, n] of compte) expect({ id, n }).toEqual({ id, n: 1 });
    }
  }, 120_000);

  it('priorité 2 : l’apport commercial ne compte que ce que l’écurie peut réellement percevoir (scénario de l’audit)', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const e = table(m, TABLES.ecuries)['eq_mercedes'] as unknown as Ecurie; // emplacements pleins au départ
    e.budgetMEUR = 200;
    const p = personnes(m).find((x) => x.poste === 'pilote_titulaire' && x.statut === 'actif' && x.ecurie !== e.id)!;
    const s = sponsors(m).find((x) => x.actif && !x.lie && x.nationalite !== p.nationalite)!;
    s.nationalite = p.nationalite;
    const c = contrats(m).find((x) => x.statut === 'actif' && x.ecurie === p.ecurie)!;
    const csp: ContratSponsoring = { ...c, id: 'csp_test', sponsor: s.id, montantAnnuelMEUR: 15, pilote: p.id, rang: 'principal' };
    table(m, TABLES.contratsSponsoring)['csp_test'] = csp as never;
    // Toutes les places de l'écurie recruteuse sont prises : rien n'est transférable, aucun bonus.
    for (const r of ['titre', 'principal', 'secondaire'] as const) {
      for (let i = 0; i < 10; i++) table(m, TABLES.contratsSponsoring)[`csp_plein_${r}_${i}`] = { ...c, id: `csp_plein_${r}_${i}`, sponsor: `spo_fictif_${r}_${i}`, ecurie: e.id, rang: r, debut: 2027, fin: 2030 } as never;
    }
    const plein = apportCommercialPour(m, e, p);
    expect(plein.potentiel).toBeGreaterThanOrEqual(15);
    expect(plein.netNouveau).toBe(0);
    expect(bonusPilotePayant(m, e, p, 2)).toBe(0);
    // Avec une place libre et sans conflit de secteur, l'apport devient réel.
    for (const k of Object.keys(table(m, TABLES.contratsSponsoring))) if (k.startsWith('csp_plein_principal')) delete table(m, TABLES.contratsSponsoring)[k];
    for (const x of contrats(m)) if (x.ecurie === e.id && x.rang === 'principal' && x.id !== 'csp_test') x.statut = 'termine';
    const libre = apportCommercialPour(m, e, p);
    expect(libre.netNouveau).toBeGreaterThan(0);
    // Pour son écurie actuelle, c'est déjà acquis : rien de nouveau.
    expect(apportCommercialPour(m, table(m, TABLES.ecuries)[p.ecurie] as unknown as Ecurie, p).netNouveau).toBe(0);
  });

  it('priorité 3 : entreprises liées plafonnées et vivier borné sur 25 saisons', () => {
    const m = sc.creerMonde(3);
    const moteur = sc.creerMoteur();
    for (let s = 0; s < 25; s++) {
      moteur.avancer(m, 52);
      const liees = sponsors(m).filter((x) => x.actif && x.lie).length;
      expect(liees).toBeLessThanOrEqual(ENTREPRISES_LIEES.maximum);
      expect(sponsors(m).filter((x) => x.actif && !x.lie).length).toBeLessThanOrEqual(VIVIER_SPONSORS.maximum);
    }
  }, 240_000);
});
