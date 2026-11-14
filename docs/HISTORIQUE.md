# Historique — Turf Hockey 26

Chronologie des demandes de l'utilisateur et de ce qui a été livré. Les numéros de version sont ceux de l'Artifact claude.ai (https://claude.ai/artifact/311wg5uBVQQT7QfieXdHad). Ajouter une entrée en haut à chaque session.

---

## 14/11/2026 — Changement de côté à la mi-temps
- Demande : « prévoir le changement de côté à la mi-temps (en gazon et en salle) ».
- Livré : à la fin de la mi-temps (après le Q2 en gazon, après la 1re mi-temps en salle), les équipes inversent leur sens d'attaque (`teams[t].dir`), les joueurs et le gardien se replacent côté opposé au coup d'envoi. Mention « Les équipes changent de côté » sur l'écran de pause et message « Les équipes ont changé de côté » à la reprise. Les buts gardent la couleur de l'équipe qui les défend.
- Test : match de salle accéléré avec l'horloge simulée de Playwright (voir D11).

## 14/11/2026 — Mise en dépôt et documentation
- Demande : déposer le code sur https://github.com/BI-cell44/Turf-Hockey et dans `D:\Developpement\Turf Hockey`, avec une mémoire de projet (CLAUDE.md + docs/).
- Livré : `index.html` autonome (document HTML complet), `tools/artifact_fragment.py`, `tests/smoke_test.js`, README, CLAUDE.md, docs (état, historique, backlog, décisions).

## 14/11/2026 — v9 : coop et défenseurs
- En multi, la passe donne le receveur à **l'autre** humain de l'équipe (`passCtrl`).
- Défenseurs : placement en repère d'équipe avec plancher de profondeur, ils ne collent plus à la ligne de fond et remontent quand l'équipe attaque.

## 14/11/2026 — v8 : six corrections
- La balle ne traverse plus le filet après un but (`netClamp`).
- Balle plus grosse avec contour sombre ; points de penalty plus discrets.
- Buts : cadre aux couleurs de l'équipe, filet noir.
- Remise en jeu : la balle sortait aussitôt (tireur placé hors du terrain) → placement à l'intérieur + balle bloquée dans le terrain pendant la protection.
- Écran de fin : aucun bouton présélectionné, il faut bouger le stick (A ou B en jeu ne relance plus la partie).
- Tir chargé : jauge pleine → tir automatique (interprétation, à confirmer).

## 14/11/2026 — v7 : option pointillés
- Option de menu « Pointillés en salle » : Affichés / Masqués.

## 14/11/2026 — v6 : passes en bande (salle)
- B en salle = passe en bande ; A passe par la bande si le stick vise une bande.
- Ligne de visée pointillée ; l'IA utilise aussi les bandes.

## 14/11/2026 — v5 : menus à la manette
- Boutons « Coup d'envoi », « Rejouer », « Reprendre »… sélectionnables à la manette (cadre jaune).
- Correctif manettes non « standard » (PlayStation selon navigateur) : ✕ était lu comme « retour ».

## 14/11/2026 — v4 : refonte (multi, niveaux, modes)
- Menu de départ : mode (Gazon 11 c. 11 / Salle 5 c. 5), niveau IA (5 niveaux), durée.
- Écran « Qui joue où ? » façon eFootball, jusqu'à 4 joueurs (manettes + 2 dispositions clavier), coop ou versus, mode spectateur.
- Salle : bandes latérales, balle au sol, 2 mi-temps, terrain réduit.

## 13/11/2026 — v3 : statistiques
- Écran de statistiques entre les quarts-temps, en pause et en fin de match.

## 13/11/2026 — v2 : focus clavier
- L'utilisateur avait tapé ses touches dans le chat : ajout d'un bandeau « Clique ici pour jouer au clavier ».

## 08/11/2026 — v1 : prototype
- Demande initiale : « un jeu vidéo de hockey sur gazon qui se jouerait avec manette style eFootball ».
- Prototype 6 c. 6 contre l'ordinateur, vue de dessus, règle du cercle, remises en jeu, corners, mini-carte.
