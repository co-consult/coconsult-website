import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:4321';
const widths = [320, 390, 768, 1440];
const shots = [
  ['home', 'fr', '/'],
  ['home', 'en', '/en/'],
  ['services', 'fr', '/services/'],
  ['services', 'en', '/en/services/'],
  ['cases', 'fr', '/realisations/'],
  ['cases', 'en', '/en/case-studies/'],
  ['contact', 'fr', '/contact/'],
  ['contact', 'en', '/en/contact/'],
];

const measure = () => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    if (rect.right > doc.clientWidth + 1 || rect.left < -1) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') continue;
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 80),
        right: Math.round(rect.right),
        left: Math.round(rect.left),
        w: Math.round(rect.width),
      });
      if (offenders.length > 8) break;
    }
  }
  const header = document.querySelector('.header-bar');
  const headerOverflow = header ? header.scrollWidth - header.clientWidth : null;
  const nav = [...document.querySelectorAll('.desktop-nav a')].map((a) => {
    const s = getComputedStyle(a);
    return { text: a.textContent.trim(), size: s.fontSize, display: s.display };
  });
  return { overflow, client: doc.clientWidth, scroll: doc.scrollWidth, headerOverflow, nav, offenders };
};

const contrastScan = () => {
  const parse = (c) => {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((s) => parseFloat(s));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (fg, bg) => {
    const a = lum(fg);
    const b = lum(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const bgOf = (el) => {
    let node = el;
    let acc = { r: 255, g: 255, b: 255, a: 1 };
    const stack = [];
    while (node && node !== document.documentElement) {
      const bg = parse(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) stack.push(bg);
      node = node.parentElement;
    }
    const root = parse(getComputedStyle(document.body).backgroundColor);
    if (root) stack.push(root);
    for (let i = stack.length - 1; i >= 0; i -= 1) acc = over(stack[i], acc);
    return acc;
  };
  const fails = [];
  const sizes = {};
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[hidden], [aria-hidden="true"]')) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!text) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    const size = Math.round(parseFloat(style.fontSize));
    sizes[size] = (sizes[size] || 0) + 1;
    if (el.matches(':disabled') || el.closest(':disabled') || el.getAttribute('aria-disabled') === 'true') continue;
    const fg = parse(style.color);
    if (!fg) continue;
    const painted = over(fg, bgOf(el));
    const r = ratio(painted, bgOf(el));
    const bold = Number(style.fontWeight) >= 600;
    const large = size >= 24 || (bold && size >= 19);
    const need = large ? 3 : 4.5;
    if (r + 0.05 < need) {
      fails.push({
        text: el.textContent.trim().slice(0, 42),
        size,
        weight: style.fontWeight,
        r: Math.round(r * 100) / 100,
        cls: String(el.className).slice(0, 60),
      });
      if (fails.length > 12) break;
    }
  }
  return { fails, sizes };
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const report = { widths: [], zoom: [], sitemap: [], interactions: [] };

for (const width of widths) {
  await page.setViewportSize({ width, height: 900 });
  for (const path of ['/', '/en/', '/contact/', '/services/', '/realisations/']) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const row = await page.evaluate(measure);
    report.widths.push({ width, path, ...row, nav: undefined, navCount: row.nav.length });
    if (row.overflow > 1 || (row.headerOverflow || 0) > 1) {
      report.widths[report.widths.length - 1].nav = row.nav;
    }
  }
}

await page.setViewportSize({ width: 1440, height: 900 });
for (const path of ['/', '/en/', '/contact/', '/services/']) {
  await page.goto(base + path, { waitUntil: 'networkidle' });
  const zoomed = await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
    const doc = document.documentElement;
    const overflow = doc.scrollWidth - doc.clientWidth;
    const client = doc.clientWidth;
    const scroll = doc.scrollWidth;
    const wide = [];
    for (const el of document.querySelectorAll('.plate, .rail, .pipeline, .stage, .hero, .orbit-stage, .out-plate')) {
      const rect = el.getBoundingClientRect();
      wide.push({ cls: String(el.className).slice(0, 60), right: Math.round(rect.right), w: Math.round(rect.width) });
    }
    document.documentElement.style.zoom = '';
    return { overflow, client, scroll, wide: wide.slice(0, 12) };
  });
  report.zoom.push({ path, ...zoomed });
}

const indexXml = await (await page.goto(base + '/sitemap.xml', { waitUntil: 'networkidle' })).text();
let urls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (urls.some((path) => path.endsWith('.xml'))) {
  const nested = [];
  for (const path of urls.filter((item) => item.endsWith('.xml'))) {
    const xml = await (await page.goto(base + path, { waitUntil: 'domcontentloaded' })).text();
    nested.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  }
  urls = nested;
}
report.sitemapCount = urls.length;
await page.setViewportSize({ width: 1440, height: 800 });
for (const path of urls) {
  const res = await page.goto(base + path, { waitUntil: 'domcontentloaded' });
  const row = await page.evaluate(measure);
  const contrast = await page.evaluate(contrastScan);
  report.sitemap.push({
    path,
    status: res.status(),
    overflow: row.overflow,
    fails: contrast.fails,
    small: Object.entries(contrast.sizes).filter(([size]) => Number(size) < 13).map(([size, n]) => `${size}:${n}`),
  });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
const homeClick = await page.evaluate(async () => {
  const skill = document.querySelector('.skill');
  const pipe = document.querySelector('#run-pipe');
  const before = document.querySelector('.pipeline')?.className || '';
  skill?.click();
  pipe?.click();
  await new Promise((r) => setTimeout(r, 400));
  return {
    skillPressed: skill?.getAttribute('aria-pressed') || null,
    pipeClass: document.querySelector('.pipeline')?.className || before,
    qa: !!document.querySelector('#run-qa'),
  };
});
report.interactions.push({ home: homeClick });

await page.goto(base + '/contact/', { waitUntil: 'networkidle' });
const keys = [];
for (let i = 0; i < 8; i += 1) {
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 40),
      outline: s.outlineStyle + ' ' + s.outlineWidth,
    };
  });
  keys.push(focused);
}
report.interactions.push({ contactTabs: keys });

await mkdir('docs/ux/pr-32/after', { recursive: true });
for (const [name, locale, path] of shots) {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `docs/ux/pr-32/after/${name}-${locale}-${width}.jpg`,
      type: 'jpeg',
      quality: 60,
      fullPage: true,
    });
  }
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
