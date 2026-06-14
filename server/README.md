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

| Yol             | Hedef                       | Eklenen kimlik                   |
| --------------- | --------------------------- | -------------------------------- |
| `/anthropic/*`  | `https://api.anthropic.com` | `x-api-key`, `anthropic-version` |
| `/deepgram/*`   | `https://api.deepgram.com`  | `Authorization: Token`           |
| `/elevenlabs/*` | `https://api.elevenlabs.io` | `xi-api-key`                     |

## Kimlik doğrulama (öncelik: JWKS_URL > JWKS > RS256 > HS256 > statik token > dev)

| Mod                      | Koşul                         | Davranış                                                                                                                                                            |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uzak JWKS** (önerilir) | `LEZZET_JWKS_URL` ayarlı      | jwks.json'u URL'den **önbellekli** çeker (`LEZZET_JWKS_TTL_MS`, varsayılan 1 saat); token `kid`'ine göre RS256 doğrular. Eşzamanlı istekler tek fetch'e indirgenir. |
| **Inline JWKS**          | `LEZZET_JWKS` ayarlı          | `{ keys: [JWK,...] }`; token `kid`'ine göre RS256 doğrular.                                                                                                         |
| **RS256**                | `LEZZET_JWT_PUBLIC_KEY` (PEM) | Tek açık anahtarla RS256 imza + `exp`/`nbf`.                                                                                                                        |
| **HS256**                | `LEZZET_JWT_SECRET`           | Paylaşılan sırla HS256.                                                                                                                                             |
| **Statik token**         | `LEZZET_PROXY_TOKENS`         | İzinli Bearer token allowlist'i; geçersizse `401 invalid_token`.                                                                                                    |
| **Dev**                  | Hiçbiri                       | Auth KAPALI, anahtar = IP. Konsol uyarısı verir. Yalnızca geliştirme.                                                                                               |

JWT modlarında `Authorization: Bearer <jwt>` doğrulanır; geçersizse `401` +
`reason` (örn. `jwt_expired`, `jwt_bad_signature`, `jwt_unknown_kid`). Rate-limit
anahtarı token `sub`'tur. Doğrulayıcılar saf ve testlidir (`server/jwt.mjs`,
`server/__tests__/jwt.test.mjs`, `jwtRs256.test.mjs`). Üretimde JWT'yi kendi
kimlik sağlayıcın (Auth0/Cognito/kendi backend'in) imzalamalı; `signHS256`/
`signRS256` yalnızca test/araç içindir.

- **Rate limit:** Anahtar başına (JWT `sub` / token / IP) dakikada `RATE_LIMIT_RPM`
  istek (varsayılan 60). Aşımda `429` + `Retry-After`. Sınırlayıcı saf ve
  testlidir (`server/__tests__/rateLimit.test.mjs`).
- **Gövde boyut limiti:** `MAX_BODY_BYTES` (varsayılan 10 MB). Content-Length
  ön kontrolü + chunked istekler için akış muhafızı; aşan istek `413
payload_too_large` (`server/bodyLimit.mjs`).

Not: proxy istemciden gelen `Authorization` başlığını yalnızca doğrulama için
okur; yukarı akışa **iletmez** — gerçek sağlayıcı anahtarını kendisi ekler, yani
istemci token'ı dışarı sızmaz.

## Uç nokta allowlist'i

Proxy yalnızca uygulamanın gerçekten kullandığı **method + yol** kombinasyonlarını
iletir; gerisi `403 forbidden_endpoint` (iletmeden). Çalınmış bir istemci
token'ıyla keyfi sağlayıcı uç noktasına gidilmesini engeller.

| Yol           | İzinli                              |
| ------------- | ----------------------------------- |
| `/anthropic`  | `POST /v1/messages`                 |
| `/deepgram`   | `POST /v1/listen`                   |
| `/elevenlabs` | `POST /v1/text-to-speech/{voiceId}` |

Varsayılan AÇIK; `LEZZET_ALLOWLIST=off` ile kapatılabilir (önerilmez). Kurallar
saf ve testlidir (`server/allowlist.mjs`, `server/__tests__/allowlist.test.mjs`).

## Gözlemlenebilirlik

- **`/health`** → `200 {status, authMode}` (auth/rate-limit yok).
- **`/metrics`** → **Prometheus metin formatı** (`lezzet_proxy_requests_total`,
  `..._status_total{class}`, `..._route_requests_total{route}`); gizli içermez.
  Üretici saf ve testlidir (`server/metrics.mjs`).
- Her istek için `x-request-id` başlığı ve `stdout`'a **yapılandırılmış JSON log**
  (`reqId`, `method`, `path`, `status`, `durationMs`, `authMode`).
- `/health` ve `/metrics` kimlik istemez; üretimde bunları **ağ düzeyinde**
  (iç ağ/yük dengeleyici) kısıtla.

## Uygulamayı proxy'ye bağlama

```ts
import { useCookingStore } from './src/state/cookingStore';
import { createRealServices, proxyRealConfig } from './src/services/real';

useCookingStore
  .getState()
  .setServices(
    createRealServices(
      proxyRealConfig('https://api.lezzet.app', { clientToken: userSessionToken }),
    ),
  );
```

## Üretim için kalanlar

JWT (HS256/RS256/JWKS, uzak JWKS önbellekli), hız sınırlama, uç nokta
allowlist'i, gövde boyut limiti ve Prometheus `/metrics` hazır. Tam üretim için
ek olarak:

- Dağıtık iz (OpenTelemetry) ve kalıcı metrik deposu.
- Maliyet koruması ve sağlayıcı bazlı kota.
