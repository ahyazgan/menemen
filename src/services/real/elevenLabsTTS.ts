import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import type { TTSService } from '../types';

/**
 * ElevenLabs ile metin → konuşma. Sesi sentezler ve expo-audio ile çalar.
 * Arka plan sesi açıktır (ekran kapanınca AI susmasın — CLAUDE.md mağaza gereksinimi).
 *
 * ⚠️ GÜVENLİK: anahtarı uygulamaya gömme — üretimde proxy üzerinden çağır.
 */
export interface ElevenLabsConfig {
  apiKey: string;
  /** Ses kimliği (ElevenLabs voice id). */
  voiceId?: string;
  /** Çok dilli model — Türkçe için eleven_multilingual_v2 önerilir. */
  modelId?: string;
  /** Üretimde kendi proxy kökün (örn. https://api.lezzet.app/elevenlabs). */
  baseUrl?: string;
  /** Proxy'ye gönderilecek istemci oturum token'ı (Bearer). */
  clientToken?: string;
}

export function createElevenLabsTTS(config: ElevenLabsConfig): TTSService {
  const voiceId = config.voiceId ?? 'EXAVITQu4vr4xnSDxMaL';
  const modelId = config.modelId ?? 'eleven_multilingual_v2';
  const endpoint = `${config.baseUrl ?? 'https://api.elevenlabs.io'}/v1/text-to-speech`;
  let player: AudioPlayer | null = null;

  async function stop(): Promise<void> {
    player?.pause();
  }

  return {
    async speak(text: string, opts?: { interrupt?: boolean }): Promise<void> {
      if (opts?.interrupt) await stop();
      const headers: Record<string, string> = {
        'xi-api-key': config.apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      };
      // Proxy modunda Bearer ekle; proxy gerçek xi-api-key'i enjekte eder.
      if (config.clientToken) headers.Authorization = `Bearer ${config.clientToken}`;
      const res = await fetch(`${endpoint}/${voiceId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, model_id: modelId }),
      });
      if (!res.ok) {
        throw new Error(`ElevenLabs TTS hatası: ${res.status}`);
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      const uri = `data:audio/mpeg;base64,${bytesToBase64(bytes)}`;

      // Sessiz modda ve arka planda da çalsın.
      await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true });
      player ??= createAudioPlayer(null);
      player.replace({ uri });
      player.play();
    },
    stop,
  };
}

/** Bayt dizisini base64'e çevirir (RN'de güvenilir, btoa'ya bağımsız). */
function bytesToBase64(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = i + 1 < bytes.length ? (bytes[i + 1] ?? 0) : 0;
    const b2 = i + 2 < bytes.length ? (bytes[i + 2] ?? 0) : 0;
    out += chars[b0 >> 2];
    out += chars[((b0 & 3) << 4) | (b1 >> 4)];
    out += i + 1 < bytes.length ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    out += i + 2 < bytes.length ? chars[b2 & 63] : '=';
  }
  return out;
}
