import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:4321';
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

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await mkdir('docs/ux/pr-32/after', { recursive: true });
const checks = [];
for (const [name, locale, path] of shots) {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      orbit: getComputedStyle(document.querySelector('.orbit-stage') || document.body).display,
      nav: getComputedStyle(document.querySelector('.desktop-nav') || document.body).display,
      sectors: getComputedStyle(document.querySelector('.sector-grid') || document.body).gridTemplateColumns,
    }));
    checks.push({ name, locale, width, ...state });
    await page.screenshot({
      path: `docs/ux/pr-32/after/${name}-${locale}-${width}.jpg`,
      type: 'jpeg',
      quality: 62,
      fullPage: true,
    });
  }
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
const zoom = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.screenshot({ path: 'docs/ux/pr-32/after/home-fr-zoom.jpg', type: 'jpeg', quality: 60, fullPage: false });
await page.goto(base + '/en/', { waitUntil: 'networkidle' });
await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
const zoomEn = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(JSON.stringify({ checks, zoom, zoomEn }, null, 2));
await browser.close();
