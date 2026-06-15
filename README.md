# Lezzet — Canlı Mutfak Rehberi

Kullanıcı yemek yaparken yanında duran, sesle adım adım yönlendiren, ara sıra
tencereye bakıp durum yorumlayan, sıkışınca kurtaran bir AI mutfak rehberi.
Tarif uygulaması değil — **canlı deneyim**. Ayrıntılı ürün/teknik kuralları için
[`CLAUDE.md`](./CLAUDE.md) (projenin anayasası).

## Bu repoda ne var

Uçtan uca çalışan uygulama — çekirdek deneyim, büyüme/monetizasyon, kişiselleştirme
ve canlı ses temeli (aşağıda "Büyüme, kişiselleştirme ve canlı ses" başlığı):

- **`src/engine/`** — saf TypeScript tarif motoru (React/Expo importu yok).
  Tarifi yürütülebilir bir grafa çevirir; bağımlılık, paralel iş, zamanlayıcı,
  kurtarma ve gıda güvenliği kuralını yönetir. **Test edildi ve çalışıyor.**
- **`src/services/`** — `stt`/`tts`/`vision`/`intent` arayüzleri, UI'ı servissiz
  test etmek için `mock/` implementasyonları ve **`real/`** gerçek entegrasyonlar:
  Deepgram (STT), ElevenLabs (TTS), Claude Vision + Claude Intent (tool use).
  Vision gıda güvenliği kuralına uyar (kesin hüküm yok). Store, `setServices` ile
  mock'tan gerçeğe geçer.
- **Cihaz-içi sesli yönlendirme (anahtarsız)** — `services/speech/expoSpeechTTS.ts`
  telefonun yerleşik TTS'iyle konuşur (`expo-speech`; **anahtar/proxy gerekmez**,
  Expo Go'da çalışır). Uygulama açılışta TTS'i buna bağlar (`cookingStore.setTts`),
  böylece adım girişleri/tamamlanmaları, kurtarma ve "yemek hazır" otomatik
  seslendirilir. Pişirme ekranında **🔊 Tekrar et**; Ayarlar'da **aç/kapa + hız**
  (yavaş/normal/hızlı, kalıcı) + **Sesi dene**. Bulut TTS (ElevenLabs) gerekince
  `services/real` ile değiştirilir.
