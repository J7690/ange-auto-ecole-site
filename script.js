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

    // ---------- Questions d'examen tirées de la base de l'application ----------
    // Deux fonctions Supabase ouvertes aux visiteurs (migration
    // 20261010200000_site_question_du_jour) ne lisent qu'une vitrine de 66
    // questions sur 440. La clé ci-dessous est la clé publique du projet :
    // elle est faite pour être dans un navigateur et ne donne accès qu'à ce
    // que les règles de la base ouvrent aux anonymes.
    const SUPABASE_RPC = 'https://ffmyvgiboejcqkhyzcis.supabase.co/rest/v1/rpc/';
    const CLE_PUBLIQUE = 'sb_publishable_mZcrbOGtDYubpgR0fErEcA_hvGB5tNN';

    function appeler(fonction) {
        return fetch(SUPABASE_RPC + fonction, {
            method: 'POST',
            headers: { apikey: CLE_PUBLIQUE, 'Content-Type': 'application/json' },
            body: '{}'
        }).then((r) => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        });
    }

    function creer(balise, classe, texte) {
        const el = document.createElement(balise);
        if (classe) el.className = classe;
        if (texte !== undefined) el.textContent = texte;
        return el;
    }

    // Construit une question jouable. La correction suit la règle de
    // l'examen : juste seulement si l'ensemble coché est exactement le bon.
    function monterQuestion(q, options) {
        const compacte = options.compacte === true;
        const racine = creer('div', 'qcm' + (compacte ? ' qcm--compacte' : ''));

        const figure = creer('figure', 'qcm__planche');
        const img = creer('img');
        img.src = q.image_url;
        img.alt = 'Planche de la question ' + q.numero + ' de la série ' + q.serie;
        img.decoding = 'async';
        figure.appendChild(img);

        const corps = creer('div', 'qcm__corps');
        corps.appendChild(creer('p', 'qcm__enonce', q.enonce));
        corps.appendChild(creer('p', 'qcm__consigne', q.multiple
            ? 'Plusieurs réponses possibles : cochez toutes les bonnes.'
            : 'Une seule bonne réponse.'));

        const groupe = creer('div', 'qcm__reponses');
        groupe.setAttribute('role', 'group');
        groupe.setAttribute('aria-label', 'Réponses');
        const valider = creer('button', 'bouton bouton--vert qcm__valider', 'Valider');
        valider.type = 'button';
        valider.disabled = true;

        const choix = q.reponses.map((r) => {
            const bouton = creer('button', 'qcm__choix');
            bouton.type = 'button';
            bouton.setAttribute('aria-pressed', 'false');
            bouton.appendChild(creer('b', '', r.lettre));
            bouton.appendChild(creer('span', '', r.texte));
            bouton.addEventListener('click', () => {
                const coche = bouton.getAttribute('aria-pressed') !== 'true';
                if (!q.multiple) choix.forEach((c) => c.bouton.setAttribute('aria-pressed', 'false'));
                bouton.setAttribute('aria-pressed', String(coche));
                valider.disabled = !choix.some((c) => c.bouton.getAttribute('aria-pressed') === 'true');
            });
            groupe.appendChild(bouton);
            return { bouton, juste: r.juste === true, lettre: r.lettre };
        });
        corps.appendChild(groupe);
        corps.appendChild(valider);

        const verdict = creer('div', 'qcm__verdict');
        verdict.hidden = true;
        verdict.setAttribute('aria-live', 'polite');
        corps.appendChild(verdict);

        valider.addEventListener('click', () => {
            let juste = true;
            choix.forEach((c) => {
                const coche = c.bouton.getAttribute('aria-pressed') === 'true';
                c.bouton.disabled = true;
                if (coche !== c.juste) juste = false;
                if (c.juste) c.bouton.classList.add('est-juste');
                if (c.juste && !coche) c.bouton.classList.add('est-oubliee');
                if (!c.juste && coche) c.bouton.classList.add('est-faux');
            });
            valider.hidden = true;

            verdict.classList.toggle('est-faux', !juste);
            verdict.appendChild(creer('strong', '', juste ? 'Bonne réponse !' : 'Ce n\'est pas tout à fait ça.'));
            const bonnes = choix.filter((c) => c.juste).map((c) => c.lettre).join(', ');
            verdict.appendChild(creer('p', '', (bonnes.indexOf(',') > 0 ? 'Bonnes réponses : ' : 'Bonne réponse : ') + bonnes));
            if (q.explication) {
                const details = creer('details');
                details.appendChild(creer('summary', '', 'Comprendre la règle'));
                const texte = creer('div', 'qcm__explication');
                q.explication.split(/\n\s*\n/).forEach((para) => texte.appendChild(creer('p', '', para.trim())));
                details.appendChild(texte);
                if (!juste && !compacte) details.open = true;
                verdict.appendChild(details);
            }
            verdict.hidden = false;
            if (options.onReponse) options.onReponse(juste, corps);
        });

        racine.appendChild(figure);
        racine.appendChild(corps);
        return racine;
    }

    // La question du jour, dans le téléphone de la section Application.
    // Si la base ne répond pas, la démonstration du sens interdit reste.
    const zoneJour = document.querySelector('[data-question-jour]');
    if (zoneJour && 'fetch' in window) {
        const charger = () => appeler('site_question_du_jour').then((q) => {
            if (!q || !q.reponses || !q.reponses.length) return;
            zoneJour.replaceChildren(monterQuestion(q, {
                compacte: true,
                onReponse: (_, corps) => {
                    const lien = creer('a', 'telephone__lien', 'Faire le mini-test de 5 questions →');
                    lien.href = '#test';
                    corps.appendChild(lien);
                }
            }));
            const pastille = document.querySelector('[data-pastille]');
            if (pastille) pastille.textContent = 'Question du jour';
        }).catch(() => {});
        // Chargée à l'approche de la section, pas au premier affichage
        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entrees) => {
                if (entrees.some((e) => e.isIntersecting)) { obs.disconnect(); charger(); }
            }, { rootMargin: '600px 0px' });
            obs.observe(zoneJour);
        } else {
            charger();
        }
    }

    // Le mini-test de 5 questions
    const test = document.querySelector('[data-test]');
    if (test) {
        const ecrans = {
            accueil: test.querySelector('[data-test-accueil]'),
            jeu: test.querySelector('[data-test-jeu]'),
            fin: test.querySelector('[data-test-fin]'),
            erreur: test.querySelector('[data-test-erreur]')
        };
        const zoneQuestion = test.querySelector('[data-test-question]');
        const compteur = test.querySelector('[data-test-compteur]');
        const points = test.querySelector('[data-test-points]');
        const barre = test.querySelector('[data-test-barre]');
        const boutonsCommencer = test.querySelectorAll('[data-test-commencer]');
        let questions = [];
        let index = 0;
        let bonnes = 0;

        const montrer = (nom) => Object.keys(ecrans).forEach((k) => { ecrans[k].hidden = k !== nom; });
        const ramener = () => {
            const haut = test.getBoundingClientRect().top;
            if (haut < 70 || haut > window.innerHeight * 0.5) {
                test.scrollIntoView({ behavior: reduireMouvement ? 'auto' : 'smooth', block: 'start' });
            }
        };
        const textePoints = () => bonnes + (bonnes > 1 ? ' bonnes réponses' : ' bonne réponse');

        function afficherQuestion() {
            const q = questions[index];
            compteur.textContent = 'Question ' + (index + 1) + ' sur ' + questions.length;
            points.textContent = textePoints();
            barre.style.width = (index / questions.length * 100) + '%';
            zoneQuestion.replaceChildren(monterQuestion(q, {
                onReponse: (juste, corps) => {
                    if (juste) bonnes += 1;
                    points.textContent = textePoints();
                    barre.style.width = ((index + 1) / questions.length * 100) + '%';
                    const derniere = index === questions.length - 1;
                    const suite = creer('button', 'bouton bouton--or qcm__suite', derniere ? 'Voir mon résultat' : 'Question suivante');
                    suite.type = 'button';
                    suite.addEventListener('click', () => {
                        if (derniere) { terminer(); } else { index += 1; afficherQuestion(); }
                        ramener();
                    });
                    corps.appendChild(suite);
                    suite.focus({ preventScroll: true });
                }
            }));
        }

        function terminer() {
            const total = questions.length;
            const score = test.querySelector('.score');
            const arc = test.querySelector('[data-score-arc]');
            test.querySelector('[data-score-texte]').textContent = bonnes + '/' + total;
            score.classList.toggle('est-reussi', bonnes >= total - 1);
            arc.style.strokeDashoffset = '326.7';
            let titre;
            let message;
            if (bonnes === total) {
                titre = 'Parfait, ' + bonnes + ' sur ' + total + ' !';
                message = 'Vous avez l\'œil. Inscrivez-vous pour vous entraîner sur les 440 questions de nos séries et passer l\'examen avec nous.';
            } else if (bonnes >= total - 1) {
                titre = 'Très bien, ' + bonnes + ' sur ' + total;
                message = 'À l\'examen, il faut au moins 25 bonnes réponses sur 30. Avec nos cours et l\'application, vous y serez vite.';
            } else if (bonnes >= 2) {
                titre = bonnes + ' sur ' + total + ' : encore un effort';
                message = 'Les questions à plusieurs réponses piègent beaucoup de candidats. Nos moniteurs et l\'application vous apprennent à les lire.';
            } else {
                titre = bonnes + ' sur ' + total + ' : le code, ça s\'apprend';
                message = 'C\'est normal au début. Nos cours en salle et l\'application, avec ses corrections expliquées, sont faits pour ça.';
            }
            test.querySelector('[data-fin-titre]').textContent = titre;
            test.querySelector('[data-fin-message]').textContent = message;
            const partage = 'J\'ai eu ' + bonnes + '/' + total + ' au test du code de la route d\'Ange Auto-École. À toi de jouer : https://www.angeautoecole.com/#test';
            test.querySelector('[data-test-partager]').href = 'https://wa.me/?text=' + encodeURIComponent(partage);
            montrer('fin');
            requestAnimationFrame(() => requestAnimationFrame(() => {
                arc.style.strokeDashoffset = String(326.7 * (1 - bonnes / total));
            }));
        }

        function commencer() {
            boutonsCommencer.forEach((b) => { b.disabled = true; b.dataset.texte = b.dataset.texte || b.textContent; b.textContent = 'Chargement…'; });
            appeler('site_mini_test').then((liste) => {
                questions = (liste || []).filter((q) => q && q.reponses && q.reponses.length);
                if (!questions.length) throw new Error('vide');
                index = 0;
                bonnes = 0;
                montrer('jeu');
                afficherQuestion();
                ramener();
            }).catch(() => {
                montrer('erreur');
            }).finally(() => {
                boutonsCommencer.forEach((b) => { b.disabled = false; b.textContent = b.dataset.texte; });
            });
        }

        boutonsCommencer.forEach((b) => b.addEventListener('click', commencer));
        test.querySelector('[data-test-rejouer]').addEventListener('click', commencer);
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
