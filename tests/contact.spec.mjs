import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { handleContact, handleHealth, resetContactLimits, resolveClientIp, sendReady } from '../server/contact.mjs';

function post(body, headers = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost',
      'content-length': String(Buffer.byteLength(JSON.stringify(body))),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function streamRequest(bytes, headers = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost',
      ...headers,
    },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }),
    duplex: 'half',
  });
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@analytical.example',
  company: 'Analytical',
  type: 'project',
  message: 'Nous souhaitons moderniser une application métier existante.',
};

const env = {
  CONTACT_SEND_ENABLED: 'true',
  BREVO_API_KEY: 'test-key',
  CONTACT_FROM: 'noreply@coconsult.fr',
  CONTACT_TO: 'contact@coconsult.fr',
};

const calls = [];
const fetchImpl = async (url, init) => {
  calls.push({ url, init });
  return new Response('{"messageId":"abc"}', { status: 201 });
};

async function issue(ip, now) {
  const response = await handleContact(new Request('http://localhost/api/contact'), {
    env,
    fetchImpl,
    ip,
    now,
  });
  const body = await response.json();
  assert.equal(body.available, true);
  assert.equal(typeof body.token, 'string');
  assert.equal(JSON.stringify(body).includes('test-key'), false);
  return body.token;
}

async function send(body, ip, now, extra = {}) {
  const token = await issue(ip, now);
  return handleContact(post({ ...body, token }), {
    env,
    fetchImpl,
    ip,
    now: now + 2_000,
    ...extra,
  });
}

resetContactLimits();
const unconfigured = await handleContact(post(valid), { env: {}, fetchImpl, ip: 'unconfigured', now: 1 });
assert.equal(unconfigured.status, 503);
assert.equal((await unconfigured.json()).error, 'unavailable');
assert.equal(calls.length, 0);
assert.equal(sendReady({}), false);
assert.equal(sendReady({ ...env, CONTACT_SEND_ENABLED: 'false' }), false);

resetContactLimits();
const disabled = await handleContact(post(valid), {
  env: { ...env, CONTACT_SEND_ENABLED: 'false' },
  fetchImpl,
  ip: 'disabled',
  now: 1,
});
assert.equal(disabled.status, 503);
assert.equal(calls.length, 0);

resetContactLimits();
const sent = await send({ ...valid, name: 'Ada\nBcc: x' }, 'sent', 10_000);
assert.equal(sent.status, 200);
assert.equal((await sent.json()).accepted, true);
const payload = JSON.parse(calls[0].init.body);
assert.equal(payload.to[0].email, 'contact@coconsult.fr');
assert.equal(payload.sender.email, 'noreply@coconsult.fr');
assert.equal(payload.replyTo.email, 'ada@analytical.example');
assert.equal(payload.subject, 'Coconsult — Projet logiciel');
assert.equal(payload.textContent.includes('\nBcc'), false);
assert.equal(payload.listIds, undefined);
assert.equal(payload.updateEnabled, undefined);
assert.equal(calls[0].init.headers['api-key'], 'test-key');
assert.equal(calls[0].url, 'https://api.brevo.com/v3/smtp/email');

resetContactLimits();
const subjects = [
  ['ai', '', 'Intelligence artificielle'],
  ['team', '', 'Équipe dédiée / nearshore'],
  ['qa', '', 'QA / cybersécurité'],
  ['qaDiscuss', '', 'QA / cybersécurité'],
  ['qa-team', '', 'QA / cybersécurité'],
  ['cloud', '', 'Cloud / infrastructure'],
  ['payments', '', 'Banque et paiements'],
  ['partnership', '', 'Partenariat'],
  ['automation', '', 'Autre demande'],
  ['other', '', 'Autre demande'],
  ['demo', 'copharia', 'Démonstration COPHARIA'],
];
for (const [type, product, subject] of subjects) {
  calls.length = 0;
  const response = await send({
    ...valid,
    type,
    product,
    message: type === 'demo' ? '' : valid.message,
    locale: 'fr',
  }, `subject-${type}`, 30_000);
  assert.equal(response.status, 200, type);
  assert.equal(JSON.parse(calls[0].init.body).subject, `Coconsult — ${subject}`);
}

