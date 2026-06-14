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

## Güvenlik notu (gerçek servisler)

`services/real/` API anahtarlarını **uygulamaya gömmemeli**. Üretimde her sağlayıcıyı
kendi backend proxy'n üzerinden çağır (Anthropic için `baseURL`, STT/TTS için kendi uç
noktaların); proxy anahtarı sunucuda tutsun. Mevcut fabrika geliştirme ve proxy
entegrasyonu içindir.

## Sıradaki gerçek işler (öncelik sırası)

1. ~~`services/real/` — Deepgram, ElevenLabs, Claude Vision/Intent~~ ✅
2. `expo-audio` ile ses kaydı + `expo-camera` ile frame-on-demand bağla (store'a)
3. Anahtarlar için backend proxy (anahtarları istemciden çıkar)
4. RevenueCat — abonelik (iOS IAP + Android Play Billing)
5. "Ne pişsem" ekranı ve tarif seçimi
6. Tarif kütüphanesini çoğalt (graf JSON'ları)
7. EN dili (`src/i18n/en.ts`) ve global açılım
