import {
  KNOWLEDGE_VERSION,
  chrome,
  contactHref,
  entryById,
  linksFor,
  localeOf,
  matchEntry,
  pathFor,
} from './knowledge.mjs';

export { KNOWLEDGE_VERSION };

const MAX_NOTE = 400;
const MAX_QUESTIONS = 3;

const INJECTION = /ignore\s+(all\s+|any\s+|the\s+|previous\s+|tes\s+|les\s+|mes\s+)?(instructions|rules|consignes|regles)|system\s+prompt|you\s+are\s+now|tu\s+es\s+(maintenant|desormais)|jailbreak|developer\s+mode|reveal\s+(the\s+)?(key|secret|prompt|systeme)|affiche\s+(la\s+|le\s+)?(cle|prompt|secret)/i;
const PII = /([\w.+-]+@[\w.-]+\.[a-z]{2,})|(\+?\d[\d\s().-]{8,}\d)/i;
const COMMERCIAL = /\b(prix|tarif|tarifs|devis|price|pricing|cost|costs|combien)\b/i;
const PRIVATE = /\b(siret|siren|salaire|salary|marge|password|mot de passe)\b/i;

const EXPERTISE = ['ai', 'software', 'cloud', 'qa', 'cyber', 'automation', 'payments', 'teams'];
const MODES = ['regie', 'forfait', 'squad', 'nearshore'];
const WORKS = ['iaps', 'sports', 'copharia'];

export function start(locale) {
  const state = blank(locale);
  return pack(state, {
    text: welcome(state.locale),
    choices: menuChoices(state.locale),
    matched: true,
  });
}

export function turn(state, input) {
  const next = clone(state);
  if (!input || typeof input !== 'object') return unmatched(next);
  if (input.type === 'choice') return applyChoice(next, String(input.id || ''));
  if (input.type === 'text') return applyText(next, String(input.text || ''));
  return unmatched(next);
}

export function blank(locale) {
  return {
    locale: localeOf(locale),
    phase: 'menu',
    topic: null,
    mode: null,
    note: '',
    questions: 0,
    noteAsked: false,
    editing: false,
  };
}

export function clone(state) {
  const source = state && typeof state === 'object' ? state : {};
  const topic = entryById(source.topic) ? source.topic : null;
  const mode = source.mode === 'project' || source.mode === 'team' || source.mode === 'unsure' ? source.mode : null;
  const questions = Number.isInteger(source.questions) ? Math.min(MAX_QUESTIONS, Math.max(0, source.questions)) : 0;
  return {
    locale: localeOf(source.locale),
    phase: typeof source.phase === 'string' ? source.phase : 'menu',
    topic,
    mode,
    note: cleanNote(source.note),
    questions,
    noteAsked: source.noteAsked === true,
    editing: source.editing === true,
  };
}

function applyChoice(state, id) {
  if (!/^[a-z0-9-]{1,40}$/.test(id)) return unmatched(state);
  if (id === 'back' || id === 'menu') return menu(state);
  if (id === 'topics') return topicMenu(state);
  if (id === 'modes') return modeMenu(state);
  if (id === 'works') return workMenu(state);
  if (id === 'qualify') return beginQualify(state);
  if (id === 'contact') return contactNow(state);
  if (id === 'skip-note') return finishNote(state, '');
  if (id === 'confirm-summary') return confirm(state);
  if (id === 'edit-summary') return edit(state);
  if (id === 'mode-project' || id === 'mode-team' || id === 'mode-unsure') {
    return takeMode(state, id.slice(5));
  }
  if (entryById(id)) {
    if (state.phase === 'topic') {
      state.topic = id;
      return state.mode || state.questions >= MAX_QUESTIONS ? summary(state, true) : askMode(state);
    }
    return showEntry(state, id);
  }
  return unmatched(state);
}

function applyText(state, raw) {
  const text = String(raw || '').trim();
  if (!text) return state.phase === 'note' ? finishNote(state, '') : menu(state);
  if (INJECTION.test(text)) return blocked(state, 'injection');
  if (PII.test(text) && !text.includes('contact@coconsult.fr')) return blocked(state, 'pii');
  if (text.length > MAX_NOTE) return tooLong(state);
  if (state.phase === 'note') return finishNote(state, cleanNote(text));
  if (COMMERCIAL.test(text)) return blocked(state, 'commercial');
  if (PRIVATE.test(text)) return blocked(state, 'private');
  const entry = matchEntry(text);
  if (!entry) return unmatched(state);
  return showEntry(state, entry.id);
}

