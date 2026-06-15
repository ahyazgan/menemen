# E2E testleri — Maestro

Kritik kullanıcı akışlarının uçtan uca duman testleri. [Maestro](https://maestro.mobile.dev/)
ile çalışır (YAML akışları, native modül gerektirmez).

## Akışlar

- `flows/onboarding.yaml` — açılış → 3 adımlık onboarding → ana ekran
- `flows/discovery.yaml` — arama → sonuç
- `flows/cook.yaml` — tarif seç → önizleme → canlı pişirme ekranı (smoke)

## Önkoşul

Maestro **gerçek/öykünücü cihazda** kurulu bir uygulama gerektirir (Expo Go değil;
`eas build` veya yerel dev-client). Uygulama paketi: `com.lezzet.app`.

```bash
# Maestro kur
curl -Ls "https://get.maestro.mobile.dev" | bash

# Uygulamayı cihaza/öykünücüye kur (örn. dev-client APK), sonra:
maestro test e2e/flows
```

## Notlar

- Akışlar şu an **görünür Türkçe metinle** eşleşir (`tr.ts`). Daha sağlam ve
  dilden bağımsız akışlar için kritik etkileşimli öğelere `testID` eklenebilir
  (ör. "Pişirmeye başla", "Tamam, bitti"); sonra akışlar `id:` ile eşleşir.
- Adım-tamamlama (yemeği bitirme) akışı tarif grafına bağlıdır; testID eklendikten
  sonra tam pişirme turu (her adımı tamamlayıp "Yemek hazır, afiyet olsun!"e ulaşma)
  betiğe dökülebilir.
- CI: `.github/workflows/e2e.yml` (manuel `workflow_dispatch`) — bir uygulama
  paketi + öykünücü gerektirir; PR CI'ını bloklamaz.
