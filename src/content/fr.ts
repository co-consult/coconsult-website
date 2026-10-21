import type { PageContent, RouteKey } from '@/content/types';
import { legalPage, privacyPage } from '@/content/legal-pages';

export const pages: Record<RouteKey, PageContent> = {
  home: {
    key: 'home',
    metaTitle: 'Coconsult — Ingénierie logicielle, équipes et systèmes métier',
    description:
      'Coconsult conçoit, intègre et fiabilise les applications métier. Équipes dédiées, QA, paiements et intégration, entre Paris et Sfax.',
    eyebrow: 'INGÉNIERIE LOGICIELLE · FRANCE & TUNISIE',
    h1: 'Des systèmes plus fiables.',
    h1Accent: 'Des projets qui avancent.',
    intro:
      'Nous concevons, intégrons et fiabilisons les applications de votre activité. De l’expertise individuelle aux équipes dédiées, Coconsult vous aide à livrer avec maîtrise.',
    heroPrimary: 'project',
    heroSecondary: 'team',
    hero: {
      facts: ['Ingénierie et intégration', 'Équipes mobilisées depuis Sfax', 'De l’architecture à la production'],
      diagramTitle: 'L’INGÉNIERIE QUI RELIE VOS SYSTÈMES',
      centerTitle: 'Vos systèmes',
      centerSub: 'Fiabilité · Intégration · Delivery',
      nodes: ['Paiements et API', 'QA et testing', 'Workflows métier', 'Cloud et DevOps'],
      note: 'Connecter les systèmes. Sécuriser les flux. Livrer des solutions exploitables.',
    },
    blocks: [
      {
        type: 'cards',
        title: 'Quatre façons de travailler ensemble',
        intro: 'Chaque offre a une page dédiée : à qui elle s’adresse, ce qui est livré, et comment démarrer.',
        items: [
          {
            kicker: '01',
            title: 'Équipes dédiées',
            text: 'Ingénieurs Java, Angular, full-stack ou DevOps, en renfort ou en équipe, selon les profils réellement disponibles.',
            hrefKey: 'dedicated',
          },
          {
            kicker: '02',
            title: 'QA et testing',
            text: 'Tests fonctionnels, exploratoires, de non-régression et API. Un pilote d’abord, puis une montée en charge progressive.',
            hrefKey: 'qa',
          },
          {
            kicker: '03',
            title: 'Paiements',
            text: 'Intégration d’API de paiement, parcours transactionnels, reprises et observabilité, sans promesse de certification.',
            hrefKey: 'payments',
          },
          {
            kicker: '04',
            title: 'Automatisation métier',
            text: 'ERP, GED, API et workflows reliés pour réduire la double saisie et les circuits qui s’arrêtent dans une boîte mail.',
            hrefKey: 'automation',
          },
        ],
      },
      {
        type: 'columns',
        title: 'Ce qui distingue le travail',
        intro: 'L’ingénierie des systèmes métier complexes, de l’intégration à la production.',
        items: [
          { title: 'Systèmes déjà en place', text: 'Nous partons de votre SI, de vos contraintes d’exploitation et des équipes qui s’en servent.' },
          { title: 'Flux qui tiennent', text: 'Timeouts, reprises, idempotence et supervision sont traités comme des sujets de delivery, pas comme une option tardive.' },
          { title: 'France et Tunisie', text: 'Cadrage et proximité en France, équipe d’ingénierie à Sfax, consultants indépendants mobilisés quand le besoin le justifie.' },
          { title: 'Automatisation utile', text: 'Un connecteur ou un contrôle ciblé vaut mieux qu’un discours général sur la transformation.' },
        ],
      },
      {
        type: 'steps',
        title: 'Comment une collaboration démarre',
        items: [
          { title: 'Comprendre', text: 'Objectifs, systèmes, contraintes de délai et niveau d’autonomie attendu.' },
          { title: 'Proposer', text: 'Un périmètre lisible : renfort, équipe dédiée ou projet au forfait, selon ce qui est cadrable.' },
          { title: 'Livrer', text: 'Conception, développement, tests et mise en production, avec un interlocuteur technique.' },
          { title: 'Ajuster', text: 'Le dispositif évolue avec le backlog réel. Nous ne figeons pas un effectif fictif.' },
        ],
      },
      {
        type: 'work',
        source: 'cases',
        title: 'Réalisations que nous pouvons expliquer',
        intro: 'Des faits vérifiés, avec le statut de chaque sujet. Pas de logos clients et pas de chiffres non publiables.',
      },
      {
        type: 'work',
        source: 'solutions',
        title: 'Solutions en cours',
        intro: 'Produits et projets Coconsult, distincts des logiciels dont le code a été cédé à un client.',
      },
      {
        type: 'cta',
        title: 'Votre prochain projet commence par une conversation.',
        text: 'Projet au forfait, équipe, tests, paiement ou automatisation : écrivez-nous, l’e-mail part depuis votre messagerie.',
        primary: 'project',
        secondary: 'team',
      },
    ],
  },
  services: {
    key: 'services',
    metaTitle: 'Services d’ingénierie logicielle | Coconsult',
    description:
      'Équipes dédiées, QA, paiements, automatisation et intégration d’IA. Coconsult relie l’ingénierie France–Tunisie à vos systèmes existants.',
    eyebrow: 'SERVICES',
    h1: 'De l’expertise ponctuelle à l’équipe qui tient le delivery.',
    intro:
      'Coconsult vend de l’ingénierie, de l’intégration et des dispositifs d’équipe. Le bon format dépend du périmètre, des systèmes déjà en place et des profils que nous pouvons réellement mobiliser.',
    blocks: [
      {
        type: 'cards',
        title: 'Cinq offres, un même interlocuteur technique',
        items: [
          { kicker: 'Équipes', title: 'Ingénierie et équipes dédiées', text: 'Java/Spring, Angular, full-stack, cloud et DevOps. Renfort ou squad, en régie ou au forfait selon le cadrage.', hrefKey: 'dedicated' },
          { kicker: 'Qualité', title: 'QA et software testing', text: 'Tests fonctionnels, exploratoires, non-régression et API. Pilote, puis montée en charge si le dispositif convient.', hrefKey: 'qa' },
          { kicker: 'Transactions', title: 'Paiements et ingénierie financière', text: 'Parcours transactionnels, API de prestataires, reprises et observabilité. Aucune certification n’est affichée.', hrefKey: 'payments' },
          { kicker: 'Opérations', title: 'Automatisation et intégration', text: 'ERP, GED, API et circuits de validation. Nous ne promettons pas de remplacer tous les ERP.', hrefKey: 'automation' },
          { kicker: 'IA', title: 'Intégration d’IA encadrée', text: 'Connexion d’outils existants, permissions, traçabilité et cas d’usage cadrés. Pas un produit conversationnel propriétaire.', hrefKey: 'ai' },
        ],
      },
      {
        type: 'prose',
        title: 'À qui s’adressent ces services',
        paragraphs: [
          'Directions des systèmes d’information, CTO, responsables d’ingénierie, responsables produit, opérations et qualité. Les entreprises qui ont déjà un système à faire tenir, pas seulement une idée à prototyper.',
          'Les modalités se choisissent après échange : régie, équipe dédiée ou projet au forfait. Les disponibilités, la langue de travail et le chevauchement horaire se confirment au cadrage.',
        ],
      },
      { type: 'cta', title: 'Décrire le besoin suffit pour commencer.', text: 'Indiquez le sujet dans votre message. Nous revenons vers vous pour un premier échange.', primary: 'project', secondary: 'team' },
    ],
  },
  dedicated: {
    key: 'dedicated',
    metaTitle: 'Équipes d’ingénierie dédiées | Coconsult',
    description:
      'Constitution d’équipes Java, Angular, full-stack et DevOps entre la France et Sfax. Cadrage, sélection, entretien et pilotage, sans effectif fictif.',
    eyebrow: 'ÉQUIPES DÉDIÉES',
    h1: 'Constituer une équipe d’ingénierie adaptée au besoin réel.',
    intro:
      'Coconsult mobilise des ingénieurs logiciels et, quand le sujet le demande, des consultants indépendants. L’équipe de Sfax et le cadrage en France permettent un dispositif suivi, sans promettre que tous les profils sont disponibles immédiatement.',
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
          { title: 'Sourcing et sélection', text: 'Recherche dans l’équipe et, si besoin, auprès de consultants indépendants. Nous ne présentons que des profils que nous pouvons expliquer.' },
          { title: 'Entretien avec vous', text: 'Vous rencontrez les personnes proposées avant un démarrage.' },
          { title: 'Onboarding', text: 'Accès, référents, outils et périmètre des premières semaines, définis avec vos équipes.' },
          { title: 'Coordination', text: 'Un suivi entre la France et Sfax : priorités, blocages, qualité de ce qui est livré.' },
          { title: 'Évolution', text: 'Le dispositif peut s’élargir ou se resserrer. Aucun délai de mise à disposition chiffré n’est garanti à l’avance.' },
        ],
      },
      {
        type: 'note',
        text: 'Nous ne publions pas de tarifs, de salaires ni d’effectif permanent. Une équipe se constitue pour un besoin identifié, pas à partir d’un catalogue figé.',
      },
      { type: 'cta', title: 'Décrivez l’équipe dont vous avez besoin.', text: 'Stack, séniorité, durée envisagée et mode de travail : ces éléments suffisent pour un premier échange.', primary: 'team', secondary: 'project' },
    ],
  },
  qa: {
    key: 'qa',
    metaTitle: 'Équipes QA et tests logiciels | Coconsult',
    description:
      'Tests fonctionnels, exploratoires, non-régression et API. Coconsult propose un pilote QA puis une montée en charge, sans promesses d’effectif ou de SLA.',
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
          { title: 'Produit déjà en service', text: 'Le risque principal est une régression ou un parcours métier mal couvert, pas l’absence d’un slogan qualité.' },
          { title: 'Équipe interne saturée', text: 'Le renfort prend une partie des campagnes, des scénarios ou de l’exécution, sous votre gouvernance.' },
          { title: 'Lancement ou palier', text: 'Un besoin daté, avec un périmètre de test que l’on peut expliquer en quelques parcours.' },
        ],
      },
      {
        type: 'cards',
        title: 'Trois formats, à ne pas confondre',
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
        intro: 'Aucun nombre de testeurs, aucun prix et aucun délai standard ne sont promis ici.',
        items: [
          { title: 'Discovery', text: 'Produit, risques, environnements, langue de travail, fuseau et ce qu’une première période doit démontrer.' },
          { title: 'Matching et proposition', text: 'Profils proposés avec leur niveau réel. Vous les interviewez. La proposition décrit le pilote, pas une armée déjà en poste.' },
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
          { q: 'Par quelle taille commencer ?', a: 'Par un pilote que vos équipes peuvent onboarder et évaluer. Nous ne recommandons pas un effectif cible avant d’avoir vu le produit et le flux de travail.' },
          { q: 'Le travail est-il à distance ?', a: 'Oui. Les accès, les outils et les créneaux communs sont définis avec vous. Une présence sur site n’est pas le mode par défaut.' },
          { q: 'Quels types de tests ?', a: 'Fonctionnels, exploratoires, non-régression et API en priorité. L’automatisation et la CI/CD dépendent des profils retenus et de votre chaîne existante.' },
          { q: 'Comment les profils sont-ils évalués ?', a: 'Sélection interne, puis entretien avec vous avant démarrage. Un profil qui ne correspond pas ne rejoint pas le pilote.' },
          { q: 'Comment l’équipe évolue-t-elle ?', a: 'Après le pilote, on peut ajouter des personnes si le volume le justifie et si les profils sont disponibles. L’inverse est tout aussi possible.' },
        ],
      },
      {
        type: 'note',
        text: 'Coconsult ne présente pas des dizaines d’ingénieurs QA déjà en poste. Les personnes sont proposées, recrutées ou mobilisées pour le besoin confirmé.',
      },
      { type: 'cta', title: 'Parler du besoin de test, puis des profils.', text: 'Deux portes d’entrée : cadrer le sujet, ou demander directement une équipe pour un pilote.', primary: 'qaDiscuss', secondary: 'qaTeam' },
    ],
  },
  payments: {
    key: 'payments',
    metaTitle: 'Ingénierie des paiements et API transactionnelles | Coconsult',
    description:
      'Intégration de prestataires de paiement, parcours transactionnels, idempotence, reprises et observabilité. Coconsult n’affiche aucune certification de cartes.',
    eyebrow: 'PAIEMENTS',
    h1: 'Fiabiliser les parcours de paiement et les API qui les portent.',
    intro:
      'Coconsult conçoit et intègre des parcours transactionnels dans des applications existantes : appels à un prestataire, statuts, reprises et supervision. L’expérience acquise sur des sujets bancaires et de paiement ne se traduit pas par l’usage de noms de clients.',
    blocks: [
      {
        type: 'columns',
        title: 'Problèmes traités',
        items: [
          { title: 'Double débit ou double appel', text: 'Clés d’idempotence et règles de rejeu lorsque le client ou le réseau répète une demande.' },
          { title: 'Timeouts ambigus', text: 'Un délai dépassé n’est pas un échec certain. Le parcours doit pouvoir interroger un statut et reprendre proprement.' },
          { title: 'Écarts de caisse', text: 'La réconciliation dépend du contexte et des fichiers ou API disponibles. Elle se cadre, elle ne se décrète pas.' },
          { title: 'Backends à moderniser', text: 'Services Java et contrats d’API rendus plus explicites, sans réécrire l’ensemble du système si ce n’est pas utile.' },
        ],
      },
      {
        type: 'diagram',
        title: 'Un flux de paiement, de façon générique',
        caption: 'Schéma pédagogique. Aucun prestataire, aucune banque et aucune donnée réelle ne sont représentés.',
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
      {
        type: 'note',
        text: 'Aucune certification de sécurité des cartes n’est revendiquée. Les noms d’établissements ou de produits de paiement ne sont pas utilisés comme références commerciales.',
      },
      { type: 'cta', title: 'Un diagnostic tient en un échange ciblé.', text: 'Décrivez le parcours, le prestataire envisagé et le symptôme actuel : double appel, statut incertain ou écart d’exploitation.', primary: 'payments' },
    ],
  },
  automation: {
    key: 'automation',
    metaTitle: 'Automatisation métier et intégration de systèmes | Coconsult',
    description:
      'Diagnostic, API, connecteurs et workflows entre ERP, GED et outils métier. Coconsult réduit la double saisie sans promettre de remplacer votre ERP.',
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
      { type: 'note', text: 'Coconsult ne promet pas de remplacer tous les ERP, ni d’automatiser un processus dont les règles métier ne sont pas encore stables.' },
      { type: 'cta', title: 'Décrivez le circuit qui coince.', text: 'Un exemple concret — une commande, un dossier, une validation — suffit pour voir si un diagnostic a du sens.', primary: 'automation' },
    ],
  },
  ai: {
    key: 'ai',
    metaTitle: 'Intégration d’IA pour systèmes d’entreprise | Coconsult',
    description:
      'Coconsult intègre des outils d’IA existants dans vos applications : permissions, traçabilité et cas d’usage cadrés. Pas de promesse de conformité automatique.',
    eyebrow: 'IA D’ENTREPRISE',
    h1: 'Intégrer l’IA dans le système que vous avez déjà.',
    intro:
      'Le sujet est l’intégration, pas la mise en vente d’un assistant généraliste. Nous cadrons un cas d’usage, connectons un outil existant sous les permissions de votre organisation, et laissons une trace de ce qui a été demandé.',
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
          'La confidentialité, le RGPD et le consentement se traitent selon le projet et les bases légales qui vous concernent. Le site ne prétend pas qu’un connecteur rend l’ensemble conforme.',
          'Nous ne présentons pas un clone conversationnel comme un produit propriétaire prêt à l’emploi.',
        ],
      },
      { type: 'cta', title: 'Un diagnostic cadré, avant toute intégration.', text: 'Décrivez le processus, les données en jeu et l’outil que vous envisagez. Nous dirons si un pilote est raisonnable.', primary: 'ai' },
    ],
  },
  solutions: {
    key: 'solutions',
    metaTitle: 'Solutions et démonstrations | Coconsult',
    description:
      'COPHARIA, Cogeex et une plateforme SaaS métier encore sans nom commercial. Statuts réels, démonstration sur demande, sans captures inventées.',
    eyebrow: 'SOLUTIONS',
    h1: 'Des solutions au stade où elles sont vraiment.',
    intro:
      'Cette page distingue les produits et projets Coconsult des réalisations dont le code appartient au client. Les statuts sont affichés tels quels. Une démonstration se demande par e-mail et cite la solution.',
    blocks: [
      {
        type: 'work',
        source: 'solutions',
        title: 'Fiches maintenues dans la configuration du site',
        intro: 'Titres, ordre, visibilité et textes se modifient dans un seul fichier de données.',
      },
      { type: 'note', text: 'Les illustrations sont des schémas. Tant qu’aucune capture autorisée n’est fournie, aucune image n’est présentée comme une interface réelle.' },
      { type: 'cta', title: 'Demander la démonstration qui correspond à votre contexte.', text: 'Chaque fiche ouvre un e-mail dont l’objet porte le nom de la solution.', primary: 'project' },
    ],
  },
  cases: {
    key: 'cases',
    metaTitle: 'Réalisations d’ingénierie | Coconsult',
    description:
      'Applications métier livrées par Coconsult : gestion documentaire cédée au client, plateforme d’opérations sportives. Faits vérifiés, sans logos imposés.',
    eyebrow: 'RÉALISATIONS',
    h1: 'Ce que les projets livrés permettent de dire.',
    intro:
      'Nous publions uniquement des éléments que nous pouvons assumer : nature du système, statut du code, secteur décrit de façon générale. Pas de témoignage inventé et pas de résultats chiffrés non autorisés.',
    blocks: [
      { type: 'work', source: 'cases', title: 'Références expliquées', intro: 'Une étude de cas reste anonyme lorsque les détails commerciaux ne sont pas publiables.' },
      {
        type: 'prose',
        title: 'Comment lire ces fiches',
        paragraphs: [
          'Une réalisation client n’est pas un produit à relicencier. Lorsque le code a été cédé, Coconsult n’en fait pas une offre.',
          'Une plateforme décrite sans son commanditaire reste une expérience d’ingénierie. Elle n’est pas proposée comme une solution blanche prête à revendre.',
        ],
      },
      { type: 'cta', title: 'Un projet comparable se discute à partir du vôtre.', text: 'Décrivez le système à construire ou à fiabiliser. Nous dirons si le retour d’expérience est pertinent.', primary: 'project' },
    ],
  },
  about: {
    key: 'about',
    metaTitle: 'À propos de Coconsult | Paris et Sfax',
    description:
      'Coconsult, entreprise française de conseil et d’ingénierie informatique fondée en 2018, présente à Paris et à Sfax. Équipes adaptées au besoin réel.',
    eyebrow: 'À PROPOS',
    h1: 'Une entreprise d’ingénierie entre Paris et Sfax.',
    intro:
      'Coconsult est une entreprise française de conseil et d’ingénierie informatique, fondée en 2018. Elle conçoit, intègre et exploite des applications métier, avec une équipe à Sfax et une capacité d’avant-vente et d’ingénierie en France.',
    blocks: [
      {
        type: 'columns',
        title: 'La façon de travailler',
        items: [
          { title: 'Proximité de cadrage', text: 'Le besoin, les contraintes et les priorités se comprennent avec vos équipes, depuis la France lorsque c’est le bon relais.' },
          { title: 'Delivery à Sfax', text: 'L’équipe tunisienne porte une part substantielle de l’ingénierie, en lien direct avec le périmètre convenu.' },
          { title: 'Renforts indépendants', text: 'Des consultants indépendants peuvent compléter un dispositif. Leur présence dépend du besoin, pas d’un effectif affiché.' },
        ],
      },
      {
        type: 'prose',
        title: 'Ce que l’entreprise vend',
        paragraphs: [
          'Des projets au forfait lorsque le périmètre le permet, de l’intégration dans des systèmes existants, des équipes dédiées, des missions de test et de paiement, et l’accompagnement de solutions métier en cours de construction.',
          'Le site sert à qualifier une conversation commerciale. Il ne catalogue pas toutes les idées de produits, et il ne fonctionne pas comme une place de marché de recrutement.',
        ],
      },
      {
        type: 'list',
        title: 'Repères publics',
        items: [
          'Fondation en 2018',
          'Présence à Paris et à Sfax',
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
          { title: 'Partenaire technique', text: 'Éditeur, intégrateur ou hébergeur : la collaboration porte sur une brique précise, pas sur un logo échangé.' },
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
      { type: 'note', text: 'Aucun partenaire n’est affiché tant qu’une autorisation explicite de citation n’a pas été donnée.' },
      { type: 'cta', title: 'Proposer un pilote ou un partenariat.', text: 'L’objet du message distingue cette demande d’un projet d’ingénierie classique.', primary: 'partnership' },
    ],
  },
  contact: {
    key: 'contact',
    metaTitle: 'Contacter Coconsult | Projet, équipe, QA, démo',
    description:
      'Écrivez à contact@coconsult.fr. Choisissez le sujet : projet, équipe dédiée, QA, paiements, automatisation, IA, démonstration ou partenariat.',
    eyebrow: 'CONTACT',
    h1: 'Un e-mail, avec le bon sujet.',
    intro:
      'Le site n’enregistre pas de formulaire. Chaque bouton ouvre votre messagerie avec un objet et une trame. L’adresse contact@coconsult.fr reste visible pour copier-coller.',
    blocks: [
      {
        type: 'inquiries',
        title: 'Choisissez l’intention',
        intro: 'Le sujet change selon le bouton. Vous pouvez modifier le texte avant l’envoi.',
        ids: ['project', 'team', 'qaDiscuss', 'qaTeam', 'payments', 'automation', 'ai', 'partnership'],
      },
      {
        type: 'prose',
        title: 'Démonstrations',
        paragraphs: [
          'Les demandes de démonstration partent des fiches Solutions. L’objet contient le nom de la solution, afin que le message arrive déjà qualifié.',
        ],
      },
      { type: 'note', text: 'N’envoyez pas de secrets, de données de cartes ou de fichiers clients dans ce premier message. Un canal adapté se définit ensuite si le sujet l’exige.' },
    ],
  },
  legal: legalPage('fr'),
  privacy: privacyPage('fr'),
};
