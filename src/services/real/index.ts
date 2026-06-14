/**
 * Gerçek servis paketi (Deepgram + ElevenLabs + Claude). Mock'larla aynı
 * arayüzleri uygular; store yalnızca interface'i görür.
 *
 * ⚠️ GÜVENLİK: Anahtarları uygulamaya gömme. Üretimde her sağlayıcıyı kendi
 * backend proxy'n üzerinden çağır (Anthropic için baseURL; STT/TTS için kendi
 * uç noktaların). Bu fabrika geliştirme ve proxy entegrasyonu içindir.
 */
import type { Services } from '../types';
import { createAnthropicClient, type AnthropicConfig } from './anthropicClient';
import { createClaudeIntent } from './claudeIntent';
import { createClaudeVision } from './claudeVision';
import { createDeepgramSTT, type DeepgramConfig } from './deepgramSTT';
import { createElevenLabsTTS, type ElevenLabsConfig } from './elevenLabsTTS';

export { createAnthropicClient } from './anthropicClient';
export { createClaudeIntent } from './claudeIntent';
export { createClaudeVision } from './claudeVision';
export { createDeepgramSTT } from './deepgramSTT';
export { createElevenLabsTTS } from './elevenLabsTTS';

export interface RealServiceConfig {
  anthropic: AnthropicConfig;
  deepgram: DeepgramConfig;
  elevenLabs: ElevenLabsConfig;
}

export interface ProxyOptions {
  /** Proxy'ye gönderilecek istemci oturum token'ı (Bearer). */
  clientToken?: string;
  /** Claude modeli (varsayılan claude-opus-4-8). */
  model?: string;
}

/**
 * Tüm sağlayıcıları tek bir backend proxy'ye yönlendiren config üretir.
 * Anahtarlar uygulamada DEĞİL, proxy'de tutulur (apiKey alanı yalnızca placeholder).
 * `clientToken` proxy'nin Bearer doğrulamasını geçer. Bkz. server/proxy.mjs.
 */
export function proxyRealConfig(proxyBaseUrl: string, opts: ProxyOptions = {}): RealServiceConfig {
  const base = proxyBaseUrl.replace(/\/$/, '');
  const { clientToken, model } = opts;
  return {
    anthropic: { apiKey: 'via-proxy', baseURL: `${base}/anthropic`, model, clientToken },
    deepgram: { apiKey: 'via-proxy', baseUrl: `${base}/deepgram`, clientToken },
    elevenLabs: { apiKey: 'via-proxy', baseUrl: `${base}/elevenlabs`, clientToken },
  };
}

export function createRealServices(config: RealServiceConfig): Services {
  const claude = createAnthropicClient(config.anthropic);
  const model = config.anthropic.model;
  return {
    stt: createDeepgramSTT(config.deepgram),
    tts: createElevenLabsTTS(config.elevenLabs),
    vision: createClaudeVision(claude, model),
    intent: createClaudeIntent(claude, model),
  };
}
