# Behind the Digital — prototype V2

Route locale : `http://127.0.0.1:4321/design/behind-the-digital/`

Le serveur de développement doit être lancé avec `PUBLIC_DESIGN_PROTOTYPE=true`. Sans cette variable, la page n’est pas générée. Un build public ne la contient pas et le sitemap ne la liste pas. `robots` est `noindex, nofollow`. La page n’utilise pas le layout public, pour ne pas publier son JSON-LD.

La branche part de `main`. Elle ne contient pas les commits de la PR #32. L’échelle de lecture de cette PR (texte 15–17 px, IBM Plex Mono réservé aux index, cyan limité) est reprise seulement dans `behind.css`. Le hero public n’est pas modifié.

## Ce qui change dans la V2

L’introduction ne montre plus un escalier de titres. Le châssis s’ouvre : trois strates à gauche (Cloud, Data, Architecture) et l’application à droite, dans le même objet. Les strates sont déjà en place. Une seconde carte d’application, prépositionnée, apparaît par fondu. La carte pleine s’efface. Rien de visible ne change de boîte pendant le film, ce qui garde le CLS bas.

Le rythme tient en 9,2 s, puis la scène se referme :

- 0–2,4 s : l’application telle qu’on l’utilise
- 2,4–6 s : le châssis ouvert
- 6–9,2 s : le trait lumineux traverse les couches
- ensuite : l’application se referme, l’ordre du jour est clôturé

Revoir, Passer, `prefers-reduced-motion` et les deux appels à l’action restent disponibles. Le mouvement réduit affiche tout de suite l’état final.

Le Digital X-Ray garde les boutons radio. La couche choisie occupe tout le châssis : le titre et la phrase en haut, les repères en bas. Le survol n’est pas nécessaire. Au clavier, deux flèches droite depuis Application sélectionnent Data et IA, et la phrase live correspond.

L’en-tête et le pied anglais sont les vrais composants, avec leurs URL. `menuId` évite deux menus avec le même identifiant. Le chrome inactif est masqué selon `html[lang]`.

## Décision technique

Profondeur en CSS (`perspective`, `translateZ`, une légère rotation du châssis). Pas de WebGL, pas de dépendance, pas de vidéo dans la page. Animer `left` ou la largeur de la carte visible produisait un CLS de 0,21. Le fondu entre deux cartes stables le ramène à 0,011. Le trait lumineux n’anime que `transform`.

La copie « Accès » tient sur une ligne dans le châssis ouvert : « Rôles autorisés ». La phrase complète reste dans la couche Cloud.

Sous 800 px, le film devient un fondu d’une carte pleine à la fois. Le trait et la coupe sont masqués : la largeur ne permet pas la double colonne sans couper le texte.

## Preuves

Vidéo avant : `intro-1440.webm` (V1). Vidéo après : `intro-after-1440.webm`.

Images : `intro-visible-1440.jpg`, `intro-reveal-1440.jpg`, `intro-flow-1440.jpg`, `intro-settled-1440.jpg`, `xray-app-1440.jpg`, `xray-arch-1440.jpg`, `xray-data-1440.jpg`, `xray-cloud-1440.jpg`, `intro-1024.jpg`, `intro-768.jpg`, `intro-mobile-390.jpg`, `xray-mobile-390.jpg`, `intro-reduced-1440.jpg`, `intro-en-1440.jpg`.

## Mesures

Chrome headless, une lecture naturelle, sans rejeu, sans changement de fenêtre. Serveur de développement (le client Vite n’est pas le poids de production).

| Mesure | Résultat |
| --- | --- |
| CLS | 0,011 (2 décalages sur le texte du hero) |
| Images prêtes (DCL) | 124 ms |
| LCP | non exposé par ce Chrome headless |
| Fluidité | 554 images en 9 213 ms, environ 60 images/s |
| Erreurs JavaScript | aucune |

Débordement horizontal (`scrollWidth - clientWidth`) : 0 à 320, 390, 768, 1024 et 1440, pendant la révélation, et à zoom CSS 200 %.

Clavier : couche `data`, phrase « Des données utilisées pour soutenir le processus. La décision reste humaine. »

Anglais : navigation « Our offers / Collaboration / Case studies… », pied « CAPABILITIES », lien « Let’s talk » vers `/en/contact/?type=project`. Le chrome français est `display: none`.

Mouvement réduit : `playing` faux, phase `settle`, intervention clôturée.

Build avec le drapeau : HTML 19,9 Ko, CSS de la page 13,5 Ko, script de la scène 9,6 Ko. Le CSS de pied (19,6 Ko) est celui du site, parce que le vrai pied est utilisé. L’accueil charge un CSS d’expérience de 40,6 Ko, que cette page ne charge pas. Son HTML pèse 27,5 Ko.

Build public suivant, sans le drapeau : 42 pages, la route est absente, `tests/static.spec.mjs` passe (40 URL, sitemap sans `/design/`).

## Limites

- L’ouverture est un fondu vers le châssis fendu, pas un glissement continu d’une seule carte. Le glissement déplaçait la page.
- La perspective reste légère : une rotation plus forte faisait passer l’application devant le texte des couches.
- Les cartes du X-Ray gardent un intervalle calme entre la phrase et les repères.
- Le film étroit ne montre qu’une couche à la fois.
- Le LCP de production n’a pas été lu dans ce Chrome headless. Le DCL ci-dessus est celui du serveur de développement.
