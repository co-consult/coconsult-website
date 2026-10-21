import type { Locale } from '@/content/types';

export const ui: Record<
  Locale,
  {
    skip: string;
    home: string;
    menu: string;
    close: string;
    langAria: string;
    langCode: string;
    breadcrumb: string;
    servicesGroup: string;
    footerPlaces: string;
    emailLabel: string;
    conceptual: string;
    conceptualNote: string;
    status: string;
    sector: string;
    benefits: string;
    contactHeading: string;
    companyHeading: string;
    legalHeading: string;
    navLabel: string;
    footerNavLabel: string;
    heroPrimaryLabel?: string;
  }
> = {
  fr: {
    skip: 'Aller au contenu',
    home: 'Accueil',
    menu: 'Menu',
    close: 'Fermer le menu',
    langAria: 'Passer à la version anglaise',
    langCode: 'EN',
    breadcrumb: 'Fil d’Ariane',
    servicesGroup: 'Expertises',
    footerPlaces: 'Paris et Sfax · depuis 2018',
    emailLabel: 'E-mail',
    conceptual: 'Illustration conceptuelle',
    conceptualNote: 'Schéma pédagogique. Ce n’est pas une capture du produit.',
    status: 'Statut',
    sector: 'Secteur',
    benefits: 'Bénéfices possibles',
    contactHeading: 'Contact',
    companyHeading: 'Entreprise',
    legalHeading: 'Informations',
    navLabel: 'Navigation principale',
    footerNavLabel: 'Pied de page',
  },
  en: {
    skip: 'Skip to content',
    home: 'Home',
    menu: 'Menu',
    close: 'Close menu',
    langAria: 'Switch to French',
    langCode: 'FR',
    breadcrumb: 'Breadcrumb',
    servicesGroup: 'Capabilities',
    footerPlaces: 'Paris and Sfax · since 2018',
    emailLabel: 'Email',
    conceptual: 'Conceptual illustration',
    conceptualNote: 'An explanatory diagram. Not a product screenshot.',
    status: 'Status',
    sector: 'Sector',
    benefits: 'Possible benefits',
    contactHeading: 'Contact',
    companyHeading: 'Company',
    legalHeading: 'Information',
    navLabel: 'Main navigation',
    footerNavLabel: 'Footer',
  },
};

export const heroTeamLabel: Record<Locale, string> = {
  fr: 'Constituer une équipe',
  en: 'Build your team',
};
