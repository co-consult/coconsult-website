import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sceneUrl = process.argv[2] || 'http://127.0.0.1:4180/';
const orbitUrl = process.argv[3] || 'http://127.0.0.1:4181/';
const outDir = 'docs/design/behind-the-digital/activation';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { scene: {}, orbit: {}, errors: [] };

async function clearToolbar(page) {
  await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
}

async function probe(url, label) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => report.errors.push(`${label}: ${error}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  const desktop = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
    talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
    explore: document.querySelector('.hero .btn.ghost')?.getAttribute('href') || '',
    behind: Boolean(document.querySelector('[data-behind]')),
    system: Boolean(document.querySelector('#systeme')),
    assistant: Boolean(document.querySelector('[data-assistant-open]')),
    version: document.querySelector('[data-behind]')?.getAttribute('data-version') || null,
  }));
  await page.screenshot({ path: path.join(outDir, `${label}-fr-1440.jpg`), type: 'jpeg', quality: 70 });

  await page.goto(new URL('/en/', url).href, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  const en = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
    talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
    behind: Boolean(document.querySelector('[data-behind]')),
    system: Boolean(document.querySelector('#systeme')),
    assistant: Boolean(document.querySelector('[data-assistant-open]')),
  }));
  await page.screenshot({ path: path.join(outDir, `${label}-en-1440.jpg`), type: 'jpeg', quality: 70 });

  await page.goto(new URL('/services/', url).href, { waitUntil: 'networkidle' });
  const services = await page.evaluate(() => ({
    title: document.title,
    behind: Boolean(document.querySelector('[data-behind]')),
  }));

  await page.goto(new URL('/contact/', url).href, { waitUntil: 'networkidle' });
  const contact = await page.evaluate(() => ({
    title: document.title,
    hasEmail: Boolean(document.querySelector('input[name="email"], #email, [name="email"]')),
    form: Boolean(document.querySelector('form')),
  }));

  let mobile = null;
  let reduced = null;
  let keyboard = null;
  let overflow = null;
  if (label === 'scene') {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await clearToolbar(page);
    await page.waitForSelector('.hero .behind-scene');
    mobile = await page.evaluate(() => {
      const scene = document.querySelector('.hero .behind-scene');
      const rect = scene.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return {
        playing: scene.dataset.playing === 'true',
        ratio: Math.round(Math.max(0, visible / rect.height) * 1000) / 1000,
        menu: Boolean(document.querySelector('.menu-toggle')),
      };
    });
    await page.locator('.hero .behind-scene').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true' || document.querySelector('.hero .behind-scene')?.dataset.autoplayed === 'true', null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    mobile.afterScrollPlaying = await page.evaluate(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true');
    await page.locator('.menu-toggle').click();
    mobile.menuOpen = await page.evaluate(() => document.querySelector('.menu-toggle')?.getAttribute('aria-expanded') === 'true');
    await page.keyboard.press('Escape');
    await page.screenshot({ path: path.join(outDir, 'scene-fr-390.jpg'), type: 'jpeg', quality: 70 });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await clearToolbar(page);
    await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
    await page.locator('.hero .layers label').nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    keyboard = await page.evaluate(() => document.querySelector('.hero input:checked')?.value);

    const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await reducedPage.goto(url, { waitUntil: 'networkidle' });
    reduced = await reducedPage.evaluate(() => ({
      playing: document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
      phase: document.querySelector('.hero .behind-scene')?.dataset.phase,
      closed: document.querySelector('.hero .behind-scene')?.dataset.closed === 'true',
    }));
    await reducedPage.close();

    overflow = {};
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(80);
      overflow[width] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    }
  }

  await page.close();
  return { desktop, en, services, contact, mobile, reduced, keyboard, overflow };
}

report.scene = await probe(sceneUrl, 'scene');
report.orbit = await probe(orbitUrl, 'orbit');
await writeFile(path.join(outDir, 'preprod-results.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
