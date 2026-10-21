import type { Locale, RouteKey } from '@/content/types';

export interface RouteDef {
  key: RouteKey;
  fr: string;
  en: string;
  parent?: RouteKey;
  nav?: boolean;
  footer?: 'services' | 'company' | 'legal';
  label: Record<Locale, string>;
}

export const routes: Record<RouteKey, RouteDef> = {
  home: {
    key: 'home',
    fr: '/',
    en: '/en/',
    label: { fr: 'Accueil', en: 'Home' },
  },
  services: {
    key: 'services',
    fr: '/services/',
    en: '/en/services/',
    nav: true,
    footer: 'services',
    label: { fr: 'Services', en: 'Services' },
  },
  dedicated: {
    key: 'dedicated',
    fr: '/services/equipes-dediees/',
    en: '/en/services/dedicated-teams/',
    parent: 'services',
    footer: 'services',
    label: { fr: 'Équipes dédiées', en: 'Dedicated teams' },
  },
  qa: {
    key: 'qa',
    fr: '/services/qa-testing/',
    en: '/en/services/qa-testing/',
    parent: 'services',
    footer: 'services',
    label: { fr: 'QA & testing', en: 'QA & testing' },
  },
  payments: {
    key: 'payments',
    fr: '/services/paiements/',
    en: '/en/services/payments/',
    parent: 'services',
    footer: 'services',
    label: { fr: 'Paiements', en: 'Payments' },
  },
  automation: {
    key: 'automation',
    fr: '/services/automatisation/',
    en: '/en/services/business-automation/',
    parent: 'services',
    footer: 'services',
    label: { fr: 'Automatisation', en: 'Business automation' },
  },
  ai: {
    key: 'ai',
    fr: '/services/ia-entreprise/',
    en: '/en/services/enterprise-ai/',
    parent: 'services',
    footer: 'services',
    label: { fr: 'IA d’entreprise', en: 'Enterprise AI' },
  },
  solutions: {
    key: 'solutions',
    fr: '/solutions/',
    en: '/en/solutions/',
    nav: true,
    footer: 'company',
    label: { fr: 'Solutions', en: 'Solutions' },
  },
  cases: {
    key: 'cases',
    fr: '/realisations/',
    en: '/en/case-studies/',
    nav: true,
    footer: 'company',
    label: { fr: 'Réalisations', en: 'Case studies' },
  },
  about: {
    key: 'about',
    fr: '/a-propos/',
    en: '/en/about/',
    nav: true,
    footer: 'company',
    label: { fr: 'À propos', en: 'About' },
  },
  partnerships: {
    key: 'partnerships',
    fr: '/partenariats/',
    en: '/en/partnerships/',
    footer: 'company',
    label: { fr: 'Partenariats', en: 'Partnerships' },
  },
  contact: {
    key: 'contact',
    fr: '/contact/',
    en: '/en/contact/',
    nav: true,
    footer: 'company',
    label: { fr: 'Contact', en: 'Contact' },
  },
  legal: {
    key: 'legal',
    fr: '/mentions-legales/',
    en: '/en/legal-notice/',
    footer: 'legal',
    label: { fr: 'Mentions légales', en: 'Legal notice' },
  },
  privacy: {
    key: 'privacy',
    fr: '/confidentialite/',
    en: '/en/privacy-policy/',
    footer: 'legal',
    label: { fr: 'Confidentialité', en: 'Privacy policy' },
  },
};

export const routeOrder: RouteKey[] = [
  'home',
  'services',
  'dedicated',
  'qa',
  'payments',
  'automation',
  'ai',
  'solutions',
  'cases',
  'about',
  'partnerships',
  'contact',
  'legal',
  'privacy',
];

export const primaryNav: RouteKey[] = ['services', 'solutions', 'cases', 'about', 'contact'];
export const serviceNav: RouteKey[] = ['dedicated', 'qa', 'payments', 'automation', 'ai'];

export function pathFor(locale: Locale, key: RouteKey): string {
  return routes[key][locale];
}

export function alternatePath(locale: Locale, key: RouteKey | 'notFound'): string {
  if (key === 'notFound') return locale === 'fr' ? '/en/' : '/';
  return routes[key][locale === 'fr' ? 'en' : 'fr'];
}

export function absoluteUrl(path: string): string {
  return new URL(path, 'https://coconsult.fr').href;
}
