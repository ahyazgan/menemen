/**
 * Canlı (full-duplex) ses oturumu için saf durum makinesi — CLAUDE.md → State
 * Machine ruhu, React/Expo importu YOK. Gerçek taşıma (LiveKit) servis arkasında;
 * burada yalnızca bağlantı + mikrofon + "ajan konuşuyor" durumu deterministik
 * yönetilir (test edilebilir). Barge-in: kullanıcı her an konuşup ajanı kesebilir.
 *
 * NOT: Bu canlı mod v1'de flag ile KAPALIDIR (CLAUDE.md: LiveKit v1'de değil).
 * Altyapı hazır olunca flag açılır; mantık ve UI önceden test edilebilir kalır.
 */
export type VoiceConnState = 'idle' | 'connecting' | 'live' | 'reconnecting' | 'ended' | 'error';

export interface VoiceSessionState {
  conn: VoiceConnState;
  /** Mikrofon susturuldu mu (canlıyken kullanıcı sessize alabilir). */
  muted: boolean;
  /** Ajan şu an konuşuyor mu (UI göstergesi + barge-in için). */
  agentSpeaking: boolean;
  /** Son hata mesajı (error durumunda). */
  error: string | null;
}

export type VoiceEvent =
  | { type: 'connect' }
  | { type: 'connected' }
  | { type: 'disconnect' }
  | { type: 'dropped' }
  | { type: 'reconnected' }
  | { type: 'failed'; error: string }
  | { type: 'setMuted'; muted: boolean }
  | { type: 'agentSpeaking'; speaking: boolean };

export const initialVoiceSession: VoiceSessionState = {
  conn: 'idle',
  muted: false,
  agentSpeaking: false,
  error: null,
};

/** Canlıyken konuşma kesilebilir mi? (mikrofon açık + ajan konuşurken bile). */
export function canBargeIn(state: VoiceSessionState): boolean {
  return state.conn === 'live' && !state.muted;
}

export function reduceVoiceSession(state: VoiceSessionState, event: VoiceEvent): VoiceSessionState {
  switch (event.type) {
    case 'connect':
      // idle/ended/error'dan yeniden bağlanmaya başla.
      if (state.conn === 'connecting' || state.conn === 'live') return state;
      return { ...initialVoiceSession, conn: 'connecting', muted: state.muted };
    case 'connected':
      if (state.conn !== 'connecting' && state.conn !== 'reconnecting') return state;
      return { ...state, conn: 'live', error: null };
    case 'dropped':
      if (state.conn !== 'live') return state;
      return { ...state, conn: 'reconnecting', agentSpeaking: false };
    case 'reconnected':
      if (state.conn !== 'reconnecting') return state;
      return { ...state, conn: 'live' };
    case 'failed':
      return { ...state, conn: 'error', agentSpeaking: false, error: event.error };
    case 'disconnect':
      return { ...initialVoiceSession, conn: 'ended' };
    case 'setMuted':
      return { ...state, muted: event.muted };
    case 'agentSpeaking':
      // Yalnızca canlıyken anlamlı; aksi halde yok say.
      if (state.conn !== 'live') return state;
      return { ...state, agentSpeaking: event.speaking };
    default:
      return state;
  }
}
