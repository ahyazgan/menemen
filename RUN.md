# Telefonda çalıştırma (adım adım)

İki yol var. **En hızlısı 1. yol** (Expo Go).

## 1) Hızlı önizleme — Expo Go (en kolay)

Çoğu özellik çalışır (tarifler, sesli yönlendirme arayüzü, kamera, zamanlayıcı,
favoriler, alışveriş listesi, dil). Bazı native şeyler (abonelik/RevenueCat,
bildirimlerin tamamı) Expo Go'da kısıtlıdır — onları 2. yolda görürsün.

**Bilgisayarda:**

1. [Node.js](https://nodejs.org) kurulu olsun (LTS yeter).
2. Proje klasöründe:
   ```bash
   npm install
   npx expo start
   ```
3. Terminalde bir **QR kod** çıkar.

**Telefonda:** 4. App Store / Play Store'dan **"Expo Go"** uygulamasını kur. 5. Expo Go'yu aç → QR kodu okut (iPhone'da Kamera ile de okutabilirsin). 6. Uygulama telefonunda açılır. Bilgisayar ve telefon **aynı Wi-Fi'da** olmalı.

> Takılırsan: `npx expo start --tunnel` (farklı ağ/ç güvenlik duvarı sorunlarını aşar).

## 2) Tam sürüm — dev-client / EAS (tüm özellikler)

RevenueCat, bildirimler gibi native modüllerin tamamı için gerçek bir derleme
gerekir. Bunun için bir **Expo hesabı** (ücretsiz) lazım.

```bash
npm i -g eas-cli         # bir kez
eas login                # Expo hesabınla giriş
eas init                 # projeyi bağlar (app.json'a projectId yazar)
eas build --profile development --platform ios   # veya android / all
```

Derleme Expo'nun bulutunda yapılır; bitince çıkan bağlantıdan uygulamayı
telefonuna kur. Sonra:

```bash
npx expo start --dev-client
```

ile bağlanıp geliştirmeye devam edebilirsin.

## Açılınca ne göreceksin

- **"Ne pişsem?"** ekranı: 13 tarif, arama, kategori, favoriler (★), şansıma seç,
  son pişirdiklerin, 🛒 alışveriş listesi, sağ üstte TR/EN dil değiştirme.
- Bir tarife dokun → **malzemeler + porsiyon ayarı**, adım adım yönlendirme,
  **bas-konuş** mikrofonu, **tencereye bak** kamerası, zamanlayıcılar.

> İzinler: mikrofon ve kamera ilk kullanımda sorulur. Bildirim izni pişirme
> başlayınca istenir.
