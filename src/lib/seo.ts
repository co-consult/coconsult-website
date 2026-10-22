import type { Locale, RouteKey } from '@/content/types';
import { company } from '@/data/company';
import { absoluteUrl, pathFor, routes } from '@/data/routes';

export interface Crumb {
  label: string;
  href?: string;
}

export function crumbsFor(locale: Locale, key: RouteKey, homeLabel: string): Crumb[] {
  if (key === 'home') return [];
  const chain: RouteKey[] = [];
  let current: RouteKey | undefined = key;
  while (current) {
    chain.unshift(current);
    current = routes[current].parent;
  }
  const items: Crumb[] = [{ label: homeLabel, href: pathFor(locale, 'home') }];
  chain.forEach((routeKey, index) => {
    const label = routes[routeKey].label[locale];
    if (index === chain.length - 1) items.push({ label });
    else items.push({ label, href: pathFor(locale, routeKey) });
  });
  return items;
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.siteUrl + '/',
    logo: absoluteUrl('/assets/brand/coconsult-logo.png'),
    email: company.email,
    foundingDate: String(company.founded),
    // Clients are served from France. Nearshore delivery in Tunisia is a separate company, not an establishment of this publisher.
    areaServed: 'FR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '10 rue de Penthièvre',
      postalCode: '75008',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
  };
}

export function webPageLd(locale: Locale, key: RouteKey, title: string, description: string) {
  const path = key === 'home' ? pathFor(locale, 'home') : pathFor(locale, key);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: company.name, url: company.siteUrl + '/' },
  };
}

export function serviceLd(locale: Locale, key: RouteKey, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: absoluteUrl(pathFor(locale, key)),
    areaServed: 'FR',
    provider: {
      '@type': 'Organization',
      name: company.name,
      url: company.siteUrl + '/',
    },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function breadcrumbLd(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function jsonScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
