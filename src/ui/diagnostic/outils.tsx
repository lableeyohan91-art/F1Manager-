import type { ComponentChildren } from 'preact';
import type { Clauses, Contrat, Ecurie, Monde, Personne } from '../../engine';

export const LIBELLES_POSTES: Record<string, string> = {
  team_principal: 'Team principal',
  directeur_technique: 'Directeur technique',
  directeur_sportif: 'Directeur sportif',
  directeur_financier: 'Directeur financier',
  responsable_aero: 'Resp. aérodynamique',
  responsable_conception: 'Resp. conception',
  pilote_titulaire: 'Pilote titulaire',
  pilote_reserve: 'Pilote de réserve',
  pilote_junior: 'Pilote junior',
  ingenieur: 'Ingénieur',
  ancien_pilote: 'Ancien pilote',
};

export const ORDRE_POSTES = Object.keys(LIBELLES_POSTES);

export function liste<T>(monde: Monde, nomTable: string): T[] {
  return Object.values(monde.tables[nomTable] ?? {}) as unknown as T[];
}

export const personnes = (m: Monde) => liste<Personne>(m, 'personnes');
export const ecuries = (m: Monde) => liste<Ecurie>(m, 'ecuries');
export const contrats = (m: Monde) => liste<Contrat>(m, 'contrats');

export const nomComplet = (p: Personne) => `${p.prenom} ${p.nom}`;
export const age = (m: Monde, p: Personne) => m.date.annee - p.anneeNaissance;

/** Couleur indicative d'une note de 1 à 20. */
export function couleurNote(n: number): string {
  if (n >= 17) return 'var(--purple)';
  if (n >= 14) return 'var(--green)';
  if (n >= 10) return 'var(--text)';
  if (n >= 7) return 'var(--yellow)';
  return '#ff8a80';
}

export function Note({ v }: { v: number | undefined }) {
  if (v === undefined || Number.isNaN(v)) return <span class="muted">—</span>;
  return <span class="num" style={{ color: couleurNote(v), fontWeight: 700 }}>{v}</span>;
}

/** Barre horizontale pour une note de 1 à 20 (ou 0–100 avec max). */
export function Barre({ libelle, v, max = 20, accent }: { libelle: string; v: number; max?: number; accent?: boolean }) {
  const pct = Math.max(0, Math.min(100, (v / max) * 100));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 34px', gap: '8px', alignItems: 'center', margin: '3px 0' }}>
      <span class="muted" style={{ fontSize: '.9rem' }}>{libelle}</span>
      <span style={{ background: 'var(--panel-2)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
        <span style={{ display: 'block', width: `${pct}%`, height: '100%', background: accent ? 'var(--accent)' : max === 20 ? couleurNote(v) : 'var(--muted)' }} />
      </span>
      <span class="num" style={{ textAlign: 'right' }}>{v}</span>
    </div>
  );
}

export function Carte({ titre, children }: { titre?: string; children: ComponentChildren }) {
  return (
    <div class="carte">
      {titre && <h3 style={{ marginTop: 0 }}>{titre}</h3>}
      {children}
    </div>
  );
}

export function Lien({ onClick, children }: { onClick: () => void; children: ComponentChildren }) {
  return (
    <a href="#" style={{ color: 'inherit', textDecoration: 'underline dotted' }} onClick={(e) => { e.preventDefault(); onClick(); }}>
      {children}
    </a>
  );
}

/** Clauses d'un contrat en texte court. */
export function texteClauses(c: Clauses): string {
  const morceaux: string[] = [];
  if (c.statutN1) morceaux.push('pilote n°1');
  if (c.indemniteRuptureMEUR) morceaux.push(`indemnité ${c.indemniteRuptureMEUR} M€`);
  if (c.primeVictoireMEUR) morceaux.push(`prime/victoire ${c.primeVictoireMEUR} M€`);
  if (c.note) morceaux.push(c.note);
  return morceaux.join(' · ');
}
