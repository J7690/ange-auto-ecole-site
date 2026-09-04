@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

set "REPO_URL=https://github.com/J7690/ange-auto-ecole-site.git"
set "LOG=%~dp0dernier_push.log"

echo ============================================================
echo   PUBLICATION DU SITE ANGE AUTO-ECOLE SUR GITHUB
echo ============================================================
echo Dossier : %CD%
echo.

echo [1/7] Verification de Git...
where git >nul 2>&1
if errorlevel 1 (
    echo.
    echo   ERREUR : Git n'est pas installe sur cet ordinateur.
    echo   Telechargez-le ici : https://git-scm.com/download/win
    echo   Installez-le en laissant toutes les options par defaut,
    echo   puis relancez ce fichier.
    echo.
    pause
    exit /b 1
)
echo   OK.
echo.

echo [2/7] Verification du depot local...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo   Aucun depot Git ici. Creation en cours...
    git init
    if errorlevel 1 (
        echo   ERREUR : impossible d'initialiser le depot.
        pause
        exit /b 1
    )
)
echo   OK.
echo.

echo [3/7] Verification de l'identite Git...
git config user.name >nul 2>&1
if errorlevel 1 git config user.name "Ange Auto-Ecole"
git config user.email >nul 2>&1
if errorlevel 1 git config user.email "angeautoecole@gmail.com"
echo   OK.
echo.

echo [4/7] Verification du depot distant GitHub...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo   Aucun depot distant configure. Ajout de : %REPO_URL%
    git remote add origin "%REPO_URL%"
)
set "ORIGIN="
for /f "delims=" %%u in ('git remote get-url origin 2^>nul') do set "ORIGIN=%%u"
echo   origin = !ORIGIN!
echo.

echo [5/7] Enregistrement des modifications...
git add -A
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "Mise a jour du site - %date% %time%"
    echo   Modifications enregistrees.
) else (
    echo   Aucune nouvelle modification a enregistrer.
    echo   On tente quand meme l'envoi, au cas ou un ancien commit
    echo   ne serait pas encore parti.
)
echo.

echo [6/7] Envoi vers GitHub...
set "BRANCH="
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%b"
if "!BRANCH!"=="" set "BRANCH=master"
if "!BRANCH!"=="HEAD" (
    echo   Aucun commit encore enregistre. Creation de la branche master...
    git branch -M master
    set "BRANCH=master"
)
echo   Branche : !BRANCH!
echo.
echo   Si une fenetre de connexion GitHub s'ouvre, connectez-vous et autorisez.
echo.
git push -u origin !BRANCH!
echo.

echo [7/7] Verification reelle de la publication...
git fetch origin >nul 2>&1
set "LOCAL="
set "REMOTE="
for /f "delims=" %%l in ('git rev-parse HEAD 2^>nul') do set "LOCAL=%%l"
for /f "delims=" %%r in ('git rev-parse origin/!BRANCH! 2^>nul') do set "REMOTE=%%r"

echo.
echo ============================================================
if "!LOCAL!"=="" (
    echo   RESULTAT : ECHEC - aucun commit local trouve.
    set "RESULTAT=ECHEC - aucun commit local"
) else if "!LOCAL!"=="!REMOTE!" (
    echo   RESULTAT : SUCCES
    echo.
    echo   Le site est bien publie sur GitHub.
    echo   Netlify le mettra en ligne dans 1 a 2 minutes.
    echo   https://github.com/J7690/ange-auto-ecole-site
    set "RESULTAT=SUCCES"
) else (
    echo   RESULTAT : ECHEC - GitHub n'a pas recu les modifications.
    echo.
    echo   Lisez le message affiche a l'etape [6/7] ci-dessus.
    echo   Causes les plus frequentes :
    echo     - connexion GitHub refusee ou annulee
    echo     - pas de connexion internet
    echo     - le depot distant contient des commits que vous n'avez pas
    echo       dans ce cas, lancez d'abord : git pull --rebase origin !BRANCH!
    set "RESULTAT=ECHEC - push non effectue"
)
echo ============================================================
echo.

(
    echo Date          : %date% %time%
    echo Dossier       : %CD%
    echo Origin        : !ORIGIN!
    echo Branche       : !BRANCH!
    echo Commit local  : !LOCAL!
    echo Commit GitHub : !REMOTE!
    echo Resultat      : !RESULTAT!
) > "%LOG%"

echo Un compte-rendu a ete enregistre dans : dernier_push.log
echo En cas de probleme, envoyez-moi ce fichier ou une capture de cette fenetre.
echo.
pause
