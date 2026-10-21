# Checklist de validation V1

Les mentions légales publient l’identité confirmée de COCONSULT SAS, le téléphone autorisé et le directeur de publication indiqué par la direction. Elles ne sont pas juridiquement closes : la qualité de représentant légal et le contrat d’hébergement restent à vérifier sur pièces. La politique de confidentialité ne décrit pas de transfert vers Coconsult Nearshore tant que l’accès réel n’est pas établi.

`npm run check:legal` sépare les données confirmées, les pièces à vérifier et les points RGPD. Il ne fait pas échouer la CI technique.

## Confirmé et publié

- [x] COCONSULT, SAS au capital de 1 000 €
- [x] Siège : 10 rue de Penthièvre, 75008 Paris, France
- [x] RCS Paris 838 913 838 et SIREN 838 913 838
- [x] TVA intracommunautaire FR90838913838
- [x] E-mail contact@coconsult.fr
- [x] Téléphone 06 37 19 17 97, sur les mentions légales seulement. Numéro mobile provisoire, à remplacer dans `src/data/company.ts` si un fixe est ouvert.
- [x] Directeur de la publication indiqué : Racem Smaoui
- [x] Hébergeur indiqué : OVH SAS, 2 rue Kellermann, 59100 Roubaix, France, téléphone 09 72 10 10 07
- [x] SIRET du siège conservé dans la configuration et non affiché
- [x] Coconsult Nearshore, à Sfax, présentée comme une société juridiquement distincte. Elle n’édite pas le site. Aucun lien capitalistique n’est affirmé.
- [x] Le devis, le contrat et la facture doivent identifier la société qui contracte.

## À vérifier sur pièces

- [ ] Kbis ou RNE : Racem Smaoui est-il le représentant légal de COCONSULT SAS ?
- [ ] Contrat du VPS : la société contractante est-elle OVH SAS ? Le dépôt ne contient pas ce document.

## RGPD encore à clarifier

- [ ] Accès réel de Coconsult Nearshore, ou de ses collaborateurs, aux e-mails de contact@coconsult.fr
- [ ] Accès au CRM et aux coordonnées de prospects
- [ ] Accès aux CV et informations de recrutement
- [ ] Accès aux données clients traitées pour les projets
- [ ] Si un de ces accès existe : rôle de chaque société, transfert hors EEE, et garanties appropriées. Une phrase dans la politique ne suffit pas à l’autoriser.
- [ ] Prestataire qui héberge réellement contact@coconsult.fr
- [ ] Pratique effective de conservation des e-mails, alignée sur le critère publié. Ne pas inventer de durée chiffrée.

## Si Coconsult Nearshore vend en son nom

- [ ] Mettre à jour l’éditeur, le parcours commercial et la politique de confidentialité avant d’ouvrir une prise de contact au nom de la société tunisienne.

## Informations facultatives

- [ ] DPO, seulement si une personne est réellement désignée
- [ ] URL LinkedIn officielle, après vérification. Ce n’est pas une mention légale.
- [ ] Remplacer le mobile provisoire par un numéro fixe, le moment venu

## Données commerciales à confirmer

- [ ] Nom commercial définitif de la plateforme SaaS métier
- [ ] Périmètre réel des modules Cogeex
- [ ] Autorisation de citer un client, un logo ou un chiffre
- [ ] Niveau d’anglais garanti pour une mission QA internationale
- [ ] Chevauchement horaire type avec un client aux États-Unis
- [ ] Réception effective de contact@coconsult.fr

## Technique

- [ ] `npm run check`, `npm run build`, `npm test`
- [ ] `npm run check:legal` lu, sans bloquer le build
- [ ] `HEAD /en` répond 301 avec `Location: /en/`
- [ ] Logo officiel visible sur fond clair, FR et EN
- [ ] Liens footer vers les mentions légales et la confidentialité
- [ ] `compose.proxy.yaml` du VPS inchangé
