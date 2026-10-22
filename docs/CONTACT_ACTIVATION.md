# Activation du formulaire Contact

Document d’exploitation pour **l’envoi réel** (Brevo). Le raccordement Nginx `/api/contact` avec `CONTACT_SEND_ENABLED=false` est décrit dans `docs/CONTACT_NGINX_INTEGRATION.md`. Cette checklist ne doit pas être confondue avec un déploiement d’intégration.

Le fichier privé `compose.proxy.yaml` n’est pas dans Git. Le port public 8080 reste celui de Jenkins. Le site continue d’être publié uniquement en `127.0.0.1:3601`.

## Pourquoi le service n’est pas dans compose.yaml

`compose.yaml` ne décrit que `coconsult-web`. Le workflow de validation et le déploiement actuel font :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml up -d --build
```

Ajouter le Contact à ce fichier l’aurait démarré au prochain déploiement. L’overlay `compose.contact.yaml` est donc séparé. Il n’est utilisé que par la commande d’activation ci-dessous.

`127.0.0.1` à l’intérieur de `coconsult-web` n’atteint pas un autre conteneur. Le Contact a deux réseaux, et seulement ceux-là :

- `coconsult-contact`, `internal: true`, sous-réseau `10.230.22.0/24`. `coconsult-web` est le seul autre membre. Le processus écoute `10.230.22.10:3602` sur cette interface. Nginx Proxy Manager et les autres applications du VPS ne rejoignent pas ce réseau.
- `coconsult-egress`, qui n’est pas interne. Il sert uniquement à joindre `https://api.brevo.com`. Aucun port n’est publié sur l’hôte. Ce réseau n’est pas `proxy-network`. Aucun autre service n’y est raccordé, et la communication entre conteneurs y est coupée. L’interface de sortie n’a pas de port en écoute.

`CONTACT_SEND_ENABLED` n’est pas dans `compose.contact.yaml`. Le bloc `environment` de Compose écrase `env_file`. Une valeur écrite dans l’overlay ignorerait `contact.env` au prochain déploiement. L’interrupteur est donc uniquement dans `contact.env`, hors Git. Sans cette variable, ou avec toute valeur autre que `true`, le processus n’envoie rien. La CI et les tests ne chargent pas `contact.env`.

## Chaîne d’adresse IP

1. Le navigateur parle à Nginx Proxy Manager. Un `X-Forwarded-For` envoyé par le navigateur n’est pas une preuve.
2. NPM doit écraser `X-Real-IP` avec l’adresse TCP du visiteur. Cette valeur est la seule adresse client acceptée ensuite.
3. `coconsult-web` voit comme pair l’adresse de NPM, pas celle du visiteur. `nginx.conf` active `set_real_ip_from 172.19.0.0/16` (réseau `proxy-network` du VPS, NPM en `172.19.0.4`), transmet `$remote_addr` au Contact dans `X-Real-IP`, et vide `X-Forwarded-For`. Ne pas élargir à `172.16.0.0/12`.
4. Le Contact ne fait confiance à `X-Real-IP` que si le pair TCP est dans `CONTACT_TRUST_CIDRS` (`10.230.22.0/24`, le réseau privé où seul `coconsult-web` est raccordé) ou dans `CONTACT_TRUST_PROXY`.
5. Si ce pair approuvé n’envoie pas une adresse unique valide, la requête est refusée. L’adresse du proxy n’est pas utilisée comme quota partagé par tous les visiteurs.

Si le CIDR de `proxy-network` change sur le VPS, mettre à jour ensemble `nginx.conf` et `deploy/nginx.contact.conf`.

## Sous-réseau `10.230.22.0/24`

