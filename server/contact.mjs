import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { Buffer } from 'node:buffer';

const ALIASES = new Map([
  ['qa-team', 'qa'],
  ['qadiscuss', 'qa'],
  ['qateam', 'qa'],
  ['automation', 'other'],
]);

const TYPES = new Set(['project', 'ai', 'team', 'qa', 'cloud', 'payments', 'partnership', 'other', 'demo']);

const SUBJECTS = {
  fr: {
    project: 'Projet logiciel',
    ai: 'Intelligence artificielle',
    team: 'Équipe dédiée / nearshore',
    qa: 'QA / cybersécurité',
    cloud: 'Cloud / infrastructure',
    payments: 'Banque et paiements',
    partnership: 'Partenariat',
    other: 'Autre demande',
    demo: 'Démonstration COPHARIA',
  },
  en: {
    project: 'Software project',
    ai: 'Artificial intelligence',
    team: 'Dedicated team / nearshore',
    qa: 'QA / cybersecurity',
    cloud: 'Cloud / infrastructure',
    payments: 'Banking and payments',
    partnership: 'Partnership',
    other: 'Another request',
    demo: 'COPHARIA demonstration',
  },
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_POSTS = 5;
const MAX_ISSUES = 10;
const MAX_BODY = 20_000;
const MAX_MESSAGE = 4_000;
const TOKEN_TTL_MS = 30 * 60 * 1000;
const MAX_TOKENS = 2_000;
const MAX_HIT_KEYS = 5_000;
const DEFAULT_MIN_AGE_MS = 2_000;
const DEFAULT_TIMEOUT_MS = 8_000;
const hits = new Map();
const tokens = new Map();

function cleanLine(value, max) {
  const text = value.replace(/[\r\n]+/g, ' ').trim();
  if (text.length > max) return null;
  return text;
}

function cleanMessage(value, max) {
  const text = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (text.length > max) return null;
  return text;
}

function textField(value, max, { required = false, message = false } = {}) {
  if (value == null || value === '') return required ? null : '';
  if (typeof value !== 'string') return null;
  const text = message ? cleanMessage(value, max) : cleanLine(value, max);
  if (text == null) return null;
  if (required && text === '') return null;
  return text;
}

function emailOk(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function canonicalType(value) {
  if (typeof value !== 'string') return '';
  const token = value.trim();
  if (token.length > 40) return '';
  const aliased = ALIASES.get(token.toLowerCase()) || token;
  return TYPES.has(aliased) ? aliased : '';
}

function isIpv4(text) {
  const parts = text.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255 && String(Number(part)) === String(Number(part)));
}

function ipv4ToInt(ip) {
  if (!isIpv4(ip)) return null;
  const parts = ip.split('.').map(Number);
  return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

function inCidr(ip, cidr) {
  const [base, bitsText] = String(cidr).split('/');
  const bits = Number(bitsText);
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  if (ipInt == null || baseInt == null || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

export function normalizeIp(value) {
  if (value == null) return '';
  const raw = String(value).trim();
  if (!raw || raw.includes(',')) return '';
  let text = raw.replace(/^\[|\]$/g, '');
  const zone = text.indexOf('%');
  if (zone !== -1) text = text.slice(0, zone);
  if (text.toLowerCase().startsWith('::ffff:')) {
    const mapped = text.slice(7);
    if (isIpv4(mapped)) return mapped;
  }
  if (isIpv4(text)) return text;
  if (text.includes(':') && /^[0-9a-f:]+$/i.test(text)) return text.toLowerCase();
  return '';
}

function isLoopback(ip) {
  return ip === '127.0.0.1' || ip === '::1';
}

function trustList(env) {
  return String(env?.CONTACT_TRUST_PROXY || '')
    .split(',')
    .map((item) => normalizeIp(item))
    .filter(Boolean);
}

function trustCidrs(env) {
  return String(env?.CONTACT_TRUST_CIDRS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isTrustedPeer(ip, env) {
  if (!ip) return false;
  if (isLoopback(ip)) return true;
  if (trustList(env).includes(ip)) return true;
  return trustCidrs(env).some((cidr) => inCidr(ip, cidr));
}

// X-Forwarded-For is never read. A trusted peer may supply one client address in X-Real-IP.
// A trusted reverse proxy without that address does not fall back to its own IP, so visitors
// are not collapsed into a single quota. An untrusted peer cannot spoof the client address.
export function resolveClientIp(peer, realIp, env) {
  const remote = normalizeIp(peer);
  if (!isTrustedPeer(remote, env)) return remote;
  if (isLoopback(remote)) return normalizeIp(realIp) || remote;
  return normalizeIp(realIp);
}

function pruneHits(now) {
  if (hits.size < MAX_HIT_KEYS) return;
  for (const [key, times] of hits) {
    const recent = times.filter((time) => now - time < WINDOW_MS);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
  if (hits.size > MAX_HIT_KEYS) {
    const overflow = hits.size - MAX_HIT_KEYS;
    const keys = hits.keys();
    for (let i = 0; i < overflow; i += 1) {
      const next = keys.next();
      if (next.done) break;
      hits.delete(next.value);
    }
  }
}

function limited(key, now, max) {
  pruneHits(now);
  const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function minAgeMs(deps) {
  if (typeof deps.minAgeMs === 'number' && deps.minAgeMs >= 0) return deps.minAgeMs;
  const fromEnv = Number(deps.env?.CONTACT_MIN_AGE_MS);
  if (Number.isFinite(fromEnv) && fromEnv >= 0 && String(deps.env?.CONTACT_MIN_AGE_MS ?? '') !== '') return fromEnv;
  return DEFAULT_MIN_AGE_MS;
}

function pruneTokens(now) {
  for (const [key, row] of tokens) {
    if (now - row.issued > TOKEN_TTL_MS) tokens.delete(key);
  }
  if (tokens.size > MAX_TOKENS) {
    const overflow = tokens.size - MAX_TOKENS;
    const keys = tokens.keys();
    for (let i = 0; i < overflow; i += 1) {
      const next = keys.next();
      if (next.done) break;
      tokens.delete(next.value);
    }
  }
}

function issueToken(ip, now) {
  pruneTokens(now);
  if (tokens.size >= MAX_TOKENS) return null;
  const token = randomBytes(16).toString('hex');
  tokens.set(token, { issued: now, ip });
  return token;
}

function takeToken(token, ip, now, minAge) {
  if (!token) return 'missing';
  const row = tokens.get(token);
  if (!row || row.ip !== ip) return 'missing';
  const age = now - row.issued;
  if (age > TOKEN_TTL_MS) {
    tokens.delete(token);
    return 'missing';
  }
  if (age < minAge) return 'early';
  tokens.delete(token);
  return 'ok';
}

export function resetContactLimits() {
  hits.clear();
  tokens.clear();
}

export function sendReady(env = {}) {
  return env.CONTACT_SEND_ENABLED === 'true'
    && typeof env.BREVO_API_KEY === 'string'
    && env.BREVO_API_KEY.length > 0
    && typeof env.CONTACT_FROM === 'string'
    && emailOk(env.CONTACT_FROM)
    && typeof env.CONTACT_TO === 'string'
    && emailOk(env.CONTACT_TO);
}

function originAllowed(request, env) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  const configured = String(env.CONTACT_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const expected = configured.length > 0 ? configured : [new URL(request.url).origin];
  if (!expected.includes(parsed.origin)) return false;
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return false;
  return true;
}

export async function readLimitedJson(request, max = MAX_BODY) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declared) && declared > max) {
    const error = new Error('size');
    error.code = 'size';
    throw error;
  }
  if (!request.body) return {};
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => {});
      const error = new Error('size');
      error.code = 'size';
      throw error;
    }
    chunks.push(value);
  }
  if (total === 0) return {};
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    const error = new Error('json');
    error.code = 'json';
    throw error;
  }
}

function subjectFor(type, locale) {
  const language = locale === 'en' ? 'en' : 'fr';
  return SUBJECTS[language][type];
}

async function dispatch(request, deps) {
  const env = deps.env || {};
  const fetchImpl = deps.fetchImpl;
  const now = deps.now ?? Date.now();
  const ip = deps.ip || '';

  if (request.method === 'GET') {
    if (!ip || !sendReady(env)) return json(200, { ok: true, available: false });
    if (limited(`get:${ip}`, now, MAX_ISSUES)) return json(429, { ok: false, error: 'rate' });
    const token = issueToken(ip, now);
    if (!token) return json(200, { ok: true, available: false });
    return json(200, { ok: true, available: true, token });
  }
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' });
  if (!ip) return json(400, { ok: false, error: 'identity' });

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) return json(415, { ok: false, error: 'type' });
  if (!originAllowed(request, env)) return json(403, { ok: false, error: 'origin' });

  let body;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    if (error?.code === 'size') return json(413, { ok: false, error: 'size' });
    return json(400, { ok: false, error: 'json' });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400, { ok: false, error: 'json' });

  if (limited(`post:${ip}`, now, MAX_POSTS)) return json(429, { ok: false, error: 'rate' });

  const honeypot = body.website ?? body.company_website;
  if (typeof honeypot === 'string' ? honeypot.trim() !== '' : honeypot != null && honeypot !== '') {
    return json(200, { ok: true });
  }

  const name = textField(body.name, 120, { required: true });
  const email = textField(body.email, 160, { required: true });
  const company = textField(body.company, 160);
  const type = canonicalType(body.type);
  const productText = textField(body.product, 40);
  const demo = type === 'demo';
  const message = textField(body.message, MAX_MESSAGE, { required: !demo, message: true });
  const locale = body.locale == null || body.locale === '' ? 'fr' : body.locale;
  if (!name || name.length < 2 || !email || !emailOk(email) || company == null || !type || message == null) {
    return json(400, { ok: false, error: 'invalid' });
  }
  if (!demo && message.length < 20) return json(400, { ok: false, error: 'invalid' });
  if (productText == null) return json(400, { ok: false, error: 'invalid' });
  if (productText && productText !== 'copharia') return json(400, { ok: false, error: 'invalid' });
  if (productText === 'copharia' && !demo) return json(400, { ok: false, error: 'invalid' });
  if (demo && productText !== 'copharia') return json(400, { ok: false, error: 'invalid' });
  if (locale !== 'fr' && locale !== 'en') return json(400, { ok: false, error: 'invalid' });
  if (!sendReady(env)) return json(503, { ok: false, error: 'unavailable' });

  const token = textField(body.token, 80, { required: true });
  if (token == null) return json(400, { ok: false, error: 'invalid' });
  const state = takeToken(token, ip, now, minAgeMs(deps));
  if (state === 'early') return json(400, { ok: false, error: 'early' });
  if (state !== 'ok') return json(400, { ok: false, error: 'invalid' });

  const timeoutMs = deps.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const payload = {
    sender: { email: env.CONTACT_FROM, name: 'Coconsult' },
    to: [{ email: env.CONTACT_TO }],
    replyTo: { email, name },
    subject: `Coconsult — ${subjectFor(type, locale)}`,
    textContent: [
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Entreprise : ${company || '—'}`,
      `Demande : ${subjectFor(type, locale)}`,
      `Produit : ${productText || '—'}`,
      '',
      message || '—',
    ].join('\n'),
  };
  let response;
  let timer;
  const pending = Promise.resolve().then(() => fetchImpl('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  }));
  try {
    response = await Promise.race([
      pending,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error('timeout');
          error.name = 'TimeoutError';
          reject(error);
        }, timeoutMs);
      }),
    ]);
  } catch (error) {
    const nameOfError = error?.name;
    if (nameOfError === 'TimeoutError' || nameOfError === 'AbortError') {
      return json(504, { ok: false, error: 'uncertain' });
    }
    return json(502, { ok: false, error: 'provider' });
  } finally {
    clearTimeout(timer);
    pending.catch(() => {});
  }
  if (!response?.ok) {
    await response?.body?.cancel?.().catch(() => {});
    return json(502, { ok: false, error: 'provider' });
  }
  await response.body?.cancel?.().catch(() => {});
  return json(200, { ok: true, accepted: true });
}

export async function handleContact(request, deps) {
  try {
    return await dispatch(request, deps || {});
  } catch {
    return json(500, { ok: false, error: 'server' });
  }
}

export function handleHealth() {
  return json(200, { ok: true });
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function readIncoming(req, max) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      fn(value);
    };
    req.on('data', (chunk) => {
      if (settled) return;
      total += chunk.length;
      if (total > max) {
        const error = new Error('size');
        error.code = 'size';
        req.destroy();
        finish(reject, error);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => finish(resolve, Buffer.concat(chunks)));
    req.on('error', (error) => finish(reject, error));
    req.on('aborted', () => {
      const error = new Error('aborted');
      error.code = 'aborted';
      finish(reject, error);
    });
  });
}

function send(res, status, body) {
  if (res.headersSent || res.destroyed) return;
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function headerValue(req, name) {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

async function handleNode(req, res, deps) {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/healthz') {
    const response = handleHealth();
    const buffer = Buffer.from(await response.arrayBuffer());
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(buffer);
    return;
  }
  if (url.pathname !== '/api/contact') {
    send(res, 404, { ok: false, error: 'not-found' });
    return;
  }
  const declared = Number(req.headers['content-length'] || 0);
  if (req.method !== 'GET' && req.method !== 'HEAD' && Number.isFinite(declared) && declared > MAX_BODY) {
    send(res, 413, { ok: false, error: 'size' });
    req.resume();
    return;
  }
  let raw = Buffer.alloc(0);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      raw = await readIncoming(req, MAX_BODY);
    } catch (error) {
      if (error?.code === 'size') {
        send(res, 413, { ok: false, error: 'size' });
        return;
      }
      if (!res.headersSent) send(res, 400, { ok: false, error: 'json' });
      return;
    }
  }
  const headers = new Headers();
  for (const name of ['content-type', 'origin', 'sec-fetch-site']) {
    const value = headerValue(req, name);
    if (value) headers.set(name, String(value));
  }
  if (raw.length && !req.headers['content-length']) headers.set('content-length', String(raw.length));
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const request = new Request('http://127.0.0.1/api/contact', {
    method: req.method,
    headers,
    body: hasBody ? raw : undefined,
  });
  const response = await handleContact(request, {
    env: deps.env,
    fetchImpl: deps.fetchImpl,
    ip: resolveClientIp(req.socket.remoteAddress, headerValue(req, 'x-real-ip'), deps.env),
    now: deps.now,
    minAgeMs: deps.minAgeMs,
    timeoutMs: deps.timeoutMs,
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(buffer);
}

export function createContactServer(deps) {
  const httpServer = createServer((req, res) => {
    req.setTimeout(8_000, () => {
      req.destroy();
    });
    handleNode(req, res, deps).catch(() => {
      if (!res.headersSent) send(res, 500, { ok: false, error: 'server' });
      else res.destroy();
    });
  });
  httpServer.requestTimeout = 12_000;
  httpServer.headersTimeout = 5_000;
  httpServer.on('clientError', (_error, socket) => {
    if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
  });
  return httpServer;
}

const { pathToFileURL } = await import('node:url');
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  const port = Number(process.env.CONTACT_PORT || 3602);
  const host = process.env.CONTACT_BIND || '127.0.0.1';
  createContactServer({ env: process.env, fetchImpl: fetch }).listen(port, host);
}
