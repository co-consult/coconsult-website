import type { Locale, RouteKey } from '@/content/types';

export type PageVisual = {
  image: string;
  overlay: Record<Locale, string>;
  lane?: 'ai' | 'software' | 'cloud' | 'quality' | 'team' | 'innovation';
};

/** Distinctive hero art for service / topic pages (not home/contact shells). */
export const pageVisuals: Partial<Record<RouteKey, PageVisual>> = {
  services: {
    image: '/assets/people/workshop-journey.jpg',
    overlay: { fr: 'Offres d’ingénierie', en: 'Engineering offers' },
    lane: 'software',
  },
  software: {
    image: '/assets/people/engineer-focus.jpg',
    overlay: { fr: 'Développement logiciel', en: 'Software engineering' },
    lane: 'software',
  },
  dedicated: {
    image: '/assets/people/nearshore-pair.jpg',
    overlay: { fr: 'Équipes dédiées', en: 'Dedicated teams' },
    lane: 'team',
  },
  qa: {
    image: '/assets/people/delivery-room.jpg',
    overlay: { fr: 'QA & testing', en: 'QA & testing' },
    lane: 'quality',
  },
  cloud: {
    image: '/assets/people/architecture-review.jpg',
    overlay: { fr: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    lane: 'cloud',
  },
  cyber: {
    image: '/assets/people/engineer-desk.jpg',
    overlay: { fr: 'Cybersécurité', en: 'Cybersecurity' },
    lane: 'quality',
  },
  ai: {
    image: '/assets/people/product-demo.jpg',
    overlay: { fr: 'IA & Data', en: 'AI & Data' },
    lane: 'ai',
  },
  automation: {
    image: '/assets/people/workshop-journey.jpg',
    overlay: { fr: 'Automatisation', en: 'Business automation' },
    lane: 'ai',
  },
  payments: {
    image: '/assets/people/project-handoff.jpg',
    overlay: { fr: 'Paiements', en: 'Payments' },
    lane: 'software',
  },
  modes: {
    image: '/assets/people/team-standup.jpg',
    overlay: { fr: 'Collaboration', en: 'Collaboration' },
    lane: 'team',
  },
  innovation: {
    image: '/assets/people/architecture-review.jpg',
    overlay: { fr: 'Agrément CII 2026–2030', en: 'CII approval 2026–2030' },
    lane: 'innovation',
  },
  about: {
    image: '/assets/people/architecture-review.jpg',
    overlay: { fr: 'Paris · Sfax', en: 'Paris · Sfax' },
  },
  cases: {
    image: '/assets/people/project-handoff.jpg',
    overlay: { fr: 'Systèmes livrés', en: 'Systems delivered' },
  },
};
