/** Audit de la phase 7 — non-régression : engagements des sponsors, apport commercial réel, entreprises liées. */
import { describe, expect, it } from 'vitest';
import {
  apportCommercialPour, bonusPilotePayant, creerScenarioGrille2026, financesDe, marcheSponsors, sponsorsEngages, table, TABLES, transfererSponsors,
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

  it('priorité 2 et D-131 : apport réel — place libre, ou remplacement rentable d’un sponsor moins généreux, jamais gratuit', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const e = table(m, TABLES.ecuries)['eq_mercedes'] as unknown as Ecurie;
    const p = personnes(m).find((x) => x.poste === 'pilote_titulaire' && x.statut === 'actif' && x.ecurie !== e.id)!;
    const s = sponsors(m).find((x) => x.actif && !x.lie)!;
    s.nationalite = p.nationalite;
    s.secteur = 'secteur de test unique';
    const modele = contrats(m).find((x) => x.statut === 'actif')!;
    table(m, TABLES.contratsSponsoring)['csp_test'] = { ...modele, statut: 'actif', id: 'csp_test', sponsor: s.id, ecurie: p.ecurie, montantAnnuelMEUR: 15, pilote: p.id, rang: 'principal' } as never;
    // L'écurie recruteuse : toutes ses places occupées par des sponsors généreux.
    for (const c of contrats(m)) if (c.ecurie === e.id) c.statut = 'termine';
    const remplir = (rang: 'titre' | 'principal' | 'secondaire', n: number, montant: number, fin: number) => {
      for (let i = 0; i < n; i++) table(m, TABLES.contratsSponsoring)[`csp_${rang}_${i}`] = { ...modele, statut: 'actif', id: `csp_${rang}_${i}`, sponsor: `spo_fictif_${rang}_${i}`, ecurie: e.id, rang, montantAnnuelMEUR: montant, debut: 2027, fin, pilote: undefined } as never;
    };
    remplir('titre', 1, 40, 2030); remplir('principal', 3, 20, 2030); remplir('secondaire', 6, 7.9, 2030);
    expect(apportCommercialPour(m, e, p).netNouveau).toBe(0); // aucun remplacement rentable
    expect(bonusPilotePayant(m, e, p, 2)).toBe(0);
    // Un sponsor principal faible, en fin de contrat : le remplacer devient rentable, indemnité déduite.
    (table(m, TABLES.contratsSponsoring)['csp_principal_0'] as unknown as ContratSponsoring).montantAnnuelMEUR = 2;
    (table(m, TABLES.contratsSponsoring)['csp_principal_0'] as unknown as ContratSponsoring).fin = 2028;
    const r = apportCommercialPour(m, e, p);
    expect(r.netNouveau).toBeCloseTo(15 - 2 - 2 * 1 * 0.5, 5);
    expect(bonusPilotePayant(m, e, p, 2)).toBeGreaterThan(0);
    // Exclusivité de secteur : un sponsor restant du même secteur interdit l'arrivée.
    (sponsors(m).find((x) => x.id !== s.id) as Sponsor).secteur = s.secteur;
    table(m, TABLES.contratsSponsoring)['csp_secondaire_0'] = { ...(table(m, TABLES.contratsSponsoring)['csp_secondaire_0'] as object), sponsor: sponsors(m).find((x) => x.id !== s.id && x.secteur === s.secteur)!.id } as never;
    expect(apportCommercialPour(m, e, p).netNouveau).toBe(0);
    // Pour son écurie actuelle, c'est déjà acquis : rien de nouveau.
    expect(apportCommercialPour(m, table(m, TABLES.ecuries)[p.ecurie] as unknown as Ecurie, p).netNouveau).toBe(0);
  });

  it('D-131 : un remplacement exécuté rompt le contrat remplacé et fait payer l’indemnité', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const e = table(m, TABLES.ecuries)['eq_haas'] as unknown as Ecurie;
    const p = personnes(m).find((x) => x.poste === 'pilote_titulaire' && x.statut === 'actif' && x.ecurie !== e.id)!;
    const s = sponsors(m).find((x) => x.actif && !x.lie)!;
    s.nationalite = p.nationalite;
    s.secteur = 'secteur de test unique';
    const modele = contrats(m).find((x) => x.statut === 'actif')!;
    table(m, TABLES.contratsSponsoring)['csp_test'] = { ...modele, statut: 'actif', id: 'csp_test', sponsor: s.id, ecurie: p.ecurie, montantAnnuelMEUR: 15, pilote: p.id, rang: 'principal', fin: 2030 } as never;
    for (const c of contrats(m)) if (c.ecurie === e.id) c.statut = 'termine';
    for (const [rang, n, montant] of [['titre', 1, 40], ['principal', 3, 20], ['secondaire', 6, 7.9]] as const) {
      for (let i = 0; i < n; i++) table(m, TABLES.contratsSponsoring)[`csp_${rang}_${i}`] = { ...modele, statut: 'actif', id: `csp_${rang}_${i}`, sponsor: `spo_fictif_${rang}_${i}`, ecurie: e.id, rang, montantAnnuelMEUR: i === 0 && rang === 'principal' ? 2 : montant, debut: 2027, fin: 2030, pilote: undefined } as never;
    }
    const fi = financesDe(m, e.id)!;
    const avant = { tresorerie: fi.tresorerieMEUR, indemnites: fi.comptes.indemnites };
    p.ecurie = e.id; // transfert effectif
    m.date = { annee: 2027, semaine: 50 };
    transfererSponsors(m, p);
    const remplace = table(m, TABLES.contratsSponsoring)['csp_principal_0'] as unknown as ContratSponsoring;
    expect(remplace.statut).toBe('rompu');
    expect((table(m, TABLES.contratsSponsoring)['csp_test'] as unknown as ContratSponsoring).ecurie).toBe(e.id);
    const indemnite = 2 * (2030 - 2028 + 1) * 0.5;
    expect(fi.tresorerieMEUR).toBeCloseTo(avant.tresorerie - indemnite, 5);
    expect(fi.comptes.indemnites).toBeCloseTo(avant.indemnites + indemnite, 5);
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
