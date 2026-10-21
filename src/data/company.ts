/**
 * Public company facts used on the site.
 * Legal identifiers stay null until the managing director validates them.
 * Do not invent values for the TODO fields.
 */
export const company = {
  name: 'Coconsult',
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
    legalForm: null as string | null,
    capital: null as string | null,
    siren: null as string | null,
    siret: null as string | null,
    rcs: null as string | null,
    vat: null as string | null,
    publisher: null as string | null,
    headquarters: null as string | null,
    phone: null as string | null,
    hostLegalName: null as string | null,
    dpo: null as string | null,
    linkedin: null as string | null,
  },
} as const;

export const missingLegalFields = [
  'legalForm',
  'capital',
  'siren',
  'siret',
  'rcs',
  'vat',
  'publisher',
  'headquarters',
  'phone',
  'hostLegalName',
  'dpo',
  'linkedin',
] as const;
