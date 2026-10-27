# Audit de migration SEO — coconsult.fr

Mesures du 27 octobre 2026. Les redirections décrites comme « à ajouter » sont dans la pull request de redirections, non mergée et non déployée. Le formulaire, le guide, le service contact, le DNS et Nginx Proxy Manager ne sont pas modifiés.

## Exports Search Console

Deux fichiers Excel du 27 octobre 2026 ont été lus. Leur contenu est identique : mêmes feuilles, mêmes chiffres. Feuilles présentes : Graphique, Requêtes, Pages, Pays, Appareils, Apparence dans les résultats de recherche, Filtres.

Filtres : recherche web textuelle, trois derniers mois. Le graphique couvre 92 jours, du 26 juillet 2026 au 25 octobre 2026.

Total de la propriété, identique sur le graphique, les pays et les appareils : **101 clics** et **5 948 impressions**.

Les feuilles ne s’additionnent pas entre elles.

| Feuille | Lignes | Clics | Impressions |
| --- | ---: | ---: | ---: |
| Graphique, pays, appareils | 92 jours, 112 pays, 3 appareils | 101 | 5 948 |
| Requêtes nommées | 400 | 68 | 4 178 |
| Pages | 125 | 112 | 8 029 |

La feuille Requêtes ne contient pas les requêtes que Google anonymise. 68 des 101 clics y figurent. Sur ces 68, 66 sont des requêtes de marque : `coconsult` (63 clics, 353 impressions, CTR 17,85 %, position 6,02) et `co consult` (3 clics, 49 impressions, CTR 6,12 %, position 9,55).

Pays : Tunisie 48 clics, 325 impressions, CTR 14,77 %, position 7,23. France 35 clics, 3 494 impressions, CTR 1,00 %, position 45,98. La France fournit l’essentiel des impressions, la Tunisie l’essentiel des clics.

Appareils : ordinateur 69 clics et 4 720 impressions, mobile 32 clics et 1 217 impressions, tablette 0 clic et 11 impressions.

La feuille Apparence dans les résultats de recherche ne contient aucune ligne.

Il n’y a pas d’export de liens. Une impression élevée sans clic, en position 50 à 80, n’est pas traitée comme du trafic acquis.

## Chaînes mesurées

Chaque URL de la feuille Pages a été appelée le 27 octobre 2026, avant le déploiement de cette pull request. `www` et `http://www` font un 301 vers le même chemin en `https://coconsult.fr`. Nginx applique ensuite le 301 de chemin, le 410 ou le 404. Les `Location` de chemin sont relatives. Rien ne renvoie vers `/`.

Les pages canoniques actuelles répondent 200 sur l’apex. Exemples mesurés : `/`, `/en/`, `/contact/` après le 301 d’hôte, `/services/ia-entreprise/`, `/en/services/`.

## Intention des destinations

**DataOps.** `/dataops/` fait déjà un 301 vers `/services/ia-entreprise/` (0 clic, 414 impressions, position 24,7). `/en/dataops-2/` répond 404 (0 clic, 135 impressions, position 28,34). La page d’arrivée s’intitule « Intégration d’IA générative en entreprise ». Son texte porte sur les agents, les modèles, les droits d’accès et la traçabilité. Elle ne décrit pas DataOps. Les requêtes nommées vont dans le même sens, toutes à 0 clic : `dataops` 220 impressions, position 25,72 ; `dataops consultants` 97 impressions, position 28,92 ; `cadre dataops` 78 impressions, position 27,67 ; `meilleurs consultants data ops` 26 impressions, position 8,35. Un 301 supplémentaire vers cette page enverrait une intention de conseil DataOps vers une offre d’IA générative. `/en/dataops-2/` n’est donc pas redirigée. Le 301 français déjà en production est conservé. Le contenu DataOps, s’il correspond à une offre réelle, vient avant toute nouvelle redirection.

