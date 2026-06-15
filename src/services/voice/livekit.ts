/**
 * LiveKit tabanlı gerçek canlı ses servisi. @livekit/react-native DİNAMİK import
 * edilir → flag kapalıyken/Expo Go'da açılış grafiğine native modül girmez.
 * Oda token'ı UYGULAMAYA GÖMÜLMEZ; backend (proxy /voice-token) imzalar
 * (CLAUDE.md: anahtarlar gömülmez). Sunucu-taraflı AI ajanı (STT→LLM→TTS) odaya
 * ayrıca katılır — bu servis yalnızca cihaz tarafını (bağlan/mikrofon) yönetir.
 *
 * Üretim için: `npx expo install @livekit/react-native` + dev-client/EAS build,
 * config'te LIVEKIT_WS_URL, proxy'de LIVEKIT_API_KEY/SECRET.
 */
import type { LiveVoiceContext, LiveVoiceHandlers, LiveVoiceService } from './types';

type LkRoom = {
  connect(url: string, token: string): Promise<void>;
  disconnect(): Promise<void>;
  on(event: string, cb: (...args: unknown[]) => void): void;
  localParticipant: { setMicrophoneEnabled(enabled: boolean): Promise<void> };
};
type LkModule = { Room: new () => LkRoom };

export interface LiveKitConfig {
  /** LiveKit oda WebSocket URL'i (wss://...). */
  wsUrl: string;
  /** Token uç noktası (proxy): oda+kimlik alır, imzalı token döner. */
  tokenUrl: string;
  /** Opsiyonel Bearer (proxy istemci token'ı). */
  clientToken?: string;
}

async function loadLiveKit(): Promise<LkModule | null> {
  try {
    return (await import('@livekit/react-native')) as unknown as LkModule;
  } catch {
    return null;
  }
}

async function fetchToken(cfg: LiveKitConfig, ctx: LiveVoiceContext): Promise<string | null> {
  try {
    const res = await fetch(cfg.tokenUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(cfg.clientToken ? { Authorization: `Bearer ${cfg.clientToken}` } : {}),
      },
      body: JSON.stringify({
        room: `cook-${ctx.recipeId}`,
        context: { recipeId: ctx.recipeId, step: ctx.currentStep, locale: ctx.locale },
      }),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const token = (data as { token?: unknown })?.token;
    return typeof token === 'string' ? token : null;
  } catch {
    return null;
  }
}

export function createLiveKitVoice(config: LiveKitConfig): LiveVoiceService {
  let room: LkRoom | null = null;
  return {
    async connect(context, handlers: LiveVoiceHandlers) {
      handlers.onEvent({ type: 'connect' });
      const mod = await loadLiveKit();
      if (!mod) return handlers.onEvent({ type: 'failed', error: 'livekit-unavailable' });
      const token = await fetchToken(config, context);
      if (!token) return handlers.onEvent({ type: 'failed', error: 'token-unavailable' });

      const r = new mod.Room();
      room = r;
      r.on('disconnected', () => handlers.onEvent({ type: 'disconnect' }));
      r.on('reconnecting', () => handlers.onEvent({ type: 'dropped' }));
      r.on('reconnected', () => handlers.onEvent({ type: 'reconnected' }));
      try {
        await r.connect(config.wsUrl, token);
        await r.localParticipant.setMicrophoneEnabled(true);
        handlers.onEvent({ type: 'connected' });
      } catch (err) {
        handlers.onEvent({ type: 'failed', error: String(err) });
      }
    },
    async updateContext() {
      // Bağlam güncellemesi data-channel ile ajana iletilir (iskelette atlandı).
    },
    async setMuted(muted) {
      await room?.localParticipant.setMicrophoneEnabled(!muted);
    },
    async disconnect() {
      await room?.disconnect();
      room = null;
    },
  };
}
