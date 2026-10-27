import type { PageContent, RouteKey } from '@/content/types';
import { legalPage, privacyPage } from '@/content/legal-pages';

export const pages: Record<RouteKey, PageContent> = {
  home: {
    key: 'home',
    metaTitle: 'Développement logiciel, IA et cloud | Coconsult',
    description:
      'Applications web et mobiles, intégration d’IA et cloud : Coconsult conçoit et fait évoluer vos logiciels métier, jusqu’à la mise en production.',
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
    metaTitle: 'Développement, IA, cloud et qualité | Coconsult',
    description:
      'Développement logiciel, applications web et mobiles, cloud, data et IA, qualité, cybersécurité et équipes IT.',
    eyebrow: 'NOS OFFRES',
    h1: 'Six familles de solutions pour vos systèmes.',
    intro:
      'Chaque famille ouvre une page déjà publiée. Les modalités de collaboration viennent ensuite, selon le périmètre.',
    blocks: [
      {
        type: 'cards',
        title: 'Ce que nous construisons',
        items: [
          { kicker: 'Logiciel', title: 'Développement logiciel et solutions métiers', text: 'Applications métier, API, backends et intégration dans les systèmes déjà en production.', hrefKey: 'software', link: { label: 'Paiements', hrefKey: 'payments' } },
          { kicker: 'Applications', title: 'Applications web et mobiles', text: 'Interfaces web et mobiles, reliées aux services et aux systèmes déjà en place.', hrefKey: 'software' },
          { kicker: 'Cloud', title: 'Cloud, DevOps et infrastructure', text: 'Infrastructures, CI/CD, conteneurs et observabilité, pour tenir la mise en production.', hrefKey: 'cloud' },
          { kicker: 'Data', title: 'Data, IA et automatisation', text: 'IA générative, modèles, agents et automatisation, branchés sur vos données et vos droits d’accès.', hrefKey: 'ai', link: { label: 'Processus métier', hrefKey: 'automation' } },
          { kicker: 'Qualité', title: 'Qualité logicielle et cybersécurité', text: 'Tests fonctionnels, API et non-régression, et durcissement des applications, des accès et des systèmes exposés, dans le périmètre du projet. Coconsult ne propose pas un centre de surveillance permanent.', hrefKey: 'qa', link: { label: 'Cybersécurité', hrefKey: 'cyber' } },
          { kicker: 'Équipes', title: 'Équipes et expertise IT', text: 'Équipes dédiées coordonnées depuis la France. Lorsque des compétences sont mobilisées à Sfax, c’est avec Coconsult Nearshore, société tunisienne juridiquement indépendante.', hrefKey: 'dedicated' },
        ],
      },
      {
        type: 'columns',
        title: 'Des modèles de collaboration adaptés à vos projets',
        intro: 'Le devis, le contrat et la facture nomment la société qui contracte.',
        items: [
          { title: 'Régie', text: 'Un ou plusieurs ingénieurs, le temps d’un palier.' },
          { title: 'Forfait', text: 'Un périmètre clair, estimé puis réceptionné.' },
          { title: 'Équipe dédiée', text: 'Une squad suivie dans la durée, cadrée depuis la France.' },
          { title: 'Nearshore', text: 'Avec Coconsult Nearshore, société tunisienne juridiquement indépendante, à Sfax.' },
        ],
      },
      { type: 'cta', title: 'Décrire le besoin suffit pour commencer.', text: 'Indiquez le sujet dans votre message. Nous revenons vers vous pour un premier échange.', primary: 'project', secondary: 'team' },
    ],
  },
  dedicated: {
    key: 'dedicated',
    metaTitle: 'Équipes Java, Angular et full-stack | Coconsult',
    description:
      'Équipes dédiées Java, Angular, full-stack et DevOps, coordonnées depuis la France, avec Coconsult Nearshore à Sfax, société distincte.',
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
      {
        type: 'prose',
        title: 'Java, Angular et nearshore',
        paragraphs: [
          'Java et Spring sont des profils que nous pouvons chercher. Angular n’est proposé que lorsque le produit existant s’appuie déjà dessus. Un profil qui n’est pas disponible n’est pas annoncé comme prêt à démarrer.',
          'Le renfort à Sfax passe par Coconsult Nearshore, société tunisienne juridiquement indépendante. Ce n’est pas un établissement de COCONSULT SAS. Le contrat nomme la société qui s’engage.',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Modes d’intervention', text: 'Régie, équipe dédiée, nearshore ou forfait, selon le périmètre.', hrefKey: 'modes' },
          { title: 'Développement logiciel', text: 'Applications web, mobiles, API et intégration, portées par l’équipe.', hrefKey: 'software' },
          { title: 'Cloud et DevOps', text: 'Livraison, environnements et exploitation, lorsque le besoin est là.', hrefKey: 'cloud' },
          { title: 'Innovation et CII', text: 'Un prototype se cadre à part. L’agrément ne porte pas sur toute régie.', hrefKey: 'innovation' },
        ],
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
      'Systèmes de paiement, API transactionnelles, idempotence, reprises, paiements instantanés, tests et DevOps en environnement financier.',
    eyebrow: 'PAIEMENTS',
    h1: 'Fiabiliser les parcours de paiement et les API qui les portent.',
    intro:
      'Concevoir et intégrer des parcours transactionnels dans des applications existantes : appels à un prestataire, statuts, reprises et supervision, avec une expérience acquise en environnements bancaires et financiers.',
    blocks: [
      {
        type: 'columns',
        title: 'Ce que nous traitons',
        items: [
          { title: 'Systèmes de paiement', text: 'Parcours de paiement branchés sur des backends déjà en production, sans réécrire tout l’existant.' },
          { title: 'API transactionnelles', text: 'Contrats d’API, références uniques, lecture de statut et enchaînement des étapes métier.' },
          { title: 'Fiabilité, reprise et idempotence', text: 'Timeouts ambigus, rejeux et clés d’idempotence lorsque le client ou le réseau répète une demande.' },
          { title: 'Transactions et paiements instantanés', text: 'Contraintes de latence et de confirmation dans des flux où le statut doit rester cohérent.' },
          { title: 'Tests en environnement financier', text: 'Cas nominaux et dégradés : double appel, refus, attente, reprise après interruption.' },
          { title: 'DevOps bancaire', text: 'Livraison et observabilité adaptées à des environnements où la mise en production est contrôlée.' },
        ],
      },
      {
        type: 'columns',
        title: 'Problèmes clients fréquents',
        items: [
          { title: 'Double débit ou double appel', text: 'Clés d’idempotence et règles de rejeu lorsque la même demande revient.' },
          { title: 'Timeouts ambigus', text: 'Un délai dépassé n’est pas un échec certain. Le parcours doit pouvoir interroger un statut et reprendre proprement.' },
          { title: 'Écarts d’exploitation', text: 'Le rapprochement se définit avec vos fichiers et vos API, selon le contexte réel des opérations.' },
          { title: 'Backends à moderniser', text: 'Services et contrats d’API rendus plus explicites, sans réécriture totale si ce n’est pas utile.' },
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
    metaTitle: 'DataOps et IA générative en entreprise | Coconsult',
    description:
      'Fondations DataOps, tenues à part de l’IA générative : pipelines, qualité des données, intégration, automatisation et exploitation.',
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
          'Un agent n’est retenu que lorsque le processus, les données qu’il peut voir et la décision qui reste humaine sont déjà décrits. Sinon, le sujet n’est pas prêt pour un pilote.',
        ],
      },
      {
        type: 'prose',
        title: 'Fondations DataOps',
        paragraphs: [
          'DataOps n’est pas l’IA générative décrite au-dessus. L’IA branche un modèle sur un processus. Le DataOps, lorsqu’il est dans la mission, prépare les données que ce processus ou une application déjà en place doit consommer.',
          'Coconsult ne publie pas de plateforme DataOps et n’annonce aucune certification d’outil. Les sources, les contrôles et ce qui reste opéré par vos équipes se cadrent avant de commencer.',
        ],
      },
      {
        type: 'list',
        title: 'Dans le système que vous exploitez déjà',
        items: [
          'Pipelines de données : le chemin entre vos outils, avec une reprise quand un échange échoue',
          'Qualité des données : champs attendus, rejets et doublons, définis avec vous',
          'Intégration : raccordement aux applications et aux API que le projet doit alimenter',
          'Automatisation des traitements répétitifs, là où la règle est déjà connue',
          'Exploitation : journaux, échecs et reprise, pour les équipes qui font tourner le flux',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Développement logiciel', text: 'Faire évoluer l’application qui accueillera le cas d’usage.', hrefKey: 'software' },
          { title: 'Processus métier', text: 'Relier le flux aux outils et aux dossiers déjà en place.', hrefKey: 'automation' },
          { title: 'Équipe dédiée', text: 'Renforcer l’équipe qui portera le pilote, puis l’intégration.', hrefKey: 'dedicated' },
          { title: 'Innovation et CII', text: 'Un prototype nouveau se cadre à part. L’agrément ne rend pas le pilote éligible.', hrefKey: 'innovation' },
        ],
      },
      { type: 'cta', title: 'Un diagnostic cadré, avant toute intégration.', text: 'Décrivez le processus, les données en jeu et l’outil que vous envisagez. Nous dirons si un pilote est raisonnable.', primary: 'ai' },
    ],
  },
  sectors: {
    key: 'sectors',
    metaTitle: 'Secteurs d’expérience | Coconsult',
    description:
      'Environnements métier où l’ingénierie Coconsult a déjà été exercée : finance et paiements, mobilité, retail, médias, télécoms, sport, systèmes métier, et santé pharmaceutique en domaine émergent.',
    eyebrow: 'SECTEURS',
    h1: 'Notre ingénierie au service de vos métiers.',
    intro:
      'Finance, mobilité, retail, médias, télécoms, sport, systèmes métier et santé : des contextes où nos consultants ont déjà accompagné des projets d’ingénierie logicielle, de DevOps et de QA.',
    blocks: [],
  },
  solutions: {
    key: 'solutions',
    metaTitle: 'Solutions et plateformes | Coconsult',
    description:
      'COPHARIA, ERP pharmaceutique en développement, et des plateformes livrées : opérations sportives, gestion documentaire. Demandez une démonstration depuis Contact.',
    eyebrow: 'SOLUTIONS',
    h1: 'Les solutions que Coconsult construit.',
    intro:
      'Une solution Coconsult en cours de développement, et des plateformes déjà livrées. Les deux ne se confondent pas : le produit et les réalisations restent distincts.',
    blocks: [
      {
        type: 'work',
        source: 'solutions',
        title: 'Solutions Coconsult',
        intro: 'COPHARIA, ERP pharmaceutique en développement. Statut réel, vues anonymisées, démonstration sur demande.',
      },
      {
        type: 'work',
        source: 'platforms',
        title: 'Plateformes et réalisations',
        intro:
          'Des systèmes construits et livrés. Ce ne sont pas des SaaS commercialisés par Coconsult. Le contexte et le résultat sont décrits dans les études de cas.',
      },
      {
        type: 'cta',
        title: 'Demander une démonstration de COPHARIA.',
        text: 'Indiquez votre contexte. Nous revenons vers vous pour convenir d’un échange.',
        primary: 'demo',
        product: 'copharia',
      },
    ],
  },
  cases: {
    key: 'cases',
    metaTitle: 'Réalisations d’ingénierie | Coconsult',
    description:
      'Réalisations Coconsult : CSS Forever, plateforme sportive en service, et un logiciel métier livré dont les écrans ne sont pas publiés.',
    eyebrow: 'RÉALISATIONS',
    h1: 'Des systèmes livrés, décrits avec précision.',
    intro:
      'Deux réalisations documentées. CSS Forever est montré par trois écrans réels. L’autre logiciel a été livré avec cession du code source ; ses écrans ne sont pas publiés.',
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
          'Agrément CII n° 28910108, années 2026 à 2030, DRIEETS Île-de-France',
          'Collaboration avec Coconsult Nearshore, Sfax',
          'Contact : contact@coconsult.fr',
        ],
      },
      {
        type: 'prose',
        title: 'Agrément crédit d’impôt innovation',
        paragraphs: [
          'Une décision du 4 février 2026 de la DRIEETS Île-de-France accorde à COCONSULT, TVA FR90838913838, l’agrément n° 28910108 pour les années 2026, 2027, 2028, 2029 et 2030.',
          'Cet agrément reconnaît une capacité à réaliser des travaux d’innovation. Il ne décide pas qu’une mission est éligible, et il n’ouvre pas automatiquement un crédit d’impôt au client. Coconsult Nearshore, à Sfax, n’est pas titulaire de cette décision.',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Innovation et CII', text: 'Le cadre de l’agrément, et ce qu’il ne garantit pas.', hrefKey: 'innovation' },
          { title: 'Développement logiciel', text: 'Applications web, mobiles, API et logiciels métier.', hrefKey: 'software' },
          { title: 'Équipes dédiées', text: 'Java, Angular, full-stack ou DevOps, avec une société distincte à Sfax.', hrefKey: 'dedicated' },
        ],
      },
      { type: 'cta', title: 'Rencontrer l’équipe sur un sujet concret.', text: 'Un message suffit pour proposer un créneau. Le contexte du projet compte plus qu’une présentation générale.', primary: 'project', secondary: 'partnership' },
    ],
  },
  innovation: {
    key: 'innovation',
    metaTitle: 'Agrément CII et innovation logicielle | Coconsult',
    description:
      'Décision DRIEETS Île-de-France du 4 février 2026 : agrément n° 28910108 pour 2026-2030. Il ne rend pas un projet éligible au crédit d’impôt.',
    eyebrow: 'INNOVATION',
    h1: 'Accompagner un projet d’innovation logicielle.',
    intro:
      'COCONSULT conçoit et fait évoluer des logiciels. Une décision du 4 février 2026 de la DRIEETS Île-de-France lui accorde un agrément Crédit d’impôt innovation, n° 28910108, pour les années 2026 à 2030. Cet agrément ne décide pas, à lui seul, qu’un projet ouvre droit à un crédit d’impôt.',
    blocks: [
      {
        type: 'columns',
        title: 'Ce que la décision indique',
        items: [
          { title: 'Titulaire', text: 'COCONSULT, TVA FR90838913838, la société française qui édite ce site. Pas Coconsult Nearshore.' },
          { title: 'Décision', text: 'Numéro 28910108, autorité DRIEETS Île-de-France, date du 4 février 2026.' },
          { title: 'Années', text: '2026, 2027, 2028, 2029 et 2030.' },
        ],
      },
      {
        type: 'prose',
        title: 'À quoi sert un agrément',
        paragraphs: [
          'Il reconnaît que le prestataire a les moyens de participer à des travaux d’innovation pour le compte d’un donneur d’ordre. Le client reste responsable de vérifier que l’opération, elle, entre dans l’assiette du crédit d’impôt innovation.',
          'Coconsult ne promet pas un crédit d’impôt. Une maintenance, une régie ou une évolution courante ne deviennent pas éligibles parce que l’agrément existe.',
        ],
      },
      {
        type: 'prose',
        title: 'Comment un sujet d’innovation se cadre',
        paragraphs: [
          'On part d’un produit, d’un prototype ou d’une installation pilote à concevoir. Le périmètre, les livrables et la société qui contracte sont écrits avant le démarrage.',
          'Le développement logiciel, l’équipe et le mode d’intervention se choisissent ensuite. Le nearshore, lorsqu’il est retenu, passe par Coconsult Nearshore, société tunisienne juridiquement distincte, à Sfax.',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Développement logiciel', text: 'Applications web et mobiles, API et logiciels métier, jusqu’à la mise en production.', hrefKey: 'software' },
          { title: 'Intelligence artificielle', text: 'Intégration d’IA générative, d’agents et de modèles, avec un cas d’usage cadré.', hrefKey: 'ai' },
          { title: 'Modes d’intervention', text: 'Régie, équipe dédiée, nearshore ou forfait, une fois le périmètre compris.', hrefKey: 'modes' },
        ],
      },
      { type: 'cta', title: 'Décrire le prototype ou le produit à concevoir.', text: 'Le contexte suffit pour dire si un cadrage d’innovation a du sens. L’éligibilité fiscale se confirme à part.', primary: 'project' },
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
    metaTitle: 'Parlons de votre prochain système | Coconsult',
    description:
      'Décrivez le système à construire : projet, équipe, intelligence artificielle ou démonstration. L’adresse contact@coconsult.fr est sur la page.',
    eyebrow: 'CONTACT',
    h1: 'Parlons de votre prochain système.',
    h1Accent: 'Projet, équipe, IA ou démonstration.',
    intro: 'La confirmation n’apparaît qu’une fois la demande acceptée. Sinon, le message se prépare dans votre messagerie.',
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
    metaTitle: 'Développement sur mesure Java et Angular | Coconsult',
    description:
      'Applications web, API et logiciels métier. Java, Spring et Angular lorsque le produit en place s’y appuie, avec une équipe dédiée si le projet dure.',
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
          { title: 'Java, Spring et Angular', text: 'Ces technologies sont reprises lorsque le produit existant s’y appuie. Angular n’est pas proposé pour remplacer un front qui ne l’utilise pas déjà.' },
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
      {
        type: 'prose',
        title: 'Applications web, mobiles et logiciels métier',
        paragraphs: [
          'Sur mesure veut dire partir du système déjà en place : règles, données et utilisateurs. Une application web ou mobile s’y relie, plutôt que de remplacer l’existant par principe.',
          'La livraison comprend une version exploitable, des environnements identifiés et un interlocuteur pendant la mise en route.',
          'Si le donneur d’ordre étudie un crédit d’impôt innovation, le cadre de l’agrément CII est décrit à part. Il ne s’applique pas à toute mission de développement.',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Intelligence artificielle', text: 'Brancher génération, modèles ou agents sur une application déjà en place.', hrefKey: 'ai' },
          { title: 'Cloud et DevOps', text: 'Mettre en production et tenir l’exploitation de ce qui est livré.', hrefKey: 'cloud' },
          { title: 'Équipes Java et Angular', text: 'Une squad Java, Spring ou Angular pour la durée du projet, lorsque le besoin dépasse une intervention ponctuelle.', hrefKey: 'dedicated' },
          { title: 'Innovation et CII', text: 'Lire le cadre de l’agrément avant d’appeler une mission un projet d’innovation.', hrefKey: 'innovation' },
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
      {
        type: 'prose',
        title: 'Tenir une plateforme déjà en service',
        paragraphs: [
          'Le travail part de l’hébergement et de la chaîne de livraison existants. L’objectif est une version reproductible, des environnements lisibles et une alerte avant que l’utilisateur ne découvre l’incident.',
          'Cloud et DevOps ne sont pas, à eux seuls, un projet d’innovation. Quand le sujet est un prototype, le cadre de l’agrément CII se lit à part.',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Développement logiciel', text: 'Faire évoluer l’application que la plateforme doit livrer.', hrefKey: 'software' },
          { title: 'Cybersécurité', text: 'Réduire la surface des accès et des services exposés.', hrefKey: 'cyber' },
          { title: 'Équipe dédiée', text: 'Ajouter un profil cloud ou DevOps au dispositif existant.', hrefKey: 'dedicated' },
          { title: 'Innovation et CII', text: 'Distinguer une exploitation courante d’un prototype qui se cadre à part.', hrefKey: 'innovation' },
        ],
      },
      { type: 'cta', title: 'Parler de la plateforme que vous exploitez.', text: 'Hébergement actuel, fréquence de livraison et point de douleur suffisent pour commencer.', primary: 'project' },
    ],
  },
  modes: {
    key: 'modes',
    metaTitle: 'Externalisation IT, équipes dédiées et nearshore | Coconsult',
    description:
      'Externalisation IT en assistance technique, équipes dédiées, nearshore en Tunisie ou collaboration au forfait. Coconsult Nearshore est une société distincte.',
    eyebrow: 'MODES D’INTERVENTION',
    h1: 'Choisir la forme de l’externalisation IT.',
    intro:
      'Selon le périmètre, la collaboration se fait en assistance technique, en équipes dédiées, en nearshore en Tunisie ou au forfait. Le conseil s’ajoute lorsque le projet doit être cadré avant ou pendant la réalisation.',
    blocks: [
      {
        type: 'columns',
        title: 'Cinq façons de travailler',
        items: [
          { title: 'Assistance technique', text: 'Régie d’un ou plusieurs ingénieurs, pour un palier identifié.' },
          { title: 'Équipes dédiées', text: 'Une squad suivie dans la durée, avec coordination depuis la France.' },
          { title: 'Nearshore Tunisie', text: 'Compétences mobilisées avec Coconsult Nearshore, à Sfax. Société tunisienne juridiquement distincte. Ce n’est pas une promesse de baisse de coût.' },
          { title: 'Collaboration au forfait', text: 'Un périmètre estimable, avec un résultat à réceptionner.' },
          { title: 'Conseil', text: 'Architecture, analyse métier et pilotage, lorsque le projet a besoin d’un cadrage avant ou pendant la réalisation.' },
        ],
      },
      {
        type: 'prose',
        paragraphs: [
          'L’externalisation IT est portée depuis la France par COCONSULT. Lorsqu’elle inclut un nearshore en Tunisie, les compétences passent par Coconsult Nearshore, société tunisienne juridiquement indépendante, basée à Sfax. Les deux sociétés ne se confondent pas.',
          'Le devis, le contrat et la facture identifient la société qui contracte avec le client.',
        ],
      },
      {
        type: 'prose',
        title: 'Nearshore en Tunisie',
        paragraphs: [
          'Coconsult Nearshore, à Sfax, mobilise des compétences d’ingénierie pour des clients accompagnés depuis la France. Les deux sociétés ont des dirigeants différents. Aucun lien capitalistique n’est affirmé.',
          'Un prototype ou une installation pilote se cadre avant d’être appelé innovation. L’agrément CII de COCONSULT couvre 2026 à 2030. Il ne rend pas la mission éligible.',
        ],
      },
      {
        type: 'cards',
        title: 'Selon le besoin',
        items: [
          { title: 'Équipes dédiées', text: 'Java, Angular, full-stack ou DevOps, suivis dans la durée.', hrefKey: 'dedicated' },
          { title: 'Développement logiciel', text: 'Applications web, mobiles, API et intégration.', hrefKey: 'software' },
          { title: 'Intelligence artificielle', text: 'Intégration d’IA générative, d’agents et de modèles dans vos outils.', hrefKey: 'ai' },
          { title: 'Innovation et CII', text: 'Le numéro d’agrément, les années couvertes, et ce qui reste à vérifier côté client.', hrefKey: 'innovation' },
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
