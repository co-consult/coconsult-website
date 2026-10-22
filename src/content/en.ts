import type { PageContent, RouteKey } from '@/content/types';
import { legalPage, privacyPage } from '@/content/legal-pages';

export const pages: Record<RouteKey, PageContent> = {
  home: {
    key: 'home',
    metaTitle: 'Coconsult — Software engineering, artificial intelligence and tech teams',
    description:
      'Coconsult designs, builds and modernises digital products: software, AI and data, quality, cloud and DevOps, with teams shaped around the project.',
    eyebrow: 'SOFTWARE ENGINEERING · AI · TECH TEAMS',
    h1: 'From artificial intelligence to business applications.',
    h1Accent: 'We build your digital systems.',
    intro:
      'Coconsult designs, builds and modernises the systems its clients run. Engineering teams in France, working with Coconsult Nearshore in Sfax, carry a project through to production.',
    heroPrimary: 'project',
    heroExplore: true,
    hero: {
      facts: ['Artificial intelligence', 'Software development', 'Teams in France and Sfax'],
      diagramTitle: 'AN ENGINEERING SYSTEM',
      centerTitle: 'Your system',
      centerSub: 'Design · Build · Modernise',
      nodes: ['AI and data', 'Software engineering', 'Cloud and DevOps', 'Quality and security'],
      note: 'Four disciplines, one person to scope the work.',
    },
    blocks: [
      {
        type: 'cards',
        title: 'Our expertise',
        intro: 'From AI to business applications, each discipline answers a concrete problem: ship, stabilise or modernise a system that already matters.',
        layout: 'bento',
        items: [
          { kicker: '01', title: 'Artificial intelligence and data', text: 'Generative AI, model integration, agents and intelligent automation, applied to your data and your processes.', hrefKey: 'ai' },
          { kicker: '02', title: 'Software development', text: 'Web and mobile applications, APIs, backends and integration into the system you already run.', hrefKey: 'software' },
          { kicker: '03', title: 'QA and testing', text: 'Functional, API, regression and automated testing, so the software your teams run stays dependable.', hrefKey: 'qa' },
          { kicker: '04', title: 'Cloud and DevOps', text: 'Cloud platforms, CI/CD, containers and observability, so a release can be operated.', hrefKey: 'cloud' },
          { kicker: '05', title: 'Cybersecurity', text: 'Hardening of applications, access and exposed systems, within the project scope.', hrefKey: 'cyber' },
          { kicker: '06', title: 'Integration and processes', text: 'APIs, connectors and workflows between the tools that still force people to retype.', hrefKey: 'automation' },
        ],
      },
      {
        type: 'challenge',
        title: 'What is the challenge?',
        intro: 'Name what is blocking you. The useful expertise, a use case and a way of working together appear.',
        items: [
          {
            id: 'ai',
            label: 'Bring in AI',
            expertise: 'Artificial intelligence and data',
            expertiseKey: 'ai',
            useCase: 'Connect a model to a process your teams already know: access rights, traceability and a bounded use case before it grows.',
            mode: 'A fixed-scope pilot, or a team for the discovery.',
            inquiry: 'ai',
          },
          {
            id: 'app',
            label: 'Build an application',
            expertise: 'Software development',
            expertiseKey: 'software',
            useCase: 'A web or mobile application tied to your APIs and business rules, through to a release your teams can run.',
            mode: 'Fixed scope when the boundary is clear. Otherwise, staff augmentation or a dedicated team.',
            inquiry: 'project',
          },
          {
            id: 'team',
            label: 'Strengthen my team',
            expertise: 'Dedicated teams',
            expertiseKey: 'dedicated',
            useCase: 'Engineers who join your delivery, with scoping from France.',
            mode: 'Staff augmentation or a dedicated team. Nearshore work is with Coconsult Nearshore, a separate company in Sfax.',
            inquiry: 'team',
          },
          {
            id: 'quality',
            label: 'Raise software quality',
            expertise: 'QA and testing',
            expertiseKey: 'qa',
            useCase: 'Functional campaigns, API tests and regression, starting with a pilot you can judge.',
            mode: 'QA staff augmentation or a dedicated team.',
            inquiry: 'qaDiscuss',
          },
          {
            id: 'infra',
            label: 'Modernise my infrastructure',
            expertise: 'Cloud and DevOps',
            expertiseKey: 'cloud',
            useCase: 'Delivery pipeline, environments and observability for an application already in production.',
            mode: 'Advisory to scope the work, then a team if the platform needs it.',
            inquiry: 'project',
          },
        ],
      },
      {
        type: 'columns',
        title: 'Ways of working',
        layout: 'rail',
        intro: 'Five ways to run the project, depending on scope and pace. Coconsult supports its clients from France and works with Coconsult Nearshore, a legally independent Tunisian company based in Sfax, to bring in engineering skills and build dedicated teams.',
        items: [
          { title: 'Staff augmentation', text: 'One or more engineers for a defined stretch of delivery.' },
          { title: 'Dedicated teams', text: 'A stable squad when the backlog justifies a continuous setup.' },
          { title: 'Nearshore development', text: 'Technical skills mobilised with Coconsult Nearshore, an independent Tunisian company based in Sfax.' },
          { title: 'Fixed scope', text: 'A scope clear enough to estimate, deliver and accept.' },
          { title: 'Advisory', text: 'Architecture, business analysis and technical leadership when the project needs them.' },
        ],
      },
      {
        type: 'columns',
        title: 'Where we have worked',
        intro: 'Sectors where Coconsult has already designed, integrated or stabilised systems.',
        items: [
          { title: 'Banking, finance and payments', text: 'Transaction journeys, payment API integration and flows that recover.' },
          { title: 'E-commerce and retail', text: 'Purchase journeys, catalogues and operations connected to the systems already in place.' },
          { title: 'Industry and operations', text: 'ERP, documents and workflows where retyping and manual hand-offs cost time.' },
          { title: 'Health and pharmacy', text: 'COPHARIA, a pharmaceutical business ERP currently in development.' },
          { title: 'Digital platforms', text: 'Products people use: members, operations, content and payments on one foundation.' },
        ],
      },
      { type: 'work', source: 'cases', title: 'Selected delivery', intro: 'Two delivered systems: the context, the stake and what Coconsult built.' },
      { type: 'work', source: 'solutions', title: 'Products Coconsult is building', intro: 'COPHARIA is a pharmaceutical ERP still in development, separate from projects already delivered.' },
      {
        type: 'columns',
        title: 'Why work with Coconsult',
        items: [
          { title: 'Useful innovation', text: 'AI and new architecture are applied to a process your teams already use.' },
          { title: 'Execution', text: 'Development, quality, cloud or integration, carried through to a release your teams can operate.' },
          { title: 'A clear frame', text: 'The quotation, the contract and the invoice name the company that contracts with the client.' },
        ],
      },
      { type: 'cta', title: 'Tell us about the project you have in mind.', text: 'Development, AI, quality, cloud or a team: describe the need and we will come back to you.', primary: 'project', secondary: 'team' },
    ],
  },
  services: {
    key: 'services',
    metaTitle: 'Expertise | Coconsult',
    description:
      'Artificial intelligence, software, quality, cloud, cybersecurity and integration, to design systems and keep them running.',
    eyebrow: 'EXPERTISE',
    h1: 'Coconsult’s technical expertise.',
    intro:
      'When a system needs AI, has to evolve, must stay in production, or has to connect tools that do not talk, these six disciplines cover the technical work. How we collaborate is chosen afterwards, from the scope.',
    blocks: [
      {
        type: 'cards',
        title: 'Six disciplines',
        items: [
          { kicker: 'AI', title: 'Artificial intelligence and data', text: 'Generative AI, models, agents and intelligent automation, connected to your data and access rights.', hrefKey: 'ai' },
          { kicker: 'Software', title: 'Software development', text: 'Web, mobile, APIs, backends and integration into systems already in production.', hrefKey: 'software' },
          { kicker: 'Quality', title: 'QA and testing', text: 'Functional, API, regression and automated testing, with a pilot before the team grows.', hrefKey: 'qa' },
          { kicker: 'Cloud', title: 'Cloud and DevOps', text: 'Platforms, CI/CD, containers and observability, so a release can be operated.', hrefKey: 'cloud' },
          { kicker: 'Security', title: 'Cybersecurity', text: 'Hardening of applications, access and exposed systems, within the project scope.', hrefKey: 'cyber' },
          { kicker: 'Process', title: 'Integration and processes', text: 'Connectors and workflows across ERP, documents and business tools.', hrefKey: 'automation' },
        ],
      },
      {
        type: 'prose',
        title: 'Who these services are for',
        paragraphs: [
          'CIOs, CTOs, engineering managers, heads of product, operations and quality. Companies with a system to evolve, stabilise, or open to new uses, including AI.',
          'Engagement shape is chosen after a conversation: time and materials, a dedicated team, or a fixed-scope project. Availability, working language and hours of overlap are confirmed during discovery.',
          'When skills are mobilised in Sfax, that is with Coconsult Nearshore, a legally independent Tunisian company. The quotation names the company that contracts with the client.',
        ],
      },
      { type: 'cta', title: 'Describing the need is enough to begin.', text: 'Put the subject in the message. We reply to arrange a first conversation.', primary: 'project', secondary: 'team' },
    ],
  },
  dedicated: {
    key: 'dedicated',
    metaTitle: 'Dedicated software engineering teams | Coconsult',
    description:
      'Java, Angular, full-stack and DevOps teams staffed between France and Sfax. Discovery, selection, client interviews and delivery management.',
    eyebrow: 'DEDICATED TEAMS',
    h1: 'Build an engineering team around the work you actually have.',
    intro:
      'Coconsult supports its clients from France and works with Coconsult Nearshore, a legally independent Tunisian company based in Sfax, to bring in engineering skills and build dedicated teams. Independent consultants complete a setup when the role calls for it. Not every profile is free to start immediately.',
    blocks: [
      {
        type: 'columns',
        title: 'Who it is for',
        items: [
          { title: 'Targeted reinforcement', text: 'One or more Java/Spring, Angular, full-stack or cloud/DevOps engineers for a defined stretch of delivery.' },
          { title: 'Dedicated squad', text: 'A stable team, coordinated between France and Tunisia, when the backlog justifies a continuous setup.' },
          { title: 'Fixed scope', text: 'Possible when the scope is clear enough to estimate. Otherwise we recommend time and materials or a dedicated team.' },
        ],
      },
      {
        type: 'list',
        title: 'Profiles we can look for',
        items: [
          'Java / Spring and full-stack software engineers',
          'Angular engineers when that is what the product already uses',
          'Cloud and DevOps, matched to the platform you run',
          'Specialists for a specific gap, only when someone is available or hired for that mission',
        ],
      },
      {
        type: 'steps',
        title: 'From the request to a steady rhythm',
        items: [
          { title: 'Discovery', text: 'Context, stack, seniority, language, overlap hours and how you want to collaborate.' },
          { title: 'Sourcing and selection', text: 'Search within the team and, if needed, among independent consultants. Each proposed profile is described with their level and experience.' },
          { title: 'Your interview', text: 'You meet the proposed people before anyone starts.' },
          { title: 'Onboarding', text: 'Access, counterparts, tools and the first weeks of scope, defined with your team.' },
          { title: 'Coordination', text: 'A France–Sfax follow-up on priorities, blockers and the quality of what ships.' },
          { title: 'Evolution', text: 'The setup can grow or shrink. Staffing lead time is confirmed during discovery, according to who is available.' },
        ],
      },
      { type: 'note', text: 'The quotation, the contract and the invoice name the company that contracts with the client. Engineers based in Sfax are not employees of COCONSULT SAS merely because of this collaboration.' },
      { type: 'cta', title: 'Tell us about the team you need.', text: 'Stack, seniority, expected duration and working mode are enough for a first conversation.', primary: 'team', secondary: 'project' },
    ],
  },
  qa: {
    key: 'qa',
    metaTitle: 'Dedicated QA and testing teams | Coconsult',
    description:
      'Functional, exploratory, regression and API testing. Coconsult staffs a QA pilot, then grows the team only if the pilot earns it.',
    eyebrow: 'QA & TESTING',
    h1: 'Dedicated QA and testing teams',
    intro:
      'Hand us a testing need, review qualified profiles, start a pilot your team can absorb, then add people when the work rate justifies it.',
    blocks: [
      {
        type: 'columns',
        title: 'Who this is for',
        intro: 'CTOs, VPs of Engineering, engineering managers, QA leads and heads of product, including teams outside France.',
        items: [
          { title: 'A product already in use', text: 'The main risk is a regression, or a business journey that is thinly covered, at the moment of a release.' },
          { title: 'An internal team at capacity', text: 'Extra people take campaigns, scenarios or execution, under your governance.' },
          { title: 'A release or a step-up', text: 'A dated need, with a test scope that can be explained as a handful of journeys.' },
        ],
      },
      {
        type: 'cards',
        title: 'Three ways to add testing capacity',
        items: [
          { kicker: 'Augmentation', title: 'Staff augmentation', text: 'One or more testers join the ritual you already run. You keep backlog priority.' },
          { kicker: 'Team', title: 'Dedicated QA team', text: 'A stable core with a coordination point, when campaigns are continuous.' },
          { kicker: 'Scope', title: 'Scoped QA project', text: 'A bounded mission: a test strategy, a regression campaign, or preparation for a release.' },
        ],
      },
      {
        type: 'list',
        title: 'Work the team can take',
        items: [
          'Functional and exploratory testing on business journeys',
          'Regression scenarios written so they can be run again',
          'API testing when interface contracts are known',
          'QA strategy support: risks, environments and test data',
          'Automation only when the people assigned actually have that skill',
          'CI/CD integration when the mission includes it and you open the pipeline',
        ],
      },
      {
        type: 'steps',
        title: 'Four steps',
        intro: 'The first result is a pilot proposal, after we have seen the product and the release rhythm.',
        items: [
          { title: 'Discovery', text: 'Product, risks, environments, working language, time zone and what the first period must prove.' },
          { title: 'Matching and proposal', text: 'Profiles described at their real level. You interview them. The proposal covers the pilot and the people you meet.' },
          { title: 'Pilot and onboarding', text: 'Access limited to the environments you open, a counterpart, rituals and the first scenarios. Starting size is whatever the pilot can absorb.' },
          { title: 'Delivery and reporting', text: 'Qualified defects, campaign progress and blockers. Growing the team is a decision after that first cycle, not a default.' },
        ],
      },
      {
        type: 'columns',
        title: 'Governance, language and access',
        items: [
          { title: 'Steering', text: 'A Coconsult counterpart follows the scope with your QA lead or engineering manager. Priorities stay yours.' },
          { title: 'English', text: 'English-language coordination can be set up for an international client. The level required of each profile is confirmed in discovery. It is not asserted in advance for every person.' },
          { title: 'Security', text: 'Access is what you grant, preferably the minimum that lets the work happen. We do not ask for production data when a test environment is enough.' },
          { title: 'Hours', text: 'Overlap across France, Tunisia and, where relevant, the United States is agreed with you. It is not the same on every mission.' },
        ],
      },
      {
        type: 'faq',
        title: 'Before the first call',
        items: [
          { q: 'How large should we start?', a: 'With a pilot your people can onboard and judge. The size is decided after we have seen the product and the way you work.' },
          { q: 'Is the work remote?', a: 'Yes. Access, tools and shared hours are defined with you. On-site presence is not the default.' },
          { q: 'What kinds of testing?', a: 'Functional, exploratory, regression and API testing come first. Automation and CI/CD depend on the people selected and on the pipeline you already have.' },
          { q: 'How are people evaluated?', a: 'Internal selection, then an interview with you before a start. A profile that does not fit does not join the pilot.' },
          { q: 'How does the team change later?', a: 'After the pilot, people can be added if the volume justifies it and profiles are available. Reducing the team is equally possible.' },
        ],
      },
      { type: 'cta', title: 'Start with the testing need, or ask for a team.', text: 'Two ways in: scope the subject, or ask for a team for a pilot.', primary: 'qaDiscuss', secondary: 'qaTeam' },
    ],
  },
  payments: {
    key: 'payments',
    metaTitle: 'Payments and transaction API engineering | Coconsult',
    description:
      'Payment systems, transactional APIs, idempotency, retries, instant payments, testing and DevOps in financial environments.',
    eyebrow: 'PAYMENTS',
    h1: 'Make payment flows and the APIs behind them dependable.',
    intro:
      'Design and integrate transaction journeys into existing applications: provider calls, statuses, retries and supervision, with experience gained in banking and financial environments.',
    blocks: [
      {
        type: 'columns',
        title: 'What we work on',
        items: [
          { title: 'Payment systems', text: 'Payment journeys wired into backends already in production, without rewriting the whole estate.' },
          { title: 'Transactional APIs', text: 'API contracts, unique references, status reads and sequenced business steps.' },
          { title: 'Reliability, retries and idempotency', text: 'Ambiguous timeouts, replays and idempotency keys when the client or the network repeats a request.' },
          { title: 'Transactions and instant payments', text: 'Latency and confirmation constraints in flows where status must stay consistent.' },
          { title: 'Testing in financial environments', text: 'Happy paths and degraded paths: duplicate calls, declines, waits, recovery after interruption.' },
          { title: 'Banking DevOps', text: 'Delivery and observability suited to environments where releases are controlled.' },
        ],
      },
      {
        type: 'columns',
        title: 'Frequent client problems',
        items: [
          { title: 'Duplicate charges or duplicate calls', text: 'Idempotency keys and replay rules when the same request returns.' },
          { title: 'Ambiguous timeouts', text: 'A timeout is not automatically a failure. The flow has to read a status and continue cleanly.' },
          { title: 'Operations gaps', text: 'Matching payments to operations is defined with your files and APIs, from how the operation actually runs.' },
          { title: 'Backends to modernise', text: 'Services and API contracts made more explicit, without a full rewrite when that is not useful.' },
        ],
      },
      {
        type: 'diagram',
        title: 'From the click to operations follow-up',
        caption: 'A typical payment journey, from the click through to operations follow-up.',
        steps: [
          { title: 'Journey', text: 'A user confirms a payment in your application.' },
          { title: 'Control', text: 'Amount, unique reference, maximum wait and the rule if the same request returns.' },
          { title: 'Provider', text: 'An API call, then a status: accepted, declined, pending or unknown.' },
          { title: 'Operations', text: 'Logs, alerts and reconciliation with your operations, using only data you can legitimately keep.' },
        ],
      },
      {
        type: 'list',
        title: 'What Coconsult delivers',
        items: [
          'A scoped journey, including the failure cases',
          'Payment API integration in your backend',
          'Timeout, retry and idempotency rules that match the provider contract',
          'Tests for the happy path and the degraded paths',
          'Observability that operations can actually use',
        ],
      },
      { type: 'cta', title: 'A diagnostic starts with a focused note.', text: 'Describe the journey, the provider you have in mind and the current symptom: duplicate calls, an uncertain status, or an operations gap.', primary: 'payments' },
    ],
  },
  automation: {
    key: 'automation',
    metaTitle: 'Business automation and systems integration | Coconsult',
    description:
      'Diagnostics, APIs, connectors and workflows across ERP and document systems. The aim is to cut retyping where the rules are stable.',
    eyebrow: 'BUSINESS AUTOMATION',
    h1: 'Connect the tools that still make people retype.',
    intro:
      'For CIOs, operations, quality, industrial SMEs and service firms: when the ERP, the document store and email do not talk, work disappears into copies and informal approvals.',
    blocks: [
      {
        type: 'list',
        title: 'Situations we see',
        items: [
          'The same data is typed into two tools',
          'ERP, document management and file shares each live alone',
          'An approval chain dies in a mailbox',
          'Documents move with no usable history',
          'An existing integration fails and nobody can see where',
          'The real workflow fits none of the standard modules',
        ],
      },
      {
        type: 'steps',
        title: 'What we do',
        items: [
          { title: 'Diagnostic', text: 'Map the real circuit, the tools and the errors that consume time.' },
          { title: 'Interfaces', text: 'APIs, connectors or file exchange, chosen from what the systems can already do.' },
          { title: 'Orchestration', text: 'Steps, statuses and reminders when a process crosses several teams.' },
          { title: 'Documents', text: 'Files attached to the business case, with a trace of the actions that matter.' },
          { title: 'Supervision', text: 'Know a flow has failed before the customer or the shop floor discovers it.' },
        ],
      },
      {
        type: 'prose',
        title: 'How we collaborate',
        paragraphs: [
          'Work starts from measurable friction, not from a general replacement of tools. An ERP that does its job stays the system of record.',
          'We hand over a scope your team can run: written rules, logs and a counterpart during the first weeks of operation.',
        ],
      },
      { type: 'cta', title: 'Describe the circuit that sticks.', text: 'One concrete example — an order, a case file, an approval — is enough to see whether a diagnostic is worthwhile.', primary: 'automation' },
    ],
  },
  ai: {
    key: 'ai',
    metaTitle: 'Secure enterprise AI integration | Coconsult',
    description:
      'Coconsult integrates AI tools you already use: permissions, traceability and a bounded use case.',
    eyebrow: 'ARTIFICIAL INTELLIGENCE AND DATA',
    h1: 'Put AI to work on a process you already understand.',
    intro:
      'Generation, model integration, agents and intelligent automation. The use case, access rights and traceability are scoped before a pilot, inside the applications you already run.',
    blocks: [
      {
        type: 'columns',
        title: 'What is in scope',
        items: [
          { title: 'Tools you can already use', text: 'Connection of an AI service you are entitled to use, through the APIs and access model intended for it.' },
          { title: 'Permissions', text: 'The assistant sees only the data allowed for that user and that case.' },
          { title: 'Identity', text: 'Your SSO, when the project includes it, rather than a shared login.' },
          { title: 'Traceability', text: 'A log of the actions your operations and internal control need, defined with you.' },
        ],
      },
      {
        type: 'list',
        title: 'How a use case is accepted',
        items: [
          'The expected gain is described on a process you already run',
          'The data involved, and how sensitive it is, is identified',
          'A person remains accountable for the business decision',
          'The cost of a mistake is acceptable or covered by a review',
          'The pilot has an end: measure it, extend it, or stop it',
        ],
      },
      {
        type: 'prose',
        title: 'Security and data',
        paragraphs: [
          'Confidentiality and privacy law are handled for the project in question, under the legal bases that apply. Connecting a model does not, by itself, make a processing activity compliant.',
          'Integration uses AI services you are entitled to use. Coconsult does not sell a proprietary conversational assistant as a finished product.',
        ],
      },
      { type: 'cta', title: 'A bounded diagnostic, before any integration.', text: 'Describe the process, the data involved and the tool you have in mind. We will say whether a pilot is reasonable.', primary: 'ai' },
    ],
  },
  sectors: {
    key: 'sectors',
    metaTitle: 'Industry experience | Coconsult',
    description:
      'Business environments where Coconsult engineering has already been practised: finance and payments, mobility, retail, media, telecom, sports, business systems, and healthcare pharmaceuticals as an emerging domain.',
    eyebrow: 'INDUSTRIES',
    h1: 'Our engineering in the service of your industries.',
    intro:
      'Finance, mobility, retail, media, telecom, sports, business systems and healthcare: contexts where our consultants have already supported software engineering, DevOps and QA projects.',
    blocks: [],
  },
  solutions: {
    key: 'solutions',
    metaTitle: 'Solutions and platforms | Coconsult',
    description:
      'COPHARIA, a pharmaceutical ERP in development, and delivered platforms: sports operations, document workflows. Request a demonstration from Contact.',
    eyebrow: 'SOLUTIONS',
    h1: 'Products Coconsult is building.',
    intro:
      'One Coconsult solution still in development, and platforms already delivered. The two stay distinct: the product and the case studies are not the same thing.',
    blocks: [
      {
        type: 'work',
        source: 'solutions',
        title: 'Coconsult solutions',
        intro: 'COPHARIA, a pharmaceutical ERP in development. Real status, anonymized views, demonstration on request.',
      },
      {
        type: 'work',
        source: 'platforms',
        title: 'Platforms and deliveries',
        intro:
          'Systems that were built and handed over. These are not SaaS products sold by Coconsult: they are engineering proof, with a short link to the case study.',
      },
      {
        type: 'cta',
        title: 'Request a COPHARIA demonstration.',
        text: 'Share your context. We will come back to arrange a conversation.',
        primary: 'demo',
        product: 'copharia',
      },
    ],
  },
  cases: {
    key: 'cases',
    metaTitle: 'Engineering case studies | Coconsult',
    description:
      'Business applications delivered by Coconsult: a document system handed to the client, and a sports operations platform.',
    eyebrow: 'CASE STUDIES',
    h1: 'Systems we have delivered.',
    intro:
      'Two verified experiences. Clients are not named. The context, the stake and the result are those of the real project.',
    blocks: [
      { type: 'work', source: 'cases', title: 'Delivered projects' },
      {
        type: 'prose',
        paragraphs: [
          'When software was handed to the client, it is not offered as a Coconsult product.',
        ],
      },
      { type: 'cta', title: 'A similar project starts from yours.', text: 'Describe the system to build or to stabilise. We will say whether the experience is relevant.', primary: 'project' },
    ],
  },
  about: {
    key: 'about',
    metaTitle: 'About Coconsult | Paris and Sfax',
    description:
      'COCONSULT SAS, a French company founded in 2018, supports clients from Paris and works with Coconsult Nearshore, an independent Tunisian company based in Sfax.',
    eyebrow: 'ABOUT',
    h1: 'A French engineering company, in collaboration with Sfax.',
    intro:
      'Coconsult supports its clients from France and works with Coconsult Nearshore, a legally independent Tunisian company based in Sfax, to bring in engineering skills and build dedicated teams. Founded in 2018, the French company designs, integrates and runs business applications.',
    blocks: [
      {
        type: 'columns',
        title: 'How the company works',
        items: [
          { title: 'Scoping close to the client', text: 'Needs, constraints and priorities are understood with your team, from France when that is the right relay.' },
          { title: 'Engineering in Sfax', text: 'Coconsult Nearshore can mobilise engineering skills for the agreed scope. The two companies have different directors.' },
          { title: 'Independent specialists', text: 'Independent consultants can complete a setup when the role calls for it.' },
        ],
      },
      {
        type: 'prose',
        title: 'What the company sells',
        paragraphs: [
          'Fixed-scope projects when the scope allows it, integration into existing systems, dedicated teams, testing and payments engineering, and support for business solutions still being built.',
          'The quotation, the contract and the invoice name the company that contracts with the client.',
        ],
      },
      {
        type: 'list',
        title: 'Public facts',
        items: [
          'Founded in 2018',
          'Site publisher: COCONSULT SAS, Paris',
          'Collaboration with Coconsult Nearshore, Sfax',
          'Contact: contact@coconsult.fr',
        ],
      },
      { type: 'cta', title: 'Meet the team on a concrete subject.', text: 'A message is enough to propose a time. The project context matters more than a general presentation.', primary: 'project', secondary: 'partnership' },
    ],
  },
  partnerships: {
    key: 'partnerships',
    metaTitle: 'Partnerships and pilot customers | Coconsult',
    description:
      'Coconsult works with pilot customers and commercial or technical partners. Scope and pilot status are written down before work starts.',
    eyebrow: 'PARTNERSHIPS',
    h1: 'Pilots and partnerships with a written scope.',
    intro:
      'A pilot checks whether a solution in development, or a team setup, fits a real case. A commercial or technical partnership is discussed when each side’s role is clear.',
    blocks: [
      {
        type: 'columns',
        title: 'Three ways in',
        items: [
          { title: 'Pilot customer', text: 'You try a solution in development on a limited scope, with that status shown openly, after a demo.' },
          { title: 'Commercial partner', text: 'You bring market or operational access. Coconsult brings engineering. The frame is contracted before any joint promise.' },
          { title: 'Technical partner', text: 'A vendor, integrator or host: the collaboration is about a specific part of the system.' },
        ],
      },
      {
        type: 'list',
        title: 'What a first conversation clarifies',
        items: [
          'The use case and sector, described without confidential data in the email',
          'What each party provides',
          'How long the pilot is expected to run',
          'What will be decided at the end: extend, change or stop',
        ],
      },
      { type: 'cta', title: 'Propose a pilot or a partnership.', text: 'The request type is already selected when you arrive from this page.', primary: 'partnership' },
    ],
  },
  contact: {
    key: 'contact',
    metaTitle: "Let's talk about your next system | Coconsult",
    description:
      'Describe the system to build: a project, a team, artificial intelligence or a demonstration. contact@coconsult.fr is on the page.',
    eyebrow: 'CONTACT',
    h1: "Let's talk about your next system.",
    h1Accent: 'A project, a team, AI, or a demonstration.',
    intro: 'Confirmation appears only after the enquiry is accepted. Otherwise the message is prepared in your mail software.',
    blocks: [
      {
        type: 'inquiries',
        title: 'Your request',
        intro: 'The subject is already set if you arrive from an expertise, an offer or a solution.',
        ids: ['project', 'team', 'qaDiscuss', 'qaTeam', 'payments', 'automation', 'ai', 'partnership', 'demo'],
      },
      { type: 'note', text: 'For this first note, stay with the project context. Card data and secrets belong on a channel agreed afterwards.' },
    ],
  },
  software: {
    key: 'software',
    metaTitle: 'Software development | Coconsult',
    description:
      'Web and mobile applications, APIs, backends and integration. Coconsult designs and evolves business software.',
    eyebrow: 'SOFTWARE DEVELOPMENT',
    h1: 'Design and evolve your applications.',
    intro:
      'Web, mobile, backend, frontend and APIs. The work starts from the system you run and ends in a release your teams can operate.',
    blocks: [
      {
        type: 'columns',
        title: 'What development covers',
        items: [
          { title: 'Applications', text: 'Web or mobile interfaces tied to the business rules and the data you already have.' },
          { title: 'APIs and integration', text: 'Stable interfaces between your tools, with retries and observability when the flow is critical.' },
          { title: 'Architecture', text: 'A readable structure as the product grows, without a decorative rewrite.' },
        ],
      },
      {
        type: 'list',
        title: 'Concrete work',
        items: [
          'Evolve a web application already in production',
          'Connect a mobile app or a portal to the backend you run',
          'Steady the APIs between two systems that do not talk',
        ],
      },
      { type: 'cta', title: 'Describe the software to build or to modernise.', text: 'Stack, users and timing are enough for a first conversation.', primary: 'project' },
    ],
  },
  cloud: {
    key: 'cloud',
    metaTitle: 'Cloud, DevOps and access security | Coconsult',
    description:
      'Cloud infrastructure, CI/CD, containers, observability and access security for the applications you operate.',
    eyebrow: 'CLOUD AND DEVOPS',
    h1: 'Release software, then keep it running.',
    intro:
      'Cloud, delivery pipelines, containers and observability. Securing applications, access and systems belongs to the same scope when the project needs it.',
    blocks: [
      {
        type: 'columns',
        title: 'The usual scope',
        items: [
          { title: 'Platform', text: 'Cloud environments aligned with the way the application is actually deployed.' },
          { title: 'Delivery', text: 'CI/CD and containers so each release can be reproduced.' },
          { title: 'Operations', text: 'Logs, alerts and retries, so an incident is visible before your users find it.' },
          { title: 'Access', text: 'Rights, secrets and hardening of exposed services, limited to the system in scope.' },
        ],
      },
      {
        type: 'list',
        title: 'Concrete work',
        items: [
          'Make a delivery pipeline reproducible',
          'Clarify the environments of an application already deployed',
          'Surface an incident before users report it',
        ],
      },
      { type: 'cta', title: 'Talk about the platform you run.', text: 'Current hosting, release cadence and the pain point are enough to start.', primary: 'project' },
    ],
  },
  modes: {
    key: 'modes',
    metaTitle: 'Ways of working | Coconsult',
    description:
      'Staff augmentation, dedicated teams, nearshore development, fixed scope and advisory, according to the scope and pace of the project.',
    eyebrow: 'WAYS OF WORKING',
    h1: 'Choose how we work together.',
    intro:
      'Depending on the scope, the work is staff augmentation, a dedicated team, nearshore delivery, a fixed scope or advisory. The same team can build software, apply AI, test or run a platform.',
    blocks: [
      {
        type: 'columns',
        title: 'Five ways to engage',
        items: [
          { title: 'Staff augmentation', text: 'One or more engineers for an identified stretch of delivery.' },
          { title: 'Dedicated teams', text: 'A squad followed over time, coordinated from France.' },
          { title: 'Nearshore development', text: 'Skills mobilised with Coconsult Nearshore in Sfax. The two companies are legally separate.' },
          { title: 'Fixed scope', text: 'A scope that can be estimated, with a result to accept.' },
          { title: 'Advisory', text: 'Architecture, business analysis and technical leadership, before or during delivery.' },
        ],
      },
      {
        type: 'prose',
        paragraphs: [
          'Coconsult supports its clients from France and works with Coconsult Nearshore, a legally independent Tunisian company based in Sfax, to bring in engineering skills and build dedicated teams.',
          'The quotation, the contract and the invoice name the company that contracts with the client.',
        ],
      },
      { type: 'cta', title: 'Describe the team or the setup you need.', text: 'We propose the engagement model after the scope is clear.', primary: 'team', secondary: 'project' },
    ],
  },
  cyber: {
    key: 'cyber',
    metaTitle: 'Application security | Coconsult',
    description: 'Hardening of applications, access and exposed systems, within the scope of the project.',
    eyebrow: 'CYBERSECURITY',
    h1: 'Harden the applications and the access you expose.',
    intro: 'Your applications, access and secrets expose a surface. We reduce it in the code and the infrastructure of the project. Coconsult does not offer a standing monitoring centre.',
    blocks: [
      {
        type: 'columns',
        title: 'Typical work',
        items: [
          { title: 'Applications', text: 'Access control, input validation and a smaller surface on the APIs you publish.' },
          { title: 'Identities', text: 'Accounts, roles and secrets aligned with the people who actually need to act.' },
          { title: 'Platform', text: 'Hardening of published services, alongside the cloud and the delivery pipeline you already run.' },
        ],
      },
      {
        type: 'list',
        title: 'Concrete work',
        items: [
          'Shrink what a public API exposes',
          'Review the roles and secrets of an application',
          'Harden a published service with the team that runs it',
        ],
      },
      { type: 'cta', title: 'Describe the system to protect.', text: 'The application, current access and the risk you see are enough for a first conversation.', primary: 'project' },
    ],
  },
  legal: legalPage('en'),
  privacy: privacyPage('en'),
};
