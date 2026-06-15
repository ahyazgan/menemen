/**
 * Placeholder marka görselleri üretir (ikon/splash/adaptive/favicon). Tasarımcı
 * görselleri gelene dek geçerli, marka renkli yer tutucular — EAS build'in
 * çalışması ve mağaza alanlarının dolması için. Bağımlılık yok (saf Node: zlib).
 *
 * Çalıştır: node scripts/gen-assets.mjs
 */
import { deflateSync, crc32 } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const BRAND = [181, 48, 15]; // #B5300F
const CREAM = [255, 248, 240]; // #FFF8F0

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

/** RGBA piksel tamponunu PNG'ye kodlar (renk türü 6, 8-bit). */
function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Tek renk arka plan + ortada dolu daire çizer. `bg` null ise saydam (adaptive
 * foreground için). `circle` null ise sadece arka plan.
 */
function makeImage(size, { bg, circle }) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const r = circle ? circle.radius * size : 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let px = bg ? [bg[0], bg[1], bg[2], 255] : [0, 0, 0, 0];
      if (circle) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r * r)
          px = [circle.color[0], circle.color[1], circle.color[2], 255];
      }
      buf[i] = px[0];
      buf[i + 1] = px[1];
      buf[i + 2] = px[2];
      buf[i + 3] = px[3];
    }
  }
  return encodePng(size, size, buf);
}

mkdirSync('assets', { recursive: true });

// İkon: marka kırmızı zemin + krem daire (basit, marka uyumlu yer tutucu).
writeFileSync(
  'assets/icon.png',
  makeImage(1024, { bg: BRAND, circle: { radius: 0.3, color: CREAM } }),
);
// Android adaptive foreground: saydam zemin + güvenli bölgede krem daire (bg app.json'da kırmızı).
writeFileSync(
  'assets/adaptive-icon.png',
  makeImage(1024, { bg: null, circle: { radius: 0.24, color: CREAM } }),
);
// Açılış ekranı: krem zemin + ortada küçük kırmızı daire (resizeMode contain).
writeFileSync(
  'assets/splash.png',
  makeImage(1280, { bg: CREAM, circle: { radius: 0.12, color: BRAND } }),
);
// Web favicon.
writeFileSync(
  'assets/favicon.png',
  makeImage(48, { bg: BRAND, circle: { radius: 0.3, color: CREAM } }),
);

console.log('✓ assets/ icon.png, adaptive-icon.png, splash.png, favicon.png üretildi');
