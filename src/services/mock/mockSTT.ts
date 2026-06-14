/**
 * Mock STT — UI'ı servissiz test etmek için (CLAUDE.md → services mock'lanabilir).
 * Gerçek implementasyon: services/real/deepgramSTT.ts.
 */
import type { STTService } from '../types';

export function createMockSTT(scripted: string[] = ['tamam']): STTService {
  let i = 0;
  return {
    async transcribe(_audioUri: string): Promise<string> {
      const phrase = scripted[i % scripted.length] ?? 'tamam';
      i += 1;
      return phrase;
    },
  };
}
