/**
 * Saf motor testlerini çalıştırır (harici npm bağımlılığı gerekmez):
 *   1. src/engine/** + testleri CommonJS olarak .test-build'e derle (tsc)
 *   2. derlenmiş testleri node:test ile çalıştır
 *
 * Bu, "motor test edildi ve çalışıyor" güvencesini Expo/jest kurulmadan verir.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

rmSync('.test-build', { recursive: true, force: true });

// tsc 6+ "node10" çözümünü hata sayar; o sürümlerde uyarıyı sustur.
const tscArgs = ['-p', 'tsconfig.engine-test.json'];
try {
  const version = execFileSync('tsc', ['--version'], { encoding: 'utf8' });
  const major = Number(version.replace(/[^0-9.]/g, '').split('.')[0]);
  if (major >= 6) tscArgs.push('--ignoreDeprecations', '6.0');
} catch {
  // sürüm okunamazsa varsayılan argümanlarla devam et
}

console.log('• Motor TypeScript derleniyor (tsconfig.engine-test.json)…');
execFileSync('tsc', tscArgs, { stdio: 'inherit' });

function findTests(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findTests(path));
    else if (entry.name.endsWith('.test.js')) out.push(path);
  }
  return out;
}

const testFiles = findTests('.test-build/src');
if (testFiles.length === 0) {
  console.error('Derlenmiş test bulunamadı.');
  process.exit(1);
}

console.log(`• node:test çalıştırılıyor (${testFiles.length} dosya)…`);
execFileSync(process.execPath, ['--test', ...testFiles], { stdio: 'inherit' });
