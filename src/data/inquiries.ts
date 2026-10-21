import type { Inquiry, InquiryId, Locale } from '@/content/types';
import { company } from '@/data/company';

const frBody = (topic: string) =>
  `Bonjour,\n\nJe souhaite échanger avec Coconsult à propos de : ${topic}.\n\nContexte :\nÉchéance souhaitée :\n`;

const enBody = (topic: string) =>
  `Hello,\n\nI would like to talk with Coconsult about: ${topic}.\n\nContext:\nPreferred timing:\n`;

export const inquiries: Record<InquiryId, Record<Locale, Inquiry>> = {
  project: {
    fr: {
      label: 'Parlons de votre projet',
      subject: 'Parlons de votre projet - Coconsult',
      body: frBody('un projet d’ingénierie ou d’intégration'),
    },
    en: {
      label: 'Discuss your project',
      subject: 'Discuss your project - Coconsult',
      body: enBody('a software engineering or integration project'),
    },
  },
  team: {
    fr: {
      label: 'Constituer mon équipe',
      subject: 'Constituer une équipe - Coconsult',
      body: frBody('la constitution d’une équipe d’ingénierie'),
    },
    en: {
      label: 'Build your team',
      subject: 'Build your team - Coconsult',
      body: enBody('building a dedicated engineering team'),
    },
  },
  qaDiscuss: {
    fr: {
      label: 'Parler de vos tests',
      subject: 'Besoin QA - Coconsult',
      body: frBody('un besoin de tests logiciels'),
    },
    en: {
      label: 'Discuss your QA needs',
      subject: 'Discuss your QA needs - Coconsult',
      body: enBody('a software testing need'),
    },
  },
  qaTeam: {
    fr: {
      label: 'Demander une équipe QA',
      subject: 'Equipe QA - Coconsult',
      body: frBody('une équipe QA dédiée ou un renfort de test'),
    },
    en: {
      label: 'Request a QA team',
      subject: 'Request a QA team - Coconsult',
      body: enBody('a QA team or testing staff augmentation'),
    },
  },
  payments: {
    fr: {
      label: 'Demander un diagnostic paiements',
      subject: 'Diagnostic paiements - Coconsult',
      body: frBody('un diagnostic ou un projet paiements'),
    },
    en: {
      label: 'Request a payments diagnostic',
      subject: 'Payments diagnostic - Coconsult',
      body: enBody('a payments diagnostic or engineering project'),
    },
  },
  automation: {
    fr: {
      label: 'Évaluer un processus',
      subject: 'Automatisation métier - Coconsult',
      body: frBody('une automatisation ou une intégration de systèmes'),
    },
    en: {
      label: 'Discuss business automation',
      subject: 'Business automation - Coconsult',
      body: enBody('business process automation or systems integration'),
    },
  },
  ai: {
    fr: {
      label: 'Cadrer un diagnostic IA',
      subject: 'Diagnostic IA entreprise - Coconsult',
      body: frBody('une intégration d’IA dans un système existant'),
    },
    en: {
      label: 'Request an AI diagnostic',
      subject: 'Enterprise AI diagnostic - Coconsult',
      body: enBody('a scoped enterprise AI integration'),
    },
  },
  demo: {
    fr: {
      label: 'Demander une démonstration',
      subject: 'Demande de démonstration - Coconsult',
      body: frBody('une démonstration'),
    },
    en: {
      label: 'Request a demonstration',
      subject: 'Demo request - Coconsult',
      body: enBody('a demonstration'),
    },
  },
  partnership: {
    fr: {
      label: 'Proposer un partenariat',
      subject: 'Partenariat - Coconsult',
      body: frBody('un partenariat industriel, commercial ou un pilote'),
    },
    en: {
      label: 'Propose a partnership',
      subject: 'Partnership enquiry - Coconsult',
      body: enBody('a commercial, industrial or pilot partnership'),
    },
  },
};

export function getInquiry(locale: Locale, id: InquiryId): Inquiry {
  return inquiries[id][locale];
}

export function mailto(inquiry: Pick<Inquiry, 'subject' | 'body'>): string {
  return `mailto:${company.email}?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(inquiry.body)}`;
}

const contactType: Record<InquiryId, string> = {
  project: 'project',
  team: 'team',
  qaDiscuss: 'qa',
  qaTeam: 'qa-team',
  payments: 'payments',
  automation: 'automation',
  ai: 'ai',
  partnership: 'partnership',
  demo: 'demo',
};

export function contactPath(locale: Locale, id: InquiryId, product?: string): string {
  const base = locale === 'fr' ? '/contact/' : '/en/contact/';
  const params = new URLSearchParams({ type: contactType[id] });
  if (product) params.set('product', product);
  return `${base}?${params.toString()}`;
}

export function plainMailto(): string {
  return `mailto:${company.email}`;
}

export function demoInquiry(locale: Locale, productName: string): Inquiry {
  if (locale === 'fr') {
    return {
      label: 'Demander une démonstration',
      subject: `Demande de demo - ${productName} - Coconsult`,
      body: frBody(`une démonstration de « ${productName} »`),
    };
  }
  return {
    label: 'Request a demo',
    subject: `Demo request - ${productName} - Coconsult`,
    body: enBody(`a demonstration of "${productName}"`),
  };
}

export const contactIntentOrder: InquiryId[] = [
  'project',
  'team',
  'qaDiscuss',
  'qaTeam',
  'payments',
  'automation',
  'ai',
  'partnership',
  'demo',
];
