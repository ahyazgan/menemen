# BACKLOG.md — Work Queue

> CLAUDE.md §7 gereği sıradaki işaretsiz madde otomatik çekilir.
> Uygulama-içi boşluk analizinden (oturumdaki inceleme) türetilmiştir.

## Now (yukarıdan aşağı, durmadan)

- [ ] Ses/kamera butonları temaya uyumlu + izin reddi yönlendirmesi
  Done when: VoiceButton ve PotCheckButton `useThemeColors` ile (karanlık modda
  doğru), izin reddedilince net mesaj + "Ayarları aç" (Linking.openSettings)
  gösterir; tsc/eslint/prettier/test yeşil.
- [ ] Erişilebilirlik etiketleri
  Done when: ana etkileşimli öğeler (ses/kamera, pişirme tamam/atla/tekrar/
  duraklat, önizleme pişir+favori, ayarlar/tema) accessibilityRole+Label taşır;
  tsc/eslint yeşil.
- [ ] Adım fotoğrafları galerisi (önizlemede)
  Done when: RecipePreviewScreen, o tarif için kayıtlı adım fotoğraflarını
  küçük resimlerle gösterir (yoksa bölüm gizli); tsc/eslint/test yeşil.

## Next

- [ ] Favori boş durumu ipucu (favori filtresinde sonuç yokken açıklayıcı metin)
  Done when: favori filtresi açık ve boşken bilgilendirici mesaj görünür.

## Later

-

## Done (son ~10)

-

## Notes / blockers

- Dış engeller (kod dışı): proxy deploy + gerçek anahtarlar, telefon duman testi,
  RevenueCat/mağaza ürünleri, market & topluluk backend'i, LiveKit canlı ses.
