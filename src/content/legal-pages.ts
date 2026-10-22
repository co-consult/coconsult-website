import type { Locale, PageContent } from '@/content/types';
import { company } from '@/data/company';

const legal = company.legal;

function phoneLine(locale: Locale): string {
  if (legal.phone) return locale === 'fr' ? `Téléphone : ${legal.phone}.` : `Phone: ${legal.phone}.`;
  return locale === 'fr'
    ? 'Le téléphone professionnel sera publié dès qu’un numéro aura été validé.'
    : 'The company phone number will be published once a number has been validated.';
}

function publisherLine(locale: Locale): string {
  if (legal.publisher) {
    return locale === 'fr'
      ? `Directeur de la publication : ${legal.publisher}.`
      : `Publishing director: ${legal.publisher}.`;
  }
  return locale === 'fr'
    ? 'Le nom du directeur de la publication sera indiqué après confirmation du représentant légal de la société.'
    : 'The publishing director will be named once the company’s legal representative has been confirmed.';
}

function hostPhoneLine(locale: Locale): string {
  if (legal.host.phone) {
    return locale === 'fr' ? `Téléphone : ${legal.host.phone}.` : `Phone: ${legal.host.phone}.`;
  }
  return locale === 'fr'
    ? 'Le téléphone de l’hébergeur sera ajouté après vérification.'
    : 'The host’s phone number will be added once it has been verified.';
}

export function legalPage(locale: Locale): PageContent {
  if (locale === 'fr') {
    return {
      key: 'legal',
      metaTitle: 'Mentions légales | Coconsult',
      description:
        'Éditeur, siège, RCS, SIREN et TVA de COCONSULT, SAS à Paris. Hébergement OVH. Contact : contact@coconsult.fr.',
      eyebrow: 'MENTIONS LÉGALES',
      h1: 'Mentions légales',
      intro: 'Identité de l’éditeur de ce site vitrine et informations exigées pour une société.',
      blocks: [
        {
          type: 'prose',
          title: 'Éditeur du site',
          paragraphs: [
            `${company.legalName}, ${legal.legalForm} au capital de ${legal.capital}.`,
            `Siège : ${legal.headquarters}.`,
            `RCS ${legal.rcs}. SIREN ${legal.siren}.`,
            `TVA intracommunautaire : ${legal.vat}.`,
            `E-mail : ${company.email}.`,
            phoneLine('fr'),
            `Site : ${company.siteUrl}/`,
          ],
        },
        {
          type: 'prose',
          title: 'Directeur de la publication',
          paragraphs: [publisherLine('fr')],
        },
        {
          type: 'prose',
          title: 'Hébergement',
          paragraphs: [`${legal.host.name}, ${legal.host.address}.`, hostPhoneLine('fr')],
        },
        {
          type: 'prose',
          title: 'Propriété intellectuelle',
          paragraphs: [
            'Les textes, le logo et la présentation de ce site appartiennent à Coconsult, sauf mention contraire. Toute réutilisation non autorisée est interdite. Les droits des tiers sont réservés.',
            'Lorsqu’un logiciel a été livré et que son code a été cédé au client, Coconsult n’en revendique pas la propriété.',
          ],
        },
      ],
    };
  }
  return {
    key: 'legal',
    metaTitle: 'Legal notice | Coconsult',
    description:
      'Publisher, registered office, trade register, SIREN and VAT of COCONSULT, a French SAS in Paris. Hosted by OVH.',
    eyebrow: 'LEGAL NOTICE',
    h1: 'Legal notice',
    intro: 'Identity of the publisher of this corporate website and the particulars required for a company.',
    blocks: [
      {
        type: 'prose',
        title: 'Publisher',
        paragraphs: [
          `${company.legalName}, a French simplified joint-stock company (${legal.legalForm}) with share capital of ${legal.capital}.`,
          `Registered office: ${legal.headquarters}.`,
          `Trade and companies register: ${legal.rcs}. SIREN ${legal.siren}.`,
          `Intra-Community VAT number: ${legal.vat}.`,
          `Email: ${company.email}.`,
          phoneLine('en'),
          `Website: ${company.siteUrl}/`,
        ],
      },
      {
        type: 'prose',
        title: 'Publishing director',
        paragraphs: [publisherLine('en')],
      },
      {
        type: 'prose',
        title: 'Hosting',
        paragraphs: [`${legal.host.name}, ${legal.host.address}.`, hostPhoneLine('en')],
      },
      {
        type: 'prose',
        title: 'Intellectual property',
        paragraphs: [
          'The text, logo and presentation of this site belong to Coconsult unless stated otherwise. Unauthorised reuse is not permitted. Third-party rights are reserved.',
          'When software was delivered and its source code was transferred to the client, Coconsult does not claim ownership of that code.',
        ],
      },
    ],
  };
}

