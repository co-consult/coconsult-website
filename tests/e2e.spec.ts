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
  '/secteurs/',
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
  '/en/industries/',
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

for (const urlPath of paths) {
  test(`localized page ${urlPath} responds and exposes one heading`, async ({ page }) => {
    const response = await page.goto(urlPath);
    expect(response?.status(), urlPath).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('img[alt="Coconsult"]')).toHaveCount(2);
  });
}

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

function contrastRatio(foreground: string, background: string) {
  const parse = (value: string) => {
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
  };
  const channel = (value: number) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  const lum = (rgb: number[]) => 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
  const [a, b] = [lum(parse(foreground)), lum(parse(background))];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
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
  await expect(page.locator('.prepare-note')).toContainText('une fois la demande acceptée');
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

test('sectors page, homepage strip and payments keep FR/EN navigation without client names', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#secteurs')).toBeVisible();
  await expect(page.locator('#secteurs h2')).toContainText('Notre ingénierie au service de vos métiers');
  await expect(page.locator('#expertises')).toBeVisible();
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'Secteurs' })).toHaveAttribute('href', '/secteurs/');
  await expect(page.locator('#secteurs a.sector-tile').first()).toHaveAttribute('href', /\/secteurs\/#/);
  await page.locator('#secteurs').getByRole('link', { name: 'Explorer les secteurs' }).click();
  await expect(page).toHaveURL(/\/secteurs\/$/);
  await expect(page.locator('h1')).toContainText('Notre ingénierie au service de vos métiers');
  await expect(page.locator('[data-sector]')).toHaveCount(8);
  await expect(page.locator('#pharma')).toContainText('Domaine émergent');
  await expect(page.locator('body')).not.toContainText(/Société Générale|BPCE|Wero|LVMH|Renault|IAPS|CSSForever/i);
  await expect(page.locator('body')).not.toContainText(/sans remplacer|spécialités historiques|ne nomme pas|priorité commerciale|ne prétend pas/i);

  await page.locator('a.lang').click();
  await expect(page).toHaveURL(/\/en\/industries\/$/);
  await expect(page.locator('h1')).toContainText('Our engineering in the service of your industries');
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'Industries' })).toHaveAttribute('href', '/en/industries/');
  await expect(page.locator('body')).not.toContainText(/without replacing|historic specialties|does not name|commercial priority|does not claim/i);

  await page.goto('/services/paiements/');
  await expect(page).toHaveURL(/\/services\/paiements\/$/);
  await expect(page.locator('h1')).toContainText('Fiabiliser les parcours de paiement');
  await expect(page.locator('body')).toContainText('API transactionnelles');
  await expect(page.locator('body')).toContainText('idempotence');
  await expect(page.locator('body')).not.toContainText(/Wero|Société Générale|BRED|priorité commerciale|ne prétend pas/i);
  await page.locator('a.lang').click();
  await expect(page).toHaveURL(/\/en\/services\/payments\/$/);
  await expect(page.locator('body')).toContainText('Transactional APIs');
  await expect(page.locator('body')).not.toContainText(/commercial priority|does not claim|Wero/i);
});

test('sectors page paper section layout and cards are not self-links', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/secteurs/');
    const entry = page.locator('[data-sectors-entry]');
    await expect(entry.locator('.section-copy .lede-soft')).toBeVisible();
    const copyBox = await entry.locator('.section-copy').boundingBox();
    const textBox = await entry.locator('.section-copy .lede-soft').boundingBox();
    expect(copyBox, `copy ${viewport.width}`).not.toBeNull();
    expect(textBox, `text ${viewport.width}`).not.toBeNull();
    expect(textBox!.width, `text width ${viewport.width}`).toBeGreaterThan(viewport.width >= 1440 ? 420 : 260);
    expect(Math.abs(textBox!.x - copyBox!.x), `text aligned ${viewport.width}`).toBeLessThan(8);

    const gridHead = page.locator('.sectors-grid-head');
    const matrix = page.locator('[data-sector-matrix]');
    const headBox = await gridHead.boundingBox();
    const matrixBox = await matrix.boundingBox();
    expect(headBox).not.toBeNull();
    expect(matrixBox).not.toBeNull();
    expect(matrixBox!.y - (headBox!.y + headBox!.height)).toBeGreaterThanOrEqual(20);

    await expect(page.locator('[data-sector-matrix] a.sector-tile')).toHaveCount(0);
    await expect(page.locator('[data-sector-matrix] article.sector-tile')).toHaveCount(8);
    for (const tile of await page.locator('[data-sector-matrix] article.sector-tile').all()) {
      const href = await tile.getAttribute('href');
      expect(href).toBeNull();
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/industries/');
  await expect(page.locator('[data-sector-matrix] a.sector-tile')).toHaveCount(0);
  await expect(page.locator('[data-sectors-entry] .section-copy .lede-soft')).toBeVisible();
});

