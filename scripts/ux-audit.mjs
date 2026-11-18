import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4321';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'docs', 'ux', 'captures');
const proposalDir = path.join(root, 'docs', 'ux', 'proposals');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(proposalDir, { recursive: true });

const urls = [
  ['home', '/'],
  ['home', '/en/'],
  ['services', '/services/'],
  ['services', '/en/services/'],
  ['dedicated', '/services/equipes-dediees/'],
  ['dedicated', '/en/services/dedicated-teams/'],
  ['qa', '/services/qa-testing/'],
  ['qa', '/en/services/qa-testing/'],
  ['payments', '/services/paiements/'],
  ['payments', '/en/services/payments/'],
  ['automation', '/services/automatisation/'],
  ['automation', '/en/services/business-automation/'],
  ['ai', '/services/ia-entreprise/'],
  ['ai', '/en/services/enterprise-ai/'],
  ['software', '/services/developpement/'],
  ['software', '/en/services/software-engineering/'],
  ['cloud', '/services/cloud-devops/'],
  ['cloud', '/en/services/cloud-devops/'],
  ['cyber', '/services/cybersecurite/'],
  ['cyber', '/en/services/cybersecurity/'],
  ['modes', '/modes-intervention/'],
  ['modes', '/en/engagement/'],
  ['sectors', '/secteurs/'],
  ['sectors', '/en/industries/'],
  ['solutions', '/solutions/'],
  ['solutions', '/en/solutions/'],
  ['cases', '/realisations/'],
  ['cases', '/en/case-studies/'],
  ['about', '/a-propos/'],
  ['about', '/en/about/'],
  ['innovation', '/innovation/'],
  ['innovation', '/en/innovation/'],
  ['partnerships', '/partenariats/'],
  ['partnerships', '/en/partnerships/'],
  ['contact', '/contact/'],
  ['contact', '/en/contact/'],
  ['legal', '/mentions-legales/'],
  ['legal', '/en/legal-notice/'],
  ['privacy', '/confidentialite/'],
  ['privacy', '/en/privacy-policy/'],
];

const shotTemplates = new Set([
  'home', 'services', 'software', 'modes', 'sectors', 'solutions', 'cases', 'about', 'innovation', 'contact', 'legal',
]);

const measureJs = `(() => {
  const parse = (c) => {
    if (!c) return null;
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((v) => Number.parseFloat(v.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const composite = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  });
  const lum = (c) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  };
  const bgOf = (el) => {
    const layers = [];
    let node = el;
    while (node && node.nodeType === 1) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.01) layers.push(c);
      if (c && c.a >= 0.98) break;
      node = node.parentElement;
    }
    if (!layers.length) return { r: 7, g: 17, b: 28 };
    let out = { r: 7, g: 17, b: 28 };
    for (let i = layers.length - 1; i >= 0; i -= 1) out = composite(layers[i], out);
    return out;
  };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const offenders = [];
  const buckets = {};
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.replace(/\\s+/g, ' ').trim();
    if (text.length < 2) continue;
    const el = node.parentElement;
    if (!el || el.closest('script, style, noscript')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    const px = Number.parseFloat(cs.fontSize);
    const weight = Number.parseInt(cs.fontWeight, 10) || 400;
    const key = Math.round(px) + '|' + cs.fontFamily.split(',')[0].replaceAll('"', '');
    buckets[key] = (buckets[key] || 0) + 1;
    const fg0 = parse(cs.color);
    if (!fg0) continue;
    const bg = bgOf(el);
    const fg = composite(fg0, bg);
    const value = ratio(fg, bg);
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;
    const signature = [hex(fg), hex(bg), px.toFixed(1), weight, el.tagName, (el.className && typeof el.className === 'string' ? el.className : '').split(' ').slice(0, 2).join('.')].join('|');
    if (value + 0.05 < required && !seen.has(signature)) {
      seen.add(signature);
      offenders.push({
        text: text.slice(0, 80),
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join(' ') : '',
        px: Math.round(px * 10) / 10,
        weight,
        family: cs.fontFamily.split(',')[0].replaceAll('"', ''),
        fg: hex(fg),
        bg: hex(bg),
        ratio: Math.round(value * 100) / 100,
        required,
      });
    }
  }
  const tight = [];
  for (const el of document.querySelectorAll('a, button, input, select, textarea, summary')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    const inline = cs.display === 'inline' || el.closest('p, li');
    if (inline && el.tagName === 'A' && el.closest('p, li, dd')) continue;
    const box = { w: Math.round(rect.width), h: Math.round(rect.height) };
    if (box.w < 24 || box.h < 24) {
      tight.push({ kind: 'under-24', text: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40), ...box });
    } else if (box.w < 44 || box.h < 44) {
      tight.push({ kind: 'under-44', text: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40), ...box });
    }
  }
  const clipped = [];
  for (const el of document.querySelectorAll('h1, h2, h3, p, a, button, li, figcaption, label, small')) {
    if (el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 40) {
      const cs = getComputedStyle(el);
      if (cs.overflowX === 'visible') continue;
      clipped.push((el.innerText || '').trim().slice(0, 60));
      if (clipped.length > 8) break;
    }
  }
  const form = [...document.querySelectorAll('label, .field span, .error, small')].slice(0, 24).map((el) => {
    const cs = getComputedStyle(el);
    return { text: (el.innerText || '').trim().slice(0, 70), px: Number.parseFloat(cs.fontSize), family: cs.fontFamily.split(',')[0] };
  }).filter((item) => item.text);
  return {
    overflow,
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    offenders: offenders.sort((a, b) => a.ratio - b.ratio).slice(0, 18),
    buckets,
    tight: tight.slice(0, 20),
    clipped,
    form,
    h1: document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).fontSize : '',
  };
})()`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const report = [];

