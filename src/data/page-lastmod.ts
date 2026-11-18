import type { RouteKey } from '@/content/types';

/**
 * Last meaningful change per route (ISO date, day precision).
 * Seeded from git history of that page’s templates / experience / content key.
 * Update the date when the page’s copy, blocks, or template actually change.
 * Never set this to the build day alone.
 */
export const pageLastmod: Record<RouteKey, string> = {
  home: '2026-11-18',
  services: '2026-11-18',
  dedicated: '2026-11-18',
  qa: '2026-11-18',
  payments: '2026-11-18',
  automation: '2026-11-18',
  ai: '2026-11-18',
  software: '2026-11-18',
  cloud: '2026-11-18',
  cyber: '2026-11-18',
  modes: '2026-11-18',
  sectors: '2026-11-18',
  solutions: '2026-11-18',
  cases: '2026-11-18',
  about: '2026-10-21',
  innovation: '2026-11-18',
  partnerships: '2026-11-18',
  contact: '2026-11-18',
  legal: '2026-10-26',
  privacy: '2026-10-26',
};
