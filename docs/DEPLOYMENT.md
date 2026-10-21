# Déploiement V1 — VPS existant uniquement

Ce document ne doit pas être exécuté tant qu’une personne n’a pas validé la pull request. Il ne modifie pas les DNS, Google Workspace, Nginx Proxy Manager, Jenkins, ni les autres applications du VPS.

## Périmètre

- Dossier : `/home/ubuntu/apps/coconsult-website`
- Projet Compose : `coconsult`
- Conteneur : `coconsult-web`
- Port interne : `8080`
- Port hôte : `127.0.0.1:3601` uniquement
- Proxy : Nginx Proxy Manager, vers `http://coconsult-web:8080` sur le réseau Docker `proxy-network`
- Fichier d’attache réseau : `/home/ubuntu/apps/coconsult-website/compose.proxy.yaml` (présent sur le serveur, ignoré par Git, à conserver tel quel)

Le port public `8080` du VPS répond à Jenkins. Le site ne doit jamais rediriger vers ce port. Après déploiement, une requête vers `/en` sans slash doit répondre `301` avec `Location: /en/` (chemin relatif, sans hôte et sans `:8080`). Le HTTPS est terminé par Nginx Proxy Manager, pas par ce conteneur.

Jenkins exposé sur le port public `8080` est un sujet séparé. Ne pas le reconfigurer pendant le déploiement du site.

## Avant de toucher au serveur

Sur une machine de développement :

```bash
npm ci
npm run check
npm run build
npm test
```

Contrôler aussi, si Docker tourne localement :

```bash
docker compose -p coconsult -f compose.yaml up -d --build
curl -fsS http://127.0.0.1:3601/healthz
curl -sI http://127.0.0.1:3601/en
```

La ligne `Location` doit être exactement `/en/`. Arrêter ensuite seulement ce projet :

```bash
docker compose -p coconsult -f compose.yaml stop
docker compose -p coconsult -f compose.yaml rm -f
```

Ne pas lancer `docker compose down` sans nom de projet, `docker system prune`, `docker network prune`, ni un redémarrage de la machine.

## Mise à jour après merge

```bash
cd /home/ubuntu/apps/coconsult-website
git status --short
test -f compose.proxy.yaml && echo "compose.proxy.yaml conservé"
git rev-parse HEAD
git fetch origin
git checkout main
git pull --ff-only origin main
test -f compose.proxy.yaml && echo "compose.proxy.yaml toujours présent"
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml up -d --build
curl -fsS http://127.0.0.1:3601/healthz
curl -sI http://127.0.0.1:3601/en
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3601/en/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3601/services/qa-testing/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3601/en/services/qa-testing/
docker logs --tail 50 coconsult-web
```

Puis, depuis l’extérieur, sans changer NPM :

```bash
curl -sI https://coconsult.fr/en | head -n 20
curl -s -o /dev/null -w "%{http_code}\n" https://coconsult.fr/en/
curl -s -o /dev/null -w "%{http_code}\n" https://coconsult.fr/
```

`/en` doit aboutir à `/en/` en HTTPS, sans `:8080` dans `Location`. Les pages HTML canoniques restent en `https://coconsult.fr/...`.

## Rollback

Revenir au commit précédent, puis reconstruire uniquement `coconsult-web`.

```bash
cd /home/ubuntu/apps/coconsult-website
git log --oneline -5
git checkout <sha-précédent>
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml up -d --build
curl -fsS http://127.0.0.1:3601/healthz
curl -sI http://127.0.0.1:3601/en
```

Ne pas supprimer les images des autres services. Ne pas recréer `proxy-network`. Ne pas éditer le proxy host NPM pendant le rollback, sauf si la validation humaine porte explicitement sur ce proxy.

Si `compose.proxy.yaml` a été modifié par erreur, le restaurer depuis la copie que l’opérateur a prise avant le déploiement (`cp compose.proxy.yaml /tmp/compose.proxy.yaml.bak` avant le `git pull`). Git ne le versionne pas et ne doit pas l’écraser.
