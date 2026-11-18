# Audit UX/UI — coconsult.fr

Audit du site rendu en local le 4 novembre 2026, sur le build statique courant. Aucun texte, aucune métadonnée SEO et aucune fonctionnalité n’ont été modifiés. Les propositions A et B sont des surcharges CSS appliquées dans le navigateur, capturées, puis retirées. Rien n’est déployé.

Méthode : Playwright avec Chrome, 40 URL du sitemap, largeurs 390, 768 et 1440. Contraste calculé sur la couleur composée (texte et fond opaques remontés dans les parents), formule WCAG 2.x. Un texte est « grand » à partir de 24 px, ou de 18,7 px s’il est en graisse 700. Le seuil AA est alors 3:1, sinon 4,5:1. Les pseudo-éléments n’entrent pas dans ce décompte. L’opacité CSS non nulle a été recomposée à part pour les étapes désactivées du formulaire.

## 1. Cartographie

Le sitemap publie 20 routes × 2 langues, soit 40 URL. Elles passent toutes par `Base.astro` (en-tête, pied de page, lien d’évitement, focus, canonique et hreflang).

| Template | Composants | URL |
| --- | --- | --- |
| Accueil immersif | `HomeExperience` + `experience.css` | `/`, `/en/` |
| Page éditoriale | `page-hero` + `Blocks` (`band` / `band-alt` / `band-dark`) | offres, services, modes, à propos, innovation, partenariats, mentions, confidentialité, et leurs équivalents EN |
| Réalisations et solutions | même coquille éditoriale, plus grilles `work-card` / `CophariaFeature` | `/realisations/`, `/solutions/`, `/en/case-studies/`, `/en/solutions/` |
| Secteurs | `SectorExperience` dans `.experience` | `/secteurs/`, `/en/industries/` |
| Contact | `ContactWizard` dans `.experience` | `/contact/`, `/en/contact/` |

Le guide commercial n’est pas dans le build public. Il vit dans `Assistant.astro` et n’est monté que si `PUBLIC_ASSISTANT` est passé au build. Ses styles ont été lus ; le widget n’a pas été ouvert sur ces pages.

Styles partagés : `src/styles/fonts.css`, `global.css`, `experience.css`.

## 2. Design system

Couleurs, échantillonnées depuis le logo et posées dans `:root` :

| Jeton | Valeur | Rapport calculé |
| --- | --- | --- |
| `--surface-night` | `#07111c` | fond |
| `--surface-paper` | `#f4f7f8` | fond |
| `--accent-tech` | `#8ef3ff` | 14,84:1 sur la nuit |
| `--text-muted-on-night` | `#c5d2e0` | 12,36:1 sur la nuit |
| `--text-muted-on-paper` | `#3c5164` | 7,64:1 sur le papier, 8,23:1 sur le blanc |
| `--accent-tech-deep` | `#0b6f86` | 5,37:1 sur le papier, 5,78:1 sur le blanc |
| `--brand-teal` | `#026d7b` | 6,04:1 sur le blanc |
| `--brand-orange` | `#ff701b` | 2,77:1 sur le blanc |
| `--brand-green` | `#008d6a` | 4,18:1 sur le blanc |

L’orange brut et le vert brut sont trop clairs pour du petit texte sur fond clair. Le site ne les utilise pas comme couleur de texte : l’orange de marque sur papier passe par `--brand-orange-on-paper`, un mélange assombri. Aucun texte rendu n’a été mesuré dans ces deux teintes.

Typographie : Instrument Sans 400 et 600 pour le texte et les titres. IBM Plex Mono 400 pour les sourcils, numéros, pastilles et labels. Sur l’accueil à 1440 px, 42 textes sur 213 sont en mono. Parmi tous les textes de cette page : 28 à 11 px, 9 à 12 px, 21 à 13 px, 21 à 14 px. Le corps des pages éditoriales est déjà à 16 px.

Tailles écrites en dur entre 11 et 14 px : navigation 13 px, sourcil 12 px, pastilles et labels de schéma 11 px, pied de page `h2` 13 px, labels de champ 12 px, étapes du formulaire 12 px, mentions de carte 13–14 px.

### Échelle proposée

| Rôle | Actuel | Proposé |
| --- | --- | --- |
| Label mono (schéma, pastille, étape) | 11–12 px, approche 0,08–0,14 em | 13 px, approche 0,04 em |
| Navigation et liens de pied de page | 13–14 px | 15 px |
| Corps et listes | 16 px | 16 px minimum, 17 px pour les paragraphes longs |
| Chapô | 17 px | 17–18 px |
| Titre de section éditoriale | 28–40 px | inchangé |
| H1 d’accueil | environ 53–88 px | inchangé : c’est le moment de marque |

