/** Audit n°5 (tests approfondis) — non-régression : mémoire résiduelle continue, idempotence des traitements importants. */
import { describe, expect, it } from 'vitest';
import {
  activerContratsSignes, ajouterEvenement, cloturerFenetre, creerScenarioGrille2026, deserialiser, effacer, lireEvenement, passerUnMois, reconcilier, relation,
  serialiser, simulerGrandPrix, souvenirsDe, table, TABLES, terminerSaison, VERSION_FORMAT, type GrandPrix, type Monde, type Personne, type Saison,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

/** Deux personnes sans passé commun, et un souvenir de trahison de A envers B. */
function trahison(m: Monde) {
  const [a, b] = personnes(m).filter((p) => p.statut === 'actif').slice(0, 2) as [Personne, Personne];
  const evt = ajouterEvenement(m, { type: 'test.trahison', acteurs: [{ id: b.id, role: 'auteur' }, { id: a.id, role: 'victime' }], importance: 3 });
  const s = lireEvenement(m, a.id, b.id, 'trahison', evt.id, { facteur: 1.3 })!;
  return { a, b, s };
}

describe('Audit n°5 — mémoire résiduelle', () => {
  it('une réconciliation qui efface un souvenir n’aggrave jamais la relation (scénario de l’audit)', () => {
    const m = sc.creerMonde(1);
    const { a, b, s } = trahison(m);
    s.intensite = 0.07; // souvenir déjà affaibli, juste au-dessus du seuil d'effacement
    const avant = relation(m, a.id, b.id).confiance;
    reconcilier(m, a.id, b.id, 'excuses', false);
    expect(souvenirsDe(m, a.id).some((x) => x.id === s.id)).toBe(false); // effacé par les excuses
    expect(relation(m, a.id, b.id).confiance).toBeGreaterThanOrEqual(avant - 1e-9);
  });

  it('l’effacement est continu : la relation est identique juste avant et juste après', () => {
    const m = sc.creerMonde(1);
    const { a, b, s } = trahison(m);
    s.intensite = 0.05;
    const avant = relation(m, a.id, b.id);
    effacer(m, s);
    const apres = relation(m, a.id, b.id);
    for (const axe of ['confiance', 'respect', 'affinite'] as const) expect(apres[axe]).toBeCloseTo(avant[axe], 10);
  });

  it('l’oubli naturel laisse une trace durable, sans saut à l’effacement', () => {
    const m = sc.creerMonde(1);
    const { a, b, s } = trahison(m);
    let precedent = relation(m, a.id, b.id).confiance;
    let mois = 0;
    while (souvenirsDe(m, a.id).some((x) => x.id === s.id) && mois < 400) {
      passerUnMois(m);
      const c = relation(m, a.id, b.id).confiance;
      // La rancune s'estompe : la confiance remonte (ou reste stable), elle ne replonge jamais d'un coup.
      expect(c).toBeGreaterThanOrEqual(precedent - 1e-9);
      precedent = c;
      mois++;
    }
    expect(relation(m, a.id, b.id).confiance).toBeLessThan(0); // une trace négative durable subsiste
  });
});

describe('Audit n°5 — idempotence des traitements importants', () => {
  it('un Grand Prix simulé deux fois ne redistribue ni points, ni victoires, ni expérience, ni événements', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 20);
    const gp = (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => g.termine).sort((x, y) => (x.id < y.id ? -1 : 1))[0]!;
    const s = table(m, TABLES.saisons)[`ssn_${gp.saison}`] as unknown as Saison;
    const etat = () => JSON.stringify({ s, exp: personnes(m).map((p) => p.carriere ?? null), n: Object.keys(m.evenements).length });
    const avant = etat();
    simulerGrandPrix(m, gp.id);
    simulerGrandPrix(m, gp.id);
    expect(etat()).toBe(avant);
  });

  it('fin de saison, prise d’effet des contrats et clôture du marché : un second passage ne change rien', () => {
    const m = sc.creerMonde(2);
    sc.creerMoteur().avancer(m, 52);
    const empreinte = () => serialiser(m);
    const avant = empreinte();
    terminerSaison(m, 2027);
    activerContratsSignes(m);
    cloturerFenetre(m);
    expect(empreinte()).toBe(avant);
  }, 30_000);

  it('une sauvegarde au format 13 est migrée (intensité maximale des souvenirs retirée)', () => {
    const m = sc.creerMonde(1);
    const { s } = trahison(m);
    (s as unknown as Record<string, unknown>)['intensitePic'] = 0.9;
    const migre = deserialiser(serialiser(m).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":13'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(Object.values(table(migre, 'souvenirs')).some((x) => 'intensitePic' in x)).toBe(false);
  });
});
