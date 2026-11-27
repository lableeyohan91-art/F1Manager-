/**
 * Diffusion du savoir et piste chez un concurrent (porteur, 27/11/2026).
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, diffuserSavoir, dilemmes, ecuriesActives, entreeEnVigueur, reglementEnVigueur, savoir, table, TABLES, type Reglement } from '../src/engine';
import { DIFFUSION, DIFFUSION_RETARD, LECTURE_REGLEMENT, LISTE_DOMAINES, PISTE_CONCURRENT, REFORME } from '../src/engine/balance/technique';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('Diffusion du savoir', () => {
  it('chaque écurie rattrape une part de l’écart au meilleur, sur le savoir du règlement en vigueur seulement ; plus vite en fin d’ère', () => {
    const m = sc.creerMonde(1);
    m.parametres = { ...(m.parametres ?? {}), 'recherche.diffusionRetard': 0 }; // mécanisme de base, sans la piste 2
    sc.creerMoteur().avancer(m, 2);
    const r = reglementEnVigueur(m)!;
    const [a, b] = ecuriesActives(m);
    const sa = savoir(m, a!.id, 'fond_plat'), sb = savoir(m, b!.id, 'fond_plat');
    for (const e of ecuriesActives(m)) savoir(m, e.id, 'fond_plat').parReglement[r.id] = 0;
    sa.parReglement[r.id] = 10; sb.parReglement[r.id] = 0;
    const fondAvant = sb.fondamental;
    m.date = { annee: r.debut, semaine: 10 };
    diffuserSavoir(m);
    expect(sb.parReglement[r.id]).toBeCloseTo(10 * DIFFUSION.base, 3);
    expect(sb.fondamental).toBe(fondAvant);
    sb.parReglement[r.id] = 0;
    m.date = { annee: r.debut + 4, semaine: 10 };
    diffuserSavoir(m);
    expect(sb.parReglement[r.id]).toBeCloseTo(10 * Math.min(DIFFUSION.max, DIFFUSION.base + 4 * DIFFUSION.parAnneeEre), 3);
    expect(sa.parReglement[r.id]).toBe(10); // le meilleur ne perd rien
  });

  it('une piste chez un concurrent finit par être proposée à une écurie en retard ; l’IA la tranche', () => {
    const m = sc.creerMonde(2);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const r = reglementEnVigueur(m)!;
    const [a, b] = ecuriesActives(m);
    savoir(m, a!.id, 'chassis').parReglement[r.id] = 30;
    savoir(m, b!.id, 'chassis').parReglement[r.id] = 0;
    let proposee = false;
    for (let k = 0; k < 40 && !proposee; k++) {
      m.date = { annee: m.date.annee, semaine: 10 + (k % 40) };
      diffuserSavoir(m);
      proposee = Object.values(m.evenements).some((ev) => ev.type === 'conception.dilemme' && ev.contexte?.['famille'] === 'imitation');
    }
    expect(proposee).toBe(true);
    // L'IA décide aussitôt (écuries non pilotées) : aucune piste en attente pour elles.
    expect(dilemmes(m).filter((d) => d.famille === 'imitation').length).toBe(0);
    expect(PISTE_CONCURRENT.part).toBeGreaterThan(0);
    expect(table(m, TABLES.savoirs)).toBeDefined();
  });
});

describe('Trois pistes du 27/11 (activées)', () => {
  it('piste 2 : une écurie très en retard rattrape plus vite (bonus selon le retard relatif)', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const r = reglementEnVigueur(m)!;
    const [a, b, c] = ecuriesActives(m);
    for (const e of ecuriesActives(m)) savoir(m, e.id, 'fond_plat').parReglement[r.id] = 10;
    savoir(m, a!.id, 'fond_plat').parReglement[r.id] = 10;
    savoir(m, b!.id, 'fond_plat').parReglement[r.id] = 0; // retard total
    savoir(m, c!.id, 'fond_plat').parReglement[r.id] = 8; // petit retard
    m.date = { annee: r.debut, semaine: 10 };
    diffuserSavoir(m);
    expect(savoir(m, b!.id, 'fond_plat').parReglement[r.id]).toBeCloseTo(10 * DIFFUSION.base * (1 + DIFFUSION_RETARD.bonusSavoir), 3);
    expect(savoir(m, c!.id, 'fond_plat').parReglement[r.id]).toBeCloseTo(8 + 2 * DIFFUSION.base * (1 + DIFFUSION_RETARD.bonusSavoir * 0.2), 3);
  });

  it('piste 1 : à une réforme, la perte de savoir varie d’une écurie à l’autre (bornée), et chaque écurie reçoit un événement', () => {
    const m = sc.creerMonde(4);
    sc.creerMoteur().avancer(m, 3);
    const ancien = reglementEnVigueur(m)!;
    for (const e of ecuriesActives(m)) savoir(m, e.id, 'aero_avant').fondamental = 10;
    const nouveau: Reglement = { id: 'reg_test', generation: 2, orientation: 'aero', debut: m.date.annee, fin: m.date.annee + 4, statut: 'annonce', intensites: Object.fromEntries(LISTE_DOMAINES.map((d) => [d, d === 'aero_avant' ? 0.6 : 0])), pneus: 1 };
    table(m, TABLES.reglements)[nouveau.id] = nouveau as never;
    expect(ancien).toBeDefined();
    expect(entreeEnVigueur(m)).toBe(true);
    const restes = ecuriesActives(m).map((e) => savoir(m, e.id, 'aero_avant').fondamental);
    const min = 10 * (1 - Math.min(LECTURE_REGLEMENT.usureMax, REFORME.usureFondamentale * Math.min(1, 0.6 * (1 + LECTURE_REGLEMENT.dispersion))));
    const max = 10 * (1 - REFORME.usureFondamentale * 0.6 * (1 - LECTURE_REGLEMENT.dispersion));
    for (const v of restes) { expect(v).toBeGreaterThanOrEqual(min - 1e-3); expect(v).toBeLessThanOrEqual(max + 1e-3); }
    expect(new Set(restes.map((v) => v.toFixed(2))).size).toBeGreaterThan(3);
    expect(Object.values(m.evenements).filter((e) => e.type === 'reglement.lecture').length).toBe(ecuriesActives(m).length);
  });
});

describe('D-190 — anti-domination aux réformes (options 1 et 2)', () => {
  it('une écurie avec 3 titres dans l’ère est dominante ; les réformes préparées visent ses points forts', async () => {
    const { ecurieDominante, preparerReformes, propositions, avantProjets } = await import('../src/engine/systems/technique');
    const { ANTI_DOMINATION } = await import('../src/engine/balance/technique');
    const m = sc.creerMonde(6);
    sc.creerMoteur().avancer(m, 2);
    const r = reglementEnVigueur(m)!;
    const pal = table(m, TABLES.palmares);
    for (const id of Object.keys(pal)) delete pal[id];
    for (let k = 0; k < 3; k++) pal[`pal_t${k}`] = { id: `pal_t${k}`, saison: r.debut + k, championPilote: '', ecurieChampionPilote: '', championConstructeurs: 'eq_ferrari', note: '' } as never;
    expect(ecurieDominante(m)).toBe('eq_ferrari');
    m.parametres = { ...(m.parametres ?? {}), 'reforme.antiDomination': 0 };
    expect(ecurieDominante(m)).toBeUndefined();
    m.parametres = { ...(m.parametres ?? {}), 'reforme.antiDomination': 1 };
    for (const p of [...propositions(m), ...avantProjets(m)]) delete table(m, TABLES.reglements)[p.id];
    preparerReformes(m);
    const props = [...propositions(m), ...avantProjets(m)];
    expect(props.length).toBeGreaterThan(0);
    const ev = Object.values(m.evenements).find((e) => e.type === 'reglement.anti_domination')!;
    expect(ev).toBeDefined();
    const vises = ev.contexte['domaines'] as string[];
    expect(vises.length).toBe(ANTI_DOMINATION.domainesVises);
    for (const p of props) for (const d of vises) expect(p.intensites[d]!).toBeGreaterThanOrEqual(Math.min(1, ANTI_DOMINATION.hausseIntensite) - 1e-9);
  });
});
