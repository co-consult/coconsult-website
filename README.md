# Coconsult — landing V0 (FR / EN)

Première version statique de présentation de Coconsult, conçue pour une mise en ligne rapide avant le site corporate complet.

## Pages
- Français : `/`
- English : `/en/`
- Contact : `mailto:contact@coconsult.fr` avec sujets adaptés

Le contenu commercial porte sur l'ingénierie logicielle, les équipes dédiées, QA/testing, les paiements et l'automatisation métier. Aucune démonstration de produit, aucune donnée client et aucun service de collecte de données ne sont inclus dans cette V0.

## Prévisualiser

```bash
cd site
python3 -m http.server 8000
# Ouvrir http://localhost:8000/ puis http://localhost:8000/en/
```

## Modifier le texte

Le contenu FR/EN est dans `scripts/build.py`. Après modification :

```bash
python3 scripts/build.py
python3 scripts/check.py
```

Les sorties `site/index.html` et `site/en/index.html` sont versionnées pour servir immédiatement la V0 sans outil de build sur le serveur.

## Tester le conteneur (local)

```bash
docker compose up -d --build
curl -f http://127.0.0.1:3601/healthz
curl -f http://127.0.0.1:3601/
curl -f http://127.0.0.1:3601/en/
```

Le service écoute uniquement sur `127.0.0.1:3601` de la machine Docker, pas sur les ports 80/443. Pour le brancher à Nginx Proxy Manager existant, voir `docs/DEPLOYMENT.md`. Ne pas basculer les DNS avant les vérifications HTTPS.

## Sécurité et limites
- Dépôt sans secrets : ne jamais committer `.env`, clés API ou informations clients.
- Le repo est actuellement **public** : seules des informations publiques y ont leur place.
- Logo/wordmark temporaire : remplacer par la charte officielle après validation.
- Pas de formulaire backend ; les CTA ouvrent l'application de messagerie du visiteur.
- Les mentions légales et la politique de confidentialité restent à valider et à publier avant une mise en ligne corporate définitive.
- Cette V0 est volontairement un site **HTML/CSS/JS statique**, sans Astro : migration vers Astro envisagée en V1 lorsque les contenus et pages supplémentaires seront prêts.

## Roadmap
- Valider textes, logo et coordonnées.
- Ajouter pages légales FR/EN et contact amélioré.
- Ajouter page QA/dedicated teams pour les prospects internationaux.
- Développer pages services, réalisations et démos autorisées.
- Ajouter un système de suivi des conversions conforme au RGPD seulement si nécessaire.
