import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, copyFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = join(__dirname, "../public/brand");

// Restore from original JPEG source if needed
const src = join(brandDir, "sthir-logo-source.jpg");

function isBg(r, g, b, threshold = 48) {
  return r <= threshold && g <= threshold && b <= threshold;
}

async function floodFillTransparent(inputPath) {
  const { data, info } = await sharp(inputPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
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
  const { data, info } = await image.clone().raw().toBuffer({ resolveWithObject: true });
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
await trimmed.clone().toFile(join(brandDir, "sthir-logo-full.png"));
await trimmed
  .clone()
  .extract({ left: 0, top: 0, width: meta.width, height: compactH })
  .toFile(join(brandDir, "sthir-logo-compact.png"));

const markSize = Math.min(meta.width, Math.floor(meta.height * 0.55));
const markLeft = Math.floor((meta.width - markSize) / 2);
await trimmed
  .clone()
  .extract({ left: markLeft, top: 0, width: markSize, height: Math.floor(meta.height * 0.55) })
  .toFile(join(brandDir, "sthir-logo-mark.png"));

await trimmed.clone().toFile(join(brandDir, "sthir-logo.png"));

// OG: 1200×630 social card (logo + tagline)
const ogW = 1200;
const ogH = 630;
const logoForOg = await trimmed.clone().resize(480, 480, { fit: "inside" }).png().toBuffer();
const logoMeta = await sharp(logoForOg).metadata();
const logoLeft = Math.floor((ogW - (logoMeta.width ?? 480)) / 2);
const logoTop = Math.floor((ogH - (logoMeta.height ?? 480)) / 2) - 50;

const ogTextSvg = Buffer.from(`<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#d4a017" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0c"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <text x="600" y="520" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="34" font-weight="700" fill="#e8b84a">Strength · Focus · Progress</text>
  <text x="600" y="565" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="#9ca3af">Coach-reviewed programs for India · sthir.in</text>
</svg>`);

async function writeOgImage(outPath) {
  await sharp(ogTextSvg)
    .composite([{ input: logoForOg, left: logoLeft, top: logoTop }])
    .png()
    .toFile(outPath);
}

await writeOgImage(join(brandDir, "sthir-og.png"));

// App icons from mark
const markBuf = await sharp(join(brandDir, "sthir-logo-mark.png")).resize(512).png().toBuffer();
const appDir = join(__dirname, "../src/app");
await sharp(markBuf).toFile(join(appDir, "icon.png"));
await sharp(markBuf).toFile(join(appDir, "apple-icon.png"));
await sharp(join(brandDir, "sthir-og.png")).toFile(join(appDir, "opengraph-image.png"));
await sharp(join(brandDir, "sthir-og.png")).toFile(join(appDir, "twitter-image.png"));

// Browsers still request /favicon.ico first — keep in sync with mark
await sharp(markBuf)
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(join(appDir, "favicon.ico"));

console.log("Done", meta.width, meta.height);
