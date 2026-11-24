/** Phase 11c — écran Finances → Sponsors : offres, objectif du prochain Grand Prix, opération exceptionnelle, contrats en cours. */
import { useState } from 'preact/hooks';
import {
  contratsActifs, estDelegue, LIBELLES_FORMATS, LIBELLES_VARIANTES, montantSansObjectif, objectifsGP, offresSponsors, operationEnAttente, table, TABLES,
  type ClauseSponsor, type Monde, type Personne, type Sponsor,
} from '../../engine';
import { commander, ecurieJoueur, meur, nom, nomCircuit, personne, type Partie } from './partie';
import type { Navigation } from './Jeu';

const nomSponsor = (m: Monde, id: string) => (table(m, TABLES.sponsors)[id] as unknown as Sponsor | undefined)?.nom ?? 'Sponsor';
const pct = (x: number) => `${Math.round(x * 100)} %`;

export function texteClause(c: ClauseSponsor): string {
  switch (c.type) {
    case 'rang': return `finir ${c.seuil}${c.seuil === 1 ? 'er' : 'e'} ou mieux au championnat constructeurs`;
    case 'progression': return `gagner des places : finir ${c.seuil}${c.seuil === 1 ? 'er' : 'e'} ou mieux`;
    case 'podium': return 'au moins un podium dans la saison';
    case 'victoire': return 'au moins une victoire dans la saison';
    case 'arrivees_points': return `au moins ${c.seuil} arrivée${c.seuil > 1 ? 's' : ''} dans les points (meilleur pilote)`;
  }
}

const CONTRAINTE_FORMAT: Record<string, string> = {
  tenues: 'Aucune contrainte : sollicitation légère du pilote.',
  visibilite: 'Logo sur la voiture : peut déplaire à votre sponsor titre.',
  interview: 'Interview exclusive : sollicitation moyenne.',
  campagne: 'Campagne complète : sollicitation lourde (certains pilotes le vivent mal).',
};

const NIVEAU: Record<string, string> = { prudent: 'Prudent', intermediaire: 'Intermédiaire', audacieux: 'Audacieux' };

