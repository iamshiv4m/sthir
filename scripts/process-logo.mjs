import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = join(__dirname, '../public/brand');

// Restore from original JPEG source if needed
const src = join(brandDir, 'sthir-logo-source.jpg');

function isBg(r, g, b, threshold = 48) {
  return r <= threshold && g <= threshold && b <= threshold;
}

async function floodFillTransparent(inputPath) {
  const { data, info } = await sharp(inputPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.from(data);
  const alpha = new Uint8Array(width * height).fill(255);
  const visited = new Uint8Array(width * height);
  const queue = [];

  const idx = (x, y) => y * width + x;

  // seed from edges
  for (let x = 0; x < width; x++) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y], [width - 1, y]);
  }

  while (queue.length) {
    const [x, y] = queue.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const i = idx(x, y);
    if (visited[i]) continue;
    visited[i] = 1;
    const o = i * 3;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    if (!isBg(r, g, b)) continue;
    alpha[i] = 0;
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * 3;
    const d = i * 4;
    rgba[d] = out[s];
    rgba[d + 1] = out[s + 1];
    rgba[d + 2] = out[s + 2];
    rgba[d + 3] = alpha[i];
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } }).png();
}

async function trim(image) {
  const { data, info } = await image
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 20) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const pad = 8;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const width = Math.min(info.width - left, maxX - minX + 1 + pad * 2);
  const height = Math.min(info.height - top, maxY - minY + 1 + pad * 2);
  return image.extract({ left, top, width, height });
}

// Use source file
const input = src;
const base = await floodFillTransparent(input);
const trimmed = await trim(base);
const meta = await trimmed.metadata();

const compactH = Math.floor(meta.height * 0.72);
await trimmed.clone().toFile(join(brandDir, 'sthir-logo-full.png'));
await trimmed
  .clone()
  .extract({ left: 0, top: 0, width: meta.width, height: compactH })
  .toFile(join(brandDir, 'sthir-logo-compact.png'));

const markSize = Math.min(meta.width, Math.floor(meta.height * 0.55));
const markLeft = Math.floor((meta.width - markSize) / 2);
await trimmed
  .clone()
  .extract({
    left: markLeft,
    top: 0,
    width: markSize,
    height: Math.floor(meta.height * 0.55),
  })
  .toFile(join(brandDir, 'sthir-logo-mark.png'));

await trimmed.clone().toFile(join(brandDir, 'sthir-logo.png'));

// OG: 1200×630 — WhatsApp-safe centered layout, full-bleed dark
const ogW = 1200;
const ogH = 630;
const markForOg = await sharp(join(brandDir, 'sthir-logo-mark.png'))
  .resize(300, 300, { fit: 'inside' })
  .png()
  .toBuffer();
const markMeta = await sharp(markForOg).metadata();
const markW = markMeta.width ?? 300;
const markH = markMeta.height ?? 300;
const ogMarkLeft = Math.floor((ogW - markW) / 2);
const markTop = 72;

const ogTextSvg = Buffer.from(`<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="85%">
      <stop offset="0%" stop-color="#e8b84a" stop-opacity="0.28"/>
      <stop offset="45%" stop-color="#d4a017" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0c0c10" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b8860b"/>
      <stop offset="50%" stop-color="#f0d060"/>
      <stop offset="100%" stop-color="#b8860b"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d4d4d8"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0c0c10"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect x="0" y="0" width="${ogW}" height="3" fill="url(#gold)" opacity="0.7"/>
  <text x="${ogW / 2}" y="${markTop + markH + 62}" text-anchor="middle" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif" font-size="72" font-weight="800" font-style="italic" letter-spacing="0.06em" fill="url(#titleGrad)">STHIR</text>
  <line x1="${ogW / 2 - 120}" y1="${markTop + markH + 82}" x2="${ogW / 2 + 120}" y2="${markTop + markH + 82}" stroke="#e8b84a" stroke-width="2" opacity="0.6"/>
  <text x="${ogW / 2}" y="${markTop + markH + 118}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="26" font-weight="600" fill="#e8b84a">Strength · Training · Human-In · Reviewed</text>
  <rect x="${ogW / 2 - 210}" y="${markTop + markH + 140}" width="420" height="44" rx="22" fill="#e8b84a" fill-opacity="0.14" stroke="#e8b84a" stroke-opacity="0.45"/>
  <text x="${ogW / 2}" y="${markTop + markH + 169}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="700" letter-spacing="0.08em" fill="#f0d060">FREE 4-WEEK BLOCK · 20 SPOTS</text>
  <text x="${ogW / 2}" y="${ogH - 36}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="20" fill="#71717a">Coach-reviewed Excel programs · sthir.in</text>
</svg>`);

async function writeOgImage(outPath, format = 'png') {
  const pipeline = sharp(ogTextSvg).composite([
    { input: markForOg, left: ogMarkLeft, top: markTop },
  ]);
  if (format === 'jpeg') {
    await pipeline.jpeg({ quality: 92, mozjpeg: true }).toFile(outPath);
  } else {
    await pipeline.png().toFile(outPath);
  }
}

const publicDir = join(__dirname, '../public');
await writeOgImage(join(brandDir, 'sthir-og.png'), 'png');
await writeOgImage(join(publicDir, 'og-share.jpg'), 'jpeg');
await writeOgImage(join(publicDir, 'og-share.png'), 'png');

// App icons from mark — dark background so WhatsApp fallback isn't white
const iconBg = { r: 18, g: 18, b: 22, alpha: 1 };
const markBuf = await sharp(join(brandDir, 'sthir-logo-mark.png'))
  .resize(420, 420, {
    fit: 'contain',
    background: iconBg,
  })
  .extend({
    top: 46,
    bottom: 46,
    left: 46,
    right: 46,
    background: iconBg,
  })
  .png()
  .toBuffer();
const appDir = join(__dirname, '../src/app');
await sharp(markBuf).toFile(join(appDir, 'icon.png'));
await sharp(markBuf).toFile(join(appDir, 'apple-icon.png'));
await sharp(join(publicDir, 'og-share.png')).toFile(
  join(appDir, 'opengraph-image.png'),
);
await sharp(join(publicDir, 'og-share.png')).toFile(
  join(appDir, 'twitter-image.png'),
);

// Browsers still request /favicon.ico first — keep in sync with mark
await sharp(markBuf)
  .resize(32, 32, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toFile(join(appDir, 'favicon.ico'));

console.log('Done', meta.width, meta.height);
