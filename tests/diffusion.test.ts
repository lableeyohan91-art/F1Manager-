/**
 * Diffusion du savoir et piste chez un concurrent (porteur, 27/11/2026).
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, diffuserSavoir, dilemmes, ecuriesActives, reglementEnVigueur, savoir, table, TABLES } from '../src/engine';
import { DIFFUSION, PISTE_CONCURRENT } from '../src/engine/balance/technique';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('Diffusion du savoir', () => {
  it('chaque écurie rattrape une part de l’écart au meilleur, sur le savoir du règlement en vigueur seulement ; plus vite en fin d’ère', () => {
    const m = sc.creerMonde(1);
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
