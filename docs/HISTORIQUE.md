# Historique — Turf Hockey 26

Chronologie des demandes de l'utilisateur et de ce qui a été livré. Les numéros de version sont ceux de l'Artifact claude.ai (https://claude.ai/artifact/311wg5uBVQQT7QfieXdHad). Ajouter une entrée en haut à chaque session.

---

## 17/11/2026 — Bandeau des commandes selon les joueurs actifs
- Le bandeau en bas de l'écran n'affiche que les commandes des appareils qui jouent : une ligne « Manette » (si au moins une manette joue), une ligne « Clavier » (clavier 1, ZQSD + J K I L, avec les flèches si le clavier 2 ne joue pas), une ligne « Clavier 2 » (flèches + pavé numérique). Chaque ligne indique le ou les joueurs concernés (J1, J2…).

## 16/11/2026 — Boutons tactiles plus clairs
- Icône à deux flèches circulaires sur « Changer » ; libellé du bouton A : « Passe / Prise » (en défense, A sert à prendre la balle).

## 16/11/2026 — Sprint automatique sur mobile
- Demande : sprint automatique quand le pouce est au bord du joystick, et suppression du bouton. Le sprint s'active quand le pouce dépasse 88 % du rayon du joystick et se coupe sous 75 % (hystérésis). Le pouce du joystick devient orange quand le sprint est actif. Bouton « Sprint » retiré de l'écran tactile ; manette et clavier inchangés.

## 16/11/2026 — Changement de joueur automatique en défense
- Demande (mobile) : changer de joueur automatiquement sans appuyer sur « changer ». L'ancienne règle (balle à plus de 20 m) ne se déclenchait quasiment jamais. Nouvelle règle : quand l'adversaire a la balle (ou balle libre sans passe en cours vers un coéquipier), le joueur contrôlé passe au coéquipier libre le plus proche de la balle s'il est au moins 3 m plus proche, au plus une fois par seconde.
- Seulement s'il n'y a qu'un humain dans l'équipe (D6). Nouveau réglage dans le menu « Changement auto en défense » (activé par défaut, `opts.auto`).

## 16/11/2026 — Menu : plus de saut de mise en page
- Retour : « il faut cliquer sous les boutons ». Les zones cliquables étaient bonnes, mais le texte de description du mode changeait de hauteur (2 → 3 lignes) et le menu, centré, se décalait d'environ 11 px à chaque clic. Les deux descriptions sont maintenant superposées (hauteur fixe).

## 16/11/2026 — Correctif connexion Firefox mobile (hypothèse)
- Retour : ça marche sur Chrome mais pas Firefox sur téléphone (« l'hôte a refusé »). Non reproductible ici (pas de Firefox). Ajout de serveurs STUN supplémentaires (Google, Cloudflare, Twilio) et d'un message d'erreur détaillé. Si ça persiste : serveur TURN (voir BACKLOG).
- Ajout d'un message vert « Connecté » côté invité.

## 16/11/2026 — Jeu en ligne (branche `jeu-en-ligne`, pas encore fusionnée dans `main`)
- Demande : jeu en ligne pour ceux qui ouvrent la page publiée. Choix de l'utilisateur : code de salle, jusqu'à 4 joueurs. Demande de travailler sur une branche à part.
- Menu : bouton « Jouer en ligne » → créer une salle (code à 5 caractères + lien `?salle=CODE`) ou rejoindre. Salle d'attente, placement des commandes par l'hôte, match, pause/mi-temps/fin visibles côté invités.
- Technique : PeerJS (chargé à la demande), hôte autoritaire (voir D13). Testé avec 2 navigateurs Playwright (`tests/online_test.js`).
- Ne marche PAS dans l'Artifact claude.ai (WebRTC bloqué), seulement sur la page publiée.

## 15/11/2026 — Version mobile (commandes tactiles)
- Demande : « faire en sorte que ça fonctionne sur mobile » et renommer « Choisir les manettes » en « Choisir les commandes ».
- Livré : joystick flottant à gauche, boutons A/B/X/Y en losange à droite, « Sprint » et « Changer » au-dessus, bouton II pour la pause ; écran « Tourne ton téléphone » en portrait ; menus défilables sur petits écrans ; bouton « Plein écran » ; l'écran tactile apparaît comme un appareil (« Écran tactile ») dans « Qui joue où ? ». Bouton du menu renommé « Choisir les commandes », titre de l'écran de placement « Choix des commandes ».
- Corrigé au passage : le tableau des scores et la mini-carte du match de démo ne se superposent plus aux menus.
- Test : émulation mobile Playwright (844 × 390, événements tactiles réels via CDP).

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
