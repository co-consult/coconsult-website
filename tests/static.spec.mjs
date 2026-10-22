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
  ['/services/developpement/', 'fr', '/en/services/software-engineering/'],
  ['/services/cloud-devops/', 'fr', '/en/services/cloud-devops/'],
  ['/services/cybersecurite/', 'fr', '/en/services/cybersecurity/'],
  ['/modes-intervention/', 'fr', '/en/engagement/'],
  ['/secteurs/', 'fr', '/en/industries/'],
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
  'bpce',
  'amundi',
  'accelex',
  'renault',
  'europcar',
  'air france',
  'lvmh',
  'darty',
  'axione',
  'ingenico',
  'payplug',
  'pci dss',
  'leader mondial',
  '100% garanti',
  'club sportif sfaxien',
  'cssforever',
  'iaps',
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
      const pathOnly = pathname.split('?')[0];
      if (pathOnly.startsWith('/assets/') || pathOnly.includes('.')) continue;
      assert.equal(fs.existsSync(fileFor(pathOnly)), true, `${urlPath} -> ${pathOnly}`);
    }
  }
}

const qa = read('/en/services/qa-testing/');
assert.match(qa, /Discuss your QA needs/);
assert.match(qa, /Request a QA team/);
assert.match(qa, /href="\/en\/contact\/\?type=qa"/);
assert.match(qa, /href="\/en\/contact\/\?type=qa-team"/);
const qaFr = read('/services/qa-testing/');
assert.match(qaFr, /href="\/contact\/\?type=qa"/);
assert.match(qaFr, /href="\/contact\/\?type=qa-team"/);

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

