import { chromium } from '@playwright/test';
import { mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const mode = process.argv[2] || 'all';
const oldUrl = 'http://127.0.0.1:4321/';
const newUrl = process.argv[3] || 'http://127.0.0.1:4321/';
const dir = 'docs/design/behind-the-digital/hero';
await mkdir(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = { old: [], new: [] };

async function shot(page, name) {
  await page.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 70 });
}

async function seo(page) {
  return page.evaluate(() => {
    const text = (sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() || '';
    const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || '';
    return {
      title: document.title,
      description: meta('description'),
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      h1: text('h1'),
      talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
      explore: document.querySelector('.hero .btn.ghost')?.getAttribute('href') || '',
      lang: document.documentElement.lang,
      jsonld: document.querySelector('script[type="application/ld+json"]')?.textContent || '',
      behind: Boolean(document.querySelector('[data-behind]')),
      system: Boolean(document.querySelector('#systeme')),
      expertises: Boolean(document.querySelector('#expertises')),
    };
  });
}

let oldSeo = null;
if (mode !== 'new') {
const oldPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
oldPage.on('pageerror', (error) => errors.old.push(String(error)));
await oldPage.goto(oldUrl, { waitUntil: 'domcontentloaded' });
await oldPage.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
await oldPage.waitForTimeout(400);
const oldSeo = await seo(oldPage);
await shot(oldPage, 'old-fr-1440.jpg');
for (const width of [1024, 768, 390, 320]) {
  await oldPage.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  await oldPage.evaluate(() => window.scrollTo(0, 0));
  await oldPage.waitForTimeout(80);
  await shot(oldPage, `old-fr-${width}.jpg`);
}
await oldPage.close();
console.log(JSON.stringify({ oldSeo, errors: errors.old }, null, 2));
}

if (mode !== 'old') {
const videoContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir, size: { width: 1280, height: 800 } },
});
const videoPage = await videoContext.newPage();
await videoPage.goto(newUrl, { waitUntil: 'domcontentloaded' });
await videoPage.waitForSelector('.hero .behind-scene[data-playing="true"]');
await videoPage.waitForTimeout(10000);
const video = videoPage.video();
await videoContext.close();
if (video) await rename(await video.path(), path.join(dir, 'home-fr-1440.webm'));

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (error) => errors.new.push(String(error)));
await page.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__shifts.push(entry.value);
    }
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(() => {}).observe({ type: 'largest-contentful-paint', buffered: true });
});
await page.goto(newUrl, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.phase === 'reveal', null, { timeout: 8000 });
await page.waitForTimeout(900);
await shot(page, 'new-fr-reveal-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
await page.waitForTimeout(300);
await shot(page, 'new-fr-settled-1440.jpg');
const perf = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const lcp = performance.getEntriesByType('largest-contentful-paint').at(-1);
  const cls = (window.__shifts || []).reduce((sum, value) => sum + value, 0);
  return {
    dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
    lcp: lcp ? Math.round(lcp.startTime) : null,
    cls: Math.round(cls * 1000) / 1000,
  };
});
const newSeo = await seo(page);

const overflow = {};
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  overflow[width] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (width !== 1440) await shot(page, `new-fr-${width}.jpg`);
}
await page.setViewportSize({ width: 390, height: 844 });
await page.locator('.hero .stack').scrollIntoViewIfNeeded();
await shot(page, 'new-fr-390-scene.jpg');
await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo(0, 0));

await page.locator('.hero input[value="app"]').focus();
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
const keyed = await page.evaluate(() => ({
  checked: document.querySelector('.hero input:checked')?.value,
  line: document.querySelector('.hero [data-line]')?.textContent,
}));

const skill = page.locator('#expertises .skill').nth(1);
await skill.click();
const expertise = await page.evaluate(() => ({
  pressed: document.querySelector('#tab-software')?.getAttribute('aria-pressed'),
  panelHidden: document.querySelector('#panel-software')?.hasAttribute('hidden'),
}));

await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.locator('.menu-toggle').click();
const menu = await page.evaluate(() => ({
  expanded: document.querySelector('.menu-toggle')?.getAttribute('aria-expanded'),
  hidden: document.querySelector('.mobile-nav')?.hasAttribute('hidden'),
  services: document.querySelector('.mobile-nav a[href="/services/"]')?.textContent?.trim() || '',
}));
await page.keyboard.press('Escape');
await page.locator('.hero input[value="cloud"]').click();
const touched = await page.evaluate(() => document.querySelector('.hero input:checked')?.value);
await shot(page, 'new-fr-390-menu-closed.jpg');

await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
await page.waitForTimeout(150);
overflow.zoom2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.evaluate(() => { document.documentElement.style.zoom = ''; });

await page.goto(new URL('/en/', newUrl).href, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
const enSeo = await seo(page);
await shot(page, 'new-en-1440.jpg');

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(newUrl, { waitUntil: 'domcontentloaded' });
await reducedPage.waitForTimeout(300);
const reduced = await reducedPage.locator('.hero .behind-scene').evaluate((el) => ({
  playing: el.dataset.playing || 'unset',
  phase: el.dataset.phase,
  closed: el.dataset.closed,
}));
await reducedPage.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
await reducedPage.screenshot({ path: path.join(dir, 'new-reduced-1440.jpg'), type: 'jpeg', quality: 70 });
await reducedContext.close();

const proto = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const protoStatus = await proto.goto(new URL('/design/behind-the-digital/', newUrl).href, { waitUntil: 'domcontentloaded' });
const protoOk = await proto.evaluate(() => ({
  scenes: document.querySelectorAll('.behind-scene').length,
  h1: document.querySelector('main h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
}));
await proto.close();
const videoStat = await stat(path.join(dir, 'home-fr-1440.webm'));
console.log(JSON.stringify({
  newSeo, enSeo, keyed, expertise, menu, touched, reduced, overflow, perf,
  protoStatus: protoStatus?.status(), protoOk, errors: errors.new, videoBytes: videoStat.size,
}, null, 2));
}
await browser.close();
