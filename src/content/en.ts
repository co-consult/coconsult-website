import type { PageContent, RouteKey } from '@/content/types';
import { legalPage, privacyPage } from '@/content/legal-pages';

export const pages: Record<RouteKey, PageContent> = {
  home: {
    key: 'home',
    metaTitle: 'Coconsult — Software engineering, teams and business systems',
    description:
      'Coconsult designs, integrates and strengthens business-critical software. Dedicated teams, QA, payments and integration from France and Tunisia.',
    eyebrow: 'SOFTWARE ENGINEERING · FRANCE & TUNISIA',
    h1: 'Reliable systems.',
    h1Accent: 'Projects that move forward.',
    intro:
      'We design, integrate and strengthen business-critical software. From specialized engineers to dedicated teams, Coconsult helps you deliver with confidence.',
    heroPrimary: 'project',
    heroSecondary: 'team',
    hero: {
      facts: ['Engineering and integration', 'Teams staffed from Sfax', 'From architecture to production'],
      diagramTitle: 'ENGINEERING THAT CONNECTS YOUR SYSTEMS',
      centerTitle: 'Your systems',
      centerSub: 'Reliability · Integration · Delivery',
      nodes: ['Payments & APIs', 'QA & testing', 'Business workflows', 'Cloud & DevOps'],
      note: 'Connect systems. Keep flows dependable. Ship software operations can run.',
    },
    blocks: [
      {
        type: 'cards',
        title: 'Four ways to start',
        intro: 'Each offer has its own page: who it is for, what is delivered, and how a collaboration begins.',
        items: [
          { kicker: '01', title: 'Dedicated teams', text: 'Java, Angular, full-stack or DevOps engineers, as individual reinforcement or as a squad, based on people we can actually staff.', hrefKey: 'dedicated' },
          { kicker: '02', title: 'QA and testing', text: 'Functional, exploratory, regression and API testing. A reasonable pilot first, then a gradual increase if it is working.', hrefKey: 'qa' },
          { kicker: '03', title: 'Payments', text: 'Payment APIs, transaction flows, retries and observability. No card-security certification is claimed.', hrefKey: 'payments' },
          { kicker: '04', title: 'Business automation', text: 'ERP, document systems, APIs and workflows connected so people stop retyping the same data.', hrefKey: 'automation' },
        ],
      },
      {
        type: 'columns',
        title: 'How the work is different',
        intro: 'Engineering for complex business systems, from integration through production.',
        items: [
          { title: 'Systems you already run', text: 'We start from your landscape, operating constraints and the teams who use the software.' },
          { title: 'Flows that recover', text: 'Timeouts, retries, idempotency and supervision are delivery work, not a late extra.' },
          { title: 'France and Tunisia', text: 'Scoping and engineering leadership in France, a delivery team in Sfax, and independent specialists when a role truly requires one.' },
          { title: 'Automation with a job', text: 'A specific connector or control beats a general speech about digital change.' },
        ],
      },
      {
        type: 'steps',
        title: 'How a collaboration starts',
        items: [
          { title: 'Understand', text: 'Goals, systems, timing and how much autonomy you expect from the team.' },
          { title: 'Propose', text: 'A readable shape: staff augmentation, a dedicated team, or a fixed scope when the scope is real.' },
          { title: 'Deliver', text: 'Design, build, test and release, with a technical counterpart.' },
          { title: 'Adjust', text: 'The team changes with the actual backlog. We do not publish a fictional headcount.' },
        ],
      },
      { type: 'work', source: 'cases', title: 'Work we can explain', intro: 'Verified facts and an explicit status. No client logos and no unpublished metrics.' },
      { type: 'work', source: 'solutions', title: 'Solutions in progress', intro: 'Coconsult products and projects, separate from software whose code now belongs to a client.' },
      { type: 'cta', title: 'The next project starts with a conversation.', text: 'Fixed scope, a team, testing, payments or automation: the message is sent from your own mail client.', primary: 'project', secondary: 'team' },
    ],
  },
  services: {
    key: 'services',
    metaTitle: 'Software engineering services | Coconsult',
    description:
      'Dedicated teams, QA, payments, automation and enterprise AI integration. Coconsult connects France–Tunisia engineering to the systems you already run.',
    eyebrow: 'SERVICES',
    h1: 'From a single specialist to a team that can hold delivery.',
    intro:
      'Coconsult sells engineering, integration and team setups. The right shape depends on the scope, the systems already in place, and the people we can actually mobilize.',
    blocks: [
      {
        type: 'cards',
        title: 'Five offers, one technical counterpart',
        items: [
          { kicker: 'Teams', title: 'Engineering and dedicated teams', text: 'Java/Spring, Angular, full-stack, cloud and DevOps. Reinforcement or a squad, time-and-materials or fixed scope after discovery.', hrefKey: 'dedicated' },
          { kicker: 'Quality', title: 'QA and software testing', text: 'Functional, exploratory, regression and API testing. A pilot, then more capacity if the setup fits.', hrefKey: 'qa' },
          { kicker: 'Transactions', title: 'Payments engineering', text: 'Transaction journeys, provider APIs, retries and observability. No certification badge is displayed.', hrefKey: 'payments' },
          { kicker: 'Operations', title: 'Automation and integration', text: 'ERP, document systems, APIs and approval flows. We do not promise to replace every ERP.', hrefKey: 'automation' },
          { kicker: 'AI', title: 'Scoped enterprise AI', text: 'Existing tools, permissions, traceability and a defined use case. Not a proprietary general chatbot.', hrefKey: 'ai' },
        ],
      },
      {
        type: 'prose',
        title: 'Who these services are for',
        paragraphs: [
          'CIOs, CTOs, engineering managers, heads of product, operations and quality. Companies that already have a system to keep reliable, not only an idea to prototype.',
          'Engagement shape is chosen after a conversation: time and materials, a dedicated team, or a fixed-scope project. Availability, working language and hours of overlap are confirmed during discovery.',
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
      'Coconsult fields software engineers and, when a role calls for it, independent consultants. The Sfax team and France-based scoping support a managed setup. We do not claim that every profile is free to start immediately.',
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
          { title: 'Sourcing and selection', text: 'Search within the team and, if needed, among independent consultants. We only introduce people we can explain.' },
          { title: 'Your interview', text: 'You meet the proposed people before anyone starts.' },
          { title: 'Onboarding', text: 'Access, counterparts, tools and the first weeks of scope, defined with your team.' },
          { title: 'Coordination', text: 'A France–Sfax follow-up on priorities, blockers and the quality of what ships.' },
          { title: 'Evolution', text: 'The setup can grow or shrink. No staffing lead time is guaranteed up front.' },
        ],
      },
      { type: 'note', text: 'We do not publish rates, salaries or a standing headcount. A team is assembled for an identified need, not from a frozen catalogue.' },
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
      'Hand us a testing need, review qualified profiles, start a pilot your team can absorb, then add people only when the work rate justifies it. No headcount, price or service level is promised on this page.',
    blocks: [
      {
        type: 'columns',
        title: 'Who this is for',
        intro: 'CTOs, VPs of Engineering, engineering managers, QA leads and heads of product, including teams outside France.',
        items: [
          { title: 'A product already in use', text: 'The risk is a regression or a business path with thin coverage, not the lack of a quality slogan.' },
          { title: 'An internal team at capacity', text: 'Extra people take campaigns, scenarios or execution, under your governance.' },
          { title: 'A release or a step-up', text: 'A dated need, with a test scope that can be explained as a handful of journeys.' },
        ],
      },
      {
        type: 'cards',
        title: 'Three setups, kept distinct',
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
        intro: 'You leave with a proposal for a pilot, not a promise that a large bench is waiting.',
        items: [
          { title: 'Discovery', text: 'Product, risks, environments, working language, time zone and what the first period must prove.' },
          { title: 'Matching and proposal', text: 'Profiles described at their real level. You interview them. The proposal covers the pilot, not a team already sitting idle.' },
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
          { q: 'How large should we start?', a: 'With a pilot your people can onboard and judge. We will not recommend a target headcount before seeing the product and the way you work.' },
          { q: 'Is the work remote?', a: 'Yes. Access, tools and shared hours are defined with you. On-site presence is not the default.' },
          { q: 'What kinds of testing?', a: 'Functional, exploratory, regression and API testing come first. Automation and CI/CD depend on the people selected and on the pipeline you already have.' },
          { q: 'How are people evaluated?', a: 'Internal selection, then an interview with you before a start. A profile that does not fit does not join the pilot.' },
          { q: 'How does the team change later?', a: 'After the pilot, people can be added if the volume justifies it and profiles are available. Reducing the team is equally possible.' },
        ],
      },
      { type: 'note', text: 'Coconsult does not present dozens of QA engineers as already on staff. People are proposed, hired or contracted for a confirmed need.' },
      { type: 'cta', title: 'Start with the testing need, or ask for a team.', text: 'Both buttons open your mail client. The subject line is different so the request is routed clearly.', primary: 'qaDiscuss', secondary: 'qaTeam' },
    ],
  },
  payments: {
    key: 'payments',
    metaTitle: 'Payments and transaction API engineering | Coconsult',
    description:
      'Payment-provider integration, transaction flows, idempotency, retries and observability. Coconsult does not claim a card-security certification.',
    eyebrow: 'PAYMENTS',
    h1: 'Make payment flows and the APIs behind them dependable.',
    intro:
      'Coconsult designs and integrates transaction journeys into existing applications: provider calls, statuses, retries and supervision. Banking and payments experience is not a licence to publish client names.',
    blocks: [
      {
        type: 'columns',
        title: 'Problems we work on',
        items: [
          { title: 'Duplicate charges or duplicate calls', text: 'Idempotency keys and replay rules when the client or the network repeats a request.' },
          { title: 'Ambiguous timeouts', text: 'A timeout is not automatically a failure. The flow has to be able to read a status and continue cleanly.' },
          { title: 'Reconciliation gaps', text: 'Matching payments to operations depends on the context and on the files or APIs you can use. It is scoped, not assumed.' },
          { title: 'Backends to modernise', text: 'Java services and API contracts made more explicit, without rewriting the whole estate when that is not useful.' },
        ],
      },
      {
        type: 'diagram',
        title: 'A payment flow, drawn generically',
        caption: 'An explanatory diagram. No provider, bank or real data is shown.',
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
      { type: 'note', text: 'No card-security certification is claimed. Banks and payment-product names are not used as commercial references.' },
      { type: 'cta', title: 'A diagnostic starts with a focused note.', text: 'Describe the journey, the provider you have in mind and the current symptom: duplicate calls, an uncertain status, or an operations gap.', primary: 'payments' },
    ],
  },
  automation: {
    key: 'automation',
    metaTitle: 'Business automation and systems integration | Coconsult',
    description:
      'Diagnostics, APIs, connectors and workflows across ERP and document systems. Coconsult reduces retyping without promising to replace your ERP.',
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
      { type: 'note', text: 'Coconsult does not promise to replace every ERP, or to automate a process whose business rules are still moving.' },
      { type: 'cta', title: 'Describe the circuit that sticks.', text: 'One concrete example — an order, a case file, an approval — is enough to see whether a diagnostic is worthwhile.', primary: 'automation' },
    ],
  },
  ai: {
    key: 'ai',
    metaTitle: 'Secure enterprise AI integration | Coconsult',
    description:
      'Coconsult integrates AI tools you already use: permissions, traceability and a bounded use case. No automatic compliance claim.',
    eyebrow: 'ENTERPRISE AI',
    h1: 'Integrate AI into the system you already operate.',
    intro:
      'The offer is integration, not a general-purpose assistant for sale. We scope a use case, connect an existing tool under your organisation’s permissions, and leave a record of what was asked.',
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
          'Confidentiality, privacy law and consent are handled for the specific project and the legal bases that apply to you. A connector is not presented as making the whole company compliant.',
          'We do not offer a conversational clone as a ready-made proprietary product.',
        ],
      },
      { type: 'cta', title: 'A bounded diagnostic, before any integration.', text: 'Describe the process, the data involved and the tool you have in mind. We will say whether a pilot is reasonable.', primary: 'ai' },
    ],
  },
  solutions: {
    key: 'solutions',
    metaTitle: 'Solutions and demos | Coconsult',
    description:
      'COPHARIA, Cogeex and a business SaaS platform still without a trade name. Honest status, demos on request, no invented screenshots.',
    eyebrow: 'SOLUTIONS',
    h1: 'Solutions described at the stage they have reached.',
    intro:
      'This page separates Coconsult products and projects from deliveries whose code belongs to the client. Status is shown as it is. A demo request is an email that names the solution.',
    blocks: [
      { type: 'work', source: 'solutions', title: 'Entries maintained in the site configuration', intro: 'Titles, order, visibility and copy change in a single data file.' },
      { type: 'note', text: 'Illustrations are diagrams. Until an authorised capture is provided, no image is presented as a real interface.' },
      { type: 'cta', title: 'Request the demo that matches your context.', text: 'Each card opens an email whose subject line carries the solution name.', primary: 'project' },
    ],
  },
  cases: {
    key: 'cases',
    metaTitle: 'Engineering case studies | Coconsult',
    description:
      'Business applications delivered by Coconsult: a document system transferred to the client, and a sports operations platform. Verified facts only.',
    eyebrow: 'CASE STUDIES',
    h1: 'What delivered projects allow us to say.',
    intro:
      'We publish only what we can stand behind: the kind of system, the status of the code, and a general sector. No invented quotes and no metrics we are not allowed to share.',
    blocks: [
      { type: 'work', source: 'cases', title: 'References, explained', intro: 'A case stays anonymous when commercial detail is not publishable.' },
      {
        type: 'prose',
        title: 'How to read these entries',
        paragraphs: [
          'A client delivery is not a product to relicense. When the code was transferred, Coconsult does not sell it again.',
          'A platform described without its customer remains engineering experience. It is not offered as a white-label product ready for resale.',
        ],
      },
      { type: 'cta', title: 'A similar project starts from yours.', text: 'Describe the system to build or to stabilise. We will say whether the experience is relevant.', primary: 'project' },
    ],
  },
  about: {
    key: 'about',
    metaTitle: 'About Coconsult | Paris and Sfax',
    description:
      'Coconsult is a French IT consulting and software engineering company founded in 2018, working from Paris and Sfax.',
    eyebrow: 'ABOUT',
    h1: 'An engineering company between Paris and Sfax.',
    intro:
      'Coconsult is a French consulting and software engineering company, founded in 2018. It designs, integrates and runs business applications, with a team in Sfax and presales and engineering capacity in France.',
    blocks: [
      {
        type: 'columns',
        title: 'How the company works',
        items: [
          { title: 'Scoping close to the client', text: 'Needs, constraints and priorities are understood with your team, from France when that is the right relay.' },
          { title: 'Delivery in Sfax', text: 'The Tunisian team carries a substantial share of the engineering, against the scope that was agreed.' },
          { title: 'Independent specialists', text: 'Independent consultants can complete a setup. They are engaged for a need, not to inflate a published headcount.' },
        ],
      },
      {
        type: 'prose',
        title: 'What the company sells',
        paragraphs: [
          'Fixed-scope projects when the scope allows it, integration into existing systems, dedicated teams, testing and payments missions, and support for business solutions still being built.',
          'The site exists to qualify a commercial conversation. It is not a catalogue of every product idea, and it is not a recruiting marketplace.',
        ],
      },
      {
        type: 'list',
        title: 'Public facts',
        items: [
          'Founded in 2018',
          'Present in Paris and Sfax',
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
          { title: 'Technical partner', text: 'A vendor, integrator or host: the collaboration is about a specific component, not an exchanged logo.' },
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
      { type: 'note', text: 'No partner is displayed until they have explicitly allowed the citation.' },
      { type: 'cta', title: 'Propose a pilot or a partnership.', text: 'The subject line keeps this request distinct from a standard engineering project.', primary: 'partnership' },
    ],
  },
  contact: {
    key: 'contact',
    metaTitle: 'Contact Coconsult | Project, team, QA, demo',
    description:
      'Email contact@coconsult.fr. Pick the intent: project, dedicated team, QA, payments, automation, AI, demo or partnership.',
    eyebrow: 'CONTACT',
    h1: 'One email, with the right subject.',
    intro:
      'The site does not store a form. Each button opens your mail client with a subject and a short prompt. The address contact@coconsult.fr is on the page if you prefer to copy it.',
    blocks: [
      {
        type: 'inquiries',
        title: 'Choose the intent',
        intro: 'The subject changes with the button. You can edit the draft before sending.',
        ids: ['project', 'team', 'qaDiscuss', 'qaTeam', 'payments', 'automation', 'ai', 'partnership'],
      },
      {
        type: 'prose',
        title: 'Demos',
        paragraphs: [
          'Demo requests start from the solution cards. The subject includes the solution name, so the message arrives already qualified.',
        ],
      },
      { type: 'note', text: 'Do not send secrets, card data or customer files in this first message. A suitable channel is agreed later if the topic requires it.' },
    ],
  },
  legal: legalPage('en'),
  privacy: privacyPage('en'),
};
