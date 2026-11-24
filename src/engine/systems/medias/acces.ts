/** Phase 11 — image publique et exposition (module sans dépendance vers les autres systèmes). Lu par l'économie, le marché, les décisions. */

import { IMAGE } from '../../balance/medias';
import type { Ecurie, Personne } from '../../model/types';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r1 = (x: number) => Math.round(x * 10) / 10;

/** Image publique d'une personne ou d'une écurie (−100 à 100 ; absente = neutre). */
export const imageDe = (x: Pick<Personne | Ecurie, 'image'> | undefined) => x?.image ?? 0;

export function changerImage(x: Pick<Personne | Ecurie, 'image'>, delta: number): void {
  if (!delta) return;
  x.image = r1(borner((x.image ?? 0) + delta, -100, 100));
}

/** Facteur de la valeur commerciale : une personne mal vue vaut moins pour les sponsors (D-149). */
export const facteurImageCommerciale = (p: Personne) => 1 + IMAGE.valeurCommerciale * (imageDe(p) / 100);

/** Terme d'attrait d'une écurie pour un sponsor. */
export const attraitImage = (e: Ecurie) => IMAGE.attraitSponsor * (imageDe(e) / 100);

/** Points de patience du conseil gagnés (ou perdus) selon l'image de l'écurie. */
export const patienceImage = (e: Ecurie) => IMAGE.patienceConseil * (imageDe(e) / 100);

/** Terme d'utilité d'une offre : une écurie bien vue attire davantage. */
export const utiliteImage = (e: Ecurie) => IMAGE.utiliteCandidat * (imageDe(e) / 100);
