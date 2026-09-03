# Guide de Déploiement sur Netlify

Ce guide vous explique comment déployer votre site web Ange Auto-École sur Netlify pour le rendre accessible en ligne.

## 📋 Prérequis

- Un compte Netlify (gratuit)
- Les fichiers du site web prêts
- Votre logo `LOGO_ANGE.png` dans le dossier `assets/logo/`
- Vos images (optionnelles) dans le dossier `assets/images/`

## 🚀 Méthode 1 : Déploiement par glisser-déposer (Recommandé)

### Étape 1 : Préparer les fichiers

1. Assurez-vous que tous les fichiers sont dans le dossier principal :
   - `index.html`
   - `styles.css`
   - `script.js`
   - `politique-confidentialite.html`
   - `suppression-compte.html`
   - `conditions-utilisation.html`
   - `mentions-legales.html`
   - `netlify.toml`
   - `.gitignore`
   - Dossier `assets/` avec votre logo et images

2. Vérifiez que votre logo est bien nommé `LOGO_ANGE.png` et placé dans `assets/logo/`

### Étape 2 : Créer un compte Netlify

1. Allez sur [https://www.netlify.com](https://www.netlify.com)
2. Cliquez sur "Sign up"
3. Inscrivez-vous avec votre email ou via GitHub/GitLab/Bitbucket

### Étape 3 : Déployer le site

1. Connectez-vous à votre compte Netlify
2. Cliquez sur "Add new site" → "Deploy manually"
3. Faites glisser le dossier complet "SITE WEB ANGE AUTO ECOLE" dans la zone de déploiement
4. Attendez que le déploiement se termine (quelques secondes)
5. Votre site sera en ligne avec une URL aléatoire comme : `https://random-name-123456.netlify.app`

### Étape 4 : Personnaliser le domaine (Optionnel)

1. Allez dans "Site settings" → "Domain management"
2. Cliquez sur "Add custom domain"
3. Entrez votre nom de domaine personnalisé (ex: `ange-autoecole.com`)
4. Suivez les instructions pour configurer les DNS

## 🚀 Méthode 2 : Déploiement via Git (Pour développeurs)

### Étape 1 : Initialiser Git

```bash
cd "C:\Users\fasop\AndroidStudioProjects\SITE WEB ANGE AUTO ECOLE"
git init
git add .
git commit -m "Initial commit - Site Ange Auto-École"
```

### Étape 2 : Créer un dépôt GitHub

1. Allez sur [https://github.com](https://github.com)
2. Créez un nouveau dépôt (ex: `ange-auto-ecole-site`)
3. Suivez les instructions pour pousser votre code

### Étape 3 : Connecter à Netlify

1. Dans Netlify, cliquez sur "Add new site" → "Import an existing project"
2. Connectez votre compte GitHub
3. Sélectionnez votre dépôt
4. Configurez les paramètres de build :
   - Build command: (laisser vide)
   - Publish directory: `.` (racine)
5. Cliquez sur "Deploy site"

## ⚙️ Configuration Netlify

Le fichier `netlify.toml` inclut déjà :

- **Headers de sécurité** : Protection contre XSS, clickjacking
- **Redirects** : Toutes les routes redirigent vers index.html (SPA friendly)
- **Publish directory** : Racine du projet

## 🌐 Après le déploiement

### 1. Vérifier le site

- Ouvrez l'URL fournie par Netlify
- Testez toutes les pages
- Vérifiez que le logo s'affiche correctement
- Testez le formulaire de contact
- Vérifiez les liens entre les pages

### 2. Mettre à jour les informations Play Store

Une fois le site en ligne, mettez à jour votre fiche Play Store avec :

- **URL de la politique de confidentialité** : `https://votre-site.netlify.app/politique-confidentialite.html`
- **URL de suppression de compte** : `https://votre-site.netlify.app/suppression-compte.html`

### 3. Configurer le formulaire de contact (Optionnel)

Pour que le formulaire de contact fonctionne, vous pouvez :

- Utiliser un service comme Formspree
- Intégrer Netlify Forms
- Connecter à un backend personnalisé

## 📱 Mises à jour futures

Pour mettre à jour le site :

1. Modifiez les fichiers localement
2. **Méthode glisser-déposer** : Re-déployez le dossier complet
3. **Méthode Git** : Push les changements, Netlify déploiera automatiquement

## 🔧 Dépannage

### Le logo ne s'affiche pas

- Vérifiez que le fichier s'appelle bien `LOGO_ANGE.png`
- Vérifiez qu'il est dans le dossier `assets/logo/`
- Vérifiez les majuscules/minuscules (sensible à la casse)

### Les images du carrousel ne s'affichent pas

- Vérifiez que les images sont dans `assets/images/`
- Nommez-les `Image1_ANGE.jpeg`, `Image2_ANGE.jpeg`, etc. OU `image1.jpg`, `image2.jpg`, etc.
- Les formats supportés sont JPEG et JPG

### Erreur 404 sur les pages

- Vérifiez que tous les fichiers HTML sont présents
- Vérifiez les noms de fichiers (politique-confidentialite.html, etc.)
- Le fichier `netlify.toml` doit être à la racine

## 📞 Support

- Documentation Netlify : [https://docs.netlify.com](https://docs.netlify.com)
- Support Netlify : [https://www.netlify.com/support](https://www.netlify.com/support)

## ✅ Checklist avant déploiement

- [ ] Logo `LOGO_ANGE.png` dans `assets/logo/`
- [ ] Images du carrousel dans `assets/images/` (optionnel)
- [ ] Tous les fichiers HTML présents
- [ ] `styles.css` et `script.js` présents
- [ ] `netlify.toml` à la racine
- [ ] Coordonnées de contact à jour
- [ ] Test local du site complet

Une fois tout vérifié, vous pouvez déployer ! 🚀