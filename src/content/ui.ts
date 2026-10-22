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
    status: string;
    sector: string;
    benefits: string;
    storyContext: string;
    storyStake: string;
    storyWork: string;
    storyResult: string;
    contactHeading: string;
    companyHeading: string;
    legalHeading: string;
    navLabel: string;
    footerNavLabel: string;
    headerCta: string;
    linkedin: string;
    linkedinAria: string;
    explore: string;
    modeWord: string;
    copyAddress: string;
    copied: string;
    copyFailed: string;
    openMail: string;
    needLabel: string;
    formName: string;
    formEmail: string;
    formCompany: string;
    formMessage: string;
    formSend: string;
    formUnavailable: string;
    formSent: string;
    formFailed: string;
    privacyNote: string;
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
    footerPlaces: 'Paris · collaboration avec Sfax · depuis 2018',
    emailLabel: 'E-mail',
    status: 'Statut',
    sector: 'Secteur',
    benefits: 'Ce que cela apporte',
    storyContext: 'Contexte',
    storyStake: 'Enjeu',
    storyWork: 'Intervention',
    storyResult: 'Solution livrée',
    contactHeading: 'Contact',
    companyHeading: 'Entreprise',
    legalHeading: 'Informations',
    navLabel: 'Navigation principale',
    footerNavLabel: 'Pied de page',
    headerCta: 'Contact',
    linkedin: 'LinkedIn',
    linkedinAria: 'Coconsult sur LinkedIn, nouvel onglet',
    explore: 'Explorer nos expertises',
    modeWord: 'Mode d’intervention',
    copyAddress: 'Copier l’adresse',
    copied: 'Adresse copiée.',
    copyFailed: 'Copiez l’adresse affichée ci-dessus.',
    openMail: 'Ouvrir votre messagerie',
    needLabel: 'Type de besoin',
    formName: 'Nom',
    formEmail: 'E-mail professionnel',
    formCompany: 'Entreprise',
    formMessage: 'Message',
    formSend: 'Envoyer',
    formUnavailable: 'L’envoi depuis le site n’est pas activé. Utilisez l’adresse ou votre messagerie.',
    formSent: 'Votre demande a été envoyée.',
    formFailed: 'L’envoi n’a pas abouti. Écrivez à l’adresse affichée.',
    privacyNote: 'Politique de confidentialité',
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
    footerPlaces: 'Paris · collaboration with Sfax · since 2018',
    emailLabel: 'Email',
    status: 'Status',
    sector: 'Sector',
    benefits: 'What this changes',
    storyContext: 'Context',
    storyStake: 'Stake',
    storyWork: 'What we did',
    storyResult: 'What shipped',
    contactHeading: 'Contact',
    companyHeading: 'Company',
    legalHeading: 'Information',
    navLabel: 'Main navigation',
    footerNavLabel: 'Footer',
    headerCta: 'Contact',
    linkedin: 'LinkedIn',
    linkedinAria: 'Coconsult on LinkedIn, new tab',
    explore: 'Explore our expertise',
    modeWord: 'Engagement',
    copyAddress: 'Copy the address',
    copied: 'Address copied.',
    copyFailed: 'Copy the address shown above.',
    openMail: 'Open your mail app',
    needLabel: 'Type of need',
    formName: 'Name',
    formEmail: 'Work email',
    formCompany: 'Company',
    formMessage: 'Message',
    formSend: 'Send',
    formUnavailable: 'Sending from the website is not activated. Use the address or your mail app.',
    formSent: 'Your request has been sent.',
    formFailed: 'The message was not sent. Write to the address shown above.',
    privacyNote: 'Privacy policy',
  },
};

export const heroTeamLabel: Record<Locale, string> = {
  fr: 'Constituer une équipe',
  en: 'Build your team',
};
