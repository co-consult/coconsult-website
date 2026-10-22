# Google Search Console

Guide d’exploitation pour coconsult.fr. Aucune clé de vérification n’est déposée dans le site.

## Vérification DNS

1. Ouvrir Search Console sur la propriété de domaine `coconsult.fr` (propriété domaine, pas un préfixe d’URL seul).
2. Choisir la vérification par enregistrement DNS TXT.
3. Copier la valeur fournie par Google dans la zone DNS du domaine, chez le registrar qui gère `coconsult.fr`.
4. Attendre la propagation, puis lancer la vérification dans Search Console.
5. Ne pas coller cette valeur dans le code, dans une meta tag, ni dans ce dépôt.

## Sitemap

URL à soumettre : `https://coconsult.fr/sitemap.xml`

Le fichier est aussi déclaré dans `robots.txt`. Après soumission, contrôler que les URLs françaises et anglaises sont découvertes, y compris `/innovation/` et `/en/innovation/`.

## Pages à inspecter

- `/`
- `/services/developpement/`
- `/services/ia-entreprise/`
- `/services/cloud-devops/`
- `/services/equipes-dediees/`
- `/modes-intervention/`
- `/innovation/`
- `/en/services/software-engineering/`
- `/en/services/enterprise-ai/`
- `/en/services/cloud-devops/`
- `/en/services/dedicated-teams/`
- `/en/engagement/`
- `/en/innovation/`

Pour chacune : inspection de l’URL, demande d’indexation si la page est canonique et absente, puis contrôle du statut quelques jours plus tard.

## Lecture

- Indexation : pages valides, exclues, ou découvertes non indexées.
- Résultats de recherche : requêtes, impressions, clics, CTR, position moyenne, par page et par requête.
- Le formulaire de contact ne dépose pas de cookie. Les arrivées organiques sur `/contact/` et `/en/contact/` se lisent dans Search Console, pas dans un outil de conversion tiers.

## 30, 60 et 90 jours

Aucun objectif de première position.

- 30 jours : les pages ci-dessus sont-elles indexées, et quelles requêtes produisent des impressions.
- 60 jours : clics, CTR et position moyenne des pages logiciel, IA, cloud, équipes, modes et innovation.
- 90 jours : même lecture, plus les pages d’arrivée vers le contact. Ajuster un titre seulement si une requête réelle le justifie, sans créer de page artificielle.
