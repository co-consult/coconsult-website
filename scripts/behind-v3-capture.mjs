import { chromium } from '@playwright/test';
import { mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:4321/';
const dir = 'docs/design/behind-the-digital/v3';
await mkdir(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

async function shot(page, name) {
  await page.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 72 });
}

async function clearToolbar(page) {
  await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
}

const videoContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir, size: { width: 1280, height: 800 } },
});
const videoPage = await videoContext.newPage();
await videoPage.goto(base, { waitUntil: 'domcontentloaded' });
await videoPage.waitForSelector('.hero .behind-scene[data-playing="true"]');
await videoPage.waitForTimeout(9800);
await videoContext.close();
const desktopVideo = videoPage.video();
if (desktopVideo) await rename(await desktopVideo.path(), path.join(dir, 'home-fr-1440.webm'));

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  recordVideo: { dir, size: { width: 390, height: 844 } },
});
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(base, { waitUntil: 'domcontentloaded' });
await mobilePage.waitForSelector('.hero .behind-scene[data-playing="true"]');
await mobilePage.waitForTimeout(9800);
await mobileContext.close();
const mobileVideo = mobilePage.video();
if (mobileVideo) await rename(await mobileVideo.path(), path.join(dir, 'home-fr-390.webm'));

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (error) => errors.push(String(error)));
await page.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__shifts.push(entry.value);
    }
  }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto(base, { waitUntil: 'domcontentloaded' });
await clearToolbar(page);
await page.waitForSelector('.hero .behind-scene[data-playing="true"]');
await page.waitForTimeout(700);
await shot(page, 'moment-appear-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.phase === 'reveal', null, { timeout: 8000 });
await page.waitForTimeout(900);
await shot(page, 'moment-reveal-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.phase === 'flow', null, { timeout: 8000 });
await page.waitForTimeout(700);
await shot(page, 'moment-flow-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 12000 });
await page.waitForTimeout(350);
await shot(page, 'moment-settled-1440.jpg');

const perf = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const cls = (window.__shifts || []).reduce((sum, value) => sum + value, 0);
  return {
    dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
    cls: Math.round(cls * 1000) / 1000,
    version: document.querySelector('.hero .behind-scene')?.dataset.version || '',
  };
});

const overflow = {};
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
  overflow[width] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await shot(page, `settled-fr-${width}.jpg`);
}

await page.setViewportSize({ width: 390, height: 844 });
await page.locator('.hero .stack').scrollIntoViewIfNeeded();
await shot(page, 'settled-fr-390-scene.jpg');

await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.locator('.hero .layers label').nth(0).focus();
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
const keyed = await page.evaluate(() => ({
  checked: document.querySelector('.hero input:checked')?.value,
  line: document.querySelector('.hero [data-line]')?.textContent,
}));

await page.locator('.hero .layers label').nth(3).click();
const touched = await page.evaluate(() => document.querySelector('.hero input:checked')?.value);

await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
await page.waitForTimeout(150);
overflow.zoom2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.evaluate(() => { document.documentElement.style.zoom = ''; });

await page.goto(new URL('/en/', base).href, { waitUntil: 'domcontentloaded' });
await clearToolbar(page);
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
await shot(page, 'settled-en-1440.jpg');

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(base, { waitUntil: 'domcontentloaded' });
await reducedPage.waitForTimeout(350);
const reduced = await reducedPage.locator('.hero .behind-scene').evaluate((el) => ({
  playing: el.dataset.playing || 'unset',
  phase: el.dataset.phase,
  closed: el.dataset.closed,
}));
await clearToolbar(reducedPage);
await reducedPage.screenshot({ path: path.join(dir, 'reduced-1440.jpg'), type: 'jpeg', quality: 72 });
await reducedContext.close();

const desktopStat = await stat(path.join(dir, 'home-fr-1440.webm'));
const mobileStat = await stat(path.join(dir, 'home-fr-390.webm'));
console.log(JSON.stringify({
  keyed, touched, reduced, overflow, perf, errors,
  desktopBytes: desktopStat.size,
  mobileBytes: mobileStat.size,
}, null, 2));
await browser.close();
