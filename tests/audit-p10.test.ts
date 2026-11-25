/**
 * Audit de la phase 10 (ChatGPT, 24/11/2026) et D-152 — non-régression des anomalies confirmées.
 * Les sauvegardes du navigateur (secours, import) sont vérifiées par le parcours réel (tools/parcours-joueur.mjs).
 */
import { describe, expect, it } from 'vitest';
import {
  ajouterSemaines, contratEmploi, creerScenarioGrille2026, decisionsEnAttente, deserialiser, executerCommandeJoueur, noterContact, poserQuestion,
  relation, relationBrute, serialiser, table, TABLE_NEGOCIATIONS, TABLES, teamPrincipal,
  type Conference, type Ecurie, type Monde, type Personne,
} from '../src/engine';
import { DEMANDES_DEPART } from '../src/engine/balance/departs';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ID = 'eq_williams';

function partie(): { m: Monde; manager: Personne } {
  const m = sc.creerMonde(3);
  const moteur = sc.creerMoteur();
  executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: ID, prenom: 'Camille', nom: 'Audit' } });
  const manager = teamPrincipal(m, ID)!;
  executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'personnel', actif: false } });
  return { m, manager };
}
const autre = (m: Monde) => (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === ID && p.poste === 'directeur_financier')!;

describe('Audit P10 — échéances des demandes de départ (P1)', () => {
  const cas: [number, { annee: number; semaine: number }][] = [
    [1, { annee: 2027, semaine: 9 }], [40, { annee: 2027, semaine: 48 }], [44, { annee: 2027, semaine: 52 }],
    [45, { annee: 2028, semaine: 1 }], [51, { annee: 2028, semaine: 7 }], [52, { annee: 2028, semaine: 8 }],
  ];
  for (const [semaine, attendue] of cas) {
    it(`demande en semaine ${semaine} de 2027 : échéance ${attendue.semaine} de ${attendue.annee}`, () => {
      const { m } = partie();
      contratEmploi(m, autre(m).id)!.demandeDepart = { indemnite: 0.2, depuis: { annee: 2027, semaine } };
      m.date = { annee: 2027, semaine };
      const d = decisionsEnAttente(m).find((x) => x.type === 'depart')!;
      expect(d.echeance).toEqual(attendue);
      expect(d.echeance).toEqual(ajouterSemaines({ annee: 2027, semaine }, DEMANDES_DEPART.delaiReponseSemaines));
    });
  }
  it('urgence calculée sur la bonne échéance (semaine 48 pour une échéance en semaine 52 : urgente)', () => {
    const { m } = partie();
    contratEmploi(m, autre(m).id)!.demandeDepart = { indemnite: 0.2, depuis: { annee: 2027, semaine: 44 } };
    m.date = { annee: 2027, semaine: 48 };
    expect(decisionsEnAttente(m).find((x) => x.type === 'depart')!.urgente).toBe(true);
  });
});

describe('Audit P10 — places à pourvoir et fermeture du marché (P2)', () => {
  it('signalées tant que le marché permet d’agir (jusqu’en semaine 48), plus ensuite', () => {
    const { m } = partie();
    const c = contratEmploi(m, autre(m).id)!;
    c.fin = 2027;
    const signale = (semaine: number) => { m.date = { annee: 2027, semaine }; return decisionsEnAttente(m).some((d) => d.type === 'poste_vacant'); };
    expect([25, 26, 44, 47, 48].map(signale)).toEqual([true, true, true, true, true]);
    expect([49, 50].map(signale)).toEqual([false, false]);
  });
});

describe('Audit P10 — nouveaux problèmes trouvés', () => {
  it('l’échéance d’une question de la presse posée en fin d’année passe à l’année suivante', () => {
    const m = sc.creerMonde(2);
    m.date = { annee: 2027, semaine: 52 };
    poserQuestion(m, table(m, TABLES.ecuries)['eq_haas'] as unknown as Ecurie, 'rival', 'eq_alpine');
    const c = Object.values(table(m, TABLES.conferences))[0] as unknown as Conference;
    expect(c.echeance).toEqual({ annee: 2028, semaine: 2 });
  });
  it('une contre-proposition sans suite disparaît avec son contrat (volume borné)', () => {
    const { m } = partie();
    const c = contratEmploi(m, autre(m).id)!;
    c.fin = 2027;
    table(m, TABLE_NEGOCIATIONS)[c.id] = { id: c.id, contrat: c.id, salaireDemande: 9, dureeAnnees: 2, promesses: [], evenement: '' } as never;
    sc.creerMoteur().avancer(m, 51);
    expect(table(m, TABLE_NEGOCIATIONS)[c.id]).toBeUndefined();
  }, 60_000);
});

