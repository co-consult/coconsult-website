# Activation contrôlée — Behind the Digital V3

Date locale de préparation : 2026-11-04. Aucune activation publique n’a été exécutée depuis cette machine.

## Verdict

**GO conditionnel** pour activer la scène sur `coconsult-web` uniquement, après balisage de l’image actuelle et en **repassant le guide commercial** dans le même build.

Blocage réel si on reconstruit avec `PUBLIC_BEHIND_HERO=true` **sans** `PUBLIC_ASSISTANT=true` / `compose.guide.yaml` : le widget disparaît. La production publique le sert aujourd’hui.

## 1. État actuel

| Source | Observation |
| --- | --- |
| `main` HEAD | `34bd228` — merge PR #33 |
| PR #34 | merge `56b404b` (avant #33 dans l’historique) |
| PR #33 | merge `34bd228` |
| https://coconsult.fr/ | `data-behind=false`, `#systeme=true`, `data-assistant-open=true` |
| https://coconsult.fr/en/ | idem |
| https://www.coconsult.fr/ | idem (HTTPS / www OK) |
| Commit exact du conteneur VPS | non lisible depuis l’extérieur |

Le code scène est dans `main`. L’image publique sert encore l’orbite. Le guide est allumé.

## 2. Configuration de build réelle

`Dockerfile` :

```dockerfile
ARG PUBLIC_ASSISTANT=false
ENV PUBLIC_ASSISTANT=$PUBLIC_ASSISTANT
ARG PUBLIC_BEHIND_HERO=false
ENV PUBLIC_BEHIND_HERO=$PUBLIC_BEHIND_HERO
RUN npm run build
```

- `compose.yaml` : `build: .`, **aucun** `args` PUBLIC_*.
- `compose.guide.yaml` (gitignored, présent sur le VPS si le guide tourne) : `PUBLIC_ASSISTANT: "true"`.
- `compose.behind.yaml.example` : modèle pour `PUBLIC_BEHIND_HERO: "true"`.
- `compose.contact.yaml` : contact + Brevo via `contact.env` ; ne pas y toucher pour cette activation.
- Workflows CI : ne passent pas `PUBLIC_BEHIND_HERO`.

Astro sur le VPS = build Docker multi-stage → fichiers statiques dans l’image Nginx. Les flags n’existent qu’au **build**, pas au runtime du conteneur web.

## 3. Commandes adaptées (projet `coconsult`)

Répertoire VPS : `/home/ubuntu/apps/coconsult-website`.

### Avant toute reconstruction

```bash
cd /home/ubuntu/apps/coconsult-website
git status --short
test -f compose.proxy.yaml && echo "proxy ok"
test -f compose.guide.yaml && echo "guide ok"
git rev-parse HEAD
docker images --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' | grep coconsult-web
# Baliser l’image en cours pour rollback (ne retire rien) :
docker tag coconsult-web:latest coconsult-web:pre-behind-$(date +%Y%m%d%H%M)
# ou, si le tag latest pointe déjà ailleurs, noter l'IMAGE ID affiché ci-dessus.
```

### Recette isolée (recommandée avant prod)

Ne pas utiliser le projet `coconsult` ni le port 3601. Exemple local / machine de staging :

```bash
docker build -t coconsult-behind-preprod:local \
  --build-arg PUBLIC_BEHIND_HERO=true \
  --build-arg PUBLIC_ASSISTANT=true .
# Contrôle : l’index doit contenir data-behind et data-assistant-open.
```

Vérifié ici : image `coconsult-behind-preprod:local` → scène + guide ; image défaut `coconsult-orbit-preprod:local` → orbite, sans guide.

### Activation publique (uniquement après GO métier)

Conserver `compose.proxy.yaml`, `compose.guide.yaml`, `contact.env`. Ne reconstruire que le web :

```bash
cd /home/ubuntu/apps/coconsult-website
git fetch origin
git checkout main
git pull --ff-only origin main
cp compose.behind.yaml.example compose.behind.yaml   # une fois
docker compose -p coconsult \
  -f compose.yaml -f compose.proxy.yaml \
  -f compose.guide.yaml -f compose.behind.yaml \
  up -d --build --no-deps coconsult-web
curl -fsS http://127.0.0.1:3601/healthz
curl -s http://127.0.0.1:3601/ | grep -o 'data-behind\|id="systeme"\|data-assistant-open' | sort -u
curl -sI https://coconsult.fr/en | head -n 20
```

Attendu après activation : `data-behind` et `data-assistant-open` ; pas de `#systeme` sur l’accueil.

Équivalent sans fichier behind :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.guide.yaml \
  build --build-arg PUBLIC_BEHIND_HERO=true --build-arg PUBLIC_ASSISTANT=true coconsult-web
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.guide.yaml \
  up -d --no-deps coconsult-web
```

`--no-deps` : ne recrée pas `coconsult-contact`. Pas de `docker compose down`. Pas de purge de volumes. Pas d’édition de `.env` / `contact.env`.

### Interdit pour cette activation

- Rebuild `coconsult-web` avec seulement `PUBLIC_BEHIND_HERO=true` (perd le guide).
- `docker compose down`, `docker system prune`, redémarrage machine.
- Modifier NPM, Jenkins, `proxy-network`, Brevo, `contact.env`.

## 4. Résultats de recette (isolée)

Builds Astro + Docker locaux sur `main` `34bd228`. Serveurs `4180` (scène+guide) et `4181` (orbite défaut). Détail : `preprod-results.json`.

| Contrôle | Scène+guide | Orbite défaut |
| --- | --- | --- |
| Accueil FR | behind V3, assistant on | systeme, assistant off |
| Accueil EN | behind, assistant on | systeme |
| `/services/` | pas de scène | pas de scène |
| Contact formulaire | présent | présent |
| Mobile IO | pas de play à ratio ~0,32 ; play après scroll | — |
| Menu mobile | s’ouvre | — |
| Reduced-motion | settle | — |
| Clavier couches | `data` | — |
| Overflow 320/390/1440 | 0 | — |
| Erreurs JS | aucune | aucune |
| Image Docker + les deux args | behind+assistant | — |
| Image Docker sans args | — | orbite, sans assistant |

## 5. Rollback

Sans toucher contact ni proxy :

```bash
cd /home/ubuntu/apps/coconsult-website
# Option A — revenir à l’image balisée avant activation :
docker tag coconsult-web:pre-behind-YYYYMMDDHHMM coconsult-web:latest
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.guide.yaml \
  up -d --no-deps --no-build coconsult-web

# Option B — reconstruire main sans behind, en gardant le guide :
rm -f compose.behind.yaml
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.guide.yaml \
  up -d --build --no-deps coconsult-web
```

Contrôle : accueil avec `#systeme` et `data-assistant-open`, sans `data-behind`.

## 6. Synthèse GO / NO-GO

| Critère | Statut |
| --- | --- |
| Code dans `main` | OK |
| Flag défaut off | OK |
| Recette isolée scène | OK |
| Build public standard = orbite | OK |
| Guide préservé si inclus dans le build | OK |
| Risque perte du guide si oubli | **à traiter dans la commande** |
| Contact / Brevo / volumes | hors chemin `--no-deps` |
| Déploiement exécuté ici | non |

**GO** pour activation manuelle sur le VPS avec la commande qui combine `compose.guide.yaml` et `compose.behind.yaml` (ou les deux `--build-arg`), après balisage de l’image actuelle.
