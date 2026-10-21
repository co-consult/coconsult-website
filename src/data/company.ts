/**
 * Single source for company facts shown on the site.
 * Null fields are withheld on purpose. Do not invent values.
 * SIRET is kept for reference and is not rendered: RCS and SIREN identify the company.
 */
export const company = {
  name: 'Coconsult',
  legalName: 'COCONSULT',
  email: 'contact@coconsult.fr',
  founded: 2018,
  siteUrl: 'https://coconsult.fr',
  positioning: {
    fr: 'L’ingénierie des systèmes métier complexes, de l’intégration à la production.',
    en: 'Engineering for complex business systems, from integration through production.',
  },
  signature: {
    fr: 'Partenaire d’ingénierie numérique et d’innovation',
    en: 'Digital Engineering & Innovation Partner',
  },
  /** Registered office of the French publisher. Sfax is not an establishment of this company. */
  locations: [{ city: 'Paris', countryFr: 'France', countryEn: 'France', countryCode: 'FR' }],
  nearshore: {
    name: 'Coconsult Nearshore',
    city: 'Sfax',
    countryFr: 'Tunisie',
    countryEn: 'Tunisia',
    /** Distinct company, different directors. No capital link is asserted. */
    sameLegalEntity: false,
    editsThisSite: false,
  },
  legal: {
    legalForm: 'SAS',
    capital: '1 000 €',
    siren: '838 913 838',
    siret: '838 913 838 00036',
    rcs: 'Paris 838 913 838',
    vat: 'FR90838913838',
    headquarters: '10 rue de Penthièvre, 75008 Paris, France',
    /** Provisional mobile, authorised for the legal notice only. Replace from this field. */
    phone: '06 37 19 17 97',
    publisher: 'Racem Smaoui',
    /** True only after the Kbis or RNE shows he represents COCONSULT SAS. */
    publisherRepresentativeConfirmed: false,
    host: {
      name: 'OVH SAS',
      address: '2 rue Kellermann, 59100 Roubaix, France',
      phone: '09 72 10 10 07',
      /** True only after the VPS contract names OVH SAS. */
      contractConfirmed: false,
    },
    dpo: null as string | null,
    linkedin: null as string | null,
    retention: null as string | null,
    /**
     * Prospecting mail only. Commercial staff in Sfax use the same prospecting
     * mailboxes as France. This is not access to every mailbox.
     */
    tunisiaEmailAccess: 'prospecting' as 'prospecting' | 'all-mailboxes' | 'none' | 'unknown',
    prospectFiles: 'shared' as 'shared' | 'none' | 'unknown',
    /** Same commercial scope as the files. No product name is confirmed. */
    crm: 'shared' as 'shared' | 'none' | 'unknown',
    recruitment: 'unknown' as 'shared' | 'none' | 'unknown',
    /**
     * No current contract under which a European client’s development
     * is subcontracted to Coconsult Nearshore. Not a transfer in progress.
     */
    clientProjectData: 'none' as 'shared' | 'none' | 'unknown',
    euClientDeliverySubcontract: false,
    /** Not presumed: processor, separate controllers, or joint controllers. */
    nearshoreRole: 'undetermined' as 'processor' | 'separate-controllers' | 'joint-controllers' | 'undetermined',
    sharingAgreementSigned: false,
    /** Commission decision 2021/914. False until a signed set is on file. */
    sccSigned: false,
    tiaCompleted: false,
    mailProvider: null as string | null,
  },
} as const;

export interface PublicationGap {
  id: string;
  detail: string;
}

export interface PublicationReview {
  confirmed: string[];
  documents: PublicationGap[];
  gdpr: PublicationGap[];
}

