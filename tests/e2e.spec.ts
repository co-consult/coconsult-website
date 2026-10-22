import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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
  await expect(page.locator('#choices')).toBeVisible();
  await page.goto('/contact/?type=demo&product=copharia');
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-mode', 'demo');
  await expect(page.locator('[data-contact-type]')).toHaveValue('demo');
  await expect(page.locator('#choices')).toBeHidden();
  await expect(page.locator('h1')).toContainText('Demander une démonstration de COPHARIA');
  await expect(page.locator('[data-open-mail]')).toHaveAttribute('href', /subject=.*COPHARIA/);
  await page.goto('/contact/?type=demo&product=other');
  await expect(page.locator('#choices')).toBeVisible();
  await expect(page.locator('[data-open-mail]')).not.toHaveAttribute('href', /OTHER/);
});

test('expertise demos keep space between schema and action at 390 and 1440', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('.skill[data-skill="cloud"]').click();
    await expect(page.locator('#panel-cloud')).toBeVisible();
    const cloudGap = await gapBetween(page, '#pipe', '#run-pipe');
    expect(cloudGap, `cloud ${viewport.width}`).toBeGreaterThanOrEqual(20);
    expect(cloudGap, `cloud ${viewport.width}`).toBeLessThanOrEqual(28);

    await page.locator('.skill[data-skill="integration"]').click();
    await expect(page.locator('#panel-integration')).toBeVisible();
    const hopGap = await gapBetween(page, '#bridge', '#advance-hop');
    expect(hopGap, `integration ${viewport.width}`).toBeGreaterThanOrEqual(20);
    expect(hopGap, `integration ${viewport.width}`).toBeLessThanOrEqual(28);

    for (const skill of ['ai', 'software', 'qa', 'cyber', 'cloud', 'integration']) {
      await page.locator(`.skill[data-skill="${skill}"]`).click();
      await expect(page.locator(`#panel-${skill}`)).toBeVisible();
      await page.keyboard.press('Tab');
    }
  }
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

async function reachSummary(page: Page, message?: string) {
  await page.locator('[data-step="1"] [data-next]').click();
  if (message) await page.locator('#message').fill(message);
  await page.locator('[data-step="2"] .btn.primary').click();
  await page.locator('#name').fill('Ada Martin');
  await page.locator('#email').fill('ada@example.com');
  await page.locator('[data-step="3"] .btn.primary').click();
}

async function reachDemoSummary(page: Page, message?: string) {
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-mode', 'demo');
  await expect(page.locator('[data-step="1"]')).toBeHidden();
  await expect(page.locator('#choices')).toBeHidden();
  await page.locator('#name').fill('Ada Martin');
  await page.locator('#email').fill('ada@example.com');
  if (message) await page.locator('#message').fill(message);
  await page.locator('[data-step="3"] .btn.primary').click();
}

async function gapBetween(page: Page, first: string, second: string) {
  return page.locator(first).evaluate((top, bottomSelector) => {
    const bottom = document.querySelector(bottomSelector);
    if (!(top instanceof HTMLElement) || !(bottom instanceof HTMLElement)) return -1;
    return Math.round(bottom.getBoundingClientRect().top - top.getBoundingClientRect().bottom);
  }, second);
}

