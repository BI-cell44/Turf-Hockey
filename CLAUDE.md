# CLAUDE.md — Turf Hockey 26

Ce fichier est lu automatiquement par Claude en début de conversation. Il sert de point d'entrée pour reprendre le projet sans contexte préalable.

## En une phrase
Jeu de hockey (gazon 11 c. 11 et salle 5 c. 5) vu de dessus, jouable à la manette façon eFootball, de 1 à 4 joueurs en local, dans un seul fichier HTML sans dépendance.

## Avant toute modification : lire dans cet ordre
1. `docs/ETAT_DU_PROJET.md` — ce qui marche, ce qui est fragile, où sont les choses.
2. `docs/BACKLOG.md` — ce qui reste à faire et les idées en attente.
3. `docs/DECISIONS_TECHNIQUES.md` — pourquoi le code est fait ainsi (ne pas défaire sans raison).
4. `docs/HISTORIQUE.md` — chronologie des demandes et des versions.

## Où sont les choses
| Élément | Emplacement |
|---|---|
| Code du jeu (source unique) | `index.html` (HTML + CSS + JS, ~1000 lignes) |
| Conversion pour l'Artifact claude.ai | `tools/artifact_fragment.py` |
| Test de fumée (Playwright) | `tests/smoke_test.js` |
| Dépôt GitHub | https://github.com/BI-cell44/Turf-Hockey |
| Copie locale de l'utilisateur | `D:\Developpement\Turf Hockey` (Windows) |
| Version jouable en ligne (Artifact privé) | https://claude.ai/artifact/311wg5uBVQQT7QfieXdHad |

## Règles de travail
- **Langue** : l'utilisateur écrit en français, souvent rapidement (fautes de frappe). Répondre en français simple. Toute l'interface du jeu est en français.
- **Un seul fichier** : tout le jeu reste dans `index.html`. Pas de build, pas de framework, pas de bibliothèque externe (seule ressource distante : la police Google Fonts, avec repli système).
  Exception : le jeu en ligne charge PeerJS à la demande (D13).
- **Contrôle manette d'abord** : chaque nouvel écran ou bouton doit être utilisable à la manette (voir `BTNS`, `navBtns`, `activate` dans la section « Flux de jeu »). La souris et le clavier sont des compléments.
- **Éviter les validations accidentelles** : le bouton A sert aussi à passer/tacler en jeu. Les écrans qui suivent directement une phase de jeu (fin de match) ne doivent pas se valider sur un simple A.
- **Après chaque modification** :
  1. vérifier la syntaxe : extraire le `<script>` et lancer `node --check` (commande en tête de `tests/smoke_test.js`) ;
  2. lancer `node tests/smoke_test.js` (Chromium + Playwright) ;
  3. mettre à jour `docs/HISTORIQUE.md` (nouvelle entrée), `docs/ETAT_DU_PROJET.md` et `docs/BACKLOG.md` ;
  4. republier l'Artifact (voir ci-dessous) puis pousser sur GitHub et recopier dans `D:\Developpement\Turf Hockey` si le PC est relié.
- **Publier l'Artifact** : l'outil Artifact attend un fragment HTML sans `<!doctype>/<html>/<head>/<body>`. Générer le fragment avec `python3 tools/artifact_fragment.py index.html /chemin/scratch/hockey.html`, puis publier ce fichier avec `url` = l'URL de l'Artifact ci-dessus pour garder le même lien.

## Repères dans le code (`index.html`, section `<script>`)
Chaque bloc commence par un commentaire `// ---------- Nom ----------` :
Modes/niveaux/durées → Son → Entrées → Messages → Contrôle humain → Balle → Passes en bande → Arrêts de jeu → IA → Joueur humain → Simulation → Menu → Placement des manettes → Flux de jeu → Rendu → Démarrage.
Le détail de chaque bloc est dans `docs/ETAT_DU_PROJET.md`.
