/**
 * Remarque du porteur (28/11) : « tu n'avais pris que les temps en qualification, en course ce n'est pas pareil ». Compare les sensibilités
 * du temps au tour (gain pour 1 % de mieux sur un paramètre) entre la voiture de qualification (calage actuel) et une voiture « de course » :
 * masse + carburant moyen, adhérence réduite par l'usure moyenne des pneus, énergie électrique déployable réduite (recharge en course).
 * Lecture seule (n'écrit aucune donnée). Usage : npx tsx tools/sensibilites-course.mts [circuits séparés par des virgules]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';
import { PARAMETRES_SENSIBILITE } from '../src/engine/balance/monoplaces';
import { appuiNaturel, avecAilerons, courbures, profilVitesse, type Trace, type VoiturePhysique } from '../src/engine/circuits/profil';

const COURSE = { carburantMoyenKg: 50, adherence: 0.96, energie: 0.8 };
const voulus = (process.argv[2] ?? 'cir_monza,cir_monaco,cir_suzuka,cir_singapour,cir_mexico').split(',');
const dossiers = ['data/circuits', 'data/circuits/validation', 'data/circuits/reconstruits'];
const traces = dossiers.flatMap((d) => readdirSync(d).filter((f) => f.startsWith('cir_') && f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${d}/${f}`, 'utf8')) as Trace & { altitudeM?: number }));
const varier = (v: VoiturePhysique, cle: string, x: number): VoiturePhysique => {
  const f = 1 + x / 100;
  if (cle === 'puissance') return { ...v, puissanceThermiqueW: v.puissanceThermiqueW * f, puissanceElectriqueW: v.puissanceElectriqueW * f };
  return { ...v, [cle]: (v[cle as keyof VoiturePhysique] as number) * f };
};
const course: VoiturePhysique = { ...VOITURE_REFERENCE, masseKg: VOITURE_REFERENCE.masseKg + COURSE.carburantMoyenKg,
  muMeca: VOITURE_REFERENCE.muMeca * COURSE.adherence, muAero: VOITURE_REFERENCE.muAero * COURSE.adherence, muMotricite: VOITURE_REFERENCE.muMotricite * COURSE.adherence,
  muFreinage: VOITURE_REFERENCE.muFreinage * COURSE.adherence, energieElectriqueTourJ: VOITURE_REFERENCE.energieElectriqueTourJ * COURSE.energie };
const noms: Record<string, string> = { cla: 'appui', cda: 'traînée −1 %', masseKg: 'masse −1 %', muMeca: 'adhérence méca.', muMotricite: 'motricité', muFreinage: 'freinage', puissance: 'puissance' };
console.log('| Circuit | Voiture | Aileron | Temps (s) | ' + PARAMETRES_SENSIBILITE.map((k) => noms[k]).join(' | ') + ' |\n|' + ' --- |'.repeat(4 + PARAMETRES_SENSIBILITE.length));
for (const t of traces.filter((x) => voulus.includes(x.circuit))) {
  const c = { altitudeM: t.altitudeM ?? 0 }, k = courbures(t);
  for (const [nom, v0] of [['qualification', VOITURE_REFERENCE], ['course', course]] as const) {
    const { niveau, profil } = appuiNaturel(t, v0, c, k);
    const base = avecAilerons(v0, niveau);
    const g = PARAMETRES_SENSIBILITE.map((cle) => {
      const x = cle === 'cda' || cle === 'masseKg' ? -1 : 1;
      return (100 * (profil.tempsS - profilVitesse(t, varier(base, cle, x), c, k).tempsS)) / profil.tempsS;
    });
    console.log(`| ${t.circuit} | ${nom} | ${niveau.toFixed(2)} | ${profil.tempsS.toFixed(2)} | ${g.map((x) => x.toFixed(3)).join(' | ')} |`);
  }
}
