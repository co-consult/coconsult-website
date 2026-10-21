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
  locations: [
    { city: 'Paris', countryFr: 'France', countryEn: 'France', countryCode: 'FR' },
    { city: 'Sfax', countryFr: 'Tunisie', countryEn: 'Tunisia', countryCode: 'TN' },
  ],
  legal: {
    legalForm: 'SAS',
    capital: '1 000 €',
    siren: '838 913 838',
    siret: '838 913 838 00036',
    rcs: 'Paris 838 913 838',
    vat: 'FR90838913838',
    headquarters: '10 rue de Penthièvre, 75008 Paris, France',
    phone: null as string | null,
    publisher: null as string | null,
    host: {
      name: 'OVH SAS',
      address: '2 rue Kellermann, 59100 Roubaix, France',
      phone: null as string | null,
      contractConfirmed: false,
    },
    dpo: null as string | null,
    linkedin: null as string | null,
    retention: null as string | null,
    tunisiaEmailAccess: 'unknown' as 'unknown' | 'yes' | 'no',
    mailProvider: null as string | null,
  },
} as const;

export interface PublicationGap {
  id: string;
  detail: string;
}

/** Gaps that block a legal publication sign-off. They do not block the technical build. */
export function publicationBlockers(): PublicationGap[] {
  const legal = company.legal;
  const gaps: PublicationGap[] = [];
  if (!legal.phone) {
    gaps.push({
      id: 'phone',
      detail: 'Téléphone professionnel de Coconsult : non fourni. Le demander et le valider avant publication.',
    });
  }
  if (!legal.publisher) {
    gaps.push({
      id: 'publisher',
      detail:
        'Directeur de la publication : ne pas afficher de nom tant que la qualité de représentant légal n’est pas confirmée (Kbis ou RNE).',
    });
  }
  if (!legal.host.phone) {
    gaps.push({
      id: 'hostPhone',
      detail: 'Téléphone officiel de l’hébergeur : à récupérer et vérifier avant publication.',
    });
  }
  if (!legal.host.contractConfirmed) {
    gaps.push({
      id: 'hostContract',
      detail: 'Confirmer, sur les documents du VPS, que le contrat est bien au nom d’OVH SAS.',
    });
  }
  if (!legal.retention) {
    gaps.push({
      id: 'retention',
      detail: 'Fixer une durée chiffrée de conservation des e-mails de demande avant de la publier.',
    });
  }
  if (legal.tunisiaEmailAccess === 'unknown') {
    gaps.push({
      id: 'tunisiaAccess',
      detail: 'Confirmer si l’équipe de Sfax accède aux e-mails, aux données prospects ou à un CRM.',
    });
  }
  if (!legal.mailProvider) {
    gaps.push({
      id: 'mailProvider',
      detail: 'Confirmer le prestataire qui héberge réellement la messagerie contact@coconsult.fr.',
    });
  }
  return gaps;
}
