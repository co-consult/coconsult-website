import type { Locale } from '@/content/types';

/**
 * Concise, language-aware alternatives for photographic assets.
 * Describe what is visible — do not stuff service keywords.
 * Decorative uses (e.g. logo next to labelled seal text) stay empty via `imageAlt` miss or explicit "".
 */
const peopleAlts: Record<string, Record<Locale, string>> = {
  '/assets/people/workshop-journey.jpg': {
    fr: 'Deux collègues pointent un graphique et des notes collées sur une cloison en verre dans un atelier.',
    en: 'Two colleagues point at a graph and sticky notes on a glass partition in a workshop.',
  },
  '/assets/people/engineer-focus.jpg': {
    fr: 'Ingénieure devant deux écrans : éditeur de code et schéma d’architecture, bureau avec vue sur Paris.',
    en: 'Engineer at two monitors showing a code editor and an architecture diagram, desk overlooking Paris.',
  },
  '/assets/people/team-standup.jpg': {
    fr: 'Cinq collaborateurs autour d’une table debout couverte de notes collées colorées et d’une tablette.',
    en: 'Five colleagues around a standing table covered with colourful sticky notes and a tablet.',
  },
  '/assets/people/delivery-room.jpg': {
    fr: 'Un homme et une femme examinent du code sur un écran à un bureau debout dans un open space.',
    en: 'A man and a woman review code on a monitor at a standing desk in an open-plan office.',
  },
  '/assets/people/contact-exchange.jpg': {
    fr: 'Un homme et une femme examinent ensemble le contenu d’une tablette sur un bureau.',
    en: 'A man and a woman review a tablet together at a desk.',
  },
  '/assets/people/architecture-review.jpg': {
    fr: 'Deux hommes examinent un schéma technique sur un tableau blanc, vue sur la Tour Eiffel derrière la fenêtre.',
    en: 'Two men review a technical diagram on a whiteboard, with the Eiffel Tower visible through the window.',
  },
  '/assets/people/nearshore-pair.jpg': {
    fr: 'Deux développeurs collaborent devant deux écrans affichant du code dans un bureau lumineux.',
    en: 'Two developers collaborate at dual monitors showing code in a bright office.',
  },
  '/assets/people/product-demo.jpg': {
    fr: 'Un consultant présente un tableau de bord sur un ordinateur portable à deux collègues, vue sur Paris.',
    en: 'A consultant presents a dashboard on a laptop to two colleagues, with a Paris skyline behind them.',
  },
  '/assets/people/project-handoff.jpg': {
    fr: 'Remise d’un dossier et d’une clé USB entre deux personnes au-dessus d’un bureau.',
    en: 'Handover of a folder and a USB drive between two people across a desk.',
  },
  '/assets/people/engineer-desk.jpg': {
    fr: 'Développeur concentré devant deux écrans : code et schéma technique, dans un bureau moderne.',
    en: 'Developer focused on two monitors showing code and a technical diagram in a modern office.',
  },
};

/** Paths where empty alt is intentional (redundant with adjacent accessible text). */
export const decorativeImageSrcs = new Set<string>(['/assets/brand/coconsult-logo.png']);

export function imageAlt(src: string | undefined, locale: Locale): string {
  if (!src) return '';
  return peopleAlts[src]?.[locale] ?? '';
}

export function isPeoplePhoto(src: string): boolean {
  return src.startsWith('/assets/people/');
}
