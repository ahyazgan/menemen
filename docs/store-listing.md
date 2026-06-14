# Mağaza Listeleme Metinleri — Lezzet

App Store ve Google Play başvurusu için hazır metinler. İzin gerekçeleri
`app.json`'da; gizlilik politikası `PRIVACY.md`'de. Bu dosya pazarlama/onay
metinlerini toplar.

---

## 1. Temel kimlik

| Alan                | Değer                            |
| ------------------- | -------------------------------- |
| Uygulama adı        | Lezzet — Canlı Mutfak Rehberi    |
| App Store adı (≤30) | Lezzet: Canlı Mutfak Rehberi     |
| Alt başlık (≤30)    | Sesli, adım adım yemek           |
| Kategori            | Yemek & İçecek (Food & Drink)    |
| Yaş sınırı          | 4+ (App Store) / Everyone (Play) |
| Bundle / Package    | com.lezzet.app                   |

---

## 2. Kısa açıklama (Play, ≤80 karakter)

- **TR:** Yemek yaparken seni sesle adım adım yönlendiren canlı mutfak asistanı.
- **EN:** A live kitchen assistant that guides you by voice, step by step.

## 3. Tanıtım metni (App Store promotional text, ≤170)

- **TR:** Tarif uygulaması değil, canlı deneyim. Sesle yönlendirir, tencerene
  bakıp yorumlar, ters gidince kurtarır. Türk mutfağıyla başla.
- **EN:** Not a recipe app — a live experience. Voice guidance, pot check, and
  rescue when things go wrong. Start with Turkish cuisine.

---

## 4. Uzun açıklama

### TR

**Lezzet, yemek yaparken yanında duran bir usta gibidir.**

Tarif listesi karıştırmak yerine, Lezzet seni **sesle adım adım** yönlendirir:
ne zaman ne yapacağını söyler, paralel işleri ve süreleri takip eder, "tencereye
bak" dediğinde tek kare çekip **gözlem ve öneri** verir, "yaktım / çok tuzlu"
dediğinde kurtarır.

**Neler yapabilirsin?**

- 🍳 **Canlı yönlendirme:** Eller meşgulken sesle ilerle; süreler ve paralel
  adımlar senin için takip edilir.
- ✨ **Sana özel öneri:** "Canım hafif bir çorba istiyor" de, profiline uygun
  tarifi seçsin.
- 👤 **Seni tanır:** Diyetin (vejetaryen/vegan), sevmediğin malzemeler ve beceri
  seviyene göre öneri.
- 🗓️ **Haftalık menü:** Bir haftalık plan oluştur, tüm malzemeleri tek tuşla
  alışveriş listesine aktar.
- 🧺 **Elimde ne var?** Evdeki malzemeleri seç, yapabileceklerini gör.
- 🌙 Karanlık mod, Türkçe + İngilizce, adım fotoğrafı, kişisel notlar.

**Gıda güvenliği önceliğimiz:** Lezzet asla "kesinlikle pişti" demez; gözlem ve
öneri verir, et/tavuk/balık/yumurtada iç sıcaklık kontrolünü hatırlatır.

**Gizlilik:** Hesap zorunlu değil; tercihlerin cihazında kalır. Kamera sürekli
açık değildir — yalnızca sen isteyince tek kare. Mikrofon yalnızca bas-konuş
süresince.

Türk mutfağıyla başlıyoruz; afiyet olsun!

### EN

**Lezzet is like having a pro beside you while you cook.**

Instead of scrolling recipes, Lezzet guides you **by voice, step by step**: it
tells you what to do and when, tracks timers and parallel steps, takes a single
frame when you say "check the pot" to give an **observation and suggestion**, and
rescues you when you say "I burned it / too salty".

**What you can do**

- 🍳 **Live guidance** with hands busy; timers and parallel steps tracked for you.
- ✨ **Personal suggestions:** say "I want something light, a soup" and get a fit.
- 👤 **It knows you:** diet (vegetarian/vegan), disliked ingredients, skill level.
- 🗓️ **Weekly menu:** build a week's plan, push all ingredients to your list.
- 🧺 **What can I make?** pick what you have, see what's possible.
- 🌙 Dark mode, Turkish + English, step photos, personal notes.

