/**
 * Public knowledge for the Coconsult guide.
 * Facts are copied from the published pages only.
 * Version the text here. Do not add unpublished work, prices, or legal-notice-only data.
 */
export const KNOWLEDGE_VERSION = '2026-10-23';

export const PUBLIC_EMAIL = 'contact@coconsult.fr';

const PATHS = {
  fr: {
    home: '/',
    services: '/services/',
    ai: '/services/ia-entreprise/',
    software: '/services/developpement/',
    cloud: '/services/cloud-devops/',
    qa: '/services/qa-testing/',
    cyber: '/services/cybersecurite/',
    automation: '/services/automatisation/',
    payments: '/services/paiements/',
    teams: '/services/equipes-dediees/',
    modes: '/modes-intervention/',
    cases: '/realisations/',
    about: '/a-propos/',
    innovation: '/innovation/',
    contact: '/contact/',
  },
  en: {
    home: '/en/',
    services: '/en/services/',
    ai: '/en/services/enterprise-ai/',
    software: '/en/services/software-engineering/',
    cloud: '/en/services/cloud-devops/',
    qa: '/en/services/qa-testing/',
    cyber: '/en/services/cybersecurity/',
    automation: '/en/services/business-automation/',
    payments: '/en/services/payments/',
    teams: '/en/services/dedicated-teams/',
    modes: '/en/engagement/',
    cases: '/en/case-studies/',
    about: '/en/about/',
    innovation: '/en/innovation/',
    contact: '/en/contact/',
  },
};

