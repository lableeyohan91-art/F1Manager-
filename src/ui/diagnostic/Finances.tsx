/** Onglet « Finances » (phase 5a) : trésorerie, budget, plafond, comptes de l'année et bilans passés. Lecture seule. */
import { useState } from 'preact/hooks';
import {
  depensesFixes, facteurBudgetDeveloppement, financesDe, plafond, proprietaireDe, restrictionAero,
  totalDepenses, totalPlafonne, totalRecettes, type ComptesAnnee, type Monde,
} from '../../engine';
import { Carte, ecuries } from './outils';

const m1 = (x: number) => `${x.toLocaleString('fr-FR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} M€`;
const pc = (x: number) => `${Math.round(100 * x)} %`;
const m0 = (x: number) => Math.round(x).toLocaleString('fr-FR');
const LIB_STRATEGIE: Record<string, string> = { equilibre: 'équilibrée', prudent: 'prudente', offensif: 'offensive', a_definir: '—' };

const LIB_TYPE: Record<string, string> = {
  constructeur: 'Constructeur', milliardaire: 'Milliardaire', fonds: "Fonds d'investissement", famille: 'Famille', consortium: 'Consortium',
};

function LignesComptes({ c }: { c: ComptesAnnee }) {
  const lignes: [string, number, string][] = [
    ['Primes du championnat', c.primes, 'recette'], ['Revenus commerciaux', c.commercial, 'recette'], ['Apport du propriétaire', c.apport, 'recette'],
    ['Personnel plafonné', c.personnelPlafonne, 'plafond'], ['Départements', c.departements, 'plafond'], ['Opérations', c.operations, 'plafond'],
    ['Entretien des installations', c.entretien, 'plafond'], ['Développement', c.developpement, 'plafond'],
    ['Pilotes et 3 cadres (hors plafond)', c.salairesHorsPlafond, 'hors'], ['Marketing', c.marketing, 'hors'],
    ['Indemnités', c.indemnites, 'hors'], ['Amendes', c.amendes, 'hors'], ['Dividendes', c.dividendes ?? 0, 'hors'],
  ];
  return (
    <table>
      <tbody>
        {lignes.map(([lib, v, t]) => (
          <tr key={lib}><td>{lib}</td><td class="muted">{t === 'recette' ? 'recette' : t === 'plafond' ? 'sous plafond' : 'hors plafond'}</td><td class="num">{m1(v)}</td></tr>
        ))}
        <tr><td><b>Recettes</b></td><td /><td class="num"><b>{m1(totalRecettes(c))}</b></td></tr>
        <tr><td><b>Dépenses</b></td><td /><td class="num"><b>{m1(totalDepenses(c))}</b></td></tr>
        <tr><td><b>Dont plafonnées</b></td><td /><td class="num"><b>{m1(totalPlafonne(c))}</b></td></tr>
      </tbody>
    </table>
  );
}

export function VueFinances({ monde }: { monde: Monde }) {
  const eqs = ecuries(monde).filter((e) => e.statut === 'active');
  const [choix, setChoix] = useState<string | null>(null);
  const cap = plafond(monde);
  const choisie = eqs.find((e) => e.id === choix);
  return (
    <>
      <Carte titre={`Vue d'ensemble — plafond ${m1(cap)}`}>
        <table>
          <thead><tr><th>Écurie</th><th>Trés.</th><th>Dév.</th><th>Effort</th><th>Aéro</th></tr></thead>
          <tbody>
            {eqs.map((e) => {
              const fi = financesDe(monde, e.id);
              if (!fi) return null;
              return (
                <tr key={e.id} onClick={() => setChoix(e.id)} style={{ cursor: 'pointer' }}>
                  <td>{e.nom}{fi.budget.strategie !== 'equilibre' ? <span class="muted"> · {LIB_STRATEGIE[fi.budget.strategie] ?? fi.budget.strategie}</span> : null}</td>
                  <td class="num">{m0(fi.tresorerieMEUR)}</td><td class="num">{m0(fi.budget.developpementMEUR)}</td>
                  <td class="num">{facteurBudgetDeveloppement(monde, e.id).toFixed(2)}</td>
                  <td class="num">{pc(restrictionAero(monde, e.id) * (1 - fi.sanctionAero))}{fi.sanctionAero ? ' ⚠' : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p class="muted">Montants en M€. Trés. = trésorerie ; Dév. = budget de développement de l'année ; Effort = effort technique (≈ 1,06 au plafond) ;
          Aéro = efficacité du développement aérodynamique (restriction selon le classement, ⚠ = sanction pour dépassement). Touchez une écurie pour voir ses comptes.</p>
      </Carte>
      {choisie && (() => {
        const fi = financesDe(monde, choisie.id)!;
        const pro = proprietaireDe(monde, choisie.id);
        const fixes = depensesFixes(monde, choisie);
        return (
          <>
            <Carte titre={`${choisie.nom} — propriétaire`}>
              {pro ? <p>{LIB_TYPE[pro.type] ?? pro.type} · apport de base {m1(pro.apportBaseMEUR)} · patience {pro.patience} · ambition {pro.ambition} · goût du risque {pro.risque}</p> : <p class="muted">Aucun propriétaire.</p>}
              <p class="muted">Dépenses fixes prévues : plafonnées {m1(fixes.personnelPlafonne + fixes.departements + fixes.operations + fixes.entretien)}, hors plafond {m1(fixes.salairesHorsPlafond + fixes.marketing)}.</p>
            </Carte>
            <Carte titre={`Comptes ${fi.comptes.annee} (en cours)`}><LignesComptes c={fi.comptes} /></Carte>
            {[...fi.historique].reverse().map((h) => (
              <Carte key={h.annee} titre={`Bilan ${h.annee} — trésorerie de fin ${m1(h.tresorerieFin)}${h.depassement > 0 ? ` · dépassement ${m1(h.depassement)}` : ''}`}>
                <LignesComptes c={h} />
              </Carte>
            ))}
          </>
        );
      })()}
    </>
  );
}
