/**
 * Mock TTS — konuşmayı konsola yazar. Gerçek: services/real/elevenLabsTTS.ts.
 */
import type { TTSService } from '../types';

export function createMockTTS(sink: (line: string) => void = console.log): TTSService {
  return {
    async speak(text: string, opts?: { interrupt?: boolean }): Promise<void> {
      sink(`🔊 ${opts?.interrupt ? '(kesti) ' : ''}${text}`);
    },
    async stop(): Promise<void> {
      sink('🔇 (durduruldu)');
    },
  };
}
