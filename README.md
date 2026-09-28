# Debarulers — Stage Click, prototype v0.1

Un panneau Max for Live pour piloter les scènes de votre set Ableton : nom et BPM en grand, setlist cliquable, précédent, suivant, relance et arrêt.

**Livré sous forme de patch source .maxpat + JavaScript. Ce n'est pas encore un .amxd compilé.** La conversion se fait dans l'éditeur Max ouvert depuis Ableton, avec les étapes ci-dessous. Cible : Live 11/12 avec Max for Live (Max 8 ou ultérieur). La logique a été vérifiée par simulation et les connexions du patch contrôlées ; le fonctionnement et le rendu dans Live/Max doivent être validés sur votre Mac.

## Installer une fois

1. Décompresser le dossier et le garder à un emplacement permanent, par exemple Documents/Debarulers-Stage-Click. Garder `stage_click.js` à côté du futur fichier `.amxd`.
2. Dans votre set Ableton, déposer un **Max MIDI Effect** vide directement sur la piste MIDI qui joue le clic, **avant le Drum Rack/instrument et en dehors d'un Rack**. Le device transmet le MIDI sans le modifier. Une seule instance est nécessaire.
3. Cliquer sur le bouton d'édition du device pour ouvrir Max. Dans Max : Fichier > Ouvrir, choisir `Stage-Click.maxpat`. Passer en mode Patching si la présentation masque les objets, déverrouiller le patch (`Cmd + E`), puis tout sélectionner et copier (`Cmd + A`, `Cmd + C`).
4. Revenir à la fenêtre de l'effet Max MIDI vide ouvert depuis Live. Passer en mode Patching, déverrouiller, sélectionner et supprimer ses objets, puis coller le contenu copié. Le patch fourni contient déjà `midiin`, `midiout` et `live.thisdevice`.
5. Enregistrer ce **device Max for Live** avec Enregistrer sous, sous le nom `Debarulers-Stage-Click.amxd`, **dans le même dossier que `stage_click.js`**. Fermer l'éditeur. Recharger le device sauvegardé sur la piste du clic pour initialiser l'API et la recherche du script. Ne pas se contenter de renommer le `.maxpat` en `.amxd`.
6. Cliquer sur **OUVRIR LE PANNEAU**. Si besoin, cliquer sur ACTUALISER. La fenêtre flottante affiche le nom de la piste suivie en bas. Enregistrer le set Ableton.

Après validation, il est possible de geler le device depuis Max pour embarquer ses dépendances. Tant qu'il n'est pas gelé, conserver le `.js` à côté du `.amxd` et transmettre les deux fichiers ensemble.

## Préparer le set

- Conserver votre piste de clic existante et vos clips MIDI bouclés.
- Une scène par morceau avec son nom et son BPM activé dans les réglages de scène.
- Une scène sans clip sur la piste du clic est visible mais son lancement par le panneau est refusé.
- Désactiver les Follow Actions des clips et scènes pour garder le passage manuel.
- Régler les clips en mode Trigger, Loop activé et Legato désactivé pour une relance depuis le début du clip.
- Le panneau respecte la quantification de lancement de Live et des clips. Pendant la lecture, le lancement peut attendre la prochaine mesure ; l'écran affiche EN ATTENTE. Il n'impose pas une quantification différente.
- Ne pas armer les autres pistes ; un lancement de scène lance tous ses clips comme le bouton de scène de Live. Le device vise votre set de clic, pas une session d'enregistrement.
- Le routage sonore reste celui du set : sélectionner la carte son et la sortie alimentant les ears. Le panneau ne génère pas le son et ne change ni les volumes ni le routage.

## Utiliser

| Commande | Résultat |
|---|---|
| DÉMARRER / RELANCER | Lance la scène courante, y compris après un arrêt. |
| SUIVANT | Lance la scène suivante en un seul appui. |
| PRÉCÉDENT | Lance la scène précédente en un seul appui. |
| STOP | Arrête immédiatement tous les clips de Session, annule les lancements en attente et arrête le transport global. |
| Clic sur un titre | Lance directement cette scène. |
| PAGE - / PAGE + | Affiche les autres titres, sans changer la lecture. |
| ACTUALISER | Relit les scènes, ou réessaie la connexion après installation. |

Pour le premier morceau, cliquer sur son titre ou utiliser DÉMARRER si le bon morceau est déjà affiché. Le device ne démarre rien automatiquement lors de son chargement.

Le panneau suit le `playing_slot_index` de la piste qui l'héberge : si vous lancez une scène depuis Live, son titre devient le morceau courant. À l'arrêt, il conserve le dernier morceau pour que SUIVANT fonctionne. La sélection automatique de la scène suivante dans Live ne décale donc pas le panneau.

Aux extrémités de la liste, précédent/suivant ne rebouclent pas. Une protection de 400 ms limite les doubles appuis. Pendant un lancement en attente, un autre lancement est ignoré ; STOP permet d'annuler.

Le BPM affiché en lecture est celui de Live ; à l'arrêt, c'est celui configuré sur la scène. GLOBAL indique que la scène n'a pas de tempo actif : elle hérite du tempo global. Réglez son tempo dans Ableton pour obtenir le BPM propre au morceau.

## Validation dans Live avant utilisation en concert

1. Lancer le premier morceau : contrôler le clic et son BPM.
2. STOP puis SUIVANT : le deuxième morceau doit partir avec son tempo, sans action supplémentaire.
3. Tester PRÉCÉDENT, DÉMARRER et le clic direct sur un titre.
4. Lancer un morceau directement depuis la grille de Live : le panneau doit le suivre.
5. Vérifier STOP pendant un lancement quantifié, ainsi que les limites premier/dernier morceau.
6. Sauvegarder, fermer et rouvrir le set : aucun clic ne doit partir à l'ouverture ; le panneau doit se reconnecter.

Si le panneau reste vide, ouvrir la console Max et vérifier que `stage_click.js` a été trouvé. Si le message demande une piste MIDI, déplacer le device directement sur la piste du clic, hors Rack. Une fois le device sauvegardé au bon endroit, le retirer puis le recharger.

## Sources techniques

- API des scènes : https://docs.cycling74.com/apiref/lom/scene/
- Transport et arrêt : https://docs.cycling74.com/apiref/lom/song/
- Piste et playing_slot_index : https://docs.cycling74.com/apiref/lom/track/
- Interfaces Max for Live : https://docs.cycling74.com/userguide/m4l/live_userinterfaces/

Les tests fournis utilisent une API simulée. Ils ne remplacent pas la validation audio, visuelle et d'intégration dans Ableton.