test('v3.2 screenshots for sectors desktop and mobile', async ({ page }) => {
  const dir = 'docs/v3.2-screenshots';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('#secteurs').screenshot({ path: `${dir}/01-home-sectors-1440.png` });
  await page.goto('/secteurs/');
  await page.screenshot({ path: `${dir}/02-secteurs-1440.png`, fullPage: true });
  await page.locator('[data-sectors-entry]').screenshot({ path: `${dir}/06-secteurs-entry-1440.png` });
  await page.goto('/en/industries/');
  await page.screenshot({ path: `${dir}/07-industries-1440.png`, fullPage: true });
  await page.goto('/services/paiements/');
  await page.screenshot({ path: `${dir}/03-paiements-1440.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/secteurs/');
  await page.screenshot({ path: `${dir}/04-secteurs-390.png`, fullPage: true });
  await page.locator('[data-sectors-entry]').screenshot({ path: `${dir}/08-secteurs-entry-390.png` });
  await page.goto('/');
  await page.locator('#secteurs').screenshot({ path: `${dir}/05-home-sectors-390.png` });
});

test('v3.3 contact stays on the mail fallback until send is available', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', (request) => urls.push(request.url()));
  await page.goto('/contact/?type=project');
  await reachSummary(page, 'Nous voulons faire evoluer le portail sans envoi serveur.');
  await expect(page.getByRole('button', { name: 'Préparer le message' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Préparer le message' }).click();
  await expect(page.locator('#outcome-text')).toContainText("Aucun envoi n'a été effectué");
  await expect(page.getByText(/acceptée pour transmission/)).toHaveCount(0);
  expect(urls.some((url) => url.includes('api.brevo.com'))).toBe(false);

  await page.goto('/en/contact/?type=project');
  await reachSummary(page, 'We want to evolve an application that is already running.');
  await expect(page.getByRole('button', { name: 'Prepare the message' })).toBeVisible();
  await page.getByRole('button', { name: 'Prepare the message' }).click();
  await expect(page.locator('#outcome-text')).toContainText('Nothing has been sent');
  expect(urls.some((url) => url.includes('api.brevo.com'))).toBe(false);
});

test('v3.3 simulated send covers generic and COPHARIA requests in French and English', async ({ page }) => {
  const posts: { url: string; body: string }[] = [];
  await page.route('**/api/contact', async (route) => {
    const request = route.request();
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'a'.repeat(32) }),
      });
      return;
    }
    posts.push({ url: request.url(), body: request.postData() || '' });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, accepted: true }),
    });
  });

  await page.goto('/contact/?type=project');
  await reachSummary(page, 'Nous voulons moderniser une application deja en production.');
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeVisible();
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('[data-outcome-title]')).toBeVisible();
  await expect(page.locator('[data-outcome-title]')).toHaveText('Merci pour votre message !');
  await expect(page.locator('[data-outcome-body]')).toBeVisible();
  await expect(page.locator('[data-outcome-body]')).toContainText('transmise à notre service de messagerie');
  await expect(page.locator('[data-outcome-fallback]')).toBeHidden();
  await expect(page.locator('#open-gmail')).toBeHidden();
  expect(posts.at(-1)?.url).not.toContain('brevo');
  expect(posts.at(-1)?.body).toContain('"type":"project"');
  expect(posts.at(-1)?.body).not.toContain('test-key');

  posts.length = 0;
  await page.goto('/contact/?type=demo&product=copharia');
  await expect(page.locator('[data-contact-panel]')).toHaveAttribute('data-mode', 'demo');
  await page.locator('#message').fill('');
  await reachDemoSummary(page);
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeVisible();
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('[data-outcome-title]')).toBeVisible();
  await expect(page.locator('[data-outcome-title]')).toHaveText('Merci pour votre message !');
  expect(posts.at(-1)?.body).toContain('"type":"demo"');
  expect(posts.at(-1)?.body).toContain('"product":"copharia"');

  posts.length = 0;
  await page.goto('/en/contact/?type=ai');
  await reachSummary(page, 'We want to connect a model to a process we already run.');
  await expect(page.getByRole('button', { name: 'Send my request' })).toBeVisible();
  await page.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.locator('[data-outcome-title]')).toBeVisible();
  await expect(page.locator('[data-outcome-title]')).toHaveText('Thank you for your message!');
  await expect(page.locator('[data-outcome-body]')).toBeVisible();
  await expect(page.locator('[data-outcome-body]')).toContainText('submitted to our email service');
  expect(posts.at(-1)?.body).toContain('"locale":"en"');
  expect(posts.at(-1)?.body).toContain('"type":"ai"');

  posts.length = 0;
  await page.goto('/en/contact/?type=demo&product=copharia');
  await page.locator('#message').fill('');
  await reachDemoSummary(page, '');
  await expect(page.getByRole('button', { name: 'Send my request' })).toBeVisible();
  await page.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.locator('[data-outcome-title]')).toBeVisible();
  await expect(page.locator('[data-outcome-title]')).toHaveText('Thank you for your message!');
  expect(posts.at(-1)?.body).toContain('"product":"copharia"');
});

test('v3.3 a failed send keeps the message and restores the mail fallback', async ({ page }) => {
  let posts = 0;
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'b'.repeat(32) }),
      });
      return;
    }
    posts += 1;
    await route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, error: 'provider' }),
    });
  });
  await page.goto('/contact/?type=project');
  const text = 'Nous voulons conserver ce texte TOKEN-KEEP apres un echec.';
  await reachSummary(page, text);
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeVisible();
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('[data-outcome-fallback]')).toBeVisible();
  await expect(page.locator('[data-outcome-fallback]')).toContainText('Vos informations sont conservées');
  await expect(page.locator('[data-outcome-title]')).toBeHidden();
  await expect(page.locator('#err-4')).toHaveText('');
  await expect(page.locator('#message')).toHaveValue(text);
  await expect(page.locator('#open-gmail')).toBeVisible();
  await expect(page.locator('#open-gmail')).toHaveAttribute('href', /TOKEN-KEEP/);
  await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeEnabled();
  expect(posts).toBe(1);
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect.poll(() => posts).toBe(2);
});

test('v3.3 an uncertain Brevo timeout says the request may already exist', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'c'.repeat(32) }),
      });
      return;
    }
    await route.fulfill({
      status: 504,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, error: 'uncertain' }),
    });
  });
  await page.goto('/contact/?type=project');
  await reachSummary(page, 'Nous voulons signaler un envoi dont le resultat est incertain.');
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('[data-outcome-fallback]')).toContainText('peut-être été reçue');
  await expect(page.locator('[data-outcome-fallback]')).toContainText('pourrait créer un doublon');
  await expect(page.locator('[data-outcome-title]')).toBeHidden();
  await expect(page.locator('#err-4')).toHaveText('');
  await expect(page.locator('#message')).toHaveValue(/incertain/);
});

test('v3.3 screenshots for contact desktop and mobile', async ({ page }) => {
  const dir = 'docs/v3.3-screenshots';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact/');
  await page.screenshot({ path: `${dir}/01-contact-1440.png`, fullPage: true });
  await page.goto('/contact/?type=demo&product=copharia');
  await page.screenshot({ path: `${dir}/02-copharia-1440.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact/');
  await page.screenshot({ path: `${dir}/03-contact-390.png`, fullPage: true });
  await page.goto('/en/contact/?type=demo&product=copharia');
  await page.screenshot({ path: `${dir}/04-copharia-en-390.png`, fullPage: true });
});

test('confirmation stays hidden until the service accepts the enquiry', async ({ page }) => {
  let posts = 0;
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'd'.repeat(32) }),
      });
      return;
    }
    posts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
  await page.goto('/contact/?type=project');
  await reachSummary(page, 'Cette reponse ok ne doit pas afficher de remerciement.');
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.locator('[data-outcome-title]')).toBeHidden();
  await expect(page.locator('#open-gmail')).toBeVisible();
  await expect(page.locator('#message')).toHaveValue(/remerciement/);
  expect(posts).toBe(1);
});

