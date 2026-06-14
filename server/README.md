# Lezzet Proxy (anahtar-saklayan iskelet)

Mobil uygulamaya API anahtarı gömmemek için ince bir ters proxy. Uygulama bu
proxy'ye konuşur; proxy gerçek sağlayıcıya iletir ve anahtarı **sunucu tarafında**
(ortam değişkeninden) ekler.

## Çalıştırma

```bash
cp .env.example .env   # anahtarları doldur (repo köründeki .env.example)
ANTHROPIC_API_KEY=... DEEPGRAM_API_KEY=... ELEVENLABS_API_KEY=... node server/proxy.mjs
# veya: npm run proxy   (ortam değişkenlerini önceden ihraç ettiysen)
```

## Yollar

| Yol            | Hedef                        | Eklenen kimlik             |
| -------------- | ---------------------------- | -------------------------- |
| `/anthropic/*` | `https://api.anthropic.com`  | `x-api-key`, `anthropic-version` |
| `/deepgram/*`  | `https://api.deepgram.com`   | `Authorization: Token`     |
| `/elevenlabs/*`| `https://api.elevenlabs.io`  | `xi-api-key`               |

## Kimlik doğrulama & hız sınırlama

- **Auth:** `LEZZET_PROXY_TOKENS` (virgülle ayrılmış) izinli istemci token'larını
  tutar. İstek `Authorization: Bearer <token>` göndermeli; geçersizse `401`.
  Değişken boşsa auth kapalıdır (yalnızca geliştirme; konsol uyarısı verir).
- **Rate limit:** Anahtar başına (token, yoksa IP) dakikada `RATE_LIMIT_RPM`
  istek (varsayılan 60). Aşımda `429` + `Retry-After`. Sınırlayıcı saf ve
  testlidir (`server/__tests__/rateLimit.test.mjs`).

Not: proxy istemciden gelen `Authorization` başlığını yalnızca doğrulama için
okur; yukarı akışa **iletmez** — gerçek sağlayıcı anahtarını kendisi ekler, yani
istemci token'ı dışarı sızmaz.

## Uygulamayı proxy'ye bağlama

```ts
import { useCookingStore } from './src/state/cookingStore';
import { createRealServices, proxyRealConfig } from './src/services/real';

useCookingStore.getState().setServices(
  createRealServices(
    proxyRealConfig('https://api.lezzet.app', { clientToken: userSessionToken }),
  ),
);
```

## Üretim uyarısı

Bu hâlâ bir **iskelet**tir. Üretimde statik token yerine kendi kullanıcı oturum
doğrulaman (JWT vb.) ile değiştir; ayrıca uç nokta/parametre allowlist'i ve
maliyet koruması ekle.
