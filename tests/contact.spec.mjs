import assert from 'node:assert/strict';
import { handleContact, resetContactLimits } from '../server/contact.mjs';

function post(body, headers = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': String(JSON.stringify(body).length), ...headers },
    body: JSON.stringify(body),
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

resetContactLimits();
const unconfigured = await handleContact(post(valid), { env: {}, fetchImpl, ip: 'a', now: 1 });
assert.equal(unconfigured.status, 503);
assert.equal((await unconfigured.json()).ok, false);
assert.equal(calls.length, 0);

resetContactLimits();
const sent = await handleContact(post({ ...valid, name: 'Ada\nBcc: x' }), {
  env: { BREVO_API_KEY: 'secret', CONTACT_FROM: 'noreply@coconsult.fr', CONTACT_TO: 'contact@coconsult.fr' },
  fetchImpl,
  ip: 'b',
  now: 1,
});
assert.equal(sent.status, 200);
const payload = JSON.parse(calls[0].init.body);
assert.equal(payload.to[0].email, 'contact@coconsult.fr');
assert.equal(payload.sender.email, 'noreply@coconsult.fr');
assert.equal(payload.textContent.includes('\nBcc'), false);
assert.equal(calls[0].init.headers['api-key'], 'secret');

resetContactLimits();
const env = { BREVO_API_KEY: 'secret', CONTACT_FROM: 'noreply@coconsult.fr' };
for (let i = 0; i < 5; i += 1) {
  const allowed = await handleContact(post(valid), { env, fetchImpl, ip: 'rate', now: 10_000 + i });
  assert.equal(allowed.status, 200);
}
const blocked = await handleContact(post(valid), { env, fetchImpl, ip: 'rate', now: 10_010 });
assert.equal(blocked.status, 429);

resetContactLimits();
const beforeHoney = calls.length;
const honey = await handleContact(post({ ...valid, website: 'spam' }), {
  env: { BREVO_API_KEY: 'secret', CONTACT_FROM: 'noreply@coconsult.fr' },
  fetchImpl,
  ip: 'c',
  now: 1,
});
assert.equal(honey.status, 200);
assert.equal(calls.length, beforeHoney);

console.log('Contact API checks passed');
