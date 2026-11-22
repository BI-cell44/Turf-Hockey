# Décisions techniques — Turf Hockey 26

Chaque décision : le choix, la raison, et ce qu'il ne faut pas casser. Ajouter une entrée datée pour toute nouvelle décision structurante.

## D1 — Un seul fichier HTML, sans dépendance
- **Choix** : HTML + CSS + JavaScript « vanilla » dans `index.html`, rendu Canvas 2D, sons synthétisés en WebAudio.
- **Raison** : publication directe en Artifact claude.ai (une page autonome), ouverture par double-clic sur le PC, aucun build.
- **Contrainte** : l'Artifact n'autorise que certains CDN ; on n'en utilise aucun. Seule ressource externe : Google Fonts (Saira Extra Condensed, IBM Plex Sans) avec repli système.

## D2 — Deux formats du même code
- **Choix** : `index.html` est un document complet (source de vérité). L'Artifact attend un fragment (sans `<!doctype>`, `<html>`, `<head>`, `<body>`) : `tools/artifact_fragment.py` le produit.
- **À ne pas casser** : garder la règle CSS `[hidden]{display:none!important}` (les écrans sont masqués via l'attribut `hidden` alors que `.screen` a `display:grid`).

## D3 — Unités en mètres, terrain réel
- **Choix** : toute la simulation est en mètres et secondes ; dimensions réglementaires (gazon 91,4 × 55, salle 44 × 22).
- **Conséquence** : les distances de l'IA sont mises à l'échelle avec `SC = L/91.4` (proportionnel) et `S2 = max(SC, .6)` (distances « physiques » qui ne doivent pas trop rétrécir en salle).

## D4 — Machine à états simple
- **Choix** : variable `state` ∈ `menu`, `pads`, `play`, `pause`, `break`, `end` ; `update(dt)` aiguille. En `menu` et `pads`, un match de démonstration ordinateur contre ordinateur tourne en fond.

## D5 — Entrées unifiées par appareil
- **Choix** : chaque appareil (`kb1`, `kb2`, `p0`…`p3`) est lu par `readDev`, puis `pollAll` calcule les fronts (`passP`, `okP`, `leftP`…) par appareil dans `IN[id]` et leur union dans `ANY`.
- **Raison** : multijoueur local et navigation des menus avec n'importe quel appareil.
- **Détail** : la touche Entrée/J du clavier 1 vaut « valider » ; sur manette standard A ou Start valident, B ou Back reviennent. Pour `pad.mapping !== 'standard'`, toutes les touches principales valident et seul Back revient (évite que ✕ PlayStation fasse « retour »).

## D6 — Contrôle humain par pointeur `ctrl`
- **Choix** : chaque joueur a `ctrl` = index de l'humain qui le contrôle, ou `null` (IA). `setCtrl(h, p)` garantit qu'un joueur n'a qu'un humain. Le gardien n'est jamais contrôlé par un humain.
- **Changement automatique** : seulement s'il y a un seul humain dans l'équipe (sinon les humains se « voleraient » les joueurs). En défense, avec hystérésis (3 m, 1 s) pour éviter le clignotement ; réglage `opts.auto`.
- **Passe** : `passCtrl` → en coop, le receveur va à un autre humain que le passeur.

## D7 — Anti-validation accidentelle
- **Choix** : l'écran de fin démarre sans bouton présélectionné (`btnFocus = -1`), avec 0,8 s d'attente ; B/Échap n'y font rien. Entre deux périodes : 0,8 s d'attente puis A.
- **Raison** : A = passe/tacle en jeu, l'utilisateur relançait la partie sans le vouloir.

## D8 — Passes en bande calculées par point miroir
- **Choix** : la bande n'amortit que la composante perpendiculaire (`vy *= E_B`). Le point visé est le miroir du receveur, avec la distance après rebond divisée par `E_B`, ce qui donne une trajectoire exacte (le frottement réduit la vitesse sans changer la direction).

## D9 — Placement IA en repère d'équipe
- **Choix** : `u` = distance au propre but. Position de base `fx*L`, décalage `(u_balle - L/2) * 0,45`, planchers : en défense `max(4·S2, min(u_balle − 3·S2, 0,6·CR))` (+4·S2 milieux, +8·S2 attaquants) ; en attaque `0,75 × base`.
- **Raison** : les défenseurs collaient à la ligne de fond quand la balle était dans leur camp.

## D11 — Sens d'attaque variable, jamais en dur
- **Choix** : le côté d'une équipe n'est jamais supposé. Toujours passer par `teams[t].dir`, `goalX(t)`, `ownGoalX(t)` ou `homeX`. Ne pas écrire de condition du type « équipe 0 = gauche ». C'est ce qui permet le changement de côté.
- **Test accéléré** : pour simuler un match entier sans attendre, utiliser l'horloge de Playwright (`page.clock.install()` avant `goto`, puis `page.clock.runFor(ms)`). Choisir la durée « Courte » et placer les deux claviers sur « ne joue pas » pour regarder l'ordinateur jouer. Les buts gèlent le temps 2,6 s, donc prévoir une marge et boucler jusqu'à l'apparition de l'écran de pause.

## D12 — Le tactile est un appareil comme les autres
- **Choix** : l'écran tactile est l'appareil `touch` dans `devs`/`devPos`/`IN`, avec la même forme de données que clavier et manette (`readDev`). Le reste du jeu (placement, coop, contrôle) n'a rien de spécifique au tactile.
- **À ne pas casser** : `touch-action:none` sur `#pitch` et `#tc` (sinon le navigateur défile ou zoome pendant le jeu), mais `touch-action:pan-y` sur `.screen` (menus défilables). Ne pas mettre `touch-action:none` sur un ancêtre commun : le comportement le plus restrictif gagnerait.
- **Boutons** : relâchement retardé de 70 ms (`tmr`) pour que la boucle (60 Hz) voie toujours un appui très court.
- **Test** : `hasTouch` + `isMobile` dans Playwright, événements envoyés par `Input.dispatchTouchEvent` (CDP) ; `page.touchscreen` ne sait que taper.

## D10 — Publication et sauvegardes
- Artifact : toujours republier sur la même URL (paramètre `url`) pour que le lien de l'utilisateur reste valable.
- GitHub : `main` de https://github.com/BI-cell44/Turf-Hockey.
- PC de l'utilisateur (Windows) : `D:\Developpement\Turf Hockey`, écrit via le pont « appareil » de Claude quand la conversation est reliée au PC.

## D13 — Jeu en ligne : hôte autoritaire sur PeerJS
- **Choix** : l'hôte fait tourner toute la simulation ; les invités envoient leurs touches (`{x,y,h,p}` : directions, boutons tenus, fronts montants mémorisés) et reçoivent des instantanés à 20 Hz, interpolés à l'affichage. Les invités sont des appareils `net1..net3` comme les autres (D5, D12).
- **Raison** : pas de serveur à héberger (courtier PeerJS gratuit pour l'échange initial, ensuite connexion directe WebRTC) ; un seul code de simulation, pas de désynchronisation.
- **Exception à D1** : PeerJS est chargé à la demande depuis jsDelivr (version fixée, empreinte SRI). Hors de ce mode, aucune ressource externe.
- **Sécurité** : tout message reçu est validé (nombres, longueurs, noms nettoyés par `cleanName` avant `innerHTML`).
- **À ne pas casser** : l'hôte ne place les messages/sons dans `evq` que si `net.live` ; `backToMenu` côté hôte ramène à la salle (`goLobby`), pas au menu.

## D15 — Commentaires audio : fichiers MP3 chargés à la demande
- **Choix** : les voix sont des MP3 séparés dans `commentaires/`, référencés par la liste `COM` (dans `index.html`) ; un seul `Audio` partagé (compatible iOS), file d'attente avec priorités.
- **Raison** : ne pas alourdir la page ; rien n'est téléchargé tant que l'option « Commentaires audio » est sur Non (test : `tests/commentaires_test.js`).
- **Exception à D1** : fichiers audio à côté de `index.html` (comme PeerJS, seulement si l'option est activée). Ils ne marchent pas dans l'Artifact claude.ai.
- **Régénérer** : `python3 tools/prepare_commentaires.py DOSSIER_JOURNALISTE DOSSIER_CONSULTANT commentaires` (réencode en mono 24 kHz 40 kbit/s, supprime les doublons v1=v2, affiche la ligne `COM`). `DROP` liste les clips volontairement exclus.
- **En ligne** : l'hôte envoie l'identifiant du clip (`['v',id,priorité]`), l'invité vérifie l'identifiant contre `COM` avant de le jouer.
