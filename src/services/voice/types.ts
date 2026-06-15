/**
 * Canlı (full-duplex) ses servisi arayüzü (CLAUDE.md → services interface
 * arkasında). screens ASLA doğrudan çağırmaz; voiceSessionStore üzerinden geçer.
 * Gerçek taşıma LiveKit'tir (services/voice/livekit), ama burada SDK'dan
 * bağımsız kalınır — test için mock'lanabilir.
 */
import type { VoiceEvent } from '../../engine/voiceSession';

/** Ajana iletilen pişirme bağlamı (oda metadata'sı): tarif + aktif adım. */
export interface LiveVoiceContext {
  recipeId: string;
  recipeTitle: string;
  /** O an odaktaki adımın yönergesi (varsa). */
  currentStep?: string;
  locale: string;
}

export interface TranscriptTurn {
  role: 'user' | 'agent';
  text: string;
}

export interface LiveVoiceHandlers {
  /** Durum makinesi olayları (connected/dropped/agentSpeaking/...). */
  onEvent: (event: VoiceEvent) => void;
  /** Konuşma dökümü (UI'da altyazı olarak gösterilebilir). */
  onTranscript?: (turn: TranscriptTurn) => void;
}

export interface LiveVoiceService {
  /** Odaya bağlan; token backend'den (proxy /voice-token) alınır. */
  connect: (context: LiveVoiceContext, handlers: LiveVoiceHandlers) => Promise<void>;
  /** Pişirme bağlamını güncelle (kullanıcı adımı değiştirdi). */
  updateContext: (context: LiveVoiceContext) => Promise<void>;
  /** Mikrofonu sustur/aç. */
  setMuted: (muted: boolean) => Promise<void>;
  /** Oturumu kapat ve kaynakları bırak. */
  disconnect: () => Promise<void>;
}
