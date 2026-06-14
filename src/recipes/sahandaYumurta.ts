/**
 * Sahanda Yumurta — hızlı tarif. Pişirme adımı güvenlik açısından KRİTİK
 * (yumurta akı tam tutmalı; bkz. gıda güvenliği kuralı).
 */
import type { Recipe } from '../engine/types';

export const sahandaYumurta: Recipe = {
  id: 'sahanda-yumurta',
  title: 'Sahanda Yumurta',
  servings: 1,
  locale: 'tr',
  summary: 'Tereyağında, dakikalar içinde hazır kahvaltılık.',
  totalMinutes: 7,
  nodes: [
    {
      id: 'heat_pan',
      title: 'Tavayı ısıt',
      instruction: 'Tavada bir parça tereyağını orta ateşte erit.',
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: 'Tavaya tereyağı koy, orta ateşte eritelim.',
      recovery_rules: { yaktim: 'Tereyağı karardıysa dökme, tavayı sil, yenisini koy ve ateşi kıs.' },
    },
    {
      id: 'crack_eggs',
      title: 'Yumurtaları kır',
      instruction: 'Yumurtaları doğrudan tavaya kır.',
      kind: 'action',
      requires: ['heat_pan'],
      completion: 'user',
      voice_on_enter: 'Yumurtaları yavaşça tavaya kır.',
    },
    {
      id: 'cook',
      title: 'Pişir',
      instruction: 'Yumurta akı tamamen tutana kadar kısık ateşte pişir.',
      kind: 'action',
      requires: ['crack_eggs'],
      completion: 'user',
      durationSec: 180,
      safety: {
        critical: true,
        message:
          'Yumurta akı tamamen donmalı (akışkan beyaz kalmasın). Akışkan sarı sevsen de hamile, çocuk ve bağışıklığı düşük kişiler için tam pişmiş güvenlidir.',
        minInternalTempC: 71,
      },
      voice_on_enter: 'Kısık ateşte, akı tutana kadar pişirelim.',
      voice_on_complete: 'Akın tamamen tuttuğundan emin ol.',
    },
    {
      id: 'serve',
      title: 'Servis et',
      instruction: 'Tuz, karabiber serp ve sıcak servis et.',
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: 'Tuz karabiber serp, afiyet olsun!',
    },
  ],
};
