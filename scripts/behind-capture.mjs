import { chromium } from '@playwright/test';
import { mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const url = 'http://127.0.0.1:4321/design/behind-the-digital/';
const home = 'http://127.0.0.1:4321/';
const dir = 'docs/design/behind-the-digital';
await mkdir(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

async function prepare(page) {
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.addInitScript(() => {
    const hide = () => document.querySelector('astro-dev-toolbar')?.remove();
    addEventListener('DOMContentLoaded', hide);
    addEventListener('load', hide);
  });
}

async function metrics(page) {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const lcp = performance.getEntriesByType('largest-contentful-paint').at(-1);
    const resources = performance.getEntriesByType('resource');
    const js = resources.filter((entry) => entry.initiatorType === 'script');
    const css = resources.filter((entry) => entry.name.includes('.css') || entry.initiatorType === 'link');
    const sum = (list) => Math.round(list.reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0), 0));
    return {
      lcp: lcp ? Math.round(lcp.startTime) : null,
      dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      jsBytes: sum(js),
      cssBytes: sum(css),
      requests: resources.length,
    };
  });
}

const videoContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir, size: { width: 1280, height: 800 } },
});
const videoPage = await videoContext.newPage();
await prepare(videoPage);
await videoPage.goto(url, { waitUntil: 'domcontentloaded' });
await videoPage.waitForSelector('#introduction .scene[data-playing="true"]');
await videoPage.waitForTimeout(12500);
const video = videoPage.video();
await videoContext.close();
if (video) await rename(await video.path(), path.join(dir, 'intro-1440.webm'));

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await prepare(page);
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
const prototypeMetrics = await metrics(page);
await page.evaluate(() => document.querySelector('#introduction [data-replay]')?.click());
await page.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.phase === 'reveal');
await page.waitForTimeout(1400);
await page.screenshot({ path: path.join(dir, 'intro-reveal-1440.jpg'), type: 'jpeg', quality: 74 });
const overflowReveal = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.phase === 'flow');
await page.waitForTimeout(1100);
await page.screenshot({ path: path.join(dir, 'intro-flow-1440.jpg'), type: 'jpeg', quality: 74 });
await page.waitForFunction(() => document.querySelector('#introduction .scene')?.dataset.playing === 'false');
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(dir, 'intro-settled-1440.jpg'), type: 'jpeg', quality: 72 });

await page.locator('#xray').scrollIntoViewIfNeeded();
await page.locator('#xray input[value="data"]').check();
await page.waitForTimeout(250);
await page.locator('#xray .scene').screenshot({ path: path.join(dir, 'xray-data-1440.jpg'), type: 'jpeg', quality: 74 });
const xrayOpacity = await page.locator('#xray .plate-app').evaluate((el) => getComputedStyle(el).opacity);
await page.locator('#xray input[value="arch"]').focus();
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
const keyed = await page.evaluate(() => {
  const scene = document.querySelector('#xray .scene');
  return {
    checked: scene?.querySelector('input:checked')?.value,
    line: scene?.querySelector('[data-line]')?.textContent,
  };
});

const overflow = { reveal1440: overflowReveal };
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
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
await page.screenshot({ path: path.join(dir, 'intro-mobile-390.jpg'), type: 'jpeg', quality: 68, fullPage: false });
await page.locator('#xray input[value="cloud"]').check();
await page.locator('#xray').scrollIntoViewIfNeeded();
await page.locator('#xray .hero-grid').screenshot({ path: path.join(dir, 'xray-mobile-390.jpg'), type: 'jpeg', quality: 68 });
await page.setViewportSize({ width: 320, height: 700 });
await page.evaluate(() => window.scrollTo(0, 0));
overflow[320] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.screenshot({ path: path.join(dir, 'intro-320.jpg'), type: 'jpeg', quality: 66 });

await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
await page.waitForTimeout(200);
overflow.zoom2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.screenshot({ path: path.join(dir, 'intro-zoom-200.jpg'), type: 'jpeg', quality: 60 });
await page.evaluate(() => { document.documentElement.style.zoom = ''; });

const reducedContext = await browser.newContext({
  viewport: { width: 1440, height: 800 },
  reducedMotion: 'reduce',
});
const reducedPage = await reducedContext.newPage();
await prepare(reducedPage);
await reducedPage.goto(url, { waitUntil: 'domcontentloaded' });
await reducedPage.waitForTimeout(300);
const reduced = await reducedPage.locator('#introduction .scene').evaluate((el) => ({
  playing: el.dataset.playing || 'unset',
  phase: el.dataset.phase,
  closed: el.dataset.closed,
}));
await reducedPage.screenshot({ path: path.join(dir, 'intro-reduced-1440.jpg'), type: 'jpeg', quality: 68 });
await reducedContext.close();

const homePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await prepare(homePage);
await homePage.goto(home, { waitUntil: 'networkidle' });
const homeMetrics = await metrics(homePage);
await homePage.screenshot({ path: path.join(dir, 'hero-current-1440.jpg'), type: 'jpeg', quality: 68 });

await browser.close();
const videoStat = await stat(path.join(dir, 'intro-1440.webm'));
console.log(JSON.stringify({
  overflow,
  xrayOpacity,
  keyed,
  reduced,
  prototypeMetrics,
  homeMetrics,
  videoBytes: videoStat.size,
  errors,
}, null, 2));