**Externalisation.** L’article `/externalisation-it-pourquoi-cest-un-levier-strategique-pour-votre-entreprise/` est la plus forte URL hors marque de la feuille Pages : 0 clic, 877 impressions, position 64,84, aujourd’hui 404. La requête `externalisation it` fait 0 clic, 410 impressions, position 54,52. Ces deux lignes ne s’additionnent pas. `/modes-intervention/` répond à l’intention commerciale : régie, équipe dédiée, nearshore, forfait, conseil. Elle ne reprend pas le mot « externalisation » ni l’argument de baisse de coût de l’ancien article. La redirection est pertinente pour un prospect. Le libellé viendra dans la pull request éditoriale. L’article anglais `/en/offshore-outsourcing-businesses/` est absent de cet export (aucun clic ni impression sur la période). Il reste indexé d’après la recherche publique. `/en/engagement/` décrit les mêmes modes, dont le nearshore avec une société tunisienne juridiquement distincte. L’ancien texte d’offshoring n’est pas republier.

L’article santé `/externalisation-it-dans-le-secteur-de-la-sante-securiser-et-optimiser-vos-systemes/` a 1 clic, 196 impressions, position 21,82. Le slug mélange externalisation, santé et sécurité. Aucune page unique ne porte les trois. Il n’est pas redirigé.

**Cybersécurité.** `/reseau-et-securite/` est en 410 : 0 clic, 38 impressions, position 5,58. `/services/cybersecurite/` durcit les applications, les accès, les secrets et les services publiés. Elle ne propose pas de centre de surveillance. C’est l’offre de sécurité actuelle, plus étroite qu’une page « réseau ». La requête `externalisation cybersécurité` (26 impressions, position 79,85) n’est pas reliée à cette URL : l’export ne croise pas requêtes et pages. Le 410 est remplacé par un 301. Le miroir `/en/reseau-et-securite/` est absent de l’export. Il suit la même destination anglaise.

**Angular et Java.** Les 301 existants vers `/services/developpement/` sont conservés. `/angular/` : 0 clic, 90 impressions, position 38,54. `/java/` : 0 clic, 24 impressions, position 45,25. La requête `agence développement angular` : 0 clic, 79 impressions, position 38,95. Elle vise une prestation de développement, ce que la page actuelle couvre. `java consulting` : 0 clic, 12 impressions, position 73,08. Les miroirs `/en/java-2/` (4 impressions) et `/en/angular-3/` (3 impressions) ne sont pas ajoutés dans cette pull request.

## Ce que la pull request de redirections change

Statut mesuré avant déploiement, puis destination ajoutée.

| URL | Clics | Impressions | Position | Statut mesuré | Destination |
| --- | ---: | ---: | ---: | --- | --- |
| `/externalisation-it-pourquoi-cest-un-levier-strategique-pour-votre-entreprise/` | 0 | 877 | 64,84 | 404 | `/modes-intervention/` |
| `/en/nos-offres-2/` | 1 | 53 | 8,57 | 404 | `/en/services/` |
| `/en/qa-testing-2/` | 0 | 70 | 28,29 | 404 | `/en/services/qa-testing/` |
| `/en/devops-2/` | 0 | 68 | 56,84 | 404 | `/en/services/cloud-devops/` |
| `/en/retail-2/` | 0 | 62 | 38,48 | 404 | `/en/industries/` |
| `/en/telecommunication-2/` | 0 | 50 | 56,96 | 404 | `/en/industries/` |
| `/reseau-et-securite/` | 0 | 38 | 5,58 | 410 | `/services/cybersecurite/` |
| `/en/sante-2/` | 0 | 33 | 5,36 | 404 | `/en/industries/` |
| `/en/secteur-bancaire-2/` | 0 | 24 | 58 | 404 | `/en/industries/` |
| `/en/finance-2/` | 0 | 16 | 9,81 | 404 | `/en/industries/` |
| `/en/net-2/` | 0 | 10 | 18,8 | 404 | `/en/services/software-engineering/` |
| `/en/developpement-2/` | 0 | 8 | 23,5 | 404 | `/en/services/software-engineering/` |
| `/en/transport-2/` | 0 | 4 | 23 | 404 | `/en/industries/` |
| `/en/offshore-outsourcing-businesses/` | absent | absent | absent | 404, URL vue dans l’index public | `/en/engagement/` |
| `/en/reseau-et-securite/` | absent | absent | absent | 404 | `/en/services/cybersecurity/` |

