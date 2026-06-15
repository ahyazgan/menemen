/**
 * Cihaz-içi TTS (expo-speech) — TTSService'i telefonun yerleşik konuşma motoruyla
 * uygular. ANAHTAR/PROXY GEREKTİRMEZ ve Expo Go'da çalışır; uygulama gerçekten
 * konuşur. Bulut TTS (ElevenLabs) gerekince services/real ile değiştirilebilir.
 */
import * as Speech from 'expo-speech';

import type { TTSService } from '../types';

export interface ExpoSpeechConfig {
  /** Aktif dil kodu ('tr' | 'en'); BCP-47'ye çevrilir. */
  getLocale: () => string;
  /** false ise konuşma yapılmaz (Ayarlar'dan kapatılabilir). Varsayılan: açık. */
  isEnabled?: () => boolean;
  /** Konuşma hızı çarpanı (örn. 0.85 yavaş, 1.0 normal, 1.15 hızlı). */
  getRate?: () => number;
}

/** Dil kodunu cihaz TTS'inin beklediği BCP-47'ye çevirir. */
function toBcp47(locale: string): string {
  if (locale.startsWith('tr')) return 'tr-TR';
  if (locale.startsWith('en')) return 'en-US';
  return locale;
}

export function createExpoSpeechTTS(config: ExpoSpeechConfig): TTSService {
  const enabled = () => config.isEnabled?.() ?? true;
  const rate = () => config.getRate?.() ?? 1.0;

  return {
    speak(text: string, opts?: { interrupt?: boolean }): Promise<void> {
      if (!enabled() || !text.trim()) return Promise.resolve();
      if (opts?.interrupt) Speech.stop();
      return new Promise<void>((resolve) => {
        let settled = false;
        const done = (): void => {
          if (settled) return;
          settled = true;
          resolve();
        };
        Speech.speak(text, {
          language: toBcp47(config.getLocale()),
          rate: rate(),
          onDone: done,
          onStopped: done,
          onError: done,
        });
      });
    },
    async stop(): Promise<void> {
      Speech.stop();
    },
  };
}
