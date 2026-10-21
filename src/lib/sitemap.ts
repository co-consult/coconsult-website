import { absoluteUrl, routeOrder, routes } from '@/data/routes';

export function renderSitemap(): string {
  const urls = routeOrder
    .map((key) => {
      const fr = absoluteUrl(routes[key].fr);
      const en = absoluteUrl(routes[key].en);
      const block = (loc: string) =>
        `  <url><loc>${loc}</loc><xhtml:link rel="alternate" hreflang="fr" href="${fr}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${fr}"/></url>`;
      return `${block(fr)}\n${block(en)}`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}
