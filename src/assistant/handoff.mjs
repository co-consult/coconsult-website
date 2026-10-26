/**
 * One-shot summary handoff for the contact form.
 * The text lives in the origin Cache API until the contact page reads it,
 * the visitor cancels, or two minutes pass. It is not put in the URL,
 * web storage, or a cookie, and it is not sent by itself.
 * Keep the cache name, path, and lifetime aligned with public/assets/contact.js.
 */
export const HANDOFF_CACHE = 'cc-guide-handoff';
export const HANDOFF_PATH = '/cc-guide-handoff';
const HANDOFF_TTL_MS = 120000;
const MAX_MESSAGE = 1500;
const EMAIL = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i;
const PHONE = /\+?\d[\d\s().-]{8,}\d/;

export function encodeHandoff(message, now = Date.now()) {
  const text = cleanMessage(message);
  if (!text || hasPersonalData(text)) return '';
  return JSON.stringify({ exp: now + HANDOFF_TTL_MS, path: 'guide', message: text });
}

/** Marks a guide visit without copying the conversation or the summary. */
export function encodeGuideVisit(now = Date.now()) {
  return JSON.stringify({ exp: now + HANDOFF_TTL_MS, path: 'guide' });
}

export function decodeHandoff(raw, now = Date.now()) {
  if (typeof raw !== 'string' || raw.length > 4000) return '';
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return '';
  }
  if (!data || typeof data.exp !== 'number' || data.exp < now) return '';
  const text = cleanMessage(data.message);
  if (!text || hasPersonalData(text)) return '';
  return text;
}

let cacheChain = Promise.resolve();

function settle(task) {
  const run = cacheChain.then(task, task);
  cacheChain = run.then(() => undefined, () => undefined);
  return run;
}

export function armHandoff(message) {
  const body = encodeHandoff(message);
  if (!body || typeof caches === 'undefined') return Promise.resolve(false);
  return settle(() => writeHandoff(body));
}

export function armGuideVisit() {
  if (typeof caches === 'undefined') return Promise.resolve(false);
  return settle(() => writeHandoff(encodeGuideVisit()));
}

async function writeHandoff(body) {
  const cache = await caches.open(HANDOFF_CACHE);
  await cache.put(HANDOFF_PATH, new Response(body, { headers: { 'content-type': 'application/json' } }));
  return true;
}

export function clearHandoff() {
  if (typeof caches === 'undefined') return Promise.resolve();
  return settle(async () => {
    await caches.delete(HANDOFF_CACHE);
  });
}

function cleanMessage(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]+/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_MESSAGE);
}

function hasPersonalData(value) {
  return EMAIL.test(value) || PHONE.test(value);
}
