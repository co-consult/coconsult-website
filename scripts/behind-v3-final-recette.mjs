import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const orbitUrl = process.argv[2] || 'http://127.0.0.1:4173/';
const sceneUrl = process.argv[3] || 'http://127.0.0.1:4174/';
const outDir = 'docs/design/behind-the-digital/v3/final-recette';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = {
  mobileIo: {},
  settledWithoutPlay: {},
  a11y: {},
  lcp: {},
  errors: [],
};

async function clearToolbar(page) {
  await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
}

async function sceneState(page) {
  return page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    if (!scene) return null;
    const rect = scene.getBoundingClientRect();
    const vh = window.innerHeight;
    const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    const ratio = rect.height > 0 ? Math.max(0, Math.min(1, visible / rect.height)) : 0;
    return {
      playing: scene.dataset.playing === 'true',
      autoplayed: scene.dataset.autoplayed === 'true',
      phase: scene.dataset.phase,
      closed: scene.dataset.closed === 'true',
      top: Math.round(rect.top),
      height: Math.round(rect.height),
      ratio: Math.round(ratio * 1000) / 1000,
      line: document.querySelector('.hero [data-line]')?.textContent?.trim() || '',
      appVisible: Boolean(document.querySelector('.hero .btd-app:not(.btd-open)')),
      h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
      talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
      explore: document.querySelector('.hero .btn.ghost')?.getAttribute('href') || '',
    };
  });
}

async function scrollSceneToRatio(page, targetRatio) {
  await page.evaluate((ratio) => {
    const scene = document.querySelector('.hero .behind-scene');
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const visible = Math.max(0, Math.min(1, ratio)) * rect.height;
    const desiredTop = window.innerHeight - visible;
    window.scrollTo({ top: Math.max(0, absoluteTop - desiredTop), behavior: 'instant' });
  }, targetRatio);
  await page.waitForTimeout(280);
}

async function measureLcp(url, label) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => report.errors.push(`${label}: ${error}`));
  await page.addInitScript(() => {
    window.__lcp = null;
    window.__shifts = [];
    try {
      new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) window.__lcp = { startTime: last.startTime, size: last.size, url: last.url || '', tag: last.element?.tagName || '' };
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__shifts.push(entry.value);
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Some Chromium builds expose LCP only after load.
    }
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const last = lcpEntries.at(-1);
    const cls = (window.__shifts || []).reduce((sum, value) => sum + value, 0);
    return {
      dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      load: nav ? Math.round(nav.loadEventEnd) : null,
      fcp: Math.round(paints.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0) || null,
      lcpObserver: window.__lcp ? { startTime: Math.round(window.__lcp.startTime), size: window.__lcp.size, tag: window.__lcp.tag } : null,
      lcpEntries: lcpEntries.length,
      lcpLast: last ? { startTime: Math.round(last.startTime), size: last.size, tag: last.element?.tagName || '' } : null,
      cls: Math.round(cls * 1000) / 1000,
      behind: Boolean(document.querySelector('[data-behind]')),
      system: Boolean(document.querySelector('#systeme')),
      title: document.title,
    };
  });
  await page.screenshot({ path: path.join(outDir, `${label}-1440.jpg`), type: 'jpeg', quality: 70 });
  await page.close();
  return metrics;
}

