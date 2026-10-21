import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = [
  '/',
  '/en/',
  '/services/',
  '/services/equipes-dediees/',
  '/services/qa-testing/',
  '/services/paiements/',
  '/services/automatisation/',
  '/services/ia-entreprise/',
  '/solutions/',
  '/realisations/',
  '/a-propos/',
  '/partenariats/',
  '/contact/',
  '/mentions-legales/',
  '/confidentialite/',
  '/en/services/',
  '/en/services/dedicated-teams/',
  '/en/services/qa-testing/',
  '/en/services/payments/',
  '/en/services/business-automation/',
  '/en/services/enterprise-ai/',
  '/en/solutions/',
  '/en/case-studies/',
  '/en/about/',
  '/en/partnerships/',
  '/en/contact/',
  '/en/legal-notice/',
  '/en/privacy-policy/',
];

const viewports = [
  { width: 320, height: 700 },
  { width: 375, height: 800 },
  { width: 768, height: 1000 },
  { width: 1024, height: 800 },
  { width: 1440, height: 900 },
];

test('localized pages respond and expose one heading', async ({ page }) => {
  for (const urlPath of paths) {
    const response = await page.goto(urlPath);
    expect(response?.status(), urlPath).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('img[alt="Coconsult"]')).toHaveCount(2);
  }
});

test('language switch keeps the equivalent page', async ({ page }) => {
  await page.goto('/services/qa-testing/');
  await expect(page.locator('a.lang')).toHaveAttribute('href', '/en/services/qa-testing/');
  await page.locator('a.lang').click();
  await expect(page).toHaveURL(/\/en\/services\/qa-testing\/$/);
  await expect(page.locator('h1')).toContainText('Dedicated QA and testing teams');
  await page.locator('a.lang').click();
  await expect(page).toHaveURL(/\/services\/qa-testing\/$/);
});

test('mobile menu opens, closes on Escape, and follows a link', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/en/');
  const button = page.getByRole('button', { name: 'Menu' });
  await button.click();
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await button.click();
  await menu.getByRole('link', { name: 'QA & testing' }).click();
  await expect(page).toHaveURL(/\/en\/services\/qa-testing\/$/);
});

test('qa calls to action are distinct mailto links', async ({ page }) => {
  await page.goto('/en/services/qa-testing/');
  const discuss = page.getByRole('link', { name: 'Discuss your QA needs' });
  const request = page.getByRole('link', { name: 'Request a QA team' });
  await expect(discuss).toHaveAttribute('href', /mailto:contact@coconsult\.fr\?subject=/);
  await expect(request).toHaveAttribute('href', /mailto:contact@coconsult\.fr\?subject=/);
  const discussHref = await discuss.getAttribute('href');
  const requestHref = await request.getAttribute('href');
  expect(decodeURIComponent(discussHref || '')).toContain('Discuss your QA needs - Coconsult');
  expect(decodeURIComponent(requestHref || '')).toContain('Request a QA team - Coconsult');
  expect(discussHref).not.toBe(requestHref);
});

test('logo sits on a light plate', async ({ page }) => {
  await page.goto('/');
  const brand = page.locator('.site-header .brand');
  await expect(brand.locator('img')).toBeVisible();
  const background = await brand.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toBe('rgb(247, 250, 252)');
});

for (const viewport of viewports) {
  test(`no horizontal overflow at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const urlPath of ['/', '/en/services/qa-testing/', '/contact/']) {
      await page.goto(urlPath);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, urlPath).toBeLessThanOrEqual(1);
    }
  });
}

test('home and QA pages meet WCAG AA checks we can automate', async ({ page }) => {
  for (const urlPath of ['/', '/en/', '/services/qa-testing/', '/en/services/qa-testing/']) {
    await page.goto(urlPath);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  }
});
