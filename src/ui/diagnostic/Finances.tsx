/** Onglet « Finances » (phases 5a et 5b) : trésorerie, budget, plafond, sponsors, dette, chantiers, comptes et bilans. Lecture seule. */
import { useState } from 'preact/hooks';
import {
  conjoncture, contratsActifs, depensesFixes, facteurBudgetDeveloppement, financesDe, plafond, proprietaireDe, restrictionAero, sponsors,
  table, totalDepenses, totalPlafonne, totalRecettes, type ComptesAnnee, type Monde,
} from '../../engine';
import { Carte, ecuries } from './outils';

const m1 = (x: number) => `${x.toLocaleString('fr-FR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} M€`;
const pc = (x: number) => `${Math.round(100 * x)} %`;
const m0 = (x: number) => Math.round(x).toLocaleString('fr-FR');
const LIB_STRATEGIE: Record<string, string> = { equilibre: 'équilibrée', prudent: 'prudente', offensif: 'offensive', endettement: 'endettement', a_definir: '—' };

const LIB_ETAT: Record<string, string> = { sain: '', tension: 'tension', crise: 'CRISE', administration: 'ADMINISTRATION' };
const LIB_RANG: Record<string, string> = { titre: 'Sponsor titre', principal: 'Principal', secondaire: 'Secondaire' };

const LIB_TYPE: Record<string, string> = {
  constructeur: 'Constructeur', milliardaire: 'Milliardaire', fonds: "Fonds d'investissement", famille: 'Famille', consortium: 'Consortium',
};

function LignesComptes({ c }: { c: ComptesAnnee }) {
  const lignes: [string, number, string][] = [
    ['Primes du championnat', c.primes, 'recette'], ['Revenus commerciaux', c.commercial, 'recette'], ['Sponsors', c.sponsors ?? 0, 'recette'], ['Apport du propriétaire', c.apport, 'recette'],
    ['Personnel plafonné', c.personnelPlafonne, 'plafond'], ['Départements', c.departements, 'plafond'], ['Opérations', c.operations, 'plafond'],
    ['Entretien des installations', c.entretien, 'plafond'], ['Entretien des installations (hors plafond)', c.entretienHorsPlafond ?? 0, 'hors'], ['Développement', c.developpement, 'plafond'],
    ['Pilotes et 3 cadres (hors plafond)', c.salairesHorsPlafond, 'hors'], ['Marketing', c.marketing, 'hors'],
    ['Indemnités', c.indemnites, 'hors'], ['Amendes', c.amendes, 'hors'], ['Dividendes', c.dividendes ?? 0, 'hors'],
    ['Intérêts de la dette', c.interets ?? 0, 'hors'], ['Investissements (infrastructures)', c.investissements ?? 0, 'hors'],
    ['Apports exceptionnels (sauvetage, rachat)', c.apportsExceptionnels ?? 0, 'exceptionnel'],
  ];
  return (
    <table>
      <tbody>
        {lignes.map(([lib, v, t]) => (
          <tr key={lib}><td>{lib}</td><td class="muted">{t === 'recette' ? 'recette' : t === 'plafond' ? 'sous plafond' : t === 'exceptionnel' ? 'hors exploitation' : 'hors plafond'}</td><td class="num">{m1(v)}</td></tr>
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
      <Carte titre={`Vue d'ensemble — plafond ${m1(cap)} · conjoncture ${pc(conjoncture(monde))}`}>
        <table>
          <thead><tr><th>Écurie</th><th>Trés.</th><th>Dette</th><th>Dév.</th><th>Effort</th><th>Aéro</th></tr></thead>
          <tbody>
            {eqs.map((e) => {
              const fi = financesDe(monde, e.id);
              if (!fi) return null;
              return (
                <tr key={e.id} onClick={() => setChoix(e.id)} style={{ cursor: 'pointer' }}>
                  <td>{e.nom}{fi.budget.strategie !== 'equilibre' ? <span class="muted"> · {LIB_STRATEGIE[fi.budget.strategie] ?? fi.budget.strategie}</span> : null}
                    {LIB_ETAT[fi.etatCrise] ? <span style={{ color: 'var(--accent, #e10600)' }}> · {LIB_ETAT[fi.etatCrise]}</span> : null}</td>
                  <td class="num">{m0(fi.tresorerieMEUR)}</td><td class="num">{fi.detteMEUR > 0.5 ? m0(fi.detteMEUR) : '—'}</td><td class="num">{m0(fi.budget.developpementMEUR)}</td>
                  <td class="num">{facteurBudgetDeveloppement(monde, e.id).toFixed(2)}</td>
                  <td class="num">{pc(restrictionAero(monde, e.id) * (1 - fi.sanctionAero))}{fi.sanctionAero ? ' ⚠' : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p class="muted">Montants en M€. Trés. = trésorerie ; Dette = emprunts en cours ; Dév. = budget de développement de l'année ; Effort = effort technique (≈ 1,06 au plafond) ;
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
            <Carte titre="Sponsors">
              {(() => {
                const parId = new Map(sponsors(monde).map((s) => [s.id, s]));
                const cs = contratsActifs(monde, monde.date.annee, choisie.id).sort((a, b) => b.montantAnnuelMEUR - a.montantAnnuelMEUR);
                if (!cs.length) return <p class="muted">Aucun sponsor sous contrat cette année.</p>;
                return (
                  <table>
                    <thead><tr><th>Sponsor</th><th>M€/an</th><th>Objectif</th><th>Fin</th><th>Satisf.</th></tr></thead>
                    <tbody>
                      {cs.map((c) => (
                        <tr key={c.id}>
                          <td>{parId.get(c.sponsor)?.nom ?? c.sponsor}<br /><span class="muted">{LIB_RANG[c.rang]}{c.clauseSortie ? ' · clause de sortie' : ''}</span></td>
                          <td class="num">{m1(c.montantAnnuelMEUR).replace(' M€', '')}</td><td class="num">{c.variante ?? 'prudente'} · {(c.clauses ?? []).map((x) => `${x.type} ${x.seuil}`).join(', ')}</td><td class="num">{c.fin}</td><td class="num">{c.satisfaction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </Carte>
            <Carte titre="Dette et chantiers">
              <p>{fi.detteMEUR > 0.5 ? `Dette : ${m1(fi.detteMEUR)}.` : 'Aucune dette.'} État : {fi.etatCrise === 'sain' ? 'sain' : LIB_ETAT[fi.etatCrise]}.</p>
              {fi.projets.length ? fi.projets.map((p) => (
                <p key={p.id}>{p.nature === 'amelioration' ? 'Agrandissement' : 'Rénovation'} ({String(table(monde, 'installations')[p.installation]?.['type'] ?? p.installation)}) :
                  {' '}{m1(p.depenseMEUR)} payés sur {m1(p.coutPrevuMEUR)} annoncés · {Math.round(p.avancementSemaines)} / {p.dureePrevueSemaines} semaines prévues{p.retardAnnonce ? ' · en retard' : ''}</p>
              )) : <p class="muted">Aucun chantier en cours.</p>}
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
