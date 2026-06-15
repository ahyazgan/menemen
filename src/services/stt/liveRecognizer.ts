/**
 * Cihaz-içi CANLI konuşma tanıma (STT) — @react-native-voice/voice ile mikrofonu
 * gerçek zamanlı dinler. ANAHTAR/PROXY GEREKTİRMEZ; ancak native modül olduğu
 * için **dev-client gerektirir** (Expo Go'da çalışmaz).
 *
 * GÜVENLİK: modül DİNAMİK import edilir; yalnızca start() çağrılınca yüklenir.
 * Böylece Expo Go'da uygulama açılışta çökmez — start() yakalanır ve çağıran
 * tarafa "kullanılamıyor" diye düşer (VoiceButton kayıt→transcribe yedeğine geçer).
 */
import { recognizerLocale } from './locale';

export interface LiveRecognizer {
  /** Mikrofon tanımayı başlat; ara sonuçları onPartial'a verir. */
  start(opts: { locale: string; onPartial?: (text: string) => void }): Promise<void>;
  /** Tanımayı durdur ve yakalanan son metni döndür (yoksa boş string). */
  stop(): Promise<string>;
  /** Tanımayı iptal et (sonuç döndürmeden). */
  cancel(): Promise<void>;
}

/** Kullandığımız @react-native-voice/voice yüzeyi (paket tipinden bağımsız). */
interface VoiceModule {
  start(locale: string): Promise<void>;
  stop(): Promise<void>;
  cancel(): Promise<void>;
  destroy(): Promise<void>;
  removeAllListeners(): void;
  onSpeechResults?: (e: { value?: string[] }) => void;
  onSpeechPartialResults?: (e: { value?: string[] }) => void;
}

export function createVoiceRecognizer(): LiveRecognizer {
  let mod: VoiceModule | null = null;
  let lastText = '';

  async function load(): Promise<VoiceModule> {
    if (mod) return mod;
    const imported = (await import('@react-native-voice/voice')) as { default: unknown };
    mod = imported.default as VoiceModule;
    return mod;
  }

  return {
    async start({ locale, onPartial }): Promise<void> {
      const voice = await load();
      lastText = '';
      voice.onSpeechResults = (e) => {
        if (e.value && e.value[0]) lastText = e.value[0];
      };
      voice.onSpeechPartialResults = (e) => {
        if (e.value && e.value[0]) {
          lastText = e.value[0];
          onPartial?.(e.value[0]);
        }
      };
      await voice.start(recognizerLocale(locale));
    },
    async stop(): Promise<string> {
      if (!mod) return '';
      try {
        await mod.stop();
      } catch {
        // durdurma hatası sonucu engellemesin
      }
      return lastText;
    },
    async cancel(): Promise<void> {
      if (!mod) return;
      try {
        await mod.cancel();
        mod.removeAllListeners();
      } catch {
        // yoksay
      }
    },
  };
}
