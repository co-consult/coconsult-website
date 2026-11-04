import { chromium } from '@playwright/test';
import { copyFile, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:4321/';
const dir = 'docs/design/behind-the-digital/v3';
const beforeDir = path.join(dir, 'before-ux');
const afterDir = path.join(dir, 'after-ux');
await mkdir(dir, { recursive: true });
await mkdir(beforeDir, { recursive: true });
await mkdir(afterDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

async function shot(page, folder, name) {
  await page.screenshot({ path: path.join(folder, name), type: 'jpeg', quality: 72 });
}

async function clearToolbar(page) {
  await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
}

async function waitPainted(page) {
  await page.waitForFunction(() => {
    const scene = document.querySelector('.hero .behind-scene');
    const body = document.body;
    if (!scene || !body) return false;
    const bg = getComputedStyle(body).backgroundColor;
    return bg.includes('7') || bg.includes('rgb');
  });
  await page.waitForTimeout(120);
}

// Keep a stable "before" reference from the previous V3 stills when present.
for (const name of [
  'moment-appear-1440.jpg',
  'moment-reveal-1440.jpg',
  'moment-settled-1440.jpg',
  'settled-fr-390.jpg',
]) {
  try {
    await copyFile(path.join(dir, name), path.join(beforeDir, name));
  } catch {
    // First run may not have the previous stills.
  }
}

// Warm the document outside the recorder so the filmed navigation is short.
{
  const warm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await warm.goto(base, { waitUntil: 'networkidle' });
  await warm.close();
}

const desktopContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
  recordVideo: { dir, size: { width: 1440, height: 900 } },
});
const desktopPage = await desktopContext.newPage();
await desktopPage.setContent('<!doctype html><html style="background:#07111c"><body style="margin:0;background:#07111c"></body></html>');
await desktopPage.goto(base, { waitUntil: 'domcontentloaded' });
await clearToolbar(desktopPage);
await desktopPage.waitForSelector('.hero .behind-scene');
await waitPainted(desktopPage);
await desktopPage.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
  null,
  { timeout: 8000 },
);
await desktopPage.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false',
  null,
  { timeout: 15000 },
);
await desktopPage.waitForTimeout(400);
await desktopContext.close();
const desktopVideo = desktopPage.video();
if (desktopVideo) await rename(await desktopVideo.path(), path.join(dir, 'home-fr-1440.webm'));

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: 'dark',
  recordVideo: { dir, size: { width: 390, height: 844 } },
});
const mobilePage = await mobileContext.newPage();
await mobilePage.setContent('<!doctype html><html style="background:#07111c"><body style="margin:0;background:#07111c"></body></html>');
await mobilePage.goto(base, { waitUntil: 'domcontentloaded' });
await clearToolbar(mobilePage);
await mobilePage.waitForSelector('.hero .behind-scene');
await waitPainted(mobilePage);
await mobilePage.waitForTimeout(600);
const startedBelow = await mobilePage.evaluate(() => {
  const scene = document.querySelector('.hero .behind-scene');
  const rect = scene?.getBoundingClientRect();
  return {
    playing: scene?.dataset.playing === 'true',
    autoplayed: scene?.dataset.autoplayed === 'true',
    top: rect ? Math.round(rect.top) : null,
  };
});
await mobilePage.locator('.hero .behind-scene').scrollIntoViewIfNeeded();
await mobilePage.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
  null,
  { timeout: 8000 },
);
await mobilePage.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false',
  null,
  { timeout: 15000 },
);
await mobilePage.waitForTimeout(400);
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
await page.waitForSelector('.hero .behind-scene');
const initial = await page.evaluate(() => {
  const scene = document.querySelector('.hero .behind-scene');
  return {
    playing: scene?.dataset.playing || 'unset',
    phase: scene?.dataset.phase,
    closed: scene?.dataset.closed,
    autoplayed: scene?.dataset.autoplayed || 'false',
  };
});
await shot(page, afterDir, 'desktop-initial-1440.jpg');
await page.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
  null,
  { timeout: 8000 },
);
await page.waitForTimeout(700);
await shot(page, afterDir, 'desktop-appear-1440.jpg');
await shot(page, dir, 'moment-appear-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.phase === 'reveal', null, { timeout: 8000 });
await page.waitForTimeout(900);
await shot(page, afterDir, 'desktop-reveal-1440.jpg');
await shot(page, dir, 'moment-reveal-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.phase === 'flow', null, { timeout: 8000 });
await page.waitForTimeout(700);
await shot(page, dir, 'moment-flow-1440.jpg');
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 12000 });
await page.waitForTimeout(350);
await shot(page, afterDir, 'desktop-settled-1440.jpg');
await shot(page, dir, 'moment-settled-1440.jpg');

