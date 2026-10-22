# Activation du formulaire Contact

Document d’exploitation. Cette PR ne réalise aucune de ces étapes. Ne pas merger cette checklist avec un déploiement.

Le fichier privé `compose.proxy.yaml` n’est pas dans Git et ne doit pas être modifié par cette PR. Le port public 8080 reste celui de Jenkins. Le site continue d’être publié uniquement en `127.0.0.1:3601`.

## Pourquoi le service n’est pas dans compose.yaml

`compose.yaml` ne décrit que `coconsult-web`. Le workflow de validation et le déploiement actuel font :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml up -d --build
```

Ajouter le Contact à ce fichier l’aurait démarré au prochain déploiement. L’overlay `compose.contact.yaml` est donc séparé. Il n’est utilisé que par la commande d’activation ci-dessous.

`127.0.0.1` à l’intérieur de `coconsult-web` n’atteint pas un autre conteneur. Le Contact a deux réseaux, et seulement ceux-là :

- `coconsult-contact`, `internal: true`, sous-réseau `10.230.22.0/24`. `coconsult-web` est le seul autre membre. Le processus écoute `10.230.22.10:3602` sur cette interface. Nginx Proxy Manager et les autres applications du VPS ne rejoignent pas ce réseau.
- `coconsult-egress`, qui n’est pas interne. Il sert uniquement à joindre `https://api.brevo.com`. Aucun port n’est publié sur l’hôte. Ce réseau n’est pas `proxy-network`. Aucun autre service n’y est raccordé, et la communication entre conteneurs y est coupée. L’interface de sortie n’a pas de port en écoute.

`CONTACT_SEND_ENABLED` reste `false` dans cet overlay. La sortie HTTPS ne déclenche aucun envoi.

## Chaîne d’adresse IP

1. Le navigateur parle à Nginx Proxy Manager. Un `X-Forwarded-For` envoyé par le navigateur n’est pas une preuve.
2. NPM doit écraser `X-Real-IP` avec l’adresse TCP du visiteur. Cette valeur est la seule adresse client acceptée ensuite.
3. `coconsult-web` voit comme pair l’adresse de NPM, pas celle du visiteur. Le snippet `deploy/nginx.contact.conf` doit activer `set_real_ip_from` sur le réseau de NPM, puis transmettre `$remote_addr` au Contact dans `X-Real-IP`, et vider `X-Forwarded-For`.
4. Le Contact ne fait confiance à `X-Real-IP` que si le pair TCP est dans `CONTACT_TRUST_CIDRS` (`10.230.22.0/24`, le réseau privé où seul `coconsult-web` est raccordé) ou dans `CONTACT_TRUST_PROXY`.
5. Si ce pair approuvé n’envoie pas une adresse unique valide, la requête est refusée. L’adresse du proxy n’est pas utilisée comme quota partagé par tous les visiteurs.

Le CIDR réel de NPM sur le VPS doit être relevé avant d’activer `set_real_ip_from`. Ne pas le deviner dans cette PR.

## Sous-réseau `10.230.22.0/24`

`172.30.22.0/24` n’est pas retenu. Sans pool d’adresses personnalisé, Docker pose `docker0` en `172.17.0.0/16`, puis attribue les réseaux suivants en `172.18.0.0/16`, `172.19.0.0/16`, et ainsi de suite jusqu’à `172.31.0.0/16`. Un `/24` fixe dans `172.30.0.0/16` entre donc en conflit dès qu’un réseau occupe déjà ce bloc, ou quand le démon l’atteint. Ce préfixe est aussi couvert par l’exemple `172.16.0.0/12` commenté dans `deploy/nginx.contact.conf`.

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
- [ ] Publier le texte préparé dans `docs/legal/CONTACT-FORM-NOTICE-DRAFT.md` sur `/confidentialite/` et `/en/privacy-policy/`. Ne pas le publier avant : les pages actuelles disent encore, à raison, que le site ne reçoit pas le message.
- [ ] Créer `contact.env` à partir de `contact.env.example`, hors Git. Y placer `BREVO_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`.
- [ ] Dans `compose.contact.yaml`, passer `CONTACT_SEND_ENABLED` de `false` à `true`. Tant que cette ligne reste `false`, même une clé présente ne déclenche aucun envoi.
- [ ] Vérifier que `10.230.22.0/24` ne chevauche aucun réseau Docker ni aucune route de l’hôte. Sinon, déplacer le sous-réseau comme indiqué ci-dessus.
- [ ] Relever le CIDR de NPM et l’écrire dans `deploy/nginx.contact.conf` à la place de l’exemple.
- [ ] Insérer ce snippet dans la configuration Nginx du conteneur web. `nginx.conf` versionné ne contient pas cette route.
- [ ] Déployer avec les trois fichiers, sans toucher au port 8080 de l’hôte :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build
```

- [ ] Vérifier `GET http://coconsult-contact:3602/healthz` depuis le réseau interne, pas depuis Internet.
- [ ] Depuis le conteneur, sans clé, `GET https://api.brevo.com/v3/account` doit répondre 401. Ne pas appeler `POST /v3/smtp/email` pour ce contrôle, et ne pas passer `CONTACT_SEND_ENABLED` à `true` avant la décision d’envoi.
- [ ] Envoyer une demande de test vers la boîte convenue, puis vérifier qu’aucune liste marketing Brevo n’a été alimentée.
- [ ] Vérifier qu’un en-tête `X-Forwarded-For` forgé par le navigateur ne change pas le quota.

## Rollback

Le service a été créé avec les trois fichiers ensemble. `compose.contact.yaml` seul n’est pas un projet valide : il ne fait que compléter `compose.yaml` et `compose.proxy.yaml`. Les commandes de retour arrière utilisent donc la même composition.

1. Retirer le bloc `location = /api/contact` de la configuration Nginx du conteneur.
2. Arrêter et retirer seulement `coconsult-contact`, puis reconstruire le site sans le relancer :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml stop coconsult-contact
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml rm -f coconsult-contact
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build --no-deps coconsult-web
```

La dernière commande reconstruit `coconsult-web` avec les trois fichiers. Elle conserve le rattachement au réseau privé et à `proxy-network`, sans rattacher le site à `coconsult-egress`. `--no-deps` ne recrée pas `coconsult-contact` : plus aucun processus n’utilise la sortie HTTPS. Ne pas remplacer ces trois fichiers par `compose.contact.yaml` seul, et ne pas utiliser `docker compose down` : il arrêterait aussi le site.

3. Le site revient à la préparation mailto. Aucune demande nouvelle n’est reçue par le serveur.
4. Retirer `BREVO_API_KEY` du fichier d’environnement. Ne pas la committer.
5. Ne pas republier les pages juridiques « formulaire actif » si l’envoi est de nouveau coupé : revenir au texte qui décrit la messagerie.

Le conteneur Contact n’a pas de volume. L’arrêter ne supprime pas la base du site. Il ne partage pas le port 3601 ni le port 8080 de Jenkins.
