# Activation du formulaire Contact

Document d’exploitation. Cette PR ne réalise aucune de ces étapes. Ne pas merger cette checklist avec un déploiement.

Le fichier privé `compose.proxy.yaml` n’est pas dans Git et ne doit pas être modifié par cette PR. Le port public 8080 reste celui de Jenkins. Le site continue d’être publié uniquement en `127.0.0.1:3601`.

## Pourquoi le service n’est pas dans compose.yaml

`compose.yaml` ne décrit que `coconsult-web`. Le workflow de validation et le déploiement actuel font :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml up -d --build
```

Ajouter le Contact à ce fichier l’aurait démarré au prochain déploiement. L’overlay `compose.contact.yaml` est donc séparé. Il n’est utilisé que par la commande d’activation ci-dessous.

`127.0.0.1` à l’intérieur de `coconsult-web` n’atteint pas un autre conteneur. Le Contact écoute sur le réseau Docker interne `coconsult-contact` (`172.30.22.0/24`, `internal: true`). Aucun port n’est publié sur l’hôte. Nginx Proxy Manager et les autres applications du VPS ne rejoignent pas ce réseau.

## Chaîne d’adresse IP

1. Le navigateur parle à Nginx Proxy Manager. Un `X-Forwarded-For` envoyé par le navigateur n’est pas une preuve.
2. NPM doit écraser `X-Real-IP` avec l’adresse TCP du visiteur. Cette valeur est la seule adresse client acceptée ensuite.
3. `coconsult-web` voit comme pair l’adresse de NPM, pas celle du visiteur. Le snippet `deploy/nginx.contact.conf` doit activer `set_real_ip_from` sur le réseau de NPM, puis transmettre `$remote_addr` au Contact dans `X-Real-IP`, et vider `X-Forwarded-For`.
4. Le Contact ne fait confiance à `X-Real-IP` que si le pair TCP est dans `CONTACT_TRUST_CIDRS` (`172.30.22.0/24`, le réseau où seul `coconsult-web` est raccordé) ou dans `CONTACT_TRUST_PROXY`.
5. Si ce pair approuvé n’envoie pas une adresse unique valide, la requête est refusée. L’adresse du proxy n’est pas utilisée comme quota partagé par tous les visiteurs.

Le CIDR réel de NPM sur le VPS doit être relevé avant d’activer `set_real_ip_from`. Ne pas le deviner dans cette PR.

## Checklist d’activation

À faire seulement après validation juridique et contractuelle.

- [ ] Confirmer le contrat Brevo, la localisation du traitement et l’adresse expéditrice vérifiée.
- [ ] Confirmer que `CONTACT_TO` est une boîte lue par des personnes habilitées de COCONSULT SAS, sans copie vers Coconsult Nearshore.
- [ ] Faire valider la base juridique et la durée de conservation.
- [ ] Publier le texte préparé dans `docs/legal/CONTACT-FORM-NOTICE-DRAFT.md` sur `/confidentialite/` et `/en/privacy-policy/`. Ne pas le publier avant : les pages actuelles disent encore, à raison, que le site ne reçoit pas le message.
- [ ] Créer `contact.env` à partir de `contact.env.example`, hors Git. Y placer `BREVO_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`.
- [ ] Dans `compose.contact.yaml`, passer `CONTACT_SEND_ENABLED` de `false` à `true`. Tant que cette ligne reste `false`, même une clé présente ne déclenche aucun envoi.
- [ ] Relever le CIDR de NPM et l’écrire dans `deploy/nginx.contact.conf` à la place de l’exemple.
- [ ] Insérer ce snippet dans la configuration Nginx du conteneur web. `nginx.conf` versionné ne contient pas cette route.
- [ ] Déployer avec les trois fichiers, sans toucher au port 8080 de l’hôte :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build
```

- [ ] Vérifier `GET http://coconsult-contact:3602/healthz` depuis le réseau interne, pas depuis Internet.
- [ ] Envoyer une demande de test vers la boîte convenue, puis vérifier qu’aucune liste marketing Brevo n’a été alimentée.
- [ ] Vérifier qu’un en-tête `X-Forwarded-For` forgé par le navigateur ne change pas le quota.

## Rollback

1. Retirer le bloc `location = /api/contact` de la configuration Nginx du conteneur et reconstruire `coconsult-web`.
2. Redéployer sans l’overlay :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml up -d --build
docker compose -p coconsult -f compose.contact.yaml stop
docker compose -p coconsult -f compose.contact.yaml rm -f
```

3. Le site revient à la préparation mailto. Aucune demande nouvelle n’est reçue par le serveur.
4. Retirer `BREVO_API_KEY` du fichier d’environnement. Ne pas la committer.
5. Ne pas republier les pages juridiques « formulaire actif » si l’envoi est de nouveau coupé : revenir au texte qui décrit la messagerie.

Le conteneur Contact n’a pas de volume. L’arrêter ne supprime pas la base du site. Il ne partage pas le port 3601 ni le port 8080 de Jenkins.
