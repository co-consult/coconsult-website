import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
const zoom = await page.evaluate(() => {
  document.documentElement.style.zoom = '2';
  const doc = document.documentElement;
  const limit = doc.clientWidth;
  const scrollers = [];
  for (const el of [doc, document.body, ...document.querySelectorAll('body *')]) {
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 20) {
      scrollers.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 60),
        scroll: el.scrollWidth,
        client: el.clientWidth,
        delta: el.scrollWidth - el.clientWidth,
      });
    }
  }
  scrollers.sort((a, b) => b.delta - a.delta);
  const margins = [];
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const right = rect.right + parseFloat(style.marginRight || '0');
    const left = rect.left - parseFloat(style.marginLeft || '0');
    if (right > limit + 1 || left < -1) {
      margins.push({ cls: String(el.className).slice(0, 60), right: Math.round(right), left: Math.round(left) });
    }
  }
  const sections = [...document.querySelectorAll('body > *')].map((el) => el.tagName + '.' + String(el.className).slice(0, 40));
  return {
    html: { scroll: doc.scrollWidth, client: doc.clientWidth },
    body: { scroll: document.body.scrollWidth, client: document.body.clientWidth },
    scrollers: scrollers.slice(0, 15),
    margins: margins.slice(0, 15),
    sections,
  };
});
console.log(JSON.stringify(zoom, null, 2));
await browser.close();
