# Comment exécuter les commandes GitHub

## 📍 Où exécuter les commandes

### Méthode 1 : Via l'invite de commande (PowerShell)

1. **Ouvrir le terminal dans le bon dossier** :
   - Allez dans le dossier : `C:\Users\fasop\AndroidStudioProjects\SITE WEB ANGE AUTO ECOLE`
   - Cliquez sur la barre d'adresse en haut
   - Tapez `powershell` et appuyez sur Entrée
   - OU faites un clic droit dans le dossier → "Ouvrir dans le terminal"

2. **Vous verrez un terminal avec ce chemin** :
   ```
   PS C:\Users\fasop\AndroidStudioProjects\SITE WEB ANGE AUTO ECOLE>
   ```

### Méthode 2 : Via Android Studio

1. Ouvrez Android Studio
2. Allez dans le menu **Terminal** en bas de l'écran
3. Assurez-vous que vous êtes dans le bon dossier (vous devriez voir le chemin)

## 🔑 Trouver votre nom d'utilisateur GitHub

1. Connectez-vous sur [https://github.com](https://github.com) avec `jocelynouedraogo7@gmail.com`
2. Regardez en haut à droite de l'écran
3. Cliquez sur votre photo de profil
4. Votre nom d'utilisateur apparaît (ex: `jocelynouedraogo` ou autre)

## ✏️ Remplacer VOTRE_USERNAME

### Exemple concret :

Si votre nom d'utilisateur GitHub est `jocelynouedraogo`, remplacez :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/ange-auto-ecole-site.git
```

Par :

```bash
git remote add origin https://github.com/jocelynouedraogo/ange-auto-ecole-site.git
```

## 🚀 Exécuter les commandes (pas à pas)

### Étape 1 : Ouvrir le terminal

Ouvrez PowerShell dans le dossier du projet comme expliqué ci-dessus.

### Étape 2 : Créer le dépôt GitHub (si pas encore fait)

1. Allez sur [https://github.com](https://github.com)
2. Connectez-vous
3. Cliquez sur **"+"** → **"New repository"**
4. Nom : `ange-auto-ecole-site`
5. Cliquez sur **"Create repository"**

### Étape 3 : Exécuter les commandes

Dans votre terminal (dans le bon dossier), exécutez ces commandes une par une :

```bash
# Remplacez jocelynouedraogo par VOTRE vrai nom d'utilisateur GitHub
git remote add origin https://github.com/jocelynouedraogo/ange-auto-ecole-site.git
```

Appuyez sur **Entrée**

```bash
git push -u origin master
```

Appuyez sur **Entrée**

### Si la commande master ne fonctionne pas :

```bash
git branch -M main
git push -u origin main
```

## 🔐 Si on vous demande un mot de passe

Lors du `git push`, GitHub vous demandera peut-être de vous authentifier :

1. **GitHub ne demande plus de mot de passe**, utilisez un **Personal Access Token**
2. Pour créer un token :
   - Allez sur GitHub → Settings → Developer settings → Personal access tokens
   - Cliquez sur "Generate new token"
   - Cochez "repo" et cliquez sur "Generate token"
   - Copiez le token (il ne s'affichera plus !)
3. Utilisez ce token comme mot de passe

## ✅ Vérifier que ça a marché

Après le `git push`, vous devriez voir un message comme :
```
Enumerating objects: 16, done.
Counting objects: 100% (16/16), done.
...
To https://github.com/VOTRE_USERNAME/ange-auto-ecole-site.git
 * [new branch]      master -> master
```

Ensuite, allez sur votre dépôt GitHub pour vérifier que tous les fichiers sont là.

## 🆘 Problèmes courants

### "fatal: remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/ange-auto-ecole-site.git
```

### "Authentication failed"

- Vérifiez votre nom d'utilisateur GitHub
- Utilisez un Personal Access Token au lieu du mot de passe

### "Repository not found"

- Vérifiez que vous avez créé le dépôt sur GitHub
- Vérifiez l'orthographe du nom du dépôt
- Vérifiez que vous avez les droits d'accès

## 📝 Résumé rapide

1. **Trouvez votre nom d'utilisateur GitHub** (ex: `jocelynouedraogo`)
2. **Ouvrez PowerShell** dans le dossier du projet
3. **Créez le dépôt** sur GitHub si ce n'est pas fait
4. **Exécutez** :
   ```bash
   git remote add origin https://github.com/VOTRE_USERNAME/ange-auto-ecole-site.git
   git push -u origin master
   ```
5. **Vérifiez** sur GitHub que les fichiers sont là

C'est tout ! Une fois fait, votre projet sera sur GitHub et prêt pour Netlify.