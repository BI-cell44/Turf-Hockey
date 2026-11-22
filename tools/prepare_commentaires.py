#!/usr/bin/env python3
"""Prépare les commentaires audio du jeu.

Usage : python3 tools/prepare_commentaires.py DOSSIER_JOURNALISTE DOSSIER_CONSULTANT SORTIE
  DOSSIER_JOURNALISTE : dossier contenant audio_journaliste/ (zip décompressé)
  DOSSIER_CONSULTANT  : dossier contenant audio_consultant/
  SORTIE              : dossier de sortie (ex. commentaires/)
- ne garde que les groupes utilisés par le jeu (voir USED) et écarte les clips sans rapport avec le jeu (voir DROP) ;
- convertit en MP3 mono 24 kHz 40 kbit/s ;
- ne garde qu'une variante quand v1 et v2 sont identiques ;
- affiche la ligne `const COM=...` à coller dans index.html.
"""
import sys, os, re, hashlib, subprocess, json, collections
USED = {
 'j': 'intro intro_gazon intro_suite engagement passe passe_bande interception duel cercle tir arret occasion_manquee but but_salle but_refuse sortie coup_franc corner_long mi_temps fin_match match_nul decisif relance ambiance ambiance_salle'.split(),
 'c': 'intro intro_salle intro_gazon but arret occasion technique technique_salle technique_gazon tactique mi_temps fin decisif accord'.split(),
}
# clips écartés car sans rapport avec ce que le jeu sait détecter (revers, raclette, ralenti, poteau, capté…)
DROP = {
 'j': {'arret_04','relance_04','duel_01','duel_03','duel_04','interception_03','tir_03','tir_04','coup_franc_02',
       'occasion_manquee_02','occasion_manquee_05','passe_05'},
 'c': {'technique_01','technique_06','tactique_05','tactique_06','tactique_08'},
}
def main(jd, cd, out):
    src = {'j': os.path.join(jd, 'audio_journaliste'), 'c': os.path.join(cd, 'audio_consultant')}
    com = {'j': collections.OrderedDict(), 'c': collections.OrderedDict()}
    tot = 0
    for v in 'jc':
        os.makedirs(os.path.join(out, v), exist_ok=True)
        names = collections.defaultdict(dict)
        for f in sorted(os.listdir(src[v])):
            m = re.match(r'^(?:consultant_)?(.+)_(\d+)_v([12])\.mp3$', f)
            if not m or m.group(1) not in USED[v] or '%s_%s' % (m.group(1), m.group(2)) in DROP[v]:
                continue
            names[(m.group(1), m.group(2))][m.group(3)] = os.path.join(src[v], f)
        for (g, n), vs in sorted(names.items()):
            h = {k: hashlib.md5(open(p, 'rb').read()).hexdigest() for k, p in vs.items()}
            keep = ['1'] if len(set(h.values())) == 1 else sorted(vs)
            for k in keep:
                dst = os.path.join(out, v, '%s_%s_v%s.mp3' % (g, n, k))
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vs[k], '-ac', '1', '-ar', '24000', '-b:a', '40k', dst], check=True)
                tot += os.path.getsize(dst)
            com[v].setdefault(g, []).append(n + ("'" if len(keep) == 1 else ''))
    js = {v: {g: ' '.join(t) for g, t in com[v].items()} for v in com}
    print('Taille totale : %.1f Mo' % (tot / 1e6), file=sys.stderr)
    print('const COM=' + json.dumps(js, ensure_ascii=False, separators=(',', ':')) + ';')
if __name__ == '__main__':
    main(*sys.argv[1:4])