Le cyan `#8ef3ff` reste la couleur d’action, de focus et de signal. Les labels qui ne sont pas des actions passent en `#d7e4ee` sur la nuit, et en `#0b6f86` sur le papier. Le logo, les boutons primaires et l’anneau de focus gardent le cyan.

## 3. Contraste mesuré

120 passages (40 URL × 3 largeurs). Aucun texte actif, opaque, de 2 caractères ou plus, ne descend sous son seuil AA.

Les rapports les plus bas réellement rendus :

| Page | Texte | Taille | Rapport | Seuil |
| --- | --- | --- | --- | --- |
| Accueil, sourcil sur bande papier | « Réalisations », « Modes » | 12 px, mono 600 | 6,04:1 | 4,5:1 |
| QA, numéro d’étape | « 01 » | 16 px, 600 | 5,19:1 | 4,5:1 |
| Développement, liste | trois cas | 16 px | 7,01:1 | 4,5:1 |
| Développement, cartes | texte de carte | 16 px | 8,23:1 | 4,5:1 |
| Mentions légales | paragraphe | 16 px | 7,01:1 | 4,5:1 |
| Secteurs, pastille | « 08 · Santé » | 11 px, mono | 10,45:1 | 4,5:1 |
| Contact, sous-titre de choix | « Un modèle sur un processus connu. » | 14 px | 10,53:1 | 4,5:1 |
| Fil d’Ariane | « Accueil » | 13 px | 11,19:1 | 4,5:1 |

Le séparateur du fil d’Ariane (`#8eabc4`, généré en CSS) est à 7,93:1 sur la nuit. Il n’est pas un nœud de texte, il a été calculé à part.

Les étapes futures du formulaire sont des boutons `disabled` à `opacity: 0.45`. Après composition, le gris tombe à 3,33:1. WCAG 1.4.3 exempte les composants inactifs : ce n’est pas un échec AA. À l’œil, « Projet » et « Coordonnées » sont quand même les labels les plus faibles de la page. L’étape courante, en cyan plein, est à 14,84:1.

## 4. Diagnostic par template

Les captures pleine page sont dans `docs/ux/captures/`, nommées `{template}-{fr|en}-{390|768|1440}.jpg` (66 vues, plus le menu mobile). Débordement horizontal : 0 px sur les 120 passages, hors zoom.

### Accueil

Hero nuit, schéma orbital, puis une scène d’expertise très dense (pipeline, couches, étapes). Les secteurs restent en cartes nuit. Réalisations, modes et CII passent déjà au papier. Le bas de page redevient nuit.

Le confort vient de l’écart entre un H1 très grand et une couche de labels mono à 11 px, très espacés. Le contraste de ces labels est bon (souvent au-dessus de 10:1). Leur taille et la longueur des lignes dans les schémas fatiguent, surtout à 390 px où la page devient une longue colonne de pastilles.

À 200 % de zoom (`zoom` CSS dans une fenêtre de 1440 px), le document de l’accueil dépasse de 20 px (`scrollWidth` 1460). L’élément qui sort est le plateau du pipeline d’expertise (`.plate.out-plate`, bord droit à 1646 px, en partie contenu par son parent). Développement, contact et secteurs restent à 0 px de débordement dans le même essai.

`prefers-reduced-motion: reduce` : l’animation et la transition mesurées sur le premier élément animé passent à `none` et `0s`. Les règles de `global.css` et `experience.css` coupent aussi particules, tracés et translations.

### Pages éditoriales

Hero nuit court, puis bandes blanc / papier en alternance, cartes blanches, bandeau d’appel nuit, pied de page nuit. Le corps est à 16 px, entre 7:1 et 8,2:1. C’est le template le plus lisible. Anglais et français se comportent de la même façon : le texte anglais casse autrement, sans débordement mesuré.

Les liens de titre dans les cartes font environ 22 px de haut (« Développement logiciel », 189×22). Les questions de FAQ font 20 px de haut, avec 52 px d’espace jusqu’à la suivante. WCAG 2.5.8 (24 px) accepte une cible plus petite si un disque de 24 px centré sur elle ne rencontre pas une autre cible. L’écart de 52 px remplit cette exception. Ce n’est pas un échec AA. La zone cliquable reste juste le texte du titre, pas la carte entière.

### Secteurs