export function privacyPage(locale: Locale): PageContent {
  if (locale === 'fr') {
    return {
      key: 'privacy',
      metaTitle: 'Politique de confidentialité | Coconsult',
      description:
        'COCONSULT SAS traite les demandes du formulaire et les messages envoyés à contact@coconsult.fr. Des commerciaux à Sfax accèdent à la prospection. Pas de traceur publicitaire.',
      eyebrow: 'CONFIDENTIALITÉ',
      h1: 'Politique de confidentialité',
      intro:
        'Cette page décrit le site vitrine et le formulaire de contact. Elle ne couvre pas un contrat de prestation et ne conclut pas, à elle seule, à la conformité du traitement.',
      blocks: [
        {
          type: 'prose',
          title: 'Responsable',
          paragraphs: [
            `${company.legalName} ${legal.legalForm}, ${legal.headquarters}, est responsable des traitements dont elle détermine les finalités et les moyens.`,
            `Contact : ${company.email}. Aucun délégué à la protection des données n’est désigné.`,
          ],
        },
        {
          type: 'prose',
          title: 'Données concernées',
          paragraphs: [
            'Le site n’a pas de compte ni de paiement en ligne. Le formulaire recueille le nom, l’e-mail professionnel, l’entreprise si elle est indiquée, la catégorie de la demande, le produit lorsqu’il s’agit de COPHARIA, et le message. Ce message est facultatif pour une démonstration de COPHARIA et obligatoire pour les autres demandes.',
            'Lorsque l’envoi depuis le site est disponible, la demande est transmise à contact@coconsult.fr seulement après acceptation du service. Brevo, prestataire d’envoi transactionnel, achemine ce message. L’adresse IP sert au contrôle anti-abus, en mémoire, le temps de ce contrôle. Elle n’est pas inscrite dans le message envoyé à Brevo.',
            'Si l’envoi n’est pas disponible, le site prépare le message et votre logiciel de messagerie l’envoie. Dans ce cas, le site ne reçoit pas le contenu.',
            'Coconsult reçoit alors ce que vous choisissez d’écrire : votre identité, vos coordonnées et le contenu du message.',
            'La consultation des pages peut produire des journaux techniques d’accès (adresse IP, date, adresse demandée), tenus par le serveur et l’hébergeur pour la sécurité et le diagnostic.',
          ],
        },
        {
          type: 'prose',
          title: 'Finalités et base légale',
          paragraphs: [
            'Le formulaire sert à recevoir une demande commerciale et à y répondre : projet logiciel, intelligence artificielle, équipe, qualité, cybersécurité, cloud, paiements, automatisation, partenariat, autre demande ou démonstration de COPHARIA.',
            'Quand vous écrivez pour obtenir une réponse, le traitement repose sur les mesures précontractuelles prises à votre demande. Le suivi de cette demande professionnelle repose sur l’intérêt légitime de Coconsult à y répondre. Le consentement marketing n’est pas recueilli, et le formulaire n’inscrit personne à une liste de prospection.',
            'La qualification des demandes, la prospection professionnelle et le suivi des opportunités reposent sur l’intérêt légitime, avec un droit d’opposition. Cette page ne fixe ni l’origine des fichiers ni une durée chiffrée pour ce traitement de prospection, distinct du formulaire. Elle ne tient pas lieu de validation du contrat Brevo ni des garanties du transfert de prospection vers Sfax.',
          ],
        },
        {
          type: 'prose',
          title: 'Destinataires',
          paragraphs: [
            'Les messages reçus sur contact@coconsult.fr sont accessibles uniquement au responsable habilité de COCONSULT SAS, en France. Les demandes transmises par le formulaire lui sont adressées par Brevo. Aucun envoi automatique n’alimente un outil de suivi commercial. Coconsult Nearshore n’est pas destinataire de ces envois de formulaire.',
            'Les e-mails de prospection, les fichiers de prospects ou l’outil de suivi commercial sont aussi accessibles à des commerciaux habilités de Coconsult Nearshore, à Sfax. Cet accès est distinct du formulaire.',
            'Les pages du site sont servies par l’hébergeur. Le prestataire qui héberge la boîte contact@coconsult.fr n’est pas confirmé, et son nom n’est donc pas publié. Le lieu de traitement de Brevo et le contrat qui l’encadre restent à confirmer sur pièces : les nommer ici décrit l’acheminement utilisé, sans conclure que ce contrat est au dossier.',
          ],
        },
        {
          type: 'prose',
          title: 'Durée',
          paragraphs: [
            'Les messages sont conservés le temps de traiter la demande et l’échange qui en découle, puis supprimés lorsqu’ils ne sont plus nécessaires à cette finalité.',
            'Pour une demande commerciale qui n’aboutit pas à un contrat, la durée proposée est de 12 mois après le dernier échange, puis la suppression. Cette proposition reste soumise à une validation interne et à la mise en œuvre effective de la suppression. Elle ne s’applique pas aux dossiers contractuels, qui suivent les obligations particulières de ces dossiers. Une obligation légale de conservation plus longue primerait le cas échéant.',
            'Les journaux transactionnels de l’acheminement du formulaire chez Brevo ont une durée cible de 6 mois. Ce n’est pas un réglage déjà configuré : cette durée ne sera publiée comme règle en vigueur que lorsque le paramètre correspondant aura été effectivement mis en place.',
          ],
        },
        {
          type: 'prose',
          title: 'Hors de l’Espace économique européen',
          paragraphs: [
            'L’hébergement du site est situé en France. L’éditeur est COCONSULT SAS. Coconsult Nearshore est une société tunisienne juridiquement indépendante, basée à Sfax, avec des dirigeants différents. Elle n’édite pas ce site et n’est pas un service interne de la SAS française.',
            'Les envois du formulaire ne sont pas, par ce canal, transférés à Coconsult Nearshore. Le lieu de traitement de Brevo n’est pas affirmé sur cette page.',
            'Des commerciaux habilités de Coconsult Nearshore accèdent aux mêmes e-mails de prospection professionnelle, aux mêmes fichiers de prospects ou au même outil de suivi commercial que Coconsult en France. Cet accès ne couvre pas toutes les boîtes de messagerie. Il sert à qualifier les demandes, à prospecter et à suivre les opportunités.',
            'Aucun contrat n’est en cours par lequel un développement commandé par un client européen serait confié à Coconsult Nearshore. Cette page ne décrit pas de transfert de données de ces clients vers des développeurs en Tunisie. Le développement nearshore reste une offre commerciale.',
            'La Tunisie est hors de l’Espace économique européen. Les garanties de ce transfert seront celles des contrats réellement signés. Aucune clause contractuelle type n’est indiquée ici : aucun contrat de transfert n’est formalisé. Une information sur ce site ne rend pas le transfert licite.',
            `Lorsque ce mécanisme sera formalisé, Coconsult en indiquera la nature sur cette page. Une copie ou des informations sur les garanties applicables pourront être demandées à ${company.email}.`,
          ],
        },
        {
          type: 'prose',
          title: 'Vos droits',
          paragraphs: [
            `Vous pouvez demander l’accès, la rectification ou l’effacement de vos données, la limitation du traitement, et vous opposer au suivi fondé sur l’intérêt légitime. Lorsque les conditions sont réunies, vous pouvez demander la portabilité. Écrivez à ${company.email}. Coconsult répond dans un délai d’un mois, sauf prolongation prévue par le règlement.`,
            'Vous pouvez aussi introduire une réclamation auprès de la CNIL, cnil.fr.',
          ],
        },
        {
          type: 'prose',
          title: 'Cookies',
          paragraphs: [
            'Le site ne dépose pas de cookie publicitaire ni de mesure d’audience. Aucun traceur soumis au consentement n’est utilisé, et aucun bandeau n’est affiché.',
          ],
        },
      ],
    };
  }
  return {
    key: 'privacy',
    metaTitle: 'Privacy policy | Coconsult',
    description:
      'COCONSULT SAS handles the contact form and email sent to contact@coconsult.fr. Sales staff in Sfax can access prospecting records. No advertising tracker.',
    eyebrow: 'PRIVACY',
    h1: 'Privacy policy',
    intro:
      'This page describes the corporate site and the contact form. It does not cover a delivery contract, and it does not by itself establish that the processing is compliant.',
    blocks: [
      {
        type: 'prose',
        title: 'Controller',
        paragraphs: [
          `${company.legalName} ${legal.legalForm}, ${legal.headquarters}, is the controller for the processing whose purposes and means it determines.`,
          `Contact: ${company.email}. No data-protection officer is appointed.`,
        ],
      },
      {
        type: 'prose',
        title: 'Data concerned',
        paragraphs: [
          'The site has no account and no online payment. The form collects your name, work email, company if you give one, the request category, the product when it is COPHARIA, and the message. The message is optional for a COPHARIA demonstration and required for other requests.',
          'When sending from the site is available, the enquiry is passed to contact@coconsult.fr only after the service accepts it. Brevo, the transactional sending provider, delivers that message. The IP address is used for the abuse control, in memory, for the duration of that control. It is not written into the message sent to Brevo.',
          'When sending is not available, the site prepares the message and your mail software sends it. In that case the site does not receive the content.',
          'Coconsult then receives what you choose to write: your identity, your contact details and the text of the message.',
          'Viewing pages may produce technical access logs (IP address, time, requested URL), kept by the server and the host for security and diagnostics.',
        ],
      },
      {
        type: 'prose',
        title: 'Purposes and legal basis',
        paragraphs: [
          'The form is used to receive a commercial enquiry and to answer it: a software project, artificial intelligence, a team, quality, cybersecurity, cloud, payments, automation, a partnership, another request, or a COPHARIA demonstration.',
          'When you write in order to receive a reply, processing is based on pre-contractual steps taken at your request. Following up that professional enquiry is based on Coconsult’s legitimate interest in answering it. Marketing consent is not collected, and the form does not add anyone to a prospecting list.',
          'Qualifying enquiries, professional prospecting and following opportunities are based on legitimate interest, with a right to object. This page does not set the origin of prospect files or a fixed retention period for that prospecting, which is separate from the form. It does not stand in for a review of the Brevo contract or of the safeguards for the prospecting transfer to Sfax.',
        ],
      },
      {
        type: 'prose',
        title: 'Recipients',
        paragraphs: [
          'Messages received at contact@coconsult.fr are accessible only to the authorised manager at COCONSULT SAS, in France. Enquiries submitted through the form are delivered to that person by Brevo. Nothing from the form is sent automatically to a sales-tracking tool. Coconsult Nearshore does not receive these form submissions.',
          'Prospecting email, prospect files or the sales-tracking tool are also accessible to authorised sales staff at Coconsult Nearshore, in Sfax. That access is separate from the form.',
          'The site pages are served by the host. The provider that hosts the contact@coconsult.fr mailbox is not named until it has been confirmed. Brevo’s place of processing and the contract that governs it still have to be confirmed on file: naming Brevo here describes the delivery path in use, without concluding that the contract is on file.',
        ],
      },
      {
        type: 'prose',
        title: 'Retention',
        paragraphs: [
          'Messages are kept while the request and the exchange that follows are handled, then deleted when they are no longer needed for that purpose.',
          'For a commercial enquiry that does not lead to a contract, the proposed period is 12 months after the last exchange, followed by deletion. This proposal still depends on internal validation and on deletion actually being carried out. It does not apply to contractual files, which follow the particular duties that apply to those files. A longer statutory retention duty would prevail where it applies.',
          'Transactional logs of the form’s delivery at Brevo have a target period of 6 months. That is not a setting already in place: this period will be published as a rule in force only once the corresponding setting has actually been configured.',
        ],
      },
      {
        type: 'prose',
        title: 'Outside the European Economic Area',
        paragraphs: [
          'The site is hosted in France. The publisher is COCONSULT SAS. Coconsult Nearshore is a legally independent Tunisian company based in Sfax, with different directors. It does not publish this site and it is not an internal department of the French company.',
          'Form submissions are not transferred to Coconsult Nearshore through this channel. Brevo’s place of processing is not stated on this page.',
          'Authorised sales staff at Coconsult Nearshore can access the same professional prospecting email, the same prospect files or the same sales-tracking tool as Coconsult in France. This access does not cover every mailbox. It is used to qualify enquiries, to prospect and to follow commercial opportunities.',
          'No contract is in place under which development ordered by a European client is then entrusted to Coconsult Nearshore. This page does not describe a transfer of those clients’ data to developers in Tunisia. Nearshore development remains a commercial offer.',
          'Tunisia is outside the European Economic Area. The safeguards for this transfer will be those in the contracts that are actually signed. No standard contractual clauses are stated here: no transfer contract has been formalised. A notice on this website does not make the transfer lawful.',
          `Once that mechanism is in place, Coconsult will describe it on this page. A copy or information about the applicable safeguards can be requested from ${company.email}.`,
        ],
      },
      {
        type: 'prose',
        title: 'Your rights',
        paragraphs: [
          `You may request access, rectification or erasure, restriction of processing, and object to follow-up based on legitimate interest. Where the conditions are met, you may request portability. Write to ${company.email}. Coconsult replies within one month, unless the regulation allows an extension.`,
          'You may also lodge a complaint with the French data protection authority, CNIL, at cnil.fr.',
        ],
      },
      {
        type: 'prose',
        title: 'Cookies',
        paragraphs: [
          'The site sets no advertising or audience-measurement cookie. No tracker that requires consent is used, and no banner is shown.',
        ],
      },
    ],
  };
}
