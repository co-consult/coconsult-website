# Projet de notice — formulaire de contact

Les pages `/confidentialite/` et `/en/privacy-policy/` décrivent maintenant le formulaire lorsqu’il transmet une demande, et nomment Brevo comme prestataire d’acheminement. Ce projet reste un aide-mémoire. Il ne remplace pas ces pages et ne conclut pas à la conformité RGPD.

Les tests techniques ne valident ni la base juridique, ni le contrat Brevo, ni la durée de conservation. Les points encore ouverts sont : la confirmation par un conseil de la base juridique publiée, la décision formalisée de COCONSULT SAS et l’organisation de la suppression dans la messagerie (la durée de 12 mois n’est pas une règle effective, et cette organisation n’est pas réalisée), le réglage Brevo de 6 mois (il n’est pas configuré), le contrat de sous-traitance Brevo et le lieu de traitement, le prestataire qui héberge la boîte `contact@coconsult.fr`, et les garanties du transfert de prospection vers Sfax. Avant toute suppression, lire `docs/CONTACT_ACTIVATION.md` : la boîte est aussi utilisée par CSSForever.

Le NO-GO actuel sur la prospection partagée entre la France et la Tunisie reste entier. Les demandes reçues par ce formulaire ne sont pas transférées à Coconsult Nearshore par défaut. Aucun accès depuis la Tunisie et aucune synchronisation avec un CRM partagé ne sont prévus sans validation spécifique.

## Français — à intégrer seulement à l’activation

Responsable du traitement : COCONSULT SAS, 10 rue de Penthièvre, 75008 Paris. Contact : contact@coconsult.fr.

Finalité : recevoir une demande commerciale envoyée depuis le formulaire du site et y répondre. Les catégories couvertes sont un projet logiciel, une intégration d’intelligence artificielle, une équipe dédiée ou nearshore, la QA ou la cybersécurité, le cloud ou l’infrastructure, la banque et les paiements, un partenariat, une autre demande, ou une démonstration de COPHARIA.

Données recueillies : nom, e-mail professionnel, entreprise facultative, catégorie de demande, produit lorsqu’il s’agit de COPHARIA, message facultatif pour cette démonstration et obligatoire pour les autres demandes. L’adresse IP est utilisée le temps du contrôle anti-abus, en mémoire, sans être envoyée à Brevo dans le corps du message.

Base juridique : à faire valider. Piste à confirmer par un juriste : mesures précontractuelles à la demande de la personne pour la réponse à sa sollicitation, et intérêt légitime pour le suivi de cette demande professionnelle. Le consentement marketing n’est pas recueilli. Le formulaire ne inscrit personne à une liste de prospection.

Prestataire d’envoi : Brevo, uniquement après vérification du contrat, des clauses de sous-traitance et du lieu de traitement. Le nom peut être publié seulement quand ce contrat est au dossier.

Personnes habilitées : les personnes de COCONSULT SAS chargées de lire `CONTACT_TO` et de traiter la demande. Coconsult Nearshore n’est pas destinataire de ces nouvelles demandes par le formulaire.

Durée de conservation : 12 mois après le dernier échange sont prévus pour une demande commerciale sans contrat. Cette durée devient une règle effective seulement après une décision formalisée de COCONSULT SAS et après organisation de la suppression dans la messagerie. Cette organisation n’est pas réalisée. Les dossiers contractuels ne sont pas couverts. La durée cible de 6 mois des journaux transactionnels Brevo n’est pas configurée.

Droits : accès, rectification, effacement, limitation, opposition au suivi fondé sur l’intérêt légitime, et portabilité lorsque les conditions sont réunies. Demande à contact@coconsult.fr. Réclamation possible auprès de la CNIL.

## English — publish only at activation

Controller: COCONSULT SAS, 10 rue de Penthièvre, 75008 Paris. Contact: contact@coconsult.fr.

Purpose: to receive a commercial enquiry submitted through the site form and to answer it. The categories are a software project, an artificial-intelligence integration, a dedicated or nearshore team, QA or cybersecurity, cloud or infrastructure, banking and payments, a partnership, another request, or a COPHARIA demonstration.

Data: name, work email, optional company, request category, product when the request is COPHARIA, optional message for that demonstration and a required message otherwise. The IP address is used only for the short-lived abuse control kept in memory. It is not sent to Brevo in the message body.

Legal basis: still to be validated by counsel. The working hypothesis is pre-contractual steps requested by the person, and legitimate interest for following up that professional enquiry. The form does not collect marketing consent and does not add the person to a prospecting list.

Sending provider: Brevo, only after the contract, the processing clauses and the place of processing have been checked. The name should be published only once that contract is on file.

Recipients: the COCONSULT SAS staff allowed to read `CONTACT_TO` and handle the enquiry. Coconsult Nearshore does not receive these new form enquiries by default.

Retention: 12 months after the last exchange are intended for a commercial enquiry that does not lead to a contract. That period becomes an effective rule only after a formal decision by COCONSULT SAS and after deletion has been organised in the mailbox. That organisation is not in place. Contractual files are not covered. The 6-month target for Brevo transactional logs is not configured.

Rights: access, rectification, erasure, restriction, objection to legitimate-interest follow-up, and portability where the conditions are met. Write to contact@coconsult.fr. A complaint can be lodged with the CNIL.
