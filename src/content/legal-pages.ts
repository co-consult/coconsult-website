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
        'COCONSULT SAS traite les demandes envoyées à contact@coconsult.fr. Des commerciaux à Sfax accèdent à la prospection. Pas de traceur publicitaire.',
      eyebrow: 'CONFIDENTIALITÉ',
      h1: 'Politique de confidentialité',
      intro:
        'Cette page décrit le site vitrine tel qu’il fonctionne : des pages statiques et des liens qui ouvrent votre messagerie. Elle ne couvre pas un contrat de prestation.',
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
            'Le site n’a pas de formulaire, de compte ni de paiement en ligne. Il ne reçoit pas le contenu du message : votre logiciel de messagerie l’envoie à contact@coconsult.fr.',
            'Coconsult reçoit alors ce que vous choisissez d’écrire : votre identité, vos coordonnées et le contenu libre du message.',
            'La consultation des pages peut produire des journaux techniques d’accès (adresse IP, date, adresse demandée), tenus par le serveur et l’hébergeur pour la sécurité et le diagnostic.',
          ],
        },
        {
          type: 'prose',
          title: 'Finalités et base légale',
          paragraphs: [
            'Les messages servent à répondre à une demande et à l’échange précontractuel ou commercial qui suit : projet, équipe, tests, paiement, automatisation, démonstration ou partenariat.',
            'Quand vous écrivez pour obtenir une réponse à un projet, le traitement repose sur les mesures précontractuelles prises à votre demande. Le suivi de cette demande professionnelle repose sur l’intérêt légitime de Coconsult à y répondre. Le consentement n’est pas exigé pour cet échange.',
            'La qualification des demandes, la prospection professionnelle et le suivi des opportunités reposent sur l’intérêt légitime, avec un droit d’opposition. Cette page ne fixe ni l’origine des fichiers ni une durée chiffrée.',
          ],
        },
        {
          type: 'prose',
          title: 'Destinataires',
          paragraphs: [
            'Les messages reçus sur contact@coconsult.fr sont lus par les personnes habilitées de COCONSULT SAS. Les e-mails de prospection, les fichiers de prospects ou l’outil de suivi commercial sont aussi accessibles à des commerciaux habilités de Coconsult Nearshore, à Sfax.',
            'Ces échanges transitent par le prestataire de messagerie du domaine. Les pages du site sont servies par l’hébergeur.',
            'Le nom du prestataire de messagerie n’est pas publié tant qu’il n’est pas confirmé.',
          ],
        },
        {
          type: 'prose',
          title: 'Durée',
          paragraphs: [
            'Les messages sont conservés le temps de traiter la demande et l’échange qui en découle, puis supprimés lorsqu’ils ne sont plus nécessaires à cette finalité.',
            'Aucune durée chiffrée n’est affichée tant que Coconsult ne l’a pas fixée. Une obligation légale de conservation plus longue primerait le cas échéant.',
          ],
        },
        {
          type: 'prose',
          title: 'Hors de l’Espace économique européen',
          paragraphs: [
            'L’hébergement du site est situé en France. L’éditeur est COCONSULT SAS. Coconsult Nearshore est une société tunisienne juridiquement indépendante, basée à Sfax, avec des dirigeants différents. Elle n’édite pas ce site et n’est pas un service interne de la SAS française.',
            'Des commerciaux habilités de Coconsult Nearshore accèdent aux mêmes e-mails de prospection professionnelle, aux mêmes fichiers de prospects ou au même outil de suivi commercial que Coconsult en France. Cet accès ne couvre pas toutes les boîtes de messagerie. Il sert à qualifier les demandes, à prospecter et à suivre les opportunités.',
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
      'COCONSULT SAS handles email sent to contact@coconsult.fr. Sales staff in Sfax can access prospecting records. No advertising tracker.',
    eyebrow: 'PRIVACY',
    h1: 'Privacy policy',
    intro:
      'This page describes the corporate site as it works: static pages and links that open your mail software. It does not cover a delivery contract.',
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
          'The site has no form, no account and no online payment. It does not receive the message: your mail software sends it to contact@coconsult.fr.',
          'Coconsult then receives what you choose to write: your identity, your contact details and the free text of the message.',
          'Viewing pages may produce technical access logs (IP address, time, requested URL), kept by the server and the host for security and diagnostics.',
        ],
      },
      {
        type: 'prose',
        title: 'Purposes and legal basis',
        paragraphs: [
          'Messages are used to answer a request and the pre-contractual or commercial exchange that follows: a project, a team, testing, payments, automation, a demo or a partnership.',
          'When you write to obtain a reply about a project, processing is based on pre-contractual steps taken at your request. Following up that professional enquiry is based on Coconsult’s legitimate interest in answering it. Consent is not required for this exchange.',
          'Qualifying enquiries, professional prospecting and following opportunities are based on legitimate interest, with a right to object. This page does not set the origin of prospect files or a fixed retention period.',
        ],
      },
      {
        type: 'prose',
        title: 'Recipients',
        paragraphs: [
          'Messages received at contact@coconsult.fr are read by authorised people at COCONSULT SAS. Prospecting email, prospect files or the sales-tracking tool are also accessible to authorised sales staff at Coconsult Nearshore, in Sfax.',
          'Those exchanges pass through the domain’s email provider. The site pages are served by the host.',
          'The email provider is not named until it has been confirmed.',
        ],
      },
      {
        type: 'prose',
        title: 'Retention',
        paragraphs: [
          'Messages are kept while the request and the exchange that follows are handled, then deleted when they are no longer needed for that purpose.',
          'No fixed period is published until Coconsult has set one. A longer statutory retention duty would prevail where it applies.',
        ],
      },
      {
        type: 'prose',
        title: 'Outside the European Economic Area',
        paragraphs: [
          'The site is hosted in France. The publisher is COCONSULT SAS. Coconsult Nearshore is a legally independent Tunisian company based in Sfax, with different directors. It does not publish this site and it is not an internal department of the French company.',
          'Authorised sales staff at Coconsult Nearshore can access the same professional prospecting email, the same prospect files or the same sales-tracking tool as Coconsult in France. This access does not cover every mailbox. It is used to qualify enquiries, to prospect and to follow commercial opportunities.',
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
