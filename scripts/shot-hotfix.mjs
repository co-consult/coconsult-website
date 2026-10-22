import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const phase = process.argv[2] || 'before';
const base = process.argv[3] || 'https://coconsult.fr';
const dir = `docs/hotfix-qa-contact/${phase}`;
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();

async function qa(locale, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}${locale === 'en' ? '/en/' : '/'}`, { waitUntil: 'networkidle' });
  await page.locator('#tab-qa').click();
  await page.locator('#panel-qa').screenshot({ path: `${dir}/qa-${locale}-${width}.png` });
}

async function contact(locale) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'a'.repeat(32) }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, accepted: true }),
    });
  });
  const path = locale === 'en' ? '/en/contact/?type=project' : '/contact/?type=project';
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  await page.locator('[data-step="1"] [data-next]').click();
  await page.locator('#message').fill(locale === 'en'
    ? 'We want to evolve an application that is already running.'
    : 'Nous voulons moderniser une application deja en production.');
  await page.locator('[data-step="2"] .btn.primary').click();
  await page.locator('#name').fill('Ada Martin');
  await page.locator('#email').fill('ada@example.com');
  await page.locator('[data-step="3"] .btn.primary').click();
  const send = locale === 'en' ? 'Send my request' : 'Envoyer ma demande';
  await page.getByRole('button', { name: send }).click();
  await page.waitForTimeout(2400);
  await page.locator('#outcome').screenshot({ path: `${dir}/contact-${locale}-1440.png` });
  await page.unroute('**/api/contact');
}

for (const locale of ['fr', 'en']) {
  for (const width of [1440, 390]) await qa(locale, width);
  await contact(locale);
}
await browser.close();
console.log(`wrote ${dir}`);
