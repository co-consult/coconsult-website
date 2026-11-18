import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
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
await page.goto('https://coconsult.fr/contact/?type=project', { waitUntil: 'networkidle' });
await page.locator('[data-step="1"] [data-next]').click();
await page.locator('#message').fill('Nous voulons moderniser une application deja en production.');
await page.locator('[data-step="2"] .btn.primary').click();
await page.locator('#name').fill('Ada Martin');
await page.locator('#email').fill('ada@example.com');
await page.locator('[data-step="3"] .btn.primary').click();
await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
await page.locator('#outcome-text').waitFor({ state: 'visible' });
await page.waitForFunction(() => document.getElementById('outcome-text')?.textContent?.includes('Merci'));
const chain = await page.evaluate(() => {
  const layers = [];
  let node = document.getElementById('outcome-text');
  while (node && layers.length < 8) {
    const cs = getComputedStyle(node);
    layers.push({
      id: node.id || node.className?.toString?.().slice(0, 40) || node.tagName,
      color: cs.color,
      bg: cs.backgroundColor,
      display: cs.display,
      h: Math.round(node.getBoundingClientRect().height),
    });
    node = node.parentElement;
  }
  const actions = document.querySelector('.mail-actions');
  return { layers, actionsHidden: actions?.hidden, actionsDisplay: actions ? getComputedStyle(actions).display : null };
});
console.log(JSON.stringify(chain, null, 2));
await page.screenshot({ path: 'docs/hotfix-before-contact.png', fullPage: false });
await browser.close();
