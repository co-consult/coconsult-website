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

```bash
node server/contact.mjs
```

Extrait à ajouter dans la configuration Nginx du conteneur, uniquement au moment de l’activation. Le chemin de redirection du site ne change pas et ne doit pas contenir `:8080`.

```nginx
location = /api/contact {
  proxy_pass http://127.0.0.1:3602;
  proxy_set_header Host $host;
  client_max_body_size 20k;
}
```

Le conteneur actuel est Nginx seul. Brancher ce service demande une décision d’exploitation : second processus dans l’image, ou service Compose séparé. Ne pas le faire pendant un déploiement non validé.

## Comportement

- Validation du nom, de l’e-mail, du type et de la taille du message.
- Rejet des sauts de ligne dans les champs courts.
- Destinataire imposé par `CONTACT_TO`.
- Limite de fréquence en mémoire.
- Champ leurre `website` ignoré silencieusement.
- Produit accepté : `copharia` uniquement.

## Confidentialité avant activation

Brevo deviendrait un destinataire de données de prospection. Avant d’activer la clé :

- confirmer le contrat et la localisation du traitement ;
- mettre à jour `/confidentialite/` et `/en/privacy-policy/` pour décrire le formulaire, la finalité et ce destinataire ;
- ne pas présenter l’envoi comme actif tant que cette mise à jour n’est pas publiée.

La politique actuelle dit que le site ne reçoit pas le message. Elle reste exacte tant que le service n’est pas branché.
