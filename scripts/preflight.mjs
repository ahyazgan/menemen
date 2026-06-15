/**
 * Preflight — üretime/mağazaya çıkmadan önce yapılandırma sağlık kontrolü.
 * Bağımlılık yok (saf Node). Kullanım:
 *   node scripts/preflight.mjs           # FAIL varsa çıkış kodu 1
 *   node scripts/preflight.mjs --strict  # WARN'ları da hata say (release CI)
 *
 * FAIL  = gerçek bozukluk (eksik asset, bundle id yok, sürüm uyuşmazlığı...).
 * WARN  = üretim için önerilen ama dev'de normal (proxy boş, abonelik kapalı...).
 */
import { readFileSync, existsSync } from 'node:fs';

const strict = process.argv.includes('--strict');
const fails = [];
const warns = [];
const oks = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);
const ok = (m) => oks.push(m);

function readConfig() {
  const text = readFileSync('src/config/index.ts', 'utf8');
  const str = (name) => text.match(new RegExp(`export const ${name} = '([^']*)'`))?.[1];
  const bool = (name) => text.match(new RegExp(`export const ${name} = (true|false)`))?.[1];
  return {
    proxy: str('PROXY_BASE_URL') ?? '',
    version: str('APP_VERSION') ?? '',
    requireSub: bool('REQUIRE_SUBSCRIPTION') === 'true',
  };
}

let app;
try {
  app = JSON.parse(readFileSync('app.json', 'utf8')).expo;
} catch (e) {
  fail(`app.json okunamadı/parse edilemedi: ${e.message}`);
}

if (app) {
  const cfg = readConfig();

  // 1) Sürüm tutarlılığı
  if (app.version && cfg.version && app.version !== cfg.version) {
    fail(`Sürüm uyuşmazlığı: app.json ${app.version} ≠ config APP_VERSION ${cfg.version}`);
  } else if (app.version) {
    ok(`Sürüm tutarlı (${app.version})`);
  }

  // 2) Mağaza kimlikleri
  app.ios?.bundleIdentifier
    ? ok(`iOS bundleIdentifier: ${app.ios.bundleIdentifier}`)
    : fail('iOS bundleIdentifier eksik (app.json → expo.ios.bundleIdentifier)');
  app.android?.package
    ? ok(`Android package: ${app.android.package}`)
    : fail('Android package eksik (app.json → expo.android.package)');

  // 3) Görsel varlıklar — referans verilen dosyalar gerçekten var mı?
  const assets = [
    app.icon,
    app.splash?.image,
    app.android?.adaptiveIcon?.foregroundImage,
    app.web?.favicon,
  ].filter(Boolean);
  for (const rel of assets) {
    const path = rel.replace(/^\.\//, '');
    existsSync(path) ? ok(`Görsel var: ${rel}`) : fail(`Görsel eksik: ${rel}`);
  }
  if (assets.length === 0) warn('Hiç ikon/splash referansı yok (app.json).');
  warn('Görseller yer tutucu olabilir — mağaza öncesi gerçek tasarımla değiştir.');

  // 4) İzin metinleri
  app.ios?.infoPlist?.NSMicrophoneUsageDescription
    ? ok('iOS mikrofon izin metni var')
    : fail('iOS NSMicrophoneUsageDescription eksik');
  app.ios?.infoPlist?.NSCameraUsageDescription
    ? ok('iOS kamera izin metni var')
    : fail('iOS NSCameraUsageDescription eksik');

  // 5) EAS projectId
  app.extra?.eas?.projectId
    ? ok('EAS projectId ayarlı')
    : warn('EAS projectId yok → `eas init` çalıştır (app.json → expo.extra.eas.projectId).');

  // 6) Üretim ayarları (dev'de normal, mağaza öncesi gözden geçir)
  cfg.proxy.trim()
    ? ok(`PROXY_BASE_URL ayarlı (${cfg.proxy})`)
    : warn('PROXY_BASE_URL boş → AI öneri / tencere yorumu / bulut ses çalışmaz.');
  cfg.requireSub
    ? ok('REQUIRE_SUBSCRIPTION açık (paywall aktif)')
    : warn('REQUIRE_SUBSCRIPTION kapalı → abonelik kapısı yok (ücretsiz mod).');

  // 7) Yasal
  existsSync('PRIVACY.md')
    ? ok('PRIVACY.md mevcut (bir URL’de yayınlamayı unutma)')
    : fail('PRIVACY.md yok (mağaza gizlilik politikası ister).');
}

// --- Rapor ---
const line = (sym, m) => console.log(`  ${sym} ${m}`);
console.log('\nLezzet preflight\n');
for (const m of oks) line('✓', m);
for (const m of warns) line('⚠', m);
for (const m of fails) line('✗', m);
console.log(
  `\nSonuç: ${oks.length} tamam · ${warns.length} uyarı · ${fails.length} hata` +
    (strict ? ' (strict: uyarılar da hata sayılır)' : ''),
);

const failed = fails.length > 0 || (strict && warns.length > 0);
process.exit(failed ? 1 : 0);
