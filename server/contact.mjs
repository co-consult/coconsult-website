import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';

const TYPES = new Set([
  'project',
  'team',
  'qa',
  'qa-team',
  'qaDiscuss',
  'qaTeam',
  'payments',
  'automation',
  'ai',
  'partnership',
  'demo',
]);
const PRODUCTS = new Set(['copharia']);
const WINDOW_MS = 10 * 60 * 1000;
const MAX_POSTS = 5;
const MAX_ISSUES = 10;
const MAX_BODY = 20_000;
const TOKEN_TTL_MS = 30 * 60 * 1000;
const MAX_TOKENS = 2_000;
const DEFAULT_MIN_AGE_MS = 2_000;
const DEFAULT_TIMEOUT_MS = 8_000;
const hits = new Map();
const tokens = new Map();

function clean(value, max) {
  const text = String(value ?? '').replace(/\r|\n/g, ' ').trim();
  if (text.length > max) return null;
  return text;
}

function emailOk(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function pruneHits(now) {
  if (hits.size < 5_000) return;
  for (const [key, times] of hits) {
    const recent = times.filter((time) => now - time < WINDOW_MS);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
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

function isIpv4(text) {
  const parts = text.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
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

export function resolveClientIp(peer, realIp, env) {
  const remote = normalizeIp(peer);
  const trusted = isLoopback(remote) || trustList(env).includes(remote);
  if (trusted) {
    const forwarded = normalizeIp(realIp);
    if (forwarded) return forwarded;
  }
  return remote || 'unknown';
}

function minAgeMs(deps) {
  if (typeof deps.minAgeMs === 'number' && deps.minAgeMs >= 0) return deps.minAgeMs;
  const fromEnv = Number(deps.env?.CONTACT_MIN_AGE_MS);
  if (Number.isFinite(fromEnv) && fromEnv >= 0 && String(deps.env.CONTACT_MIN_AGE_MS) !== '') return fromEnv;
  return DEFAULT_MIN_AGE_MS;
}

function pruneTokens(now) {
  for (const [key, row] of tokens) {
    if (now - row.issued > TOKEN_TTL_MS) tokens.delete(key);
  }
}

function issueToken(ip, now) {
  pruneTokens(now);
  if (tokens.size >= MAX_TOKENS) return null;
  const token = randomBytes(16).toString('hex');
  tokens.set(token, { issued: now, ip });
  return token;
}

function tokenState(token, ip, now, minAge) {
  const row = token ? tokens.get(token) : undefined;
  if (!row || row.ip !== ip) return 'missing';
  const age = now - row.issued;
  if (age > TOKEN_TTL_MS) {
    tokens.delete(token);
    return 'missing';
  }
  if (age < minAge) return 'early';
  return 'ok';
}

function consumeToken(token) {
  if (token) tokens.delete(token);
}

export function resetContactLimits() {
  hits.clear();
  tokens.clear();
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

async function dispatch(request, deps) {
  const env = deps.env || {};
  const fetchImpl = deps.fetchImpl;
  const now = deps.now ?? Date.now();
  const ip = deps.ip || 'local';

  if (request.method === 'GET') {
    const configured = Boolean(env.BREVO_API_KEY && env.CONTACT_FROM);
    if (!configured) return json(200, { ok: true, configured: false });
    if (limited(`get:${ip}`, now, MAX_ISSUES)) return json(429, { ok: false, error: 'rate' });
    const token = issueToken(ip, now);
    if (!token) return json(200, { ok: true, configured: false });
    return json(200, { ok: true, configured: true, token });
  }
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' });

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) return json(415, { ok: false, error: 'type' });

  let body;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    if (error?.code === 'size') return json(413, { ok: false, error: 'size' });
    return json(400, { ok: false, error: 'json' });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400, { ok: false, error: 'json' });

  if (limited(`post:${ip}`, now, MAX_POSTS)) return json(429, { ok: false, error: 'rate' });

  if (body.website) {
    consumeToken(clean(body.token, 80));
    return json(200, { ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const company = clean(body.company || '', 160);
  const type = clean(body.type, 40);
  const product = clean(body.product || '', 40);
  const message = clean(body.message, 4000);
  const token = clean(body.token, 80);
  if (!name || name.length < 2 || !email || !emailOk(email) || company === null || !type || !TYPES.has(type) || !message || message.length < 20) {
    return json(400, { ok: false, error: 'invalid' });
  }
  if (product && !PRODUCTS.has(product)) return json(400, { ok: false, error: 'invalid' });
  if (!env.BREVO_API_KEY || !env.CONTACT_FROM) return json(503, { ok: false, error: 'unavailable' });

  const state = tokenState(token, ip, now, minAgeMs(deps));
  if (state === 'early') return json(400, { ok: false, error: 'early' });
  if (state !== 'ok') return json(400, { ok: false, error: 'invalid' });
  consumeToken(token);

  const to = env.CONTACT_TO || 'contact@coconsult.fr';
  const timeoutMs = deps.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  let timer;
  const pending = Promise.resolve().then(() => fetchImpl('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: env.CONTACT_FROM, name: 'Coconsult' },
      to: [{ email: to }],
      replyTo: { email, name },
      subject: `Coconsult — ${type}${product ? ` — ${product}` : ''}`,
      textContent: `Nom : ${name}\nE-mail : ${email}\nEntreprise : ${company || '—'}\nType : ${type}\nProduit : ${product || '—'}\n\n${message}`,
    }),
    signal: controller.signal,
  }));
  const timed = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('timeout'));
    }, timeoutMs);
  });
  let response;
  try {
    response = await Promise.race([pending, timed]);
  } catch {
    return json(502, { ok: false, error: 'provider' });
  } finally {
    clearTimeout(timer);
    pending.catch(() => {});
  }
  if (!response.ok) {
    await response.body?.cancel?.().catch(() => {});
    return json(502, { ok: false, error: 'provider' });
  }
  await response.body?.cancel?.().catch(() => {});
  return json(200, { ok: true });
}

export async function handleContact(request, deps) {
  try {
    return await dispatch(request, deps || {});
  } catch {
    return json(500, { ok: false, error: 'server' });
  }
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
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
  });
}

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function handleNode(req, res, deps) {
  const declared = Number(req.headers['content-length'] || 0);
  if (req.method !== 'GET' && req.method !== 'HEAD' && Number.isFinite(declared) && declared > MAX_BODY) {
    send(res, 413, { ok: false, error: 'size' });
    req.destroy();
    return;
  }
  let raw = Buffer.alloc(0);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      raw = await readIncoming(req, MAX_BODY);
    } catch (error) {
      if (error?.code === 'size') {
        if (!res.headersSent) send(res, 413, { ok: false, error: 'size' });
        return;
      }
      throw error;
    }
  }
  const header = (name) => {
    const value = req.headers[name];
    return Array.isArray(value) ? value[0] : value;
  };
  const headers = new Headers();
  if (header('content-type')) headers.set('content-type', String(header('content-type')));
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const request = new Request('http://127.0.0.1/api/contact', {
    method: req.method,
    headers,
    body: hasBody ? raw : undefined,
  });
  const response = await handleContact(request, {
    env: deps.env,
    fetchImpl: deps.fetchImpl,
    ip: resolveClientIp(req.socket.remoteAddress, header('x-real-ip'), deps.env),
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
    handleNode(req, res, deps).catch(() => {
      if (!res.headersSent) send(res, 500, { ok: false, error: 'server' });
      else res.destroy();
    });
  });
  httpServer.requestTimeout = 10_000;
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
  createContactServer({ env: process.env, fetchImpl: fetch }).listen(port, '127.0.0.1');
}
