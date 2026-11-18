# Audit images Bing Webmaster — novembre 2026

Constat Bing : « absence d’attribut `alt` » sur `/`, `/services/`, `/services/ia-entreprise/`, `/services/automatisation/`, `/services/cloud-devops/`, `/realisations/`, `/modes-intervention/`, `/a-propos/`, `/contact/` (et `?type=ai`).

## Avant

Inspection du HTML généré (Astro `dist`) :

| Résultat | Détail |
| --- | --- |
| Attribut `alt` manquant | **0** sur les pages signalées |
| `alt=""` (vide) | **54** occurrences sur le panier FR/EN audité |
| `alt` renseigné | logos header/footer, captures CSS Forever, COPHARIA |

Bing traite souvent un `alt` vide comme une absence. Les photos « people » et certains héros/CTA étaient volontairement vides (décoratif / `aria-hidden`), ce qui déclenchait l’alerte.

## Classification

| Type | Traitement |
| --- | --- |
| Photos people (scènes de travail) | **Informatif** → description concise FR/EN du contenu visible |
| Captures produit / CSS Forever | Déjà informatif |
| Logo header / footer | Fonctionnel → `alt="Coconsult"` |
| Logo dans le sceau CII | **Décoratif** → `alt=""` (texte adjacent + `aria-label` sur l’aside) |

Aucune description n’injecte des mots-clés CII / IA / Cloud hors contenu visible.

## Après (correctifs)

Mesure sur le même panier FR/EN (build local) :

| Résultat | Détail |
| --- | --- |
| Attribut `alt` manquant | **0** |
| `alt=""` restant | **2** (logo décoratif du sceau CII, home FR + EN) |
| `alt` renseigné | **96** (dont photos people descriptives) |

Source centrale : `src/data/image-alts.ts`, branchée dans Home, Services, Modes, Cases, Contact, FinalCta, Blocks, Partnerships, Page editorial.

| Asset | Exemple FR |
| --- | --- |
| `workshop-journey.jpg` | Deux collègues pointent un graphique et des notes… |
| `engineer-focus.jpg` | Ingénieure devant deux écrans… |
| `team-standup.jpg` | Cinq collaborateurs autour d’une table… |
| `delivery-room.jpg` | Un homme et une femme examinent du code… |
| `contact-exchange.jpg` | Un homme et une femme examinent une tablette… |
| `architecture-review.jpg` | Deux hommes examinent un schéma… |
| `nearshore-pair.jpg` | Deux développeurs collaborent devant deux écrans… |
| `product-demo.jpg` | Un consultant présente un tableau de bord… |
| `project-handoff.jpg` | Remise d’un dossier et d’une clé USB… |
| `engineer-desk.jpg` | Développeur concentré devant deux écrans… |

Aussi : mid-image software pointait vers un fichier inexistant (`engineers-collab.jpg`) → remplacé par `nearshore-pair.jpg`. Figures service/CTA : `aria-hidden` retiré quand l’image devient informative.

## Tests

- `tests/static.spec.mjs` : toute `<img>` a un `alt` ; photos `/assets/people/` non vides ; pas de stuffing CII/IA/Cloud.
- `tests/e2e.spec.ts` : pages Bing + axe règle `image-alt`.

## Avertissements Bing éventuellement restants

- Le logo décoratif du sceau CII (`alt=""`) peut encore apparaître dans certains crawls Bing : **attendu** (WCAG décoratif).
- Délai de re-crawl Bing après déploiement : les alertes historiques peuvent rester affichées jusqu’à la prochaine exploration.
- `?type=ai` est la même page Contact (query) : même HTML image.
