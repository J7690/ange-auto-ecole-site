@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo Publication du site Ange Auto-Ecole sur GitHub
echo ========================================
echo.

echo Depot distant configure :
git remote -v
echo.

echo Enregistrement des changements dans Git (git add + commit)...
git add -A
git commit -m "Mise a jour du site - %date% %time%"
if errorlevel 1 (
    echo.
    echo Aucun changement a enregistrer, ou une erreur est survenue ci-dessus.
    echo Si c'est juste "nothing to commit", ce n'est pas grave, on continue.
)

echo.
echo Envoi vers GitHub...
echo (une fenetre de connexion GitHub peut s'ouvrir dans votre navigateur : connectez-vous et autorisez)
echo.
git push origin master
if errorlevel 1 (
    echo.
    echo Le push avec 'master' a echoue. Nouvel essai avec 'main'...
    git branch -M main
    git push -u origin main
)

echo.
echo ========================================
echo Termine. Verifiez le resultat juste au-dessus :
echo   - "main/master -> main/master" = ca a marche
echo   - un message d'erreur = faites une capture d'ecran de cette fenetre
echo ========================================
echo.
pause