export const entries = [
  {
    id: 'about',
    group: 'company',
    label: { fr: 'Coconsult', en: 'Coconsult' },
    keywords: ['qui etes-vous', 'qui etes vous', 'who are you', 'a propos', 'about coconsult', 'paris', 'depuis 2018', 'since 2018'],
    text: {
      fr: 'Coconsult est une société d’ingénierie française, à Paris, fondée en 2018. Elle conçoit, développe et modernise des systèmes métier, de l’intégration à la production. Elle est agréée crédit d’impôt innovation pour 2026 à 2030, décision n° 28910108. Le détail et les limites sont sur la page Innovation. L’adresse publique est contact@coconsult.fr.',
      en: 'Coconsult is a French engineering company in Paris, founded in 2018. It designs, builds and modernises business systems, from integration through production. It holds a French innovation tax credit agreement for 2026 to 2030, decision no. 28910108. The detail and the limits are on the Innovation page. The public address is contact@coconsult.fr.',
    },
    links: ['about', 'innovation', 'services'],
  },
  {
    id: 'innovation',
    group: 'company',
    label: { fr: 'Innovation et CII', en: 'Innovation and CII' },
    keywords: ['innovation', 'cii', '28910108', 'agrement', 'credit d impot', 'credit dimpot', 'tax credit', 'drieets'],
    text: {
      fr: 'COCONSULT, la société française qui édite ce site, est agréée crédit d’impôt innovation pour 2026 à 2030. La décision du 4 février 2026 de la DRIEETS Île-de-France porte le numéro 28910108. Cet agrément ne décide pas, à lui seul, qu’un projet est éligible, et il n’ouvre pas automatiquement un crédit d’impôt. Une maintenance, une régie ou une évolution courante ne deviennent pas éligibles parce que l’agrément existe. Coconsult Nearshore n’est pas titulaire de cette décision.',
      en: 'COCONSULT, the French company that publishes this site, holds a French innovation tax credit agreement for 2026 to 2030. The 4 February 2026 decision by DRIEETS Île-de-France has number 28910108. The agreement does not, by itself, decide that a project is eligible, and it does not automatically create a tax credit. Maintenance, staff augmentation or an ordinary change do not become eligible because the agreement exists. Coconsult Nearshore is not the holder of this decision.',
    },
    links: ['innovation', 'software', 'about'],
  },
  {
    id: 'nearshore',
    group: 'mode',
    label: { fr: 'Nearshore à Sfax', en: 'Nearshore in Sfax' },
    keywords: ['nearshore', 'sfax', 'tunisie', 'tunisia', 'coconsult nearshore'],
    text: {
      fr: 'Lorsque des compétences sont mobilisées à Sfax, c’est avec Coconsult Nearshore, une société tunisienne juridiquement indépendante. Aucun lien de capital n’est affirmé. Le devis nomme la société qui contracte avec le client. Coconsult Nearshore n’est pas titulaire de l’agrément crédit d’impôt innovation.',
      en: 'When skills are mobilised in Sfax, that is with Coconsult Nearshore, a legally independent Tunisian company. No capital link is asserted. The proposal names the company that contracts with the client. Coconsult Nearshore is not the holder of the innovation tax credit agreement.',
    },
    links: ['modes', 'teams', 'about'],
  },
  {
    id: 'ai',
    group: 'expertise',
    label: { fr: 'IA et data', en: 'AI and data' },
    keywords: ['intelligence artificielle', ' ia ', 'l ia', 'enterprise ai', 'modele', 'modeles', 'llm', 'data', 'agent', 'agents', 'agent ia'],
    text: {
      fr: 'Coconsult intègre des outils d’IA existants, y compris des agents, dans des applications : permissions, traçabilité et cas d’usage cadrés. Le point de départ est un processus déjà connu, pas un catalogue de modèles.',
      en: 'Coconsult integrates existing AI tools, including agents, into applications: permissions, traceability and a framed use case. The starting point is a process you already know, not a catalogue of models.',
    },
    links: ['ai'],
  },
  {
    id: 'software',
    group: 'expertise',
    label: { fr: 'Développement logiciel', en: 'Software engineering' },
    keywords: ['developpement', 'developpement logiciel', 'application', 'applications', 'api', 'backend', 'mobile', 'software'],
    text: {
      fr: 'Coconsult conçoit et fait évoluer des logiciels métier sur mesure : applications web et mobiles, API, backends et intégration.',
      en: 'Coconsult designs and evolves custom business software: web and mobile applications, APIs, backends and integration.',
    },
    links: ['software'],
  },
  {
    id: 'cloud',
    group: 'expertise',
    label: { fr: 'Cloud et DevOps', en: 'Cloud and DevOps' },
    keywords: ['cloud', 'devops', 'ci/cd', 'cicd', 'conteneur', 'conteneurs', 'observabilite', 'infrastructure'],
    text: {
      fr: 'L’expertise cloud couvre l’infrastructure, la CI/CD, les conteneurs, l’observabilité et la sécurisation des accès des applications que vous exploitez.',
      en: 'The cloud practice covers infrastructure, CI/CD, containers, observability and access security for the applications you run.',
    },
    links: ['cloud'],
  },
  {
    id: 'qa',
    group: 'expertise',
    label: { fr: 'QA et testing', en: 'QA and testing' },
    keywords: ['qa', 'test', 'tests', 'testing', 'recette', 'non-regression', 'non regression'],
    text: {
      fr: 'Les tests portent sur le fonctionnel, l’exploratoire, la non-régression et les API. Coconsult propose un pilote QA, puis élargit l’équipe si le volume le justifie.',
      en: 'Testing covers functional, exploratory, regression and API tests. Coconsult starts with a QA pilot, then grows the team if the volume justifies it.',
    },
    links: ['qa'],
  },
  {
    id: 'cyber',
    group: 'expertise',
    label: { fr: 'Cybersécurité', en: 'Cybersecurity' },
    keywords: ['cyber', 'cybersecurite', 'cybersecurity', 'securite applicative', 'acces', 'access', 'certification'],
    text: {
      fr: 'La cybersécurité publiée porte sur les applications, les accès et les systèmes exposés, dans le périmètre du projet. Aucune certification n’est affichée sur le site.',
      en: 'The published cybersecurity work covers applications, access and exposed systems, within the project scope. The site does not display a certification.',
    },
    links: ['cyber'],
  },
  {
    id: 'automation',
    group: 'expertise',
    label: { fr: 'Processus métier', en: 'Business automation' },
    keywords: ['automatisation', 'automation', 'connecteur', 'connecteurs', 'workflow', 'workflows', 'ged', 'erp', 'double saisie'],
    text: {
      fr: 'L’automatisation part d’un diagnostic, puis d’API, de connecteurs et de workflows entre ERP, GED et outils métier. L’objectif publié est de réduire la double saisie là où les règles sont stables.',
      en: 'Automation starts with a diagnosis, then APIs, connectors and workflows between ERP, document systems and business tools. The published aim is to reduce double entry where the rules are stable.',
    },
    links: ['automation'],
  },
  {
    id: 'payments',
    group: 'expertise',
    label: { fr: 'Paiements', en: 'Payments' },
    keywords: ['paiement', 'paiements', 'payment', 'payments', 'idempotence', 'transaction'],
    text: {
      fr: 'L’ingénierie des paiements couvre les systèmes de paiement, les API transactionnelles, l’idempotence, les reprises, les paiements instantanés, les tests et le DevOps en environnement financier.',
      en: 'Payments engineering covers payment systems, transactional APIs, idempotence, retries, instant payments, testing and DevOps in a financial environment.',
    },
    links: ['payments'],
  },
  {
    id: 'teams',
    group: 'expertise',
    label: { fr: 'Équipes dédiées', en: 'Dedicated teams' },
    keywords: ['equipe dediee', 'equipes dediees', 'dedicated team', 'staff', 'renfort'],
    text: {
      fr: 'Coconsult constitue des équipes d’ingénierie depuis la France et collabore avec Coconsult Nearshore, société tunisienne indépendante à Sfax. Des consultants indépendants complètent un dispositif lorsque le besoin le justifie. Tous les profils ne sont pas disponibles immédiatement.',
      en: 'Coconsult builds engineering teams from France and works with Coconsult Nearshore, an independent Tunisian company in Sfax. Independent consultants complete a setup when the need justifies it. Not every profile is available immediately.',
    },
    links: ['teams', 'modes'],
  },
  {
    id: 'stack',
    group: 'company',
    label: { fr: 'Technologies', en: 'Technologies' },
    keywords: ['java', 'spring', 'angular', 'full-stack', 'fullstack', 'technologie', 'technologies', 'stack'],
    text: {
      fr: 'Les profils publiés sont l’ingénierie Java / Spring et full-stack, le front Angular lorsque le produit existant s’appuie dessus, et le cloud / DevOps selon la plateforme déjà en place. Le site ne publie pas une liste plus large.',
      en: 'The published profiles are Java / Spring and full-stack engineering, Angular when the existing product already uses it, and cloud / DevOps according to the platform already in place. The site does not publish a wider list.',
    },
    links: ['teams'],
  },
  {
    id: 'modes',
    group: 'mode',
    label: { fr: 'Modes de collaboration', en: 'Ways of working' },
    keywords: ['mode d intervention', 'modes d intervention', 'collaboration', 'engagement', 'comment travailler'],
    text: {
      fr: 'Les modes publiés sont la régie, l’équipe dédiée, le forfait lorsque le périmètre est assez clair, le nearshore avec Coconsult Nearshore, et le conseil. La langue de travail, les disponibilités et le chevauchement horaire se confirment au cadrage.',
      en: 'The published ways of working are time-and-materials, a dedicated team, a fixed scope when it is clear enough, nearshore with Coconsult Nearshore, and advisory. Working language, availability and time-zone overlap are confirmed during scoping.',
    },
    links: ['modes'],
  },
  {
    id: 'regie',
    group: 'mode',
    label: { fr: 'Régie', en: 'Time and materials' },
    keywords: ['regie', 'time and materials', 'assistance technique'],
    text: {
      fr: 'La régie convient lorsqu’un périmètre n’est pas assez clair pour être estimé. Elle se choisit après échange, avec la langue de travail et le rythme confirmés au cadrage.',
      en: 'Time-and-materials fits when a scope is not clear enough to estimate. It is chosen after a conversation, with working language and pace confirmed during scoping.',
    },
    links: ['modes'],
  },
  {
    id: 'forfait',
    group: 'mode',
    label: { fr: 'Forfait', en: 'Fixed scope' },
    keywords: ['forfait', 'fixed scope', 'fixed price', 'au forfait'],
    text: {
      fr: 'Un projet au forfait est possible lorsque le périmètre est assez clair pour être estimé, livré et réceptionné. Sinon, le site recommande la régie ou une équipe.',
      en: 'A fixed-scope project is possible when the scope is clear enough to estimate, deliver and accept. Otherwise the site recommends time-and-materials or a team.',
    },
    links: ['modes'],
  },
  {
    id: 'squad',
    group: 'mode',
    label: { fr: 'Squad', en: 'Squad' },
    keywords: ['squad', 'equipe stable', 'dispositif continu'],
    text: {
      fr: 'Une squad est une équipe dédiée suivie dans la durée, avec coordination depuis la France, lorsque le backlog justifie un dispositif continu.',
      en: 'A squad is a dedicated team followed over time, coordinated from France, when the backlog justifies a continuous setup.',
    },
    links: ['modes', 'teams'],
  },
  {
    id: 'iaps',
    group: 'work',
    label: { fr: 'Application documentaire', en: 'Document application' },
    keywords: ['documentaire', 'document', 'documents', 'dossier', 'dossiers', 'workflow documentaire'],
    text: {
      fr: 'Réalisation publique : une application de gestion documentaire et de workflows, construite pour les opérations d’un client. Le logiciel a été livré et le code source a été cédé. Le site ne nomme pas le client.',
      en: 'Public case: a document and workflow application built for a client’s operations. The software was delivered and the source code was transferred. The site does not name the client.',
    },
    links: ['cases'],
  },
  {
    id: 'sports',
    group: 'work',
    label: { fr: 'CSS Forever', en: 'CSS Forever' },
    keywords: ['sport', 'sportive', 'billetterie', 'streaming', 'abonnement', 'abonnements', 'dons', 'donations', 'css forever'],
    text: {
      fr: 'Réalisation publique : CSS Forever, plateforme de soutien, d’abonnements, de billetterie, de diffusion et de suivi des ventes. Elle est utilisée au quotidien. Le site ne nomme pas le club.',
      en: 'Public case: CSS Forever, a platform for support, subscriptions, ticketing, streaming and sales follow-up. It is used day to day. The site does not name the club.',
    },
    links: ['cases'],
  },
  {
    id: 'copharia',
    group: 'work',
    label: { fr: 'COPHARIA', en: 'COPHARIA' },
    keywords: ['copharia', 'pharmacie', 'pharmaceutique', 'erp'],
    text: {
      fr: 'COPHARIA est un ERP métier pour la pharmacie. Les modules sont en cours de développement. Une démonstration se demande par le formulaire de contact.',
      en: 'COPHARIA is a pharmaceutical business ERP. Its modules are still in development. A demonstration is requested through the contact form.',
    },
    links: ['cases', 'solutions'],
  },
];

