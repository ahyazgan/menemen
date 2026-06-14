import type { STTService } from '../types';

/**
 * Deepgram (prerecorded) ile konuşma → metin. Kaydedilmiş ses dosyasının URI'sini
 * okuyup Deepgram'a gönderir. Türkçe için language=tr.
 *
 * ⚠️ GÜVENLİK: anahtarı uygulamaya gömme — üretimde proxy üzerinden çağır.
 */
export interface DeepgramConfig {
  apiKey: string;
  /** Deepgram modeli (örn. nova-2). */
  model?: string;
  language?: string;
  /** Üretimde kendi proxy kökün (örn. https://api.lezzet.app/deepgram). */
  baseUrl?: string;
  /** Proxy'ye gönderilecek istemci oturum token'ı (Bearer). Varsa proxy modu. */
  clientToken?: string;
}

interface DeepgramResponse {
  results?: {
    channels?: {
      alternatives?: { transcript?: string }[];
    }[];
  };
}

export function createDeepgramSTT(config: DeepgramConfig): STTService {
  const model = config.model ?? 'nova-2';
  const language = config.language ?? 'tr';
  const base = config.baseUrl ?? 'https://api.deepgram.com';
  const url = `${base}/v1/listen?model=${model}&language=${language}&smart_format=true`;

  return {
    async transcribe(audioUri: string): Promise<string> {
      const audio = await fetch(audioUri).then((r) => r.arrayBuffer());
      // Proxy modunda Bearer (proxy gerçek anahtarı ekler); değilse doğrudan key.
      const authorization = config.clientToken
        ? `Bearer ${config.clientToken}`
        : `Token ${config.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: authorization, 'Content-Type': 'audio/*' },
        body: audio,
      });
      if (!res.ok) {
        throw new Error(`Deepgram STT hatası: ${res.status}`);
      }
      const json = (await res.json()) as DeepgramResponse;
      return json.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
    },
  };
}
