# Partage de données France–Tunisie

Document interne. Il n’est pas publié sur coconsult.fr. Cette checklist ne constitue pas un contrat signé et ne remplace pas la revue d’un juriste compétent.

Les obligations actuelles portent sur la prospection commerciale partagée entre COCONSULT SAS et Coconsult Nearshore. Le développement nearshore reste une offre. Aucun contrat avec un client européen n’est aujourd’hui suivi d’une sous-traitance de développement vers la Tunisie.

Source des faits côté site : `src/data/company.ts`. Ne pas y marquer un accord, des clauses ou une analyse d’impact comme faits tant qu’un document signé n’est pas au dossier.

## 1. Identité des deux sociétés

**COCONSULT SAS** (France), éditrice de coconsult.fr.

- SAS au capital de 1 000 €
- Siège : 10 rue de Penthièvre, 75008 Paris, France
- RCS Paris 838 913 838, SIREN 838 913 838
- TVA FR90838913838
- contact@coconsult.fr
- Directeur de la publication indiqué : Racem Smaoui. Sa qualité de représentant légal reste à confirmer sur le Kbis ou le RNE.

**Coconsult Nearshore** (Tunisie), société juridiquement distincte, dirigeants différents.

- Siège opérationnel indiqué : Sfax, Tunisie
- N’édite pas coconsult.fr
- Forme, immatriculation, identifiant fiscal et représentant légal : à relever sur le registre tunisien. Ne pas les inventer.

Aucun lien capitalistique n’est affirmé.

## 2. Catégories de données échangées

Confirmé pour les commerciaux habilités de Coconsult Nearshore :

- e-mails de prospection professionnelle, les mêmes que ceux utilisés par Coconsult France ;
- fichiers de prospects ;
- suivi commercial, fichiers ou outil, sans nom de produit confirmé.

Cet accès ne couvre pas toutes les boîtes de messagerie.

Confirmé comme absent :

- données de clients européens transmises à des développeurs de Coconsult Nearshore parce qu’un contrat français aurait été sous-traité en Tunisie. Ce scénario n’est pas en cours.

Non confirmé, donc hors du texte public :

- CV et informations de recrutement.

## 3. Systèmes concernés

- Messagerie utilisée pour la prospection et pour contact@coconsult.fr. Le prestataire n’est pas nommé dans le dépôt.
- Fichiers de prospects et outil de suivi commercial, produit non identifié.
- Journaux techniques du site, tenus par le serveur et OVH, distincts de la prospection.

Ne pas modifier les comptes, la messagerie, les droits de l’outil commercial ni l’infrastructure au seul vu de cette checklist. Google Workspace, s’il est en place, ne doit pas être tenu pour le prestataire confirmé de contact@coconsult.fr tant que le contrat de messagerie n’est pas produit, et ne doit pas être modifié sans validation explicite.

## 4. Finalités et destinataires

Finalités confirmées : qualification des demandes, prospection professionnelle, suivi des opportunités commerciales.

Destinataires confirmés : personnes habilitées de COCONSULT SAS, et commerciaux habilités de Coconsult Nearshore à Sfax.

La Tunisie est hors de l’Espace économique européen. Les pages du site sont hébergées en France par OVH SAS.

## 5. Rôles possibles

Trois qualifications restent ouvertes pour le fichier de prospection. Aucune n’est retenue. Elles ne décrivent pas une sous-traitance de développement, qui n’est pas en cours.

- **Sous-traitant** (article 28) : Nearshore traite pour le compte de COCONSULT SAS, sur instruction documentée, sans déterminer les finalités.
- **Responsables distincts** : chaque société détermine ses propres finalités sur les prospects auxquels elle a accès.
- **Responsables conjoints** (article 26) : les deux sociétés déterminent ensemble les finalités et les moyens du fichier de prospection.

## 6. Critères pour choisir le rôle réel

Répondre sur les faits, pas sur l’organigramme commercial.

- Qui décide de prospecter, qui choisit les listes, qui fixe la durée de conservation et qui tranche une opposition ?
- Nearshore peut-elle utiliser les mêmes prospects pour son propre développement, ou seulement pour des opportunités de la SAS française ?
- Les moyens (boîte partagée, fichier, outil) sont-ils imposés par la SAS française ?
- Les dirigeants sont différents. Un accès partagé ne suffit pas à faire de Nearshore un service interne, ni un sous-traitant, ni un responsable conjoint.

Si Nearshore ne fait qu’exécuter des instructions écrites de la SAS française, le rôle de sous-traitant devient plausible. Si elle décide de ses propres campagnes, le rôle de responsable distinct devient plausible. Si les décisions de finalité et de moyens sont prises ensemble, le rôle conjoint devient plausible. La qualification est à faire valider par un juriste.

## 7. Contrat RGPD selon le rôle

