/** Phase 7c — popularité, valeur commerciale, sponsors personnels, pilotes payants, agents. */
import { describe, expect, it } from 'vitest';
import {
  agentDe, apportCommercial, bonusPilotePayant, commissionNegociee, creerScenarioGrille2026, deserialiser, evaluerOffre, popularite, repondre, serialiser,
  sponsorsDuPilote, table, TABLES, teamPrincipal, valeurCommerciale, verifierCoherence, VERSION_FORMAT, type ContratSponsoring, type Ecurie, type Monde, type Personne,
} from '../src/engine';
import { AGENTS } from '../src/engine/balance/commercial';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const titulaires = (m: Monde) => personnes(m).filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire');

describe('Phase 7c — valeur commerciale et agents', () => {
  it('sur 6 saisons : popularité qui évolue, agents attribués, sponsors personnels, cohérence', () => {
    const m = sc.creerMonde(2);
    sc.creerMoteur().avancer(m, 6 * 52);
    const tit = titulaires(m);
    expect(tit.every((p) => { const pop = popularite(p); return pop.internationale >= 0 && pop.internationale <= 100 && pop.nationale >= pop.internationale - 1e-9; })).toBe(true);
    expect(tit.filter((p) => p.popularite).length).toBeGreaterThan(10);
    expect(Object.keys(table(m, TABLES.agents)).length).toBe(AGENTS.nombre);
    expect(tit.filter((p) => p.agent).length).toBeGreaterThan(tit.length / 2);
    for (const p of tit.filter((x) => x.commission !== undefined)) {
      expect(p.commission!).toBeGreaterThanOrEqual(AGENTS.commissionMin);
      expect(p.commission!).toBeLessThanOrEqual(AGENTS.commissionMax);
    }
    const types = new Set(Object.values(m.evenements).map((e) => e.type));
    expect(types.has('sponsor.personnel') || tit.some((p) => p.sponsorPersonnel || sponsorsDuPilote(m, p.id).length)).toBe(true);
    // Pas de double comptage : un sponsor accompagnant occupe un emplacement de l'écurie de son pilote, jamais un de plus.
    for (const c of Object.values(table(m, TABLES.contratsSponsoring)) as unknown as ContratSponsoring[]) {
      if (c.pilote && c.statut === 'actif') expect(personnes(m).find((p) => p.id === c.pilote)?.ecurie).toBe(c.ecurie);
    }
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  }, 120_000);

  it('valeur commerciale : la rareté de la nationalité compte (deux compatriotes valent moins qu’un seul)', () => {
    const m = sc.creerMonde(1);
    const [a, b] = titulaires(m);
    const nat = a!.nationalite;
    const seul = valeurCommerciale(m, a!);
    const ancienne = b!.nationalite;
    b!.nationalite = nat;
    expect(valeurCommerciale(m, a!)).toBeLessThan(seul);
    b!.nationalite = ancienne;
  });

  it('pilote payant (D-131) : seul un engagement réel d’un partenaire compte, pas une simple supposition', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2); // vivier de sponsors créé
    const e = table(m, TABLES.ecuries)['eq_haas'] as unknown as Ecurie;
    const jeune = personnes(m).find((p) => p.poste === 'pilote_junior' && (p.carriere?.saisonsF1 ?? 0) === 0)!;
    jeune.budgetFamilleMEUR = 8;
    expect(bonusPilotePayant(m, e, jeune, 2)).toBe(0); // un budget familial sans engagement ne suffit plus
    const s = (Object.values(table(m, TABLES.sponsors)) as unknown as { id: string; actif: boolean }[]).find((x) => x.actif)!;
    jeune.engagementF1 = { sponsor: s.id, montantMEUR: 8, jusqua: 2031 };
    expect(apportCommercial(m, jeune)).toBe(8);
    expect(bonusPilotePayant(m, e, jeune, 2)).toBeGreaterThan(0);
    // Un sponsor qui paie le pilote lui-même n'est jamais un revenu de l'écurie.
    delete jeune.engagementF1;
    jeune.sponsorPersonnel = { sponsor: s.id, montantMEUR: 8, jusqua: 2031 };
    expect(bonusPilotePayant(m, e, jeune, 2)).toBe(0);
  });

  it('agent : commission plus faible pour un client de grande valeur, surenchère en contre-offre, poussée au transfert', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 4);
    const p = titulaires(m).find((x) => x.agent)!;
    const a = agentDe(m, p)!;
    const modeste = personnes(m).find((x) => x.poste === 'pilote_junior')!;
    expect(commissionNegociee(m, a, p)).toBeLessThanOrEqual(commissionNegociee(m, a, modeste));
    const autre = (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).find((e) => e.id !== p.ecurie && e.statut === 'active')!;
    const offre = { organisation: autre.id, decideur: teamPrincipal(m, autre.id)!.id, poste: 'pilote_titulaire' as const, salaireMEUR: 1, dureeAnnees: 2, promesses: [], prolongation: false };
    expect(evaluerOffre(m, p, offre).raisons.some((r) => r.libelle === 'son agent pousse au transfert')).toBe(true);
    // Contre-offre avec et sans agent : l'agent pousse la demande plus haut.
    const avec = repondre(m, p, { ...offre, salaireMEUR: 0.9 * 10 }, 'test', true);
    const sauve = p.agent; delete p.agent;
    const sans = repondre(m, p, { ...offre, salaireMEUR: 0.9 * 10 }, 'test', true);
    p.agent = sauve;
    if (avec.type === 'contre_offre' && sans.type === 'contre_offre') expect(avec.salaireDemande).toBeGreaterThanOrEqual(sans.salaireDemande);
  });

  it('une sauvegarde au format 16 est migrée (table des agents créée)', () => {
    const m = sc.creerMonde(1);
    delete (m.tables as Record<string, unknown>)['agents'];
    const migre = deserialiser(serialiser(m).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":16'));
    expect(migre.tables['agents']).toEqual({});
  });
});