Même nuit que l’accueil, avec des tuiles `#102233`. Le texte des tuiles hérite du `--ink` clair redéfini dans `.experience` (`#f3f7fb`), pas du `--ink` sombre de la page. Les paragraphes de tuile sont au-dessus de 8:1. Les pastilles mono restent à 11 px. Le focus des tuiles-liens retire l’anneau global (`outline: none`) et le remplace par une bordure cyan. Les articles de la page secteurs ne sont pas dans l’ordre de tabulation.

### Contact

Hero et panneau de choix sur la même nuit. Les intitulés de choix sont grands ; les sous-titres sont à 14 px et 10,53:1. Les boutons d’étape sont à 12 px mono. Le bouton Continuer et les choix font au moins 44 px de haut. Sous le premier écran, une grande zone nuit précède la note de bas de formulaire : la page paraît vide avant le pied de page. Les champs (étape suivante) ont un label mono 12 px cyan, un texte de champ sur `#0c1c2c`, et une aide à 13 px.

Le message d’erreur est en `#ffc2a8` à 14 px. Il n’était pas visible au repos (`role="alert"` vide), donc son rapport n’a pas été mesuré sur un fond réel dans cet audit.

### Guide

Panneau `#07111c`, texte `#e7eef2`, titre et liens `#8ef3ff` (14,84:1 sur cette nuit). La mention de transparence est à `0.82rem` (environ 13 px) en `#c5d2e0` (12,36:1). Les choix et le bouton de fermeture sont à 44 px. Le widget n’est pas servi par le build public.

### Navigation, focus, mobile

À 1440 px le menu tient, liens à 13 px, couleur `#d5e4f2` (14,66:1 sur la nuit). Le bouton Contact du header est masqué sous 1240 px. À 390 px, le bouton menu fait 44×44. Les huit premiers arrêts clavier depuis l’accueil montrent un anneau `solid 3px rgb(142, 243, 255)`.

Aucune des 40 URL ne déborde à 390, 768 ou 1440.

## 5. Recommandations

1. Monter les labels mono de 11–12 px à 13 px et ramener l’approche de lettres vers 0,04 em. Priorité accueil, secteurs, étapes du contact, schémas. Le contraste est déjà suffisant : le gain est la lecture.
2. Contenir le pipeline d’expertise pour qu’un zoom à 200 % ne crée pas de défilement horizontal. Les trois autres templates testés n’ont pas ce débordement.
3. Passer la navigation et les liens du pied de page à 15 px.
4. Garder le cyan pour le bouton principal, le point de focus et le logo. Écrire les labels en `#d7e4ee` sur la nuit.
5. Laisser les pages éditoriales sur leurs bandes claires. Elles sont déjà le bon modèle de lecture longue.

## 6. Deux propositions, non déployées

Captures dans `docs/ux/proposals/`. Chaque proposition a l’accueil, la page développement et le contact, à 1440 et 390 px.

### A — Conservatrice

Mêmes fonds, même hero, mêmes cartes. Corps long à 17 px en `#24384c` sur le papier, chapô nuit en `#d7e4ee`. Labels mono à 13 px, cyan réservé à l’action. Navigation et pied de page à 15 px.

Effet : on reconnaît le site. La lecture des paragraphes et des pastilles demande moins d’effort. La marque nuit et le bouton cyan restent le signal de conversion.

### B — Hybride

Le hero, le schéma d’expertises et les bandeaux d’appel restent nuit. Les sections accueil « secteurs », « modes » et « réalisations » passent au papier `#f4f7f8`, tuiles blanches, labels `#0b6f86`. Les pages éditoriales gardent leurs bandes claires, avec un corps à 17 px.

Effet : les blocs que l’on lit (secteurs, modes, cas) rejoignent la lisibilité des pages services. L’identité sombre reste le premier écran et la fin de page. Le risque est une alternance nuit / papier plus marquée ; elle existe déjà entre le hero et les bandes blanches des pages services.

| | A | B |
| --- | --- | --- |
| Logo, URL, SEO, formulaire, FR/EN | inchangés | inchangés |
| Couleurs de fond | les mêmes | hero et schémas nuit, lectures longues claires |
| Texte | plus grand, labels moins espacés | même agrandissement, plus de surfaces papier |
| Conversion | le bouton cyan reste le seul accent fort | identique sur le hero et le bandeau final |
| Cohérence | la plus proche du site actuel | rapproche l’accueil des pages services |

A est le bon premier pas : il traite la taille sans rouvrir la charte. B se justifie si la lecture des secteurs et des modes sur l’accueil doit se rapprocher des pages d’offre. Les deux restent des prototypes de validation, avant toute PR de production.
