# Préparation au déploiement — OVH VPS / Nginx Proxy Manager

## Hypothèses
- Serveur Ubuntu existant avec Docker / Docker Compose.
- Un Nginx Proxy Manager existant utilise déjà les ports 80 et 443.
- Aucun changement sur les conteneurs existants n'est permis.

## Principe de déploiement (à exécuter uniquement après vérification)

1. Vérifier l'espace disque, les ressources et les ports déjà utilisés.
2. Cloner le dépôt dans un dossier dédié `/opt/coconsult-website` ou sous `/srv`.
3. `docker compose up -d --build` pour créer uniquement `coconsult-web`.
4. Tester `curl -I http://127.0.0.1:3601/` et `/en/` ainsi que `curl -f http://127.0.0.1:3601/healthz`.
5. Inspecter le réseau Docker du Nginx Proxy Manager **avant de choisir** la méthode de connexion. Un reverse proxy en conteneur ne peut pas joindre `127.0.0.1:3601` de l'hôte via son propre localhost. Soit connecter le conteneur Coconsult à un réseau partagé dédié/existant et proxyfier `coconsult-web:8080`, soit configurer explicitement un accès à l'hôte avec les restrictions réseau adaptées. Ne pas deviner un réseau.
6. Tester le nom de domaine avec l'en-tête Host et le HTTPS via Nginx Proxy Manager avant modification DNS publique.
7. Vérifier les enregistrements `A` et `AAAA` web avant bascule : un `AAAA` historique doit être remplacé ou retiré si la nouvelle infrastructure ne sert pas IPv6. **Ne pas modifier MX, SPF, DKIM, DMARC et autres enregistrements Google Workspace.**
8. Valider le contenu légal et les coordonnées avant ouverture au public.
9. Prévoir sauvegarde et rollback : conserver le hash de commit et l'image Docker précédente.

## Important

Ce guide n'exécute aucune commande sur le VPS et ne remplace pas l'inventaire préalable de Nginx Proxy Manager. Aucun port 80/443 n'est exposé par le compose fourni.