const SOLUTIONS = {
  fr: '/solutions/',
  en: '/en/solutions/',
};

export function localeOf(value) {
  return value === 'en' ? 'en' : 'fr';
}

export function entryById(id) {
  return entries.find((entry) => entry.id === id) || null;
}

export function pathFor(locale, key) {
  if (key === 'solutions') return SOLUTIONS[localeOf(locale)];
  return PATHS[localeOf(locale)][key] || PATHS[localeOf(locale)].contact;
}

export function linksFor(locale, entry) {
  const language = localeOf(locale);
  return entry.links.map((key) => ({
    href: pathFor(language, key),
    label: linkLabel(language, key),
  }));
}

function linkLabel(locale, key) {
  const labels = {
    fr: {
      about: 'À propos',
      services: 'Expertises',
      ai: 'IA et data',
      software: 'Développement logiciel',
      cloud: 'Cloud et DevOps',
      qa: 'QA et testing',
      cyber: 'Cybersécurité',
      automation: 'Processus métier',
      payments: 'Paiements',
      teams: 'Équipes dédiées',
      modes: 'Modes d’intervention',
      cases: 'Réalisations',
      innovation: 'Innovation',
      solutions: 'Solutions',
      contact: 'Contact',
    },
    en: {
      about: 'About',
      services: 'Expertise',
      ai: 'AI and data',
      software: 'Software engineering',
      cloud: 'Cloud and DevOps',
      qa: 'QA and testing',
      cyber: 'Cybersecurity',
      automation: 'Business automation',
      payments: 'Payments',
      teams: 'Dedicated teams',
      modes: 'Engagement',
      cases: 'Case studies',
      innovation: 'Innovation',
      solutions: 'Solutions',
      contact: 'Contact',
    },
  };
  return labels[localeOf(locale)][key];
}

