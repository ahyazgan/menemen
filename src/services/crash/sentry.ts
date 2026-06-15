/**
 * Sentry tabanlı çökme raporu. @sentry/react-native DİNAMİK import edilir →
 * DSN boşken (Expo Go/dev) açılış grafiğine native modül girmez. Modül kurulu
 * değilse güvenle konsola düşer. Üretim için: `npx expo install
 * @sentry/react-native` + config'te SENTRY_DSN.
 */
import type { CrashReporter } from './types';

type SentryModule = {
  init(options: { dsn: string }): void;
  captureException(error: unknown): void;
};

export function createSentryCrash(dsn: string): CrashReporter {
  let mod: SentryModule | null = null;
  // Arka planda yükle + init; hazır olana dek hatalar konsola düşer.
  void (async () => {
    try {
      const m = (await import('@sentry/react-native')) as unknown as SentryModule;
      m.init({ dsn });
      mod = m;
    } catch {
      // modül yok/yüklenemedi → konsol fallback'i kullanılır
    }
  })();

  return {
    captureException(error, context) {
      if (mod) {
        try {
          mod.captureException(error);
          return;
        } catch {
          // Sentry çağrısı patlarsa konsola düş
        }
      }
      console.error('[crash:pending]', error, context ?? '');
    },
  };
}
