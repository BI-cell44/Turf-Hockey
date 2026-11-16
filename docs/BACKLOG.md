# Backlog — Turf Hockey 26

Priorités : **P1** = demandé ou bloquant, **P2** = amélioration utile, **P3** = idée.
Quand un élément est terminé, le retirer d'ici et l'ajouter dans `HISTORIQUE.md`.

## À confirmer avec l'utilisateur
- **P1 — Tactile sur vrai téléphone** : faire valider par l'utilisateur la taille et la position des boutons, le confort du joystick, et si le jeu en paysage est fluide.
- **P1 — Tir chargé** : la demande « quand on a chargé le tir la balle part et ne peut pas rester chargée » a été interprétée comme « tir automatique quand la jauge est pleine ». Si l'utilisateur voulait l'inverse (garder la jauge pleine tant que le bouton est tenu), retirer le bloc `p.full` dans `humanControl`.
- **P1 — Manettes réelles** : faire confirmer que la détection, la navigation des menus et les boutons répondent bien avec ses manettes (modèle et navigateur ?).

- **P1 — Jeu en ligne sur vrais appareils** : tester hôte + invités sur internet réel (latence, connexions refusées), puis fusionner la branche `jeu-en-ligne`.

## Gameplay
- P2 — Corners de pénalité (penalty corners) et pénalty (stroke) : règles majeures du hockey absentes.
- P2 — Fautes : obstruction, pied, crosse haute → coups francs.
- P2 — Gardien contrôlable (aujourd'hui toujours IA) ou bouton de sortie du gardien.
- P2 — Tir dirigé plus fin (visée haut/bas du but en gazon, tir du revers).
- P2 — Dribble / feinte (bouton dédié, par ex. R3 ou stick droit).
- P3 — Fatigue / jauge d'endurance liée au sprint.

## IA
- P2 — Équilibrer les niveaux après retours de l'utilisateur (Débutant trop facile ? Légende trop dure ?).
- P2 — Marquage individuel plus strict en défense, pressing collectif selon le niveau.
- P3 — Styles de jeu de l'équipe IA (contre-attaque, possession).

## Modes et menus
- P2 — Choix des équipes / couleurs des maillots (attention au contraste avec le terrain).
- P2 — Réglage de la caméra (zoom, vue large) et option de sons on/off.
- P3 — Tournoi / championnat, tirs au but en cas d'égalité.
- P3 — Personnalisation des touches (utile pour les manettes non standard).

## Technique
- P2 — En ligne : prédiction du mouvement côté invité, serveur TURN pour les réseaux stricts, choix des réglages depuis la salle, noms de joueurs.
- P2 — Mobile : retour haptique (vibration) sur tir et but, option gaucher (inverser joystick et boutons), taille des boutons réglable.
- P3 — Mode 2 joueurs sur un même écran tactile (un joystick par côté).
- P3 — Séparer le JS en modules si le fichier dépasse ~1500 lignes (en gardant une version un-seul-fichier pour l'Artifact).
- P3 — Tests automatisés plus poussés (simulation accélérée, assertions sur les règles).
