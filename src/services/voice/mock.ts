/**
 * Mock canlı ses servisi (Expo Go/dev/test): gerçek odaya bağlanmaz, durum
 * makinesi olaylarını taklit eder. Canlı mod UI'sini ve voiceSessionStore'u
 * altyapı olmadan denemeyi sağlar.
 */
import type { LiveVoiceHandlers, LiveVoiceService } from './types';

export function createMockLiveVoice(): LiveVoiceService {
  let handlers: LiveVoiceHandlers | null = null;
  return {
    async connect(_context, h) {
      handlers = h;
      // Bağlantıyı taklit et: kısa süre sonra "connected".
      h.onEvent({ type: 'connect' });
      h.onEvent({ type: 'connected' });
      h.onTranscript?.({ role: 'agent', text: 'Merhaba! Yanındayım, başlayalım.' });
    },
    async updateContext() {
      // mock: bağlam değişimini yok say
    },
    async setMuted(muted) {
      handlers?.onEvent({ type: 'setMuted', muted });
    },
    async disconnect() {
      handlers?.onEvent({ type: 'disconnect' });
      handlers = null;
    },
  };
}
