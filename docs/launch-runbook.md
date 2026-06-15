# Launch Runbook — Lezzet

Kod tarafı hazır. Bu doküman, uygulamayı **canlıya çıkarmak** için senin yapman
gereken (kodla çözülemeyen) adımları sırayla verir. Her adımın "neden" ve "nasıl"ı
kısa tutulmuştur.

---

> **İpucu:** Her adımdan sonra `npm run preflight` çalıştır — app.json ↔ config
> tutarlılığını, ikon/splash dosyalarını, bundle id'leri ve üretim ayarlarını
> denetler (gerçek bozuklukta hata, eksik üretim ayarında uyarı). Release öncesi
> `npm run preflight -- --strict` ile uyarıları da hata say.

## 0. Önkoşullar

- Expo hesabı (`npm i -g eas-cli && eas login`)
- Apple Developer hesabı (iOS) ve/veya Google Play Console hesabı (Android)
- Bir sunucu/hosting (proxy için) ve sağlayıcı anahtarları

---

## 1. Backend proxy'yi yayınla (anahtarları gizle)

**Neden:** API anahtarları uygulamaya GÖMÜLMEZ (CLAUDE.md). `server/proxy.mjs`
ince bir aracıdır: uygulama ona konuşur, o gerçek sağlayıcıya iletir ve anahtarı
sunucu tarafında ekler.

1. `.env.example`'ı `.env` olarak kopyala, sağlayıcı anahtarlarını doldur:
   - **Anthropic** (Vision + AI öneri/Intent) — en kritik
   - **Deepgram** (bulut STT — opsiyonel; cihaz-içi STT zaten var)
   - **ElevenLabs** (bulut TTS — opsiyonel; cihaz-içi TTS zaten var)
2. **Docker ile (önerilir, tek komut)** — repo kökünden:
   ```bash
   docker build -f server/Dockerfile -t lezzet-proxy .
   docker run -p 8787:8787 --env-file .env lezzet-proxy
   ```
   (Docker'sız: `npm run proxy`.) Proxy sıfır bağımlılıktır (saf Node).
3. Açılışta **yapılandırma özeti** loglanır (hangi anahtar var/yok, auth modu) —
   yanlış kurulum hemen görünür. Üretimde `LEZZET_JWT_SECRET` veya
   `LEZZET_PROXY_TOKENS` ayarla (yoksa auth KAPALI uyarısı çıkar).
4. JWT doğrulaması + hız sınırı + allowlist zaten açık. Sağlık: `GET /health`,
   ölçüm: `GET /metrics`.

## 2. Uygulamayı proxy'ye bağla (tek satır)

`src/config/index.ts` içinde **`PROXY_BASE_URL`**'i doldurman yeterli:

```ts
export const PROXY_BASE_URL = 'https://api.lezzet.app';
export const PROXY_CLIENT_TOKEN = ''; // gerekiyorsa Bearer token
```

Dolu olunca App açılışta gerçek servisleri **otomatik** bağlar (Claude
vision/intent + AI öneri + bulut STT) ve olayları proxy'ye gönderir. Kod
düzenlemen gerekmez; boş bırakırsan mock/yerel kalır.

> Cihaz-içi TTS (expo-speech) ve cihaz-içi STT (@react-native-voice) **anahtarsız**
> çalışır ve proxy bağlanınca da **korunur** (ses cihazda kalır). Yalnızca
> Vision/AI ve (isteğe bağlı) bulut STT için proxy gerekir. İleri kullanım için
> `setServices(createRealServices(proxyRealConfig(...)))` ile elle de bağlanabilir.

### 2.1 Remote içerik (feature-flag + uzak tarifler) — anahtarsız

Proxy iki **anahtarsız** uç sunar; uygulama ikisini de doğrular, boşsa
varsayılan/paket içerik kalır:

- **`GET /config`** → `LEZZET_FLAGS` ortam değişkenindeki feature-flag JSON'u.
  A/B için segmentlere göre üretebilirsin. Örn:
  `LEZZET_FLAGS={"paywallVariant":"trial7","liveVoice":false}`
- **`GET /recipes`** → `LEZZET_RECIPES_FILE` yolundaki JSON tarif dizisi (uzak/CMS
  içeriği). Uygulama doğrular; bozuk olanı düşürür, paket tarifleri korur.

Açılış özetinde her ikisinin ayarlı olup olmadığı görünür.

## 3. Dev-client build + cihaz duman testi

**Neden:** Cihaz-içi canlı STT (@react-native-voice) ve RevenueCat **Expo Go'da
çalışmaz**; dev-client gerekir.

```bash
eas init                 # app.json'a extra.eas.projectId yazar (Expo hesabın gerekir)
eas build --profile development --platform ios   # veya android / all
# kurulan dev-client'te:
npx expo start --dev-client
```

> **`eas init` SENDE:** `app.json` → `extra.eas.projectId` Expo hesabına bağlı
> gerçek bir kimlik üretir; elle uydurma yazma. Bu adım yapılmadan build alınamaz
> (preflight de uyarır).

> **Yeni mimari (New Architecture):** İlk build'i sorunsuz almak için
> `app.json` → `newArchEnabled` şimdilik **false** (RN 0.74 + bazı üçüncü-parti
> native modüller — voice/purchases — yeni mimaride sorun çıkarabilir). Modüllerin
> uyumunu doğruladıktan sonra `true` yapabilirsin.

### 3.1 Opsiyonel native paketler (özelliği açarken kur)

Kod bu paketleri **dinamik import** eder; yoksa ilgili özellik sessizce atlanır.
İlgili özelliği açacağın zaman kur:

```bash
npx expo install expo-store-review      # in-app review (mağaza puanı)
npx expo install @sentry/react-native   # çökme raporlama (config/SENTRY_DSN ile)
npx expo install @livekit/react-native  # canlı full-duplex ses (flags.liveVoice)
```

Kontrol listesi: `README.md` → "Cihaz duman-testi kontrol listesi".

## 4. Abonelik (RevenueCat)

1. App Store Connect / Play Console'da abonelik ürünlerini oluştur.
2. RevenueCat projesi aç, ürünleri bağla, iOS/Android API anahtarlarını al.
3. Uygulamada üretimde gerçek SDK'ya geç:

```ts
import { createRevenueCatBilling } from './src/services/billing/revenuecat';
useSubscriptionStore.getState().setBilling(createRevenueCatBilling({ iosApiKey, androidApiKey }));
```

4. `config/index.ts` → `REQUIRE_SUBSCRIPTION = true` (üretim).

## 4.5 Canlı (full-duplex) ses — LiveKit (opsiyonel, v1'de KAPALI)

**Neden:** Asıl ürün hendegi: kesintisiz, sözünü kesebildiğin gerçek-zamanlı
konuşma. CLAUDE.md: v1'de değil → `flags.liveVoice` varsayılan **false**. Kod
tarafı temel hazır (durum makinesi + servis + UI); açmak için altyapı gerekir.

1. **LiveKit projesi** aç (LiveKit Cloud veya self-host). API key/secret + WS URL al.
2. **Proxy**: `.env` → `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_WS_URL`.
   Proxy `POST /voice-token` ile kısa ömürlü oda token'ı imzalar (secret sunucuda
   kalır; uygulamaya gömülmez). Açılış özetinde "LiveKit (canlı ses): ✓" görünür.
