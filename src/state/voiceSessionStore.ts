/**
 * voiceSessionStore — canlı (full-duplex) ses oturumunu yönetir. Saf durum
 * makinesi engine/voiceSession.ts'te (testli); burada servis (mock/LiveKit)
 * bağlanır ve olaylar reducer'a işlenir. screens yalnızca buradaki action'ları
 * çağırır. CLAUDE.md: canlı mod v1'de flag ile KAPALI.
 */
import { create } from 'zustand';

import {
  initialVoiceSession,
  reduceVoiceSession,
  type VoiceSessionState,
} from '../engine/voiceSession';
import {
  createMockLiveVoice,
  type LiveVoiceContext,
  type LiveVoiceService,
  type TranscriptTurn,
} from '../services/voice';
import { track } from '../services/analytics';

interface VoiceSessionStore {
  service: LiveVoiceService;
  session: VoiceSessionState;
  /** Son konuşma dökümü turu (UI altyazısı). */
  lastTurn: TranscriptTurn | null;
  /** Canlı servis sağlayıcısını ayarla (App: mock veya LiveKit). */
  setService: (service: LiveVoiceService) => void;
  /** Canlı oturumu başlat. */
  start: (context: LiveVoiceContext) => Promise<void>;
  /** Pişirme bağlamını ajana güncelle. */
  updateContext: (context: LiveVoiceContext) => Promise<void>;
  /** Mikrofonu sustur/aç. */
  toggleMuted: () => Promise<void>;
  /** Canlı oturumu kapat. */
  stop: () => Promise<void>;
}

export const useVoiceSessionStore = create<VoiceSessionStore>((set, get) => ({
  service: createMockLiveVoice(),
  session: initialVoiceSession,
  lastTurn: null,

  setService: (service) => set({ service }),

  start: async (context) => {
    set({ lastTurn: null });
    await get().service.connect(context, {
      onEvent: (event) => {
        set({ session: reduceVoiceSession(get().session, event) });
        if (event.type === 'connected') track({ name: 'live_voice_started' });
      },
      onTranscript: (turn) => set({ lastTurn: turn }),
    });
  },

  updateContext: async (context) => {
    if (get().session.conn !== 'live') return;
    await get().service.updateContext(context);
  },

  toggleMuted: async () => {
    const next = !get().session.muted;
    await get().service.setMuted(next);
  },

  stop: async () => {
    await get().service.disconnect();
    if (get().session.conn !== 'idle') track({ name: 'live_voice_ended' });
  },
}));
