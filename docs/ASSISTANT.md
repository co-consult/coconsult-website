# Assistant Coconsult

Guide de conversation pour les visiteurs. Il présente les expertises et les réalisations publiques, pose au plus trois questions, puis propose le formulaire de contact déjà en place. Il n’envoie pas de message et ne modifie pas le formulaire.

Le guide est éteint sur le site public. Deux interrupteurs indépendants doivent rester sur `false` tant qu’une personne n’a pas validé le parcours et le traitement des données.

## Architecture

Le site Astro reste statique. Le widget n’est pas dans l’image de production : `PUBLIC_ASSISTANT` n’est pas défini dans le `Dockerfile` ni dans la CI. Sans la valeur exacte `true` au moment du build, les pages ne contiennent ni bouton ni script de conversation.

La conversation du widget, lorsqu’il est construit pour un essai local, s’exécute dans la page. Elle importe `src/assistant/guide.mjs` et `src/assistant/knowledge.mjs`. Aucune clé n’est présente dans ce code. Rien n’est écrit dans `localStorage`, `sessionStorage` ou un cookie.

Le service HTTP est séparé du site et du service de contact :

| Pièce | Rôle |
| --- | --- |
| `src/assistant/knowledge.mjs` | Pages publiques versionnées (`KNOWLEDGE_VERSION`) |
| `src/assistant/guide.mjs` | Parcours déterministe, sans appel réseau |
| `src/assistant/widget.mjs` | Fenêtre, chargé au clic |
| `server/assistant.mjs` | API, limites, garde-fou, fournisseur optionnel |
| `assistant.Dockerfile` | Image du service seul |
| `compose.assistant.yaml` | Overlay isolé, avec plafond mémoire et CPU |

`compose.yaml`, `nginx.conf`, `compose.contact.yaml`, `server/contact.mjs` et Nginx Proxy Manager ne référencent pas ce service.

Le conteneur écoute uniquement `10.230.23.10:3603` sur le réseau interne `10.230.23.0/24`. Un second réseau, `coconsult-assistant-egress`, permet une sortie HTTPS vers le fournisseur de modèle. Il ne publie pas de port hôte et interdit le trafic entre conteneurs. Le service de contact et le site n’y sont pas rattachés.

## Comportement

Le guide répond à partir des textes de `knowledge.mjs` : société, expertises, technologies publiées sur la page équipes, modes de collaboration, trois réalisations visibles (application documentaire, plateforme d’opérations sportives, COPHARIA). Les fiches non publiées ne sont pas dans cette base.

Les questions de qualification sont au nombre de trois au plus : le sujet, le mode, une phrase de contexte. Le visiteur valide le résumé. Le lien ouvre un `type` déjà géré par le formulaire (`project`, `team`, `qa`, `qa-team`, `payments`, `automation`, `ai`, `demo`). Pour COPHARIA, le lien ajoute `product=COPHARIA`. Le résumé n’est pas placé dans l’URL et n’est pas injecté dans le formulaire.

Une question hors base, un prix, une donnée personnelle ou une tentative de changer les consignes renvoie vers le formulaire. Le service ne transmet pas ces messages au fournisseur.

## Phase A et phase B

Phase A, celle du widget : parcours guidé, sans fournisseur. La phrase affichée dans la fenêtre le dit : aucun modèle externe n’est appelé, la conversation n’est pas enregistrée.

Phase B, le service : `ASSISTANT_ENABLED` doit valoir exactement `true` pour accepter un POST. `ASSISTANT_MODEL_ENABLED` doit valoir exactement `true`, avec une base `https`, un nom de modèle et une clé, pour appeler un endpoint compatible OpenAI (`/chat/completions`). Sinon le service reste sur le guide. La clé n’est lue que côté serveur. Les réponses du modèle sont rejetées si elles contiennent un téléphone, un e-mail autre que `contact@coconsult.fr`, un prix, un pourcentage, ou un nom écarté des pages publiques. L’historique envoyé est limité à six messages de 500 caractères. La sortie est plafonnée à 400 tokens. Les compteurs de débit sont en mémoire, dix minutes, huit POST par adresse, et disparaissent au redémarrage. Les textes ne sont pas écrits sur disque.

Le widget public n’appelle pas ce service. L’activer dans une page demanderait un proxy same-origin qui n’est pas installé. `deploy/nginx.assistant.conf.example` est un exemple commenté, non inclus par `nginx.conf`.

## Confidentialité

Tant que le widget n’est pas construit et que le service n’est pas démarré, aucun traitement nouveau n’a lieu.

Le widget d’essai reste dans le navigateur. Il ne demande pas de compte et refuse un e-mail ou un téléphone saisi dans la conversation. Le formulaire de contact, inchangé, reste le canal pour les données nécessaires à une prise de contact. Ses pages et sa configuration ne sont pas modifiées par cet ajout.

