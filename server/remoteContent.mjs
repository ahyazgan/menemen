/**
 * Remote içerik yükleyiciler (feature-flag + uzak tarifler) — SIFIR bağımlılık.
 * Anahtarsızdır: flag'ler ortamdan, tarifler bir JSON dosyasından okunur.
 * Uygulama tarafı bunları zaten doğrular (sanitizeFlags / parseRemoteRecipes),
 * burada yalnızca güvenli okuma + bozuk girdiyi yutma var. Test için readFn enjekte.
 */
import { readFileSync } from 'node:fs';

/** LEZZET_FLAGS ortam değişkeninden flag nesnesi. Geçersizse {} (uygulama varsayılanı korur). */
export function loadFlags(env) {
  const raw = env.LEZZET_FLAGS;
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

/**
 * LEZZET_RECIPES_FILE yolundaki JSON'dan tarif dizisi. Geçersiz/eksikse [].
 * @param {string | undefined} path
 * @param {(p: string) => string} [readFn] test için enjekte edilir
 */
export function loadRecipes(path, readFn = (p) => readFileSync(p, 'utf8')) {
  if (!path) return [];
  try {
    const value = JSON.parse(readFn(path));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
