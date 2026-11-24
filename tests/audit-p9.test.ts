/**
 * Audit de la phase 9 (ChatGPT, 24/11/2026) — non-régression des anomalies confirmées.
 * Chaque test échoue avec l'ancien code (vérifié) : juniors datés de 2027 et rivalités effacées, familiarité d'une année entière
 * pour un transfert en cours de saison, carrières incohérentes acceptées, expérience comptée deux fois.
 */
import { describe, expect, it } from 'vitest';
import {
  chargerDonnees, creerScenarioGrille2026, deserialiser, empreinte, relationBrute, serialiser, table, TABLES,
  type Carriere, type Contrat, type Evenement, type Monde, type Personne, type SaisonJunior,
} from '../src/engine';
import { dureePresence, moisPartages, presences } from '../src/engine/generation/histoire';
import { RIVALITE_JUNIOR_POINTS } from '../src/engine/balance/juniors';
import { FAMILIARITE_MENSUELLE } from '../src/engine/balance/memoire';
import { EXPERIENCE_HISTORIQUE } from '../src/engine/balance/carriere';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const fichiers = lireDonneesGrille2026();
const sc = creerScenarioGrille2026(fichiers);
const evenements = (m: Monde) => Object.values(m.evenements) as Evenement[];
const souvenirs = (m: Monde) => Object.values(table(m, 'souvenirs')) as unknown as { porteur: string; cible: string; evenement: string; intensite: number; creeLe: { annee: number; semaine: number } }[];
const fam = (m: Monde, a: string, b: string) => relationBrute(m, a, b)?.familiarite ?? 0;

describe('Audit P9 — chronologie des juniors (P1)', () => {
  for (const g of [1, 7, 13]) {
    it(`graine ${g} : titres juniors datés de leur saison, aucun fait daté du futur, date du monde rétablie`, () => {
      const m = sc.creerMonde(g);
      expect(m.date).toEqual({ annee: 2027, semaine: 1 });
      const titres = evenements(m).filter((e) => e.type === 'junior.titre');
      expect(titres.length).toBeGreaterThan(0);
      for (const e of titres) {
        const sj = (Object.values(table(m, TABLES.saisonsJuniors)) as unknown as SaisonJunior[]).find((s) => s.annee === e.contexte['annee'] && s.categorie === e.contexte['categorie']);
        expect(sj).toBeDefined();
        expect(e.date.annee).toBe(sj!.annee);
      }
      expect(evenements(m).filter((e) => e.date.annee >= 2027)).toEqual([]);
      expect(souvenirs(m).every((s) => s.creeLe.annee < 2027)).toBe(true);
    });
  }

  it('une rivalité junior de la dernière saison (2026) existe encore au départ, chez les deux pilotes, puis s’atténue', () => {
    let verifiees = 0;
    for (const g of [1, 2, 3, 4, 5]) {
      const m = sc.creerMonde(g);
      for (const sj of Object.values(table(m, TABLES.saisonsJuniors)) as unknown as SaisonJunior[]) {
        if (sj.annee !== 2026 || !sj.classement[1] || sj.classement[0]!.points - sj.classement[1].points > RIVALITE_JUNIOR_POINTS) continue;
        const titre = evenements(m).find((e) => e.type === 'junior.titre' && e.contexte['annee'] === 2026 && e.contexte['categorie'] === sj.categorie)!;
        const [a, b] = [sj.classement[0]!.pilote, sj.classement[1]!.pilote];
        const s1 = souvenirs(m).find((s) => s.evenement === titre.id && s.porteur === a && s.cible === b);
        const s2 = souvenirs(m).find((s) => s.evenement === titre.id && s.porteur === b && s.cible === a);
        expect(s1 && s2).toBeTruthy();
        const avant = s1!.intensite;
        sc.creerMoteur().avancer(m, 26);
        const apres = souvenirs(m).find((s) => s.evenement === titre.id && s.porteur === a && s.cible === b);
        expect(apres ? apres.intensite : 0).toBeLessThan(avant);
        verifiees++;
      }
    }
    expect(verifiees).toBeGreaterThan(0);
  }, 120_000);

  it('chaque souvenir a l’âge réel de son fait : aucun n’est plus vieux que le passé reconstruit', () => {
    const m = sc.creerMonde(3);
    const rang = (d: { annee: number; semaine: number }) => d.annee * 52 + d.semaine;
    for (const s of souvenirs(m)) expect(rang(m.date) - rang(s.creeLe)).toBeLessThanOrEqual((2027 - 2010) * 52);
  });
});