const leave = await page.evaluate(() => {
  const scene = document.querySelector('.hero .behind-scene');
  scene?.querySelector('[data-replay]')?.dispatchEvent(new Event('click', { bubbles: true }));
  return scene?.dataset.playing === 'true';
});
await page.waitForTimeout(300);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
const leftViewport = await page.evaluate(() => {
  const scene = document.querySelector('.hero .behind-scene');
  return {
    playing: scene?.dataset.playing === 'true',
    phase: scene?.dataset.phase,
  };
});
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);

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
  await shot(page, dir, `settled-fr-${width}.jpg`);
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: 'domcontentloaded' });
await clearToolbar(page);
await page.waitForSelector('.hero .behind-scene');
const mobileInitial = await page.evaluate(() => {
  const scene = document.querySelector('.hero .behind-scene');
  const rect = scene?.getBoundingClientRect();
  return {
    playing: scene?.dataset.playing === 'true',
    autoplayed: scene?.dataset.autoplayed === 'true',
    top: rect ? Math.round(rect.top) : null,
  };
});
await shot(page, afterDir, 'mobile-above-fold-390.jpg');
await page.locator('.hero .behind-scene').scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
  null,
  { timeout: 8000 },
);
await page.waitForTimeout(500);
await shot(page, afterDir, 'mobile-playing-390.jpg');
await page.waitForFunction(
  () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false',
  null,
  { timeout: 15000 },
);
await shot(page, afterDir, 'mobile-settled-390.jpg');
await shot(page, dir, 'settled-fr-390.jpg');
await page.locator('.hero .stack').scrollIntoViewIfNeeded();
await shot(page, dir, 'settled-fr-390-scene.jpg');

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: 'domcontentloaded' });
await clearToolbar(page);
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
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

const seo = await page.evaluate(() => {
  const text = (sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() || '';
  return {
    h1: text('h1'),
    talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
    explore: document.querySelector('.hero .btn.ghost')?.getAttribute('href') || '',
    title: document.title,
  };
});

await page.goto(new URL('/en/', base).href, { waitUntil: 'domcontentloaded' });
await clearToolbar(page);
await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
const enSeo = await page.evaluate(() => {
  const text = (sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() || '';
  return {
    h1: text('h1'),
    talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
    lang: document.documentElement.lang,
    title: document.title,
  };
});
await shot(page, dir, 'settled-en-1440.jpg');

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(base, { waitUntil: 'domcontentloaded' });
await reducedPage.waitForTimeout(500);
const reduced = await reducedPage.locator('.hero .behind-scene').evaluate((el) => ({
  playing: el.dataset.playing || 'unset',
  phase: el.dataset.phase,
  closed: el.dataset.closed,
  autoplayed: el.dataset.autoplayed || 'false',
}));
await clearToolbar(reducedPage);
await reducedPage.screenshot({ path: path.join(dir, 'reduced-1440.jpg'), type: 'jpeg', quality: 72 });
await reducedContext.close();

const desktopStat = await stat(path.join(dir, 'home-fr-1440.webm'));
const mobileStat = await stat(path.join(dir, 'home-fr-390.webm'));
console.log(JSON.stringify({
  initial,
  startedBelow,
  mobileInitial,
  leaveStarted: leave,
  leftViewport,
  keyed,
  touched,
  reduced,
  overflow,
  perf,
  seo,
  enSeo,
  errors,
  desktopBytes: desktopStat.size,
  mobileBytes: mobileStat.size,
}, null, 2));
await browser.close();