test('the contact wizard prepares a message and refreshes it after each change', async ({ page }) => {
  await page.goto('/contact/?type=project');
  await expect(page.locator('[data-contact-type]')).toHaveValue('project');
  await reachSummary(page, 'Nous voulons faire evoluer le portail TOKEN-ONE.');
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#outcome')).toBeVisible();
  await expect(page.locator('#outcome')).toContainText("Aucun envoi n'a été effectué");
  await expect(page.getByText('Votre demande a été envoyée.')).toHaveCount(0);
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /TOKEN-ONE/);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /TOKEN-ONE/);
  await expect(page.locator('#open-mail')).toHaveAttribute('href', /subject=/);
  await expect(page.locator('#open-mail')).toHaveAttribute('href', /body=/);

  await page.getByRole('button', { name: 'Modifier' }).nth(1).click();
  await page.locator('#message').fill('Nous voulons relier les outils TOKEN-TWO par une API.');
  await expect(page.locator('#open-gmail')).not.toHaveAttribute('href', /body=/);
  await expect(page.locator('#open-outlook')).not.toHaveAttribute('href', /TOKEN-ONE/);
  await expect(page.locator('#open-mail')).not.toHaveAttribute('href', /body=/);
  await page.locator('[data-step="2"] .btn.primary').click();
  await page.locator('[data-step="3"] .btn.primary').click();
  await expect(page.locator('#prepare')).toBeVisible();
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /TOKEN-TWO/);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /TOKEN-TWO/);
  await expect(page.locator('#open-gmail')).not.toHaveAttribute('href', /TOKEN-ONE/);

  await page.getByRole('button', { name: 'Modifier' }).nth(2).click();
  await page.locator('#email').fill('ada.martin@example.com');
  await expect(page.locator('#open-gmail')).not.toHaveAttribute('href', /body=/);
  await page.locator('[data-step="3"] .btn.primary').click();
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /ada\.martin%40example\.com/);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /ada\.martin%40example\.com/);

  await page.getByRole('button', { name: 'Modifier' }).first().click();
  await page.locator('[data-need="other"]').click();
  await page.getByRole('button', { name: 'Récapitulatif' }).click();
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#mail-preview')).toContainText('Autre demande - Coconsult');
  await expect(page.locator('#mail-preview')).not.toContainText('Partenariat');
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /Autre%20demande%20-%20Coconsult/);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /Autre%20demande%20-%20Coconsult/);
});

test('COPHARIA demo skips the six choices and keeps context while editing', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.method() !== 'HEAD') posts.push(`${request.method()} ${request.url()}`);
  });

  await page.goto('/');
  const homeLink = page.getByRole('link', { name: 'Demander une démonstration de COPHARIA' });
  await expect(homeLink).toHaveAttribute('href', '/contact/?type=demo&product=copharia');
  await homeLink.click();
  await expect(page).toHaveURL(/\/contact\/\?type=demo&product=copharia$/);
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-mode', 'demo');
  await expect(page.locator('#choices')).toBeHidden();
  await expect(page.locator('h1')).toContainText('Demander une démonstration de COPHARIA');
  await expect(page.locator('#topic-flag')).toBeVisible();
  await expect(page.locator('[data-contact-type]')).toHaveValue('demo');
  await expect(page.locator('#message')).toHaveValue(/COPHARIA/);
  await reachDemoSummary(page);
  await expect(page.locator('#sum-need')).toContainText(/COPHARIA/i);
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#outcome')).toContainText("Aucun envoi n'a été effectué");
  await expect(page.getByText('Votre demande a été envoyée.')).toHaveCount(0);
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /COPHARIA/);
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /D%C3%A9monstration|d%C3%A9monstration|Demande%20de%20d%C3%A9monstration/i);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /COPHARIA/);
  await expect(page.locator('#open-mail')).toHaveAttribute('href', /subject=/);
  await expect(page.locator('#mail-preview')).not.toContainText('Partenariat');

  await page.getByRole('button', { name: 'Modifier' }).nth(1).click();
  await expect(page.locator('[data-step="3"]')).toBeVisible();
  await page.locator('#message').fill('Je souhaite une demonstration de COPHARIA avec le jeton TOKEN-COPH.');
  await page.locator('#name').fill('Ada Martin');
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-mode', 'demo');
  await expect(page.locator('#topic-flag')).toBeVisible();
  await expect(page.locator('#open-gmail')).not.toHaveAttribute('href', /body=/);
  await page.locator('[data-step="3"] .btn.primary').click();
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /TOKEN-COPH/);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /TOKEN-COPH/);
  await expect(page.locator('#open-mail')).toHaveAttribute('href', /COPHARIA/);
  await expect(page.locator('#sum-need')).toContainText(/COPHARIA/i);
  await expect(page.locator('#copy-mail')).toBeVisible();
  expect(posts.filter((entry) => /\/api\/contact|brevo/i.test(entry))).toEqual([]);
});

