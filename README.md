# Site web Ange Auto-École

Site vitrine de l'auto-école, en ligne sur <https://www.angeautoecole.com>
(Netlify). L'application des candidats est un projet distinct, publiée sur
<https://app.angeautoecole.com> et sur Google Play (`com.angeautoecole.app`).

Site statique, sans dépendance ni étape de construction : HTML, CSS et
JavaScript écrits à la main, pour rester léger sur les réseaux lents.

## Fichiers

```
index.html                      Page d'accueil (formations, catégories, parcours,
                                application, galerie, questions, pré-inscription)
merci.html                      Confirmation après le formulaire (non indexée)
politique-confidentialite.html  Pages légales, exigées notamment par le Play Store
suppression-compte.html
conditions-utilisation.html
mentions-legales.html
styles.css                      Toute la mise en forme (clair et sombre)
script.js                       Tous les comportements, sans bibliothèque
sw.js                           Service worker (pages réseau d'abord, hors ligne de base)
manifest.json                   Installation comme application
netlify.toml                    En-têtes de sécurité et de cache
robots.txt, sitemap.xml         Référencement
assets/marque/                  Logo (WebP) et les trois calques de la roue ailée animée
assets/photos/                  Photos de l'école en WebP, 800 et 1600 px de large
assets/video/                   Vidéo d'accueil (WebM + MP4) et vidéo du terrain, avec leurs affiches
assets/elena/                   Visages d'Elena utilisés dans le quiz d'essai
assets/images/, assets/logo/    Fichiers d'origine (image de partage, logo du balisage)
```

## Identité visuelle

Les couleurs, les polices (Bricolage Grotesque pour les titres, Andika pour le
texte) et la roue ailée animée reprennent celles de l'application. Les
animations de la roue (coup de volant puis battement d'ailes toutes les cinq
secondes) suivent les mêmes trajectoires que l'écran de connexion de
l'application (`ange_logo.dart`).

## Règles à respecter

- **Réduire les animations** : tout mouvement s'arrête si le visiteur l'a
  demandé dans les réglages de son appareil.
- **Données** : la vidéo d'accueil n'est chargée que sur un écran d'au moins
  768 px, hors économiseur de données et hors réseau 2G. Sur téléphone,
  l'image fixe la remplace.
- **Cache** : `styles.css` et `script.js` sont appelés avec `?v=N`. À chaque
  mise en ligne qui les modifie, augmenter `N` dans toutes les pages, dans
  `sw.js` (liste et `CACHE_NAME`).
- **Formulaire** : la pré-inscription passe par Netlify Forms. Ne pas renommer
  le formulaire (`pre-inscription`) ni ses champs, sinon Netlify ne range plus
  les demandes au même endroit.

## Essai en local

```bash
python -m http.server 8095
```

Puis ouvrir <http://localhost:8095>. Après une modification, si l'ancienne
version reste affichée, désinscrire le service worker dans les outils du
navigateur.
