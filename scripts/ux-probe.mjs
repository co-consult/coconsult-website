import { chromium } from 'playwright';

const probe = `(() => {
  const parse = (c) => {
    const m = String(c).match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((v) => Number.parseFloat(v));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const comp = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  });
  const lum = (c) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const bgOf = (el) => {
    const layers = [];
    let n = el;
    while (n) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.01) layers.push(c);
      if (c && c.a >= 0.98) break;
      n = n.parentElement;
    }
    let out = { r: 7, g: 17, b: 28 };
    for (let i = layers.length - 1; i >= 0; i -= 1) out = comp(layers[i], out);
    return out;
  };
  const rows = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.replace(/\\s+/g, ' ').trim();
    if (text.length < 2) continue;
    const el = node.parentElement;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const fg0 = parse(cs.color);
    if (!fg0) continue;
    const bg = bgOf(el);
    const fg = comp(fg0, bg);
    rows.push({
      value: ratio(fg, bg),
      px: Number.parseFloat(cs.fontSize),
      weight: cs.fontWeight,
      family: cs.fontFamily.split(',')[0],
      text: text.slice(0, 48),
      tag: el.tagName,
      cls: String(el.className || '').slice(0, 42),
    });
  }
  rows.sort((a, b) => a.value - b.value);
  const small = {};
  for (const r of rows) {
    const k = Math.round(r.px);
    if (k <= 14) small[k] = (small[k] || 0) + 1;
  }
  const monos = rows.filter((r) => r.family.includes('Mono')).length;
  return { lowest: rows.slice(0, 10), small, count: rows.length, monos };
})()`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
for (const url of ['/', '/services/developpement/', '/contact/', '/secteurs/', '/mentions-legales/', '/services/qa-testing/']) {
  await page.goto('http://127.0.0.1:4321' + url, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  const data = await page.evaluate(probe);
  console.log('\n==', url, 'texts', data.count, 'mono', data.monos, 'small', JSON.stringify(data.small));
  for (const r of data.lowest) console.log(r.value.toFixed(2), r.px + 'px', r.weight, r.family, r.tag, r.cls, '|', r.text);
}

await page.goto('http://127.0.0.1:4321/');
await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
const zoom = await page.evaluate(() => {
  const view = document.documentElement.clientWidth;
  const found = [];
  for (const el of document.querySelectorAll('a, button, svg, img, section, div')) {
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.right < view + 4) continue;
    found.push({ tag: el.tagName, cls: String(el.className || '').slice(0, 60), right: Math.round(r.right), view });
    if (found.length >= 6) break;
  }
  return { view, scroll: document.documentElement.scrollWidth, found };
});
console.log('\nzoom', JSON.stringify(zoom, null, 2));

await page.evaluate(() => { document.documentElement.style.zoom = ''; });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4321/services/qa-testing/');
const faq = await page.evaluate(() => [...document.querySelectorAll('summary')].map((el) => {
  const r = el.getBoundingClientRect();
  const next = el.parentElement?.nextElementSibling?.querySelector('summary');
  const n = next?.getBoundingClientRect();
  return { h: Math.round(r.height), gap: n ? Math.round(n.top - r.bottom) : null, text: el.innerText.slice(0, 40) };
}));
console.log('faq', JSON.stringify(faq));
await browser.close();
