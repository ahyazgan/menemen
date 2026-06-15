/** Konsol tabanlı çökme raporu (dev/Expo Go varsayılanı). */
import type { CrashReporter } from './types';

export function createConsoleCrash(): CrashReporter {
  return {
    captureException(error, context) {
      console.error('[crash]', error, context ?? '');
    },
  };
}