Les lignes « absent » ne sont pas dans la feuille Pages. Aucun chiffre ne leur a été attribué. Les miroirs anglais reprennent la destination déjà utilisée par l’URL française équivalente, lorsque cette destination a été vérifiée. `/en/dataops-2/`, `/en/big-data-2/` et `/en/data-management-2/` ne sont pas dans cette liste.

`/angular/` et `/java/` restent sur `/services/developpement/`.

Les chemins devinés `/externalisation-it/`, `/nearshore/` et `/cybersecurite/` ne sont pas dans l’export. Ils restent en 404.

## Pull request éditoriale suivante

À traiter à part, sans redirection nouvelle tant que le texte n’existe pas :

- Un passage DataOps sur `/services/ia-entreprise/` et `/en/services/enterprise-ai/`, limité à ce qui est réellement vendu. Ensuite seulement, un 301 de `/en/dataops-2/`.
- Sur `/modes-intervention/` et `/en/engagement/`, le mot externalisation IT comme nom des modes déjà décrits (régie, équipe dédiée, nearshore), sans reprendre l’argument d’offshoring à bas coût.
- Sur `/services/developpement/`, un renvoi vers les équipes Java et Angular, sans changer les 301 `/angular/` et `/java/`.

À ne pas rediriger vers l’accueil : l’article RSE (2 clics, 494 impressions, position 50,28), son miroir anglais (42 impressions), l’article santé (1 clic, 196 impressions) et les catégories WordPress. Les fiches de rôle, `/opportunite-it/` (6 clics, 188 impressions) et les offres d’emploi restent en 410 : ce sont des visites de recrutement, pas des prospects.

## Annexe — les 125 URL de la feuille Pages

Clics, impressions, CTR et position sont ceux de l’export. Le statut est celui mesuré en production le 27 octobre 2026, avant déploiement. Les sommes de cette annexe (112 clics, 8 029 impressions) ne sont pas le total de la propriété. « Conserver la réponse 410 » sur un miroir encore en 404 signifie qu’il ne doit pas être redirigé vers une offre. Le passage de ce miroir en 410 n’est pas dans cette pull request.

