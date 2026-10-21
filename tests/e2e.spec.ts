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
  '/services/developpement/',
  '/services/cloud-devops/',
  '/services/cybersecurite/',
  '/modes-intervention/',
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
  '/en/services/software-engineering/',
  '/en/services/cloud-devops/',
  '/en/services/cybersecurity/',
  '/en/engagement/',
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

test('qa calls to action open the contact page with a request type', async ({ page }) => {
  await page.goto('/en/services/qa-testing/');
  const discuss = page.getByRole('link', { name: 'Discuss your QA needs' });
  const request = page.getByRole('link', { name: 'Request a QA team' });
  await expect(discuss).toHaveAttribute('href', '/en/contact/?type=qa');
  await expect(request).toHaveAttribute('href', '/en/contact/?type=qa-team');
  await discuss.click();
  await expect(page).toHaveURL(/\/en\/contact\/\?type=qa$/);
  await expect(page.locator('#main').getByRole('link', { name: 'contact@coconsult.fr' })).toBeVisible();
  await expect(page.locator('[data-contact-type]')).toHaveValue('qaDiscuss');
  await expect(page.getByRole('button', { name: 'Copy the address' })).toBeVisible();
  await expect(page.locator('[data-contact-form]')).toBeHidden();
  await expect(page.getByText('Your request has been sent.')).toHaveCount(0);
});

test('the hero follows a lane and the expertise links keep their contact types', async ({ page }) => {
  await page.goto('/');
  const system = page.locator('#systeme');
  await page.locator('#systeme button[data-lane="ai"]').first().click();
  await expect(system).toHaveAttribute('data-focus', 'ai');
  await expect(page.locator('.focus-read')).toContainText('Parcours IA');
  await page.locator('#systeme button[data-lane="ai"]').first().click();
  await expect(system).toHaveAttribute('data-focus', 'all');
  await expect(page.getByRole('link', { name: 'Cadrer un diagnostic IA' })).toHaveAttribute('href', '/contact/?type=ai');
  await expect(page.getByRole('link', { name: 'Constituer mon équipe' })).toHaveAttribute('href', '/contact/?type=team');
});

test('homepage and demo links preselect the contact request', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Parlons de votre projet' }).first().click();
  await expect(page).toHaveURL(/\/contact\/\?type=project$/);
  await expect(page.locator('[data-contact-type]')).toHaveValue('project');
  await page.goto('/contact/?type=demo&product=copharia');
  await expect(page.locator('[data-contact-type]')).toHaveValue('demo');
  await expect(page.locator('[data-open-mail]')).toHaveAttribute('href', /subject=.*COPHARIA/);
  await page.goto('/contact/?type=demo&product=other');
  await expect(page.locator('[data-open-mail]')).not.toHaveAttribute('href', /OTHER/);
});

test('logo sits on a light plate', async ({ page }) => {
  await page.goto('/');
  const brand = page.locator('.site-header .brand');
  await expect(brand.locator('img')).toBeVisible();
  const background = await brand.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toBe('rgb(255, 255, 255)');
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
