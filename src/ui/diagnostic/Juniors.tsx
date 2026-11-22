/** Onglet « Juniors » (phase 6b) : classements Apex 3 et Apex 2, écuries juniors. Lecture seule. */
import { useState } from 'preact/hooks';
import { ecuriesJuniors, saisonJunior, type Monde, type Personne } from '../../engine';
import { CATEGORIES_JUNIORS, type CategorieJunior } from '../../engine/balance/juniors';
import { annuaire, Carte, Lien, nomComplet, personnes } from './outils';
import type { Selection } from './Vues';

export function VueJuniors({ monde, ouvrir }: { monde: Monde; ouvrir: (s: Selection) => void }) {
  const [cat, setCat] = useState<CategorieJunior>('apex2');
  const annees = [monde.date.annee, monde.date.annee - 1];
  const sj = annees.map((a) => saisonJunior(monde, cat, a)).find((s) => s && s.classement.length);
  const per = annuaire(monde);
  const eqs = new Map(ecuriesJuniors(monde).map((e) => [e.id, e]));
  return (
    <>
      <div class="onglets">
        {(Object.keys(CATEGORIES_JUNIORS) as CategorieJunior[]).map((c) => (
          <button key={c} class={`btn ${c === cat ? 'actif' : ''}`} onClick={() => setCat(c)}>{CATEGORIES_JUNIORS[c].libelle}</button>
        ))}
      </div>
      {!sj ? <p class="muted">Aucune saison {CATEGORIES_JUNIORS[cat].libelle} disputée pour l'instant.</p> : (
        <Carte titre={`${CATEGORIES_JUNIORS[cat].libelle} ${sj.annee} — ${sj.manches.filter((m) => m.termine).length}/${sj.manches.length} manches${sj.termine ? ' (terminée)' : ''}`}>
          <table>
            <thead><tr><th>#</th><th>Pilote</th><th>Âge</th><th>Écurie</th><th>Pts</th><th>V</th></tr></thead>
            <tbody>
              {sj.classement.map((l, i) => {
                const p = per.get(l.pilote);
                return (
                  <tr key={l.pilote}>
                    <td class="num">{i + 1}</td>
                    <td>{p ? <Lien onClick={() => ouvrir({ type: 'personne', id: p.id })}>{nomComplet(p)}</Lien> : l.pilote}</td>
                    <td class="num">{p ? sj.annee - p.anneeNaissance : ''}</td>
                    <td>{eqs.get(l.ecurie)?.nom ?? l.ecurie}</td>
                    <td class="num">{l.points}</td><td class="num">{l.victoires}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Carte>
      )}
      <Carte titre={`Écuries ${CATEGORIES_JUNIORS[cat].libelle}`}>
        <table>
          <thead><tr><th>Écurie</th><th>Qualité</th><th>Réput.</th><th>Baquet</th></tr></thead>
          <tbody>
            {ecuriesJuniors(monde).filter((e) => e.categorie === cat).sort((a, b) => b.reputation - a.reputation).map((e) => (
              <tr key={e.id}><td>{e.nom}{e.partenaire ? <span class="muted"> · partenaire F1</span> : null}</td><td class="num">{e.qualite.toFixed(1)}</td><td class="num">{e.reputation}</td><td class="num">{e.prixBaquetMEUR.toFixed(1)} M€</td></tr>
            ))}
          </tbody>
        </table>
      </Carte>
    </>
  );
}
