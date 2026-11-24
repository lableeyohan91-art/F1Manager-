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
