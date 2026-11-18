import sharp from 'sharp';
import path from 'node:path';

const draft =
  'C:/Users/srace/.cursor/projects/d-workspace-coconsult-website/assets/coconsult-panorama-draft.jpg';
const logo = 'd:/workspace/coconsult-website/public/assets/brand/coconsult-logo.png';
const outDir = 'd:/workspace/coconsult-website/public/assets/brand';
const outPersonal = path.join(outDir, 'linkedin-banner-personal.png');
const outCompany = path.join(outDir, 'linkedin-banner-company.png');

const W = 1584;
const H = 396;

const meta = await sharp(draft).metadata();
const srcW = meta.width;
const srcH = meta.height;
const targetRatio = W / H;
let cropW = srcW;
let cropH = Math.round(srcW / targetRatio);
if (cropH > srcH) {
  cropH = srcH;
  cropW = Math.round(srcH * targetRatio);
}
const left = Math.max(0, Math.round((srcW - cropW) * 0.4));
const top = Math.max(0, Math.round((srcH - cropH) * 0.34));

const base = await sharp(draft)
  .extract({
    left,
    top,
    width: Math.min(cropW, srcW - left),
    height: Math.min(cropH, srcH - top),
  })
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.93, saturation: 1.06 })
  .png()
  .toBuffer();

const logoBuf = await sharp(logo).resize({ width: 268, withoutEnlargement: true }).png().toBuffer();
const logoMeta = await sharp(logoBuf).metadata();

const years = ['2026', '2027', '2028', '2029', '2030'];
const yearPills = years
  .map((y, i) => {
    const x = 24 + i * 72;
    return `<g>
      <rect x="${x}" y="0" width="66" height="26" rx="7" fill="rgba(142,243,255,0.1)" stroke="rgba(142,243,255,0.34)"/>
      <text x="${x + 33}" y="18" text-anchor="middle" fill="#eef5fa" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600">${y}</text>
    </g>`;
  })
  .join('');

const overlaySvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#07111c" stop-opacity="0.78"/>
      <stop offset="28%" stop-color="#07111c" stop-opacity="0.42"/>
      <stop offset="58%" stop-color="#07111c" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#07111c" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1c2c" stop-opacity="0.94"/>
      <stop offset="100%" stop-color="#07111c" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#026d7b"/>
      <stop offset="55%" stop-color="#8ef3ff"/>
      <stop offset="100%" stop-color="#ff701b"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#veil)"/>

  <!-- Mid copy -->
  <text x="320" y="118" fill="#f3f7fb" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700">Ingénierie logicielle · IA &amp; Data · Cloud &amp; DevOps</text>
  <text x="320" y="156" fill="#d7e4ee" font-family="Segoe UI, Arial, sans-serif" font-size="18">Paris, France  ·  Collaboration Nearshore à Sfax</text>

  <rect x="320" y="176" width="236" height="34" rx="17" fill="rgba(142,243,255,0.1)" stroke="rgba(142,243,255,0.32)"/>
  <text x="438" y="198" text-anchor="middle" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="600">coconsult.fr</text>

  <!-- CII hero card -->
  <rect x="1048" y="42" width="492" height="312" rx="22" fill="url(#card)" stroke="rgba(142,243,255,0.34)"/>
  <rect x="1048" y="42" width="492" height="5" rx="2.5" fill="url(#bar)"/>

  <text x="1076" y="86" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="0.16em">AGRÉMENT CII</text>
  <text x="1076" y="136" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700">Titulaire de l'agrément</text>
  <text x="1076" y="170" fill="#d8fbff" font-family="Segoe UI, Arial, sans-serif" font-size="20">Crédit d'impôt innovation · 2026–2030</text>

  <text x="1076" y="214" fill="#c5d2e0" font-family="Segoe UI, Arial, sans-serif" font-size="16">n° 28910108 · DRIEETS Île-de-France</text>
  <text x="1076" y="240" fill="#c5d2e0" font-family="Segoe UI, Arial, sans-serif" font-size="15">Décision du 4 février 2026</text>

  <g transform="translate(1076, 262)">${yearPills}</g>

  <text x="1076" y="328" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="14">Capacité d'innovation reconnue par l'administration</text>
</svg>`);

await sharp(base)
  .composite([
    { input: overlaySvg, left: 0, top: 0 },
    { input: logoBuf, left: 36, top: 28 },
  ])
  .png()
  .toFile(outPersonal);

const companyW = 1128;
const companyH = 191;
const companyLogo = await sharp(logo).resize({ width: 210, withoutEnlargement: true }).png().toBuffer();
const companyLogoMeta = await sharp(companyLogo).metadata();
const companyBase = await sharp(draft)
  .resize(companyW, companyH, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.9, saturation: 1.06 })
  .png()
  .toBuffer();

const companySvg = Buffer.from(`<svg width="${companyW}" height="${companyH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#07111c" stop-opacity="0.78"/>
      <stop offset="40%" stop-color="#07111c" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#07111c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#026d7b"/>
      <stop offset="60%" stop-color="#8ef3ff"/>
      <stop offset="100%" stop-color="#ff701b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect x="470" y="28" width="620" height="135" rx="18" fill="rgba(7,17,28,0.9)" stroke="rgba(142,243,255,0.34)"/>
  <rect x="470" y="28" width="620" height="4" fill="url(#b)"/>
  <text x="494" y="66" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="0.14em">AGRÉMENT CII</text>
  <text x="494" y="104" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700">Titulaire de l'agrément · 2026–2030</text>
  <text x="494" y="136" fill="#d7e4ee" font-family="Segoe UI, Arial, sans-serif" font-size="15">n° 28910108 · DRIEETS Île-de-France · 4 fév. 2026 · coconsult.fr</text>
</svg>`);

await sharp(companyBase)
  .composite([
    { input: companySvg, left: 0, top: 0 },
    { input: companyLogo, left: 28, top: Math.round((companyH - companyLogoMeta.height) / 2) },
  ])
  .png()
  .toFile(outCompany);

console.log(
  JSON.stringify(
    {
      personal: outPersonal,
      company: outCompany,
      note: 'No ISO claim (not on website). CII details match company.ts',
    },
    null,
    2,
  ),
);
