import { chromium } from '@playwright/test';
import { mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const url = 'http://127.0.0.1:4321/design/behind-the-digital/';
const dir = 'docs/design/behind-the-digital';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

async function prepare(page) {
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__shifts.push(entry.value);
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(() => {}).observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

const videoContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir, size: { width: 1280, height: 800 } },
});
const videoPage = await videoContext.newPage();
await videoPage.goto(url, { waitUntil: 'domcontentloaded' });
await videoPage.waitForSelector('#introduction .scene[data-playing="true"]');
await videoPage.waitForTimeout(11000);
const video = videoPage.video();
await videoContext.close();
if (video) await rename(await video.path(), path.join(dir, 'intro-after-1440.webm'));

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await prepare(page);
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());

const motion = await page.evaluate(() => new Promise((resolve) => {
  document.querySelector('#introduction [data-replay]')?.click();
  let frames = 0;
  const start = performance.now();
  const tick = (now) => {
    frames += 1;
    if (document.querySelector('#introduction .scene')?.dataset.playing === 'true' && now - start < 12000) {
      requestAnimationFrame(tick);
    } else {
      resolve({ frames, ms: Math.round(now - start) });
    }
  };
  requestAnimationFrame(tick);
}));

await page.evaluate(() => document.querySelector('#introduction [data-replay]')?.click());
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(dir, 'intro-visible-1440.jpg'), type: 'jpeg', quality: 72 });
await page.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.phase === 'reveal');
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(dir, 'intro-reveal-1440.jpg'), type: 'jpeg', quality: 74 });
const overflowReveal = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.phase === 'flow');
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(dir, 'intro-flow-1440.jpg'), type: 'jpeg', quality: 74 });
await page.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.playing === 'false');
await page.waitForTimeout(1100);
await page.screenshot({ path: path.join(dir, 'intro-settled-1440.jpg'), type: 'jpeg', quality: 72 });

const layers = ['app', 'arch', 'data', 'cloud'];
for (const layer of layers) {
  await page.locator(`#xray input[value="${layer}"]`).check();
  await page.waitForTimeout(80);
  await page.locator('#xray .stack').screenshot({ path: path.join(dir, `xray-${layer}-1440.jpg`), type: 'jpeg', quality: 74 });
}
await page.locator('#xray input[value="app"]').focus();
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
const keyed = await page.evaluate(() => {
  const scene = document.querySelector('#xray .scene');
  return {
    checked: scene?.querySelector('input:checked')?.value,
    line: scene?.querySelector('[data-line]')?.textContent,
  };
});

await page.locator('[data-lang-toggle="en"]').click();
const english = {
  h1: await page.locator('main h1').innerText(),
  nav: await page.locator('[data-chrome="en"] .desktop-nav').innerText(),
  footer: await page.locator('[data-chrome="en"] .site-footer h2').first().innerText(),
  frenchChrome: await page.locator('[data-chrome="fr"]').first().evaluate((el) => getComputedStyle(el).display),
  talk: await page.locator('main .btn.primary').first().getAttribute('href'),
};
await page.screenshot({ path: path.join(dir, 'intro-en-1440.jpg'), type: 'jpeg', quality: 68 });

const overflow = { reveal1440: overflowReveal };
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
  overflow[width] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}
await page.setViewportSize({ width: 1024, height: 800 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: path.join(dir, 'intro-1024.jpg'), type: 'jpeg', quality: 70 });
await page.setViewportSize({ width: 768, height: 900 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: path.join(dir, 'intro-768.jpg'), type: 'jpeg', quality: 70 });
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: path.join(dir, 'intro-mobile-390.jpg'), type: 'jpeg', quality: 68 });
await page.locator('#xray').scrollIntoViewIfNeeded();
await page.locator('#xray .stack').screenshot({ path: path.join(dir, 'xray-mobile-390.jpg'), type: 'jpeg', quality: 68 });

await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
await page.waitForTimeout(150);
overflow.zoom2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.evaluate(() => { document.documentElement.style.zoom = ''; });

const cleanPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await prepare(cleanPage);
await cleanPage.goto(url, { waitUntil: 'domcontentloaded' });
await cleanPage.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.playing === 'false', null, { timeout: 15000 });
const perf = await cleanPage.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const lcp = performance.getEntriesByType('largest-contentful-paint').at(-1);
  const cls = (window.__shifts || []).reduce((sum, value) => sum + value, 0);
  return {
    dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
    lcp: lcp ? Math.round(lcp.startTime) : null,
    cls: Math.round(cls * 1000) / 1000,
    shifts: (window.__shifts || []).length,
  };
});
await cleanPage.close();

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 800 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(url, { waitUntil: 'domcontentloaded' });
await reducedPage.waitForTimeout(250);
const reduced = await reducedPage.locator('#introduction .scene').evaluate((el) => ({
  playing: el.dataset.playing || 'unset',
  phase: el.dataset.phase,
  closed: el.dataset.closed,
}));
await reducedPage.screenshot({ path: path.join(dir, 'intro-reduced-1440.jpg'), type: 'jpeg', quality: 68 });
await reducedContext.close();
await browser.close();

const videoStat = await stat(path.join(dir, 'intro-after-1440.webm'));
console.log(JSON.stringify({
  motion,
  fps: Math.round((motion.frames / motion.ms) * 1000),
  overflow,
  keyed,
  english,
  perf,
  reduced,
  videoBytes: videoStat.size,
  errors,
}, null, 2));
