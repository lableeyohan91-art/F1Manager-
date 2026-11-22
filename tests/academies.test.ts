import { describe, expect, it } from 'vitest';
import {
  academieDe, academies, affiliationDe, affiliationsActives, missionsActives, copierMonde, creerScenarioGrille2026, deserialiser, engageablePar, missionsMax,
  potentielEstime, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT, type Ecurie, type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;
const academiesMissions = (m: Monde) => missionsActives(m, 'eq_williams').length;

describe('Phase 6b-2 — académies, affiliations, mécènes, repérage', () => {
  it('chaque écurie a une académie (2 à 8 places) qui recrute des jeunes et finance leur baquet', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 4);
    expect(academies(m)).toHaveLength(11);
    for (const a of academies(m)) {
      expect(a.places).toBeGreaterThanOrEqual(2);
      expect(a.places).toBeLessThanOrEqual(8);
      const aff = affiliationsActives(m, a.ecurie);
      expect(aff.length).toBeLessThanOrEqual(a.places);
      for (const c of aff) {
        const p = table(m, TABLES.personnes)[c.personne] as unknown as Personne;
        expect(p.statut).toBe('libre');
        expect(c.clauses.financementAnnuelMEUR).toBeGreaterThan(0);
      }
    }
    // Un affilié a bien plus de chances d'avoir un baquet junior qu'un jeune non affilié.
    const jeunes = personnes(m).filter((p) => p.statut === 'libre' && p.poste.startsWith('pilote') && 2027 - p.anneeNaissance >= 16 && 2027 - p.anneeNaissance <= 21);
    const taux = (l: Personne[]) => l.filter((p) => p.junior?.annee === 2027).length / Math.max(1, l.length);
    expect(taux(jeunes.filter((p) => affiliationDe(m, p.id)))).toBeGreaterThan(taux(jeunes.filter((p) => !affiliationDe(m, p.id))));
  });

  it('option prioritaire : un affilié est réservé à son écurie et à son écurie partenaire', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 4);
    const c = affiliationsActives(m, 'eq_redbull')[0]!;
    const p = table(m, TABLES.personnes)[c.personne] as unknown as Personne;
    expect(engageablePar(m, p, ecurie(m, 'eq_redbull'))).toBe(true);
    expect(engageablePar(m, p, ecurie(m, 'eq_racingbulls'))).toBe(true); // lien réel conservé
    expect(engageablePar(m, p, ecurie(m, 'eq_ferrari'))).toBe(false);
  });

  it('repérage : commande du team principal, bornée, qui resserre l’estimation de cette écurie seulement', () => {
    const m = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    const jeune = personnes(m).find((p) => p.poste === 'pilote_junior' && 2027 - p.anneeNaissance === 15)!;
    const avant = potentielEstime(m, 'eq_williams', jeune).demiLargeur;
    const tp = teamPrincipal(m, 'eq_williams')!;
    const cmd = (auteur: string, personne: string) => moteur.commandes.executer(m, { type: 'recrutement.mission', auteur, source: 'exterieur', parametres: { ecurie: 'eq_williams', personne } });
    expect(cmd('per_alonzo', jeune.id).ok).toBe(false); // pas le team principal
    expect(cmd(tp.id, jeune.id).ok).toBe(true);
    expect(cmd(tp.id, jeune.id).ok).toBe(false); // déjà en cours
    // Audit 6b : la connaissance s'acquiert progressivement (rien au lancement, davantage après quelques semaines).
    expect(potentielEstime(m, 'eq_williams', jeune).demiLargeur).toBe(avant);
    moteur.avancer(m, 12);
    expect(potentielEstime(m, 'eq_williams', jeune).demiLargeur).toBeLessThan(avant);
    // Capacité limitée par le département recrutement.
    const autres = personnes(m).filter((p) => p.poste === 'pilote_junior' && p.id !== jeune.id).slice(0, 30);
    let acceptees = academiesMissions(m);
    for (const p of autres) if (cmd(tp.id, p.id).ok) acceptees++;
    expect(acceptees).toBe(missionsMax(m, 'eq_williams'));
  });

  it('sur quelques saisons : mécènes, promesses d’académie, réputation des académies qui évolue', () => {
    const m = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 4 * 52 + 4);
    expect(personnes(m).some((p) => p.mecene)).toBe(true);
    const types = new Set(Object.values(m.evenements).map((e) => e.type));
    expect(types.has('academie.affiliation')).toBe(true);
    expect(academies(m).some((a) => (a.anciens?.length ?? 0) > 0)).toBe(true);
    expect(academieDe(m, 'eq_mercedes')).toBeDefined();
  }, 60_000);

  it('audit 6b n°2 : la capacité évolue avec les moyens et les choix du team principal, progressivement et sans rompre de contrat', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    // Scénario de l'audit : une écurie à 80 M€ sans politique de formation crée une académie de 2 places.
    const e = ecurie(m, 'eq_haas');
    e.budgetMEUR = 80;
    e.politiqueRecrutement = 'pilotes confirmés';
    moteur.avancer(m, 4);
    const petite = academieDe(m, 'eq_haas')!;
    expect(petite.places).toBe(2);
    // L'écurie s'enrichit et adopte une politique de formation : la capacité monte, d'au plus 2 places par an, jusqu'au plafond.
    e.budgetMEUR = 600;
    e.politiqueRecrutement = 'filière jeunes';
    moteur.avancer(m, 52);
    expect(petite.places).toBe(4);
    moteur.avancer(m, 2 * 52);
    expect(petite.places).toBe(8);
    expect(Object.values(m.evenements).some((x) => x.type === 'academie.capacite')).toBe(true);
    // Le team principal choisit de réduire : la capacité baisse sans descendre sous le nombre d'affiliés sous contrat.
    const tp = teamPrincipal(m, e.id)!;
    const cmd = (places: number, auteur = tp.id) => moteur.commandes.executer(m, { type: 'academie.capacite', auteur, source: 'exterieur', parametres: { ecurie: e.id, places } });
    expect(cmd(9).ok).toBe(false); // au-delà du plafond permis
    expect(cmd(2, 'per_alonzo').ok).toBe(false); // pas le team principal
    expect(cmd(2).ok).toBe(true);
    const actifsAvant = affiliationsActives(m, e.id).map((c) => c.id);
    moteur.avancer(m, 52);
    expect(petite.places).toBeGreaterThanOrEqual(Math.max(6, affiliationsActives(m, e.id).length));
    for (const id of actifsAvant) {
      const c = table(m, TABLES.contrats)[id] as unknown as { statut: string; motifFin?: string; fin: number } | undefined;
      // Aucune rupture imposée par la réduction : un contrat non renouvelé l'est à son échéance, pas avant.
      if (c && c.motifFin === 'non_prolonge') expect(c.fin).toBeLessThanOrEqual(m.date.annee - 1);
    }
  }, 60_000);

  it('une sauvegarde au format 9 est migrée : les académies sont créées à la première intersaison', () => {
    const ancien = copierMonde(sc.creerMonde(1)) as unknown as Record<string, unknown>;
    const tables = ancien['tables'] as Record<string, unknown>;
    delete tables['academies'];
    delete tables['missionsReperage'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":9'));
    expect(academies(migre)).toHaveLength(0);
    sc.creerMoteur().avancer(migre, 4);
    expect(academies(migre)).toHaveLength(11);
  });
});
