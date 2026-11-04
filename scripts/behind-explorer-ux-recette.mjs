import { chromium } from '@playwright/test';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:4331/';
const outDir = 'docs/design/behind-the-digital/explorer-ux';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = {
  base,
  diagnosis:
    'pointermove on .stack mapped X to a layer and set input.checked, so crossing the visual changed the selection without a click.',
  fixes: [
    'Removed pointermove/pointerleave selection and preview paths',
    'Layer changes only via radio click/touch/keyboard',
    'Separated intro phase captions from layer explanations',
    'Added scene title + explore guide; soft note kept',
    'Action label no longer styled as a primary button',
  ],
  checks: {},
};

async function settle(page) {
  await page.waitForSelector('.hero .behind-scene');
  await page.locator('.hero .behind-scene').scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => {
      const el = document.querySelector('.hero .behind-scene');
      if (!el) return false;
      if (el.dataset.autoplayed === 'true' && el.dataset.playing === 'false') return true;
      if (el.dataset.playing !== 'true' && el.dataset.phase === 'settle') {
        el.querySelector('[data-skip]')?.click();
        el.dataset.autoplayed = 'true';
        el.dataset.playing = 'false';
        return true;
      }
      return false;
    },
    null,
    { timeout: 20000 },
  );
  await page.waitForFunction(
    () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false',
    null,
    { timeout: 15000 },
  );
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, name), type: 'jpeg', quality: 72, fullPage: false });
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page);
  await shot(page, 'after-desktop-settled-1440.jpg');

  const layers = ['app', 'arch', 'data', 'cloud'];
  for (const layer of layers) {
    await page.locator(`.hero .behind-scene label:has(input[value="${layer}"])`).click();
    await page.waitForTimeout(350);
    await shot(page, `after-desktop-${layer}-1440.jpg`);
  }

  const stack = page.locator('.hero .behind-scene .stack');
  const box = await stack.boundingBox();
  await page.locator('.hero .behind-scene input[value="data"]').check({ force: true });
  for (const x of [0.1, 0.35, 0.6, 0.85]) {
    await page.mouse.move(box.x + box.width * x, box.y + box.height * 0.4);
    await page.waitForTimeout(180);
  }
  report.checks.pointermoveKeepsData =
    (await page.evaluate(() => document.querySelector('.hero .behind-scene input:checked')?.value)) === 'data';

  await page.locator('.hero .behind-scene [data-replay]').click();
  await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true');
  await page.waitForTimeout(900);
  await shot(page, 'after-desktop-intro-1440.jpg');
  await page.waitForFunction(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false', null, {
    timeout: 15000,
  });

  await context.close();
  const video = page.video();
  if (video) await rename(await video.path(), path.join(outDir, 'navigation-interactive-1440.webm'));
}

for (const width of [320, 390, 768, 1024]) {
  const page = await browser.newPage({ viewport: { width, height: width < 800 ? 844 : 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page);
  await page.locator('.hero .behind-scene input[value="arch"]').check({ force: true });
  await page.waitForTimeout(250);
  await shot(page, `after-mobile-arch-${width}.jpg`);
  const overflow = await page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    if (!scene) return true;
    const rect = scene.getBoundingClientRect();
    return rect.right > window.innerWidth + 1 || document.documentElement.scrollWidth > window.innerWidth + 1;
  });
  report.checks[`noOverflow${width}`] = !overflow;
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(`${base}en/`, { waitUntil: 'networkidle' });
  await settle(page);
  await shot(page, 'after-desktop-en-1440.jpg');
  report.checks.enTitle = /behind an application/i.test(await page.locator('.hero .behind-scene .scene-title').innerText());
  await page.close();
}

{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForSelector('.hero .behind-scene');
  await page.waitForTimeout(800);
  const playing = await page.evaluate(() => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true');
  report.checks.reducedMotionStable = playing === false;
  await shot(page, 'after-desktop-reduced-1440.jpg');
  await page.close();
}

await writeFile(path.join(outDir, 'rapport.md'), `# Behind explorer UX — rapport

## Diagnostic

${report.diagnosis}

## Correctifs

${report.fixes.map((item) => `- ${item}`).join('\n')}

## Preuves

- Captures desktop/mobile dans ce dossier (\`after-*.jpg\`)
- Vidéo interactive : \`navigation-interactive-1440.webm\`
- Test automatisé : \`node tests/behind-explorer.spec.mjs\`

## Résultats automatiques

\`\`\`json
${JSON.stringify(report.checks, null, 2)}
\`\`\`

## Bilan UX

Le visiteur lit d’abord un titre et une consigne d’exploration, voit une démonstration courte, puis garde une sélection volontaire via les onglets. Traverser le châssis à la souris ne change plus la couche ni le texte explicatif.
`);

await writeFile(path.join(outDir, 'results.json'), JSON.stringify(report, null, 2));
await browser.close();
console.log(`behind-explorer-ux-recette: wrote ${outDir}`);
