# Lezzet — Canlı Mutfak Rehberi

Kullanıcı yemek yaparken yanında duran, sesle adım adım yönlendiren, ara sıra
tencereye bakıp durum yorumlayan, sıkışınca kurtaran bir AI mutfak rehberi.
Tarif uygulaması değil — **canlı deneyim**. Ayrıntılı ürün/teknik kuralları için
[`CLAUDE.md`](./CLAUDE.md) (projenin anayasası).

## Bu repoda ne var

Çalışan iskelet kuruldu:

- **`src/engine/`** — saf TypeScript tarif motoru (React/Expo importu yok).
  Tarifi yürütülebilir bir grafa çevirir; bağımlılık, paralel iş, zamanlayıcı,
  kurtarma ve gıda güvenliği kuralını yönetir. **Test edildi ve çalışıyor.**
- **`src/services/`** — `stt`/`tts`/`vision`/`intent` arayüzleri, UI'ı servissiz
  test etmek için `mock/` implementasyonları ve **`real/`** gerçek entegrasyonlar:
  Deepgram (STT), ElevenLabs (TTS), Claude Vision + Claude Intent (tool use).
  Vision gıda güvenliği kuralına uyar (kesin hüküm yok). Store, `setServices` ile
  mock'tan gerçeğe geçer.
- **`src/state/cookingStore.ts`** — motoru Zustand'a saran durum makinesi;
  servisleri buraya bağlar. Ekranlar yalnızca buradaki action'ları çağırır.
- **`src/screens/CookingScreen.tsx`** — canlı pişirme ekranı (sadece UI).
- **`src/components/`** — `VoiceButton` (expo-audio bas-konuş kaydı) ve
  `PotCheckButton` (expo-camera frame-on-demand tek kare). İkisi de yalnızca
  store action'larını (`listen`, `checkPot`) çağırır.
- **`server/proxy.mjs`** — anahtarları istemciden çıkaran sıfır-bağımlılık
  backend proxy iskeleti (`npm run proxy`).
- **`src/services/billing/`** — abonelik (RevenueCat) interface'i + mock + gerçek
  sarmalayıcı; `subscriptionStore` ve `Paywall`/`SubscriptionGate`. iOS Apple IAP,
  Android Play Billing; uygulama içi IAP-dışı dijital ödeme YOK (CLAUDE.md).
- **`src/recipes/menemen.ts`** — örnek tarif grafı (paralel prep + güvenlik).
- **`src/i18n/`, `src/config/`** — TR metinler ve yapılandırma.

## Kurulum

```bash
npm install
```

> Not: `app.json`, `tsconfig.json`, `babel.config.js` ve `src/` zaten bu repoda.
> Yeniden Expo iskeleti çekmene gerek yok; doğrudan `npm install` yeter.

## Çalıştırma

```bash
npm start        # Expo dev server
npm run ios      # iOS simülatör
npm run android  # Android emülatör
```

## Test & tip kontrolü

```bash
npm run typecheck   # tsc --noEmit (CLAUDE.md gereği temiz olmalı)
npm run test:engine # saf motor birim testleri (harici bağımlılık gerekmez)
npm test            # ikisi birden
```

`test:engine`, motoru CommonJS'e derleyip `node --test` ile koşar; bu yüzden
Expo/jest kurulmadan da motor doğrulanabilir.

## Mimari (katmanlı)

```
screens/   → ekranlar (sadece UI)
state/     → Zustand store (cookingStore = durum makinesi)
engine/    → saf TS graf yürütücü (platformdan bağımsız, test edilebilir)
services/  → harici servisler, hep interface arkasında (mock + real)
recipes/   → tarif grafları
config/    → sabitler ve özellik bayrakları
```

Akış: **screens → state → services**. Ekran asla servisi doğrudan çağırmaz.
`engine` saf kalır ki test edilebilsin.

## Güvenlik & proxy

API anahtarlarını **uygulamaya gömme**. `server/proxy.mjs` ince bir backend
proxy'dir: uygulama ona konuşur, o gerçek sağlayıcıya iletir ve anahtarı sunucu
tarafında ekler. Uygulamayı bağlamak:

```ts
import { createRealServices, proxyRealConfig } from './src/services/real';
useCookingStore.getState().setServices(
  createRealServices(proxyRealConfig('https://api.lezzet.app')),
);
```

Proxy bir iskelettir; üretimde kullanıcı oturum doğrulaması, hız sınırlama ve
uç nokta allowlist'i eklenmeli (bkz. `server/README.md`).

## Sıradaki gerçek işler (öncelik sırası)

1. ~~`services/real/` — Deepgram, ElevenLabs, Claude Vision/Intent~~ ✅
2. ~~`expo-audio` ses kaydı + `expo-camera` frame-on-demand (store'a)~~ ✅
3. ~~Anahtarlar için backend proxy iskeleti~~ ✅
4. ~~Proxy'ye Bearer token doğrulaması + anahtar başına hız sınırlama~~ ✅
5. ~~RevenueCat — abonelik iskeleti (iOS IAP + Android Play Billing)~~ ✅
6. "Ne pişsem" ekranı ve tarif seçimi
7. Tarif kütüphanesini çoğalt (graf JSON'ları)
8. EN dili (`src/i18n/en.ts`) ve global açılım

> RevenueCat native modül ister: Expo'da `expo prebuild`/dev-client ile çalışır
> (Expo Go'da değil). `REQUIRE_SUBSCRIPTION` (config) dev'de `false`; üretimde
> `true` yapıp `subscriptionStore.setBilling(createRevenueCatBilling({ iosApiKey,
> androidApiKey }))` ile gerçek SDK'ya geç.