| Ancienne URL | Clics | Impressions | CTR | Position | Statut actuel | Destination | Intention | Recommandation | Priorité |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| `www.coconsult.fr/` | 44 | 463 | 9,50 % | 15,12 | 301 d’hôte puis 200 | https://coconsult.fr/ | Accueil | Conserver la redirection | Haute |
| `www.coconsult.fr/en/home-english/` | 29 | 772 | 3,76 % | 8,89 | www, puis 301 | /en/ | Ancien accueil EN | Conserver la redirection | Haute |
| `www.coconsult.fr/nos-offres/` | 15 | 200 | 7,50 % | 4,63 | www, puis 301 | /services/ | Liste d’offres | Conserver la redirection | Haute |
| `www.coconsult.fr/opportunite-it/` | 6 | 188 | 3,19 % | 14,36 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Moyenne |
| `www.coconsult.fr/rse-entreprises-it-risques-et-opportunites/` | 2 | 494 | 0,40 % | 50,28 | www puis 404 | aucune | Article RSE. Aucune page actuelle | Analyser manuellement | Haute |
| `http://www.coconsult.fr/` | 2 | 305 | 0,66 % | 5,88 | 301 d’hôte puis 200 | https://coconsult.fr/ | Accueil | Conserver la redirection | Haute |
| `www.coconsult.fr/consultant/` | 2 | 96 | 2,08 % | 4,93 | www puis 410 | aucune | Fiche de rôle retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/contact/` | 1 | 212 | 0,47 % | 8,05 | 301 d’hôte puis 200 | https://coconsult.fr/contact/ | Contact actuel | Conserver la redirection | Moyenne |
| `www.coconsult.fr/experience-coconsult/` | 1 | 207 | 0,48 % | 5,53 | www puis 410 | aucune | Page retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/externalisation-it-dans-le-secteur-de-la-sante-securiser-et-optimiser-vos-systemes/` | 1 | 196 | 0,51 % | 21,82 | www puis 404 | aucune | Externalisation, santé et sécurité. Trois intentions | Analyser manuellement | Haute |
| `www.coconsult.fr/en/6-essential-steps-to-integrate-ai-into-your-mobile-app/` | 1 | 196 | 0,51 % | 31,49 | www puis 404 | aucune | Article IA. La page IA est proche, le mode d’emploi n’y est pas | Analyser manuellement | Moyenne |
| `www.coconsult.fr/en/nos-offres-2/` | 1 | 53 | 1,89 % | 8,57 | www puis 404 | /en/services/ | Liste des offres EN | Corriger la redirection | Haute |
| `www.coconsult.fr/en/secteur-publique-2/` | 1 | 49 | 2,04 % | 6,51 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `http://www.coconsult.fr/wp-content/uploads/2021/11/PFE-BOOK-5.pdf` | 1 | 45 | 2,22 % | 4,22 | www puis 410 | aucune | Fichier WordPress | Conserver la réponse 410 | Basse |
| `http://www.coconsult.fr/wp-content/uploads/2022/11/vff-2.pdf` | 1 | 31 | 3,23 % | 2,61 | www puis 410 | aucune | Fichier WordPress | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/sante/` | 1 | 20 | 5,00 % | 6,85 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/jobs/chef-de-projet-moe-confirme-h-f/` | 1 | 12 | 8,33 % | 18,75 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/jobs/expert-transverse-dora-h-f/` | 1 | 7 | 14,29 % | 6,57 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `coconsult.fr/en/` | 1 | 5 | 20,00 % | 3 | 200 | /en/ | Page actuelle | Page actuelle | Basse |
| `www.coconsult.fr/externalisation-it-pourquoi-cest-un-levier-strategique-pour-votre-entreprise/` | 0 | 877 | 0,00 % | 64,84 | www puis 404 | /modes-intervention/ | Externalisation IT, modes de collaboration | Corriger la redirection | Haute |
| `www.coconsult.fr/dataops/` | 0 | 414 | 0,00 % | 24,7 | www, puis 301 | /services/ia-entreprise/ | Data ou DataOps. La page d’arrivée parle d’IA générative | Créer un contenu de remplacement pertinent | Haute |
| `www.coconsult.fr/testing-et-assurance-qualite/` | 0 | 303 | 0,00 % | 35,59 | www, puis 301 | /services/qa-testing/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/devops/` | 0 | 254 | 0,00 % | 60,6 | www, puis 301 | /services/cloud-devops/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/telecommunication/` | 0 | 202 | 0,00 % | 37,44 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/big-data/` | 0 | 152 | 0,00 % | 42,5 | www, puis 301 | /services/ia-entreprise/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/qa-testing/` | 0 | 150 | 0,00 % | 49,94 | www, puis 301 | /services/qa-testing/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/dataops-2/` | 0 | 135 | 0,00 % | 28,34 | www puis 404 | aucune pour l’instant | DataOps ou data. La page IA ne décrit pas DataOps | Créer un contenu de remplacement pertinent | Haute |
| `www.coconsult.fr/developpement-mobile/` | 0 | 125 | 0,00 % | 64,58 | www, puis 301 | /services/developpement/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/angular/` | 0 | 90 | 0,00 % | 38,54 | www, puis 301 | /services/developpement/ | Développement. Requête dominante : agence de développement | Conserver la redirection | Haute |
| `www.coconsult.fr/en/contact-2/` | 0 | 73 | 0,00 % | 7,84 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/en/data-science-2/` | 0 | 72 | 0,00 % | 23,32 | www, puis 301 | /en/services/enterprise-ai/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/net/` | 0 | 71 | 0,00 % | 33,89 | www, puis 301 | /services/developpement/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/qa-testing-2/` | 0 | 70 | 0,00 % | 28,29 | www puis 404 | /en/services/qa-testing/ | QA | Corriger la redirection | Moyenne |
| `www.coconsult.fr/6-etapes-essentielles-pour-integrer-lia-dans-votre-application-mobile/` | 0 | 69 | 0,00 % | 24,81 | www puis 404 | aucune | Article IA. La page IA est proche, le mode d’emploi n’y est pas | Analyser manuellement | Moyenne |
| `www.coconsult.fr/en/devops-2/` | 0 | 68 | 0,00 % | 56,84 | www puis 404 | /en/services/cloud-devops/ | DevOps | Corriger la redirection | Moyenne |
| `www.coconsult.fr/product-owner/` | 0 | 66 | 0,00 % | 41,8 | www puis 410 | aucune | Fiche de rôle retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/data-management/` | 0 | 65 | 0,00 % | 59,03 | www, puis 301 | /services/ia-entreprise/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/retail-2/` | 0 | 62 | 0,00 % | 38,48 | www puis 404 | /en/industries/ | Secteur retail | Corriger la redirection | Moyenne |
| `www.coconsult.fr/data-2/` | 0 | 52 | 0,00 % | 75,54 | www, puis 301 | /services/ia-entreprise/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/telecommunication-2/` | 0 | 50 | 0,00 % | 56,96 | www puis 404 | /en/industries/ | Secteur télécoms | Corriger la redirection | Moyenne |
| `www.coconsult.fr/comment-cabinets-conseil-it-reinventent-placement-ia/` | 0 | 48 | 0,00 % | 23,08 | www puis 404 | aucune | Article IA. La page IA est proche, le mode d’emploi n’y est pas | Analyser manuellement | Moyenne |
| `www.coconsult.fr/developpement/` | 0 | 43 | 0,00 % | 15,84 | www, puis 301 | /services/developpement/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/csr-it-companies-risks-and-opportunities/` | 0 | 42 | 0,00 % | 14,19 | www puis 404 | aucune | Article RSE. Aucune page actuelle | Analyser manuellement | Basse |
| `www.coconsult.fr/en/experience-coconsult-2/` | 0 | 41 | 0,00 % | 7,56 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/entreprise-2/` | 0 | 39 | 0,00 % | 17,92 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/reseau-et-securite/` | 0 | 38 | 0,00 % | 5,58 | www puis 410 | /services/cybersecurite/ | Sécurité des applications et des accès, pas un centre de surveillance | Corriger la redirection | Moyenne |
| `www.coconsult.fr/en/data-management-2/` | 0 | 38 | 0,00 % | 40,05 | www puis 404 | aucune pour l’instant | DataOps ou data. La page IA ne décrit pas DataOps | Créer un contenu de remplacement pertinent | Haute |
| `www.coconsult.fr/node-js/` | 0 | 35 | 0,00 % | 69,83 | www, puis 301 | /services/developpement/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/data-analytics/` | 0 | 35 | 0,00 % | 91,23 | www, puis 301 | /services/ia-entreprise/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/sante-2/` | 0 | 33 | 0,00 % | 5,36 | www puis 404 | /en/industries/ | Secteur santé | Corriger la redirection | Moyenne |
| `www.coconsult.fr/en/node-js-2/` | 0 | 33 | 0,00 % | 27,18 | www, puis 301 | /en/services/software-engineering/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/consultant-2/` | 0 | 32 | 0,00 % | 3,81 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/management-2/` | 0 | 26 | 0,00 % | 10,77 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/java/` | 0 | 24 | 0,00 % | 45,25 | www, puis 301 | /services/developpement/ | Développement. Requête dominante : agence de développement | Conserver la redirection | Haute |
| `www.coconsult.fr/en/secteur-bancaire-2/` | 0 | 24 | 0,00 % | 58 | www puis 404 | /en/industries/ | Secteur banque | Corriger la redirection | Basse |
| `www.coconsult.fr/services-et-technologie/` | 0 | 23 | 0,00 % | 23,48 | www, puis 301 | /services/ | Liste d’offres | Conserver la redirection | Haute |
| `www.coconsult.fr/en/commerce-electronique-2/` | 0 | 22 | 0,00 % | 42,23 | www, puis 301 | /en/industries/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/product-owner-2/` | 0 | 20 | 0,00 % | 9,5 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/finance/` | 0 | 19 | 0,00 % | 6,63 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/nouvelles-perspectives-2/` | 0 | 19 | 0,00 % | 9,84 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/jobs/` | 0 | 18 | 0,00 % | 7,39 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/management/` | 0 | 17 | 0,00 % | 16,94 | www puis 410 | aucune | Fiche de rôle retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/infrastructure/` | 0 | 17 | 0,00 % | 23,24 | www, puis 301 | /services/cloud-devops/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/finance-2/` | 0 | 16 | 0,00 % | 9,81 | www puis 404 | /en/industries/ | Secteur finance | Corriger la redirection | Basse |
| `www.coconsult.fr/secteur-bancaire/` | 0 | 15 | 0,00 % | 6,33 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/category/externalisation-it/` | 0 | 15 | 0,00 % | 30,07 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/en/secteur-de-lenergie-2/` | 0 | 14 | 0,00 % | 13,57 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `coconsult.fr/en/services/qa-testing/` | 0 | 14 | 0,00 % | 51,71 | 200 | /en/services/qa-testing/ | Page actuelle | Page actuelle | Basse |
| `www.coconsult.fr/category/skill/` | 0 | 13 | 0,00 % | 6,62 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/transport/` | 0 | 13 | 0,00 % | 6,92 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/hotellerie-2/` | 0 | 13 | 0,00 % | 26 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/assurance-et-protection-sociale-2/` | 0 | 13 | 0,00 % | 46,92 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/category/ai/` | 0 | 11 | 0,00 % | 4,36 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/retail/` | 0 | 11 | 0,00 % | 11,36 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/react/` | 0 | 11 | 0,00 % | 35 | www, puis 301 | /services/developpement/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/en/solutions-innovantes-2/` | 0 | 10 | 0,00 % | 11 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/en/net-2/` | 0 | 10 | 0,00 % | 18,8 | www puis 404 | /en/services/software-engineering/ | Développement .NET | Corriger la redirection | Basse |
| `www.coconsult.fr/category/non-classe-fr/` | 0 | 9 | 0,00 % | 4,33 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/secteur-publique/` | 0 | 9 | 0,00 % | 31,44 | www puis 410 | aucune | Page retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/scrum-master/` | 0 | 9 | 0,00 % | 37,78 | www puis 410 | aucune | Fiche de rôle retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/developpement-2/` | 0 | 8 | 0,00 % | 23,5 | www puis 404 | /en/services/software-engineering/ | Développement | Corriger la redirection | Basse |
| `www.coconsult.fr/en/big-data-2/` | 0 | 8 | 0,00 % | 24,88 | www puis 404 | aucune pour l’instant | DataOps ou data. La page IA ne décrit pas DataOps | Créer un contenu de remplacement pertinent | Haute |
| `www.coconsult.fr/jobs/consultant-splunk-aws-administrateur-splunk-confirme-h-f/` | 0 | 8 | 0,00 % | 29,88 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/commerce-electronique/` | 0 | 8 | 0,00 % | 70,88 | www, puis 301 | /secteurs/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/data-science/` | 0 | 7 | 0,00 % | 22,43 | www, puis 301 | /services/ia-entreprise/ | Même famille d’offre | Conserver la redirection | Moyenne |
| `www.coconsult.fr/publier-une-offre-demploi/` | 0 | 7 | 0,00 % | 22,71 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/assurance-et-protection-sociale/` | 0 | 6 | 0,00 % | 16,33 | www puis 410 | aucune | Page retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/entreprise/` | 0 | 6 | 0,00 % | 18,17 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/en/opportunite-it-2/` | 0 | 6 | 0,00 % | 30,5 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/solutions-innovantes/` | 0 | 5 | 0,00 % | 4,8 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/opportunite-it/page/3/` | 0 | 5 | 0,00 % | 6 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/jobs/developpeur-full-stack-h-f/` | 0 | 5 | 0,00 % | 25 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/data/` | 0 | 5 | 0,00 % | 38,2 | www puis 404 | aucune pour l’instant | DataOps ou data. La page IA ne décrit pas DataOps | Créer un contenu de remplacement pertinent | Haute |
| `www.coconsult.fr/jobs/chef-de-projet-infrastructure-h-f/` | 0 | 5 | 0,00 % | 40,6 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/category/ai-en/` | 0 | 5 | 0,00 % | 48 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `coconsult.fr/` | 0 | 4 | 0,00 % | 21 | 200 | / | Page actuelle | Page actuelle | Basse |
| `www.coconsult.fr/en/transport-2/` | 0 | 4 | 0,00 % | 23 | www puis 404 | /en/industries/ | Secteur transport | Corriger la redirection | Basse |
| `www.coconsult.fr/en/service-delivery-management-2/` | 0 | 4 | 0,00 % | 24,75 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/java-2/` | 0 | 4 | 0,00 % | 39,5 | www puis 404 | aucune | Miroir EN de technologie. Volume faible. Cible FR conservée : développement | Analyser manuellement | Basse |
| `www.coconsult.fr/jobs/data-engineer-snowflake-audit-estimation-h-f/` | 0 | 4 | 0,00 % | 50,25 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/jobs/chef-de-projet-reseaux-industriels-h-f/` | 0 | 4 | 0,00 % | 51,5 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/numerique-impact-environnemental-solutions-web-plus-vert/` | 0 | 4 | 0,00 % | 65,5 | www puis 404 | aucune | Article RSE. Aucune page actuelle | Analyser manuellement | Basse |
| `www.coconsult.fr/business-analyst/` | 0 | 3 | 0,00 % | 2,33 | www puis 410 | aucune | Fiche de rôle retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/secteur-de-lenergie/` | 0 | 3 | 0,00 % | 4,33 | www puis 410 | aucune | Page retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/service-delivery-management/` | 0 | 3 | 0,00 % | 16 | www puis 410 | aucune | Fiche de rôle retirée | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/angular-3/` | 0 | 3 | 0,00 % | 21,33 | www puis 404 | aucune | Miroir EN de technologie. Volume faible. Cible FR conservée : développement | Analyser manuellement | Basse |
| `www.coconsult.fr/en/scrum-master-2/` | 0 | 3 | 0,00 % | 27 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/jobs/administrateur-devops-n3h-f/` | 0 | 3 | 0,00 % | 32,67 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/category/web-en/` | 0 | 3 | 0,00 % | 59,67 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `www.coconsult.fr/en/digital-environmental-impact-green-web-solutions/` | 0 | 2 | 0,00 % | 2,5 | www puis 404 | aucune | Ancienne URL sans équivalent unique | Analyser manuellement | Basse |
| `coconsult.fr/en/privacy-policy/` | 0 | 2 | 0,00 % | 4 | 200 | /en/privacy-policy/ | Page actuelle | Page actuelle | Basse |
| `www.coconsult.fr/blog/` | 0 | 2 | 0,00 % | 12,5 | www puis 410 | aucune | Blog retiré | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/category/it/` | 0 | 2 | 0,00 % | 13,5 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/jobs/concepteur-technique-talend-h-f/` | 0 | 2 | 0,00 % | 49 | www puis 410 | aucune | Recrutement, pas une offre commerciale | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/blog-2/` | 0 | 2 | 0,00 % | 62,5 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `www.coconsult.fr/en/publier-une-offre-demploi-2/` | 0 | 2 | 0,00 % | 97 | www puis 404 | aucune | Miroir d’une page FR déjà en 410 | Conserver la réponse 410 | Basse |
| `coconsult.fr/en/about/` | 0 | 1 | 0,00 % | 1 | 200 | /en/about/ | Page actuelle | Page actuelle | Basse |
| `coconsult.fr/en/services/business-automation/` | 0 | 1 | 0,00 % | 3 | 200 | /en/services/business-automation/ | Page actuelle | Page actuelle | Basse |
| `coconsult.fr/en/legal-notice/` | 0 | 1 | 0,00 % | 4 | 200 | /en/legal-notice/ | Page actuelle | Page actuelle | Basse |
| `coconsult.fr/services/ia-entreprise/` | 0 | 1 | 0,00 % | 7 | 200 | /services/ia-entreprise/ | Page actuelle | Page actuelle | Basse |
| `coconsult.fr/en/contact/` | 0 | 1 | 0,00 % | 8 | 200 | /en/contact/ | Page actuelle | Page actuelle | Basse |
| `coconsult.fr/en/services/` | 0 | 1 | 0,00 % | 10 | 200 | /en/services/ | Page actuelle | Page actuelle | Basse |
| `www.coconsult.fr/category/devops/` | 0 | 1 | 0,00 % | 27 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/category/web/` | 0 | 1 | 0,00 % | 38 | www puis 404 | aucune | Archive de catégorie WordPress | Analyser manuellement | Basse |
| `www.coconsult.fr/en/react-2/` | 0 | 1 | 0,00 % | 54 | www puis 404 | aucune | Miroir EN de technologie. Volume faible. Cible FR conservée : développement | Analyser manuellement | Basse |
