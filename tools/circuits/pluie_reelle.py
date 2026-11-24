"""Phase 11b — VÉRIFICATION de la pluie du jeu contre les courses réellement humides (D-159 : récits de Wikipédia en vérification
seulement, jamais intégrés aux données du jeu). Pour chaque édition de l'historique (10 dernières par circuit), lit la section
« Race » de l'article et la classe « humide » si le récit mentionne des pneus pluie ou intermédiaires, ou une pluie pendant la course.
Sortie : un fichier JSON de synthèse (hors données du jeu) : par circuit, éditions humides / éditions lues.
Usage : python3 pluie_reelle.py <sortie.json> <trace.json> ...
"""
import json, re, sys, time
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from recoupement_wikipedia import article, section_course  # noqa: E402  (même lecture que le recoupement des neutralisations)

PNEUS = re.compile(r'intermediate|full[- ]wet|wet tyres|wet-weather tyres|wet weather tyres|extreme wet|rain tyres')
PLUIE = re.compile(r'(torrential|heavy|persistent|light|intermittent|steady|late|sudden) (rain|shower)|in the rain|rain[- ](shortened|affected|hit|soaked)'
                   r'|wet (conditions|race|track|weather|start)|track was (wet|damp)|damp|downpour|rainfall|rain (began|started|fell|arrived|returned|intensified)'
                   r'|(began|started) to rain|drizzle|wet[- ]dry|dry[- ]wet|drying (track|line)')


def humide(texte):
    t = re.sub(r'<ref[^>]*>.*?</ref>|<ref[^/]*/>', '', texte, flags=re.S).lower()
    return bool(PNEUS.search(t) or PLUIE.search(t))


sortie, traces = sys.argv[1], sys.argv[2:]
res = {}
for f in traces:
    d = json.load(open(f))
    lus, humides, detail = 0, 0, []
    for e in d.get('historique', {}).get('editions', []):
        t = article(f"{e['annee']} {e['nom']}")
        time.sleep(3)
        rc = section_course(t) if t else None
        if rc is None:
            detail.append([e['annee'], None]); continue
        h = humide(rc)
        lus += 1; humides += h
        detail.append([e['annee'], h])
    res[d['circuit']] = dict(lues=lus, humides=humides, editions=detail)
    print(d['circuit'], humides, '/', lus, flush=True)
    json.dump(res, open(sortie, 'w'), ensure_ascii=False, indent=1)
