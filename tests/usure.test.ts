/** D-140 — usure du succès : seuil personnel, très loyaux, signal précurseur, motivation. */
import { describe, expect, it } from 'vitest';
import { copierMonde, creerScenarioGrille2026, seuilPersonnel, table, TABLES, usureSucces, type Monde, type Palmares, type Personne } from '../src/engine';
import { USURE_SUCCES } from '../src/engine/balance/marche';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

/** L'écurie gagne les `n` derniers titres constructeurs. */
function titres(m: Monde, ecurie: string, n: number) {
  for (const p of Object.values(table(m, TABLES.palmares)) as unknown as Palmares[]) if (p.saison >= m.date.annee - n) p.championConstructeurs = 'eq_autre';
  for (let k = 1; k <= n; k++) {
    const id = `pal_test_${k}`;
    table(m, TABLES.palmares)[id] = { id, saison: m.date.annee - k, championConstructeurs: ecurie } as never;
  }
}

describe('D-140 — usure du succès', () => {
  it('seuil personnel entre 3 et 5 titres ; les très loyaux ne s’usent jamais', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const p = personnes(m).find((x) => x.statut === 'actif' && x.ecurie === 'eq_mercedes' && x.poste === 'responsable_aero')!;
    for (const [loy, att] of [[1, 3], [20, 5]] as const) {
      p.traits['loyaute'] = loy; p.traits['ambition'] = 20 - att * 4; p.valeurs['stabilite'] = loy; p.valeurs['defi'] = 20 - loy;
      expect(seuilPersonnel(p)).toBeGreaterThanOrEqual(USURE_SUCCES.seuilMin);
      expect(seuilPersonnel(p)).toBeLessThanOrEqual(USURE_SUCCES.seuilMax);
    }
    const c = (Object.values(table(m, TABLES.contrats)) as unknown as { personne: string; debut: number }[]).find((x) => x.personne === p.id)!;
    c.debut = m.date.annee - 8;
    titres(m, 'eq_mercedes', 7);
    p.traits['loyaute'] = 5;
    expect(usureSucces(m, p).usure).toBeGreaterThan(0);
    expect(usureSucces(m, p).signal).toBe(true);
    p.traits['loyaute'] = USURE_SUCCES.loyauteImmunite;
    expect(usureSucces(m, p).usure).toBe(0);
  });

  it('signal précurseur auprès du supérieur, une seule fois ; motivation en baisse (contrefactuel)', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const p = personnes(m).find((x) => x.statut === 'actif' && x.ecurie === 'eq_mercedes' && x.poste === 'responsable_aero')!;
    p.traits['loyaute'] = 5;
    const sans = copierMonde(m);
    const c = (Object.values(table(m, TABLES.contrats)) as unknown as { personne: string; debut: number }[]).find((x) => x.personne === p.id)!;
    c.debut = m.date.annee - 8;
    titres(m, 'eq_mercedes', 7);
    moteur.avancer(m, 12);
    moteur.avancer(sans, 12);
    const signaux = Object.values(m.evenements).filter((e) => e.type === 'personnel.besoin_defi' && e.acteurs.some((a) => a.id === p.id));
    expect(signaux).toHaveLength(1);
    expect(signaux[0]!.acteurs.some((a) => a.role === 'cible')).toBe(true);
    const motivation = (mm: Monde) => (table(mm, TABLES.personnes)[p.id] as unknown as Personne).etat.motivation;
    expect(motivation(m)).toBeLessThan(motivation(sans));
  }, 60_000);
});