Le service, s’il est démarré, traite l’adresse IP du pair (ou `X-Real-IP` seulement si le pair est dans `ASSISTANT_TRUST_CIDRS`) pour le plafond de débit. Cette adresse n’est pas écrite sur disque. Elle constitue une donnée personnelle conservée au plus dix minutes en mémoire.

Appeler un fournisseur envoie le texte de la question et un extrait des pages publiques hors de l’hébergement. Cela suppose, avant toute activation :

- le nom du fournisseur, le pays de traitement et l’existence d’un contrat de sous-traitance ;
- une base légale et une information dans `/confidentialite/` et `/en/privacy-policy/` ;
- la réécriture de la phrase du widget, qui dit aujourd’hui qu’aucun modèle n’est appelé ;
- une décision explicite de publier. Cet ajout ne prend pas cette décision et ne modifie pas les pages de confidentialité.

`npm run check:legal` peut continuer d’afficher NO-GO pour des écarts déjà connus. Ce n’est pas une validation de l’assistant.

## Variables

Fichier d’exemple : `assistant.env.example`. Le fichier réel `assistant.env` est ignoré par Git. Ne pas y placer de secret dans le dépôt.

| Variable | Rôle |
| --- | --- |
| `PUBLIC_ASSISTANT` | Build du site uniquement. Absente ou différente de `true` : pas de widget. |
| `ASSISTANT_ENABLED` | `true` exact pour que le service accepte un POST. Sinon 404. |
| `ASSISTANT_MODEL_ENABLED` | `true` exact pour autoriser un appel au fournisseur. |
| `ASSISTANT_PROVIDER` | Repère d’exploitation. Le code parle à une API compatible OpenAI. |
| `ASSISTANT_API_BASE` | Origine `https` se terminant par le préfixe, par exemple `https://fournisseur.example/v1`. `http` est refusé. |
| `ASSISTANT_MODEL` | Nom de modèle transmis au fournisseur. |
| `ASSISTANT_API_KEY` | Clé serveur. Vide dans l’exemple. |
| `ASSISTANT_MAX_OUTPUT_TOKENS` | Plafond de sortie, entre 64 et 400. Défaut 400. |
| `ASSISTANT_ORIGINS` | Origines navigateur autorisées, séparées par des virgules. |
| `ASSISTANT_BIND` / `ASSISTANT_PORT` | Écoute du processus. Image : `10.230.23.10:3603`. |
| `ASSISTANT_TRUST_CIDRS` | Réseau autorisé à présenter `X-Real-IP`. Défaut d’overlay : `10.230.23.0/24`. |

Les variables du formulaire de contact ne figurent pas dans cet overlay.

## Essai local du widget

Le build ordinaire reste sans bouton. Pour un essai :

```powershell
$env:PUBLIC_ASSISTANT = 'true'
npx astro dev --host 127.0.0.1 --port 4322
```

Retirer la variable avant un build destiné au dépôt ou au VPS. `npm run build` et `npm test` se lancent sans elle.

## Déploiement du service

À ne pas lancer dans le cadre du déploiement du site. La commande du site reste celle de `docs/DEPLOYMENT.md` et ne doit pas recevoir `-f compose.assistant.yaml`.

Ne pas utiliser le projet Compose `coconsult` : un fichier unique reconcilerait le projet et pourrait retirer le conteneur du site. Ne pas modifier Nginx Proxy Manager, Jenkins, ni le service de contact. Ne pas exécuter `docker compose down` sur le projet du site.

Lorsque l’essai du service est décidé, depuis le dossier du dépôt sur la machine concernée :

```bash
docker compose -p coconsult-assistant -f compose.assistant.yaml up -d --build
docker compose -p coconsult-assistant -f compose.assistant.yaml ps
```

Le contrôle de santé interroge `http://10.230.23.10:3603/healthz` depuis le conteneur. La réponse attendue indique `enabled: false` et `model: false` tant que `assistant.env` ne contient pas les valeurs exactes `true`.

Arrêt du seul service :

```bash
docker compose -p coconsult-assistant -f compose.assistant.yaml stop
```

Limites du conteneur : 128 Mo de mémoire, 0,30 CPU, 64 processus, système de fichiers en lecture seule, utilisateur `65534`, capacités retirées, pas de port publié sur l’hôte.

## Vérifications

```bash
npm run check
npm run build
npm test
```

`npm test` couvre le parcours FR et EN, les injections, les données personnelles, le plafond de questions, le service éteint, le plafond de débit, le refus d’une base `http`, et l’absence du widget dans `dist`. Les tests Docker du contact restent indépendants : s’ils sont ignorés parce que le démon est arrêté, ils ne valident pas cet overlay.