resetContactLimits();
calls.length = 0;
const english = await send({ ...valid, locale: 'en' }, 'english', 40_000);
assert.equal(english.status, 200);
assert.equal(JSON.parse(calls[0].init.body).subject, 'Coconsult — Software project');

resetContactLimits();
const demoEmpty = await send({ ...valid, type: 'demo', product: 'copharia', message: '' }, 'demo-empty', 50_000);
assert.equal(demoEmpty.status, 200);

resetContactLimits();
for (const email of ['ada@gmail.com', 'ada@outlook.com', 'ada@orange.fr']) {
  calls.length = 0;
  const accepted = await send({ ...valid, email }, `public-${email}`, 55_000);
  assert.equal(accepted.status, 200, email);
  assert.equal(JSON.parse(calls[0].init.body).replyTo.email, email);
}

const rejected = [];
async function expectInvalid(body, ip) {
  resetContactLimits();
  const before = calls.length;
  const response = await handleContact(post(body), { env, fetchImpl, ip, now: 60_000 });
  assert.equal(response.status, 400, JSON.stringify(body));
  assert.equal((await response.json()).error, 'invalid');
  assert.equal(calls.length, before);
  rejected.push(ip);
}
await expectInvalid({ ...valid, name: 'A' }, 'short-name');
await expectInvalid({ ...valid, name: 12 }, 'name-type');
await expectInvalid({ ...valid, email: 'not-an-email' }, 'email');
await expectInvalid({ ...valid, email: `${'a'.repeat(151)}@gmail.com` }, 'email-length');
await expectInvalid({ ...valid, email: ['ada@analytical.example'] }, 'email-type');
await expectInvalid({ ...valid, company: { name: 'Analytical' } }, 'company-type');
await expectInvalid({ ...valid, type: 'newsletter' }, 'unknown-type');
await expectInvalid({ ...valid, type: 'project', product: 'copharia' }, 'product-on-project');
await expectInvalid({ ...valid, type: 'demo', product: 'other' }, 'bad-product');
await expectInvalid({ ...valid, type: 'demo', product: '' }, 'demo-without-product');
await expectInvalid({ ...valid, message: 'trop court' }, 'short-message');
await expectInvalid({ ...valid, message: 42 }, 'message-type');
await expectInvalid({ ...valid, locale: 'de' }, 'locale');

resetContactLimits();
const hugeField = await handleContact(post({ ...valid, message: 'x'.repeat(4001) }), {
  env,
  fetchImpl,
  ip: 'huge-field',
  now: 70_000,
});
assert.equal(hugeField.status, 400);

resetContactLimits();
const declared = await handleContact(post(valid, { 'content-length': '20001' }), {
  env,
  fetchImpl,
  ip: 'declared',
  now: 80_000,
});
assert.equal(declared.status, 413);

resetContactLimits();
const chunked = await handleContact(streamRequest(new Uint8Array(20_001).fill(97)), {
  env,
  fetchImpl,
  ip: 'chunked',
  now: 90_000,
});
assert.equal(chunked.status, 413);

resetContactLimits();
const malformed = await handleContact(streamRequest(new TextEncoder().encode('{')), {
  env,
  fetchImpl,
  ip: 'malformed',
  now: 100_000,
});
assert.equal(malformed.status, 400);
assert.equal((await malformed.json()).error, 'json');

resetContactLimits();
const arrayBody = await handleContact(post(['nope']), { env, fetchImpl, ip: 'array', now: 110_000 });
assert.equal(arrayBody.status, 400);

resetContactLimits();
for (let i = 0; i < 5; i += 1) {
  const allowed = await send(valid, 'rate', 120_000);
  assert.equal(allowed.status, 200);
}
const blocked = await send(valid, 'rate', 120_000);
assert.equal(blocked.status, 429);

