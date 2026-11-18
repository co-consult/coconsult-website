import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await mkdir('docs/ux/pr-32/after', { recursive: true });

await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.locator('.hero').screenshot({ path: 'docs/ux/pr-32/after/clip-hero.jpg', type: 'jpeg', quality: 70 });
await page.locator('#expertises').screenshot({ path: 'docs/ux/pr-32/after/clip-expertises.jpg', type: 'jpeg', quality: 70 });
await page.locator('.sector-matrix-home').screenshot({ path: 'docs/ux/pr-32/after/clip-sectors.jpg', type: 'jpeg', quality: 70 });

await page.goto('http://127.0.0.1:4321/contact/', { waitUntil: 'networkidle' });
await page.locator('.choice').first().click();
await page.locator('.btn.primary[data-next="2"]').click();
await page.locator('.contact-shell').screenshot({ path: 'docs/ux/pr-32/after/clip-contact-step.jpg', type: 'jpeg', quality: 70 });
const labels = await page.locator('.contact-stage .field span').allTextContents();
const boxes = await page.locator('.contact-stage .field').evaluateAll((els) => els.map((el) => {
  const r = el.getBoundingClientRect();
  return { text: el.textContent.trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) };
}));
console.log(JSON.stringify({ labels, boxes }, null, 2));
await browser.close();
