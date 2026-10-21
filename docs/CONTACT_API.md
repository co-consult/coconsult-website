# Envoi du formulaire de contact

Le site statique servi par Nginx n’envoie rien tant que ce service n’est pas démarré et que Nginx ne le proxifie pas. La page Contact reste utilisable : adresse visible, copie, ouverture explicite de la messagerie. Le formulaire reste masqué et aucun message de succès n’est affiché.

Ne pas modifier le VPS, Google Workspace ou Brevo sans validation explicite.

## Variables

À fournir au processus Node, jamais dans le JavaScript du navigateur ni dans Git.

- `BREVO_API_KEY` — clé API Brevo, côté serveur uniquement.
- `CONTACT_FROM` — expéditeur vérifié chez Brevo.
- `CONTACT_TO` — destinataire fixe. Défaut : `contact@coconsult.fr`.
- `CONTACT_PORT` — défaut `3602`, en écoute sur `127.0.0.1` seulement.

Sans `BREVO_API_KEY` et `CONTACT_FROM`, `GET /api/contact` répond `configured: false` et `POST` répond `503`.

## Démarrage

Le service n’est pas lancé par Docker, Compose ou l’image Nginx. Ne pas le démarrer sur le VPS tant qu’un envoi réel, la configuration d’exploitation et la mise à jour de la politique de confidentialité ne sont pas validés.

```bash
node server/contact.mjs
```

Il n’écoute que sur `127.0.0.1`. Ne pas publier le port `3602` sur l’hôte ni sur un réseau Docker accessible aux autres applications.

Nginx et Node doivent partager le même espace réseau pour que le pair soit loopback. Un second conteneur n’est pas prévu. S’il devenait nécessaire, ne pas publier son port et fixer `CONTACT_TRUST_PROXY` à l’adresse IP de Nginx, jamais à une plage ouverte.

Extrait à ajouter dans la configuration Nginx du conteneur, uniquement au moment de l’activation. Le chemin de redirection du site ne change pas et ne doit pas contenir `:8080`.

```nginx
location = /api/contact {
  proxy_pass http://127.0.0.1:3602;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For "";
  client_max_body_size 20k;
  proxy_connect_timeout 2s;
  proxy_read_timeout 10s;
  proxy_send_timeout 10s;
}
```

`X-Real-IP` doit être exactement `$remote_addr`. L’en-tête `X-Forwarded-For` du visiteur est ignoré. Sans `X-Real-IP`, toutes les requêtes loopback partagent le même quota.

## Comportement

- Le corps est rejeté à 20 Ko dès l’en-tête `Content-Length`, puis à nouveau pendant la lecture, avant d’assembler un corps plus grand.
- `GET` répond `configured: false` sans secret. Quand les deux variables sont présentes, il délivre un jeton à usage unique, lié à l’adresse du visiteur, inutilisable pendant 2 secondes.
- Le formulaire du site reste masqué tant que ce `GET` ne renvoie pas `configured: true` et un jeton.
- Validation du nom, de l’e-mail, du type et de la taille du message.
- Rejet des sauts de ligne dans les champs courts.
- Destinataire imposé par `CONTACT_TO`.
- Cinq envois par adresse et par 10 minutes. Dix jetons par adresse et par 10 minutes.
- Champ leurre `website` : réponse `200` sans envoi.
- Produit accepté : `copharia` uniquement.
- Appel Brevo limité à 8 secondes. Une erreur réseau ou une réponse non réussie devient `502`, sans reprendre le corps ni la clé.
- Une exception non prévue répond `500` et ne termine pas le processus.
- Aucune clé, aucun message et aucune adresse de visiteur ne sont écrits dans les logs.

`CONTACT_MIN_AGE_MS` existe pour les tests. Le laisser absent en production : le délai par défaut est de 2 secondes.

## Confidentialité avant activation

Brevo deviendrait un destinataire de données de prospection. Avant d’activer la clé :

- confirmer le contrat et la localisation du traitement ;
- mettre à jour `/confidentialite/` et `/en/privacy-policy/` pour décrire le formulaire, la finalité et ce destinataire ;
- ne pas présenter l’envoi comme actif tant que cette mise à jour n’est pas publiée.

La politique actuelle dit que le site ne reçoit pas le message. Elle reste exacte tant que le service n’est pas branché.