describe('D-152 — proximité (choix B)', () => {
  it('le lien social d’anciens coéquipiers séparés depuis 2016 s’est estompé ; la familiarité, elle, reste', () => {
    const m = sc.creerMonde(4);
    const r = relationBrute(m, 'per_verstapen', 'per_saintz')!;
    const fam = r.familiarite;
    const avecRecul = relation(m, 'per_verstapen', 'per_saintz');
    const contact = r.contact!;
    noterContact(m, r); // comme s'ils venaient de retravailler ensemble
    const proche = relation(m, 'per_verstapen', 'per_saintz');
    expect(Math.abs(avecRecul.affinite) + Math.abs(avecRecul.respect)).toBeLessThan(Math.abs(proche.affinite) + Math.abs(proche.respect));
    expect(r.familiarite).toBe(fam);
    expect(contact).toBeLessThan(2017 * 52);
  });
  it('la proximité se réduit de moitié en 5 ans sans contact', () => {
    const m = sc.creerMonde(4);
    const r = relationBrute(m, 'per_lauson', 'per_verstapen')!;
    noterContact(m, r);
    const l0 = relation(m, 'per_lauson', 'per_verstapen');
    m.date = { annee: m.date.annee + 5, semaine: m.date.semaine };
    const l5 = relation(m, 'per_lauson', 'per_verstapen');
    const base = relationBrute(m, 'per_lauson', 'per_verstapen')!.base;
    expect(l5.respect - base.respect).toBeCloseTo((l0.respect - base.respect) / 2, 6);
  });
  it('une sauvegarde au format 26 est migrée : les relations familières reçoivent la date du dernier contact', () => {
    const m = sc.creerMonde(4);
    for (const r of Object.values(table(m, 'relations'))) delete (r as { contact?: number }).contact;
    const migre = deserialiser(serialiser(m).replace(/"versionFormat":\d+/g, '"versionFormat":26'));
    const r = relationBrute(migre, 'per_verstapen', 'per_saintz')!;
    expect(r.contact).toBe(2027 * 52);
  });
});

describe('Audit phases 10–11 — départs répétés (cause des doublons de la chronique)', () => {
  it('une personne partie à l’amiable n’est pas réembauchée aussitôt par la même écurie ; indemnité versée une seule fois', () => {
    const m = sc.creerMonde(5);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const p = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === 'eq_alpine' && x.poste === 'responsable_conception')!;
    const tp = teamPrincipal(m, 'eq_alpine')!;
    const fi = (Object.values(table(m, TABLES.finances)) as unknown as { ecurie: string; comptes: { indemnites: number } }[]).find((f) => f.ecurie === 'eq_alpine')!;
    const avant = fi.comptes.indemnites;
    contratEmploi(m, p.id)!.demandeDepart = { indemnite: 0.9, depuis: { ...m.date } };
    expect(moteur.commandes.executer(m, { type: 'contrat.repondre_depart', auteur: tp.id, source: 'ia', parametres: { personne: p.id, accepter: true } })).toEqual({ ok: true });
    expect(p.statut).toBe('libre');
    moteur.avancer(m, 10);
    expect(p.ecurie === 'eq_alpine').toBe(false);
    expect(fi.comptes.indemnites - avant).toBeCloseTo(0.9, 6);
    expect(Object.values(m.evenements).filter((e) => e.type === 'contrat.depart_accepte' && e.acteurs.some((a) => a.id === p.id))).toHaveLength(1);
  });

  it('graine 42, 10 saisons : personne ne demande à partir deux fois la même saison, aucun départ accepté deux fois', () => {
    const m = sc.creerMonde(42);
    const moteur = sc.creerMoteur();
    const vus = new Set<string>();
    const demandes = new Map<string, number>();
    const acceptes = new Map<string, number>();
    for (let k = 0; k < 52 * 10; k++) {
      moteur.avancer(m, 1);
      for (const e of Object.values(m.evenements)) {
        if (vus.has(e.id)) continue;
        vus.add(e.id);
        if (e.type === 'contrat.demande_depart') { const c = `${e.acteurs[0]!.id}|${e.date.annee}`; demandes.set(c, (demandes.get(c) ?? 0) + 1); }
        if (e.type === 'contrat.depart_accepte') { const c = `${e.acteurs.find((a) => a.role === 'cible')!.id}|${e.date.annee}`; compterAccepte(c); }
      }
    }
    function compterAccepte(c: string) { acceptes.set(c, (acceptes.get(c) ?? 0) + 1); }
    expect([...demandes.values()].filter((n) => n > 1)).toEqual([]);
    expect([...acceptes.values()].filter((n) => n > 1)).toEqual([]);
  }, 180_000);
});

