# Instructions pour pousser le projet sur GitHub

## 📋 Étapes à suivre

### 1. Créer un dépôt GitHub

1. Allez sur [https://github.com](https://github.com)
2. Connectez-vous avec votre compte `jocelynouedraogo7@gmail.com`
3. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `ange-auto-ecole-site` (ou un autre nom de votre choix)
   - **Description** : Site web pour Ange Auto-École conforme Play Store
   - **Public/Private** : Choisissez **Public** (recommandé pour Netlify gratuit)
   - **Ne cochez pas** "Add a README file" (nous en avons déjà un)
   - **Ne cochez pas** "Add .gitignore" (nous en avons déjà un)
5. Cliquez sur **"Create repository"**

### 2. Connecter votre projet local à GitHub

Une fois le dépôt créé, GitHub vous montrera des commandes. Exécutez celles-ci dans votre terminal :

```bash
# Ajouter le dépôt distant (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/ange-auto-ecole-site.git

# Vérifier que le dépôt distant est ajouté
git remote -v
```

**Important** : Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub réel.

### 3. Pousser le code sur GitHub

```bash
# Pousser le code (branche principale)
git push -u origin master
```

Si vous obtenez une erreur concernant la branche principale, essayez :

```bash
# Renommer la branche en main (nouveau standard GitHub)
git branch -M main
git push -u origin main
```

### 4. Vérifier sur GitHub

1. Allez sur votre dépôt GitHub
2. Vous devriez voir tous vos fichiers :
   - Tous les fichiers HTML
   - Dossier `assets/` avec logo et images
   - Fichiers de configuration
   - Documentation

## 🔧 Si vous rencontrez des problèmes

### Problème : "Authentication failed"

Vous devez configurer vos identifiants Git :

```bash
# Configurer votre nom
git config --global user.name "Votre Nom"

# Configurer votre email (celui de GitHub)
git config --global user.email "jocelynouedraogo7@gmail.com"
```

Puis réessayez le `git push`.

### Problème : "remote origin already exists"

```bash
# Supprimer l'origine existante
git remote remove origin

# Ajouter la nouvelle origine
git remote add origin https://github.com/VOTRE_USERNAME/ange-auto-ecole-site.git
```

### Problème : "Permission denied"

Assurez-vous que :
1. Vous êtes connecté au bon compte GitHub
2. Le dépôt vous appartient ou vous y avez accès
3. Vous utilisez le bon nom d'utilisateur dans l'URL

## 🚀 Une fois sur GitHub

### Déploiement automatique sur Netlify

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Connectez-vous avec votre compte
3. Cliquez sur **"Add new site"** → **"Import an existing project"**
4. Cliquez sur **"GitHub"** et autorisez l'accès
5. Sélectionnez votre dépôt `ange-auto-ecole-site`
6. Configurez :
   - **Build command** : (laisser vide)
   - **Publish directory** : `.` (point)
7. Cliquez sur **"Deploy site"**

Netlify déploiera automatiquement votre site à chaque changement sur GitHub !

## 📝 Structure du projet sur GitHub

Votre dépôt contiendra :

```
ange-auto-ecole-site/
├── .gitignore
├── DEPLOYMENT.md
├── README.md
├── assets/
│   ├── images/
│   │   ├── Image1_ANGE.jpeg
│   │   └── Image2_ANGE.jpeg
│   ├── logo/
│   │   └── LOGO_ANGE.png
│   └── icons/
│       └── ICONE_ANGE.jpeg
├── conditions-utilisation.html
├── index.html
├── mentions-legales.html
├── netlify.toml
├── politique-confidentialite.html
├── script.js
├── styles.css
└── suppression-compte.html
```

## ✅ Checklist avant de pousser

- [ ] Dépôt GitHub créé
- [ ] URL du dépôt notée
- [ ] Commande `git remote add` exécutée
- [ ] Commande `git push` exécutée avec succès
- [ ] Fichiers visibles sur GitHub

Une fois ces étapes terminées, votre projet sera sur GitHub et prêt pour le déploiement Netlify !