export function contactHref(locale, topic, mode) {
  const language = localeOf(locale);
  const base = PATHS[language].contact;
  let type = 'project';
  let product = '';
  if (topic === 'copharia') {
    type = 'demo';
    product = 'COPHARIA';
  } else if (topic === 'payments') type = 'payments';
  else if (topic === 'automation') type = 'automation';
  else if ((topic === 'qa' || topic === 'cyber') && mode === 'team') type = 'qa-team';
  else if (topic === 'qa' || topic === 'cyber') type = 'qa';
  else if (topic === 'ai' && mode !== 'team') type = 'ai';
  else if (mode === 'team' || topic === 'teams' || topic === 'squad' || topic === 'nearshore') type = 'team';
  const params = new URLSearchParams({ type });
  if (product) params.set('product', product);
  return `${base}?${params.toString()}`;
}

export function chrome(locale) {
  if (localeOf(locale) === 'en') {
    return {
      title: 'Coconsult',
      launcher: 'Assistant',
      openLabel: 'Open the Coconsult assistant',
      closeLabel: 'Close the assistant',
      inputLabel: 'Your question',
      sendLabel: 'Send',
      contactLabel: 'Contact form',
      disclosure:
        'This guide uses the public pages of the site. No external AI model is called. The conversation is not stored. If you ask, the confirmed summary is copied into the form and then deleted.',
    };
  }
  return {
    title: 'Coconsult',
    launcher: 'Assistant',
    openLabel: 'Ouvrir l’assistant Coconsult',
    closeLabel: 'Fermer l’assistant',
    inputLabel: 'Votre question',
    sendLabel: 'Envoyer',
    contactLabel: 'Formulaire de contact',
      disclosure:
      'Ce guide s’appuie sur les pages publiques du site. Aucun modèle d’IA externe n’est appelé. La conversation n’est pas enregistrée. Si vous le demandez, le résumé validé est recopié dans le formulaire puis effacé.',
  };
}

export function fold(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

export function matchEntry(text) {
  const folded = ` ${fold(text)} `;
  let best = null;
  let bestScore = 0;
  for (const entry of entries) {
    for (const keyword of entry.keywords) {
      const needle = fold(keyword).trim();
      if (needle.length < 2) continue;
      const hit = needle.length <= 3
        ? new RegExp(`(?:^|\\W)${needle}(?:$|\\W)`, 'i').test(folded)
        : folded.includes(needle);
      if (hit && needle.length > bestScore) {
        best = entry;
        bestScore = needle.length;
      }
    }
  }
  return best;
}

export function knowledgeNotes(locale) {
  const language = localeOf(locale);
  return entries
    .map((entry) => `${entry.label[language]}\n${entry.text[language]}\n${linksFor(language, entry).map((link) => link.href).join(' ')}`)
    .join('\n\n');
}
