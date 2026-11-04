import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const astro = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
const output = path.join(root, 'dist-behind');
const port = 4331;
const base = `http://127.0.0.1:${port}/`;

const env = {
  ...process.env,
  PUBLIC_BEHIND_HERO: 'true',
  PUBLIC_ASSISTANT: 'true',
  BEHIND_PREVIEW_DIR: 'dist-behind',
  ASTRO_TELEMETRY_DISABLED: '1',
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [astro, ...args], { cwd: root, env, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`astro ${args.join(' ')} exited ${code}`))));
  });
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = path.normalize(decoded).replace(/^([/\\])+/, '');
  const target = path.resolve(output, relative);
  if (target !== output && !target.startsWith(`${output}${path.sep}`)) return '';
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) return path.join(target, 'index.html');
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  const indexed = path.join(target, 'index.html');
  if (fs.existsSync(indexed)) return indexed;
  return '';
}

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      const file = resolveFile(request.url || '/');
      if (!file) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }
      response.writeHead(200, {
        'content-type': types[path.extname(file)] || 'application/octet-stream',
        'cache-control': 'no-store',
      });
      fs.createReadStream(file).pipe(response);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function selectedLayer(page) {
  return page.evaluate(() => {
    const scene = document.querySelector('.hero .behind-scene');
    return scene?.querySelector('input:checked')?.value || null;
  });
}

async function explainText(page) {
  return page.locator('.hero .behind-scene [data-explain]').innerText();
}

fs.rmSync(output, { recursive: true, force: true });
await run(['build']);
const server = await serve();
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  const scene = page.locator('.hero .behind-scene');
  assert.equal(await scene.count(), 1);
  await scene.waitFor({ state: 'visible' });

  assert.equal(await page.locator('#systeme').count(), 0);
  assert.ok((await page.locator('[data-assistant-open], [data-assistant]').count()) > 0);
  assert.match(await scene.locator('.scene-title').innerText(), /cache derrière|sits behind/i);
  assert.match(await scene.locator('.scene-guide').innerText(), /4 couches|4 layers/i);

  await page.waitForFunction(
    () => {
      const el = document.querySelector('.hero .behind-scene');
      return el?.dataset.autoplayed === 'true' && el.dataset.playing === 'false';
    },
    null,
    { timeout: 20000 },
  );

  await scene.locator('input[value="data"]').check({ force: true });
  assert.equal(await selectedLayer(page), 'data');
  const beforeExplain = await explainText(page);
  assert.match(beforeExplain, /donnée|Data/i);

  const stack = scene.locator('.stack');
  const box = await stack.boundingBox();
  assert.ok(box, 'stack bounding box');

  for (const x of [0.08, 0.28, 0.52, 0.78, 0.94]) {
    await page.mouse.move(box.x + box.width * x, box.y + box.height * 0.45);
    assert.equal(await selectedLayer(page), 'data', `pointermove at ${x} must keep Data`);
  }

  await stack.dispatchEvent('pointerleave');
  assert.equal(await selectedLayer(page), 'data');
  assert.equal(await explainText(page), beforeExplain);

  for (const layer of ['app', 'arch', 'data', 'cloud']) {
    await scene.locator(`label:has(input[value="${layer}"])`).click();
    assert.equal(await selectedLayer(page), layer);
    const text = await explainText(page);
    assert.ok(text.trim().length > 12, `explain for ${layer}`);
  }

  await scene.locator('input[value="cloud"]').check({ force: true });
  await scene.locator('[data-replay]').click();
  await page.waitForFunction(
    () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'true',
    null,
    { timeout: 5000 },
  );
  assert.equal(await scene.getAttribute('data-mode'), 'intro');
  await scene.locator('input[value="arch"]').check({ force: true });
  await page.waitForFunction(
    () => document.querySelector('.hero .behind-scene')?.dataset.playing === 'false',
    null,
    { timeout: 5000 },
  );
  assert.equal(await selectedLayer(page), 'arch');
  assert.equal(await scene.getAttribute('data-mode'), 'explore');

  const source = await page.content();
  assert.equal(source.includes('pointermove'), false);
  assert.equal(/Une application métier\. Un objet\. Une signature\./.test(source), false);
  assert.match(source, /Démonstration illustrative|Illustrative demonstration/);

  console.log('behind-explorer: ok');
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
