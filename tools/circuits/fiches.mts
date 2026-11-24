/**
 * Phase 11b — génère les fiches de relecture des circuits test depuis les données et le modèle (reproductible).
 * Usage : npx tsx tools/circuits/fiches.mts > docs/rapports/phase-11b/fiches-5-circuits.md
 */
import { readFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, partsDuTour, pointsEssentiels, sensibilites } from '../../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../../src/engine/balance/profil';

const CIRCUITS = ['cir_monaco', 'cir_monza', 'cir_suzuka', 'cir_singapour', 'cir_mexico'];
const NOMS: Record<string, string> = { cir_monaco: 'Monacco (Monaco)', cir_monza: 'Monzza (Monza)', cir_suzuka: 'Suzuca (Suzuka)', cir_singapour: 'Marinna Bay (Singapour)', cir_mexico: 'Hermanos Rodrigues (Mexico)' };
/** Tendances publiques (connaissance générale des circuits, statut E) : bosses, vibreurs, nature. À confirmer, jamais un réglage. */
const TENDANCES: Record<string, { nature: string; bosses: string; vibreurs: string }> = {
  cir_monaco: { nature: 'urbain', bosses: 'fortes (revêtement routier)', vibreurs: 'peu utilisables (murs)' },
  cir_monza: { nature: 'permanent', bosses: 'faibles', vibreurs: 'agressifs aux chicanes' },
  cir_suzuka: { nature: 'permanent', bosses: 'faibles', vibreurs: 'modérés' },
  cir_singapour: { nature: 'urbain (de nuit)', bosses: 'fortes', vibreurs: 'nombreux aux chicanes' },
  cir_mexico: { nature: 'permanent', bosses: 'marquées', vibreurs: 'modérés' },
};
const LIB: Record<string, string> = { adherenceMecanique: 'virages lents (adhérence mécanique)', appui: 'virages rapides (appui)', trainee: 'vitesse de pointe (faible traînée)', puissance: 'moteur (puissance)', motricite: 'motricité', freinage: 'freinage' };
const PROV = ['adherenceMecanique', 'appui', 'trainee', 'puissance'] as const;
const MOIS = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const donnees = CIRCUITS.map((c) => JSON.parse(readFileSync(`data/circuits/${c}.json`, 'utf8')));
const officiels = JSON.parse(readFileSync('data/circuits/virages-officiels.json', 'utf8'));
// Gains de chaque paramètre (même calcul que le moteur), moyennes sur les circuits disponibles (provisoire : 5 circuits).
const calc = donnees.map((t) => {
  const k = courbures(t), c = { altitudeM: t.altitudeM };
  const { niveau, profil } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  return { niveau, profil, gains: sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), c), parts: partsDuTour(t, profil), k };
});
const moy = Object.fromEntries(PROV.map((p) => [p, calc.reduce((a, x) => a + x.gains[p], 0) / calc.length])) as Record<(typeof PROV)[number], number>;
const lignes: string[] = ['# Phase 11b — Fiches de relecture des 5 circuits test', '', '> Générées par `tools/circuits/fiches.mts` à partir de `data/circuits/*.json` et du modèle de vitesse (24/11/2026). Statuts : **V** vérifié · **R** reconstruit · **E** estimé · **H** hypothèse de conception.', '> **Rien ici n’est encore dans le jeu.** Le classement des caractéristiques est **provisoire** (4 caractéristiques de la voiture actuelle, normalisation sur 5 circuits seulement). Aucun réglage n’est donné : il se découvrira en essais libres (D-161).', ''];
donnees.forEach((t, i) => {
  const x = calc[i]!, pe = pointsEssentiels(Object.fromEntries(PROV.map((p) => [p, x.gains[p]])) as Record<(typeof PROV)[number], number>, moy);
  const pts = t.points as { v: number; gaz: number; z: number; frein: number }[];
  // Pleine charge et plus longue phase à pleine charge (réel), gros freinages (réel), dénivelé.
  let plein = 0, cur = 0, max = 0;
  for (const p of [...pts, ...pts]) { cur = p.gaz >= 98 ? cur + t.pasM : 0; max = Math.max(max, cur); }
  pts.forEach((p) => { if (p.gaz >= 98) plein++; });
  // Zones de freinage réelles (capteur de frein, majorité des tours) : on compte celles qui font perdre plus de 100 km/h.
  let gros = 0;
  for (let j = 0; j < pts.length; j++) {
    if (pts[j]!.frein < 0.5 || pts[(j - 1 + pts.length) % pts.length]!.frein >= 0.5) continue;
    let f = j; while (pts[(f + 1) % pts.length]!.frein >= 0.5 && f - j < pts.length) f++;
    if (pts[j]!.v - pts[f % pts.length]!.v > 100) gros++;
  }
  // Énergie latérale relative transmise aux pneus (somme de v² κ sur le tour, en g·km) : indicateur R de la charge latérale.
  const lat = pts.reduce((a, p, j) => a + ((p.v / 3.6) ** 2 * Math.abs(x.k[j]!)) / 9.81 * t.pasM, 0) / 1000;
  const cl = t.climat, g = cl.mois[cl.moisGP2026], h = t.historique.resume, tend = TENDANCES[t.circuit]!;
  const vo = officiels[t.circuit];
  lignes.push(`## ${NOMS[t.circuit]}`, '');
  lignes.push('**A. Présentation**', '');
  lignes.push(`- Longueur ${(t.longueurM / 1000).toFixed(3)} km · ${t.viragesOfficiels} virages officiels (V) · ${tend.nature} (E) · altitude ${t.altitudeM} m (V) · dénivelé du tracé ${(Math.max(...pts.map((p) => p.z)) - Math.min(...pts.map((p) => p.z))).toFixed(0)} m (R).`);
  lignes.push(`- Tour de référence (qualifications ${t.annee}, médiane de 5 pilotes) : ${t.tempsTourS.mediane.toFixed(3)} s (V) ; modèle : ${x.profil.tempsS.toFixed(1)} s.`);
  lignes.push(`- Voie des stands (course, arrêt compris) : ${t.voieStandsS ? t.voieStandsS.mediane + ' s sur ' + t.voieStandsS.arrets + ' arrêts' : '—'} (V).`, '');
  lignes.push('**B. Ce que le circuit exige (provisoire)**', '');
  lignes.push(`- **Points essentiels** : ${LIB[pe.essentiels[0]]} · ${LIB[pe.essentiels[1]]}. **Le moins important** : ${LIB[pe.moinsImportant]}.`);
  lignes.push(`- Parts normalisées : ${Object.entries(pe.parts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${LIB[k]!.split(' (')[0]} ${Math.round(v * 100)} %`).join(' · ')}.`);
  lignes.push(`- Gains bruts pour +2 % (s) : ${Object.entries(x.gains).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${LIB[k]!.split(' (')[0]} ${v.toFixed(2)}`).join(' · ')}.`);
  lignes.push(`- Le tour selon ce qui limite la vitesse (modèle) : puissance ${Math.round(x.parts.puissance * 100)} % · virages ${Math.round(x.parts.virage * 100)} % · freinage ${Math.round(x.parts.freinage * 100)} % · motricité ${Math.round(x.parts.motricite * 100)} %.`);
  lignes.push(`- Réel : pleine charge ${Math.round((100 * plein) / pts.length)} % de la distance ; plus longue phase à pleine charge ${max} m ; ${gros} gros freinages (plus de 100 km/h perdus) ; vitesse de ${Math.min(...pts.map((p) => p.v))} à ${Math.max(...pts.map((p) => p.v))} km/h.`);
  lignes.push(`- Charge latérale des pneus sur un tour : ${lat.toFixed(1)} g·km (R, indicateur relatif ; l’usure réelle dépendra aussi de l’abrasivité, inconnue : E à venir).`, '');
  lignes.push('**C. Conditions (climat du mois du Grand Prix 2026)**', '');
  lignes.push(`- ${MOIS[cl.moisGP2026]}, course à ${cl.heureCourse} h : air ≈ ${g.airCourseC} °C (E), ${g.joursPluie} jours de pluie dans le mois (${g.statutJoursPluie.startsWith('V') ? 'V' : 'E'}), pluie pendant la course ≈ ${Math.round(g.pluieCourse * 100)} % (E), humidité ${g.humidite ?? '—'} %.`);
  lignes.push(`- Source : ${cl.source.split(',')[0]} — station ${cl.station}. Adhérence de la piste : ${t.adherencePiste?.valeur ?? 1} (R, calée).`);
  lignes.push(`- Contraintes pour les réglages (tendance connue de tous, E ; le réglage se découvrira en essais libres) : bosses ${tend.bosses}, vibreurs ${tend.vibreurs}.`, '');
  lignes.push('**D. Neutralisations (10 dernières éditions réelles)**', '');
  lignes.push(`- Éditions ${h.de}–${h.a} (${h.editions}) : Safety Car ${h.safetyCar.interventions} interventions · ${h.safetyCar.grandsPrix} GP sur ${h.editions} ; VSC ${h.vsc.interventions} · ${h.vsc.grandsPrix} GP sur ${h.vsc.editionsConcernees} ; drapeau rouge ${h.drapeauRouge.interventions} · ${h.drapeauRouge.grandsPrix} GP sur ${h.editions}.`);
  const ver = t.historique.editions.map((e: any) => `${e.annee} ${e.verification.startsWith('identique') ? '✔ officiel' : e.verification.startsWith('corrigée') ? '✔ corrigée' : e.recoupementWikipedia === 'présences identiques' ? '✔ récit' : '? ' + (e.recoupementWikipedia ?? 'non recoupée')}`);
  lignes.push(`- Vérification par édition : ${ver.join(' · ')}.`, '');
  lignes.push('**E. Virages officiels**', '');
  lignes.push(`- ${vo.virages.map((v: any) => `${v.numero}${v.nom ? ' ' + v.nom : ''}${v.confiance.startsWith('sûr') ? '' : ' (' + v.confiance + ')'}`).join(' · ')}.`, '');
});
console.log(lignes.join('\n'));
