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

## Lecture comparative

Comparaison à partir des vidéos `intro-1440.webm` (V1) et `intro-after-1440.webm` (V2), des captures du châssis, et de l’accueil publié après la PR #32 (`docs/ux/pr-32/after/home-fr-1440.jpg`). Ce n’est pas une mesure d’émotion.

La V1 révélait un escalier de titres. La V2 ouvre un seul objet : l’application reste à droite, les trois couches tiennent à gauche, le trait traverse, puis la carte se referme. La lecture est plus nette. Le fondu est posé. La profondeur reste celle d’un plateau CSS : une rotation plus forte cachait le texte.

Sur l’accueil actuel, l’orbite nomme tout de suite les quatre offres et sert de plan du site. La scène raconte plutôt une intervention : un ordre du jour, une clôture, une règle hors de l’écran, une donnée, une décision qui reste humaine. Pour un prospect B2B, c’est plus concret, et moins un sommaire. Les noms des expertises restent dans la navigation et dans la section suivante, qui n’est pas remplacée.

Dans la colonne réelle du hero, les quatre boutons radio passent sur deux lignes. À 900 px de haut, le bouton Revoir commence sous le premier écran. Le H1 et les deux appels restent lisibles à côté de la carte.

## Intégration préparée, non activée

`PUBLIC_BEHIND_HERO` est faux par défaut, y compris dans le `Dockerfile`. Sans cette valeur exacte `true` au build, l’accueil garde l’orbite. Avec elle, seul le visuel du hero est remplacé par `BehindScene`. Le H1, les deux liens, l’en-tête, le pied, le JSON-LD et les sections suivantes restent ceux de la page. Le composant ne duplique pas le header ni le footer. Ses classes ne reprennent pas `.plate` ni `.scene`, pour ne pas toucher les schémas d’expertises.

Recette Chrome, même machine, serveur de développement. Titre, description, canonique, H1 et JSON-LD sont identiques entre l’accueil orbite et l’accueil scène, en français et en anglais. Les liens restent `/contact/?type=project` et `#expertises`, et `/en/contact/?type=project` en anglais.

| Contrôle | Orbite | Scène |
| --- | --- | --- |
| CLS sur une lecture | — | 0,019 |
| DCL | — | 239 ms |
| LCP | non lu | non lu |
| Débordement 320 à 1440, et zoom 200 % | — | 0 |
| Erreurs JavaScript | aucune | aucune |
| Menu mobile | — | ouvert, « Nos offres » |
| Clavier | — | deux flèches droite sélectionnent Data et IA |
| Tactile | — | le bouton Cloud et qualité se sélectionne au clic |
| Mouvement réduit | — | état final immédiat, intervention clôturée |
| Section Expertises | présente | le second onglet s’ouvre encore |

Preuves : `docs/design/behind-the-digital/hero/` (`old-fr-*`, `new-fr-*`, `new-en-1440.jpg`, `new-reduced-1440.jpg`, `home-fr-1440.webm`).

Build de production, 42 pages. Sans le flag, l’accueil fait 27 503 octets, charge `Base` (41 582 octets) et `Footer` (19 955 octets), et ne contient ni `data-behind` ni la feuille de la scène. Le H1, le canonique et les liens restent ceux de la page publiée. `tests/static.spec.mjs` et `tests/assistant.spec.mjs` passent. Avec le flag, le même HTML fait 27 744 octets et ajoute la feuille de la scène (14 335 octets) et son script (9 597 octets). `Base` et `Footer` ne changent pas. Ce second build n’est pas celui qui reste dans `dist`.