/** Legal sign-off review. Open items do not fail the technical build. */
export function publicationReview(): PublicationReview {
  const legal = company.legal;
  const documents: PublicationGap[] = [];
  const gdpr: PublicationGap[] = [];

  if (!legal.publisherRepresentativeConfirmed) {
    documents.push({
      id: 'publisherKbis',
      detail:
        'Racem Smaoui est indiqué comme directeur de la publication. Vérifier sur le Kbis ou le RNE qu’il est le représentant légal de COCONSULT SAS.',
    });
  }
  if (!legal.host.contractConfirmed) {
    documents.push({
      id: 'hostContract',
      detail:
        'Le contrat du VPS n’est pas dans le dépôt. Confirmer sur ce document que l’hébergeur contractant est OVH SAS.',
    });
  }

  if (legal.tunisiaEmailAccess !== 'prospecting' || legal.prospectFiles !== 'shared' || legal.crm !== 'shared') {
    gdpr.push({
      id: 'tunisiaEmailAccess',
      detail:
        'L’accès confirmé porte sur les e-mails de prospection, les fichiers de prospects et le suivi commercial, pas sur toutes les boîtes. Ne pas élargir cette description sans un fait nouveau.',
    });
  }
  if (legal.clientProjectData !== 'none' || legal.euClientDeliverySubcontract) {
    gdpr.push({
      id: 'clientDeliveryTransfer',
      detail:
        'Ne pas décrire un transfert de données de clients européens vers des développeurs en Tunisie. Aucun contrat de ce type n’est en cours.',
    });
  }
  if (legal.recruitment === 'unknown') {
    gdpr.push({
      id: 'recruitmentAccess',
      detail: 'L’accès aux CV n’est pas confirmé. Ne pas l’écrire dans la politique.',
    });
  }
  if (legal.nearshoreRole === 'undetermined' || !legal.sharingAgreementSigned || !legal.sccSigned || !legal.tiaCompleted) {
    gdpr.push({
      id: 'transferInstruments',
      detail:
        'Pour la prospection partagée : le rôle de Coconsult Nearshore n’est pas tranché. Aucun accord article 26 ou 28, aucune clause module 1 ou 2 et aucune analyse d’impact ne sont signés. Tant que ce partage n’est pas encadré, le GO juridique reste fermé. Le module 3 et l’annexe de sous-traitance ultérieure ne sont pas des obligations actuelles.',
    });
  }
  if (!legal.mailProvider) {
    gdpr.push({
      id: 'mailProvider',
      detail: 'Confirmer le prestataire qui héberge réellement la messagerie contact@coconsult.fr.',
    });
  }
  if (!legal.retention) {
    gdpr.push({
      id: 'retentionPractice',
      detail:
        'Le critère publié est la durée du traitement de la demande, puis la suppression. Confirmer qu’il correspond à la pratique effective. Ne pas publier de durée chiffrée tant qu’elle n’est pas fixée.',
    });
  }

  return {
    confirmed: [
      'Éditeur : COCONSULT SAS, capital 1 000 €, RCS Paris 838 913 838, SIREN 838 913 838, TVA FR90838913838, siège parisien, contact@coconsult.fr.',
      'Téléphone 06 37 19 17 97, autorisé pour les mentions légales. Numéro mobile provisoire, remplaçable dans company.ts.',
      'Hébergeur indiqué : OVH SAS, 2 rue Kellermann, 59100 Roubaix, téléphone 09 72 10 10 07.',
      'Coconsult Nearshore, à Sfax, est une société juridiquement distincte. Elle n’édite pas ce site. Aucun lien capitalistique n’est affirmé.',
      'Des commerciaux habilités de Coconsult Nearshore accèdent aux mêmes e-mails de prospection, fichiers de prospects et suivi commercial. Pas à toutes les boîtes. La Tunisie est hors EEE. Les garanties de ce partage ne sont pas signées.',
      'Aucun contrat client européen n’est ensuite confié en développement à Coconsult Nearshore. Pas de transfert de données de ces clients vers des développeurs en Tunisie.',
    ],
    documents,
    gdpr,
  };
}

/** Gaps that block a legal publication sign-off. They do not block the technical build. */
export function publicationBlockers(): PublicationGap[] {
  const review = publicationReview();
  return [...review.documents, ...review.gdpr];
}