describe('Audit P9 — transferts en cours de saison (P1)', () => {
  const m = sc.creerMonde(4);
  it('une saison entière plus 4 mois ensemble (Verstapen et Saintz chez Toro Roso, 2015 puis début 2016) : 16 mois de familiarité', () => {
    expect(fam(m, 'per_verstapen', 'per_saintz')).toBeCloseTo(16 * FAMILIARITE_MENSUELLE, 6);
  });
  it('une demi-saison sans jamais se croiser (Gasli et Albonn échangent leurs places en 2019) : aucune familiarité', () => {
    expect(fam(m, 'per_gasli', 'per_albonn')).toBe(0);
  });
  it('quelques courses ensemble (Lauson chez Red Bul en 2025, 3 mois) : 3 mois de familiarité avec Verstapen', () => {
    expect(fam(m, 'per_lauson', 'per_verstapen')).toBeCloseTo(3 * FAMILIARITE_MENSUELLE, 6);
  });
  it('deux pilotes qui n’ont jamais été dans la même écurie : aucune familiarité', () => {
    expect(fam(m, 'per_noris', 'per_verstapen')).toBe(0);
  });
  it('un pilote transféré deux fois dans l’année (aller et retour) : temps partagé exact', () => {
    const c = (personne: string, ecurieLignee: string, moisDe?: number, moisA?: number): Carriere => ({ id: 'x', personne, ecurieLignee, nomHistorique: '', poste: 'pilote_titulaire', de: 2020, a: 2020, ...(moisDe ? { moisDe } : {}), ...(moisA ? { moisA } : {}), note: '' });
    const p = presences([c('per_x', 'eq_a', 1, 3), c('per_x', 'eq_b', 4, 8), c('per_x', 'eq_a', 9, 12), c('per_y', 'eq_a'), c('per_z', 'eq_b')], 2020);
    expect(dureePresence(p.get('eq_a')!.get('per_x')!)).toBe(7);
    expect(moisPartages(p.get('eq_a')!.get('per_x')!, p.get('eq_a')!.get('per_y')!)).toBe(7);
    expect(moisPartages(p.get('eq_b')!.get('per_x')!, p.get('eq_b')!.get('per_z')!)).toBe(5);
  });
  it('même familiarité d’une exécution à l’autre, et après sauvegarde', () => {
    const autre = sc.creerMonde(4);
    expect(fam(autre, 'per_verstapen', 'per_saintz')).toBe(fam(m, 'per_verstapen', 'per_saintz'));
    expect(fam(deserialiser(serialiser(m)), 'per_lauson', 'per_verstapen')).toBe(fam(m, 'per_lauson', 'per_verstapen'));
  });
  it('l’année du transfert ne compte qu’une fois dans l’expérience (Verstapen : 12 saisons de titulaire, pas 13)', () => {
    const p = table(m, TABLES.personnes)['per_verstapen'] as unknown as Personne;
    // 2015 → 2026 : 12 saisons de titulaire ; avant l'audit, 2016 comptait deux fois (Toro Roso et Red Bul), soit 13.
    expect(p.carriere!.experience!.pluie).toBeCloseTo(12 * EXPERIENCE_HISTORIQUE.pluieParSaison, 6);
    expect(p.carriere!.saisonsF1).toBe(12);
  });
});

