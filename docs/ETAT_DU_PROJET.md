# État du projet — Turf Hockey 26

_Dernière mise à jour : 14 novembre 2026 (version 9 de l'Artifact, premier dépôt GitHub)._

## Résumé
Le jeu est **jouable de bout en bout** : menu → placement des manettes → match (périodes, pauses, statistiques) → écran de fin → rejouer ou menu. Deux modes, cinq niveaux d'IA, jusqu'à 4 joueurs humains en local.

## Fonctionnalités en place

### Modes de jeu (`MODES`)
| | Gazon 11 c. 11 (`grass`) | Salle 5 c. 5 (`indoor`) |
|---|---|---|
| Terrain | 91,4 × 55 m | 44 × 22 m |
| But (largeur × hauteur) | 3,66 × 2,14 m | 3 × 2 m |
| Rayon du cercle | 14,63 m | 9 m |
| Périodes | 4 quarts-temps de 15 min affichées | 2 mi-temps de 20 min affichées |
| Balle levée | passes aériennes (B) et tirs levés | interdite : balle toujours au sol |
| Côtés | sortie → remise en jeu | bandes : la balle rebondit (coefficient 0,7) |
| Bouton B | passe aérienne | passe en bande |
| Formation | 1-4-3-3 | 1-2-2 |

Règle commune : **un but ne compte que si un attaquant a touché la balle dans le cercle** (`ball.circle`). Sinon « But refusé » et coup franc défensif.

### Changement de côté (`nextPeriod`, `resetSides`)
- À la fin de la mi-temps (`period-1 === M.periods/2` : après le Q2 en gazon, après la 1re mi-temps en salle), `teams[t].dir` est inversé au moment de la reprise, avant le coup d'envoi. Tout le reste en dérive (`goalX`, `ownGoalX`, `homeX`, placement IA, gardiens).
- `resetSides()` remet les sens d'origine (oranges attaquent à droite) au lancement d'un match et pour la démo du menu.
- Après le changement, c'est l'équipe 1 qui engage au début de la 2e mi-temps ; le coup d'envoi alterne ensuite (`period % 2`).
- Le cadre des buts prend la couleur de l'équipe qui le défend (`ownGoalX(0) === gx`).

### Arrêts de jeu (`checkOut`, `restart`, `kickoff`)
- Remise en jeu (gazon), sortie de but → coup franc à la distance du cercle, corner long, but, but refusé.
- La balle et le tireur sont placés **à l'intérieur** du terrain, et la balle ne peut pas sortir pendant `grace` (≈1 s).
- Après un but, la balle reste dans le filet (`netClamp`) pendant le gel de 2,6 s.

### Contrôles
- Manettes : jusqu'à 4 (API Gamepad, disposition « standard » Xbox ; PlayStation : ✕ = A).
- Clavier 1 : ZQSD + J (passe/tacle) K (tir) I (profondeur) L (B) Maj (sprint) Espace (changer) Échap (pause). Les flèches marchent aussi quand le clavier 2 ne joue pas.
- Clavier 2 : flèches + pavé numérique 1/2/5/3/0/./+.
- Manettes non « standard » : dans les menus, n'importe quelle touche principale valide, seule Select/Back revient en arrière.
- Tir : maintenir X pour charger, viser avec le stick, relâcher. **Jauge pleine → tir automatique après 0,15 s** (choix de l'utilisateur, à confirmer, voir BACKLOG).

### Commandes tactiles (téléphone / tablette)
- `touchOn` : vrai si l'appareil est tactile (`pointer:coarse`) ou dès le premier `pointerdown` de type `touch`. Alors l'appareil `touch` apparaît dans `devs` ; s'il n'y a pas de clavier (`kbSeen` faux), les claviers sont masqués et l'écran tactile est placé côté oranges par défaut.
- Overlay `#tc` (visible seulement en `play` si un humain utilise `touch`) : `#jz` joystick flottant (rayon `JR` = 56 px, zone morte 15 %), boutons `.tb[data-b]` (`pass`, `lob`, `shoot`, `through`, `sprint`, `sw`, `start`). L'état tactile est dans l'objet `T`, lu par `readDev('touch')` comme n'importe quel autre appareil. Multi-touch via Pointer Events.
- Portrait : `#rotate` (« Tourne ton téléphone ») et la simulation est suspendue (`needRotate`).
- En tactile : mini-carte réduite en haut à droite, aide clavier masquée. Hors match (`state !== 'play'`) le tableau des scores et la mini-carte sont masqués (`.nohud`).
- Les écrans (`.screen`) sont en flex avec `.card{margin:auto}` : centrés mais défilables sans coupure en haut sur petits écrans.

### Multijoueur (`humans`, `teamH`, `setCtrl`, `passCtrl`)
- Écran « Qui joue où ? » : chaque appareil pousse gauche (oranges) / centre (ne joue pas) / droite (blancs). Clic souris possible.
- J1…J4 ont chacun une couleur d'anneau (`HCOL`) et une étiquette au-dessus du joueur.
- Coop : quand un humain passe, **le receveur passe sous le contrôle d'un autre humain de l'équipe** (le plus proche). Seul : le receveur passe au passeur.
- Personne placé → mode spectateur (ordinateur contre ordinateur).

### IA (`LEVELS`, `MATE`, `aiPlayer`, `aiCarrier`, `aiGK`)
- 5 niveaux : Débutant, Amateur, Pro, Top player, Légende. Paramètres : vitesse, fréquence et réussite des tacles, délai de décision, précision de tir, bonus gardien, réussite des tacles humains contre elle.
- Les coéquipiers IA d'une équipe humaine utilisent `MATE`.
- Placement en repère d'équipe `u` = distance à son propre but. Défenseurs : plancher de profondeur (`floor`) pour ne pas coller à la ligne de fond ; remontée quand l'équipe a la balle (`up*.75`).
- En salle, l'IA utilise aussi les passes en bande (`bestBank`) quand la passe directe est coupée.

### Passes en bande (salle)
- `bankAim` calcule le point miroir en tenant compte de l'amorti de la bande (`E_B` = 0,7).
- B = passe en bande ; A passe en bande si le stick vise une bande et qu'un coéquipier est mieux placé ainsi.
- Pointillés de visée optionnels (option « Pointillés en salle »).

### Menus et écrans
- Menu : Mode, Niveau de l'IA, Durée (4/7/12 min réelles), Pointillés en salle. Options mémorisées dans `localStorage` (`th26opts`).
- Navigation manette partout (cadre jaune `.f`). Écran de fin : **aucun bouton présélectionné**, il faut bouger le stick avant de valider (anti-validation accidentelle), et un délai de 0,8 s.
- Statistiques (pause, entre périodes, fin) : buts par période, possession, tirs, tirs cadrés, entrées dans le cercle, passes réussies et précision, tacles, arrêts, corners.

### Rendu
- Canvas 2D, caméra qui suit la balle (gazon) ou terrain entier (salle). Mini-carte en bas à droite.
- Buts : cadre aux couleurs de l'équipe qui défend, filet noir. Balle blanche avec contour sombre ; points de penalty discrets.
- Bandeau « Clique ici pour jouer au clavier » quand la page n'a pas le focus et qu'aucune manette n'est branchée.

## Carte du code (`index.html`)
| Section (commentaire `// ----------`) | Contenu principal |
|---|---|
| Modes, niveaux, durées | `MODES`, `LEVELS`, `MATE`, `DURS`, `HCOL`, `opts`, `applyMode`, `teams`, `inCircle`, `buildPlayers`, `ball`, `state`, stats `ST`/`st`/`qg` |
| Son | WebAudio synthétique (`sfx`) — démarre au premier clic/touche |
| Entrées | `KB` (claviers), `readDev`, `pollAll` → `IN[device]` et `ANY` (fronts `okP`, `leftP`…), `devPos` (placement des appareils) |
| Contrôle humain | `setCtrl`, `freeNearest`, `assignHumans` |
| Balle | `give`, `release`, `pickMate`, `bestPassMate`, `passTo`, `passCtrl`, `shoot`, `tackle` |
| Passes en bande | `bankAim`, `pickBank`, `bestBank`, `bankPass`, `openSeg` |
| Arrêts de jeu | `restart`, `kickoff`, `goal`, `netClamp`, `checkOut` |
| IA | `steer`, `computeRoles` (presseur/couverture/chasseur), `aiGK`, `aiCarrier`, `aiPlayer` |
| Joueur humain | `humanControl` (déplacement, charge du tir, passes) |
| Simulation | `sim(dt)` : rôles, mouvements, collisions, physique balle, bandes, récupération, gardien, changement de joueur |
| Menu | `OPTS`, `renderMenu`, `menuInput`, `demoReset`, `backToMenu`, `goPads` |
| Placement des manettes | `moveDev`, `renderPads`, `padsInput` |
| Flux de jeu | `startMatch`, `statsHTML`, `endPeriod`, `nextPeriod`, `pauseGame`, `BTNS`/`navBtns`/`activate`, `update(dt)` (machine à états `menu`/`pads`/`play`/`pause`/`break`/`end`) |
| Rendu | `draw`, `drawMini`, `hud` |
| Démarrage | boucle `requestAnimationFrame` |

## Points fragiles connus
- **Tactile non testé sur un vrai téléphone** : validé uniquement en émulation mobile (Chromium). Points à surveiller sur appareil réel : taille des boutons, confort du joystick, comportement des barres du navigateur iOS/Android, plein écran (non supporté sur iPhone).
- **Manettes réelles non testées par Claude** : tout a été testé au clavier dans Chromium sans manette. Les retours de l'utilisateur sont la seule source sur le comportement réel des manettes.
- Dans l'iframe claude.ai, le clavier ne marche qu'après un clic dans le jeu ; la manette peut ne pas être détectée → conseiller d'ouvrir le jeu dans un onglet à part ou d'ouvrir `index.html` en local.
- Équilibrage de l'IA réglé « à l'œil » ; pas de mesure objective.
- Le tir automatique à jauge pleine est une interprétation d'une demande ambiguë.

## Comment tester
- Ouvrir `index.html` dans un navigateur (double-clic suffit, aucun serveur nécessaire).
- Automatique : `npm i playwright` si besoin, puis `node tests/smoke_test.js` (parcourt menu → match gazon → pause → menu → match salle et signale les erreurs JavaScript).
