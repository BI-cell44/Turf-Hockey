#!/usr/bin/env python3
"""Convertit index.html (document complet) en fragment pour l'outil Artifact de claude.ai.

L'Artifact enveloppe lui-même la page dans <!doctype html><html><head>...<body> :
il faut donc retirer ces balises et les metas charset/viewport.

Usage : python3 tools/artifact_fragment.py index.html sortie.html
"""
import re
import sys

src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding="utf-8").read()
for pat in [r"<!doctype html>\s*", r"<html[^>]*>\s*", r"</html>\s*", r"<head>\s*", r"</head>\s*",
            r"<body[^>]*>", r"</body>\s*", r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
    s = re.sub(pat, "", s, flags=re.I)
open(dst, "w", encoding="utf-8").write(s.strip() + "\n")
print("Fragment écrit :", dst)
