# Behind the Digital — prototype

Route locale : `http://127.0.0.1:4321/design/behind-the-digital/`

Le serveur de développement doit être lancé avec `PUBLIC_DESIGN_PROTOTYPE=true`. Sans cette variable, la page n’est pas générée. Un build public ne la contient pas et le sitemap ne la liste pas. `robots` est `noindex, nofollow`. La page n’utilise pas le layout public, pour ne pas publier son JSON-LD.

La branche part de `main`. Elle ne contient pas les commits de la PR #32. L’échelle de lecture de cette PR (texte 15–17 px, IBM Plex Mono réservé aux index, cyan limité) est reprise seulement dans `behind.css`.

## Décision technique

La profondeur est faite en CSS (`perspective`, `transform`, `clip-path`) et en HTML. Pas de WebGL, pas de dépendance ajoutée, pas de vidéo externe. Une timeline `requestAnimationFrame` de 12 secondes joue l’introduction puis s’arrête. Le Digital X-Ray est un groupe de boutons radio : il fonctionne sans JavaScript. Le pointeur ne fait que préselectionner une couche, sur la scène, et seulement avec une souris fine.

Quatre couches, pas cinq : Application, Architecture, Data et IA, Cloud et qualité. Le texte parle à un décideur. La scène est illustrative. Aucun système réel n’est exécuté.

## Comparaison avec le hero publié

Le hero public n’est pas modifié. La troisième vue du prototype l’affiche dans un cadre, pour comparer. Les appels « Parlons de votre projet » et « Explorer nos expertises » restent ceux de l’accueil, en français et en anglais. Le H1 public est conservé.

## Mesures

Même Chrome, débordement horizontal (`scrollWidth - clientWidth`) :

| Situation | Débordement |
| --- | --- |
| 320, 390, 768, 1024, 1440 | 0 |
| 1440 pendant la révélation | 0 |
| 1440, zoom CSS 200 % | 0 |

Sur le serveur de développement, le prototype et l’accueil chargent tous les deux le client Vite (environ 1,8 Mo de scripts). Ce chiffre n’est pas le poids de production. Dans ce cadre : contenu interactif prêt en 225 ms pour le prototype et 187 ms pour l’accueil. CLS du prototype : 0,008. Aucune erreur JavaScript de page.

Build de production avec le drapeau : document du prototype 12,3 Ko, script de la scène 7,8 Ko, CSS de la page 10,1 Ko. L’accueil emporte un CSS d’expérience de 40,6 Ko, que cette page ne charge pas. Son document pèse 27,5 Ko. Aucune dépendance n’est ajoutée. Build public suivant, sans le drapeau : la page est absente, et `tests/static.spec.mjs` passe (40 URL, sitemap sans `/design/`).

`astro check` : 0 erreur.

## Critères

1. **WOW.** Jugement artistique, pas un test utilisateur : la séparation en escalier, dans les premières secondes, se distingue d’un schéma et d’un carrousel. L’effet n’a pas été mesuré auprès d’un public.
2. **Clarté.** La phrase finale et le texte de chaque couche disent ce que Coconsult prend en charge, sans nommer une technologie.
3. **Originalité.** Tableau de bord inventé, trajectoire lumineuse unique, pas de main, pas de tableau blanc, pas de globe, pas de logos. Aucune composition copiée sur un concurrent.
4. **Performance.** Pas de dépendance nouvelle. Débordement nul sur les largeurs demandées. CLS 0,008. L’animation ne bloque pas les appels à l’action.
5. **Accessibilité.** `prefers-reduced-motion` affiche directement l’état final. Les couches se parcourent au clavier (flèches dans le groupe radio) et l’état choisi est visible. Le mobile ne dépend pas du survol. Les explications sont dans une région `aria-live`.

## Limites

- Les couches texte sont des cartes courtes dans une scène haute, prévue pour l’application. Le vide sous la carte est large.
- Le survol révèle la couche par une fente. La sélection explicite remplace la carte entière.
- L’en-tête et le pied restent en français quand la scène passe en anglais.
- La comparaison charge l’accueil réel dans un cadre différé.
- Le prototype ne remplace pas le schéma orbital de l’accueil.
