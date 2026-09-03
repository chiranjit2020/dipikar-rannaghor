// Rasterises the brand mark into the PWA icon set.
// Run: npm run gen:icons
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'public/favicon.svg');
const outDir = resolve(root, 'public/icons');

const BG = '#0b0b0f';

async function main() {
  await mkdir(outDir, { recursive: true });
  const svg = await readFile(src);

  const targets = [
    { file: 'icon-192.png', size: 192, pad: 0 },
    { file: 'icon-512.png', size: 512, pad: 0 },
    { file: 'apple-touch-icon.png', size: 180, pad: 0 },
    // Maskable needs ~20% safe padding so the glyph survives the mask.
    { file: 'icon-maskable-512.png', size: 512, pad: 0.16 },
  ];

  for (const t of targets) {
    const inner = Math.round(t.size * (1 - t.pad * 2));
    const glyph = await sharp(svg).resize(inner, inner, { fit: 'contain' }).png().toBuffer();
    await sharp({
      create: {
        width: t.size,
        height: t.size,
        channels: 4,
        background: BG,
      },
    })
      .composite([{ input: glyph, gravity: 'center' }])
      .png()
      .toFile(resolve(outDir, t.file));
    console.log('  wrote', `public/icons/${t.file}`, `${t.size}x${t.size}`);
  }

  // Tiny favicon fallback for legacy tabs.
  await sharp(svg).resize(48, 48).png().toFile(resolve(root, 'public/favicon-48.png'));
  await writeFile(resolve(outDir, '.gitkeep'), '');
  console.log('done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