test('a second click does not send the enquiry twice', async ({ page }) => {
  let posts = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'e'.repeat(32) }),
      });
      return;
    }
    posts += 1;
    await gate;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, accepted: true }),
    });
  });
  await page.goto('/contact/?type=project');
  await reachSummary(page, 'Un seul envoi doit partir meme si le bouton est presse deux fois.');
  const send = page.getByRole('button', { name: 'Envoyer ma demande' });
  await send.click();
  await expect.poll(() => posts).toBe(1);
  await send.click({ force: true }).catch(() => {});
  expect(posts).toBe(1);
  release();
  await expect(page.locator('[data-outcome-title]')).toBeVisible();
  await expect(page.locator('[data-outcome-title]')).toHaveText('Merci pour votre message !');
  expect(posts).toBe(1);
});

test('QA campaign dots stay clear of the labels', async ({ page }) => {
  test.setTimeout(90000);
  const cases = [
    ['/', ['Parcours nominal', 'API commande', 'Non-régression', "Cas d'erreur"]],
    ['/en/', ['Happy path', 'Order API', 'Regression', 'Error case']],
  ] as const;
  for (const [path, labels] of cases) {
    for (const width of [1440, 1024, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.locator('#tab-qa').click();
      const checks = page.locator('#checks .check');
      await expect(checks).toHaveCount(4);
      const measured = await checks.evaluateAll((nodes) => nodes.map((node) => {
        const box = node.getBoundingClientRect();
        const dot = getComputedStyle(node, '::before');
        const padding = parseFloat(getComputedStyle(node).paddingLeft);
        const left = parseFloat(dot.left);
        const dotWidth = parseFloat(dot.width);
        const top = parseFloat(dot.top);
        const dotHeight = parseFloat(dot.height);
        const parts = dot.transform.startsWith('matrix(')
          ? dot.transform.slice(7, -1).split(',').map((part) => parseFloat(part))
          : [];
        const shift = parts[5] || 0;
        return {
          gap: padding - (left + dotWidth),
          centerDelta: Math.abs(top + dotHeight / 2 + shift - box.height / 2),
          text: (node.textContent || '').trim(),
        };
      }));
      expect(measured.map((item) => item.text)).toEqual([...labels]);
      for (const item of measured) {
        expect(item.gap, `${path} ${width} ${item.text}`).toBeGreaterThanOrEqual(12);
        expect(item.centerDelta, `${path} ${width} ${item.text}`).toBeLessThanOrEqual(2);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} ${width}`).toBeLessThanOrEqual(1);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('#run-qa').click();
    const colors = await page.locator('#checks .check').evaluateAll((nodes) => nodes.map((node) => ({
      ok: node.classList.contains('is-ok'),
      fail: node.classList.contains('is-fail'),
      color: getComputedStyle(node, '::before').backgroundColor,
    })));
    expect(colors.filter((item) => item.ok).length).toBe(3);
    expect(colors.find((item) => item.fail)?.color).toBe('rgb(255, 177, 90)');
    expect(colors.find((item) => item.ok)?.color).toBe('rgb(142, 240, 194)');
  }
});

test('the accepted confirmation is visible in French and English', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, available: true, token: 'f'.repeat(32) }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, accepted: true }),
    });
  });
  for (const [path, title, body] of [
    ['/contact/?type=project', 'Merci pour votre message !', 'transmise à notre service de messagerie'],
    ['/en/contact/?type=project', 'Thank you for your message!', 'submitted to our email service'],
  ] as const) {
    await page.setViewportSize({ width: path.startsWith('/en') ? 390 : 1440, height: 900 });
    await page.goto(path);
    await reachSummary(page, path.startsWith('/en')
      ? 'We want to evolve an application that is already running.'
      : 'Nous voulons moderniser une application deja en production.');
    await page.getByRole('button', { name: path.startsWith('/en') ? 'Send my request' : 'Envoyer ma demande' }).click();
    const heading = page.locator('[data-outcome-title]');
    const copy = page.locator('[data-outcome-body]');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(title);
    await expect(copy).toBeVisible();
    await expect(copy).toContainText(body);
    await expect(page.locator('[data-outcome-fallback]')).toBeHidden();
    await expect(page.getByRole('button', { name: path.startsWith('/en') ? 'Send my request' : 'Envoyer ma demande' })).toBeHidden();
    const paint = await heading.evaluate((node) => {
      const color = getComputedStyle(node).color;
      const opacity = getComputedStyle(node).opacity;
      const display = getComputedStyle(node).display;
      let host: Element | null = node;
      let background = 'rgba(0, 0, 0, 0)';
      while (host) {
        const value = getComputedStyle(host).backgroundColor;
        if (value && value !== 'rgba(0, 0, 0, 0)') {
          background = value;
          break;
        }
        host = host.parentElement;
      }
      const box = document.getElementById('outcome-text')?.getBoundingClientRect();
      const frame = document.getElementById('outcome')?.getBoundingClientRect();
      return { color, background, opacity, display, height: box?.height || 0, frame: frame?.height || 0 };
    });
    expect(paint.display).not.toBe('none');
    expect(paint.opacity).toBe('1');
    expect(paint.height).toBeGreaterThan(10);
    expect(paint.frame - paint.height).toBeLessThanOrEqual(40);
    expect(contrastRatio(paint.color, paint.background)).toBeGreaterThanOrEqual(4.5);
  }
});

test('the rights matrix and the two project cards line up in French and English', async ({ page }) => {
  test.setTimeout(120000);
  for (const [path, view] of [['/', 'Visible'], ['/en/', 'Visible']] as const) {
    for (const width of [1440, 1024, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} ${width}`).toBeLessThanOrEqual(1);
      await page.locator('#tab-cyber').click();
      await expect(page.locator('#panel-cyber')).toBeVisible();
      const roles = await page.locator('#roles .role').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
      expect(roles[1].top).toBeGreaterThanOrEqual(roles[0].bottom - 1);
      expect(roles[2].top).toBeGreaterThanOrEqual(roles[1].bottom - 1);
      expect(roles[0].left).toBeLessThanOrEqual(roles[1].left + 1);
      const cells = await page.locator('#matrix > div').evaluateAll((nodes) => nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y), h: Math.round(box.height), t: (node.textContent || '').trim() };
      }));
      expect(cells).toHaveLength(8);
      for (let index = 0; index < 4; index += 1) {
        expect(Math.abs(cells[index].x - cells[index + 4].x)).toBeLessThanOrEqual(1);
        expect(Math.abs(cells[index].h - cells[4].h)).toBeLessThanOrEqual(2);
      }
      expect(cells[5].t).toBe(view);
      expect(cells[6].t).toBe(view);
      expect(cells[5].t.endsWith(' ')).toBe(false);
      const font = await page.locator('#matrix .cell').first().evaluate((node) => getComputedStyle(node).fontFamily.toLowerCase());
      expect(font).not.toContain('mono');
      expect(font).not.toContain('plex');
      const matrixTop = cells[0].y;
      expect(matrixTop - roles[2].bottom).toBeGreaterThanOrEqual(20);
      expect(matrixTop - roles[2].bottom).toBeLessThanOrEqual(32);
      const afterClick = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(afterClick, `${path} matrix ${width}`).toBeLessThanOrEqual(1);

      if (width >= 1024) {
        const arts = await page.locator('.work-grid .case-art').evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().height)));
        const cards = await page.locator('.work-grid .case').evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().height)));
        const actions = await page.locator('.work-grid .case-actions').evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().bottom)));
        expect(arts).toHaveLength(2);
        expect(Math.abs(arts[0] - arts[1])).toBeLessThanOrEqual(1);
        expect(arts[0]).toBeGreaterThanOrEqual(260);
        expect(Math.abs(cards[0] - cards[1])).toBeLessThanOrEqual(1);
        expect(Math.abs(actions[0] - actions[1])).toBeLessThanOrEqual(2);
      } else {
        const cards = await page.locator('.work-grid .case').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
        expect(cards[1].top).toBeGreaterThanOrEqual(cards[0].bottom - 1);
        const arts = await page.locator('.work-grid .case-art').evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().height)));
        expect(arts[0]).toBeGreaterThanOrEqual(220);
        expect(arts[1]).toBeGreaterThanOrEqual(220);
      }
    }
  }
});

test('the privacy pages describe the live form without inventing a retention period', async ({ page }) => {
  await page.goto('/confidentialite/');
  const fr = await page.locator('main').innerText();
  expect(fr).toContain('COCONSULT SAS');
  expect(fr).toContain('Brevo');
  expect(fr).toContain('contact@coconsult.fr');
  expect(fr).toContain('Aucune durée chiffrée');
  expect(fr).not.toMatch(/\b\d+\s+ans\b/);
  expect(fr).not.toContain("n’a pas de formulaire");
  await page.goto('/en/privacy-policy/');
  const en = await page.locator('main').innerText();
  expect(en).toContain('COCONSULT SAS');
  expect(en).toContain('Brevo');
  expect(en).toContain('contact@coconsult.fr');
  expect(en).toContain('No fixed period');
  expect(en).not.toContain('The site has no form');
});

test('home and QA pages meet WCAG AA checks we can automate', async ({ page }) => {
  for (const urlPath of ['/', '/en/', '/contact/', '/en/contact/', '/solutions/', '/secteurs/', '/en/industries/', '/services/paiements/', '/services/qa-testing/', '/en/services/qa-testing/']) {
    await page.goto(urlPath);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  }
});
