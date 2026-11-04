# Behind explorer UX — GO / NO-GO final

## Verdict

**GO** pour fusionner la PR #36 dans `main`, **sans** activer `PUBLIC_BEHIND_HERO` en production et **sans** déployer depuis cette PR.

## Contrôles

| Point | Résultat |
| --- | --- |
| `aria-selected` retiré des radios + `syncTabs` | OK |
| `fieldset` / `legend` / `checked` / focus CSS | Conservés |
| `test:behind-explorer` dans Verify V1 | OK (étape dédiée après `npm test`, un seul build `dist-behind`) |
| Clavier (flèches sur les 4 couches) | OK (automatisé) |
| Toucher mobile | OK (automatisé, iPhone 13) |
| Zoom 200 % | OK (pas de débordement, sélection stable) |
| Titre mobile : offset stack ≤ 96 px | OK (intro compactée sous 700 px) |
| Guide + scène avec les deux flags | OK (`data-assistant-open` + `data-behind`, pas de `#systeme`) |
| Verify V1 | OK — vert sur `32c58fd` (push + pull_request) |

## Hors périmètre

- Pas de redesign
- Pas de modification production / Compose / secrets
- Pas de merge automatique