resetContactLimits();
const beforeHoney = calls.length;
const honey = await handleContact(post({ ...valid, website: 'spam' }), {
  env,
  fetchImpl,
  ip: 'honey',
  now: 130_000,
});
assert.equal(honey.status, 200);
assert.equal((await honey.json()).accepted, undefined);
assert.equal(calls.length, beforeHoney);

resetContactLimits();
const method = await handleContact(new Request('http://localhost/api/contact', { method: 'PUT' }), {
  env,
  fetchImpl,
  ip: 'method',
  now: 140_000,
});
assert.equal(method.status, 405);

resetContactLimits();
const contentType = await handleContact(post(valid, { 'content-type': 'text/plain' }), {
  env,
  fetchImpl,
  ip: 'ctype',
  now: 150_000,
});
assert.equal(contentType.status, 415);

resetContactLimits();
const origin = await handleContact(post(valid, { origin: 'https://evil.example' }), {
  env,
  fetchImpl,
  ip: 'origin',
  now: 160_000,
});
assert.equal(origin.status, 403);

resetContactLimits();
const crossSite = await handleContact(post(valid, { 'sec-fetch-site': 'cross-site' }), {
  env,
  fetchImpl,
  ip: 'site',
  now: 170_000,
});
assert.equal(crossSite.status, 403);

resetContactLimits();
const token = await issue('early', 180_000);
const beforeEarly = calls.length;
const early = await handleContact(post({ ...valid, token }), { env, fetchImpl, ip: 'early', now: 180_000 });
assert.equal(early.status, 400);
assert.equal((await early.json()).error, 'early');
assert.equal(calls.length, beforeEarly);

resetContactLimits();
const reused = await issue('reuse', 190_000);
const first = await handleContact(post({ ...valid, token: reused }), {
  env,
  fetchImpl,
  ip: 'reuse',
  now: 192_000,
});
const second = await handleContact(post({ ...valid, token: reused }), {
  env,
  fetchImpl,
  ip: 'reuse',
  now: 192_000,
});
assert.equal(first.status, 200);
assert.equal(second.status, 400);

resetContactLimits();
const parallelToken = await issue('parallel', 200_000);
const beforeParallel = calls.length;
const pair = await Promise.all([
  handleContact(post({ ...valid, token: parallelToken }), { env, fetchImpl, ip: 'parallel', now: 203_000 }),
  handleContact(post({ ...valid, token: parallelToken }), { env, fetchImpl, ip: 'parallel', now: 203_000 }),
]);
const statuses = pair.map((response) => response.status).sort();
assert.deepEqual(statuses, [200, 400]);
assert.equal(calls.length, beforeParallel + 1);

resetContactLimits();
const beforeProvider = calls.length;
const providerToken = await issue('provider', 210_000);
const provider = await handleContact(post({ ...valid, token: providerToken }), {
  env,
  fetchImpl: async () => new Response('invalid api key test-key ada@analytical.example', { status: 401 }),
  ip: 'provider',
  now: 213_000,
});
const providerBody = await provider.json();
assert.equal(provider.status, 502);
assert.equal(providerBody.error, 'provider');
assert.equal(JSON.stringify(providerBody).includes('test-key'), false);
assert.equal(JSON.stringify(providerBody).includes('ada@'), false);
assert.equal(calls.length, beforeProvider);

resetContactLimits();
const downToken = await issue('down', 220_000);
const down = await handleContact(post({ ...valid, token: downToken }), {
  env,
  fetchImpl: async () => new Response('upstream exploded', { status: 503 }),
  ip: 'down',
  now: 223_000,
});
assert.equal(down.status, 502);
assert.equal(JSON.stringify(await down.json()).includes('exploded'), false);

resetContactLimits();
const networkToken = await issue('network', 230_000);
const network = await handleContact(post({ ...valid, token: networkToken }), {
  env,
  fetchImpl: async () => {
    throw new Error('connect ECONNREFUSED secret test-key');
  },
  ip: 'network',
  now: 233_000,
});
const networkBody = await network.json();
assert.equal(network.status, 502);
assert.equal(JSON.stringify(networkBody).includes('test-key'), false);
assert.equal(JSON.stringify(networkBody).includes('ECONNREFUSED'), false);