3. **App**: `src/config/index.ts` → `LIVEKIT_WS_URL`'i doldur. `PROXY_BASE_URL`
   dolu + `LIVEKIT_WS_URL` dolu olunca App gerçek LiveKit servisini bağlar (yoksa
   mock kalır). Native modül: `npx expo install @livekit/react-native` + dev-client.
4. **Flag**: remote config'ten (`/config`) `{ "liveVoice": true }` döndür ya da
   `DEFAULT_FLAGS.liveVoice`'i true yap. Önce küçük bir kullanıcı yüzdesinde aç.
5. **AI ajanı (SENDE — en kritik parça)**: Odaya sunucu-taraflı bir ajan
   katılmalı (LiveKit Agents): kullanıcı sesi → STT (Deepgram) → LLM (Claude,
   pişirme bağlamıyla) → TTS (ElevenLabs) → odaya geri ses. Gecikme bütçesi
   < ~1.5 sn (akışlı STT/LLM/TTS + VAD turn-detection). Gıda güvenliği dili
   (CLAUDE.md) ajan prompt'una da gömülmeli.
6. **Maliyet/gizlilik**: Canlı modda mikrofon süreklidir → net gösterge + tek
   dokunuş sustur/bitir (UI'da var). Maliyet kontrolü: opt-in mod, oturum süre
   sınırı, yalnızca abonelere açma. Mağaza incelemesinde sürekli dinlemeyi
   gerekçelendir; mikrofon izin metnini canlı modu kapsayacak şekilde güncelle.

## 5. Görseller (tasarım)

`assets/` içindeki **yer tutucu** ikon/splash/adaptive/favicon'ı gerçek
tasarımla değiştir (aynı dosya adları/boyutlar; `npm run gen:assets` referans).
Mağaza için ekran görüntüleri hazırla (`docs/store-listing.md` notlarına bak).

## 6. Yasal & mağaza

- `PRIVACY.md`'yi bir **URL'de yayınla** (mağaza gizlilik linki ister).
- `docs/store-listing.md`'deki başlık/açıklama/anahtar kelime/veri güvenliği
  cevaplarını mağaza formlarına gir.
- İnceleme notlarını (gıda güvenliği duruşu, kamera frame-on-demand, IAP) ekle.

## 7. Üretim build & gönderim

```bash
eas build --profile production --platform all
eas submit --platform ios       # ve/veya android
```

---

## Hızlı durum

| Parça                              | Durum                                |
| ---------------------------------- | ------------------------------------ |
| Uygulama kodu (UI, motor, akış)    | ✅ hazır                             |
| Cihaz-içi TTS + STT (anahtarsız)   | ✅ hazır (STT dev-client ister)      |
| Kamera yakalama + Vision sonuç UX  | ✅ hazır                             |
| CI, lint, testler                  | ✅ yeşil                             |
| Yer tutucu görseller + app.json    | ✅ hazır (gerçek tasarımla değiştir) |
| Proxy deploy + anahtarlar          | ⏳ sende                             |
| RevenueCat + mağaza ürünleri       | ⏳ sende                             |
| Gizlilik URL'i + ekran görüntüleri | ⏳ sende                             |
| Mağaza hesapları + gönderim        | ⏳ sende                             |
