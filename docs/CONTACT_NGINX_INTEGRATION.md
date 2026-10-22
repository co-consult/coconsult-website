# Raccordement Nginx → Contact (envoi toujours désactivé)

Prépare le chemin HTTP public `/api/contact` vers le processus `coconsult-contact` déjà déployé sur le VPS. `CONTACT_SEND_ENABLED` reste `false` : aucun POST Brevo, le parcours mailto reste le mode par défaut du formulaire.

Ne pas modifier Nginx Proxy Manager ni le VPS depuis cette PR. Ne pas activer Brevo.

## Chaîne de confiance IP

| Étape | Acteur | Adresse vue | Règle |
| --- | --- | --- | --- |
| 1 | Navigateur → NPM | TCP du visiteur | Un `X-Forwarded-For` navigateur n’est pas une preuve |
| 2 | NPM → `coconsult-web` | Pair `172.19.0.4` sur `proxy-network` (`172.19.0.0/16`) | NPM doit écrire l’IP visiteur dans `X-Real-IP` |
| 3 | Nginx du site | `$remote_addr` après `set_real_ip_from 172.19.0.0/16` | Pas de `172.16.0.0/12` |
| 4 | Nginx → Contact | Pair sur `10.230.22.0/24` | `X-Real-IP=$remote_addr`, `X-Forwarded-For` vidé |
| 5 | Node | `CONTACT_TRUST_CIDRS=10.230.22.0/24` | `X-Forwarded-For` jamais lu |

## Déploiement VPS (sans activer l’envoi)

Le fichier privé `compose.proxy.yaml` reste hors Git. Jenkins conserve le port public 8080. Le site reste publié en `127.0.0.1:3601`.

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build
```

Contrôles attendus (aucune clé Brevo n’est lue par ces commandes) :

```bash
curl -fsS http://127.0.0.1:3601/healthz
curl -fsS http://127.0.0.1:3601/api/contact
# → {"ok":true,"available":false}

docker inspect -f '{{json .NetworkSettings.Networks}}' coconsult-contact
# → réseaux coconsult-contact + coconsult-egress, aucun PortBindings hôte

docker inspect -f '{{json .NetworkSettings.Networks}}' coconsult-web
# → default + proxy-network + coconsult-contact (pas coconsult-egress)
```

`CONTACT_SEND_ENABLED` doit rester `false` dans `compose.contact.yaml`. `contact.env` reste privé, hors image.

## Rollback (sans arrêter les autres applications)

Retirer la route Contact du site et arrêter uniquement le processus Contact, sans `docker compose down` :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml stop coconsult-contact
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml rm -f coconsult-contact
```

Redeployer une image `coconsult-web` **sans** `location = /api/contact` (commit antérieur à cette intégration), en conservant les trois fichiers pour le rattachement réseau :

```bash
docker compose -p coconsult -f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build --no-deps coconsult-web
```

`--no-deps` ne recrée pas `coconsult-contact`. Le site revient au mailto. Ne pas toucher à Jenkins ni à Nginx Proxy Manager.

L’activation réelle de l’envoi (Brevo, pages juridiques, `CONTACT_SEND_ENABLED=true`) reste dans `docs/CONTACT_ACTIVATION.md`.
