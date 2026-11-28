/**
 * Phase 13f — vue 2D schématique de la course en direct : le vrai tracé du circuit (fiche 11b) et un point par voiture. Elle ne fait
 * qu'afficher l'aperçu du moteur : la place de chaque voiture sur le tracé vient de son retard sur le leader (en tours), et le point
 * glisse d'un aperçu au suivant. Aucune règle propre.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ApercuCourse } from '../../engine';
import { chargerFiches, type Fiche } from './Circuits';

// Couleurs d'écurie : palette neutre attribuée dans l'ordre des identifiants (pas de couleurs de marques réelles).
const PALETTE = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff'];

/** Avancement de chaque voiture en tours, au moment où le leader boucle le tour de l'aperçu. */
export function avancements(a: ApercuCourse): Map<string, number> {
  const tete = a.etat.ordre[0]!;
  const L = a.etat.voitures[tete]!.temps;
  const T = a.tour > 0 ? L / a.tour : a.tempsS;
  return new Map(a.etat.ordre.filter((id) => a.etat.voitures[id]!.enCourse).map((id) => [id, a.tour - (a.etat.voitures[id]!.temps - L) / T]));
}

export function PisteDirect({ a, dureeMs, nous, court }: { a: ApercuCourse; dureeMs: number; nous: string[]; court: (id: string) => string }) {
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [alpha, setAlpha] = useState(1);
  const anim = useRef(0);
  // Aperçu affiché juste avant : départ du glissement quand on passe au tour suivant.
  const dernier = useRef<ApercuCourse | null>(null);
  const depart = useRef<ApercuCourse | null>(null);
  if (dernier.current && dernier.current.tour !== a.tour) depart.current = dernier.current.tour === a.tour - 1 ? dernier.current : null;
  dernier.current = a;
  const precedent = depart.current && depart.current.tour === a.tour - 1 ? depart.current : null;
  useEffect(() => { void chargerFiches().then((f) => setFiche(f[a.circuit] ?? null)); }, [a.circuit]);
  // Glissement d'un aperçu au suivant (seulement d'un tour au suivant).
  useEffect(() => {
    if (!precedent || a.tour !== precedent.tour + 1) { setAlpha(1); return; }
    const t0 = performance.now();
    const pas = () => { const x = Math.min(1, (performance.now() - t0) / dureeMs); setAlpha(x); if (x < 1) anim.current = requestAnimationFrame(pas); };
    setAlpha(0); anim.current = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(anim.current);
  }, [a.tour]);
  if (!fiche) return null;
  const pts = fiche.A.carte.map(([x, y]) => [x, -y] as [number, number]);
  const cum = [0];
  for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1]!, q = pts[i % pts.length]!; cum.push(cum[i - 1]! + Math.hypot(q[0] - p[0], q[1] - p[1])); }
  const total = cum[cum.length - 1]!;
  const point = (f: number): [number, number] => {
    const d = (((f % 1) + 1) % 1) * total;
    let i = 1; while (i < cum.length - 1 && cum[i]! < d) i++;
    const p = pts[i - 1]!, q = pts[i % pts.length]!, k = (d - cum[i - 1]!) / Math.max(1e-9, cum[i]! - cum[i - 1]!);
    return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
  };
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const taille = Math.max(x1 - x0, y1 - y0), marge = taille * 0.08, e = taille / 100;
  const maintenant = avancements(a), avant = precedent ? avancements(precedent) : null;
  const ecuries = [...new Set(Object.values(a.ecuries))].sort();
  const couleur = (id: string) => PALETTE[ecuries.indexOf(a.ecuries[id]!) % PALETTE.length]!;
  const mouille = (a.changementsMeteo.filter((t) => t <= a.tour).length % 2 === 1) !== a.pluie;
  const ordre = [...maintenant.keys()].reverse(); // le leader dessiné en dernier (au-dessus)
  return (
    <svg class="piste-direct" viewBox={`${x0 - marge} ${y0 - marge} ${x1 - x0 + 2 * marge} ${y1 - y0 + 2 * marge}`} role="img" aria-label="Vue de la course sur le tracé">
      <polygon points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')} fill="none" stroke={mouille ? '#4a90d9' : 'var(--line)'} stroke-width={e * 3} stroke-linejoin="round" />
      <polygon points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')} fill="none" stroke={a.etat.neutralisation ? 'var(--yellow)' : 'var(--muted)'} stroke-width={e * 0.6} stroke-linejoin="round" />
      <line x1={pts[0]![0]} y1={pts[0]![1] - e * 3} x2={pts[0]![0]} y2={pts[0]![1] + e * 3} stroke="var(--text)" stroke-width={e * 0.8} />
      {ordre.map((id) => {
        const f1 = maintenant.get(id)!, f0 = avant?.get(id) ?? f1;
        const [x, y] = point(f0 + (f1 - f0) * alpha);
        const n = nous.includes(id);
        return (
          <g key={id}>
            <circle cx={x} cy={y} r={e * (n ? 2.6 : 1.8)} fill={couleur(id)} stroke={n ? 'var(--text)' : '#000'} stroke-width={e * (n ? 0.7 : 0.3)}><title>{court(id)}</title></circle>
            {n && <text x={x + e * 3.5} y={nous.indexOf(id) === 0 ? y - e * 2.5 : y + e * 6} font-size={e * 4.5} fill="var(--text)" font-weight="700">{court(id)}</text>}
          </g>
        );
      })}
    </svg>
  );
}