test('solutions page shows COPHARIA and anonymized platforms with case links', async ({ page }) => {
  await page.goto('/solutions/');
  await expect(page.getByRole('heading', { name: 'Solutions Coconsult' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Plateformes et réalisations' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Application documentaire et workflows' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Plateforme d.opérations sportives/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Voir l.étude de cas/ }).first()).toHaveAttribute('href', '/realisations/');
  await expect(page.locator('body')).not.toContainText('IAPS');
  await expect(page.locator('body')).not.toContainText('CSSForever');
  const solutionLinks = page.getByRole('link', { name: 'Demander une démonstration de COPHARIA' });
  await expect(solutionLinks).toHaveCount(2);
  await expect(solutionLinks.nth(1)).toHaveAttribute('href', '/contact/?type=demo&product=copharia');
  await solutionLinks.nth(1).click();
  await expect(page.locator('[data-mode="demo"]')).toBeVisible();
  await expect(page.locator('#choices')).toBeHidden();

  await page.goto('/en/solutions/');
  await expect(page.getByRole('heading', { name: 'Coconsult solutions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Platforms and deliveries' })).toBeVisible();
  const englishLinks = page.getByRole('link', { name: 'Request a COPHARIA demonstration' });
  await expect(englishLinks).toHaveCount(2);
  await englishLinks.first().click();
  await expect(page).toHaveURL(/\/en\/contact\/\?type=demo&product=copharia$/);
  await expect(page.locator('h1')).toContainText('Request a COPHARIA demonstration');
  await expect(page.locator('#choices')).toBeHidden();
});

test('generic contact still offers the six request choices', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('#choices')).toBeVisible();
  await expect(page.locator('[data-need]')).toHaveCount(6);
  await expect(page.locator('[data-contact-panel]')).not.toHaveAttribute('data-mode', 'demo');
  await page.goto('/en/contact/');
  await expect(page.locator('#choices')).toBeVisible();
  await expect(page.locator('[data-need]')).toHaveCount(6);
});

test('another request uses its own subject, and a partnership URL keeps partnership', async ({ page }) => {
  await page.goto('/contact/?type=partnership');
  await expect(page.locator('[data-contact-type]')).toHaveValue('partnership');
  await expect(page.locator('[data-open-mail]')).toHaveAttribute('href', /Partenariat%20-%20Coconsult/);
  await page.goto('/en/contact/');
  await page.locator('[data-need="other"]').click();
  await reachSummary(page, 'We would like to talk about a scoped operations question.');
  await page.getByRole('button', { name: 'Prepare the message' }).click();
  await expect(page.locator('#mail-preview')).toContainText('Another request - Coconsult');
  await expect(page.locator('#mail-preview')).not.toContainText('Partnership');
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /Another%20request%20-%20Coconsult/);
  await expect(page.locator('#open-outlook')).toHaveAttribute('href', /Another%20request%20-%20Coconsult/);
});

test('the contact wizard can be completed from the keyboard', async ({ page }) => {
  await page.goto('/contact/');
  const ai = page.locator('[data-need="ai"]');
  await ai.focus();
  await page.keyboard.press('Enter');
  await expect(ai).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-step="1"] [data-next]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#message')).toBeFocused();
  await page.locator('#message').fill('Nous voulons cadrer un diagnostic sur un processus deja connu.');
  await page.locator('[data-step="2"] .btn.primary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#name')).toBeFocused();
  await page.locator('#name').fill('Ada Martin');
  await page.locator('#email').focus();
  await page.keyboard.type('ada@example.com');
  await page.locator('[data-step="3"] .btn.primary').focus();
  await page.keyboard.press('Enter');
  await page.locator('#prepare').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#outcome')).toBeVisible();
  await expect(page.locator('#open-gmail')).toBeVisible();
});

test('the contact page stays usable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact/');
  const columns = await page.locator('.choice-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  expect(columns.trim().split(/\s+/).length).toBe(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('h1')).toContainText('Parlons de votre prochain système.');
  await expect(page.locator('.prepare-note')).toContainText("ne l’envoie pas");
  await page.locator('[data-need="team"]').click();
  await page.locator('[data-step="1"] [data-next]').click();
  await expect(page.locator('#message')).toBeVisible();
  await expect(page.locator('.header-contact')).toBeHidden();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Contact' })).toBeVisible();
});

