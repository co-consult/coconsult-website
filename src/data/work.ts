import type { Locale, MailLink } from '@/content/types';

export type WorkGroup = 'case' | 'solution';

export interface WorkItem {
  id: string;
  group: WorkGroup;
  order: number;
  visible: boolean;
  title: Record<Locale, string>;
  status: Record<Locale, string>;
  sector: Record<Locale, string>;
  summary: Record<Locale, string>;
  benefits: Record<Locale, string[]>;
  cta: Record<Locale, MailLink>;
}

/**
 * Single source for solutions and case studies.
 * Rename the SaaS work-in-progress by editing its title fields only.
 */
export const workItems: WorkItem[] = [
  {
    id: 'iaps',
    group: 'case',
    order: 10,
    visible: true,
    title: {
      fr: 'Application documentaire et workflows',
      en: 'Document and workflow application',
    },
    status: {
      fr: 'Réalisation client — code cédé',
      en: 'Client delivery — source code transferred',
    },
    sector: {
      fr: 'Gestion documentaire',
      en: 'Document management',
    },
    summary: {
      fr: 'Application métier de gestion documentaire et de workflows, développée pour un client et livrée. Le code d’origine a été cédé au client. Ce logiciel n’est pas un produit Coconsult réutilisable, et aucun résultat confidentiel n’est publié ici.',
      en: 'A business application for document management and workflows, built for a client and delivered. The original source code was transferred to the client. It is not a reusable Coconsult product, and no confidential results are published here.',
    },
    benefits: {
      fr: [
        'Parcours documentaires adaptés à un métier réel',
        'Workflows de traitement suivis de bout en bout',
        'Livraison d’un logiciel dont le client détient le code',
      ],
      en: [
        'Document flows shaped around a real operation',
        'End-to-end processing workflows',
        'A delivered system whose code belongs to the client',
      ],
    },
    cta: {
      fr: {
        label: 'Évoquer un besoin comparable',
        subject: 'Besoin comparable - gestion documentaire - Coconsult',
        body: 'Bonjour,\n\nJe souhaite échanger sur un besoin de gestion documentaire ou de workflows.\n\nContexte :\n',
      },
      en: {
        label: 'Discuss a similar need',
        subject: 'Similar need - document workflows - Coconsult',
        body: 'Hello,\n\nI would like to discuss a document or workflow system.\n\nContext:\n',
      },
    },
  },
  {
    id: 'cssforever',
    group: 'case',
    order: 20,
    visible: true,
    title: {
      fr: 'Plateforme d’opérations sportives',
      en: 'Sports operations platform',
    },
    status: {
      fr: 'Réalisation d’ingénierie',
      en: 'Engineering delivery',
    },
    sector: {
      fr: 'Sport et opérations numériques',
      en: 'Sports and digital operations',
    },
    summary: {
      fr: 'Plateforme construite autour des membres et abonnements, de la billetterie, des dons, des paiements, du streaming et des opérations. Présentée comme une expérience d’ingénierie, sans identité de club, sans chiffres et sans visuels de client.',
      en: 'A platform built around members and subscriptions, ticketing, donations, payments, streaming and operations. Shown as engineering experience, without a club identity, metrics or client visuals.',
    },
    benefits: {
      fr: [
        'Plusieurs parcours métier sur une même plateforme',
        'Paiements et opérations reliés au quotidien du service',
        'Retour d’expérience sur un produit à usage réel',
      ],
      en: [
        'Several business journeys on one platform',
        'Payments and operations tied to day-to-day service',
        'Delivery experience on software people actually use',
      ],
    },
    cta: {
      fr: {
        label: 'Parler d’une plateforme métier',
        subject: 'Plateforme métier - Coconsult',
        body: 'Bonjour,\n\nJe souhaite échanger sur une plateforme métier (membres, paiements ou opérations).\n\nContexte :\n',
      },
      en: {
        label: 'Discuss a business platform',
        subject: 'Business platform - Coconsult',
        body: 'Hello,\n\nI would like to discuss a business platform (members, payments or operations).\n\nContext:\n',
      },
    },
  },
  {
    id: 'business-saas',
    group: 'solution',
    order: 30,
    visible: true,
    title: {
      fr: 'Plateforme SaaS métier (nom à venir)',
      en: 'Business SaaS platform (name to be confirmed)',
    },
    status: {
      fr: 'En développement — démonstration sur demande',
      en: 'In development — demonstration on request',
    },
    sector: {
      fr: 'Logiciel métier',
      en: 'Business software',
    },
    summary: {
      fr: 'Nouveau code et concept générique, distinct des réalisations clients. La marque n’est pas arrêtée et les fonctions exactes ne sont pas publiées tant qu’elles ne sont pas confirmées. Une démonstration se fait sur demande, sans liste de fonctions présumées.',
      en: 'New code and a generic concept, separate from client deliveries. The brand is not settled and exact features are not published until they are confirmed. A demonstration is available on request, without a list of assumed features.',
    },
    benefits: {
      fr: [
        'Socle indépendant, distinct du code cédé aux clients',
        'Échange possible sur un cas d’usage concret',
        'Nom et périmètre modifiables sans refonte du site',
      ],
      en: [
        'An independent codebase, separate from client-owned code',
        'A conversation grounded in a concrete use case',
        'Name and scope can change without a site rebuild',
      ],
    },
    cta: {
      fr: {
        label: 'Demander une démonstration',
        subject: 'Demande de demo - Plateforme SaaS métier (nom à venir) - Coconsult',
        body: 'Bonjour,\n\nJe souhaite une démonstration de la plateforme SaaS métier (nom à venir).\n\nCas d’usage :\n',
      },
      en: {
        label: 'Request a demo',
        subject: 'Demo request - Business SaaS platform (name to be confirmed) - Coconsult',
        body: 'Hello,\n\nI would like a demo of the business SaaS platform (name to be confirmed).\n\nUse case:\n',
      },
    },
  },
  {
    id: 'copharia',
    group: 'solution',
    order: 40,
    visible: true,
    title: { fr: 'COPHARIA', en: 'COPHARIA' },
    status: {
      fr: 'Solution en développement',
      en: 'Solution in development',
    },
    sector: {
      fr: 'ERP métier pharmaceutique',
      en: 'Pharmaceutical business ERP',
    },
    summary: {
      fr: 'ERP métier pour la pharmacie, avec des modules en cours de développement. Aucune validation réglementaire n’est revendiquée.',
      en: 'A pharmaceutical business ERP, with modules still in development. No regulatory validation is claimed.',
    },
    benefits: {
      fr: [
        'Structuration de processus métier pharmaceutiques',
        'Modules construits au fil du besoin réel',
        'Échange de cadrage possible avant un pilote',
      ],
      en: [
        'Structure for pharmaceutical operating processes',
        'Modules shaped around real operating needs',
        'A scoping conversation before any pilot',
      ],
    },
    cta: {
      fr: {
        label: 'Demander une démonstration',
        subject: 'Demande de demo - COPHARIA - Coconsult',
        body: 'Bonjour,\n\nJe souhaite une démonstration de COPHARIA, solution en développement.\n\nContexte :\n',
      },
      en: {
        label: 'Request a demo',
        subject: 'Demo request - COPHARIA - Coconsult',
        body: 'Hello,\n\nI would like a demo of COPHARIA, a solution in development.\n\nContext:\n',
      },
    },
  },
  {
    id: 'cogeex',
    group: 'solution',
    order: 50,
    visible: true,
    title: { fr: 'Cogeex', en: 'Cogeex' },
    status: {
      fr: 'Projet en développement',
      en: 'Project in development',
    },
    sector: {
      fr: 'Digitalisation des services',
      en: 'Service digitalisation',
    },
    summary: {
      fr: 'Solution métier orientée digitalisation des services. Le périmètre des modules reste à confirmer : la fiche décrit un projet en développement, pas un catalogue figé.',
      en: 'A business solution aimed at digitising services. Module scope is still to be confirmed: this entry describes a project in development, not a fixed catalogue.',
    },
    benefits: {
      fr: [
        'Digitalisation progressive d’activités de service',
        'Périmètre ajusté après cadrage',
        'Démonstration sur demande, selon l’état réel du produit',
      ],
      en: [
        'Gradual digitalisation of service operations',
        'Scope adjusted after discovery',
        'A demo on request, matching the product’s actual state',
      ],
    },
    cta: {
      fr: {
        label: 'Demander une démonstration',
        subject: 'Demande de demo - Cogeex - Coconsult',
        body: 'Bonjour,\n\nJe souhaite une démonstration de Cogeex, projet en développement.\n\nContexte :\n',
      },
      en: {
        label: 'Request a demo',
        subject: 'Demo request - Cogeex - Coconsult',
        body: 'Hello,\n\nI would like a demo of Cogeex, a project in development.\n\nContext:\n',
      },
    },
  },
];

export function visibleWork(group: WorkGroup): WorkItem[] {
  return workItems
    .filter((item) => item.visible && item.group === group)
    .sort((a, b) => a.order - b.order);
}
