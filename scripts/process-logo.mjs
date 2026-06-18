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

// OG: 1200×630 dark social card (matches site .dark + hero-glow)
const ogW = 1200;
const ogH = 630;
const logoForOg = await trimmed
  .clone()
  .resize(360, 360, { fit: 'inside' })
  .png()
  .toBuffer();
const logoMeta = await sharp(logoForOg).metadata();
const logoW = logoMeta.width ?? 360;
const logoH = logoMeta.height ?? 360;
const cardW = logoW + 96;
const cardH = logoH + 72;
const cardLeft = Math.floor((ogW - cardW) / 2);
const cardTop = Math.floor((ogH - cardH) / 2) - 36;
const logoLeft = cardLeft + Math.floor((cardW - logoW) / 2);
const logoTop = cardTop + 24;

const ogTextSvg = Buffer.from(`<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="heroTop" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#d4a017" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#d4a017" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="heroRight" cx="92%" cy="18%" r="45%">
      <stop offset="0%" stop-color="#d4a017" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#d4a017" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="heroLeft" cx="8%" cy="62%" r="38%">
      <stop offset="0%" stop-color="#d4a017" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#d4a017" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="topLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d4a017" stop-opacity="0"/>
      <stop offset="50%" stop-color="#e8b84a" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#d4a017" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#121216"/>
  <rect width="100%" height="100%" fill="url(#heroTop)"/>
  <rect width="100%" height="100%" fill="url(#heroRight)"/>
  <rect width="100%" height="100%" fill="url(#heroLeft)"/>
  <rect x="0" y="0" width="${ogW}" height="2" fill="url(#topLine)"/>
  <rect x="${cardLeft}" y="${cardTop}" width="${cardW}" height="${cardH}" rx="28" fill="#1c1c22" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="${cardLeft + 28}" y="${cardTop + cardH + 28}" width="${cardW - 56}" height="34" rx="17" fill="#d4a017" fill-opacity="0.12" stroke="#d4a017" stroke-opacity="0.35"/>
  <text x="${ogW / 2}" y="${cardTop + cardH + 51}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="600" letter-spacing="0.12em" fill="#e8b84a">FOUNDING COHORT · 4 WEEKS</text>
  <text x="${ogW / 2}" y="${cardTop + cardH + 98}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="34" font-weight="700" fill="#f5f5f5">Strength · Training · Human-In · Reviewed</text>
  <text x="${ogW / 2}" y="${cardTop + cardH + 138}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="#9ca3af">Coach-reviewed Excel blocks for India · sthir.in</text>
</svg>`);

async function writeOgImage(outPath) {
  await sharp(ogTextSvg)
    .composite([{ input: logoForOg, left: logoLeft, top: logoTop }])
    .png()
    .toFile(outPath);
}

await writeOgImage(join(brandDir, 'sthir-og.png'));

// App icons from mark
const markBuf = await sharp(join(brandDir, 'sthir-logo-mark.png'))
  .resize(512)
  .png()
  .toBuffer();
const appDir = join(__dirname, '../src/app');
await sharp(markBuf).toFile(join(appDir, 'icon.png'));
await sharp(markBuf).toFile(join(appDir, 'apple-icon.png'));
await sharp(join(brandDir, 'sthir-og.png')).toFile(
  join(appDir, 'opengraph-image.png'),
);
await sharp(join(brandDir, 'sthir-og.png')).toFile(
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
