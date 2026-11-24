/**
 * Phase 11b — contrôle des données des 30 circuits du vivier (traces, virages, climat, historique, stands, contraintes, fiches).
 * Reproductible depuis le dépôt ; la cohérence entre fiche et moteur est vérifiée en recalculant avec le moteur.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, pointsEssentiels, sensibilites, type Trace } from '../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';

type Fiche = {
  permanent: boolean; calendrier2026: boolean;
  A: { longueurM: number; virages: number; carte: [number, number][]; virages_: { numero: number; s: number }[] };
  B: { provisoire: boolean; essentiels: { id: string }[]; moinsImportant: { id: string } };
  contraintes: Record<string, unknown>;
  C: { climat: { moisGP: number; mois: Record<string, { airC: number; pluie: number | null }> } | null };
  D: { editions: { annee: number; sc: number | null; vsc: number | null; rouges: number }[] } | null;
  strategie: { stands: { tempsPassageS: number; perteNetteS: number; perteHorsImmobilisationS: number }; difficulteDepassement: number };
};
const fiches = JSON.parse(readFileSync('data/grille-2026/circuits-fiches.json', 'utf8')) as { moyennesCalendrier: Record<string, number>; circuits: Record<string, Fiche> };
const ids = Object.keys(fiches.circuits);
const fichier = (id: string) => ['data/circuits', 'data/circuits/validation', 'data/circuits/reconstruits'].map((d) => `${d}/${id}.json`).find(existsSync)!;
const trace = (id: string) => JSON.parse(readFileSync(fichier(id), 'utf8')) as Trace & { altitudeM: number; points: { x: number; y: number; z: number; v: number }[] };

describe('Phase 11b — les 30 circuits du vivier', () => {
  it('30 circuits, dont 10 permanents ; les 24 du calendrier 2026 en font partie', () => {
    expect(ids).toHaveLength(30);
    expect(ids.filter((id) => fiches.circuits[id]!.permanent)).toHaveLength(10);
    expect(ids.filter((id) => fiches.circuits[id]!.calendrier2026)).toHaveLength(24);
  });

  it.each(ids)('%s : tracé continu, longueur officielle (±1,5 %), vitesses et altitudes plausibles', (id) => {
    const t = trace(id), p = t.points;
    let l = 0, pasMax = 0;
    p.forEach((a, i) => { const b = p[(i + 1) % p.length]!; const d = Math.hypot(b.x - a.x, b.y - a.y); l += d; pasMax = Math.max(pasMax, d); });
    expect(Math.abs(l - t.longueurM) / t.longueurM).toBeLessThan(0.015);
    expect(pasMax).toBeLessThan(3 * t.pasM); // aucun saut : la boucle se referme
    for (const q of p) { expect(q.v).toBeGreaterThan(40); expect(q.v).toBeLessThan(370); expect(Number.isFinite(q.z)).toBe(true); }
  });

  it.each(ids)('%s : virages numérotés de 1 à N (N officiel), dans l’ordre du tour', (id) => {
    const f = fiches.circuits[id]!, v = f.A.virages_;
    expect(v).toHaveLength(f.A.virages);
    v.forEach((x, i) => expect(x.numero).toBe(i + 1));
    for (let i = 1; i < v.length; i++) expect(v[i]!.s).toBeGreaterThanOrEqual(v[i - 1]!.s);
  });

  it.each(ids)('%s : climat sur 12 mois, valeurs plausibles', (id) => {
    const c = fiches.circuits[id]!.C.climat!;
    expect(c).not.toBeNull();
    for (let m = 1; m <= 12; m++) {
      const x = c.mois[String(m)]!;
      expect(x.airC).toBeGreaterThan(-15); expect(x.airC).toBeLessThan(45);
      expect(x.pluie).not.toBeNull(); expect(x.pluie!).toBeGreaterThanOrEqual(0); expect(x.pluie!).toBeLessThan(0.5);
    }
  });

  it.each(ids)('%s : historique cohérent (10 éditions au plus, ordre, SC avant 1993 et VSC avant 2015 « non applicables »)', (id) => {
    const d = fiches.circuits[id]!.D!;
    expect(d.editions.length).toBeGreaterThan(0); expect(d.editions.length).toBeLessThanOrEqual(10);
    for (let i = 1; i < d.editions.length; i++) expect(d.editions[i]!.annee).toBeGreaterThanOrEqual(d.editions[i - 1]!.annee); // deux Grands Prix la même année (2020, 2021) : réel
    for (const e of d.editions) {
      if (e.annee < 1993) expect(e.sc).toBeNull();
      if (e.annee < 2015) expect(e.vsc).toBeNull();
      expect(e.rouges).toBeGreaterThanOrEqual(0);
    }
  });

  it.each(ids)('%s : stands — perte nette distinguée du temps de passage, valeurs plausibles', (id) => {
    const s = fiches.circuits[id]!.strategie.stands;
    expect(s.tempsPassageS).toBeGreaterThan(12); expect(s.tempsPassageS).toBeLessThan(45);
    expect(s.perteNetteS).toBeGreaterThan(5); expect(s.perteNetteS).toBeLessThan(s.tempsPassageS);
    expect(s.perteHorsImmobilisationS).toBeLessThan(s.perteNetteS);
  });

  it.each(ids)('%s : contraintes techniques définies (indices 0–100), essentiels provisoires', (id) => {
    const f = fiches.circuits[id]!;
    for (const k of ['appui', 'traineeVitessePointe', 'puissance', 'adherenceMecanique', 'motricite', 'freinage']) {
      const x = f.contraintes[k] as number;
      expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(100);
    }
    expect(f.B.provisoire).toBe(true);
    expect(f.B.essentiels).toHaveLength(2);
    expect(f.B.essentiels.map((e) => e.id)).not.toContain(f.B.moinsImportant.id);
  });

  it('identité : aucune caractéristique n’est n° 1 sur plus de la moitié du calendrier, et au moins 4 différentes le sont', () => {
    const cal = ids.filter((id) => fiches.circuits[id]!.calendrier2026);
    const n1: Record<string, number> = {};
    for (const id of cal) { const k = fiches.circuits[id]!.B.essentiels[0]!.id; n1[k] = (n1[k] ?? 0) + 1; }
    expect(Math.max(...Object.values(n1))).toBeLessThanOrEqual(cal.length / 2);
    expect(Object.keys(n1).length).toBeGreaterThanOrEqual(4);
  });

  it.each(['cir_monaco', 'cir_spa', 'cir_kyalami'])('%s : les points essentiels de la fiche sont ceux du moteur (même calcul)', (id) => {
    const t = trace(id), c = { altitudeM: t.altitudeM ?? 0 }, k = courbures(t);
    const { niveau } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
    const r = pointsEssentiels(sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), c) as Record<string, number>, fiches.moyennesCalendrier);
    expect(fiches.circuits[id]!.B.essentiels.map((e) => e.id)).toEqual(r.essentiels);
  });
});

describe('Phase 11b — export pour APEX Lab', () => {
  it('l’export couvre les 30 circuits, avec la fiche du jeu et le banc (mêmes calculs que le moteur)', () => {
    const index = JSON.parse(readFileSync('export/apex-lab/index.json', 'utf8')) as { circuits: { circuit: string }[]; caracteristiques: unknown[] };
    expect(index.circuits.map((c) => c.circuit).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      const e = JSON.parse(readFileSync(`export/apex-lab/${id}.json`, 'utf8')) as { fiche: unknown; banc: unknown; points: unknown[]; modele: { tempsTourS: number } };
      expect(e.fiche).not.toBeNull(); expect(e.banc).not.toBeNull(); expect(e.points.length).toBeGreaterThan(500); expect(e.modele.tempsTourS).toBeGreaterThan(50);
    }
  });
});
