import type { Locale } from '@/content/types';

/** How strongly to present the sector — not all are historic specialties. */
export type SectorMaturity = 'experience' | 'emerging';

export interface SectorItem {
  id: string;
  order: number;
  maturity: SectorMaturity;
  /** Short mono label for visual tiles */
  mark: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  /** Technical angles consultants typically bring (no invented mission detail) */
  angles: Record<Locale, string[]>;
}

/**
 * Sector experience for public pages.
 * No client names, logos or claim of direct Coconsult contracts.
 */
export const sectors: SectorItem[] = [
  {
    id: 'finance',
    order: 10,
    maturity: 'experience',
    mark: { fr: '01 · Finance', en: '01 · Finance' },
    title: {
      fr: 'Banque, finance et paiements',
      en: 'Banking, finance and payments',
    },
    summary: {
      fr: 'Parcours transactionnels, API de paiement et exigences de fiabilité dans des environnements financiers exigeants.',
      en: 'Transaction journeys, payment APIs and reliability requirements in demanding financial environments.',
    },
    angles: {
      fr: ['Développement logiciel', 'DevOps', 'QA'],
      en: ['Software engineering', 'DevOps', 'QA'],
    },
  },
  {
    id: 'mobility',
    order: 20,
    maturity: 'experience',
    mark: { fr: '02 · Mobilité', en: '02 · Mobility' },
    title: {
      fr: 'Mobilité, automobile et transport',
      en: 'Mobility, automotive and transport',
    },
    summary: {
      fr: 'Systèmes numériques autour de la mobilité et du transport, où le logiciel doit suivre des opérations déjà en place.',
      en: 'Digital systems around mobility and transport, where software has to follow operations already running.',
    },
    angles: {
      fr: ['Développement logiciel', 'DevOps', 'QA'],
      en: ['Software engineering', 'DevOps', 'QA'],
    },
  },
  {
    id: 'retail',
    order: 30,
    maturity: 'experience',
    mark: { fr: '03 · Retail', en: '03 · Retail' },
    title: {
      fr: 'Retail, luxe et e-commerce',
      en: 'Retail, luxury and e-commerce',
    },
    summary: {
      fr: 'Parcours d’achat, catalogues et opérations reliés aux systèmes déjà utilisés par les équipes.',
      en: 'Purchase journeys, catalogues and operations tied to systems teams already use.',
    },
    angles: {
      fr: ['Développement logiciel', 'QA'],
      en: ['Software engineering', 'QA'],
    },
  },
  {
    id: 'media',
    order: 40,
    maturity: 'experience',
    mark: { fr: '04 · Médias', en: '04 · Media' },
    title: {
      fr: 'Médias, publicité et AdTech',
      en: 'Media, advertising and AdTech',
    },
    summary: {
      fr: 'Systèmes liés à la diffusion et à la publicité, avec des contraintes de volume et de délais serrés.',
      en: 'Systems tied to broadcasting and advertising, with volume and tight timing constraints.',
    },
    angles: {
      fr: ['Développement logiciel', 'QA'],
      en: ['Software engineering', 'QA'],
    },
  },
  {
    id: 'telecom',
    order: 50,
    maturity: 'experience',
    mark: { fr: '05 · Télécoms', en: '05 · Telecom' },
    title: {
      fr: 'Télécoms et infrastructures numériques',
      en: 'Telecom and digital infrastructure',
    },
    summary: {
      fr: 'Environnements d’infrastructure numérique où la livraison et l’exploitation doivent rester prévisibles.',
      en: 'Digital infrastructure environments where delivery and operations must stay predictable.',
    },
    angles: {
      fr: ['DevOps', 'Développement logiciel'],
      en: ['DevOps', 'Software engineering'],
    },
  },
  {
    id: 'sport',
    order: 60,
    maturity: 'experience',
    mark: { fr: '06 · Sport', en: '06 · Sport' },
    title: {
      fr: 'Sport et plateformes digitales',
      en: 'Sports and digital platforms',
    },
    summary: {
      fr: 'Plateformes d’opérations numériques : membres, parcours et services utilisés au quotidien.',
      en: 'Digital operations platforms: members, journeys and services used day to day.',
    },
    angles: {
      fr: ['Développement logiciel', 'DevOps'],
      en: ['Software engineering', 'DevOps'],
    },
  },
  {
    id: 'digital',
    order: 70,
    maturity: 'experience',
    mark: { fr: '07 · Métier', en: '07 · Business' },
    title: {
      fr: 'Digitalisation et systèmes métier',
      en: 'Digitalisation and business systems',
    },
    summary: {
      fr: 'Applications de gestion et workflows lorsque les circuits manuels freinent le suivi des dossiers.',
      en: 'Management applications and workflows when manual hand-offs slow case tracking.',
    },
    angles: {
      fr: ['Développement logiciel', 'QA'],
      en: ['Software engineering', 'QA'],
    },
  },
  {
    id: 'pharma',
    order: 80,
    maturity: 'emerging',
    mark: { fr: '08 · Santé', en: '08 · Health' },
    title: {
      fr: 'Santé et industrie pharmaceutique',
      en: 'Healthcare and pharmaceuticals',
    },
    summary: {
      fr: 'Un domaine en construction, porté notamment par COPHARIA, ERP pharmaceutique en développement.',
      en: 'A domain being built out, notably through COPHARIA, a pharmaceutical ERP in development.',
    },
    angles: {
      fr: ['Développement logiciel', 'Produit'],
      en: ['Software engineering', 'Product'],
    },
  },
];

export function orderedSectors(): SectorItem[] {
  return [...sectors].sort((a, b) => a.order - b.order);
}
