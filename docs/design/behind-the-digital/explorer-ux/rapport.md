# Behind explorer UX — rapport

## Diagnostic

Dans `BehindScene.astro`, le listener `pointermove` sur `.stack` convertissait la position X de la souris en couche, cochait le radio correspondant et mettait à jour le texte. Traverser le châssis changeait donc la sélection sans clic. `pointerleave` effaçait seulement `data-preview` sans restaurer une intention claire.

L’intro et l’exploration partageaient aussi la même zone de texte (`data-line`), ce qui mélangeait légendes d’animation et explications de couche.

## Correctifs

- Suppression de `pointermove` / `pointerleave` et du chemin `data-preview`
- Sélection uniquement via radios (clic, toucher, clavier)
- Titre + consigne : « Découvrez… » / « Explorez les 4 couches… »
- Zone `data-explain` (exploration) séparée de `data-phase-line` (intro)
- Bouton « Revoir la démonstration » ; interruption manuelle de l’intro
- Action métier assouplie (plus de faux bouton primaire)
- Textes FR / EN mis à jour ; note illustrative conservée

## Preuves

| Livrable | Fichier |
| --- | --- |
| Avant desktop | `before-v3-desktop-1440.jpg` |
| Avant mobile | `before-v3-mobile-390.jpg` |
| Après desktop | `after-desktop-settled-1440.jpg`, `clip-desktop-settled-1440.jpg` |
| Après mobile | `after-mobile-arch-390.jpg`, `clip-mobile-settled-390.jpg` |
| Couches | `after-desktop-{app,arch,data,cloud}-1440.jpg` |
| Vidéo | `navigation-interactive-1440.webm` |
| Test auto | `npm run test:behind-explorer` |

## Résultats automatiques

```json
{
  "pointermoveKeepsData": true,
  "noOverflow320": true,
  "noOverflow390": true,
  "noOverflow768": true,
  "noOverflow1024": true,
  "enTitle": true,
  "reducedMotionStable": true
}
```

Le test `tests/behind-explorer.spec.mjs` construit avec `PUBLIC_BEHIND_HERO=true` et `PUBLIC_ASSISTANT=true`, sélectionne Data, traverse le châssis à la souris, et prouve que la couche et l’explication restent inchangées.

## Bilan UX

Le visiteur comprend qu’il explore quatre couches complémentaires (pas un stepper), peut choisir volontairement via des onglets visibles, et ne perd plus sa sélection en déplaçant la souris. L’intro reste une démonstration ponctuelle, séparée de l’état interactif stable.

## Hors périmètre

Pas de merge, pas de déploiement, pas de modification des secrets ni des Compose de production. `PUBLIC_BEHIND_HERO` reste faux par défaut.
