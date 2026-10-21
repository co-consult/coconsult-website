import type { PageContent, RouteKey } from '@/content/types';
import { legalPage, privacyPage } from '@/content/legal-pages';

export const pages: Record<RouteKey, PageContent> = {
  home: {
    key: 'home',
    metaTitle: 'Coconsult — Ingénierie logicielle, intelligence artificielle et équipes tech',
    description:
      'Coconsult conçoit, développe et modernise des solutions numériques : logiciel, IA et data, qualité, cloud et DevOps, avec des équipes adaptées au projet.',
    eyebrow: 'INGÉNIERIE LOGICIELLE · IA · ÉQUIPES TECH',
    h1: 'De l’intelligence artificielle aux applications métier.',
    h1Accent: 'Nous construisons vos solutions numériques.',
    intro:
      'Coconsult conçoit, développe et modernise les systèmes de ses clients. Des équipes d’ingénierie, en France et avec Coconsult Nearshore à Sfax, mènent le projet jusqu’à la mise en production.',
    heroPrimary: 'project',
    heroExplore: true,
    hero: {
      facts: ['Intelligence artificielle', 'Développement logiciel', 'Équipes en France et à Sfax'],
      diagramTitle: 'ÉCOSYSTÈME D’INGÉNIERIE',
      centerTitle: 'Votre système',
      centerSub: 'Concevoir · Développer · Moderniser',
      nodes: ['IA et data', 'Développement logiciel', 'Cloud et DevOps', 'Qualité et sécurité'],
      note: 'Quatre univers, un même interlocuteur de cadrage.',
    },
    blocks: [
      {
        type: 'cards',
        title: 'Nos expertises',
        intro: 'De l’IA aux applications métier, chaque expertise répond à un problème concret : livrer, fiabiliser ou moderniser un système déjà utile.',
        layout: 'bento',
        items: [
          {
            kicker: '01',
            title: 'Intelligence artificielle et data',
            text: 'IA générative, intégration de modèles, agents et automatisation intelligente, au service de vos données et de vos processus.',
            hrefKey: 'ai',
          },
          {
            kicker: '02',
            title: 'Développement logiciel',
            text: 'Applications web et mobiles, API, backends et intégration dans le système que vous exploitez déjà.',
            hrefKey: 'software',
          },
          {
            kicker: '03',
            title: 'QA et testing',
            text: 'Tests fonctionnels, API, non-régression et automatisation, pour livrer un logiciel que vos équipes peuvent tenir.',
            hrefKey: 'qa',
          },
          {
            kicker: '04',
            title: 'Cloud et DevOps',
            text: 'Infrastructures cloud, CI/CD, conteneurs et observabilité, pour tenir la mise en production.',
            hrefKey: 'cloud',
          },
          {
            kicker: '05',
            title: 'Cybersécurité',
            text: 'Sécurisation des applications, des accès et des systèmes, dans le périmètre du projet.',
            hrefKey: 'cyber',
          },
          {
            kicker: '06',
            title: 'Intégration et processus',
            text: 'API, connecteurs et workflows entre les outils qui forcent encore la ressaisie.',
            hrefKey: 'automation',
          },
        ],
      },
      {
        type: 'challenge',
        title: 'Quel est votre défi ?',
        intro: 'Indiquez ce qui bloque. L’expertise utile, un cas d’usage et une façon de travailler ensemble s’affichent.',
        items: [
          {
            id: 'ai',
            label: 'Intégrer l’IA',
            expertise: 'Intelligence artificielle et data',
            expertiseKey: 'ai',
            useCase: 'Brancher un modèle sur un processus déjà connu : droits d’accès, traçabilité et un cas d’usage limité avant d’élargir.',
            mode: 'Un pilote au forfait, ou une équipe le temps du cadrage.',
            inquiry: 'ai',
          },
          {
            id: 'app',
            label: 'Développer une application',
            expertise: 'Développement logiciel',
            expertiseKey: 'software',
            useCase: 'Une application web ou mobile reliée à vos API et à vos règles métier, jusqu’à une version que vos équipes exploitent.',
            mode: 'Forfait si le périmètre est clair. Sinon, régie ou équipe dédiée.',
            inquiry: 'project',
          },
          {
            id: 'team',
            label: 'Renforcer mon équipe',
            expertise: 'Équipes dédiées',
            expertiseKey: 'dedicated',
            useCase: 'Des ingénieurs qui rejoignent votre delivery, avec un cadrage depuis la France.',
            mode: 'Régie ou équipe dédiée. Le nearshore se fait avec Coconsult Nearshore, société distincte à Sfax.',
            inquiry: 'team',
          },
          {
            id: 'quality',
            label: 'Améliorer la qualité logicielle',
            expertise: 'QA et testing',
            expertiseKey: 'qa',
            useCase: 'Campagnes fonctionnelles, tests d’API et non-régression, d’abord sur un pilote que vous pouvez juger.',
            mode: 'Renfort QA ou équipe dédiée.',
            inquiry: 'qaDiscuss',
          },
          {
            id: 'infra',
            label: 'Moderniser mon infrastructure',
            expertise: 'Cloud et DevOps',
            expertiseKey: 'cloud',
            useCase: 'Chaîne de livraison, environnements et observabilité pour une application déjà en production.',
            mode: 'Conseil pour le cadrage, puis une équipe si la plateforme le demande.',
            inquiry: 'project',
          },
        ],
      },
      {
        type: 'columns',
        title: 'Modes d’intervention',
        layout: 'rail',
        intro: 'Cinq façons de mener le projet, selon le périmètre et le rythme. Coconsult accompagne ses clients depuis la France et collabore avec Coconsult Nearshore, une société tunisienne juridiquement indépendante basée à Sfax, pour mobiliser des compétences d’ingénierie et constituer des équipes dédiées.',
        items: [
          { title: 'Régie', text: 'Un ou plusieurs ingénieurs en assistance technique, le temps d’un palier de delivery.' },
          { title: 'Équipes dédiées', text: 'Une squad stable quand le backlog justifie un dispositif continu.' },
          { title: 'Développement nearshore', text: 'Des compétences techniques mobilisées avec Coconsult Nearshore, société tunisienne indépendante basée à Sfax.' },
          { title: 'Projet au forfait', text: 'Un périmètre assez clair pour être estimé, livré et réceptionné.' },
          { title: 'Conseil et accompagnement', text: 'Architecture, analyse métier et pilotage technique lorsque le projet le demande.' },
        ],
      },
      {
        type: 'columns',
        title: 'Domaines d’expérience',
        intro: 'Des secteurs où Coconsult a déjà conçu, intégré ou fiabilisé des systèmes.',
        items: [
          { title: 'Banque, finance et paiements', text: 'Parcours transactionnels, intégration d’API de paiement et fiabilité des flux.' },
          { title: 'E-commerce et retail', text: 'Parcours d’achat, catalogues et opérations reliés aux systèmes déjà en place.' },
          { title: 'Industrie et processus', text: 'ERP, documents et workflows lorsque la double saisie et les circuits manuels coûtent du temps.' },
          { title: 'Santé et pharmacie', text: 'COPHARIA, ERP métier pharmaceutique en cours de développement.' },
          { title: 'Plateformes digitales', text: 'Produits à usage réel : membres, opérations, contenus et paiements sur une même base.' },
        ],
      },
      {
        type: 'work',
        source: 'cases',
        title: 'Réalisations sélectionnées',
        intro: 'Deux systèmes livrés : le contexte, l’enjeu et ce que Coconsult a réalisé.',
      },
      {
        type: 'work',
        source: 'solutions',
        title: 'Solutions développées par Coconsult',
        intro: 'COPHARIA est un ERP pharmaceutique encore en développement, distinct des projets déjà livrés.',
      },
      {
        type: 'columns',
        title: 'Pourquoi travailler avec Coconsult',
        items: [
          { title: 'Innovation utile', text: 'L’IA et les nouvelles architectures s’appliquent à un processus que vos équipes utilisent déjà.' },
          { title: 'Exécution', text: 'Développement, qualité, cloud ou intégration, menés jusqu’à une mise en production que vos équipes peuvent tenir.' },
          { title: 'Un cadre clair', text: 'Le devis, le contrat et la facture identifient la société qui contracte avec le client.' },
        ],
      },
      {
        type: 'cta',
        title: 'Parlons du projet que vous avez en tête.',
        text: 'Développement, IA, qualité, cloud ou équipe : décrivez le besoin, nous revenons vers vous.',
        primary: 'project',
        secondary: 'team',
      },
    ],
  },
  services: {
    key: 'services',
    metaTitle: 'Expertises | Coconsult',
    description:
      'Intelligence artificielle, développement, qualité, cloud, cybersécurité et intégration, pour concevoir et faire tenir vos systèmes.',
    eyebrow: 'EXPERTISES',
    h1: 'Les expertises techniques de Coconsult.',
    intro:
      'Quand un système doit intégrer l’IA, évoluer, tenir en production ou relier des outils qui ne se parlent pas, ces six expertises couvrent le travail technique. La façon de collaborer se choisit ensuite, selon le périmètre.',
    blocks: [
      {
        type: 'cards',
        title: 'Six expertises',
        items: [
          { kicker: 'IA', title: 'Intelligence artificielle et data', text: 'IA générative, modèles, agents et automatisation intelligente, branchés sur vos données et vos droits d’accès.', hrefKey: 'ai' },
          { kicker: 'Logiciel', title: 'Développement logiciel', text: 'Web, mobile, API, backends et intégration dans les systèmes déjà en production.', hrefKey: 'software' },
          { kicker: 'Qualité', title: 'QA et testing', text: 'Tests fonctionnels, API, non-régression et automatisation, avec un pilote avant d’élargir l’équipe.', hrefKey: 'qa' },
          { kicker: 'Cloud', title: 'Cloud et DevOps', text: 'Infrastructures, CI/CD, conteneurs et observabilité, pour tenir la mise en production.', hrefKey: 'cloud' },
          { kicker: 'Sécurité', title: 'Cybersécurité', text: 'Durcissement des applications, des accès et des systèmes exposés, dans le périmètre du projet.', hrefKey: 'cyber' },
          { kicker: 'Processus', title: 'Intégration et processus', text: 'Connecteurs et workflows entre ERP, documents et outils métier.', hrefKey: 'automation' },
        ],
      },
      {
        type: 'prose',
        title: 'À qui s’adressent ces services',
        paragraphs: [
          'Directions des systèmes d’information, CTO, responsables d’ingénierie, responsables produit, opérations et qualité. Des entreprises qui ont un système à faire évoluer, fiabiliser ou ouvrir à de nouveaux usages, dont l’IA.',
          'Les modalités se choisissent après échange : régie, équipe dédiée ou projet au forfait. Les disponibilités, la langue de travail et le chevauchement horaire se confirment au cadrage.',
          'Lorsque des compétences sont mobilisées à Sfax, c’est avec Coconsult Nearshore, société tunisienne juridiquement indépendante. Le devis nomme la société qui contracte avec le client.',
        ],
      },
      { type: 'cta', title: 'Décrire le besoin suffit pour commencer.', text: 'Indiquez le sujet dans votre message. Nous revenons vers vous pour un premier échange.', primary: 'project', secondary: 'team' },
    ],
  },
  dedicated: {
    key: 'dedicated',
    metaTitle: 'Équipes d’ingénierie dédiées | Coconsult',
    description:
      'Constitution d’équipes Java, Angular, full-stack et DevOps entre la France et Sfax. Cadrage, sélection, entretien et pilotage.',
    eyebrow: 'ÉQUIPES DÉDIÉES',
    h1: 'Constituer une équipe d’ingénierie adaptée au besoin réel.',
    intro:
      'Coconsult accompagne ses clients depuis la France et collabore avec Coconsult Nearshore, une société tunisienne juridiquement indépendante basée à Sfax, pour mobiliser des compétences d’ingénierie et constituer des équipes dédiées. Des consultants indépendants complètent un dispositif lorsque le besoin le justifie. Tous les profils ne sont pas disponibles immédiatement.',
    blocks: [
      {
        type: 'columns',
        title: 'À qui cela sert',
        items: [
          { title: 'Renfort ciblé', text: 'Un ou plusieurs ingénieurs Java/Spring, Angular, full-stack ou cloud/DevOps, le temps d’un palier de delivery.' },
          { title: 'Équipe dédiée', text: 'Une squad stable, avec coordination France–Tunisie, quand le backlog justifie un dispositif continu.' },
          { title: 'Projet au forfait', text: 'Possible lorsque le périmètre est assez clair pour être estimé. Sinon, nous recommandons un cadre en régie ou en équipe.' },
        ],
      },
      {
        type: 'list',
        title: 'Profils que nous pouvons chercher',
        items: [
          'Ingénierie logicielle Java / Spring et full-stack',
          'Front Angular lorsque le produit existant s’appuie dessus',
          'Cloud et DevOps, selon la plateforme déjà en place',
          'Spécialistes ponctuels, uniquement si le profil est disponible ou recruté pour la mission',
        ],
      },
      {
        type: 'steps',
        title: 'De la demande au rythme de croisière',
        items: [
          { title: 'Découverte', text: 'Contexte, stack, séniorité attendue, langue, chevauchement horaire et mode de collaboration.' },
          { title: 'Sourcing et sélection', text: 'Recherche dans l’équipe et, si besoin, auprès de consultants indépendants. Chaque profil proposé est décrit avec son niveau et son expérience.' },
          { title: 'Entretien avec vous', text: 'Vous rencontrez les personnes proposées avant un démarrage.' },
          { title: 'Onboarding', text: 'Accès, référents, outils et périmètre des premières semaines, définis avec vos équipes.' },
          { title: 'Coordination', text: 'Un suivi entre la France et Sfax : priorités, blocages, qualité de ce qui est livré.' },
          { title: 'Évolution', text: 'Le dispositif peut s’élargir ou se resserrer. Le délai de mise à disposition se confirme au cadrage, selon les profils disponibles.' },
        ],
      },
      {
        type: 'note',
        text: 'Le devis, le contrat et la facture identifient la société qui contracte avec le client. Les ingénieurs situés à Sfax ne sont pas, du seul fait de cette collaboration, salariés de COCONSULT SAS.',
      },
      { type: 'cta', title: 'Décrivez l’équipe dont vous avez besoin.', text: 'Stack, séniorité, durée envisagée et mode de travail : ces éléments suffisent pour un premier échange.', primary: 'team', secondary: 'project' },
    ],
  },
  qa: {
    key: 'qa',
    metaTitle: 'Équipes QA et tests logiciels | Coconsult',
    description:
      'Tests fonctionnels, exploratoires, non-régression et API. Coconsult propose un pilote QA, puis élargit l’équipe si le volume le justifie.',
    eyebrow: 'QA & TESTING',
    h1: 'Des équipes de test que vous pouvez faire grandir après un pilote.',
    intro:
      'Vous confiez un besoin de test, nous proposons des profils qualifiés, vous les évaluez, puis un pilote de taille raisonnable démarre. L’équipe n’augmente qu’ensuite, si le rythme et la qualité conviennent.',
    blocks: [
      {
        type: 'columns',
        title: 'Pour qui',
        intro: 'CTO, VP Engineering, Engineering Managers, QA leads et responsables produit, en France ou à l’international.',
        items: [
          { title: 'Produit déjà en service', text: 'Le risque principal est une régression ou un parcours métier mal couvert au moment d’une mise en production.' },
          { title: 'Équipe interne saturée', text: 'Le renfort prend une partie des campagnes, des scénarios ou de l’exécution, sous votre gouvernance.' },
          { title: 'Lancement ou palier', text: 'Un besoin daté, avec un périmètre de test que l’on peut expliquer en quelques parcours.' },
        ],
      },
      {
        type: 'cards',
        title: 'Trois façons de renforcer la qualité',
        items: [
          { kicker: 'Renfort', title: 'Staff augmentation', text: 'Une ou plusieurs personnes rejoignent votre rituel de test existant. Vous gardez la priorité du backlog.' },
          { kicker: 'Équipe', title: 'Équipe QA dédiée', text: 'Un noyau stable, avec un point de coordination, lorsque les campagnes sont continues.' },
          { kicker: 'Périmètre', title: 'Projet QA cadré', text: 'Une mission bornée : stratégie de test, campagne de non-régression ou préparation d’une mise en production.' },
        ],
      },
      {
        type: 'list',
        title: 'Ce que l’équipe peut prendre en charge',
        items: [
          'Tests fonctionnels et exploratoires sur les parcours métier',
          'Scénarios de non-régression, écrits pour être rejoués',
          'Tests d’API lorsque les contrats d’interface sont connus',
          'Appui à la stratégie QA : risques, environnements, jeux d’essai',
          'Automatisation seulement si les profils affectés ont cette compétence',
          'Intégration dans votre chaîne CI/CD lorsque la mission le prévoit et que les accès sont ouverts',
        ],
      },
      {
        type: 'steps',
        title: 'Quatre étapes',
        intro: 'Le premier résultat est une proposition de pilote, après avoir vu le produit et le rythme de livraison.',
        items: [
          { title: 'Discovery', text: 'Produit, risques, environnements, langue de travail, fuseau et ce qu’une première période doit démontrer.' },
          { title: 'Matching et proposition', text: 'Profils proposés avec leur niveau réel. Vous les interviewez. La proposition décrit le pilote et les personnes que vous rencontrez.' },
          { title: 'Pilote et onboarding', text: 'Accès limités aux environnements que vous ouvrez, référent, rituels et premiers scénarios. La taille de départ reste celle que le pilote peut absorber.' },
          { title: 'Delivery et reporting', text: 'Anomalies qualifiées, avancement des campagnes, points de blocage. L’élargissement de l’équipe se décide ensuite, sur la base de ce premier cycle.' },
        ],
      },
      {
        type: 'columns',
        title: 'Gouvernance, langue et accès',
        items: [
          { title: 'Pilotage', text: 'Un interlocuteur côté Coconsult suit le périmètre avec votre QA lead ou votre responsable d’ingénierie. Les priorités restent les vôtres.' },
          { title: 'Anglais', text: 'Une coordination en anglais est possible pour un client international. Le niveau attendu des profils se valide pendant le cadrage, il n’est pas affirmé d’avance pour toute l’équipe.' },
          { title: 'Sécurité', text: 'Les accès sont ceux que vous accordez, de préférence au minimum utile. Nous ne demandons pas de données de production si un environnement de test suffit.' },
          { title: 'Horaires', text: 'Le chevauchement France, Tunisie et, le cas échéant, États-Unis se fixe avec vous. Il n’est pas identique pour chaque mission.' },
        ],
      },
      {
        type: 'faq',
        title: 'Questions utiles avant un premier échange',
        items: [
          { q: 'Par quelle taille commencer ?', a: 'Par un pilote que vos équipes peuvent intégrer et évaluer. La taille se décide après avoir vu le produit et votre façon de travailler.' },
          { q: 'Le travail est-il à distance ?', a: 'Oui. Les accès, les outils et les créneaux communs sont définis avec vous. Une présence sur site n’est pas le mode par défaut.' },
          { q: 'Quels types de tests ?', a: 'Fonctionnels, exploratoires, non-régression et API en priorité. L’automatisation et la CI/CD dépendent des profils retenus et de votre chaîne existante.' },
          { q: 'Comment les profils sont-ils évalués ?', a: 'Sélection interne, puis entretien avec vous avant démarrage. Un profil qui ne correspond pas ne rejoint pas le pilote.' },
          { q: 'Comment l’équipe évolue-t-elle ?', a: 'Après le pilote, on peut ajouter des personnes si le volume le justifie et si les profils sont disponibles. L’inverse est tout aussi possible.' },
        ],
      },
      { type: 'cta', title: 'Parler du besoin de test, puis des profils.', text: 'Deux portes d’entrée : cadrer le sujet, ou demander une équipe pour un pilote.', primary: 'qaDiscuss', secondary: 'qaTeam' },
    ],
  },
  payments: {
    key: 'payments',
    metaTitle: 'Ingénierie des paiements et API transactionnelles | Coconsult',
    description:
      'Intégration de prestataires de paiement, parcours transactionnels, idempotence, reprises et observabilité.',
    eyebrow: 'PAIEMENTS',
    h1: 'Fiabiliser les parcours de paiement et les API qui les portent.',
    intro:
      'Coconsult conçoit et intègre des parcours transactionnels dans des applications existantes : appels à un prestataire, statuts, reprises et supervision.',
    blocks: [
      {
        type: 'columns',
        title: 'Problèmes traités',
        items: [
          { title: 'Double débit ou double appel', text: 'Clés d’idempotence et règles de rejeu lorsque le client ou le réseau répète une demande.' },
          { title: 'Timeouts ambigus', text: 'Un délai dépassé n’est pas un échec certain. Le parcours doit pouvoir interroger un statut et reprendre proprement.' },
          { title: 'Écarts de caisse', text: 'Le rapprochement se définit avec vos fichiers et vos API, selon le contexte réel des opérations.' },
          { title: 'Backends à moderniser', text: 'Services Java et contrats d’API rendus plus explicites, sans réécrire l’ensemble du système si ce n’est pas utile.' },
        ],
      },
      {
        type: 'diagram',
        title: 'D’un clic jusqu’au suivi d’exploitation',
        caption: 'Parcours type d’un paiement, du clic jusqu’au suivi d’exploitation.',
        steps: [
          { title: 'Parcours', text: 'L’utilisateur confirme un paiement dans votre application.' },
          { title: 'Contrôle', text: 'Montant, référence unique, délai maximal et règle si la même demande revient.' },
          { title: 'Prestataire', text: 'Appel d’API, puis lecture du statut : accepté, refusé, en attente ou inconnu.' },
          { title: 'Exploitation', text: 'Journal, alerte et rapprochement avec vos opérations, selon les données que vous pouvez légitimement conserver.' },
        ],
      },
      {
        type: 'list',
        title: 'Ce que Coconsult livre',
        items: [
          'Cadrage du parcours et des cas d’erreur',
          'Intégration d’API de paiement dans votre backend',
          'Règles de timeout, de retry et d’idempotence adaptées au contrat du prestataire',
          'Tests des cas nominaux et des cas dégradés',
          'Points d’observabilité utiles à l’exploitation',
        ],
      },
      { type: 'cta', title: 'Un diagnostic tient en un échange ciblé.', text: 'Décrivez le parcours, le prestataire envisagé et le symptôme actuel : double appel, statut incertain ou écart d’exploitation.', primary: 'payments' },
    ],
  },
  automation: {
    key: 'automation',
    metaTitle: 'Automatisation métier et intégration de systèmes | Coconsult',
    description:
      'Diagnostic, API, connecteurs et workflows entre ERP, GED et outils métier. L’objectif est de réduire la double saisie là où les règles sont stables.',
    eyebrow: 'AUTOMATISATION',
    h1: 'Relier les outils qui forcent encore vos équipes à ressaisir.',
    intro:
      'Pour les DSI, les opérations, la qualité et les PME industrielles ou de services : quand l’ERP, la GED et la messagerie ne se parlent pas, le travail se perd dans des copies et des validations informelles.',
    blocks: [
      {
        type: 'list',
        title: 'Situations que nous rencontrons',
        items: [
          'Les mêmes données sont saisies dans deux outils',
          'L’ERP, la GED ou SharePoint vivent chacun de leur côté',
          'Un circuit de validation s’arrête dans une boîte mail',
          'Les documents circulent sans historique exploitable',
          'Une intégration existante échoue sans que l’équipe sache où',
          'Le workflow réel ne rentre dans aucun module standard',
        ],
      },
      {
        type: 'steps',
        title: 'Ce que nous faisons',
        items: [
          { title: 'Diagnostic', text: 'Cartographier le circuit réel, les outils et les erreurs qui coûtent du temps.' },
          { title: 'Interfaces', text: 'API, connecteurs ou échanges de fichiers, choisis selon ce que les systèmes savent déjà faire.' },
          { title: 'Orchestration', text: 'Étapes, statuts et relances lorsque le processus traverse plusieurs équipes.' },
          { title: 'Dématérialisation', text: 'Documents rattachés au dossier métier, avec une trace des actions utiles.' },
          { title: 'Supervision', text: 'Savoir qu’un flux est en échec avant que le client ou l’atelier ne le découvre.' },
        ],
      },
      {
        type: 'prose',
        title: 'Collaboration',
        paragraphs: [
          'Le travail démarre par les irritants mesurables, pas par un remplacement général des outils. Un ERP en place reste la référence s’il fait correctement son métier.',
          'Nous livrons un périmètre que vos équipes peuvent exploiter : règles écrites, journaux et un interlocuteur pendant la mise en route.',
        ],
      },
      { type: 'cta', title: 'Décrivez le circuit qui coince.', text: 'Un exemple concret — une commande, un dossier, une validation — suffit pour voir si un diagnostic a du sens.', primary: 'automation' },
    ],
  },
  ai: {
    key: 'ai',
    metaTitle: 'Intégration d’IA pour systèmes d’entreprise | Coconsult',
    description:
      'Coconsult intègre des outils d’IA existants dans vos applications : permissions, traçabilité et cas d’usage cadrés.',
    eyebrow: 'INTELLIGENCE ARTIFICIELLE ET DATA',
    h1: 'Mettre l’IA au service d’un processus que vous connaissez.',
    intro:
      'Génération, intégration de modèles, agents et automatisation intelligente. Le cas d’usage, les droits d’accès et la traçabilité se cadrent avant le pilote, dans vos applications existantes.',
    blocks: [
      {
        type: 'columns',
        title: 'Ce qui est dans le périmètre',
        items: [
          { title: 'Outils déjà disponibles', text: 'Connexion d’un service d’IA que vous avez le droit d’utiliser, via les API et le cadre d’accès prévus.' },
          { title: 'Permissions', text: 'L’assistant ne voit que les données autorisées pour l’utilisateur et le dossier en cours.' },
          { title: 'Identité', text: 'Raccordement à votre SSO lorsque le projet le prévoit, plutôt qu’un compte partagé.' },
          { title: 'Traçabilité', text: 'Journal des actions utiles à l’exploitation et au contrôle interne, défini avec vous.' },
        ],
      },
      {
        type: 'list',
        title: 'Comment un cas d’usage est retenu',
        items: [
          'Le gain attendu est décrit sur un processus existant',
          'Les données concernées et leur sensibilité sont identifiées',
          'Un humain reste responsable de la décision métier',
          'Le coût d’une erreur est acceptable ou encadré par une revue',
          'Le pilote a une fin : on mesure, on étend, ou on arrête',
        ],
      },
      {
        type: 'prose',
        title: 'Sécurité et données',
        paragraphs: [
          'La confidentialité et le RGPD se traitent pour le projet concerné, selon les bases légales applicables. Brancher un modèle ne rend pas, à lui seul, un traitement conforme.',
          'L’intégration s’appuie sur des services d’IA que vous êtes autorisé à utiliser. Coconsult ne commercialise pas un assistant conversationnel propriétaire clé en main.',
        ],
      },
      { type: 'cta', title: 'Un diagnostic cadré, avant toute intégration.', text: 'Décrivez le processus, les données en jeu et l’outil que vous envisagez. Nous dirons si un pilote est raisonnable.', primary: 'ai' },
    ],
  },
  solutions: {
    key: 'solutions',
    metaTitle: 'Solutions Coconsult | COPHARIA',
    description:
      'COPHARIA, ERP métier pharmaceutique en cours de développement. Une démonstration se demande depuis la page Contact.',
    eyebrow: 'SOLUTIONS',
    h1: 'Les solutions que Coconsult construit.',
    intro:
      'COPHARIA est un ERP métier pour la pharmacie, encore en développement. Une démonstration se demande en nommant cette solution.',
    blocks: [
      { type: 'work', source: 'solutions', title: 'En développement', intro: 'COPHARIA est présentée avec son statut réel : une solution en développement.' },
      { type: 'cta', title: 'Demander une démonstration de COPHARIA.', text: 'Indiquez votre contexte. Nous revenons vers vous pour convenir d’un échange.', primary: 'demo' },
    ],
  },
  cases: {
    key: 'cases',
    metaTitle: 'Réalisations d’ingénierie | Coconsult',
    description:
      'Applications métier livrées par Coconsult : une gestion documentaire remise au client, et une plateforme d’opérations sportives.',
    eyebrow: 'RÉALISATIONS',
    h1: 'Des systèmes livrés, décrits avec précision.',
    intro:
      'Deux expériences vérifiées. Les clients ne sont pas nommés. Le contexte, l’enjeu et le résultat sont ceux du projet réel.',
    blocks: [
      { type: 'work', source: 'cases', title: 'Projets livrés' },
      {
        type: 'prose',
        paragraphs: [
          'Lorsqu’un logiciel a été remis au client, il n’est pas proposé comme un produit Coconsult.',
        ],
      },
      { type: 'cta', title: 'Un projet comparable se discute à partir du vôtre.', text: 'Décrivez le système à construire ou à fiabiliser. Nous dirons si le retour d’expérience est pertinent.', primary: 'project' },
    ],
  },
  about: {
    key: 'about',
    metaTitle: 'À propos de Coconsult | Paris et Sfax',
    description:
      'COCONSULT SAS, société française fondée en 2018, accompagne ses clients depuis Paris et collabore avec Coconsult Nearshore, société tunisienne indépendante basée à Sfax.',
    eyebrow: 'À PROPOS',
    h1: 'Une société d’ingénierie française, en collaboration avec Sfax.',
    intro:
      'Coconsult accompagne ses clients depuis la France et collabore avec Coconsult Nearshore, une société tunisienne juridiquement indépendante basée à Sfax, pour mobiliser des compétences d’ingénierie et constituer des équipes dédiées. Fondée en 2018, la société française conçoit, intègre et exploite des applications métier.',
    blocks: [
      {
        type: 'columns',
        title: 'La façon de travailler',
        items: [
          { title: 'Proximité de cadrage', text: 'Le besoin, les contraintes et les priorités se comprennent avec vos équipes, depuis la France lorsque c’est le bon relais.' },
          { title: 'Ingénierie à Sfax', text: 'Coconsult Nearshore peut mobiliser des compétences d’ingénierie sur le périmètre convenu. Les deux sociétés ont des dirigeants différents.' },
          { title: 'Renforts indépendants', text: 'Des consultants indépendants peuvent compléter un dispositif lorsque le besoin le justifie.' },
        ],
      },
      {
        type: 'prose',
        title: 'Ce que l’entreprise vend',
        paragraphs: [
          'Des projets au forfait lorsque le périmètre le permet, de l’intégration dans des systèmes existants, des équipes dédiées, des missions de test et d’ingénierie des paiements, et l’accompagnement de solutions métier en cours de construction.',
          'Le devis, le contrat et la facture identifient la société qui contracte avec le client.',
        ],
      },
      {
        type: 'list',
        title: 'Repères publics',
        items: [
          'Fondation en 2018',
          'Éditeur du site : COCONSULT SAS, Paris',
          'Collaboration avec Coconsult Nearshore, Sfax',
          'Contact : contact@coconsult.fr',
        ],
      },
      { type: 'cta', title: 'Rencontrer l’équipe sur un sujet concret.', text: 'Un message suffit pour proposer un créneau. Le contexte du projet compte plus qu’une présentation générale.', primary: 'project', secondary: 'partnership' },
    ],
  },
  partnerships: {
    key: 'partnerships',
    metaTitle: 'Partenariats et clients pilotes | Coconsult',
    description:
      'Coconsult accueille des clients pilotes et des partenaires commerciaux ou techniques. Le cadre, le périmètre et le statut du pilote sont écrits avant de commencer.',
    eyebrow: 'PARTENARIATS',
    h1: 'Pilotes et partenariats, avec un périmètre écrit.',
    intro:
      'Un pilote sert à vérifier qu’une solution en développement ou qu’un dispositif d’équipe répond à un cas réel. Un partenariat commercial ou technique se discute lorsque les rôles de chacun sont clairs.',
    blocks: [
      {
        type: 'columns',
        title: 'Trois portes d’entrée',
        items: [
          { title: 'Client pilote', text: 'Vous testez une solution en développement sur un périmètre limité, avec un statut affiché comme tel et une démonstration préalable.' },
          { title: 'Partenaire commercial', text: 'Vous apportez un accès à un marché ou à des opérations, et Coconsult apporte l’ingénierie. Le cadre se contractualise avant toute promesse commune.' },
          { title: 'Partenaire technique', text: 'Éditeur, intégrateur ou hébergeur : la collaboration porte sur une brique précise du système.' },
        ],
      },
      {
        type: 'list',
        title: 'Ce qu’un premier échange clarifie',
        items: [
          'Le cas d’usage et le secteur, décrits sans données confidentielles dans l’e-mail',
          'Ce que chaque partie fournit',
          'La durée envisagée du pilote',
          'Ce qui sera décidé à la fin : étendre, modifier ou arrêter',
        ],
      },
      { type: 'cta', title: 'Proposer un pilote ou un partenariat.', text: 'Le type de demande est déjà sélectionné lorsque vous arrivez depuis cette page.', primary: 'partnership' },
    ],
  },
  contact: {
    key: 'contact',
    metaTitle: 'Contacter Coconsult',
    description:
      'Décrivez votre projet à Coconsult. L’adresse contact@coconsult.fr est visible. Le type de besoin peut être prérempli depuis les pages du site.',
    eyebrow: 'CONTACT',
    h1: 'Décrivez votre besoin.',
    intro:
      'Indiquez le type de besoin et écrivez-nous. L’adresse est sur cette page ; vous pouvez aussi ouvrir votre messagerie.',
    blocks: [
      {
        type: 'inquiries',
        title: 'Votre demande',
        intro: 'Le sujet est déjà indiqué si vous arrivez depuis une expertise, une offre ou une solution.',
        ids: ['project', 'team', 'qaDiscuss', 'qaTeam', 'payments', 'automation', 'ai', 'partnership', 'demo'],
      },
      { type: 'note', text: 'Pour ce premier échange, restez sur le contexte du projet. Les données de cartes et les secrets se traitent ensuite sur un canal adapté.' },
    ],
  },
  software: {
    key: 'software',
    metaTitle: 'Développement logiciel | Coconsult',
    description:
      'Applications web et mobiles, API, backends et intégration. Coconsult conçoit et fait évoluer des logiciels métier.',
    eyebrow: 'DÉVELOPPEMENT LOGICIEL',
    h1: 'Concevoir et faire évoluer vos applications.',
    intro:
      'Web, mobile, backend, frontend et API. Le travail part du système en place et va jusqu’à une mise en production que vos équipes peuvent exploiter.',
    blocks: [
      {
        type: 'columns',
        title: 'Ce que couvre le développement',
        items: [
          { title: 'Applications', text: 'Interfaces web ou mobiles reliées aux règles métier et aux données dont vous disposez déjà.' },
          { title: 'API et intégration', text: 'Des contrats d’interface stables entre vos outils, avec reprises et observabilité lorsque le flux est critique.' },
          { title: 'Architecture', text: 'Un découpage lisible quand le produit grandit, sans refonte décorative.' },
        ],
      },
      {
        type: 'list',
        title: 'Interventions concrètes',
        items: [
          'Faire évoluer une application web déjà en production',
          'Relier un mobile ou un portail au backend existant',
          'Stabiliser des API entre deux systèmes qui ne se parlent pas',
        ],
      },
      { type: 'cta', title: 'Décrivez le logiciel à construire ou à moderniser.', text: 'Stack, utilisateurs et contrainte de délai suffisent pour un premier échange.', primary: 'project' },
    ],
  },
  cloud: {
    key: 'cloud',
    metaTitle: 'Cloud, DevOps et sécurisation | Coconsult',
    description:
      'Infrastructures cloud, CI/CD, conteneurs, observabilité et sécurisation des accès pour les applications que vous exploitez.',
    eyebrow: 'CLOUD ET DEVOPS',
    h1: 'Mettre en production, puis tenir l’exploitation.',
    intro:
      'Cloud, chaînes de livraison, conteneurs et observabilité. La sécurisation des applications, des accès et des systèmes fait partie du même périmètre, lorsque le projet le demande.',
    blocks: [
      {
        type: 'columns',
        title: 'Le périmètre habituel',
        items: [
          { title: 'Plateforme', text: 'Environnements cloud alignés sur la façon dont l’application est réellement déployée.' },
          { title: 'Livraison', text: 'CI/CD et conteneurisation pour que chaque version soit reproductible.' },
          { title: 'Exploitation', text: 'Journaux, alertes et reprises, afin qu’un incident se voie avant vos utilisateurs.' },
          { title: 'Accès', text: 'Droits, secrets et durcissement des services exposés, limités au système concerné.' },
        ],
      },
      {
        type: 'list',
        title: 'Interventions concrètes',
        items: [
          'Rendre une chaîne de livraison reproductible',
          'Clarifier les environnements d’une application déjà déployée',
          'Rendre un incident visible avant que les utilisateurs ne le signalent',
        ],
      },
      { type: 'cta', title: 'Parler de la plateforme que vous exploitez.', text: 'Hébergement actuel, fréquence de livraison et point de douleur suffisent pour commencer.', primary: 'project' },
    ],
  },
  modes: {
    key: 'modes',
    metaTitle: 'Modes d’intervention | Coconsult',
    description:
      'Régie, équipes dédiées, développement nearshore, forfait et conseil, selon le périmètre et le rythme du projet.',
    eyebrow: 'MODES D’INTERVENTION',
    h1: 'Choisir la forme de la collaboration.',
    intro:
      'Selon le périmètre, le travail se fait en régie, en équipe dédiée, en nearshore, au forfait ou en conseil. La même équipe peut porter le développement, l’IA, la qualité ou le cloud.',
    blocks: [
      {
        type: 'columns',
        title: 'Cinq façons de travailler',
        items: [
          { title: 'Régie', text: 'Assistance technique d’un ou plusieurs ingénieurs, pour un palier identifié.' },
          { title: 'Équipes dédiées', text: 'Une squad suivie dans la durée, avec coordination depuis la France.' },
          { title: 'Développement nearshore', text: 'Compétences mobilisées avec Coconsult Nearshore, à Sfax. Les deux sociétés sont juridiquement distinctes.' },
          { title: 'Forfait', text: 'Un périmètre estimable, avec un résultat à réceptionner.' },
          { title: 'Conseil', text: 'Architecture, analyse métier et pilotage, lorsque le projet a besoin d’un cadrage avant ou pendant la réalisation.' },
        ],
      },
      {
        type: 'prose',
        paragraphs: [
          'Coconsult accompagne ses clients depuis la France et collabore avec Coconsult Nearshore, une société tunisienne juridiquement indépendante basée à Sfax, pour mobiliser des compétences d’ingénierie et constituer des équipes dédiées.',
          'Le devis, le contrat et la facture identifient la société qui contracte avec le client.',
        ],
      },
      { type: 'cta', title: 'Décrire l’équipe ou le cadre qui vous manque.', text: 'Nous proposons le mode d’intervention après avoir compris le périmètre.', primary: 'team', secondary: 'project' },
    ],
  },
  cyber: {
    key: 'cyber',
    metaTitle: 'Cybersécurité applicative | Coconsult',
    description:
      'Sécurisation des applications, des accès et des systèmes exposés, dans le périmètre du projet.',
    eyebrow: 'CYBERSÉCURITÉ',
    h1: 'Durcir les applications et les accès que vous exposez.',
    intro:
      'Vos applications, vos accès et vos secrets exposent une surface. Nous la réduisons dans le code et l’infrastructure du projet. Coconsult ne propose pas un centre de surveillance permanent.',
    blocks: [
      {
        type: 'columns',
        title: 'Interventions habituelles',
        items: [
          { title: 'Applications', text: 'Contrôles d’accès, validation des entrées et réduction de ce qu’une API expose.' },
          { title: 'Identités', text: 'Comptes, rôles et secrets alignés sur les personnes qui doivent réellement intervenir.' },
          { title: 'Plateforme', text: 'Durcissement des services publiés, en lien avec le cloud et la chaîne de livraison déjà en place.' },
        ],
      },
      {
        type: 'list',
        title: 'Interventions concrètes',
        items: [
          'Réduire ce qu’une API expose publiquement',
          'Revoir les rôles et les secrets d’une application',
          'Durcir un service déjà publié, avec l’équipe qui l’exploite',
        ],
      },
      { type: 'cta', title: 'Décrire le système à protéger.', text: 'L’application, les accès actuels et le risque que vous voyez suffisent pour un premier échange.', primary: 'project' },
    ],
  },
  legal: legalPage('fr'),
  privacy: privacyPage('fr'),
};
