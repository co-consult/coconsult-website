# Corrections recette UX / UI — 18 novembre 2026

Source : rapport de recette (production du 18/11/2026).

## Traité dans cette PR

| Réf. | Action |
| --- | --- |
| ANO-01 | Menu mobile : `max-height` + scroll interne, lock du `body`, Contact en tête (CTA header + premier lien), expertises repliables, doublon FR/EN retiré du tiroir |
| ANO-03 | Cartes Collaboration : une colonne ≤1024 px ; plus de `overflow-wrap: anywhere` sur les titres |
| ANO-04 | Pastilles CII et marques SPORT/DOC : couleurs plus sombres, contraste AA |
| ANO-05 | Photos people : variantes 480/768 + WebP, `srcset`/`sizes` via `PeopleImg` |
| ANO-06 | Liens footer : zone cliquable ≥ 44 px |
| ANO-07 | Sur-titres mono : 12 px minimum sur mobile |
| ANO-08 / 5.3 | Champs requis signalés, `aria-required` / `aria-invalid` / `aria-describedby`, mention confidentialité à l’étape Coordonnées |
| ANO-09 | `Strict-Transport-Security` dans `nginx.conf` (à confirmer aussi sur NPM) |
| ANO-10 | `gzip` activé pour CSS/JS/JSON dans `nginx.conf` |
| ANO-11 | Meta `/en/industries/` ramenée sous 160 caractères |
| 5.1 / 5.2 | Libellé nav Solutions → Produits / Products ; consigne orbite « Sélectionnez » ; CTA hero pleine largeur mobile ; sous-titre secteur sur CSS Forever |

## Hors code / à traiter en ops (ANO-02)

`/api/contact` en 502 indique que le conteneur `coconsult-contact` n’est pas joignable derrière le reverse proxy (voir `compose.contact.yaml` et `docs/CONTACT_ACTIVATION.md`). Correctif : démarrer / diagnostiquer le service, logs, puis supervision de disponibilité. Le front conserve le repli messagerie.

## Non traité ici (P2 / ergonomie longue)

Allègement structurel de l’accueil mobile (~16 écrans), carrousel secteurs, header qui se masque au scroll — chantier séparé.