for (const [id, url] of urls) {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : width === 768 ? 1024 : 1000 });
    const response = await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const data = await page.evaluate(measureJs);
    const lang = url.startsWith('/en') ? 'en' : 'fr';
    const row = { id, url, lang, width, status: response?.status() ?? 0, ...data };
    report.push(row);
    if (shotTemplates.has(id)) {
      const file = path.join(outDir, `${id}-${lang}-${width}.jpg`);
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 60 });
      row.shot = path.relative(root, file).replaceAll('\\', '/');
    }
    process.stdout.write(`${url} @${width} overflow=${data.overflow} fails=${data.offenders.length}\n`);
  }
}

const focusPages = ['/', '/contact/', '/secteurs/', '/en/'];
const focus = [];
for (const url of focusPages) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  const steps = [];
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab');
    const step = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 50),
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
      };
    });
    steps.push(step);
  }
  focus.push({ url, steps });
}

const zoom = [];
for (const url of ['/', '/services/developpement/', '/contact/', '/secteurs/']) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  const before = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  const after = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: getComputedStyle(document.querySelector('h1')).fontSize,
  }));
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  zoom.push({ url, before, ...after });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.reload({ waitUntil: 'networkidle' });
const motion = await page.evaluate(() => {
  const sample = document.querySelector('.lane, .packet, .particle, .reveal, .pulse-dot');
  if (!sample) return { found: false };
  const cs = getComputedStyle(sample);
  return { found: true, tag: sample.className, animation: cs.animationName, transition: cs.transitionDuration };
});

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const menu = page.locator('.menu-toggle');
if (await menu.count()) {
  await menu.click();
  await page.screenshot({ path: path.join(outDir, 'home-fr-390-menu.jpg'), type: 'jpeg', quality: 60 });
}

const proposalCss = {
  A: `
    .experience .eyebrow, .page-hero .eyebrow, .site-footer h2, .experience .skill span,
    .experience .plate small, .experience .layer small, .experience .step small,
    .experience .file-col p, .experience .trace-label, .experience .member-bar span,
    .experience .cap-index, .experience .sector-mark, .experience .sector-angles li,
    .experience .service-links a {
      color: #d7e4ee !important;
      font-size: 13px !important;
      letter-spacing: 0.04em !important;
    }
    .kicker, .field span, .summary dt { font-size: 13px !important; letter-spacing: 0.04em !important; }
    .lede, .hero-lead, .section-intro p, .prose p, .plain-list, .service-card p, .info-card p, .work-card p, .step p {
      font-size: 17px !important;
      line-height: 1.55 !important;
      color: #24384c !important;
    }
    .page-hero .lede, .experience .lede { color: #d7e4ee !important; }
    .desktop-nav a, .site-footer a, .footer-brand p { font-size: 15px !important; }
  `,
  B: `
    .experience #secteurs, .experience #modes, .experience #realisations {
      background: #f4f7f8 !important;
      color: #122033 !important;
    }
    .experience #secteurs .eyebrow, .experience #modes .eyebrow, .experience #realisations .eyebrow { color: #0b6f86 !important; }
    .experience #secteurs p, .experience #modes p, .experience #realisations p,
    .experience #secteurs h2, .experience #modes h2, .experience #realisations h2 { color: #122033 !important; }
    .experience #secteurs .sector-tile {
      background: #ffffff !important;
      color: #122033 !important;
      border-color: #d5e1eb !important;
    }
    .experience #secteurs .sector-tile p { color: #3c5164 !important; }
    .experience #secteurs .sector-mark, .experience #secteurs .sector-angles li { color: #0b6f86 !important; border-color: #b7d0dc !important; }
    .page-hero { background: #07111c !important; }
    .section.band, .section.band-alt { background: #f7fafb !important; }
    .section-intro p, .prose p, .plain-list, .service-card p, .info-card p { font-size: 17px !important; line-height: 1.6 !important; }
    .band-dark { background: #102233 !important; }
  `,
};

for (const [name, css] of Object.entries(proposalCss)) {
  for (const [id, url] of [['home', '/'], ['software', '/services/developpement/'], ['contact', '/contact/']]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: css });
    await page.screenshot({ path: path.join(proposalDir, `${name}-${id}-1440.jpg`), fullPage: true, type: 'jpeg', quality: 58 });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(proposalDir, `${name}-${id}-390.jpg`), fullPage: true, type: 'jpeg', quality: 58 });
  }
}

const payload = { focus, zoom, motion, pages: report };
fs.writeFileSync(path.join(root, 'docs', 'ux', 'measures.json'), JSON.stringify(payload, null, 2));
await browser.close();
console.log('audit written');
