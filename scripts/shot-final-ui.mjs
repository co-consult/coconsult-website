import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const phase = process.argv[2] || 'before';
const dir = `docs/final-readiness/${phase}`;
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();

async function shoot(locale, width) {
  const tag = `${locale}-${width}`;
  await page.setViewportSize({ width, height: width < 500 ? 900 : 1100 });
  await page.goto(`http://localhost:4321${locale === 'en' ? '/en/' : '/'}`, { waitUntil: 'networkidle' });
  await page.locator('#tab-cyber').click();
  await page.locator('#panel-cyber').screenshot({ path: `${dir}/matrix-${tag}.png` });
  const work = page.locator('.work-grid');
  await work.scrollIntoViewIfNeeded();
  await work.screenshot({ path: `${dir}/work-${tag}.png` });
}

for (const locale of ['fr', 'en']) {
  for (const width of [1440, 390]) {
    await shoot(locale, width);
  }
}

await browser.close();
console.log(`wrote ${dir}`);
