import { expect, test, type Page } from '@playwright/test';

function watch(page: Page) {
  const hosts = new Set<string>();
  const contactPosts: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    hosts.add(url.host);
    if (request.method() === 'POST' && url.pathname.startsWith('/api/contact')) contactPosts.push(url.pathname);
  });
  return { hosts, contactPosts };
}

async function openGuide(page: Page, name: RegExp) {
  await page.getByRole('button', { name }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  return dialog;
}

test('the French guide qualifies a need and copies the summary into the form', async ({ page }) => {
  const traffic = watch(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const dialog = await openGuide(page, /Ouvrir l.assistant Coconsult/);
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog.locator('.cc-assistant-log')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('[data-assistant-open]')).toHaveAttribute('aria-expanded', 'true');
  await expect(dialog.getByRole('button', { name: /Fermer l.assistant/ })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest('#cc-assistant-dialog') !== null)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('[data-assistant-open]')).toBeFocused();

  await openGuide(page, /Ouvrir l.assistant Coconsult/);
  await dialog.getByRole('button', { name: 'Les expertises' }).click();
  await dialog.getByRole('button', { name: 'Innovation et CII' }).click();
  await expect(dialog).toContainText('28910108');
  await expect(dialog).toContainText('ne décide pas');
  await expect(dialog.getByRole('link', { name: 'Innovation' })).toHaveAttribute('href', '/innovation/');
  await dialog.getByRole('button', { name: 'Qualifier mon besoin' }).focus();
  await page.keyboard.press('Enter');
  await dialog.getByRole('button', { name: 'Un projet' }).click();
  await dialog.locator('#cc-assistant-input').fill('Un prototype logiciel a cadrer.');
  await dialog.locator('#cc-assistant-input').press('Enter');
  await dialog.getByRole('button', { name: 'Valider ce résumé' }).click();
  await dialog.getByRole('button', { name: 'Reprendre ce résumé dans le formulaire' }).click();

  await expect(page).toHaveURL(/\/contact\/\?type=project$/);
  await expect(page.locator('#message')).toHaveValue(/Un prototype logiciel a cadrer/);
  await expect(page.locator('#message')).toBeFocused();
  await expect(page.locator('[data-step="2"]')).toBeVisible();
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-journey', 'guide');
  const cached = await page.evaluate(async () => {
    const cache = await caches.open('cc-guide-handoff');
    const hit = await cache.match('/cc-guide-handoff');
    return hit ? hit.text() : '';
  });
  expect(cached).toBe('');
  expect(traffic.contactPosts).toEqual([]);
  expect([...traffic.hosts].every((host) => host === '127.0.0.1:4322')).toBe(true);
});

test('opening the form without the summary leaves the message empty', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/services/developpement/');
  const dialog = await openGuide(page, /Ouvrir l.assistant Coconsult/);
  await dialog.getByRole('button', { name: 'Qualifier un besoin' }).click();
  await dialog.getByRole('button', { name: 'Développement logiciel' }).click();
  await dialog.getByRole('button', { name: 'Un projet' }).click();
  await dialog.getByRole('button', { name: 'Passer cette question' }).click();
  await dialog.getByRole('button', { name: 'Valider ce résumé' }).click();
  await dialog.getByRole('link', { name: 'Ouvrir le formulaire sans ce résumé' }).click();
  await expect(page).toHaveURL(/\/contact\/\?type=project$/);
  await expect(page.locator('[data-need="software"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#message')).toHaveValue('');
  await expect(page.locator('[data-step="1"]')).toBeVisible();
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-journey', 'guide');
});

test('the English guide works on a phone width and does not call a model', async ({ page }) => {
  const traffic = watch(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  const dialog = await openGuide(page, /Open the Coconsult assistant/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await dialog.getByRole('button', { name: 'Expertise' }).click();
  await dialog.getByRole('button', { name: 'AI and data' }).click();
  await expect(dialog).toContainText('agents');
  await dialog.getByRole('button', { name: 'Describe my need' }).click();
  await dialog.getByRole('button', { name: 'A project' }).click();
  await dialog.locator('#cc-assistant-input').fill('Connect a model to a process we already run.');
  await dialog.getByRole('button', { name: 'Send' }).click();
  await dialog.getByRole('button', { name: 'Confirm this summary' }).click();
  await dialog.getByRole('button', { name: 'Use this summary in the form' }).click();
  await expect(page).toHaveURL(/\/en\/contact\/\?type=ai$/);
  await expect(page.locator('#message')).toHaveValue(/Connect a model to a process we already run/);
  expect(page.url().includes('Connect')).toBe(false);
  expect(traffic.contactPosts).toEqual([]);
  expect([...traffic.hosts].every((host) => host === '127.0.0.1:4322')).toBe(true);
});