- Sous-traitant : contrat article 28, avec l’objet, la durée, la nature, les finalités, les catégories de données et de personnes, les obligations et les droits du responsable.
- Responsables distincts : pas d’accord article 28. Chaque responsable informe les personnes pour ses propres traitements (articles 13 et 14). Les transmissions entre responsables se documentent.
- Responsables conjoints : accord article 26 qui répartit les obligations, en particulier l’information et l’exercice des droits. L’essentiel de cet accord est mis à disposition des personnes.

Aucun de ces contrats n’est signé à ce jour (`sharingAgreementSigned: false`).

## 8. Clauses contractuelles types selon le rôle

Outil visé : clauses de la décision d’exécution (UE) 2021/914 de la Commission, seulement s’il est choisi. Elles ne sont pas signées (`sccSigned: false`).

Pour le partage de prospection, selon le rôle qui sera retenu :

- Responsable vers responsable : module 1.
- Responsable vers sous-traitant : module 2.

Le module 3 et l’annexe de sous-traitance ultérieure sont traités plus bas. Ils ne sont pas des outils du partage actuel.

Un accord article 26 ne dispense pas d’un outil de transfert du chapitre V pour l’accès depuis la Tunisie. Les dérogations de l’article 49 ne sont pas une base durable pour un accès systématique de prospection.

Avant de citer une décision d’adéquation, relire la liste en vigueur de la Commission. Ne pas considérer qu’elle couvre la Tunisie sans cette relecture.

## 9. Analyse d’impact du transfert

Une analyse d’impact du transfert (AITD, ou TIA dans les lignes directrices du CEPD 05/2021) est nécessaire avant de s’appuyer sur des clauses contractuelles types. Elle décrit le transfert, le droit tunisien applicable aux données, et si les clauses peuvent être respectées dans la pratique.

Elle n’est pas faite (`tiaCompleted: false`). Guides CNIL sur les transferts et l’AITD à utiliser pour la méthode, avec le chapitre V du RGPD (articles 44 à 49).

## 10. Sécurité et garanties complémentaires

Les mesures minimales sont dans `docs/legal/ACCESS-SECURITY.md`. Si l’AITD montre que les clauses ne suffisent pas, des mesures supplémentaires sont à décider (chiffrement, limitation des exports, accès nominatifs, journalisation) avant de maintenir l’accès. Ne pas les déclarer en place tant qu’elles ne sont pas vérifiées.

## 11. Incident et demandes RGPD

À répartir dans le contrat, selon le rôle retenu :

- qui informe la personne et qui répond à une demande d’accès, de rectification, d’effacement, d’opposition, de limitation ou de portabilité ;
- qui notifie une violation à l’autorité et, s’il y a lieu, aux personnes (délai de 72 heures pour la notification à l’autorité lorsque l’article 33 s’applique) ;
- comment Nearshore alerte la SAS française, et inversement, avec un délai interne plus court que le délai légal ;
- qui tient le registre et les preuves de suppression.

Tant que le contrat n’existe pas, COCONSULT SAS répond aux demandes adressées à contact@coconsult.fr dans le délai d’un mois, y compris lorsque la demande concerne des données auxquelles Sfax a accès.

## 12. Signatures et validations

- Représentant légal de COCONSULT SAS, après vérification du Kbis ou du RNE.
- Représentant légal de Coconsult Nearshore, après relevé du registre tunisien.
- Revue d’un juriste compétent sur le rôle, le contrat et les clauses.
- Validation interne de l’AITD avant toute affirmation publique de garanties.
- Mise à jour de `/confidentialite/` et `/en/privacy-policy/` seulement après signature, pour nommer le mécanisme et le moyen d’en obtenir copie.

## Pour de futurs contrats seulement

À examiner lorsque les traitements réels le justifieront. Rien de cette section n’est à signer ni à publier aujourd’hui.

Le jour où Coconsult France conclura avec un client européen un contrat dont le développement sera confié à Coconsult Nearshore, revoir :

- l’annexe RGPD de sous-traitance ultérieure (article 28, paragraphes 2 et 4), si le sous-traitant recourt lui-même à un autre sous-traitant ;
- les clauses contractuelles types module 3 de la décision 2021/914 (sous-traitant vers sous-traitant), si cette chaîne comporte un transfert hors de l’Espace économique européen.

Tant que ce contrat client n’existe pas, ne pas rédiger ces pièces et ne pas les présenter comme en vigueur. Le module 4 (sous-traitant vers responsable) n’est pas non plus le cadre du partage de prospection.

## Références

- RGPD, articles 13, 14, 26, 28, 32 et 44 à 49.
- Décision d’exécution (UE) 2021/914 de la Commission (clauses contractuelles types).
- CNIL : guides sur les transferts hors de l’Union européenne et l’analyse d’impact du transfert.
- Comité européen de la protection des données, lignes directrices 05/2021 sur l’interaction entre l’article 3 et le chapitre V, et sur l’évaluation du droit du pays destinataire lorsque des clauses sont utilisées.
