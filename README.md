# Routines visuelles (matin / soir)

**En ligne : https://routines.kalky.org**

Petite appli web gratuite qui aide les enfants (TDAH ou non) à suivre leurs routines, une étape à la fois, avec un minuteur visible. Les fiches A4 à imprimer sont fournies.

- **Sans compte ni serveur** : les réglages restent dans le navigateur (`localStorage`).
- **Personnalisable** : prénom, étapes, durées, icônes, couleurs, règles (`reglages.html`).
- **Lien de partage** : la configuration est encodée dans le `#fragment` de l'URL. Elle n'est jamais envoyée au serveur.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil, import d'un lien de partage |
| `routine.html?r=matin\|soir` | Minuteur pas à pas |
| `fiche.html?r=matin\|soir` | Fiche A4 générée à partir des réglages |
| `reglages.html` | Personnalisation |
| `common.js` | Routines d'exemple, icônes, thèmes, stockage |

Pour modifier les routines d'exemple proposées à tout le monde, il suffit d'éditer `DEFAULTS` dans `common.js`.

## Mise en ligne

Ce sont des fichiers statiques : tout hébergeur statique convient.

- **Netlify Drop** : glisser le dossier sur https://app.netlify.com/drop
- **GitHub Pages** : pousser le dossier dans un dépôt, puis Settings → Pages
- **Test local** : `python3 -m http.server` dans ce dossier

## Appli installable (PWA)

- `manifest.webmanifest` + `icons/` : installation sur l'écran d'accueil (Android, iPad, ordinateur).
- `sw.js` : fonctionnement hors ligne. Les fichiers sont servis depuis le cache puis mis à jour en arrière-plan : une nouvelle version apparaît **au lancement suivant**.
- Si vous ajoutez ou renommez un fichier, ajoutez-le à `FILES` dans `sw.js` et changez `VERSION`.