`172.30.22.0/24` n’est pas retenu. Sans pool d’adresses personnalisé, Docker pose `docker0` en `172.17.0.0/16`, puis attribue les réseaux suivants en `172.18.0.0/16`, `172.19.0.0/16`, et ainsi de suite jusqu’à `172.31.0.0/16`. Un `/24` fixe dans `172.30.0.0/16` entre donc en conflit dès qu’un réseau occupe déjà ce bloc, ou quand le démon l’atteint. Ce préfixe est aussi couvert par `172.16.0.0/12`, plage trop large pour `set_real_ip_from`.

Sur la machine où ce choix a été vérifié, les réseaux Docker allaient de `172.17.0.0/16` à `172.22.0.0/16`, et la route hôte visible était `172.24.16.0/20`. Aucun ne recoupe `10.230.22.0/24`. Le VPS n’a pas été consulté : un autre hôte peut déjà utiliser ce `/24`.

Avant la première activation, relever les réseaux et les routes :

```bash
docker network inspect $(docker network ls -q) --format '{{.Name}} {{range .IPAM.Config}}{{.Subnet}}{{end}}'
ip route
```

Si `10.230.22.0/24` est déjà pris, choisir un autre `/24` libre et le reporter ensemble dans `compose.contact.yaml` (`subnet`, `ipv4_address`, `CONTACT_BIND`, `CONTACT_TRUST_CIDRS`) et dans le healthcheck. Ne pas revenir dans `172.17.0.0/16`–`172.31.0.0/16`.

## Checklist d’activation

À faire seulement après validation juridique et contractuelle.

- [ ] Confirmer le contrat Brevo, la localisation du traitement et l’adresse expéditrice vérifiée.
- [ ] Confirmer que `CONTACT_TO` est une boîte lue par des personnes habilitées de COCONSULT SAS, sans copie vers Coconsult Nearshore.
- [ ] Faire valider la base juridique et la durée de conservation.
- [ ] Les pages `/confidentialite/` et `/en/privacy-policy/` décrivent le formulaire actif et nomment Brevo comme prestataire d’acheminement. Elles prévoient 12 mois après le dernier échange pour une demande sans contrat, comme règle future après décision formalisée de COCONSULT SAS et organisation de la suppression dans la messagerie. Cette organisation n’est pas réalisée. Elles indiquent une durée cible de 6 mois pour les journaux transactionnels Brevo, qui n’est pas un réglage déjà configuré. Elles ne concluent pas que le contrat Brevo est au dossier.
- [ ] Ne pas activer de suppression sur `contact@coconsult.fr` avant le contrôle décrit à la section « Suppression dans la messagerie ».
- [ ] Créer `contact.env` à partir de `contact.env.example`, hors Git, sans écraser un fichier de production déjà en place. Y placer `BREVO_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` et, seulement pour la production, `CONTACT_SEND_ENABLED=true`.
- [ ] Ne pas remettre `CONTACT_SEND_ENABLED` dans `compose.contact.yaml`. Cette clé y écraserait `contact.env`.
- [ ] Vérifier que `10.230.22.0/24` ne chevauche aucun réseau Docker ni aucune route de l’hôte. Sinon, déplacer le sous-réseau comme indiqué ci-dessus.
- [ ] Confirmer que `set_real_ip_from` dans `nginx.conf` correspond toujours au CIDR de `proxy-network` sur le VPS (aujourd’hui `172.19.0.0/16`).
- [ ] Déployer avec les trois fichiers, sans toucher au port 8080 de l’hôte :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build
```

- [ ] Vérifier `GET http://coconsult-contact:3602/healthz` depuis le réseau interne, pas depuis Internet.
- [ ] Depuis le conteneur, sans clé, `GET https://api.brevo.com/v3/account` doit répondre 401. Ne pas appeler `POST /v3/smtp/email` pour ce contrôle.
- [ ] Avant de déployer une révision qui retire la clé du fichier Compose, vérifier que `contact.env` sur le VPS contient déjà `CONTACT_SEND_ENABLED=true`. Si le drapeau n’avait été posé que sur le conteneur en cours, l’écrire dans `contact.env` avant le `up`, sinon le recréation repart avec l’envoi coupé.
- [ ] Envoyer une demande de test vers la boîte convenue, puis vérifier qu’aucune liste marketing Brevo n’a été alimentée.
- [ ] Vérifier qu’un en-tête `X-Forwarded-For` forgé par le navigateur ne change pas le quota.