function menu(state) {
  state.phase = 'menu';
  state.editing = false;
  return pack(state, {
    text: welcome(state.locale),
    choices: menuChoices(state.locale),
    matched: true,
  });
}

function topicMenu(state) {
  state.phase = 'topics';
  const en = state.locale === 'en';
  return pack(state, {
    text: en
      ? 'The published expertise covers AI, software, cloud, QA, cybersecurity, business automation, payments and dedicated teams.'
      : 'Les expertises publiées couvrent l’IA, le logiciel, le cloud, la QA, la cybersécurité, l’automatisation, les paiements et les équipes dédiées.',
    choices: [...entryChoices(state.locale, EXPERTISE), backChoice(state.locale)],
    links: [{ href: pathFor(state.locale, 'services'), label: state.locale === 'en' ? 'Expertise' : 'Expertises' }],
    matched: true,
  });
}

function modeMenu(state) {
  state.phase = 'modes';
  const entry = entryById('modes');
  return pack(state, {
    text: entry.text[state.locale],
    choices: [...entryChoices(state.locale, MODES), backChoice(state.locale)],
    links: linksFor(state.locale, entry),
    matched: true,
  });
}

function workMenu(state) {
  state.phase = 'works';
  const en = state.locale === 'en';
  return pack(state, {
    text: en
      ? 'Three public items are on the site: a document and workflow application, a sports operations platform, and COPHARIA, which is still in development.'
      : 'Trois éléments sont publics : une application documentaire et de workflows, une plateforme d’opérations sportives, et COPHARIA, encore en développement.',
    choices: [...entryChoices(state.locale, WORKS), backChoice(state.locale)],
    links: [{ href: pathFor(state.locale, 'cases'), label: en ? 'Case studies' : 'Réalisations' }],
    matched: true,
  });
}

function showEntry(state, id) {
  const entry = entryById(id);
  state.topic = id;
  state.phase = 'entry';
  state.editing = false;
  return pack(state, {
    text: entry.text[state.locale],
    choices: [qualifyChoice(state.locale), backChoice(state.locale)],
    links: linksFor(state.locale, entry),
    matched: true,
  });
}

function beginQualify(state) {
  if (!state.topic && state.questions < MAX_QUESTIONS) return askTopic(state);
  if (!state.mode && state.questions < MAX_QUESTIONS) return askMode(state);
  if (!state.noteAsked && state.questions < MAX_QUESTIONS) return askNote(state);
  return summary(state, true);
}

function askTopic(state) {
  if (state.questions >= MAX_QUESTIONS) return summary(state, true);
  state.questions += 1;
  state.phase = 'topic';
  const en = state.locale === 'en';
  return pack(state, {
    text: en ? 'Which subject is closest to your need?' : 'Quel sujet se rapproche le plus de votre besoin ?',
    choices: [...entryChoices(state.locale, EXPERTISE), backChoice(state.locale)],
    matched: true,
  });
}

function askMode(state) {
  if (!state.editing) {
    if (state.questions >= MAX_QUESTIONS) return summary(state, true);
    state.questions += 1;
  }
  state.phase = 'mode';
  const en = state.locale === 'en';
  return pack(state, {
    text: en ? 'Are you looking for a scoped project, or a team?' : 'Vous cherchez plutôt un projet cadré, ou une équipe ?',
    choices: modeChoices(state.locale),
    matched: true,
  });
}

function askNote(state) {
  if (state.questions >= MAX_QUESTIONS) return summary(state, true);
  state.questions += 1;
  state.noteAsked = true;
  state.phase = 'note';
  const en = state.locale === 'en';
  return pack(state, {
    text: en
      ? 'In one sentence, what is the context? You can skip this.'
      : 'En une phrase, quel est le contexte ? Vous pouvez passer.',
    choices: [
      { id: 'skip-note', label: en ? 'Skip this question' : 'Passer cette question' },
      backChoice(state.locale),
    ],
    matched: true,
  });
}

