# CLAUDE.md — Lezzet (Canlı Mutfak Rehberi)

> Bu dosya projenin anayasasıdır. Her oturumda oku, kurallara uy, sapma.

## Ürün tek cümlede

Kullanıcı yemek yaparken yanında duran, sesle adım adım yönlendiren, ara sıra
tencereye bakıp durum yorumlayan, sıkışınca kurtaran bir AI mutfak rehberi.
Tarif uygulaması DEĞİL — canlı deneyim. Değer üç yerde: (1) ne pişeceğine karar,
(2) pişerken canlı yönetim, (3) ters gidince kurtarma.

## Hedef

- Platform: iOS (App Store) + Android (Google Play), tek kod tabanı.
- Pazar: Önce Türkiye / Türk mutfağı (savunulabilir hendek), sonra global.
- İş modeli: B2C abonelik (iOS’ta zorunlu olarak Apple IAP üzerinden).

## Teknik Stack (sapma yok)

- **React Native + Expo** (managed workflow, gerekince dev-client’a geç)
- **TypeScript** — strict mode, `any` yasak
- **Zustand** — global state + state machine store
- **EAS Build** — `eas build --platform all`
- Ses kaydı/çalma: `expo-audio` (gerekirse `expo-av` fallback)
- Kamera (tek kare, frame-on-demand): `expo-camera`
- Düşük gecikmeli full-duplex ses GEREKİRSE: LiveKit (v1’de değil)

## Mimari (katmanlı — sapma yok)

```
screens/      → ekranlar (sadece UI, mantık yok)
components/   → tekrar kullanılır parçalar
state/        → Zustand store'lar (cookingStore = state machine)
engine/       → tarif graf yürütücü (saf TS, platformdan bağımsız)
services/     → harici servisler (stt, tts, vision, intent) — arayüz arkasında
recipes/      → tarif graf JSON'ları
config/       → sabitler, env, izin metinleri
```

Kural: `screens` asla `services`’i doğrudan çağırmaz; `state` üzerinden geçer.
`engine` saf ve test edilebilir kalır (React/Expo importu YOK).

## State Machine (motorun kalbi)

- Tarif = yürütülebilir graf. Düğümler: action/prep/finish.
- `requires`: önce bitmesi gereken düğümler. `parallel_with`: aynı anda yürüyenler.
- Tamamlanma türleri: `user` (sesli onay), `timer` (süre), `vision` (kamera), `auto`.
- Zamanlayıcılar motor tarafından tutulur, paralel iş desteklenir.
- Her düğümde `voice_on_enter` / `voice_on_complete`.
- `recovery_rules`: “yaktım”, “çok tuzlu” → adıma bağlı kurtarma cevabı.

## GIDA GÜVENLİĞİ — KRİTİK KURAL

AI asla “kesinlikle pişti / yenebilir” demez. Özellikle et/tavuk/balık/yumurtada:

- Vision kontrolü kesin hüküm vermez, GÖZLEM + ÖNERİ verir.
- Riskli pişirmede iç sıcaklık ölçümünü öner (“tavukta iç sıcaklık 74°C olmalı”).
- Şüpheli görüntüde “biraz daha pişir” tarafında hata yap, asla “tamam” deme.
- Bu hem etik zorunluluk hem mağaza onayı için gerekli.

## MAĞAZA GEREKSİNİMLERİ (baştan göm, sonradan ekleme)

- `app.json` izin metinleri net ve dürüst:
  - Mikrofon: “Yemek yaparken sizi sesle yönlendirmek için”
  - Kamera: “Yalnızca siz isteyince tencerenizi kontrol etmek için”
- Kamera SÜREKLİ AÇIK DEĞİL — frame-on-demand. Bunu izin metninde vurgula.
- Arka plan ses: iOS `UIBackgroundModes: [audio]` — ekran kapanınca AI susmasın.
- Abonelik: iOS’ta Apple IAP zorunlu (RevenueCat öner). Android: Play Billing.
  Uygulama içinde harici ödeme (iyzico/Stripe) ile dijital abonelik SATMA.
- AI içerik riski: gıda güvenliği dili (yukarıda) onay için şart.

## Kod Standartları

- TypeScript strict, `any` yasak, fonksiyonlar küçük ve tek iş yapar.
- `services/` her zaman bir interface arkasında (test için mock’lanabilir).
- Türkçe: kullanıcıya görünen tüm metin `tr.ts`’te, i18n hazır (sonra EN).
- Sesli metinler kısa, sıcak, samimi — “annenin mutfakta olması” tonu.
- Commit öncesi: tsc –noEmit temiz olmalı.

## Yapma

- Sürekli kamera akışı açma (maliyet + gizlilik + mağaza).
- Gıda güvenliğinde kesin hüküm verme.
- iOS’ta IAP dışı dijital ödeme.
- `engine`’e React/Expo importu sokma.
- Statik tarif listesine dönüşme — değer canlı yönetimde.
