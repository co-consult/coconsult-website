> État antérieur. L’interrupteur actuel est `CONTACT_SEND_ENABLED` dans `contact.env`, hors Git. Voir `docs/CONTACT_ACTIVATION.md`.

# Diagnostic de la version présente sur main avant cette PR

Le formulaire V3.2 prépare un mailto. `server/contact.mjs` existe, mais Nginx ne le proxifie pas et le conteneur web est seul dans `compose.yaml`. La politique de confidentialité dit que le site ne reçoit pas le message. Cette phrase est exacte aujourd’hui.

## Risques de la version existante

- La taille du corps n’est refusée que via `Content-Length`. Un corps fragmenté est entièrement bufferisé avant le contrôle.
- Le serveur HTTP prend l’adresse du socket. Derrière Nginx Proxy Manager, cette adresse est celle du proxy : un seul quota pour tous les visiteurs, ou, si un jour `X-Forwarded-For` est recopié tel quel, une adresse forgeable par le navigateur.
- Aucun contrôle d’origine, de type de contenu, ni de jeton. Un script peut poster immédiatement.
- L’appel Brevo n’a pas de délai. Une erreur du prestataire peut remonter hors du gestionnaire HTTP, et le message interne n’est pas isolé de façon systématique.
- La présence de `BREVO_API_KEY` et `CONTACT_FROM` suffit à armer l’envoi. Il n’y a pas d’interrupteur `CONTACT_SEND_ENABLED`.
- Le message est obligatoire même pour la démonstration COPHARIA, contrairement au parcours V3.1.
- Le sujet est le jeton technique (`project`, `qaDiscuss`), pas la catégorie commerciale.
- `copharia` est accepté quel que soit le type. Les types inconnus et les mauvaises formes sont parfois convertis avec `String()`.
- La carte des compteurs n’est pas bornée.
- Le serveur écoute `127.0.0.1`. Cette adresse, dans un conteneur, n’est pas joignable depuis `coconsult-web`.
- Un double clic enverrait deux notifications dès que le service serait branché.
- Le destinataire retombe sur `contact@coconsult.fr` si `CONTACT_TO` est absent.

## Correctifs repris de la PR #3

La PR #3 (`fix/contact-service-hardening`, fermée, basée sur une branche antérieure à V3.2) n’est pas mergée. Sont repris, adaptés au parcours actuel : lecture du corps plafonnée pendant le flux, pair de confiance pour `X-Real-IP`, jeton à usage unique avec délai minimal, plafond mémoire, timeout Brevo, réponse générique sans secret, serveur HTTP qui ne laisse pas une exception devenir une fuite.

Ne sont pas repris tels quels : les sujets techniques, le message COPHARIA obligatoire, l’écoute exclusive sur `127.0.0.1`, et l’armement de l’envoi dès que la clé est présente.

## Décisions encore ouvertes

- Base juridique du formulaire.
- Durée de conservation.
- Contrat Brevo et lieu de traitement.
- Adresse expéditrice vérifiée et boîte `CONTACT_TO`.
- CIDR réel de Nginx Proxy Manager sur le VPS.
- Publication des notices `/confidentialite/` et `/en/privacy-policy/` au moment de l’activation seulement.
- Maintien du NO-GO sur le partage de prospection France–Tunisie. Aucun envoi par défaut vers Coconsult Nearshore.
