# Envoi du formulaire de contact

Le site proxifie `GET|POST /api/contact` vers `coconsult-contact` (voir `nginx.conf` et `docs/CONTACT_NGINX_INTEGRATION.md`). Aucun envoi Brevo n’a lieu tant que `CONTACT_SEND_ENABLED` n’est pas exactement `true`.

La page Contact reste utilisable sans ce service : préparation du message, copie, Gmail, Outlook, application de messagerie. « Message envoyé » n’est jamais affiché après une simple préparation mailto.

Ne pas modifier le VPS, Google Workspace ou Brevo sans la checklist `docs/CONTACT_ACTIVATION.md`.

## API

`GET /api/contact`

Disponibilité du formulaire, sans secret et sans dire pourquoi l’envoi est fermé.

- `{ "ok": true, "available": false }` : le visiteur reste sur la préparation d’e-mail.
- `{ "ok": true, "available": true, "token": "..." }` : un jeton à usage unique, valable 30 minutes, utilisable après 2 secondes.

`POST /api/contact`

Corps JSON. Champs :

- `name` : chaîne, 2 à 120 caractères.
- `email` : adresse valide, 160 caractères maximum. Gmail, Outlook, Orange et les autres domaines sont acceptés si la syntaxe est correcte.
- `company` : chaîne facultative, 160 caractères maximum.
- `type` : `project`, `ai`, `team`, `qa`, `cloud`, `payments`, `partnership`, `other`, `demo`. Les alias historiques `qaDiscuss`, `qaTeam`, `qa-team` et `automation` sont normalisés. Toute autre valeur est refusée.
- `product` : vide, ou `copharia` seulement pour `type=demo`.
- `message` : 4000 caractères maximum. Au moins 20 caractères, sauf démonstration COPHARIA où il est facultatif.
- `locale` : `fr` ou `en`.
- `token` : jeton reçu par GET.
- `website` : champ leurre. S’il est rempli, la réponse est `{ "ok": true }` sans `accepted` et sans appel Brevo.

Une prise en charge confirmée répond `{ "ok": true, "accepted": true }`. Cela signifie que Brevo a accepté la requête transactionnelle. Cela ne prouve pas que le message est arrivé dans la boîte destinataire.

Les erreurs rendues au visiteur sont des codes stables : `invalid`, `origin`, `rate`, `size`, `type`, `method`, `unavailable`, `provider`, `uncertain`, `identity`. Le corps renvoyé par Brevo n’est jamais recopié.

`GET /healthz` sur le processus Contact, non publié par le site : `{ "ok": true }`. Ce n’est pas le `/healthz` de Nginx.

## Variables

Uniquement dans l’environnement du processus Node. Jamais dans le JavaScript du navigateur, les tests versionnés ou Git.

- `BREVO_API_KEY`
- `CONTACT_FROM` : expéditeur vérifié chez Brevo.
- `CONTACT_TO` : destinataire imposé par le serveur.
- `CONTACT_SEND_ENABLED` : absent du fichier Compose, pour ne pas écraser `contact.env`. Défaut du processus : pas d’envoi. Seule la chaîne exacte `true` active l’envoi. En production cette valeur est dans `contact.env`. La CI ne la définit pas.
- `CONTACT_ORIGINS` : origines autorisées, séparées par des virgules. Vide en local : l’origine de la requête doit être la sienne.
- `CONTACT_TRUST_PROXY` : adresses exactes des pairs autorisés à présenter `X-Real-IP`.
- `CONTACT_TRUST_CIDRS` : réseaux de ces pairs. L’overlay fixe `10.230.22.0/24`, le réseau privé partagé avec `coconsult-web`.
- `CONTACT_BIND` : défaut `127.0.0.1` hors Docker. L’overlay fixe `10.230.22.10`, l’adresse du réseau privé. Ne pas le remettre à `0.0.0.0` : l’interface de sortie vers Brevo ne doit pas écouter.
- `CONTACT_PORT` : défaut `3602`.
- `CONTACT_MIN_AGE_MS` : défaut `2000`.

`X-Forwarded-For` n’est jamais lu. Un pair non approuvé ne peut pas imposer l’adresse du visiteur. Un pair approuvé sans `X-Real-IP` valide n’est pas utilisé comme quota commun : la requête est refusée (`identity`) plutôt que regroupée avec tous les visiteurs.

## Brevo

`POST https://api.brevo.com/v3/smtp/email`

Un seul appel. Pas de nouvel essai après timeout, erreur réseau ou réponse incertaine : un second appel pourrait créer un doublon. Le timeout est de 8 secondes. Le destinataire vient de `CONTACT_TO`. `replyTo` est l’e-mail du prospect. Aucune liste marketing n’est alimentée.

Sujets :

- Projet logiciel
- Intelligence artificielle
- Équipe dédiée / nearshore
- QA / cybersécurité
- Cloud / infrastructure
- Banque et paiements
- Partenariat
- Autre demande
- Démonstration COPHARIA

## Démarrage local, sans envoi réel

```bash
node server/contact.mjs
```

Le processus écoute `127.0.0.1:3602`. Sans `CONTACT_SEND_ENABLED=true` et sans les trois variables Brevo, `available` reste faux.
