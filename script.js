// Ange Auto-École — comportements du site.
// Aucune dépendance : chaque bloc ne s'active que si son élément existe, pour
// que le même fichier serve la page d'accueil et les pages secondaires.

(function () {
    'use strict';

    const reduireMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connexion = navigator.connection || {};
    // Réseau lent ou économiseur de données : on ne télécharge aucune vidéo.
    const economiserDonnees = connexion.saveData === true || /(^|-)2g$/.test(connexion.effectiveType || '');

    // ---------- Service worker (mode application, hors ligne de base) ----------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }

    // ---------- En-tête : fond plein après le héros, lien de section actif ----------
    const entete = document.querySelector('[data-entete]');
    const barreProgression = document.querySelector('.progression span');

    function surDefilement() {
        const y = window.scrollY;
        if (entete) entete.classList.toggle('est-solide', y > 40);
        if (barreProgression) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            barreProgression.style.setProperty('--p', max > 0 ? Math.min(y / max, 1) : 0);
        }
        dessinerRoute();
    }

    let enAttente = false;
    window.addEventListener('scroll', () => {
        if (enAttente) return;
        enAttente = true;
        requestAnimationFrame(() => { surDefilement(); enAttente = false; });
    }, { passive: true });

    // ---------- Menu mobile ----------
    const burger = document.querySelector('.burger');
    const menu = document.getElementById('menu');

    function fermerMenu() {
        if (!menu || !burger) return;
        menu.classList.remove('est-ouvert');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Ouvrir le menu');
    }

    if (burger && menu) {
        burger.addEventListener('click', () => {
            const ouvert = menu.classList.toggle('est-ouvert');
            burger.setAttribute('aria-expanded', String(ouvert));
            burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
        });
        menu.addEventListener('click', (e) => { if (e.target.closest('a')) fermerMenu(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermerMenu(); });
    }

    // Lien du menu correspondant à la section à l'écran
    const liensMenu = menu ? [...menu.querySelectorAll('a[href^="#"]:not(.bouton)')] : [];
    if (liensMenu.length && 'IntersectionObserver' in window) {
        const parId = new Map(liensMenu.map((a) => [a.getAttribute('href').slice(1), a]));
        const observateurSections = new IntersectionObserver((entrees) => {
            entrees.forEach((entree) => {
                if (!entree.isIntersecting) return;
                liensMenu.forEach((a) => a.classList.remove('est-actif'));
                const lien = parId.get(entree.target.id);
                if (lien) lien.classList.add('est-actif');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        // Toutes les sections, y compris celles absentes du menu (catégories,
        // contact) : y entrer efface le surlignage précédent.
        document.querySelectorAll('main section[id]').forEach((section) => observateurSections.observe(section));
    }

    // ---------- Apparitions au défilement ----------
    const aReveler = document.querySelectorAll('.reveal');

    function reveler(el) {
        el.classList.add('est-visible');
        // Une fois arrivé, l'élément rend la main à ses propres transitions
        // (survol des cartes) au lieu de garder la lente transition d'entrée.
        const fin = () => { el.classList.remove('reveal'); el.removeEventListener('transitionend', fin); };
        el.addEventListener('transitionend', fin);
        setTimeout(fin, 1600);
    }

    if (reduireMouvement || !('IntersectionObserver' in window)) {
        aReveler.forEach((el) => { el.classList.add('est-visible'); el.classList.remove('reveal'); });
    } else {
        const observateur = new IntersectionObserver((entrees) => {
            entrees.forEach((entree) => {
                if (!entree.isIntersecting) return;
                reveler(entree.target);
                observateur.unobserve(entree.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        aReveler.forEach((el) => observateur.observe(el));
    }

    // ---------- Compteurs ----------
    const compteurs = document.querySelectorAll('[data-compteur]');
    function compter(el) {
        const cible = parseInt(el.dataset.compteur, 10);
        const duree = 1400;
        const debut = performance.now();
        const pas = (t) => {
            const p = Math.min((t - debut) / duree, 1);
            const adouci = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(cible * adouci).toLocaleString('fr-FR');
            if (p < 1) requestAnimationFrame(pas);
        };
        requestAnimationFrame(pas);
    }
    if (compteurs.length && !reduireMouvement && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entrees) => {
            entrees.forEach((entree) => {
                if (!entree.isIntersecting) return;
                compter(entree.target);
                obs.unobserve(entree.target);
            });
        }, { threshold: 0.6 });
        compteurs.forEach((el) => { el.textContent = '0'; obs.observe(el); });
    }

    // ---------- Parcours : la route se trace au fil de la lecture ----------
    const route = document.querySelector('[data-route]');
    const traitRoute = route ? route.querySelector('.route__ligne') : null;
    const etapes = route ? [...route.querySelectorAll('.etape')] : [];

    function dessinerRoute() {
        if (!traitRoute) return;
        const boite = traitRoute.getBoundingClientRect();
        const repere = window.innerHeight * 0.62;
        const avance = Math.max(0, Math.min(1, (repere - boite.top) / boite.height));
        traitRoute.style.setProperty('--avance', avance.toFixed(4));
        etapes.forEach((etape) => {
            const num = etape.querySelector('.etape__num').getBoundingClientRect();
            etape.classList.toggle('est-atteinte', num.top + num.height / 2 < repere);
        });
    }

    // ---------- Catégories : onglets accessibles ----------
    const blocCategories = document.querySelector('[data-categories]');
    if (blocCategories) {
        const onglets = [...blocCategories.querySelectorAll('[role="tab"]')];
        const choisir = (onglet, focus) => {
            onglets.forEach((o) => {
                const actif = o === onglet;
                o.setAttribute('aria-selected', String(actif));
                o.tabIndex = actif ? 0 : -1;
                document.getElementById(o.getAttribute('aria-controls')).hidden = !actif;
            });
            if (focus) onglet.focus();
        };
        onglets.forEach((onglet, i) => {
            onglet.addEventListener('click', () => choisir(onglet, false));
            onglet.addEventListener('keydown', (e) => {
                let cible = null;
                if (e.key === 'ArrowRight') cible = onglets[(i + 1) % onglets.length];
                if (e.key === 'ArrowLeft') cible = onglets[(i - 1 + onglets.length) % onglets.length];
                if (e.key === 'Home') cible = onglets[0];
                if (e.key === 'End') cible = onglets[onglets.length - 1];
                if (cible) { e.preventDefault(); choisir(cible, true); }
            });
        });
    }

    // « Me pré-inscrire en B » : présélectionne la catégorie dans le formulaire
    const selectCategorie = document.getElementById('categorie');
    document.querySelectorAll('[data-choisir]').forEach((lien) => {
        lien.addEventListener('click', () => {
            if (!selectCategorie) return;
            selectCategorie.value = lien.dataset.choisir;
            const champ = selectCategorie.closest('.champ');
            if (champ) {
                champ.classList.remove('est-mis-en-avant');
                void champ.offsetWidth;
                champ.classList.add('est-mis-en-avant');
            }
        });
    });

    // ---------- Le quiz d'essai dans le téléphone ----------
    const quiz = document.querySelector('[data-quiz]');
    const verdict = document.querySelector('[data-verdict]');
    if (quiz && verdict) {
        const boutons = [...quiz.querySelectorAll('button')];
        const texte = verdict.querySelector('p');
        const image = verdict.querySelector('img');
        boutons.forEach((bouton) => {
            bouton.addEventListener('click', () => {
                const juste = bouton.dataset.juste === 'true';
                boutons.forEach((b) => { b.disabled = true; });
                boutons.find((b) => b.dataset.juste === 'true').classList.add('est-juste');
                if (!juste) bouton.classList.add('est-faux');
                verdict.classList.toggle('est-faux', !juste);
                image.src = juste ? 'assets/elena/elena-felicitations.webp' : 'assets/elena/elena-explication.webp';
                texte.innerHTML = (juste
                    ? '<strong>Bonne réponse !</strong> Ce panneau interdit l\'accès à tous les véhicules dans ce sens.'
                    : '<strong>Pas tout à fait.</strong> C\'est un sens interdit : l\'accès est interdit à tous les véhicules dans ce sens.')
                    + ' <button type="button">Rejouer</button>';
                verdict.hidden = false;
                texte.querySelector('button').addEventListener('click', () => {
                    boutons.forEach((b) => { b.disabled = false; b.classList.remove('est-juste', 'est-faux'); });
                    verdict.hidden = true;
                    boutons[0].focus();
                });
            });
        });
    }

    // ---------- Vidéos : chargées seulement quand c'est raisonnable ----------
    function chargerVideo(video) {
        video.querySelectorAll('source[data-src]').forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); });
        video.load();
    }

    const videoAccueil = document.querySelector('[data-video-accueil]');
    // Vidéo d'accueil : écrans larges, bon réseau, animations autorisées.
    // Sur téléphone, l'image fixe (avec son lent zoom) suffit et économise ~1 Mo.
    if (videoAccueil && !reduireMouvement && !economiserDonnees && window.matchMedia('(min-width: 768px)').matches) {
        chargerVideo(videoAccueil);
        videoAccueil.addEventListener('canplay', () => {
            videoAccueil.play().then(() => videoAccueil.classList.add('est-prete')).catch(() => {});
        }, { once: true });
    }

    const videoTerrain = document.querySelector('[data-video-terrain]');
    if (videoTerrain && !reduireMouvement && !economiserDonnees && 'IntersectionObserver' in window) {
        let chargee = false;
        new IntersectionObserver((entrees) => {
            entrees.forEach((entree) => {
                if (entree.isIntersecting) {
                    if (!chargee) { chargerVideo(videoTerrain); chargee = true; }
                    videoTerrain.play().catch(() => {});
                } else if (chargee) {
                    videoTerrain.pause();
                }
            });
        }, { threshold: 0.35 }).observe(videoTerrain);
    }

    // ---------- Galerie : visionneuse ----------
    const visionneuse = document.querySelector('[data-visionneuse]');
    const vignettes = [...document.querySelectorAll('[data-grand]')];
    if (visionneuse && vignettes.length && typeof visionneuse.showModal === 'function') {
        const img = visionneuse.querySelector('img');
        let index = 0;
        const afficher = (i) => {
            index = (i + vignettes.length) % vignettes.length;
            img.src = vignettes[index].dataset.grand;
            img.alt = vignettes[index].querySelector('img').alt;
        };
        vignettes.forEach((v, i) => v.addEventListener('click', () => { afficher(i); visionneuse.showModal(); }));
        visionneuse.querySelector('.visionneuse__fermer').addEventListener('click', () => visionneuse.close());
        visionneuse.querySelector('.visionneuse__nav--prec').addEventListener('click', () => afficher(index - 1));
        visionneuse.querySelector('.visionneuse__nav--suiv').addEventListener('click', () => afficher(index + 1));
        visionneuse.addEventListener('click', (e) => { if (e.target === visionneuse) visionneuse.close(); });
        visionneuse.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') afficher(index - 1);
            if (e.key === 'ArrowRight') afficher(index + 1);
        });
        // Glisser du doigt pour changer de photo
        let departX = null;
        visionneuse.addEventListener('touchstart', (e) => { departX = e.touches[0].clientX; }, { passive: true });
        visionneuse.addEventListener('touchend', (e) => {
            if (departX === null) return;
            const dx = e.changedTouches[0].clientX - departX;
            if (Math.abs(dx) > 50) afficher(index + (dx < 0 ? 1 : -1));
            departX = null;
        });
    } else {
        // Navigateur sans <dialog> : la vignette ouvre simplement la grande photo.
        vignettes.forEach((v) => v.addEventListener('click', () => { window.location.href = v.dataset.grand; }));
    }

    // ---------- Formulaire de pré-inscription ----------
    // L'envoi est traité par Netlify Forms (data-netlify), qui redirige vers merci.html.
    const formulaire = document.querySelector('.formulaire');
    if (formulaire) {
        formulaire.addEventListener('submit', () => {
            const bouton = formulaire.querySelector('button[type="submit"]');
            if (bouton) { bouton.disabled = true; bouton.textContent = 'Envoi en cours…'; }
        });
    }

    surDefilement();
})();