describe('Audit P9 — validation des données historiques (P2)', () => {
  const casser = (nom: string, remplacer: (t: string) => string) => () => chargerDonnees({ ...fichiers, [nom]: remplacer(fichiers[nom]!) });
  it('une carrière qui finit avant de commencer est refusée, avec la ligne et la raison', () => {
    expect(casser('carrieres.csv', (t) => t.replace('per_noris;eq_mclaren;McLarren;pilote_titulaire;2019;2026', 'per_noris;eq_mclaren;McLarren;pilote_titulaire;2019;2018'))).toThrow(/carrieres\.csv, ligne 2 \(per_noris, eq_mclaren\) : la fin \(2018\) est antérieure au début \(2019\)/);
  });
  it('un transfert en cours de saison sans mois (chevauchement) est refusé', () => {
    expect(casser('carrieres.csv', (t) => t.replace(/(per_verstapen;eq_racingbulls;[^\n]*;)(;)4\n/, '$1$2\n'))).toThrow(/chevauche le passage chez eq_racingbulls/);
  });
  it('des mois inversés la même année, ou hors de 1 à 12, sont refusés', () => {
    expect(casser('carrieres.csv', (t) => t.replace(/(per_lauson;eq_redbull;Red Bul;pilote_titulaire;2025;2025;[^;\n]*;);3/, '$15;3'))).toThrow(/mois de départ \(3\) précède le mois d'arrivée \(5\)/);
    expect(casser('carrieres.csv', (t) => t.replace(/(per_lauson;eq_redbull;Red Bul;pilote_titulaire;2025;2025;[^;\n]*;);3/, '$1;13'))).toThrow(/moisA/);
  });
  it('une carrière qui déborde sur la saison de départ est refusée (2027 relève des contrats)', () => {
    expect(casser('carrieres.csv', (t) => t.replace('per_noris;eq_mclaren;McLarren;pilote_titulaire;2019;2026', 'per_noris;eq_mclaren;McLarren;pilote_titulaire;2019;2027'))).toThrow(/le passé s'arrête en 2026/);
  });
  it('une histoire hors du passé reconstruit, ou avec un protagoniste trop jeune, est refusée ; une personne inconnue aussi', () => {
    expect(casser('histoires.csv', (t) => t.replace(/\nhis_06;2025;/, '\nhis_06;2030;'))).toThrow(/his_06 est datée de 2030/);
    expect(casser('histoires.csv', (t) => t.replace(/\nhis_06;2025;/, '\nhis_06;2008;'))).toThrow(/his_06 est datée de 2008|à \d+ ans/);
    expect(casser('histoires.csv', (t) => t.replace(/\nhis_06;2025;per_noris/, '\nhis_06;2025;per_inconnu'))).toThrow(/per_inconnu/);
  });
});

describe('Audit P9 — histoires publiques et souvenirs privés', () => {
  const m = sc.creerMonde(5);
  const reelles = evenements(m).filter((e) => e.type === 'histoire.reelle');
  it('une histoire réelle récente et réciproque laisse un souvenir chez chacun (Noris et Piastry, 2025)', () => {
    const e = reelles.find((x) => x.contexte['histoire'] === 'his_06')!;
    expect(souvenirs(m).some((s) => s.evenement === e.id && s.porteur === 'per_noris' && s.cible === 'per_piastry')).toBe(true);
    expect(souvenirs(m).some((s) => s.evenement === e.id && s.porteur === 'per_piastry' && s.cible === 'per_noris')).toBe(true);
  });
  it('une écurie n’est jamais porteuse d’un souvenir ; aucun fait n’est compté deux fois pour la même personne', () => {
    const ecuries = new Set(Object.keys(table(m, TABLES.ecuries)));
    expect(souvenirs(m).some((s) => ecuries.has(s.porteur))).toBe(false);
    const cles = souvenirs(m).map((s) => `${s.evenement}|${s.porteur}|${s.cible}`);
    expect(new Set(cles).size).toBe(cles.length);
  });
  it('les histoires réelles restent dans le journal (faits publics, archives) et sont datées de leur saison', () => {
    expect(reelles.length).toBeGreaterThanOrEqual(20);
    for (const e of reelles) expect(e.texte!.startsWith(`${e.date.annee} :`)).toBe(true);
  });
});

describe('Audit P9 — invariant de la grille 2027', () => {
  it('le passé ne touche à aucun fait fixe : titulaires, écuries, voitures, motoristes, contrats, finances, notes des pilotes, palmarès', () => {
    const d = chargerDonnees(fichiers);
    const m = sc.creerMonde(11);
    const contrats = Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
    // Contrats et affectations des données : mêmes postes, salaires, échéances.
    for (const c of d.contrats) {
      const x = contrats.find((k) => k.personne === c.personne && k.organisation === c.organisation && k.type === 'emploi');
      expect(x, `${c.personne}`).toBeDefined();
      expect({ poste: x!.poste, debut: x!.debut, fin: x!.fin, salaire: x!.salaireMEUR }).toEqual({ poste: c.poste, debut: c.debut, fin: c.fin, salaire: c.salaireMEUR });
    }
    const titulaires = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire');
    expect(titulaires).toHaveLength(22);
    expect(Object.keys(table(m, TABLES.ecuries)).filter((id) => d.ecuries.some((e) => e.id === id))).toHaveLength(11);
    for (const e of d.ecuries) {
      const x = table(m, TABLES.ecuries)[e.id] as unknown as Record<string, unknown>;
      for (const k of ['motoriste', 'niveauVoiture', 'budgetMEUR', 'prestige', 'popularite', 'toleranceConseil'] as const) expect(x[k], `${e.id}.${k}`).toEqual(e[k]);
    }
    for (const mo of d.motoristes) expect((table(m, TABLES.motoristes)[mo.id] as unknown as { niveau: number }).niveau).toBe(mo.niveau);
    for (const f of d.finances) expect((Object.values(table(m, TABLES.finances)) as unknown as { ecurie: string; tresorerieMEUR: number }[]).find((x) => x.ecurie === f.ecurie)!.tresorerieMEUR).toBe(f.tresorerieMEUR);
    for (const p of d.personnes) if (p.competences) {
      const x = table(m, TABLES.personnes)[p.id] as unknown as Personne;
      for (const [k, v] of Object.entries(p.competences)) expect(x.competences[k], `${p.id}.${k}`).toBe(v);
    }
    for (const pal of d.palmares) {
      const x = (Object.values(table(m, TABLES.palmares)) as unknown as { saison: number; championPilote: string; championConstructeurs: string }[]).find((y) => y.saison === pal.saison)!;
      expect([x.championPilote, x.championConstructeurs]).toEqual([pal.championPilote, pal.championConstructeurs]);
    }
  });
});

describe('Audit P9 — déterminisme', () => {
  it('même graine, même monde ; sauvegarde puis rechargement identiques ; 2 saisons après rechargement identiques', () => {
    const a = sc.creerMonde(21), b = sc.creerMonde(21);
    expect(empreinte(a)).toBe(empreinte(b));
    const c = deserialiser(serialiser(a));
    expect(empreinte(c)).toBe(empreinte(a));
    sc.creerMoteur().avancer(a, 104);
    sc.creerMoteur().avancer(c, 104);
    expect(empreinte(c)).toBe(empreinte(a));
  }, 120_000);
});
