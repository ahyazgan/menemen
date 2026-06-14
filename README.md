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
- **`src/services/notify/`** — yerel bildirim interface'i + mock + expo
  sarmalayıcı. Süreli adım başlayınca store bir bildirim planlar; ekran
  kapalıyken/arka planda süre dolunca uyarır (erken bitiş/atla/yeniden dene'de
  iptal). Saf zamanlama mantığı `engine/notifications.ts`'te ve testli.
- **`src/recipes/`** — 13 tarif grafı (menemen, sahanda/haşlanmış yumurta, çoban
  salatası, mercimek/domates çorbası, pilav, sigara böreği, tavuk sote, köfte,
  fırın tavuk, ızgara balık, kuru fasulye) + `RecipeListScreen` ("Ne pişsem?",
  **arama + kategori filtresi + favoriler** (AsyncStorage'da kalıcı), şansıma seç;
  filtre ve favori mantığı saf+testli). Her tarifte **malzeme listesi**,
  **porsiyon ayarı** (miktarlar kişi sayısına göre ölçeklenir) ve **alışveriş
  listesi** (kalıcı; işaretle/sil) — ölçekleme/etiketleme mantığı saf+testli.
  Ayrıca **malzemeye göre arama**, tarife özel **kişisel not** (kalıcı),
  kartlarda **"kaç kez pişirdin"** rozeti ve **"Elimde ne var?"** (elindeki
  malzemeleri seç → yapabileceğin tarifler, eksiği en az olandan; mantık saf+testli).
  Her graf testlerle doğrulanıyor: geçerli DAG, başlatılabilir,
  tamamlanabilir ve her **kritik** pişirme adımı iç sıcaklık eşiği taşıyor.
  Metinler **çok dilli** (`LocalizedText` + saf `localize()`): **13/13 tarif
  baştan sona TR+EN** (başlık, özet, yönerge, sesli metin, kurtarma ve güvenlik
  mesajları dahil); bir test her tarifin her metin alanında tr+en olmasını zorlar.
- **`src/i18n/`, `src/config/`** — TR + EN metinler (`setLocale`/`getLocale`,
  anahtar paritesi tsc + testle zorlanıyor), **cihaz dili tespiti**
  (`deviceLocale.ts` + saf/test edilebilir `pickSupportedLocale`), **uygulama
  içi dil değiştirme** ve **karanlık mod** (açık/karanlık tema, `config/theme.ts`
  palet, reaktif `uiStore`; ekranlar anında döner, seçim AsyncStorage'da kalıcı).
- **Haftalık menü planı** — profiline göre 7 günlük plan üretir; beğenmediğin
  günü tek tuşla değiştir; plandaki **tüm malzemeleri** (aynı malzeme+birim
  toplanarak) alışveriş listesine aktar (`WeeklyPlanScreen`, plan kalıcı). Plan
  üretimi/değişimi ve malzeme toplama saf (`recipes/mealPlan.ts`, deterministik
  tohumla testli).
- **Bana özel öner (AI)** — "canın ne çekiyor?" yazısı + profiline göre **onaylı**
  tariflerden biri önerilir (`SuggestScreen`). Saf sıralayıcı (`recipes/recommend.ts`,
  testli) hem mock hem AI'nın çevrimdışı yedeği; gerçek öneri `services/recommend`
  arayüzü arkasında **Claude (tool use)** ile — AI yalnızca verilen adaylardan seçer,
  yeni tarif/adım uydurmaz (gıda güvenliği). Dönen id doğrulanır, geçersizse yerele düşer.
- **Beceri seviyesi gerçekten etkiler** (`recipes/skill.ts`, testli) — yeni
  başlayan kolay tarifleri, ileri seviye zorları yeğler: hem AI önerisi hem
  haftalık plan sıralaması beceriye göre kademelenir (orta seviye nötr). Pişirme
  ekranında beceriye göre **adım sayacı** ve yeni başlayana **ipucu** gösterilir.
- **Kişisel profil ("AI seni tanısın")** — diyet (hepsi/vejetaryen/vegan),
  yemediğin/kaçındığın malzemeler ve beceri seviyesi (`ProfileScreen`,
  kalıcı). Tarif listesi profile göre süzülür: diyete uymayan ya da kaçınılan
  malzeme içeren tarifler gizlenir; kartlarda **zorluk** rozeti. Diyet türetimi
  ve süzme mantığı saf (`recipes/profile.ts`) ve testli.
- **Adım fotoğrafı** — pişirirken bir adıma kendi fotoğrafını ekleme
  (`expo-image-picker` ile tek kare, frame-on-demand; sürekli akış yok). Saf
  harita mantığı `recipes/stepPhotos.ts`'te ve testli; çekim `services/photo`
  arayüzü arkasında (mock + expo), seçim `stepPhotosStore`'da kalıcı.

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

> 📱 **Telefonda denemek** için adım adım kılavuz: [`RUN.md`](./RUN.md)
> (en hızlısı: `npx expo start` + telefonda Expo Go ile QR okutma).

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
  createRealServices(proxyRealConfig('https://api.lezzet.app', { clientToken: userJwt })),
);
```

Proxy artık **JWT doğrulaması (HS256 / RS256 / JWKS)**, anahtar başına **hız
sınırlama**, **uç nokta allowlist'i**, **gövde boyut limiti** ve **gözlem**
(`/health`, Prometheus `/metrics`, `reqId`'li JSON log) içeriyor; hepsi testli.
Kalan üretim işleri (uzak JWKS çekme, OpenTelemetry) `server/README.md`'de.

## Sıradaki gerçek işler (öncelik sırası)

1. ~~`services/real/` — Deepgram, ElevenLabs, Claude Vision/Intent~~ ✅
2. ~~`expo-audio` ses kaydı + `expo-camera` frame-on-demand (store'a)~~ ✅
3. ~~Anahtarlar için backend proxy iskeleti~~ ✅
4. ~~Proxy'ye Bearer token doğrulaması + anahtar başına hız sınırlama~~ ✅
5. ~~RevenueCat — abonelik iskeleti (iOS IAP + Android Play Billing)~~ ✅
6. ~~"Ne pişsem" ekranı ve tarif seçimi~~ ✅
7. ~~Tarif kütüphanesini çoğalt~~ ✅ (13 tarif; istendikçe eklenir)
8. ~~EN dili (`src/i18n/en.ts`) + locale altyapısı~~ ✅

> EN dili UI metinlerini kapsar; cihaz dili tespiti eklendi (App açılışta
> `initLocaleFromDevice()`). Tarif içeriği de tamamen çok dilli: **13/13 tarif**
> başlık/özet/adım metinleriyle TR+EN. Üçüncü bir dil eklemek artık yalnızca
> `src/i18n/<dil>.ts` + tariflere o dil anahtarını eklemekten ibaret.

> RevenueCat native modül ister: Expo'da `expo prebuild`/dev-client ile çalışır
> (Expo Go'da değil). `REQUIRE_SUBSCRIPTION` (config) dev'de `false`; üretimde
> `true` yapıp `subscriptionStore.setBilling(createRevenueCatBilling({ iosApiKey,
> androidApiKey }))` ile gerçek SDK'ya geç.

## Derleme (EAS) & cihaz duman testi

`eas.json` üç profil tanımlar: `development` (dev-client + iOS simülatör),
`preview` (dahili dağıtım), `production`. Uygulama config'i yerelde doğrulandı
(`npx expo config` temiz: bundle id'ler, arka plan ses `UIBackgroundModes:[audio]`,
mikrofon/kamera izin metinleri, Android izinleri).

> **Not:** Gerçek `eas build` bir Expo hesabı (`eas login`) ve bulut derleme
> gerektirir; cihaz duman testi de fiziksel cihaz/simülatör ister. Bunlar bu
> repoda çalıştırılamaz — aşağıdaki komutları kendi ortamında çalıştır.

```bash
npm i -g eas-cli           # bir kez
eas login                  # Expo hesabı
eas init                   # projectId üretir (app.json'a extra.eas.projectId)
eas build --profile development --platform ios   # veya android / all
# dev-client'i cihaza/simülatöre kur, ardından:
npx expo start --dev-client
```

### Cihaz duman-testi kontrol listesi
1. Uygulama açılır; cihaz dili TR/EN ise arayüz o dilde gelir (aksi halde TR).
2. "Ne pişsem?" listesi 13 tarifi gösterir; bir tarif seç → adımlar görünür.
3. **Mikrofon izni** istenir; bas-konuş kaydı `store.listen` tetikler (mock veya
   proxy üzerinden gerçek STT).
4. **Kamera izni** istenir; "tencereye bak" tek kare çeker (frame-on-demand),
   Vision yanıtı **gözlem + öneri** verir (kritik adımda asla "tamam" demez).
5. Zamanlayıcılı adımda geri sayım işler; süre dolunca otomatik tamamlanır.
   Uygulama arka plandayken/ekran kapalıyken **bildirim** ile uyarır (izin sorulur).
6. Kritik güvenlik adımı (örn. tavuk/balık) **atlanamaz** (uyarı gösterilir).
7. Ekran kilitliyken/arka planda sesli yönlendirme devam eder (`UIBackgroundModes`).
8. (Üretim) `REQUIRE_SUBSCRIPTION=true` ile paywall kapısı; satın alma sonrası geçiş.