// --- Mobile IntersectionObserver recette on the flagged production server ---
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (error) => report.errors.push(`mobile: ${error}`));
  await page.goto(sceneUrl, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForSelector('.hero .behind-scene');

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  // Push the scene fully below the fold.
  await page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    const top = window.scrollY + scene.getBoundingClientRect().top;
    window.scrollTo(0, Math.max(0, top - window.innerHeight - 40));
  });
  await page.waitForTimeout(250);
  report.mobileIo.offscreen = await sceneState(page);
  await page.screenshot({ path: path.join(outDir, 'mobile-offscreen-390.jpg'), type: 'jpeg', quality: 70 });

  await scrollSceneToRatio(page, 0.25);
  report.mobileIo.partialBelowThreshold = await sceneState(page);
  await page.screenshot({ path: path.join(outDir, 'mobile-partial-25-390.jpg'), type: 'jpeg', quality: 70 });

  // Slow approach across the threshold.
  for (const step of [0.32, 0.38, 0.45]) {
    await scrollSceneToRatio(page, step);
  }
  report.mobileIo.afterSlowCross = await sceneState(page);
  await page.screenshot({ path: path.join(outDir, 'mobile-after-threshold-390.jpg'), type: 'jpeg', quality: 70 });

  // Let the film start, then leave quickly.
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(350);
  report.mobileIo.afterLeaveDuringPlay = await sceneState(page);

  // Return into view: must not auto-restart.
  await scrollSceneToRatio(page, 0.7);
  await page.waitForTimeout(400);
  report.mobileIo.afterReturnNoAuto = await sceneState(page);

  // Manual replay.
  await page.locator('.hero [data-replay]').click();
  await page.waitForTimeout(300);
  report.mobileIo.afterReplay = await sceneState(page);
  await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
  report.mobileIo.afterReplaySettled = await sceneState(page);

  // Fast scroll through threshold on a fresh load.
  await page.goto(sceneUrl, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForSelector('.hero .behind-scene');
  await page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    const top = window.scrollY + scene.getBoundingClientRect().top;
    window.scrollTo(0, Math.max(0, top - window.innerHeight - 40));
  });
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    const absoluteTop = window.scrollY + scene.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, absoluteTop - 120), behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  report.mobileIo.afterFastScroll = await sceneState(page);

  // Settled aesthetics without ever triggering play: stay offscreen.
  await page.goto(sceneUrl, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForSelector('.hero .behind-scene');
  await page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    const top = window.scrollY + scene.getBoundingClientRect().top;
    window.scrollTo(0, Math.max(0, top - window.innerHeight - 40));
  });
  await page.waitForTimeout(200);
  // Jump the scene into view by screenshotting it without crossing via observer wait —
  // instead force a screenshot of the settled DOM state by temporarily scrolling with ratio < 0.42
  await scrollSceneToRatio(page, 0.3);
  report.settledWithoutPlay = await sceneState(page);
  await page.locator('.hero .stack').scrollIntoViewIfNeeded();
  // If that crossed the threshold, record that; also capture a dedicated never-play shot via reduced path later.
  await page.screenshot({ path: path.join(outDir, 'mobile-settled-partial-390.jpg'), type: 'jpeg', quality: 70 });
  await page.close();
}

// Dedicated: never play because we only look at settled via reduced-motion and desktop settle skip.
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  await page.goto(sceneUrl, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.locator('.hero .behind-scene').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  report.a11y.reducedMobile = await sceneState(page);
  await page.screenshot({ path: path.join(outDir, 'mobile-reduced-settled-390.jpg'), type: 'jpeg', quality: 70 });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => report.errors.push(`desktop: ${error}`));
  await page.goto(sceneUrl, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
  report.a11y.desktopSettled = await sceneState(page);
  await page.screenshot({ path: path.join(outDir, 'desktop-settled-1440.jpg'), type: 'jpeg', quality: 70 });

  await page.locator('.hero .layers label').nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  report.a11y.keyboard = await page.evaluate(() => ({
    checked: document.querySelector('.hero input:checked')?.value,
    line: document.querySelector('.hero [data-line]')?.textContent?.trim(),
  }));

  await page.locator('.hero .layers label').nth(3).click();
  report.a11y.touch = await page.evaluate(() => document.querySelector('.hero input:checked')?.value);

  await page.locator('.hero [data-replay]').click();
  await page.waitForTimeout(250);
  report.a11y.replayStarts = await page.evaluate(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true');
  await page.locator('.hero [data-skip]').click();
  report.a11y.skipSettles = await page.evaluate(() => ({
    playing: document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
    closed: document.querySelector('.hero .behind-scene')?.dataset.closed === 'true',
  }));

  const overflow = {};
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    overflow[width] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  await page.waitForTimeout(120);
  overflow.zoom2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  report.a11y.overflow = overflow;

  await page.goto(new URL('/en/', sceneUrl).href, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, { timeout: 15000 });
  report.a11y.en = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
    talk: document.querySelector('.hero .btn.primary')?.getAttribute('href') || '',
    explore: document.querySelector('.hero .btn.ghost')?.getAttribute('href') || '',
  }));
  await page.screenshot({ path: path.join(outDir, 'desktop-en-settled-1440.jpg'), type: 'jpeg', quality: 70 });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(sceneUrl, { waitUntil: 'networkidle' });
  await clearToolbar(page);
  await page.waitForTimeout(500);
  report.a11y.reducedDesktop = await sceneState(page);
  await page.screenshot({ path: path.join(outDir, 'desktop-reduced-1440.jpg'), type: 'jpeg', quality: 70 });
  await page.close();
}

report.lcp.orbit = await measureLcp(orbitUrl, 'lcp-orbit');
report.lcp.scene = await measureLcp(sceneUrl, 'lcp-scene');

await writeFile(path.join(outDir, 'results.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
