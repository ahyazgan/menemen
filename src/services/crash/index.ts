/**
 * Çökme raporlama kamu API'si + uygulama geneli ince yardımcı. Bileşenler
 * reportError() çağırır; sağlayıcı setCrash() ile bağlanır (varsayılan: konsol).
 */
import { createConsoleCrash } from './mock';
import type { CrashReporter } from './types';

export * from './types';
export { createConsoleCrash } from './mock';
export { createSentryCrash } from './sentry';

let current: CrashReporter = createConsoleCrash();

/** Aktif çökme raporlayıcısını ayarla (App açılışında). */
export function setCrash(reporter: CrashReporter): void {
  current = reporter;
}

/** Bir hatayı raporla — asla uygulamayı bozmaz (fire-and-forget). */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  try {
    current.captureException(error, context);
  } catch {
    // raporlama asla uygulamayı bozmamalı
  }
}
