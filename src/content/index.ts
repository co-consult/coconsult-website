import type { Locale, PageContent, RouteKey } from '@/content/types';
import { pages as en } from '@/content/en';
import { pages as fr } from '@/content/fr';

const catalogs: Record<Locale, Record<RouteKey, PageContent>> = { fr, en };

export function getPage(locale: Locale, key: RouteKey): PageContent {
  const page = catalogs[locale][key];
  if (!page) throw new Error(`Missing page ${locale}:${key}`);
  return page;
}
