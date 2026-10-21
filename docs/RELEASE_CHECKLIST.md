# Checklist de validation V1

Les tests techniques peuvent passer alors que la publication juridique reste ouverte. `npm run check:legal` liste les écarts et ne fait pas échouer la CI.

## Informations juridiques du site

Publiées depuis `src/data/company.ts` :

- [x] COCONSULT, SAS au capital de 1 000 €, siège parisien, RCS Paris 838 913 838, SIREN 838 913 838, TVA FR90838913838
- [x] E-mail contact@coconsult.fr
- [x] Téléphone 06 37 19 17 97, mentions légales seulement. Mobile provisoire, remplaçable dans `company.ts`
- [x] Directeur de la publication indiqué : Racem Smaoui
- [x] Hébergeur indiqué : OVH SAS, 2 rue Kellermann, 59100 Roubaix, téléphone 09 72 10 10 07
- [x] SIRET conservé en configuration, non affiché
- [x] Coconsult Nearshore, société distincte à Sfax, n’édite pas le site. Aucun lien capitalistique n’est affirmé
- [x] Le devis, le contrat et la facture identifient la société qui contracte

À vérifier sur pièces avant de considérer les mentions closes :

- [ ] Kbis ou RNE : Racem Smaoui est-il le représentant légal de COCONSULT SAS ?
- [ ] Contrat du VPS : la société contractante est-elle OVH SAS ?

## Informations RGPD publiées

- [x] COCONSULT SAS est responsable des traitements dont elle détermine les finalités et les moyens
- [x] Des commerciaux habilités de Coconsult Nearshore accèdent aux e-mails de prospection, aux fichiers de prospects ou à l’outil de suivi. Pas à toutes les boîtes
- [x] Finalités confirmées : qualification, prospection, suivi des opportunités
- [x] La Tunisie est hors EEE
- [x] Aucune clause contractuelle type n’est présentée comme signée. La page dit qu’une mention sur le site ne rend pas le transfert licite
- [x] La copie des garanties sera proposée à contact@coconsult.fr une fois le mécanisme formalisé
- [x] Aucun transfert de données de clients européens vers des développeurs de Coconsult Nearshore : ce contrat n’est pas en cours. Le développement nearshore reste une offre
- [ ] Prestataire réel de la messagerie, encore non nommé
- [ ] Pratique de conservation alignée sur le critère publié. Pas de durée chiffrée inventée
- [ ] Accès aux CV : non confirmé, donc non écrit dans la politique

## Formalités de la prospection partagée

Le GO juridique reste fermé tant que ce partage n’est pas encadré. Les pages commerciales qui présentent la capacité nearshore ne changent pas ce point.

Voir `docs/legal/FR-TN-DATA-SHARING-CHECKLIST.md`, `docs/legal/B2B-PROSPECTING-CHECKLIST.md` et `docs/legal/ACCESS-SECURITY.md`. Ces fichiers ne sont pas des pages du site.

- [ ] Qualifier le rôle de Coconsult Nearshore : sous-traitant, responsables distincts ou responsables conjoints
- [ ] Signer le contrat qui correspond à ce rôle (article 26 ou 28)
- [ ] Choisir et signer l’outil de transfert de la prospection, le cas échéant les clauses de la décision 2021/914, module 1 ou 2 selon le rôle retenu
- [ ] Réaliser l’analyse d’impact du transfert avant de s’appuyer sur ces clauses
- [ ] Relever l’immatriculation et le représentant légal de Coconsult Nearshore
- [ ] Régler l’information des prospects contactés sans avoir écrit, la liste d’opposition commune et les durées réellement appliquées
- [ ] Appliquer les mesures d’accès (comptes nominatifs, MFA, permissions, départs) seulement après validation explicite. Ne pas modifier Google Workspace, la messagerie, le CRM ni l’infrastructure depuis cette checklist

## Futurs contrats de développement, pas une obligation actuelle

- [ ] Si un client européen confie un développement qui est ensuite réalisé par Coconsult Nearshore : examiner alors l’annexe RGPD de sous-traitance ultérieure et les clauses module 3. Ne pas les rédiger avant ce contrat.

## Prérequis de mise en production

- [ ] Les deux cases « à vérifier sur pièces » des mentions sont cochées, ou le texte public est ajusté
- [ ] La direction accepte de publier la politique actuelle, qui décrit l’accès à Sfax sans garantie signée
- [ ] `npm run check`, `npm run build`, `npm test`
- [ ] `npm run check:legal` lu. Un NO-GO juridique n’est pas effacé par des tests verts
- [ ] `HEAD /en` répond 301 avec `Location: /en/`
- [ ] Logo officiel visible sur fond clair, FR et EN
- [ ] Liens footer vers les mentions légales et la confidentialité
- [ ] `compose.proxy.yaml` du VPS inchangé
- [ ] Aucun merge ni déploiement tant que cette liste n’est pas assumée

## Informations facultatives

- [ ] DPO, seulement si une personne est réellement désignée
- [ ] URL LinkedIn officielle, après vérification
- [ ] Remplacer le mobile provisoire par un numéro fixe

## Données commerciales à confirmer

- [ ] Nom commercial définitif de la plateforme SaaS métier
- [ ] Périmètre réel des modules Cogeex
- [ ] Autorisation de citer un client, un logo ou un chiffre
- [ ] Niveau d’anglais garanti pour une mission QA internationale
- [ ] Chevauchement horaire type avec un client aux États-Unis
- [ ] Réception effective de contact@coconsult.fr

## Si Coconsult Nearshore vend en son nom

- [ ] Mettre à jour l’éditeur, le parcours et la politique avant une prise de contact au nom de la société tunisienne
