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
    nearshoreAccess: {
      email: 'unknown',
      crm: 'unknown',
      recruitment: 'unknown',
      clientData: 'unknown',
    },
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

  const access = legal.nearshoreAccess;
  if (access.email === 'unknown' || access.crm === 'unknown' || access.recruitment === 'unknown' || access.clientData === 'unknown') {
    gdpr.push({
      id: 'nearshoreAccess',
      detail:
        'Confirmer si Coconsult Nearshore ou ses collaborateurs accèdent aux e-mails de contact@coconsult.fr, au CRM et aux prospects, aux CV et informations de recrutement, ou aux données clients des projets. Sans cet accès établi, ne pas décrire de transfert hors EEE ni de clauses contractuelles types.',
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
