import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude (Anthropic) istemci fabrikası — Vision ve Intent servisleri bunu paylaşır.
 *
 * ⚠️ GÜVENLİK: Mobil uygulamaya ham API anahtarı GÖMME. Üretimde `baseURL`'i
 * kendi backend proxy'ne yönlendir; proxy anahtarı sunucu tarafında tutsun.
 * `apiKey` burada yalnızca geliştirme/proxy kimliği içindir.
 */
export interface AnthropicConfig {
  apiKey: string;
  /** Üretimde kendi proxy adresin (örn. https://api.lezzet.app/llm). */
  baseURL?: string;
  /** Varsayılan model; düşük gecikme için claude-haiku-4-5 tercih edilebilir. */
  model?: string;
  /** Proxy'ye gönderilecek istemci oturum token'ı (Bearer). */
  clientToken?: string;
}

/** CLAUDE API rehberi varsayılanı. */
export const DEFAULT_CLAUDE_MODEL = 'claude-opus-4-8';

export function createAnthropicClient(config: AnthropicConfig): Anthropic {
  return new Anthropic({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    // Proxy kullanılıyorsa istemci token'ını Bearer olarak gönder.
    defaultHeaders: config.clientToken ? { Authorization: `Bearer ${config.clientToken}` } : undefined,
    // RN/Hermes ortamında çalışır; üretimde anahtarı istemciye gömme — proxy kullan.
    dangerouslyAllowBrowser: true,
  });
}