- **Sesli komut anlama (anahtarsız)** — `engine/intent.ts` saf, **testli** kural
  tabanlı NLU (TR+EN): "sonraki / tekrar et / ne kadar kaldı / yaktım …" gibi
  komutları Claude/anahtar olmadan niyete çevirir (yerel Intent servisi bunu sarar).
  Girdi üç yoldan gelebilir: **cihaz-içi canlı tanıma** (`services/stt`,
  `@react-native-voice/voice`; **dev-client gerektirir**, dinamik import → Expo
  Go'da güvenle yedeğe düşer), eski **kayıt → STT** yolu (mock/Deepgram cloud) ve
  pişirme ekranındaki **yazılı komut** kutusu (her yerde çalışır). Bulut STT
  (Deepgram) gerekince `services/real` ile devreye girer.
- **`src/state/cookingStore.ts`** — motoru Zustand'a saran durum makinesi;
  servisleri buraya bağlar. Ekranlar yalnızca buradaki action'ları çağırır.
- **`src/screens/CookingScreen.tsx`** — canlı pişirme ekranı (sadece UI).
- **`src/components/`** — `VoiceButton` (cihaz-içi canlı tanıma → yedek kayıt) ve
  **profesyonel `PotCheckButton`**: frame-on-demand kamera (sürekli akış YOK),
  **çerçeve kılavuzu + fener + kamera çevir**, analiz sırasında spinner ve
  ardından **Vision sonucu** (gözlem + öneri; **kritik adımda** öneri yerine
  güvenlik uyarısı — asla "pişti" denmez). Sonuç pişirme ekranında da kalıcı
  kart olarak görünür. İkisi de yalnızca store action'larını çağırır.
- **`server/proxy.mjs`** — anahtarları istemciden çıkaran sıfır-bağımlılık
  backend proxy iskeleti (`npm run proxy`).
- **`src/services/billing/`** — abonelik (RevenueCat) interface'i + mock + gerçek
  sarmalayıcı; `subscriptionStore` ve `Paywall`/`SubscriptionGate`. iOS Apple IAP,
  Android Play Billing; uygulama içi IAP-dışı dijital ödeme YOK (CLAUDE.md).
- **`src/services/notify/`** — yerel bildirim interface'i + mock + expo
  sarmalayıcı. Süreli adım başlayınca store bir bildirim planlar; ekran
  kapalıyken/arka planda süre dolunca uyarır (erken bitiş/atla/yeniden dene'de
  iptal). Saf zamanlama mantığı `engine/notifications.ts`'te ve testli.
- **`src/recipes/`** — 50 tarif grafı (kahvaltı: menemen, omlet, kaşarlı/sahanda/
  haşlanmış yumurta, sucuklu yumurta, yumurtalı ekmek, peynirli tost, gözleme,
  pankek; çorba: mercimek/domates/ezogelin/sebze/yayla/brokoli/mantar/ıspanak/
  tavuk/balık; salata: çoban/patates/mevsim/roka salatası, cacık, piyaz, kısır;
  pilav: pilav, bulgur/tavuklu/iç/nohutlu/şehriyeli pilav; ana yemek: sigara
  böreği, tavuk sote, köfte, fırın tavuk, ızgara balık, kuru/zeytinyağlı fasulye,
  nohut yemeği, fırında sebze, karnıyarık, imam bayıldı, mercimek köftesi, biber
  dolması, lahana sarma, tavuk şiş, kuzu pirzola, patlıcan musakka) +
  `RecipeListScreen` ("Ne pişsem?",
  **arama + kategori filtresi + favoriler** (AsyncStorage'da kalıcı), şansıma seç;
  filtre ve favori mantığı saf+testli). Her tarifte **malzeme listesi**,
  **porsiyon ayarı** (miktarlar kişi sayısına göre ölçeklenir) ve **alışveriş
  listesi** (kalıcı; işaretle/sil) — ölçekleme/etiketleme mantığı saf+testli.
  Ayrıca **malzemeye göre arama**, tarife özel **kişisel not** (kalıcı),
  kartlarda **"kaç kez pişirdin"** rozeti ve **"Elimde ne var?"** (elindeki
  malzemeleri seç → yapabileceğin tarifler, eksiği en az olandan; mantık saf+testli).
  Tarife dokununca önce **önizleme** (`RecipePreviewScreen`: özet, süre/porsiyon/
  zorluk/diyet rozetleri, malzemeler + porsiyon, tüm adımlar) açılır; "Pişirmeye
  başla" ile canlı pişirmeye geçilir. Her graf testlerle doğrulanıyor: geçerli DAG,
  başlatılabilir, tamamlanabilir ve her **kritik** pişirme adımı iç sıcaklık eşiği taşıyor.
  Metinler **çok dilli** (`LocalizedText` + saf `localize()`): **50/50 tarif
  baştan sona TR+EN** (başlık, özet, yönerge, sesli metin, kurtarma ve güvenlik
  mesajları dahil); bir test her tarifin her metin alanında tr+en olmasını zorlar.
- **`src/i18n/`, `src/config/`** — TR + EN metinler (`setLocale`/`getLocale`,
  anahtar paritesi tsc + testle zorlanıyor), **cihaz dili tespiti**
  (`deviceLocale.ts` + saf/test edilebilir `pickSupportedLocale`), **uygulama
  içi dil değiştirme** ve **karanlık mod** (açık/karanlık tema, `config/theme.ts`
  palet, reaktif `uiStore`; ekranlar anında döner, seçim AsyncStorage'da kalıcı).
- **Paylaş ("bunu yaptım, sen de dene")** — yemeği bitirince tek tuşla sistem
  paylaşım sayfasından sıcak bir mesaj + tarife **derin bağlantı** (`lezzet://`)
  paylaşılır (viral tohum). Mesaj üretimi saf (`recipes/share.ts`, testli);
  paylaşım `services/share` arkasında (mock + RN yerleşik `Share`, ek bağımlılık yok).
  Gelen bağlantı da yönetilir: uygulama `lezzet://recipe/<id>` ile açılınca
  paylaşılan tarif doğrudan açılır (`Linking` + saf/test edilebilir `parseRecipeLink`).
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
- **İlk açılış (onboarding)** — ilk girişte 3 adım: değer önerisi → hızlı diyet
  seçimi (profile yazılır) → izin gerekçeleri (mikrofon/kamera/bildirim, dürüst;
  kamera sürekli açık değil). "Görüldü" bilgisi kalıcı (`onboardingStore`); kalıcı
  değer okunana dek nötr ekran (dönen kullanıcıya onboarding görünmez).
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

## Büyüme, kişiselleştirme ve canlı ses

Çekirdek deneyimin üstüne kurulan, "ship → ölç → öğren" döngüsünü ve ürün
hendegini derinleştiren sistemler. Hepsinin saf mantığı testli; native/anahtar
gerektirenler dinamik import + flag ile **Expo Go güvenli** ve **geri alınabilir**.

- **Pişirme oturumunu sürdür** — yemek ortasında çıkarsan, tekrar açınca tarif
  listesinde "kaldığın yerden devam et?" çıkar (aktif tarif + tamamlanan adımlar
  kalıcı). Motor `restore()` + saf `recipes/session.ts` (testli) + `cookSessionStore`.
- **Streak / gamification** — günlük pişirme serisi (🔥 N gün + haftalık 7 nokta),
  alışkanlık döngüsü. Saf `recipes/streak.ts` (testli) + `streakStore`.
- **"Sana özel" kişiselleştirme** — geçmişten kategori/malzeme afinitesi çıkarıp
  pişirilmemiş, zevke uygun tarifleri öne çıkarır. **Veri cihazda kalır** (gizlilik
  dostu, sunucu yok). Saf `recipes/personalize.ts` (testli).
- **In-app review** — "aha anından" sonra (2+ başarılı yemek, sürüm başına bir kez)
  mağaza puanı ister (`expo-store-review`, dinamik). Saf kapı `recipes/review.ts`.
- **Re-engagement bildirimleri** — akşam yemeği saati + "seni özledik" yerel
  dürtüleri (Ayarlar'dan aç/kapa). Saf plan `recipes/reengage.ts` (testli).
- **Referans / viral döngü** — takma adlı (PII'siz) davet kodlu derin bağlantı;
  gelen davet bir kez atfedilir. Saf `recipes/share.ts` (testli) + `referralStore`.
- **Feature-flag + remote config** — `config/flags.ts` (güvenli `sanitizeFlags`,
  testli) + `flagsStore`; proxy `/config`'ten uygulanır. A/B ve kademeli açılış için.
- **Paywall A/B varyantları** — `control / trial7 / hard` (remote config'ten);
  `paywall_view` + `subscribed` olayları varyantla → dönüşüm kıyaslanır. Saf
  `recipes/paywall.ts` (testli).
- **Aktivasyon hunisi + analitik** — `app_opened`, `onboarding_started`,
  `first_cook_completed` (kuzey yıldızı), paywall/review/nudge/referral olayları.
- **Çökme/hata raporlama** — `services/crash` (Sentry, dinamik; `SENTRY_DSN`
  doluysa) ErrorBoundary'ye bağlı; boşsa konsola düşer.
- **İçerik ölçeği (CMS'e giden yol)** — proxy `/recipes`'ten **uzaktan tarif**
  yükleme; çalışma-zamanı doğrulama + gerçek motorla DAG sınaması (bozuk olan
  düşülür), offline önbellek, paket tarifler garantili taban. Saf
  `recipes/validate.ts` (testli) + `recipeSourceStore`.
- **Canlı (full-duplex) ses — `flags.liveVoice` ile v1'de KAPALI** — kesintisiz,
  sözünü kesebildiğin (barge-in) konuşma için tam temel: saf durum makinesi
  (`engine/voiceSession.ts`, testli), `services/voice` (mock + LiveKit, dinamik),
  proxy `/voice-token` (sıfır-bağımlılık JWT) ve sunucu-taraflı AI ajanı iskeleti
  (`agent/`, LiveKit Agents: Deepgram→Claude→ElevenLabs, gıda güvenliği prompt'lu).
- **E2E test harness** — `e2e/` Maestro akışları (onboarding/keşif/pişirme) + manuel
  CI workflow'u.

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
npm run typecheck    # tsc --noEmit (CLAUDE.md gereği temiz olmalı)
npm run lint         # ESLint (TypeScript + react-hooks)
npm run format:check # Prettier biçim kontrolü (düzeltmek için: npm run format)
npm run test:engine  # saf motor birim testleri (harici bağımlılık gerekmez)
npm test             # tip kontrolü + motor + sunucu testleri
```

`test:engine`, motoru CommonJS'e derleyip `node --test` ile koşar; bu yüzden
Expo/jest kurulmadan da motor doğrulanabilir.

Her `push` (main) ve her PR'da **GitHub Actions** (`.github/workflows/ci.yml`)
`npm run lint` + `npm run format:check` + `npm test`'i (tip kontrolü + motor +
sunucu testleri) otomatik koşar.

## Mimari (katmanlı)

```
screens/   → ekranlar (sadece UI)
state/     → Zustand store (cookingStore = durum makinesi)
engine/    → saf TS graf yürütücü + durum makineleri (platformdan bağımsız, testli)
services/  → harici servisler, hep interface arkasında (mock + real)
recipes/   → tarif grafları + saf alan mantığı (filtre, plan, streak, kişiselleştirme…)
hooks/     → paylaşılan UI hook'ları (ör. useTransientFlag)
config/    → sabitler ve özellik bayrakları
```

Depo kökünde ayrıca: `server/` (anahtar-saklayan proxy, sıfır bağımlılık),
`agent/` (canlı ses AI ajanı — ayrı servis), `e2e/` (Maestro akışları).

Akış: **screens → state → services**. Ekran asla servisi doğrudan çağırmaz.
`engine` saf kalır ki test edilebilsin.

## Güvenlik & proxy

API anahtarlarını **uygulamaya gömme**. `server/proxy.mjs` ince bir backend
proxy'dir: uygulama ona konuşur, o gerçek sağlayıcıya iletir ve anahtarı sunucu
tarafında ekler. Uygulamayı bağlamak:

```ts
import { createRealServices, proxyRealConfig } from './src/services/real';
useCookingStore
  .getState()
  .setServices(
    createRealServices(proxyRealConfig('https://api.lezzet.app', { clientToken: userJwt })),
  );
```

Proxy artık **JWT doğrulaması (HS256 / RS256 / JWKS)**, anahtar başına **hız
sınırlama**, **uç nokta allowlist'i**, **gövde boyut limiti** ve **gözlem**
(`/health`, Prometheus `/metrics`, `reqId`'li JSON log) içeriyor; hepsi testli.
Ayrıca **anahtarsız** remote içerik uçları: `GET /config` (feature-flag,
`LEZZET_FLAGS`), `GET /recipes` (uzak tarifler, `LEZZET_RECIPES_FILE`) ve canlı
ses için `POST /voice-token` (sıfır-bağımlılık LiveKit JWT, secret sunucuda kalır).
Kalan üretim işleri (uzak JWKS çekme, OpenTelemetry) `server/README.md`'de.

## Durum: kod tarafı tamam

Çekirdek deneyim + büyüme + kişiselleştirme + canlı ses temeli + içerik ölçeği
kuruldu ve testli (motor/uygulama + sunucu testleri, tsc/lint/format temiz,
`npm run preflight` 0 hata). Geriye kalan iş **operasyoneldir** (kod değil),
sırasıyla `docs/launch-runbook.md`'de:

1. `eas init` → `extra.eas.projectId` (build öncesi şart; Expo hesabı gerekir).
2. Proxy'yi yayınla + `PROXY_BASE_URL`'i doldur (AI öneri/vision/bulut ses aktif).
3. Gerçek görseller (ikon/splash) + mağaza ekran görüntüleri.
4. Üretim: `REQUIRE_SUBSCRIPTION=true` + RevenueCat ürün/anahtarları.
5. Gizlilik URL'i (`PRIVACY.md` yayınla) + `docs/store-listing.md` formları.
6. Dev-client build + cihaz duman testi (aşağıdaki kontrol listesi).
7. (Opsiyonel) Canlı ses: LiveKit + `agent/` AI ajanı dağıtımı; Sentry DSN.

> EN dili UI metinlerini kapsar; cihaz dili tespiti eklendi (App açılışta
> `initLocaleFromDevice()`). Tarif içeriği de tamamen çok dilli: **50/50 tarif**
> başlık/özet/adım metinleriyle TR+EN. Üçüncü bir dil eklemek artık yalnızca
> `src/i18n/<dil>.ts` + tariflere o dil anahtarını eklemekten ibaret.

> RevenueCat native modül ister: Expo'da `expo prebuild`/dev-client ile çalışır
> (Expo Go'da DEĞİL). Bu yüzden `createRevenueCatBilling` billing barrel'ından
> re-export EDİLMEZ; uygulama açılışta Expo Go'da çökmesin diye doğrudan yoldan
> import edilir. `REQUIRE_SUBSCRIPTION` (config) dev'de `false`; üretimde `true`
> yapıp şu şekilde gerçek SDK'ya geç:
>
> ```ts
> import { createRevenueCatBilling } from './src/services/billing/revenuecat';
> useSubscriptionStore.getState().setBilling(createRevenueCatBilling({ iosApiKey, androidApiKey }));
> ```

## Derleme (EAS) & cihaz duman testi

`eas.json` üç profil tanımlar: `development` (dev-client + iOS simülatör),
`preview` (dahili dağıtım), `production`. Uygulama config'i yerelde doğrulandı
(`npx expo config` temiz: bundle id'ler, arka plan ses `UIBackgroundModes:[audio]`,
mikrofon/kamera izin metinleri, Android izinleri).

**Görseller:** `assets/` içinde marka renkli **yer tutucu** ikon/splash/adaptive/
favicon var (`npm run gen:assets` ile yeniden üretilir; `scripts/gen-assets.mjs`,
bağımlılık yok). `app.json` bunlara bağlı — EAS build config olarak hazır.
Üretimde gerçek tasarım görselleriyle değiştir (aynı dosya adları/boyutlar).

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

> **Yeni mimari:** İlk dev-client build'ini sorunsuz almak için `app.json` →
> `newArchEnabled` şimdilik **false** (RN 0.74 + bazı üçüncü-parti native modüller
> yeni mimaride sorun çıkarabilir). Uyumu doğrulayınca `true` yapılabilir.

### Cihaz duman-testi kontrol listesi

1. Uygulama açılır; cihaz dili TR/EN ise arayüz o dilde gelir (aksi halde TR).
2. "Ne pişsem?" listesi 50 tarifi gösterir; bir tarif seç → adımlar görünür.
3. **Mikrofon izni** istenir; bas-konuş kaydı `store.listen` tetikler (mock veya
   proxy üzerinden gerçek STT).
4. **Kamera izni** istenir; "tencereye bak" tek kare çeker (frame-on-demand),
   Vision yanıtı **gözlem + öneri** verir (kritik adımda asla "tamam" demez).
5. Zamanlayıcılı adımda geri sayım işler; süre dolunca otomatik tamamlanır.
   Uygulama arka plandayken/ekran kapalıyken **bildirim** ile uyarır (izin sorulur).
6. Kritik güvenlik adımı (örn. tavuk/balık) **atlanamaz** (uyarı gösterilir).
7. Ekran kilitliyken/arka planda sesli yönlendirme devam eder (`UIBackgroundModes`).
8. (Üretim) `REQUIRE_SUBSCRIPTION=true` ile paywall kapısı; satın alma sonrası geçiş.
