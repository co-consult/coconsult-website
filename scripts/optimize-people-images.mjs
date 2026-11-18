import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'assets', 'people');
const widths = [480, 768];
const files = fs.readdirSync(dir).filter((name) => /\.jpe?g$/i.test(name) && !/-\d+w\./.test(name));

for (const name of files) {
  const input = path.join(dir, name);
  const base = name.replace(/\.(jpe?g)$/i, '');
  const fullWebp = path.join(dir, `${base}.webp`);
  await sharp(input).webp({ quality: 72 }).toFile(fullWebp);
  for (const width of widths) {
    const jpgOut = path.join(dir, `${base}-${width}w.jpg`);
    const webpOut = path.join(dir, `${base}-${width}w.webp`);
    await sharp(input).resize({ width, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(jpgOut);
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(webpOut);
  }
  console.log(`optimized ${name}`);
}