describe('Audit P10 — arbitrages du porteur', () => {
  it('2. déléguer le personnel confie la négociation en cours à l’équipe, qui décide aussitôt si son moment habituel est passé', () => {
    const { m, manager } = partie();
    m.date = { annee: 2027, semaine: 35 };
    const p = autre(m);
    const c = contratEmploi(m, p.id)!;
    c.fin = 2027;
    table(m, TABLE_NEGOCIATIONS)[c.id] = { id: c.id, contrat: c.id, salaireDemande: 9, dureeAnnees: 2, promesses: [], evenement: '' } as never;
    expect(decisionsEnAttente(m).some((d) => d.type === 'contre_offre')).toBe(true);
    expect(executerCommandeJoueur(sc.creerMoteur(), m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'personnel', actif: true } })).toEqual({ ok: true });
    expect(table(m, TABLE_NEGOCIATIONS)[c.id]).toBeUndefined();
    expect(Object.values(m.evenements).some((e) => e.type === 'negociation.confiee')).toBe(true);
    // L'équipe a tranché : prolongation, contre-offre réglée ou non-prolongation, mais plus rien n'attend le joueur.
    expect(Object.values(m.evenements).some((e) => e.type.startsWith('negociation.') && e.type !== 'negociation.confiee' && e.acteurs.some((a) => a.id === p.id)) || contratEmploi(m, p.id)!.nonProlonge || contratEmploi(m, p.id)!.fin > 2027).toBe(true);
    expect(decisionsEnAttente(m).some((d) => d.personne === p.id)).toBe(false);
  });

  it('3 et D-168. une demande de départ bloque l’avance : le temps ne dépasse jamais son échéance', async () => {
    const { avancer } = await import('../src/ui/jeu/partie');
    const { m } = partie();
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    contratEmploi(m, autre(m).id)!.demandeDepart = { indemnite: 0.2, depuis: { ...m.date } };
    const echeance = decisionsEnAttente(m).find((d) => d.type === 'depart')!.echeance!;
    const date = { ...m.date };
    const r = await avancer({ monde: m, moteur }, 'grand_prix', () => undefined, 30);
    expect(r).toMatchObject({ arret: 'bloquante', semaines: 0 }); // D-168 : demande bloquante, le temps n'avance pas
    expect(m.date).toEqual(date);
    // Quoi qu'il arrive, on n'a pas dépassé l'échéance.
    expect(m.date.annee * 52 + m.date.semaine).toBeLessThanOrEqual(echeance.annee * 52 + echeance.semaine);
    for (let i = 0; i < 10 && m.date.semaine < echeance.semaine - 1; i++) await avancer({ monde: m, moteur }, 'grand_prix', () => undefined, 30);
    expect(m.date.annee * 52 + m.date.semaine).toBeLessThanOrEqual(echeance.annee * 52 + echeance.semaine);
  }, 120_000);

  it('4. budget agressif (option a) : possible, mais coupé par la direction financière si la trésorerie s’effondre ; une écurie riche le tient mieux', () => {
    const essai = (idEcurie: string) => {
      const m = sc.creerMonde(6);
      const moteur = sc.creerMoteur();
      executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: idEcurie, prenom: 'B', nom: 'Udget' } });
      moteur.avancer(m, 1);
      const tp = teamPrincipal(m, idEcurie)!;
      expect(executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: tp.id, parametres: { ecurie: idEcurie, montant: 215 } })).toEqual({ ok: true });
      moteur.avancer(m, 50);
      const fi = (Object.values(table(m, TABLES.finances)) as unknown as { ecurie: string; tresorerieMEUR: number; budget: { developpementMEUR: number } }[]).find((f) => f.ecurie === idEcurie)!;
      const coupes = Object.values(m.evenements).filter((e) => e.type === 'finances.coupe_budget' && e.acteurs.some((a) => a.id === idEcurie)).length;
      return { coupes, dev: fi.budget.developpementMEUR, tresorerie: fi.tresorerieMEUR };
    };
    const pauvre = essai('eq_haas'), riche = essai('eq_ferrari');
    expect(pauvre.coupes).toBeGreaterThan(0); // la même règle que pour l'IA coupe le développement
    expect(pauvre.dev).toBeLessThan(215);
    expect(riche.tresorerie).toBeGreaterThan(pauvre.tresorerie);
  }, 120_000);
});
