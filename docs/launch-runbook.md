# Launch Runbook — Lezzet

Kod tarafı hazır. Bu doküman, uygulamayı **canlıya çıkarmak** için senin yapman
gereken (kodla çözülemeyen) adımları sırayla verir. Her adımın "neden" ve "nasıl"ı
kısa tutulmuştur.

---

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

## 2. Uygulamayı proxy'ye bağla

`REQUIRE_SUBSCRIPTION` gibi, gerçek servisler de tek yerden açılır:

```ts
import { useCookingStore } from './src/state/cookingStore';
import { createRealServices, proxyRealConfig } from './src/services/real';

useCookingStore
  .getState()
  .setServices(
    createRealServices(proxyRealConfig('https://api.lezzet.app', { clientToken: userJwt })),
  );
```

> Cihaz-içi TTS (expo-speech) ve cihaz-içi STT (@react-native-voice) **anahtarsız**
> çalışır; yalnızca Vision/AI ve (isteğe bağlı) bulut STT/TTS için proxy gerekir.

## 3. Dev-client build + cihaz duman testi

**Neden:** Cihaz-içi canlı STT (@react-native-voice) ve RevenueCat **Expo Go'da
çalışmaz**; dev-client gerekir.

```bash
eas init                 # app.json'a extra.eas.projectId yazar
eas build --profile development --platform ios   # veya android / all
# kurulan dev-client'te:
npx expo start --dev-client
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
