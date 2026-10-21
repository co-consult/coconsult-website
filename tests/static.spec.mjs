import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');

const pages = [
  ['/', 'fr', '/en/'],
  ['/services/', 'fr', '/en/services/'],
  ['/services/equipes-dediees/', 'fr', '/en/services/dedicated-teams/'],
  ['/services/qa-testing/', 'fr', '/en/services/qa-testing/'],
  ['/services/paiements/', 'fr', '/en/services/payments/'],
  ['/services/automatisation/', 'fr', '/en/services/business-automation/'],
  ['/services/ia-entreprise/', 'fr', '/en/services/enterprise-ai/'],
  ['/solutions/', 'fr', '/en/solutions/'],
  ['/realisations/', 'fr', '/en/case-studies/'],
  ['/a-propos/', 'fr', '/en/about/'],
  ['/partenariats/', 'fr', '/en/partnerships/'],
  ['/contact/', 'fr', '/en/contact/'],
  ['/mentions-legales/', 'fr', '/en/legal-notice/'],
  ['/confidentialite/', 'fr', '/en/privacy-policy/'],
];

const fileFor = (urlPath) => {
  if (urlPath === '/') return path.join(dist, 'index.html');
  return path.join(dist, urlPath.slice(1), 'index.html');
};

const read = (urlPath) => fs.readFileSync(fileFor(urlPath), 'utf8');
const hrefsOf = (html) => [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);

const forbidden = [
  'lorem ipsum',
  'iso 9001',
  'bred',
  'wero',
  'société générale',
  'societe generale',
  'ingenico',
  'payplug',
  'pci dss',
  'leader mondial',
  '100% garanti',
  'club sportif sfaxien',
  'class="mark"',
  'brand-text',
  'href="#"',
  ':8080',
  'localhost',
  'jenkins',
  '/login',
];

assert.ok(fs.existsSync(dist), 'dist/ is missing. Run npm run build first.');

for (const [urlPath, lang, alternate] of pages) {
  const html = read(urlPath);
  const altHtml = read(alternate);
  assert.match(html, new RegExp(`<html lang="${lang}">`));
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, urlPath);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://coconsult.fr${urlPath}">`));
  assert.match(html, /hreflang="fr"/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="x-default"/);
  assert.match(html, /src="\/assets\/brand\/coconsult-logo\.png"/);
  assert.match(html, /alt="Coconsult"/);
  assert.match(html, /contact@coconsult\.fr/);
  assert.match(html, new RegExp(`href="${alternate}"`));
  assert.match(altHtml, new RegExp(`href="${urlPath}"`));
  const lowered = html.toLowerCase();
  for (const phrase of forbidden) {
    assert.equal(lowered.includes(phrase), false, `${urlPath} contains ${phrase}`);
  }
  for (const href of hrefsOf(html)) {
    assert.notEqual(href, '#', href);
    assert.equal(href.includes(':8080'), false, href);
    assert.equal(href.includes('localhost'), false, href);
    assert.equal(href.includes('/login'), false, href);
    if (href.startsWith('mailto:')) {
      assert.match(href, /^mailto:contact@coconsult\.fr(?:\?subject=|$)/);
      continue;
    }
    if (href.startsWith('#')) {
      const id = href.slice(1);
      assert.match(html, new RegExp(`id="${id}"`));
      continue;
    }
    if (href.startsWith('/')) {
      const [pathname] = href.split('#');
      if (pathname.startsWith('/assets/') || pathname.includes('.')) continue;
      assert.equal(fs.existsSync(fileFor(pathname)), true, `${urlPath} -> ${pathname}`);
    }
  }
}

const qa = read('/en/services/qa-testing/');
assert.match(qa, /Discuss your QA needs/);
assert.match(qa, /Request a QA team/);
assert.match(decodeURIComponent(qa), /Discuss your QA needs - Coconsult/);
assert.match(decodeURIComponent(qa), /Request a QA team - Coconsult/);

const contact = decodeURIComponent(read('/contact/'));
for (const subject of [
  'Parlons de votre projet - Coconsult',
  'Constituer une équipe - Coconsult',
  'Besoin QA - Coconsult',
  'Equipe QA - Coconsult',
  'Diagnostic paiements - Coconsult',
  'Automatisation métier - Coconsult',
  'Diagnostic IA entreprise - Coconsult',
  'Partenariat - Coconsult',
]) {
  assert.match(contact, new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

const solutions = decodeURIComponent(read('/solutions/'));
assert.match(solutions, /Demande de demo - COPHARIA - Coconsult/);
assert.match(solutions, /Demande de demo - Cogeex - Coconsult/);
assert.match(solutions, /Plateforme SaaS métier \(nom à venir\)/);

assert.match(read('/'), /Des systèmes plus fiables\./);
assert.match(read('/en/'), /Reliable systems\./);
assert.equal(fs.existsSync(path.join(dist, '404.html')), true);
assert.equal(
  fs.existsSync(path.join(dist, 'en', '404', 'index.html')) || fs.existsSync(path.join(dist, 'en', '404.html')),
  true,
);

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
for (const [urlPath, , alternate] of pages) {
  assert.match(sitemap, new RegExp(`<loc>https://coconsult.fr${urlPath}</loc>`));
  assert.match(sitemap, new RegExp(`<loc>https://coconsult.fr${alternate}</loc>`));
}
assert.doesNotMatch(sitemap, /404/);
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/coconsult\.fr\/sitemap\.xml/);

const nginx = fs.readFileSync(path.join(root, 'nginx.conf'), 'utf8');
assert.match(nginx, /absolute_redirect off;/);
assert.match(nginx, /port_in_redirect off;/);
assert.match(nginx, /return 301 \$uri\/;/);
assert.match(nginx, /listen 8080;/);
assert.doesNotMatch(nginx, /return 30\d https?:\/\//);
assert.match(fs.readFileSync(path.join(root, '.gitignore'), 'utf8'), /compose\.proxy\.yaml/);
assert.equal(fs.existsSync(path.join(root, 'compose.proxy.yaml')), false);
assert.ok(fs.statSync(path.join(dist, 'assets', 'brand', 'coconsult-logo.png')).size > 1000);

console.log(`Static checks passed for ${pages.length * 2} localized pages`);