test('desktop navigation keeps a single Contact call to action', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'Contact', exact: true })).toHaveCount(0);
  await expect(page.locator('.header-contact')).toHaveText('Contact');
  await expect(page.locator('.header-contact')).toHaveAttribute('href', '/contact/?type=project');
  await page.locator('.header-contact').click();
  await expect(page).toHaveURL(/\/contact\/\?type=project$/);
  await expect(page.locator('[data-need="software"]')).toHaveAttribute('aria-pressed', 'true');
});

test('public pages do not mention missing captures', async ({ page }) => {
  for (const urlPath of paths) {
    await page.goto(urlPath);
    const html = await page.content();
    expect(html, urlPath).not.toContain('Capture à fournir');
    expect(html, urlPath).not.toContain('Capture still needed');
    expect(html, urlPath).not.toContain('transmettre les captures');
    expect(html, urlPath).not.toContain('authorized captures');
  }
});

test('the COPHARIA gallery changes published views without a Laboratory tab', async ({ page }) => {
  await page.goto('/');
  const gallery = page.locator('[data-copharia-gallery]');
  const img = gallery.locator('[data-screen]');
  await expect(img).toHaveAttribute('src', /dashboard\.webp/);
  await expect(gallery.locator('.badge')).toHaveText('Solution en développement');
  await expect(gallery.getByRole('button', { name: 'Laboratoire' })).toHaveCount(0);
  await expect(gallery.locator('[data-lab-note]')).toHaveCount(0);
  await gallery.getByRole('button', { name: 'Gestion qualité' }).click();
  await expect(img).toHaveAttribute('src', /quality\.webp/);
  await expect(img).toBeVisible();
  await gallery.getByRole('button', { name: 'Logistique & Stocks' }).click();
  await expect(img).toHaveAttribute('src', /stocks\.webp/);
  await expect(gallery.locator('[data-stock-switch]')).toBeVisible();
  await gallery.getByRole('button', { name: "Vue détaillée d'un article" }).click();
  await expect(img).toHaveAttribute('src', /stock-detail\.webp/);
  await expect(img).toBeVisible();
  await gallery.getByRole('button', { name: 'Centre de commande' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(img).toHaveAttribute('src', /quality\.webp/);
  await expect(gallery.getByRole('link', { name: 'Demander une démonstration de COPHARIA' })).toHaveAttribute('href', '/contact/?type=demo&product=copharia');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/solutions/');
  const mobile = page.locator('[data-copharia-gallery]');
  await expect(mobile.locator('[data-screen]')).toBeVisible();
  await expect(mobile.getByRole('button', { name: 'Laboratoire' })).toHaveCount(0);
  const width = await mobile.locator('[data-screen]').evaluate((element) => element.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(280);
  expect(width).toBeLessThanOrEqual(390);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/solutions/');
  const english = page.locator('[data-copharia-gallery]');
  await expect(english.getByRole('button', { name: 'Laboratory' })).toHaveCount(0);
  await english.getByRole('button', { name: 'Logistics & stock' }).click();
  await english.getByRole('button', { name: 'Article detail' }).click();
  await expect(english.locator('[data-screen]')).toHaveAttribute('src', /stock-detail\.webp/);
});

test('v3.1 screenshots for spacing, solutions, gallery and COPHARIA demo', async ({ page }) => {
  const dir = 'docs/v3.1-screenshots';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.skill[data-skill="cloud"]').click();
  await page.locator('#panel-cloud').screenshot({ path: `${dir}/01-demo-spacing-cloud.png` });
  await page.locator('.skill[data-skill="integration"]').click();
  await page.locator('#panel-integration').screenshot({ path: `${dir}/02-demo-spacing-integration.png` });
  await page.goto('/solutions/');
  await page.screenshot({ path: `${dir}/03-solutions-platforms.png`, fullPage: true });
  await page.locator('[data-copharia-gallery]').screenshot({ path: `${dir}/04-copharia-gallery.png` });
  await page.goto('/contact/?type=demo&product=copharia');
  await page.screenshot({ path: `${dir}/05-copharia-demo-contact.png`, fullPage: true });
});

test('home and QA pages meet WCAG AA checks we can automate', async ({ page }) => {
  for (const urlPath of ['/', '/en/', '/contact/', '/en/contact/', '/solutions/', '/services/qa-testing/', '/en/services/qa-testing/']) {
    await page.goto(urlPath);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  }
});