resetContactLimits();
const timeoutToken = await issue('timeout', 240_000);
const beforeTimeout = calls.length;
const timeout = await handleContact(post({ ...valid, token: timeoutToken }), {
  env,
  fetchImpl: () => new Promise(() => {}),
  ip: 'timeout',
  now: 243_000,
  timeoutMs: 30,
});
const timeoutBody = await timeout.json();
assert.equal(timeout.status, 504);
assert.equal(timeoutBody.error, 'uncertain');
assert.equal(JSON.stringify(timeoutBody).includes('test-key'), false);
assert.equal(calls.length, beforeTimeout);

assert.equal(resolveClientIp('203.0.113.9', '198.51.100.4', {}), '203.0.113.9');
assert.equal(resolveClientIp('203.0.113.9', '', { CONTACT_TRUST_PROXY: '203.0.113.9' }) === '203.0.113.9' || resolveClientIp('203.0.113.9', '', { CONTACT_TRUST_PROXY: '203.0.113.9' }) === '', true);
assert.equal(resolveClientIp('172.30.22.10', '198.51.100.20', { CONTACT_TRUST_CIDRS: '172.30.22.0/24' }), '198.51.100.20');
assert.equal(resolveClientIp('172.30.22.10', '198.51.100.20, 10.0.0.1', { CONTACT_TRUST_CIDRS: '172.30.22.0/24' }), '');
assert.equal(resolveClientIp('172.30.22.10', '', { CONTACT_TRUST_CIDRS: '172.30.22.0/24' }), '');
assert.equal(resolveClientIp('127.0.0.1', '198.51.100.8', {}), '198.51.100.8');
assert.equal(resolveClientIp('127.0.0.1', '', {}), '127.0.0.1');

resetContactLimits();
const identity = await handleContact(post(valid), { env, fetchImpl, ip: '', now: 250_000 });
assert.equal(identity.status, 400);
assert.equal((await identity.json()).error, 'identity');

const health = await handleHealth();
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { ok: true });

const nginx = readFileSync(new URL('../nginx.conf', import.meta.url), 'utf8');
const compose = readFileSync(new URL('../compose.yaml', import.meta.url), 'utf8');
assert.equal(nginx.includes('location = /api/contact'), true);
assert.equal(nginx.includes('proxy_pass http://$contact_upstream:3602'), true);
assert.equal(nginx.includes('resolver 127.0.0.11'), true);
assert.equal(nginx.includes('set_real_ip_from 172.19.0.0/16'), true);
assert.equal(/set_real_ip_from\s+172\.16\.0\.0\/12/.test(nginx), false);
assert.equal(nginx.includes('proxy_set_header X-Forwarded-For ""'), true);
assert.equal(compose.includes('coconsult-contact'), false);
assert.equal(compose.includes('3601:8080'), true);
assert.equal(compose.includes('"8080:8080"'), false);

