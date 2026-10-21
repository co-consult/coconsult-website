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
const MAX_HITS = 5;
const hits = new Map();

function clean(value, max) {
  const text = String(value ?? '').replace(/\r|\n/g, ' ').trim();
  if (text.length > max) return null;
  return text;
}

function emailOk(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function limited(ip, now) {
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export function resetContactLimits() {
  hits.clear();
}

export async function handleContact(request, deps) {
  const env = deps.env;
  const fetchImpl = deps.fetchImpl;
  const now = deps.now ?? Date.now();
  const ip = deps.ip || 'local';

  if (request.method === 'GET') {
    return json(200, { ok: true, configured: Boolean(env.BREVO_API_KEY && env.CONTACT_FROM) });
  }
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' });

  const length = Number(request.headers.get('content-length') || 0);
  if (length > 20_000) return json(413, { ok: false, error: 'size' });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'json' });
  }
  if (body.website) return json(200, { ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const company = clean(body.company || '', 160);
  const type = clean(body.type, 40);
  const product = clean(body.product || '', 40);
  const message = clean(body.message, 4000);
  if (!name || name.length < 2 || !email || !emailOk(email) || company === null || !type || !TYPES.has(type) || !message || message.length < 20) {
    return json(400, { ok: false, error: 'invalid' });
  }
  if (product && !PRODUCTS.has(product)) return json(400, { ok: false, error: 'invalid' });
  if (limited(ip, now)) return json(429, { ok: false, error: 'rate' });
  if (!env.BREVO_API_KEY || !env.CONTACT_FROM) return json(503, { ok: false, error: 'unavailable' });

  const to = env.CONTACT_TO || 'contact@coconsult.fr';
  const response = await fetchImpl('https://api.brevo.com/v3/smtp/email', {
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
  });
  if (!response.ok) return json(502, { ok: false, error: 'provider' });
  return json(200, { ok: true });
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

const { pathToFileURL } = await import('node:url');
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  const { createServer } = await import('node:http');
  const port = Number(process.env.CONTACT_PORT || 3602);
  createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request('http://localhost/api/contact', {
      method: req.method,
      headers: req.headers,
      body: req.method === 'GET' ? undefined : Buffer.concat(chunks),
    });
    const response = await handleContact(request, {
      env: process.env,
      fetchImpl: fetch,
      ip: req.socket.remoteAddress || 'local',
    });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  }).listen(port, '127.0.0.1');
}