function takeMode(state, mode) {
  if (state.phase !== 'mode' && !state.editing) return unmatched(state);
  state.mode = mode;
  state.topic = state.topic || (mode === 'team' ? 'teams' : null);
  if (state.editing || state.noteAsked || state.questions >= MAX_QUESTIONS) {
    state.editing = false;
    return summary(state, true);
  }
  return askNote(state);
}

function finishNote(state, note) {
  if (state.phase !== 'note') return unmatched(state);
  state.note = note;
  state.noteAsked = true;
  return summary(state, true);
}

function summary(state, pending) {
  state.phase = pending ? 'confirm' : 'done';
  state.editing = false;
  const lines = summaryLines(state);
  const en = state.locale === 'en';
  const text = pending
    ? (en
      ? `Please confirm this summary.\n${lines.join('\n')}\nThe contact link appears after you confirm. The summary stays in this window and is not copied into the form.`
      : `Voici le résumé à valider.\n${lines.join('\n')}\nLe lien vers le formulaire apparaît après confirmation. Le résumé reste dans cette fenêtre et n’est pas recopié dans le formulaire.`)
    : (en
      ? `Confirmed.\n${lines.join('\n')}\nThe link opens the matching form. Copy the summary into your message if you want the team to read it.`
      : `Résumé confirmé.\n${lines.join('\n')}\nLe lien ouvre le formulaire correspondant. Reprenez le résumé dans votre message si vous voulez que l’équipe le lise.`);
  return pack(state, {
    text,
    choices: pending
      ? [
        { id: 'confirm-summary', label: en ? 'Confirm this summary' : 'Valider ce résumé' },
        { id: 'edit-summary', label: en ? 'Change it' : 'Modifier' },
      ]
      : [backChoice(state.locale)],
    summary: { lines, pending },
    contact: pending ? null : { href: contactHref(state.locale, state.topic, state.mode), label: en ? 'Open the contact form' : 'Ouvrir le formulaire de contact' },
    matched: true,
  });
}

function confirm(state) {
  if (state.phase !== 'confirm') return unmatched(state);
  return summary(state, false);
}

function edit(state) {
  if (state.phase !== 'confirm') return unmatched(state);
  state.mode = null;
  state.note = '';
  if (state.questions >= MAX_QUESTIONS) {
    state.editing = true;
    return askMode(state);
  }
  state.editing = false;
  state.noteAsked = false;
  return beginQualify(state);
}

function contactNow(state) {
  state.phase = 'done';
  const en = state.locale === 'en';
  return pack(state, {
    text: en
      ? 'The contact form is the right place for a question that is not answered on the public pages.'
      : 'Le formulaire de contact est le bon endroit pour une question qui n’est pas répondue sur les pages publiques.',
    choices: [backChoice(state.locale)],
    contact: {
      href: pathFor(state.locale, 'contact'),
      label: en ? 'Open the contact form' : 'Ouvrir le formulaire de contact',
    },
    matched: true,
  });
}

function blocked(state, reason) {
  const en = state.locale === 'en';
  const text = {
    injection: en
      ? 'I can only answer from the public Coconsult pages. For anything else, use the contact form.'
      : 'Je ne peux répondre qu’à partir des pages publiques de Coconsult. Pour le reste, le formulaire de contact est le bon canal.',
    pii: en
      ? 'Do not leave an email, a phone number or other personal data here. The contact form is where that belongs.'
      : 'N’indiquez pas d’e-mail, de téléphone ou d’autre donnée personnelle ici. Le formulaire de contact sert à cela.',
    commercial: en
      ? 'Prices are not published on the site. The contact form is where you describe the need. Coconsult replies after reading it.'
      : 'Les tarifs ne sont pas publiés sur le site. Le formulaire permet de décrire le besoin. Coconsult répond après l’avoir lu.',
    private: en
      ? 'That information is not part of the public site. The contact form reaches the team.'
      : 'Cette information ne fait pas partie du site public. Le formulaire de contact joint l’équipe.',
  }[reason];
  return pack(state, {
    text,
    choices: [backChoice(state.locale)],
    contact: {
      href: pathFor(state.locale, 'contact'),
      label: en ? 'Open the contact form' : 'Ouvrir le formulaire de contact',
    },
    matched: false,
    blocked: reason,
  });
}

