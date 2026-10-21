import assert from 'node:assert/strict';
import http from 'node:http';
import { createContactServer, handleContact, resetContactLimits, resolveClientIp } from '../server/contact.mjs';

function post(body, headers = {}) {
  const payload = JSON.stringify(body);
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': String(payload.length), ...headers },
    body: payload,
  });
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical',
  type: 'project',
  message: 'Nous souhaitons moderniser une application métier existante.',
};

const calls = [];
const fetchImpl = async (url, init) => {
  calls.push({ url, init });
  return new Response('{}', { status: 201 });
};

const env = { BREVO_API_KEY: 'secret', CONTACT_FROM: 'noreply@coconsult.fr', CONTACT_TO: 'contact@coconsult.fr' };

async function tokenFor(ip, now, extra = {}) {
  const response = await handleContact(new Request('http://localhost/api/contact'), {
    env,
    fetchImpl,
    ip,
    now,
    minAgeMs: 0,
    ...extra,
  });
  const body = await response.json();
  assert.equal(body.configured, true);
  assert.equal(typeof body.token, 'string');
  return body.token;
}

resetContactLimits();
const unconfigured = await handleContact(post(valid), { env: {}, fetchImpl, ip: 'a', now: 1 });
assert.equal(unconfigured.status, 503);
assert.equal((await unconfigured.json()).ok, false);
assert.equal(calls.length, 0);

resetContactLimits();
const token = await tokenFor('b', 1);
const sent = await handleContact(post({ ...valid, name: 'Ada\nBcc: x', token }), {
  env,
  fetchImpl,
  ip: 'b',
  now: 1,
  minAgeMs: 0,
});
assert.equal(sent.status, 200);
const payload = JSON.parse(calls[0].init.body);
assert.equal(payload.to[0].email, 'contact@coconsult.fr');
assert.equal(payload.sender.email, 'noreply@coconsult.fr');
assert.equal(payload.textContent.includes('\nBcc'), false);
assert.equal(calls[0].init.headers['api-key'], 'secret');

resetContactLimits();
for (let i = 0; i < 5; i += 1) {
  const allowedToken = await tokenFor('rate', 10_000 + i);
  const allowed = await handleContact(post({ ...valid, token: allowedToken }), {
    env,
    fetchImpl,
    ip: 'rate',
    now: 10_000 + i,
    minAgeMs: 0,
  });
  assert.equal(allowed.status, 200);
}
const blockedToken = await tokenFor('rate', 10_010);
const blocked = await handleContact(post({ ...valid, token: blockedToken }), {
  env,
  fetchImpl,
  ip: 'rate',
  now: 10_010,
  minAgeMs: 0,
});
assert.equal(blocked.status, 429);

resetContactLimits();
const beforeHoney = calls.length;
const honey = await handleContact(post({ ...valid, website: 'spam' }), {
  env,
  fetchImpl,
  ip: 'c',
  now: 1,
});
assert.equal(honey.status, 200);
assert.equal(calls.length, beforeHoney);

resetContactLimits();
const earlyToken = await handleContact(new Request('http://localhost/api/contact'), {
  env,
  fetchImpl,
  ip: 'early',
  now: 5_000,
});
const earlyBody = await earlyToken.json();
const tooSoon = await handleContact(post({ ...valid, token: earlyBody.token }), {
  env,
  fetchImpl,
  ip: 'early',
  now: 5_000,
});
assert.equal(tooSoon.status, 400);
assert.equal((await tooSoon.json()).error, 'early');
assert.equal(calls.length, beforeHoney);
const waited = await handleContact(post({ ...valid, token: earlyBody.token }), {
  env,
  fetchImpl,
  ip: 'early',
  now: 8_000,
});
assert.equal(waited.status, 200);

resetContactLimits();
const otherIpToken = await tokenFor('203.0.113.10', 1);
const wrongIp = await handleContact(post({ ...valid, token: otherIpToken }), {
  env,
  fetchImpl,
  ip: '203.0.113.11',
  now: 1,
  minAgeMs: 0,
});
assert.equal(wrongIp.status, 400);