const activation = readFileSync(new URL('../docs/CONTACT_ACTIVATION.md', import.meta.url), 'utf8');
assert.match(activation, /contact@coconsult\.fr` est aussi utilisée par CSSForever/);
assert.match(activation, /effet rétroactif/);
assert.match(activation, /Cette organisation n’est pas réalisée/);
assert.match(activation, /n’est pas configurée/);
assert.match(activation, /Ne pas modifier CSSForever, Brevo, le VPS ni les variables d’environnement/);
const rollback = activation.slice(activation.indexOf('## Rollback'));
assert.equal(rollback.includes('-f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml stop coconsult-contact'), true);
assert.equal(rollback.includes('-f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml rm -f coconsult-contact'), true);
assert.equal(rollback.includes('-f compose.yaml -f compose.proxy.yaml -f compose.contact.yaml up -d --build --no-deps coconsult-web'), true);
assert.equal(rollback.includes('docker compose -p coconsult -f compose.contact.yaml stop'), false);
assert.equal(rollback.includes('docker compose -p coconsult -f compose.contact.yaml rm -f'), false);

function dockerAvailable() {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (dockerAvailable()) {
  const proxyDir = mkdtempSync(join(tmpdir(), 'coconsult-proxy-'));
  const proxyFile = join(proxyDir, 'compose.proxy.yaml');
  writeFileSync(proxyFile, [
    'services:',
    '  coconsult-web:',
    '    networks:',
    '      - proxy-network',
    'networks:',
    '  proxy-network:',
    '    external: true',
    '',
  ].join('\n'));
  const files = ['-f', 'compose.yaml', '-f', proxyFile, '-f', 'compose.contact.yaml'];
  const config = execFileSync('docker', ['compose', '-p', 'coconsult-rollback-check', ...files, 'config'], { encoding: 'utf8' });
  assert.equal(config.includes('coconsult-web'), true);
  assert.equal(config.includes('coconsult-contact'), true);
  assert.equal(config.includes('coconsult-egress'), true);
  assert.equal(config.includes('host_ip: 127.0.0.1'), true);
  assert.equal(config.includes('published: "3601"'), true);
  assert.equal(config.includes('target: 8080'), true);
  assert.equal(config.includes('172.30.22.0/24'), false);
  const configJson = JSON.parse(execFileSync('docker', ['compose', '-p', 'coconsult-rollback-check', ...files, 'config', '--format', 'json'], { encoding: 'utf8' }));
  assert.deepEqual(Object.keys(configJson.services['coconsult-web'].networks).sort(), ['coconsult-contact', 'default', 'proxy-network']);
  assert.deepEqual(Object.keys(configJson.services['coconsult-contact'].networks).sort(), ['coconsult-contact', 'coconsult-egress']);
  assert.equal(configJson.networks['coconsult-contact'].internal, true);
  assert.notEqual(configJson.networks['coconsult-egress'].internal, true);
  assert.equal(configJson.networks['coconsult-contact'].ipam.config[0].subnet, '10.230.22.0/24');
  assert.equal(configJson.services['coconsult-contact'].networks['coconsult-contact'].ipv4_address, '10.230.22.10');
  assert.equal(configJson.services['coconsult-contact'].ports, undefined);
  assert.equal(configJson.services['coconsult-contact'].environment.CONTACT_BIND, '10.230.22.10');
  assert.notEqual(String(configJson.services['coconsult-contact'].environment.CONTACT_SEND_ENABLED || ''), 'true');
  let overlayAlone = 0;
  try {
    execFileSync('docker', ['compose', '-f', 'compose.contact.yaml', 'config'], { stdio: 'ignore' });
  } catch {
    overlayAlone = 1;
  }
  assert.equal(overlayAlone, 1);
  let createdNetwork = false;
  try {
    execFileSync('docker', ['network', 'inspect', 'proxy-network'], { stdio: 'ignore' });
  } catch {
    execFileSync('docker', ['network', 'create', 'proxy-network'], { stdio: 'ignore' });
    createdNetwork = true;
  }
  try {
    const base = ['compose', '-p', 'coconsult-rollback-check', ...files];
    execFileSync('docker', [...base, 'stop', 'coconsult-contact'], { stdio: 'ignore' });
    execFileSync('docker', [...base, 'rm', '-f', 'coconsult-contact'], { stdio: 'ignore' });
    const dry = spawnSync('docker', [...base, 'up', '--dry-run', '--no-deps', 'coconsult-web'], { encoding: 'utf8' });
    assert.equal(dry.status, 0);
    const output = `${dry.stdout}\n${dry.stderr}`;
    assert.equal(output.includes('Container coconsult-web'), true);
    assert.equal(output.includes('Container coconsult-contact'), false);
  } finally {
    if (createdNetwork) execFileSync('docker', ['network', 'rm', 'proxy-network'], { stdio: 'ignore' });
    rmSync(proxyDir, { recursive: true, force: true });
  }
} else {
  console.log('SKIP compose rollback config: docker is not available');
}

console.log('Contact API checks passed');