const home = read('/');
const homeEn = read('/en/');
assert.match(home, /L(?:'|&#39;)intelligence au cœur de vos systèmes\./);
assert.match(home, /L(?:'|&#39;)ingénierie pour les concrétiser\./);
assert.match(home, /Intelligence artificielle et data/);
assert.match(home, /Voir le geste, pas le catalogue\./);
assert.match(home, /href="\/services\/"/);
assert.match(home, /href="\/contact\/\?type=project"/);
assert.match(home, /href="\/contact\/\?type=ai"/);
assert.match(home, /href="\/contact\/\?type=team"/);
assert.match(homeEn, /Intelligence at the core of your systems\./);
assert.match(homeEn, /Engineering to make them real\./);
assert.match(homeEn, /Artificial intelligence and data/);
assert.match(homeEn, /The system, layer by layer\./);
assert.match(homeEn, /href="\/en\/contact\/\?type=project"/);
assert.match(homeEn, /href="\/en\/contact\/\?type=ai"/);
assert.equal(home.includes('Paiements et API'), false);
assert.equal(home.includes('nom à venir'), false);
assert.match(read('/secteurs/'), /Banque, finance et paiements/);
assert.match(read('/secteurs/'), /Domaine émergent/);
assert.match(read('/secteurs/'), /Santé et industrie pharmaceutique/);
assert.match(read('/secteurs/'), /<article class="sector-tile/);
assert.equal((read('/secteurs/').match(/<article class="sector-tile[^"]*" id="/g) || []).length, 8);
assert.equal(/<a class="sector-tile/.test(read('/secteurs/')), false);
assert.doesNotMatch(read('/secteurs/'), /sans remplacer|spécialités historiques|ne nomme pas les entreprises|priorité commerciale|ne prétend pas/i);
assert.match(read('/en/industries/'), /Emerging domain/);
assert.match(read('/en/industries/'), /Banking, finance and payments/);
assert.doesNotMatch(read('/en/industries/'), /without replacing|historic specialties|does not name companies|commercial priority|does not claim/i);
assert.match(read('/'), /Notre ingénierie au service de vos métiers/);
assert.match(read('/'), /href="\/secteurs\/#finance"/);
assert.match(read('/en/'), /href="\/en\/industries\/#finance"/);
assert.match(read('/services/paiements/'), /API transactionnelles/);
assert.match(read('/services/paiements/'), /idempotence/i);
assert.match(read('/services/paiements/'), /paiements instantanés/i);
assert.doesNotMatch(read('/services/paiements/'), /priorité commerciale|ne prétend pas/i);
assert.match(read('/en/services/payments/'), /Transactional APIs/);
assert.match(read('/en/services/payments/'), /instant payments/i);
assert.doesNotMatch(read('/en/services/payments/'), /commercial priority|does not claim/i);
assert.match(read('/solutions/'), /type=demo&amp;product=copharia|type=demo&product=copharia/);
assert.match(read('/'), /\/assets\/copharia\/dashboard\.webp/);
assert.match(read('/'), /\/assets\/copharia\/quality\.webp/);
assert.match(read('/'), /\/assets\/copharia\/stocks\.webp/);
assert.match(read('/'), /\/assets\/copharia\/stock-detail\.webp/);
assert.doesNotMatch(read('/'), /data-view="lab"/);
assert.doesNotMatch(read('/'), /Laboratoire/);
assert.doesNotMatch(read('/en/'), /Laboratory/);
assert.match(read('/en/'), /\/assets\/copharia\/dashboard\.webp/);
assert.match(read('/solutions/'), /Solutions Coconsult/);
assert.match(read('/solutions/'), /Plateformes et réalisations/);
assert.match(read('/solutions/'), /Application documentaire et workflows/);
assert.match(read('/solutions/'), /Plateforme d’opérations sportives|Plateforme d'opérations sportives/);
assert.doesNotMatch(read('/solutions/'), /\bIAPS\b/);
assert.doesNotMatch(read('/solutions/'), /CSSForever/);
assert.match(read('/en/solutions/'), /Coconsult solutions/);
assert.match(read('/en/solutions/'), /Platforms and deliveries/);
assert.match(read('/'), /Demander une démonstration de COPHARIA/);
assert.match(read('/'), /href="\/contact\/\?type=demo&amp;product=copharia"/);
assert.match(read('/en/'), /Request a COPHARIA demonstration/);
assert.match(read('/en/'), /href="\/en\/contact\/\?type=demo&amp;product=copharia"/);
assert.match(read('/en/solutions/'), /href="\/en\/contact\/\?type=demo&amp;product=copharia"/);
assert.equal(read('/solutions/').includes('Cogeex'), false);
assert.equal(read('/solutions/').includes('nom à venir'), false);
for (const [urlPath, , alternate] of pages) {
  for (const file of [urlPath, alternate]) {
    const html = read(file);
    assert.equal(html.includes('Capture à fournir'), false, file);
    assert.equal(html.includes('Capture still needed'), false, file);
    assert.equal(html.includes('transmettre les captures'), false, file);
    assert.equal(html.includes('authorized captures'), false, file);
  }
}
const desktopNav = read('/').match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/);
assert.ok(desktopNav);
assert.equal(desktopNav[0].includes('>Contact<'), false);
const contactPage = read('/contact/');
assert.match(contactPage, /contact@coconsult\.fr/);
assert.match(contactPage, /data-copy-email/);
assert.match(contactPage, /data-open-mail/);
assert.match(contactPage, /data-contact-form hidden/);
assert.equal(contactPage.includes('Votre demande a été envoyée'), false);
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

const legalFr = read('/mentions-legales/');
const legalEn = read('/en/legal-notice/');
const privacyFr = read('/confidentialite/');
const privacyEn = read('/en/privacy-policy/');
for (const html of [legalFr, legalEn]) {
  assert.match(html, /SAS/);
  assert.match(html, /838 913 838/);
  assert.match(html, /FR90838913838/);
  assert.match(html, /10 rue de Penthièvre/);
  assert.match(html, /OVH SAS/);
  assert.match(html, /06 37 19 17 97/);
  assert.match(html, /09 72 10 10 07/);
  assert.match(html, /Racem Smaoui/);
  assert.equal(html.includes('00036'), false, 'SIRET must stay off the public page');
  assert.equal(html.includes('tel:'), false);
}
const aboutFr = read('/a-propos/');
const aboutEn = read('/en/about/');
for (const html of [home, homeEn, aboutFr, aboutEn]) {
  assert.equal(html.includes('06 37 19 17 97'), false, 'company phone stays on the legal notice');
  assert.equal(/racem/i.test(html), false, 'publisher name stays on the legal notice');
}
assert.match(aboutFr, /Coconsult Nearshore/);
assert.match(aboutFr, /juridiquement indépendante/);
assert.match(aboutEn, /Coconsult Nearshore/);
assert.match(aboutEn, /legally independent/);
assert.match(read('/services/equipes-dediees/'), /Coconsult Nearshore/);
assert.match(read('/en/services/dedicated-teams/'), /Coconsult Nearshore/);
assert.equal(/filiale|notre bureau|subsidiary/i.test(aboutFr + aboutEn + home + homeEn), false);
const homeLd = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)?.join('\n') ?? '';
assert.match(homeLd, /75008/);
assert.equal(homeLd.includes('"addressLocality":"Sfax"'), false, 'Sfax is not a registered establishment of the French publisher');
assert.match(privacyFr, /Coconsult Nearshore/);
assert.match(privacyFr, /e-mails de prospection/);
assert.match(privacyFr, /hors de l’Espace économique européen/);
assert.match(privacyFr, /ne rend pas le transfert licite/);
assert.match(privacyFr, /ne décrit pas de transfert de données de ces clients/);
assert.match(privacyEn, /does not describe a transfer of those clients/);
assert.equal(/module 3/i.test(privacyFr + privacyEn), false);
assert.match(privacyFr, /n’est pas confirmé/);
assert.match(privacyEn, /Coconsult Nearshore/);
assert.match(privacyEn, /prospecting email/);
assert.match(privacyEn, /outside the European Economic Area/);
assert.match(privacyEn, /does not make the transfer lawful/);
assert.match(privacyEn, /not named until it has been confirmed/);
assert.equal(/clauses contractuelles types sont signées|standard contractual clauses are signed/i.test(privacyFr + privacyEn), false);
assert.equal(/restent en France|stay in France|exclusively inside/i.test(privacyFr + privacyEn), false);
assert.equal(/google workspace/i.test(privacyFr + privacyEn), false);
assert.equal(/aucun transfert/i.test(privacyFr), false);
assert.equal(/cette checklist ne constitue pas un contrat/i.test(privacyFr + privacyEn), false);
for (const file of fs.readdirSync(dist, { recursive: true })) {
  const full = path.join(dist, String(file));
  if (!fs.statSync(full).isFile()) continue;
  if (!full.endsWith('.html') && !full.endsWith('.js')) continue;
  const text = fs.readFileSync(full, 'utf8');
  assert.equal(/document\.cookie|localStorage|sessionStorage|googletagmanager|gtag\(/.test(text), false, full);
}

console.log(`Static checks passed for ${pages.length * 2} localized pages`);
