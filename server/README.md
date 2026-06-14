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

## Uygulamayı proxy'ye bağlama

```ts
import { useCookingStore } from './src/state/cookingStore';
import { createRealServices, proxyRealConfig } from './src/services/real';

useCookingStore.getState().setServices(
  createRealServices(proxyRealConfig('https://api.lezzet.app')),
);
```

## Üretim uyarısı

Bu bir **iskelet**tir. Üretimde mutlaka ekle:
- Kendi kullanıcı oturum doğrulaman (yetkisiz kullanım engellensin).
- Hız sınırlama ve maliyet koruması.
- İzin verilen uç nokta/parametre listesi (allowlist).
