import { describe, expect, it } from 'vitest';
import {
  creerScenarioGrille2026, financesDe, mettreAJourConnaissances, potentielEstime, table, TABLES, teamPrincipal, type Finances, type Monde, type Personne,
} from '../src/engine';
import { CONNAISSANCE } from '../src/engine/balance/juniors';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

describe('Audit indépendant 6b (ChatGPT, commit f3120105) — non-régression', () => {
  it('1. repérage : connaissance acquise progressivement, conservée puis oubliée progressivement', () => {
    const m = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    const jeune = personnes(m).find((p) => p.poste === 'pilote_junior' && 2027 - p.anneeNaissance === 15)!;
    const tp = teamPrincipal(m, 'eq_williams')!;
    const largeur = () => potentielEstime(m, 'eq_williams', jeune).demiLargeur;
    const depart = largeur();
    expect(moteur.commandes.executer(m, { type: 'recrutement.mission', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', personne: jeune.id } }).ok).toBe(true);
    expect(largeur()).toBe(depart); // rien d'immédiat
    moteur.avancer(m, 4);
    const apres4 = largeur();
    moteur.avancer(m, 12);
    const apres16 = largeur();
    expect(apres4).toBeLessThan(depart);
    expect(apres16).toBeLessThan(apres4); // acquisition progressive
    moteur.avancer(m, 16); // la mission (26 semaines) est terminée
    const finMission = largeur();
    expect(finMission).toBeLessThan(depart); // la connaissance est conservée…
    for (let i = 0; i < CONNAISSANCE.demiViePeriodes; i++) mettreAJourConnaissances(m);
    expect(largeur()).toBeGreaterThan(finMission); // … puis s'efface progressivement
  });

  it('2. repérage : refusé à une écurie en crise ou sans trésorerie', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const jeune = personnes(m).find((p) => p.poste === 'pilote_junior')!;
    const tp = teamPrincipal(m, 'eq_haas')!;
    const fi = financesDe(m, 'eq_haas') as Finances;
    const cmd = () => moteur.commandes.executer(m, { type: 'recrutement.mission', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_haas', personne: jeune.id } });
    fi.tresorerieMEUR = 0;
    expect(cmd().ok).toBe(false);
    fi.tresorerieMEUR = 50;
    fi.etatCrise = 'crise';
    expect(cmd().ok).toBe(false);
    fi.etatCrise = 'sain';
    expect(cmd().ok).toBe(true);
  });

  it('3. marché des baquets : prix réellement payé conservé ; baquets subventionnés minoritaires ; l’argent reste un obstacle', () => {
    const m = sc.creerMonde(3);
    sc.creerMoteur().avancer(m, 4);
    const places = personnes(m).filter((p) => p.junior?.annee === 2027);
    expect(places.length).toBeGreaterThan(40);
    expect(places.every((p) => typeof p.junior!.prixMEUR === 'number')).toBe(true);
    const subventionnes = places.filter((p) => p.junior!.subventionne);
    expect(subventionnes.length / places.length).toBeLessThan(0.5);
    // Un baquet subventionné est payé au plus ce que le jeune peut apporter.
    for (const p of subventionnes) expect(p.junior!.prixMEUR!).toBeLessThanOrEqual((p.budgetFamilleMEUR ?? 0) + 10);
    // Les jeunes sans moyens restent moins souvent en baquet que les autres.
    const jeunes = personnes(m).filter((p) => p.statut === 'libre' && p.poste.startsWith('pilote') && 2027 - p.anneeNaissance >= 16 && 2027 - p.anneeNaissance <= 21);
    const taux = (l: Personne[]) => l.filter((p) => p.junior?.annee === 2027).length / Math.max(1, l.length);
    expect(taux(jeunes.filter((p) => (p.budgetFamilleMEUR ?? 0) < 0.3))).toBeLessThan(taux(jeunes.filter((p) => (p.budgetFamilleMEUR ?? 0) >= 1)));
  });
});

describe('Cohérence des promesses d’académie (rapport 6b-2)', () => {
  it('les promesses de titularisation sont le plus souvent tenues (le baquet promis est réellement libéré)', () => {
    let tenues = 0, rompues = 0;
    for (const g of [1, 2, 3]) {
      const m = sc.creerMonde(g);
      sc.creerMoteur().avancer(m, 10 * 52);
      for (const p of Object.values(m.tables['promesses'] ?? {}) as unknown as { type: string; statut: string }[]) {
        if (p.type !== 'titularisation') continue;
        if (p.statut === 'tenue') tenues++;
        if (p.statut === 'rompue') rompues++;
      }
    }
    expect(tenues).toBeGreaterThan(2 * rompues);
  }, 120_000);
});
