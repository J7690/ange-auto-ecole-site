@echo off
echo ========================================
echo Script pour pousser sur GitHub
echo ========================================
echo.
echo IMPORTANT: Vous devez d'abord creer un depot sur GitHub
echo Allez sur https://github.com et creez un nouveau depot
echo.
set /p USERNAME="Entrez votre nom d'utilisateur GitHub: "
set REPO_NAME=ange-auto-ecole-site

echo.
echo Vous avez entre: %USERNAME%
echo.
echo Verification du depot distant existant...
git remote -v

echo.
echo Ajout du depot distant...
git remote add origin https://github.com/%USERNAME%/%REPO_NAME%.git

echo.
echo Verification du depot distant:
git remote -v

echo.
echo Poussage du code sur GitHub...
git push -u origin master

if %errorlevel% neq 0 (
    echo.
    echo Erreur avec 'master'. Essai avec 'main'...
    git branch -M main
    git push -u origin main
)

echo.
echo ========================================
echo Termine ! Verifiez votre depot sur GitHub
echo ========================================
echo.
pause