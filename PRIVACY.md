# Gizlilik Politikası — Lezzet

_Son güncelleme: 2026-06-14_

Bu politika, **Lezzet — Canlı Mutfak Rehberi** mobil uygulamasının ("Uygulama")
kişisel verileri nasıl işlediğini açıklar. Lezzet, yemek yaparken sizi sesle
yönlendiren canlı bir mutfak asistanıdır. Gizliliğinizi ciddiye alıyoruz:
**veri toplamayı en aza indiriyor, sattığımız hiçbir veri olmuyor.**

> İngilizce sürüm için aşağıdaki "English" bölümüne bakın.

## Kısaca

- Hesap **zorunlu değil**. Tercihleriniz (dil, tema, profil, favoriler, notlar,
  alışveriş listesi, plan, geçmiş) **yalnızca cihazınızda** saklanır.
- Mikrofon ve kamera **sürekli açık değildir**; yalnızca siz başlattığınızda,
  o ana özel olarak kullanılır.
- Sesli yönlendirme, görüntü yorumu ve AI önerisi için veriler **güvenli bir
  aracı sunucu (proxy)** üzerinden hizmet sağlayıcılara iletilir. Veriler bu iş
  için kullanılır; **reklam için satılmaz**.
- Çocuklara yönelik değildir.

## Hangi verileri, neden işliyoruz?

### 1. Cihazda saklanan tercihler (sunucuya gitmez)

Dil ve tema seçimi, beslenme profili (diyet, kaçındığınız malzemeler, beceri),
favoriler, tarife özel notlar, alışveriş listesi, haftalık menü planı, adım
fotoğrafları ve pişirme geçmişi cihazınızın yerel deposunda (AsyncStorage)
tutulur. Bu veriler **bizim sunucularımıza gönderilmez**; uygulamayı silerseniz
silinir.

### 2. Mikrofon (yalnızca siz "bas-konuş" yapınca)

Sizi sesle yönlendirebilmek için, **yalnızca konuşma düğmesine bastığınız süre
boyunca** ses kaydedilir ve metne çevrilmesi için konuşma-metin hizmetimize
(aracı sunucu üzerinden) iletilir. Ses kaydı uygulamada **kalıcı olarak
saklanmaz**.

### 3. Kamera (yalnızca siz "tencereye bak" deyince)

Tencerenizin durumunu yorumlayabilmek için, **yalnızca siz istediğinizde tek bir
kare** çekilir ve görüntü-yorum hizmetimize iletilir. **Sürekli kamera akışı
yoktur.** Kareler kalıcı olarak saklanmaz.

> **Gıda güvenliği:** AI "kesinlikle pişti / yenebilir" demez; gözlem ve öneri
> verir. Et, tavuk, balık ve yumurtada iç sıcaklık kontrolü önerilir.

### 4. AI önerisi ve yönlendirme metni

"Bana özel öner" gibi özelliklerde, ifadeniz ve profiliniz (diyet/beceri/
kaçındıklarınız) bir dil modeli hizmetine (aracı sunucu üzerinden) iletilir.
AI **yalnızca uygulamadaki onaylı tarifler arasından** seçim yapar.

### 5. Abonelik

Abonelik satın alımları **Apple App Store / Google Play** üzerinden yürütülür ve
ilgili mağazanın kurallarına tabidir. Ödeme bilgilerinizi biz görmeyiz. Abonelik
durumunu yönetmek için bir abonelik altyapısı (ör. RevenueCat) kullanılabilir.

## Verileri kimlerle paylaşıyoruz?

Yalnızca yukarıdaki işlevleri sağlamak için gereken **hizmet sağlayıcılarla**:

- **Konuşma-metin** sağlayıcısı (sesli komutlarınızı metne çevirmek için)
- **Metin-konuşma** sağlayıcısı (yönlendirmeyi seslendirmek için)
- **Dil modeli / görüntü yorumu** sağlayıcısı (öneri ve tencere yorumu için)
- **Abonelik / mağaza** sağlayıcıları (Apple, Google ve abonelik altyapısı)

Bu sağlayıcılara giden veriler **yalnızca ilgili işlev için** kullanılır.
Verilerinizi **reklam amacıyla satmıyoruz**.

## Saklama ve güvenlik

- Cihaz içi veriler uygulamayı silince gider.
- Ses/görüntü kareleri uygulamada kalıcı tutulmaz.
- API anahtarları **uygulamaya gömülmez**; çağrılar sunucu tarafında anahtar
  ekleyen aracı sunucudan geçer.

## Haklarınız

Cihaz içi verileri uygulama içinden temizleyebilir veya uygulamayı silerek
tümünü kaldırabilirsiniz. Sorular için: **a.hakan_@hotmail.com**

## Çocuklar

Uygulama 13 yaş altı çocuklara yönelik değildir ve bilerek onlardan veri
toplamaz.

## Değişiklikler

Bu politikayı güncelleyebiliriz; önemli değişikliklerde uygulama içinde veya bu
sayfada bilgilendiririz. "Son güncelleme" tarihini takip edin.

---

# Privacy Policy — Lezzet (English)

_Last updated: 2026-06-14_

This policy explains how **Lezzet — Live Kitchen Guide** ("the App") handles
personal data. Lezzet is a live cooking assistant that guides you by voice while
you cook. We **minimize data collection and never sell your data.**

## In short

- **No account required.** Your preferences (language, theme, profile,
  favorites, notes, shopping list, plan, history) are stored **only on your
  device**.
- The microphone and camera are **never always-on**; they are used only when you
  start them, for that moment.
- For voice guidance, image interpretation and AI suggestions, data is sent
  through a **secure backend proxy** to service providers, used only for that
  purpose and **never sold for advertising**.
- Not directed to children.

## What we process and why

1. **On-device preferences** (never sent to our servers): language/theme,
   dietary profile, favorites, per-recipe notes, shopping list, weekly plan,
   step photos and cooking history. Removed when you delete the App.
2. **Microphone** (only while you hold to talk): audio is captured **only while
   the talk button is held** and sent to our speech-to-text provider (via the
   proxy). Not stored persistently.
3. **Camera** (only when you ask to check the pot): a **single frame** is
   captured only on demand and sent to our vision provider. **No continuous
   camera stream.** Frames are not stored persistently.
4. **AI suggestions/guidance**: your phrasing and profile are sent to a language
   model provider (via the proxy). The AI only selects among the App's
   **approved recipes**.
5. **Subscriptions**: handled by **Apple App Store / Google Play**; we never see
   your payment details. A subscription backend (e.g. RevenueCat) may be used to
   manage status.

> **Food safety:** the AI never gives a definitive "cooked/safe" verdict; it
> offers observations and suggestions, and recommends checking internal
> temperature for meat, chicken, fish and eggs.

## Sharing

Only with **service providers** needed to deliver the above features
(speech-to-text, text-to-speech, language/vision model, subscription/store
providers). Data sent to them is used **only** for the relevant feature. We do
**not** sell your data.

## Retention & security

On-device data is removed when you delete the App. Audio/image frames are not
kept persistently. API keys are **never embedded in the App**; calls go through
a backend proxy that adds keys server-side.

## Your rights

Clear on-device data within the App or delete the App to remove everything.
Questions: **a.hakan_@hotmail.com**

## Children

Not directed to children under 13; we do not knowingly collect their data.

## Changes

We may update this policy; we'll note material changes in the App or on this
page. Watch the "Last updated" date.
