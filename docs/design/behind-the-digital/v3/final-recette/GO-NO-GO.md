# Behind the Digital V3 — Recette finale

Branche `feat/behind-the-digital-v3` (PR #34). Builds de production servis localement : orbite `4173`, scène `4174`. Aucune fusion, aucun déploiement, flag public éteint.

## Verdict

**GO** pour fusionner la PR #34 dans la PR #33, puis la PR #33 dans `main`, **sans** activer `PUBLIC_BEHIND_HERO` en production.

Aucun blocage technique réel. L’activation publique reste une décision séparée.

## 1. IntersectionObserver (mobile 390×844)

| Cas | Résultat |
| --- | --- |
| Haut de page (scène partiellement visible) | `playing=false`, ratio ≈ 0,32 (< 0,42) |
| Approche lente jusqu’à ≈ 0,45 | lecture auto unique |
| Sortie du viewport pendant le film | settle immédiat |
| Retour dans le viewport | pas de relecture auto |
| Revoir | relance manuelle, puis settle |
| Scroll rapide au-delà du seuil | lecture auto |

Note : à `scrollY = 0`, la scène n’est jamais entièrement hors écran (≈ 32 % visibles). Le seuil 42 % tient quand même : pas de démarrage tant que ce ratio n’est pas franchi.

## 2. État stable sans film

L’application « Ordres du jour », le statut Clôturé, le rail X-Ray et la ligne d’explication restent lisibles. Reduced-motion aboutit au même settle. Captures : `desktop-settled-1440.jpg`, `mobile-reduced-settled-390.jpg`.

## 3. Accessibilité et contenu

- Reduced-motion desktop et mobile : settle, `closed=true`
- Clavier : Data et IA
- Tactile : Cloud et qualité
- Skip : settle
- Overflow 320 / 390 / 1440 / zoom 200 % : 0
- FR/EN : H1, `/contact/?type=project` et `/en/contact/?type=project`, `#expertises`
- Erreurs JS : aucune

## 4. Builds et Verify V1

- `astro check` : 0 erreur (hints préexistants / scripts)
- Build public : orbite, pas de `data-behind`
- Build `PUBLIC_BEHIND_HERO=true` : scène, pas de `#systeme`
- `tests/static.spec.mjs` : OK
- `tests/assistant.spec.mjs` : OK
- Docker Compose CI et e2e Playwright complets non rejoués ici ; le workflow Verify V1 reste le filet sur la PR

## 5. LCP (production, mêmes conditions)

Mesure via `PerformanceObserver` (`largest-contentful-paint`, buffered) dans Chrome headless. `performance.getEntriesByType('largest-contentful-paint')` est resté vide dans ce runtime ; l’observer a fourni la valeur.

| Build | LCP | Élément | FCP | CLS |
| --- | --- | --- | --- | --- |
| Orbite (flag off) | 344 ms | H1 | 344 ms | 0,007 |
| Scène (flag on) | 196 ms | H1 | 196 ms | 0,004 |

Les deux LCP sont le H1. La scène affiche un H1 un peu plus petit dans la grille hero, d’où une taille LCP moindre. Ce n’est pas une régression SEO du titre.

## 6. Flag `PUBLIC_BEHIND_HERO`

| Contrôle | Résultat |
| --- | --- |
| Absent / false | hero orbite |
| `true` | BehindScene |
| `Dockerfile` | `ARG PUBLIC_BEHIND_HERO=false` seulement |
| `compose.yaml` | aucune mention BEHIND / PUBLIC_ |
| `.github/workflows/validate.yml` | aucun passage du flag scène |

## Ordre proposé

1. Fusionner **PR #34 → branche PR #33** (`feat/behind-the-digital-prototype`).
2. Fusionner **PR #33 → main**.
3. **Activation publique distincte** : rebuild staging/prod avec `PUBLIC_BEHIND_HERO=true` uniquement après validation métier. Par défaut le site reste sur l’orbite.

## Preuves

Dossier `docs/design/behind-the-digital/v3/final-recette/` (`results.json`, captures, ce rapport).