**Food safety first:** Lezzet never says "definitely done" — it observes and
suggests, and reminds you to check internal temperature for meat, chicken, fish
and eggs.

**Privacy:** no account required; preferences stay on your device. The camera is
never always-on — a single frame only when you ask. The microphone runs only
while you hold to talk.

We start with Turkish cuisine — enjoy!

---

## 5. Anahtar kelimeler (App Store keywords, ≤100 karakter)

`yemek,tarif,mutfak,sesli,asistan,türk mutfağı,pişirme,menü,çorba,akıllı,cooking`

## 6. Promosyon görselleri için notlar

- Ekran görüntüleri: "Ne pişsem?" listesi, canlı pişirme (adım + süre), "Bana
  özel öner", haftalık menü, karanlık mod. (Açık + karanlık tema ayrı set.)
- Tanıtım videosunda **kamera sürekli kapalı** vurgusu (gizlilik).

---

## 7. İzin gerekçeleri (mağaza inceleme için; `app.json` ile birebir)

| İzin                    | Gerekçe                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Mikrofon                | "Yemek yaparken sizi sesle yönlendirmek için mikrofona ihtiyacımız var."                     |
| Kamera (kontrol)        | "Yalnızca siz isteyince tencerenizi kontrol etmek için kamerayı tek kare olarak kullanırız." |
| Kamera (adım fotoğrafı) | "Yalnızca siz isteyince bir adımın fotoğrafını çekmek için kamerayı kullanırız."             |
| Bildirim                | Süre dolunca, ekran kapalıyken bile hatırlatmak için.                                        |
| Arka plan ses (iOS)     | Ekran kapanınca sesli yönlendirme sürsün diye (`UIBackgroundModes: [audio]`).                |

---

## 8. Veri Güvenliği / Gizlilik etiketi formu

### Google Play — Data safety

- **Toplanan/paylaşılan veri:** Uygulama hesap tutmaz; tercihler cihazda kalır.
- **İşlenen (geçici) veri:**
  - _Ses_ (mikrofon): yalnızca bas-konuş anında, konuşma-metne çevirmek için
    işlenir; **saklanmaz**, satılmaz.
  - _Fotoğraf/kare_ (kamera): yalnızca istek üzerine tek kare, yorum için
    işlenir; **saklanmaz**, satılmaz.
  - _Uygulama içi metin_ (öneri ifadesi/profil): öneri üretmek için bir AI
    sağlayıcısına iletilir.
- **Şifreleme:** Veriler aktarımda şifrelenir (HTTPS).
- **Silme:** Cihaz verisi uygulama silinince kalkar.
- **Veri satışı:** Yok.

### App Store — Privacy Nutrition Labels

- **Data Not Collected** ağırlıklı (sunucuda hesap/profil tutulmaz).
- **Data Used to Provide the App** (linked olmayan, geçici): mikrofon sesi,
  kamera karesi, kullanıcı içeriği (öneri ifadesi) — yalnızca uygulama işlevi
  için, izleme (tracking) **yok**.

---

## 9. İnceleme (review) notları — App Store / Play

> Lezzet sesli ve görüntü-yorumlu canlı bir mutfak asistanıdır. **Gıda
> güvenliği:** AI hiçbir zaman "kesinlikle pişti/yenebilir" demez; gözlem +
> öneri verir ve et/tavuk/balık/yumurtada iç sıcaklık eşiği önerir (uygulama içi
> kalıcı uyarı mevcut). **Kamera** sürekli açık değildir; yalnızca kullanıcı
> isteyince tek kare çekilir. **Abonelik** Apple IAP / Play Billing üzerinden;
> uygulama içinde IAP dışı dijital ödeme yoktur. Test için izinleri (mikrofon/
> kamera/bildirim) onaylayın; mock servislerle de akış çalışır.

---

## 10. Destek & yasal

- Destek e-postası: **a.hakan_@hotmail.com**
- Gizlilik politikası: `PRIVACY.md` (yayında bir URL'de barındırılmalı).
- Hizmet şartları: abonelik mağaza hesabından yenilenir; istenildiğinde iptal.
