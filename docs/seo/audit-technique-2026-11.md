# Audit SEO technique — coconsult.fr (novembre 2026)

Périmètre : site Astro en production + sources du dépôt. Aucune refonte visuelle. Aucun nouveau texte commercial non validé. Aucune page artificielle. Aucune donnée structurée trompeuse.

Méthode : lecture de `robots.txt`, `sitemap.xml`, `Base.astro`, `seo.ts`, `sitemap.ts`, `nginx.conf`, contenus FR/EN, pages Innovation / Services / Solutions / Réalisations / Contact ; sondes HTTP live (headers, 404, slash, www, gzip, OG).

## Synthèse

Le socle d’indexation est **professionnel et opérationnel** : robots, sitemap bilingue + hreflang, canoniques, meta uniques, OG/Twitter, JSON-LD non trompeurs, 404 noindex, redirections legacy relatives, `/innovation/` correctement cadrée sur l’agrément CII sans promesse d’éligibilité fiscale automatique.

Anomalies **confirmées** ci-dessous. Les correctifs de cette PR ne couvrent que les points techniques sûrs (P1 cache assets, WebSite JSON-LD, lastmod réel, og:locale:alternate).

---

## P0 — bloqueurs d’indexation

Aucun P0 confirmé.

| Contrôle | Statut live / code |
| --- | --- |
| `robots.txt` Allow + Sitemap | OK |
| `sitemap.xml` 40 URLs FR/EN, pas de 404 / design | OK |
| Canoniques absolutisées `https://coconsult.fr…` | OK |
| `hreflang` fr / en / x-default (pages + sitemap) | OK |
| 404 HTTP + `noindex` | OK |
| Slash trailing 301 relatif | OK |
| `www` / `http` → apex HTTPS | OK |

---

## P1 — à corriger (impact technique net)

### P1.1 — Cache trop court sur assets fingerprintés et polices

**Confirmé live** : `/fonts/*.woff2` et `/_astro/*.css` répondent `Cache-Control: no-cache` (`expires -1` via `location /`). Seul `/assets/` a `expires 7d`.

Impact Core Web Vitals : revalidation inutile des CSS Astro hashés et des WOFF2 à chaque visite → coût LCP / FCP répété.

Correctif PR : `location` nginx dédiés `/_astro/` et `/fonts/` avec cache long (noms hashés / immuables).

### P1.2 — Pas de nœud JSON-LD `WebSite` dédié

Home expose `Organization` + `WebPage` ; `WebSite` n’apparaît que comme `isPartOf` inline, sans `@type: WebSite` de premier niveau.

Correctif PR : ajouter `webSiteLd()` (URL, nom, langues, publisher → Organisation), émis sur la home à côté de `Organization`.

### P1.3 — Sitemap sans `lastmod`

Aucune balise `<lastmod>`. Google n’exige pas lastmod, mais une date **réelle** aide le crawl budget.

Correctif PR : dates ISO par `RouteKey` dérivées de l’historique git des templates / contenus de page (pas la date de build). Pas de lastmod inventé.

### P1.4 — Exploitation Search Console hors code

La propriété et la soumission du sitemap restent une action DNS / GSC (voir `docs/seo/SEARCH-CONSOLE.md`). Ce n’est pas un défaut de code ; classé P1 **ops**.

---

## P2 — améliorations, hors correctif commercial

### P2.1 — Maillage interne Innovation ↔ hub pages

| Page | Lien corps vers `/innovation/` | Lien footer |
| --- | --- | --- |
| Accueil | Oui (bloc CII) | Oui |
| Services (index) | Non (seulement footer) | Oui |
| Solutions | Non (seulement footer) | Oui |
| Réalisations | Non (seulement footer) | Oui |
| Contact | Non (seulement footer) | Oui |
| Innovation | Vers software / IA / modes / contact | — |

Les pages service détaillées (software, AI, cloud, cyber, dedicated, about) portent déjà des cartes « Innovation et CII ». Renforcer Solutions / Réalisations / Services index / Contact demanderait du copy validé → **reporté**, pas de carte artificielle dans cette PR.

### P2.2 — `/innovation/` vs requêtes CII

| Signal | Observation |
| --- | --- |
| Title | `Agrément CII et innovation logicielle \| Coconsult` |
| H1 | `Accompagner un projet d’innovation logicielle.` |
| Meta | Décision DRIEETS, n°, années, **ne rend pas un projet éligible** |
| Corps | Prestataire agréé, crédit d’impôt innovation, éligibilité à part |
| JSON-LD | `GovernmentPermit` n° 28910108 + disclaimer |

Cible claire pour agrément CII / prestataire agréé / innovation logicielle, **sans** affirmation d’éligibilité fiscale automatique. Option ultérieure (copy) : faire apparaître la locution exacte « prestataire agréé Crédit d’impôt innovation » dans la meta description.

### P2.3 — `og:locale:alternate` absent

Chaque page n’émet que `og:locale` de la langue courante. Correctif PR : ajouter l’alternate (`en_US` / `fr_FR`).

### P2.4 — Images décoratives en `alt=""`

Plusieurs photos « people » / hero ont `alt=""` avec `figcaption` voisin. Acceptable si purement décoratif ; revue a11y ultérieure si le figcaption doit porter le texte alternatif.

### P2.5 — Contact : outline H2 faible

Hors footer, Contact n’a qu’un H1 (formulaire). Pas bloquant pour l’indexation.

### P2.6 — OG image marque seule

`/assets/brand/og-coconsult.png` (~65 ko, 1200×630 déclarés) : correct techniquement. Évolution visuelle éventuelle hors scope.

### P2.7 — Polices non préchargées

`font-display: swap` est en place. Un `rel=preload` ciblé sur 1–2 WOFF2 critiques est optionnel (mesure Lighthouse avant ajout).

---

## Contrôles OK (non régressés)

- Titles 15–70 / descriptions 40–220, uniques (tests `static.spec.mjs`)
- Un seul H1 par page auditée
- FAQ JSON-LD uniquement quand un bloc FAQ existe (ex. QA)
- Service JSON-LD sur pages service
- BreadcrumbList hors home / 404
- GovernmentPermit **uniquement** sur Innovation, disclaimer présent
- Pas d’ISO 9001 / hasCredential inventé
- Design prototypes `noindex` / absents du build prod
- Gzip HTML actif ; `/assets/` déjà caché 7 jours

## Core Web Vitals (proxy technique, pas lab Lighthouse complet)

| Facteur | État |
| --- | --- |
| HTML gzip | OK |
| Cache `/assets/` | OK (7 j) |
| Cache `/_astro/`, `/fonts/` | **P1 — corrigé dans la PR** |
| Images work en AVIF/WebP | OK |
| Scripts home/main defer | OK |
| Mesure CrUX / PageSpeed | À lire après déploiement (hors code) |

## Décisions volontairement non prises

- Pas de nouvelles pages SEO
- Pas de FAQ inventée sur Innovation
- Pas de Claim / Offer / AggregateRating
- Pas de lastmod = date de build
- Pas de modification du discours commercial CII
