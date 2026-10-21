# Checklist de validation V1

Les mentions légales publient les données confirmées. Elles ne sont pas juridiquement closes : le téléphone de la société, le directeur de la publication et le téléphone de l’hébergeur manquent encore. La politique de confidentialité ne chiffre pas une durée et ne tranche pas un transfert vers la Tunisie.

`npm run check:legal` liste ces lacunes. Il ne fait pas échouer la CI technique.

## Prérequis juridiques encore indispensables

- [ ] Téléphone professionnel de Coconsult, demandé puis validé. Ne pas inventer de numéro.
- [ ] Directeur de la publication. Un nom est pressenti ; ne le publier qu’après confirmation de la qualité de représentant légal (Kbis ou RNE). Le nom n’est pas affiché tant que ce point n’est pas vérifié.
- [ ] Téléphone officiel de l’hébergeur, vérifié avant publication.
- [ ] Confirmation, sur les documents du VPS, que le contrat est au nom d’OVH SAS.
- [ ] Durée chiffrée de conservation des e-mails de demande, fixée par la direction avant de l’écrire.
- [ ] Accès réel de l’équipe de Sfax aux e-mails, aux prospects ou à un CRM.
- [ ] Prestataire qui héberge réellement `contact@coconsult.fr`.

## Déjà publié, source `src/data/company.ts`

- [x] COCONSULT, SAS au capital de 1 000 €
- [x] Siège : 10 rue de Penthièvre, 75008 Paris, France
- [x] RCS Paris 838 913 838 et SIREN 838 913 838
- [x] TVA intracommunautaire FR90838913838
- [x] E-mail contact@coconsult.fr
- [x] Hébergeur indiqué : OVH SAS, 2 rue Kellermann, 59100 Roubaix, France
- [x] SIRET du siège conservé dans la configuration et non affiché

## Informations facultatives

- [ ] DPO, seulement si une personne est réellement désignée
- [ ] URL LinkedIn officielle, après vérification. Ce n’est pas une mention légale.

## Données commerciales à confirmer

- [ ] Nom commercial définitif de la plateforme SaaS métier
- [ ] Périmètre réel des modules Cogeex
- [ ] Autorisation de citer un client, un logo ou un chiffre
- [ ] Niveau d’anglais garanti pour une mission QA internationale
- [ ] Chevauchement horaire type avec un client aux États-Unis
- [ ] Réception effective de `contact@coconsult.fr`

## Technique

- [ ] `npm run check`, `npm run build`, `npm test`
- [ ] `npm run check:legal` lu, sans bloquer le build
- [ ] `HEAD /en` répond 301 avec `Location: /en/`
- [ ] Logo officiel visible sur fond clair, FR et EN
- [ ] Liens footer vers les mentions légales et la confidentialité
- [ ] `compose.proxy.yaml` du VPS inchangé
