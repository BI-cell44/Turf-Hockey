# Turf Hockey 26

Jeu de hockey vu de dessus, jouable à la manette façon eFootball, de 1 à 4 joueurs en local.

- **Gazon 11 contre 11** : 4 quarts-temps, passes aériennes, remises en jeu.
- **Salle 5 contre 5** : 2 mi-temps, balle au sol, bandes latérales et passes en bande.
- 5 niveaux d'IA (Débutant → Légende), statistiques de match, coop ou versus.

## Jouer
Ouvre `index.html` dans Chrome, Edge ou Firefox (double-clic, aucune installation). Branche une manette et appuie sur un bouton pour qu'elle soit détectée.

| Action | Manette | Clavier 1 | Clavier 2 |
|---|---|---|---|
| Se déplacer | Stick gauche / croix | ZQSD | Flèches |
| Passe · tacle | A | J | 1 (pavé) |
| Tir (maintenir) | X | K | 2 |
| Passe en profondeur | Y | I | 5 |
| Passe aérienne (gazon) · en bande (salle) | B | L | 3 |
| Sprint | RB / RT | Maj | 0 |
| Changer de joueur | LB / LT | Espace | . |
| Pause | Start | Échap | + |

Règle du cercle : un but ne compte que si le tir part du cercle (la zone en D devant le but).

## Développement
Voir `CLAUDE.md` et le dossier `docs/` (état, historique, backlog, décisions techniques).
Test rapide : `node tests/smoke_test.js` (nécessite Playwright).
