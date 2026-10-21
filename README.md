# Coconsult — site corporate V1 (FR / EN)

Site statique bilingue de Coconsult. Le français est servi à la racine, l’anglais sous `/en/`. Astro génère les pages ; Nginx les sert sur le port interne `8080`.

## Pages

Accueil, services (équipes dédiées, QA, paiements, automatisation, IA), solutions, réalisations, à propos, partenariats, contact, mentions légales, confidentialité, et les équivalents anglais. Le détail des URL est dans `src/data/routes.ts`.

## Prévisualiser

```bash
npm ci
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Ouvrir `http://127.0.0.1:4321/` puis `http://127.0.0.1:4321/en/`.

## Modifier le contenu

- Textes des pages : `src/content/fr.ts` et `src/content/en.ts`
- Libellés d’interface : `src/content/ui.ts`
- Sujets d’e-mail : `src/data/inquiries.ts`
- Solutions et réalisations (titres, ordre, visibilité, statuts) : `src/data/work.ts`
- Faits société et champs juridiques encore vides : `src/data/company.ts`
- Routes : `src/data/routes.ts`

Une seule chaîne de build : `npm run build`. Les anciens générateurs `scripts/build.py` et le HTML de `site/` ne font plus foi.

## Tests

```bash
npm run build
npm test
```

`npm test` exécute les contrôles statiques puis Playwright (navigation, langue, menu mobile, débordement, axe). Le contrôle Docker est dans la GitHub Action. S’il n’y a pas de démon Docker local, ne pas le compter comme réussi.

## Conteneur

Le service s’appelle `coconsult-web`. Il n’écoute pas sur 80 ni 443. Sur le VPS, le port publié reste `127.0.0.1:3601:8080`. Nginx Proxy Manager joint `coconsult-web:8080` via le réseau externe décrit dans le fichier **non versionné** `compose.proxy.yaml`. Ce fichier ne doit pas être remplacé par Git. Un exemple est fourni dans `compose.proxy.example.yaml`.

Voir `docs/DEPLOYMENT.md` avant toute mise à jour du serveur.