function unmatched(state) {
  const en = state.locale === 'en';
  return pack(state, {
    text: en
      ? 'I do not have a public page that answers this precisely. The contact form reaches the team.'
      : 'Je n’ai pas de page publique qui réponde précisément. Le formulaire de contact joint l’équipe.',
    choices: [backChoice(state.locale)],
    contact: {
      href: pathFor(state.locale, 'contact'),
      label: en ? 'Open the contact form' : 'Ouvrir le formulaire de contact',
    },
    matched: false,
    blocked: null,
  });
}

function tooLong(state) {
  const en = state.locale === 'en';
  return pack(state, {
    text: en ? '400 characters maximum. Shorten the sentence, or skip it.' : '400 caractères maximum. Raccourcissez la phrase, ou passez.',
    choices: state.phase === 'note'
      ? [{ id: 'skip-note', label: en ? 'Skip this question' : 'Passer cette question' }]
      : [backChoice(state.locale)],
    matched: true,
    blocked: 'length',
  });
}

function summaryLines(state) {
  const en = state.locale === 'en';
  const topic = entryById(state.topic);
  const topicLabel = topic ? topic.label[state.locale] : (en ? 'Not specified' : 'Non précisé');
  const modeLabel = {
    project: en ? 'Project' : 'Projet',
    team: en ? 'Dedicated team' : 'Équipe dédiée',
    unsure: en ? 'To be decided together' : 'À préciser ensemble',
  }[state.mode] || (en ? 'Not specified' : 'Non précisé');
  const note = state.note || (en ? 'Not specified' : 'Non précisé');
  return [
    `${en ? 'Topic' : 'Sujet'} : ${topicLabel}`,
    `${en ? 'Engagement' : 'Mode'} : ${modeLabel}`,
    `${en ? 'Context' : 'Contexte'} : ${note}`,
  ];
}

function welcome(locale) {
  return locale === 'en'
    ? 'Hello. I can introduce Coconsult, its expertise and the public case studies, then point you to a page or to the contact form.'
    : 'Bonjour. Je peux présenter Coconsult, ses expertises et les réalisations publiques, puis vous orienter vers une page ou vers le formulaire de contact.';
}

function menuChoices(locale) {
  if (locale === 'en') {
    return [
      { id: 'topics', label: 'Expertise' },
      { id: 'modes', label: 'Ways of working' },
      { id: 'works', label: 'Case studies' },
      { id: 'qualify', label: 'Describe a need' },
      { id: 'contact', label: 'Contact form' },
    ];
  }
  return [
    { id: 'topics', label: 'Les expertises' },
    { id: 'modes', label: 'Les modes de collaboration' },
    { id: 'works', label: 'Les réalisations' },
    { id: 'qualify', label: 'Qualifier un besoin' },
    { id: 'contact', label: 'Le formulaire de contact' },
  ];
}

function entryChoices(locale, ids) {
  return ids.map((id) => ({ id, label: entryById(id).label[locale] }));
}

function modeChoices(locale) {
  const en = locale === 'en';
  return [
    { id: 'mode-project', label: en ? 'A project' : 'Un projet' },
    { id: 'mode-team', label: en ? 'A dedicated team' : 'Une équipe dédiée' },
    { id: 'mode-unsure', label: en ? 'Not decided yet' : 'Pas encore fixé' },
  ];
}

function qualifyChoice(locale) {
  return { id: 'qualify', label: locale === 'en' ? 'Describe my need' : 'Qualifier mon besoin' };
}

function backChoice(locale) {
  return { id: 'back', label: locale === 'en' ? 'Menu' : 'Menu' };
}

function cleanNote(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_NOTE);
}

function pack(state, extra) {
  return {
    version: KNOWLEDGE_VERSION,
    state,
    text: extra.text,
    choices: extra.choices || [],
    links: extra.links || [],
    summary: extra.summary || null,
    contact: extra.contact || null,
    matched: extra.matched !== false,
    blocked: extra.blocked || null,
    disclosure: chrome(state.locale).disclosure,
  };
}
