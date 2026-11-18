import sharp from 'sharp';
import path from 'node:path';

const draft =
  'C:/Users/srace/.cursor/projects/d-workspace-coconsult-website/assets/coconsult-panorama-draft.jpg';
const logo = 'd:/workspace/coconsult-website/public/assets/brand/coconsult-logo.png';
const outDir = 'd:/workspace/coconsult-website/public/assets/brand';

const outWide = path.join(outDir, 'coconsult-panorama.png');
const outLinkedIn = path.join(outDir, 'linkedin-banner-personal.png');
const outCompany = path.join(outDir, 'linkedin-banner-company.png');

// True-ish panorama export 3:1
const PW = 3000;
const PH = 1000;

const baseWide = await sharp(draft)
  .resize(PW, PH, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.95, saturation: 1.05 })
  .png()
  .toBuffer();

const logoWide = await sharp(logo).resize({ width: 420, withoutEnlargement: true }).png().toBuffer();
const logoWideMeta = await sharp(logoWide).metadata();

const years = ['2026', '2027', '2028', '2029', '2030'];
const yearPills = years
  .map((y, i) => {
    const x = 28 + i * 86;
    return `<g>
      <rect x="${x}" y="0" width="78" height="30" rx="8" fill="rgba(142,243,255,0.1)" stroke="rgba(142,243,255,0.34)"/>
      <text x="${x + 39}" y="20" text-anchor="middle" fill="#eef5fa" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="600">${y}</text>
    </g>`;
  })
  .join('');

const wideSvg = Buffer.from(`<svg width="${PW}" height="${PH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#07111c" stop-opacity="0.72"/>
      <stop offset="30%" stop-color="#07111c" stop-opacity="0.35"/>
      <stop offset="62%" stop-color="#07111c" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#07111c" stop-opacity="0.28"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1c2c" stop-opacity="0.93"/>
      <stop offset="100%" stop-color="#07111c" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#026d7b"/>
      <stop offset="55%" stop-color="#8ef3ff"/>
      <stop offset="100%" stop-color="#ff701b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#veil)"/>

  <text x="520" y="250" fill="#f3f7fb" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="700">Ingénierie logicielle · IA &amp; Data · Cloud &amp; DevOps</text>
  <text x="520" y="310" fill="#d7e4ee" font-family="Segoe UI, Arial, sans-serif" font-size="28">Paris, France  ·  Collaboration Nearshore à Sfax</text>
  <rect x="520" y="340" width="280" height="42" rx="21" fill="rgba(142,243,255,0.1)" stroke="rgba(142,243,255,0.32)"/>
  <text x="660" y="368" text-anchor="middle" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600">coconsult.fr</text>

  <rect x="2140" y="160" width="760" height="680" rx="28" fill="url(#card)" stroke="rgba(142,243,255,0.34)"/>
  <rect x="2140" y="160" width="760" height="6" rx="3" fill="url(#bar)"/>
  <text x="2188" y="240" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="0.16em">AGRÉMENT CII</text>
  <text x="2188" y="330" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="48" font-weight="700">Titulaire de l'agrément</text>
  <text x="2188" y="390" fill="#d8fbff" font-family="Segoe UI, Arial, sans-serif" font-size="28">Crédit d'impôt innovation · 2026–2030</text>
  <text x="2188" y="470" fill="#c5d2e0" font-family="Segoe UI, Arial, sans-serif" font-size="22">n° 28910108 · DRIEETS Île-de-France</text>
  <text x="2188" y="520" fill="#c5d2e0" font-family="Segoe UI, Arial, sans-serif" font-size="20">Décision du 4 février 2026</text>
  <g transform="translate(2188, 560)">${yearPills}</g>
  <text x="2188" y="680" fill="#8ef3ff" font-family="Segoe UI, Arial, sans-serif" font-size="20">Capacité d'innovation reconnue par l'administration</text>
</svg>`);

await sharp(baseWide)
  .composite([
    { input: wideSvg, left: 0, top: 0 },
    { input: logoWide, left: 64, top: 72 },
  ])
  .png()
  .toFile(outWide);

// LinkedIn crops from the panorama
const linkedInBase = await sharp(outWide)
  .resize(1584, 396, { fit: 'cover', position: 'centre' })
  .png()
  .toFile(outLinkedIn);

const companyBase = await sharp(outWide)
  .extract({ left: 0, top: 220, width: 3000, height: 560 })
  .resize(1128, 191, { fit: 'cover', position: 'left' })
  .png()
  .toFile(outCompany);

console.log(
  JSON.stringify(
    {
      panorama: { path: outWide, size: '3000x1000' },
      personal: outLinkedIn,
      company: outCompany,
      linkedInBase,
      companyBase,
    },
    null,
    2,
  ),
);