## Suppression dans la messagerie

La durée de 12 mois après le dernier échange, pour une demande commerciale sans contrat, n’est pas une règle déjà en vigueur. Elle le devient seulement après une décision formalisée de COCONSULT SAS et après que la suppression a été organisée dans la messagerie. Cette organisation n’est pas réalisée.

`contact@coconsult.fr` est aussi utilisée par CSSForever. Aucune règle de suppression ne doit être activée sans contrôle de son périmètre et de son effet rétroactif. Une règle posée sur la boîte pourrait effacer des messages qui ne viennent pas du formulaire, y compris des messages déjà présents.

Ne pas modifier CSSForever, Brevo, le VPS ni les variables d’environnement pour mettre en place cette suppression. La durée cible de 6 mois des journaux transactionnels Brevo n’est pas configurée. Ne pas l’activer depuis cette checklist.

## Déploiement de cette révision

À lancer depuis le dépôt sur le VPS, après le contrôle de `contact.env` ci-dessus. Les trois fichiers restent ceux du projet `coconsult`. Ne pas utiliser `docker compose down` : il arrêterait aussi d’autres services si le projet était plus large, et il n’est pas nécessaire. Ne pas modifier les réseaux, Jenkins, ni Nginx Proxy Manager.

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build
```

Vérifier le drapeau sans afficher la clé :

```bash
docker inspect coconsult-contact --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^CONTACT_SEND_ENABLED='
```

La valeur attendue en production est `CONTACT_SEND_ENABLED=true`. `GET /api/contact` répond alors `available: true` lorsqu’une clé et les adresses sont présentes. Un envoi réel n’est confirmé côté navigateur que si la réponse JSON contient `"accepted": true`.

## Rollback

Deux retours sont possibles. Les deux restent dans le projet `coconsult` et utilisent les trois mêmes fichiers. `compose.contact.yaml` seul n’est pas un projet valide.

### Couper l’envoi, en laissant le site et la route

Dans `contact.env` sur le VPS : `CONTACT_SEND_ENABLED=false`. Puis ne recréer que Contact :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --no-deps --force-recreate coconsult-contact
```

Le site et Nginx Proxy Manager ne sont pas reconstruits. Le formulaire revient à la préparation dans la messagerie du visiteur. Retirer `BREVO_API_KEY` du même fichier si la clé doit aussi disparaître du processus. Ne pas la committer.

### Retirer le processus Contact

Arrêter et retirer seulement `coconsult-contact`, puis reconstruire le site sans le relancer (voir aussi `docs/CONTACT_NGINX_INTEGRATION.md` si la route Nginx doit disparaître) :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml stop coconsult-contact
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml rm -f coconsult-contact
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build --no-deps coconsult-web
```

La dernière commande reconstruit `coconsult-web` avec les trois fichiers. Elle conserve le rattachement au réseau privé et à `proxy-network`, sans rattacher le site à `coconsult-egress`. `--no-deps` ne recrée pas `coconsult-contact` : plus aucun processus n’utilise la sortie HTTPS. Ne pas remplacer ces trois fichiers par `compose.contact.yaml` seul, et ne pas utiliser `docker compose down` : il arrêterait aussi le site.

Le site revient alors à la préparation dans la messagerie du visiteur. Retirer `BREVO_API_KEY` du fichier d’environnement. Ne pas la committer. Si l’envoi est de nouveau coupé, les pages juridiques ne doivent plus décrire un formulaire qui transmet la demande.

Le conteneur Contact n’a pas de volume. L’arrêter ne supprime pas la base du site. Il ne partage pas le port 3601 ni le port 8080 de Jenkins.