export function Sponsors({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, setMsg] = useState<string | null>(null);
  const [piloteChoisi, setPilote] = useState('');
  const agir = (type: string, p: Record<string, unknown>, ok: string) => {
    const r = commander(partie, type, p);
    setMsg(r.ok ? ok : `Impossible : ${(r as { motif: string }).motif}`);
    nav.rafraichir();
  };
  const delegue = estDelegue(m, e, 'commercial');
  const offres = offresSponsors(m, e.id);
  const objectif = objectifsGP(m, e.id)[0];
  const op = operationEnAttente(m, e.id);
  const contrats = contratsActifs(m, m.date.annee, e.id).sort((a, b) => ['titre', 'principal', 'secondaire'].indexOf(a.rang) - ['titre', 'principal', 'secondaire'].indexOf(b.rang));
  const titulaires = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste.startsWith('pilote_titulaire'));
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      {delegue && <div class="carte"><p class="muted">Le domaine commercial est délégué : votre directeur commercial choisit les contrats, les objectifs de course et les opérations (Direction → Délégations).</p></div>}

      {offres.map((o) => (
        <div class="carte" key={o.id}>
          <h3>Offre : {nomSponsor(m, o.sponsor)} <span class="badge">{o.rang === 'titre' ? 'titre' : 'principal'}</span></h3>
          <p class="muted">Réponse attendue avant la semaine {o.echeance.semaine}. Sans réponse, votre directeur commercial choisit.</p>
          {o.variantes.map((v) => (
            <div class="carte" key={v.variante}>
              <h4>Contrat {LIBELLES_VARIANTES[v.variante]}</h4>
              <p>Fixe : <strong>{meur(v.fixeMEUR)}</strong> par an</p>
              {v.clauses.map((c, i) => <p key={i}>Prime de {meur(c.primeMEUR)} si {texteClause(c)}</p>)}
              {v.enveloppeGPMEUR ? <p>Primes de course : enveloppe de {meur(v.enveloppeGPMEUR)} sur la saison (un objectif par Grand Prix)</p> : null}
              <p class="muted petit">Au mieux {meur(v.maximumMEUR)} par an.</p>
              <div class="actions"><button class="btn principal" onClick={() => agir('sponsor.signer', { offre: o.id, variante: v.variante }, `Contrat signé avec ${nomSponsor(m, o.sponsor)}.`)}>Signer ce contrat</button></div>
            </div>
          ))}
          <div class="actions"><button class="btn" onClick={() => agir('sponsor.signer', { offre: o.id, variante: null }, 'Offre déclinée.')}>Décliner l’offre</button></div>
          <p class="muted petit">Le sponsor chiffre chaque contrat d’après ce que le public attend de votre écurie. Le contrat prudent rapporte autant en moyenne, sans risque. Un contrat audacieux ne gagne que si vous faites mieux que prévu.</p>
        </div>
      ))}

      {op && (() => {
        const demande = op.pilote ? personne(m, op.pilote) : undefined;
        const pilote = op.pilote ?? (piloteChoisi || op.auteur);
        return (
          <div class="carte">
            <h3>Opération exceptionnelle : {nomSponsor(m, op.sponsor)}</h3>
            <p>Après {op.exploit === 'victoire' ? 'votre victoire' : 'votre podium'} inattendu, votre sponsor propose une opération avant le prochain Grand Prix.</p>
            {demande ? <p>Pilote demandé : <strong>{nom(demande)}</strong></p> : (
              <label class="champ">Pilote (au choix)
                <select value={pilote} onChange={(v) => setPilote((v.target as HTMLSelectElement).value)}>
                  {titulaires.map((p) => <option key={p.id} value={p.id}>{nom(p)}</option>)}
                </select>
              </label>
            )}
            {op.formats.map((f) => (
              <div class="ligne-rang" key={f.format}>
                <span><strong>{LIBELLES_FORMATS[f.format]}</strong> · {meur(f.montantMEUR)}<br /><span class="muted petit">{CONTRAINTE_FORMAT[f.format]}</span></span>
                <button class="btn" onClick={() => agir('sponsor.operation', { operation: op.id, format: f.format, pilote }, 'Opération acceptée.')}>Accepter</button>
              </div>
            ))}
            <div class="actions"><button class="btn" onClick={() => agir('sponsor.operation', { operation: op.id, format: null }, 'Opération refusée.')}>Refuser</button></div>
            <p class="muted petit">Sans réponse avant le prochain Grand Prix, l’équipe décide. La fatigue des pilotes n’existe pas encore (phase 13) ; une sollicitation lourde peut déjà contrarier un pilote discret.</p>
          </div>
        );
      })()}

      {objectif && (() => {
        const gp = table(m, TABLES.grandsPrix)[objectif.gp] as unknown as { circuit: string } | undefined;
        return (
          <div class="carte">
            <h3>Objectif du sponsor titre : {gp ? nomCircuit(m, gp.circuit) : 'prochain Grand Prix'}</h3>
            <p class="muted petit">Estimations de votre directeur sportif (plus précises s’il est bon stratège). Sans choix, votre directeur commercial choisit.</p>
            {objectif.options.map((o) => (
              <div class={`ligne-rang ${objectif.choix === o.niveau ? 'choisi' : ''}`} key={o.niveau}>
                <span><strong>{NIVEAU[o.niveau]}</strong> : meilleur pilote {o.seuil === 1 ? 'vainqueur' : `dans les ${o.seuil} premiers`} · prime {meur(o.primeMEUR)}<br /><span class="muted petit">Chances estimées : {pct(o.estimation[0])} à {pct(o.estimation[1])}</span></span>
                <button class="btn" aria-pressed={objectif.choix === o.niveau} onClick={() => agir('sponsor.objectif_gp', { objectif: objectif.id, choix: o.niveau }, `Objectif ${NIVEAU[o.niveau]!.toLowerCase()} retenu.`)}>{objectif.choix === o.niveau ? 'Choisi' : 'Choisir'}</button>
              </div>
            ))}
            <div class="ligne-rang">
              <span><strong>Aucun objectif</strong> · {meur(montantSansObjectif(objectif))} garantis</span>
              <button class="btn" aria-pressed={objectif.choix === 'aucun'} onClick={() => agir('sponsor.objectif_gp', { objectif: objectif.id, choix: 'aucun' }, 'Aucun objectif pour ce Grand Prix.')}>{objectif.choix === 'aucun' ? 'Choisi' : 'Choisir'}</button>
            </div>
          </div>
        );
      })()}

      <div class="carte">
        <h3>Sponsors sous contrat ({m.date.annee})</h3>
        {contrats.length === 0 ? <p class="muted">Aucun sponsor sous contrat cette année.</p> : contrats.map((c) => (
          <div key={c.id} class="ligne-sponsor">
            <p><strong>{nomSponsor(m, c.sponsor)}</strong> <span class="badge">{c.rang}</span> · {meur(c.montantAnnuelMEUR)} par an jusqu’en {c.fin} · contrat {LIBELLES_VARIANTES[c.variante] ?? c.variante}</p>
            {c.rang !== 'secondaire' && c.clauses.map((x, i) => <p key={i} class="muted petit">Prime {meur(x.primeMEUR)} si {texteClause(x)}{x.atteinte === undefined ? '' : x.atteinte ? ' (tenue l’an dernier)' : ' (manquée l’an dernier)'}</p>)}
            {c.enveloppeGPMEUR ? <p class="muted petit">Enveloppe de course : {meur(c.enveloppeGPMEUR)} par saison</p> : null}
            <p class="muted petit">Satisfaction {Math.round(c.satisfaction)}/100 · primes reçues {meur(c.primesVerseesMEUR)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
