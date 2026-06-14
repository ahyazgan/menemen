/**
 * Mock Intent — basit Türkçe anahtar kelime eşlemesiyle niyet çıkarır. UI'ı
 * servissiz test etmek için yeterli. Gerçek: services/real/claudeIntent.ts.
 */
import type { Intent, IntentContext, IntentKind, IntentService } from '../types';

const PATTERNS: { kind: IntentKind; re: RegExp }[] = [
  { kind: 'next', re: /\b(tamam|bitti|oldu|sonraki|devam et|geçtim)\b/i },
  { kind: 'repeat', re: /\b(tekrar|ne demiştin|bir daha|anlamadım)\b/i },
  { kind: 'how_long', re: /\b(ne kadar|kaç dakika|kaç saniye|süre)\b/i },
  { kind: 'what_now', re: /\b(şimdi ne|ne yapayım|sırada ne)\b/i },
  { kind: 'ingredients', re: /\b(malzeme|neler lazım|ne gerek)\b/i },
  { kind: 'pause', re: /\b(dur|bekle|duraklat)\b/i },
  { kind: 'resume', re: /\b(devam|kaldığ)\b/i },
  { kind: 'check', re: /\b(bak|kontrol|göz at|nasıl olmuş)\b/i },
];

const RECOVERY: { key: string; re: RegExp }[] = [
  { key: 'yaktim', re: /\b(yak|yandı|kömür)\b/i },
  { key: 'tuzlu', re: /\b(tuzlu|çok tuz)\b/i },
  { key: 'sulu', re: /\b(sulu|cıvık|fazla su)\b/i },
];

export function createMockIntent(): IntentService {
  return {
    async parse(text: string, context: IntentContext): Promise<Intent> {
      const recovery = RECOVERY.find((r) => r.re.test(text));
      if (recovery && context.recoveryKeys?.includes(recovery.key)) {
        return { kind: 'recovery', raw: text, recoveryKey: recovery.key, confidence: 0.8 };
      }
      const match = PATTERNS.find((p) => p.re.test(text));
      if (match) return { kind: match.kind, raw: text, confidence: 0.85 };
      return { kind: 'unknown', raw: text, confidence: 0.3 };
    },
  };
}