assert.equal(resolveClientIp('127.0.0.1', '203.0.113.8', {}), '203.0.113.8');
assert.equal(resolveClientIp('::ffff:127.0.0.1', '203.0.113.9', {}), '203.0.113.9');
assert.equal(resolveClientIp('10.1.1.1', '203.0.113.8', {}), '10.1.1.1');
assert.equal(resolveClientIp('10.0.0.8', '203.0.113.8', { CONTACT_TRUST_PROXY: '10.0.0.8' }), '203.0.113.8');
assert.equal(resolveClientIp('127.0.0.1', '1.2.3.4, 203.0.113.8', {}), '127.0.0.1');
assert.equal(resolveClientIp('127.0.0.1', 'not-an-ip', {}), '127.0.0.1');

resetContactLimits();
let sentBytes = 0;
const oversized = new Request('http://localhost/api/contact', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  duplex: 'half',
  body: new ReadableStream({
    pull(controller) {
      if (sentBytes > 20_000) {
        controller.error(new Error('read past cap'));
        return;
      }
      const chunk = new Uint8Array(1000);
      sentBytes += chunk.byteLength;
      controller.enqueue(chunk);
      if (sentBytes >= 30_000) controller.close();
    },
  }),
});
const tooBig = await handleContact(oversized, { env, fetchImpl, ip: 'big', now: 1 });
assert.equal(tooBig.status, 413);
assert.ok(sentBytes <= 21_000);

resetContactLimits();
const beforeFailure = calls.length;
const leaked = await handleContact(post({ ...valid, token: await tokenFor('leak', 1) }), {
  env,
  fetchImpl: async () => new Response('secret-from-provider', { status: 500 }),
  ip: 'leak',
  now: 1,
  minAgeMs: 0,
});
assert.equal(leaked.status, 502);
const leakedBody = await leaked.json();
assert.deepEqual(leakedBody, { ok: false, error: 'provider' });
assert.equal(JSON.stringify(leakedBody).includes('secret'), false);
const timedOut = await handleContact(post({ ...valid, token: await tokenFor('slow', 2) }), {
  env,
  fetchImpl: (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new Error('aborted')));
  }),
  ip: 'slow',
  now: 2,
  minAgeMs: 0,
  timeoutMs: 20,
});
assert.equal(timedOut.status, 502);
assert.equal(calls.length, beforeFailure);

const server = createContactServer({
  env: { ...env, CONTACT_MIN_AGE_MS: '0' },
  fetchImpl: async () => {
    throw new Error('network down secret');
  },
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
assert.equal(address.address, '127.0.0.1');

function request(path, { method = 'GET', headers = {}, body = '' } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: '127.0.0.1', port: address.port, path, method, headers },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') });
        });
      },
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const issued = await request('/api/contact', { headers: { 'x-real-ip': '203.0.113.20', 'x-forwarded-for': '198.51.100.9' } });
const issuedBody = JSON.parse(issued.body);
assert.equal(issued.status, 200);
const rejected = await request('/api/contact', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-real-ip': '203.0.113.21',
    'x-forwarded-for': '203.0.113.20',
  },
  body: JSON.stringify({ ...valid, token: issuedBody.token }),
});
assert.equal(rejected.status, 400);
const accepted = await request('/api/contact', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-real-ip': '203.0.113.20' },
  body: JSON.stringify({ ...valid, token: issuedBody.token }),
});
assert.equal(accepted.status, 502);
assert.equal(accepted.body.includes('secret'), false);

const huge = await new Promise((resolve, reject) => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: address.port,
      path: '/api/contact',
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': 100_000 },
    },
    (res) => {
      res.resume();
      resolve(res.statusCode);
      req.destroy();
    },
  );
  req.on('error', () => {});
  req.write('{"name":"x"}');
});
assert.equal(huge, 413);
const stillUp = await request('/api/contact');
assert.equal(stillUp.status, 200);
server.close();

console.log('Contact API checks passed');
