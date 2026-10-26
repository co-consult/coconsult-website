import type { Locale } from '@/content/types';

export interface SportsShot {
  base: string;
  width: number;
  height: number;
  caption: Record<Locale, string>;
  alt: Record<Locale, string>;
}

/** Real CSS Forever screens, masked. The interface itself is not redrawn. */
export const sportsShots: SportsShot[] = [
  {
    base: '/assets/work/sports/support',
    width: 1024,
    height: 640,
    caption: {
      fr: 'Campagne de soutien et de dons.',
      en: 'Support and donation campaign.',
    },
    alt: {
      fr: 'Campagne de soutien CSS Forever. Les montants, les noms de participants et le signe du club sont masqués.',
      en: 'CSS Forever support campaign. Amounts, participant names and the club mark are masked.',
    },
  },
  {
    base: '/assets/work/sports/seats',
    width: 1024,
    height: 384,
    caption: {
      fr: 'Choix d’une place dans les tribunes.',
      en: 'Choosing a seat in the stands.',
    },
    alt: {
      fr: 'Plan de tribune CSS Forever pour choisir une place. Le tarif, le nom du stade et le signe du club sont masqués.',
      en: 'CSS Forever stand map for choosing a seat. The tariff, the stadium name and the club mark are masked.',
    },
  },
  {
    base: '/assets/work/sports/sales',
    width: 1024,
    height: 460,
    caption: {
      fr: 'Suivi des ventes d’abonnements.',
      en: 'Subscription sales follow-up.',
    },
    alt: {
      fr: 'Console de suivi des ventes d’abonnements CSS Forever. Les chiffres, le compte administrateur et le signe du club sont masqués.',
      en: 'CSS Forever subscription sales console. Figures, the administrator account and the club mark are masked.',
    },
  },
];
