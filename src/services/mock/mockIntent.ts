/**
 * Yerel (cihaz-içi) Intent servisi — saf, testli kural tabanlı NLU'yu
 * (engine/intent.ts) sarar. Claude/anahtar GEREKTİRMEZ; TR+EN komutları tanır.
 * Gerçek (LLM) sürüm: services/real/claudeIntent.ts.
 */
import { matchIntent } from '../../engine/intent';
import type { Intent, IntentContext, IntentService } from '../types';

export function createMockIntent(): IntentService {
  return {
    async parse(text: string, context: IntentContext): Promise<Intent> {
      const m = matchIntent(text, context.recoveryKeys ?? []);
      return { kind: m.kind, raw: text, recoveryKey: m.recoveryKey, confidence: m.confidence };
    },
  };
}
