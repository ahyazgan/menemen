/**
 * Sahanda Yumurta — hızlı tarif. Pişirme adımı güvenlik açısından KRİTİK
 * (yumurta akı tam tutmalı; bkz. gıda güvenliği kuralı).
 */
import type { Recipe } from '../engine/types';

export const sahandaYumurta: Recipe = {
  id: 'sahanda-yumurta',
  title: { tr: 'Sahanda Yumurta', en: 'Fried Eggs' },
  servings: 1,
  locale: 'tr',
  summary: {
    tr: 'Tereyağında, dakikalar içinde hazır kahvaltılık.',
    en: 'A buttery breakfast ready in minutes.',
  },
  totalMinutes: 7,
  nodes: [
    {
      id: 'heat_pan',
      title: { tr: 'Tavayı ısıt', en: 'Heat the pan' },
      instruction: {
        tr: 'Tavada bir parça tereyağını orta ateşte erit.',
        en: 'Melt a knob of butter in the pan over medium heat.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Tavaya tereyağı koy, orta ateşte eritelim.',
        en: "Add butter to the pan and let's melt it over medium heat.",
      },
      recovery_rules: {
        yaktim: {
          tr: 'Tereyağı karardıysa dökme, tavayı sil, yenisini koy ve ateşi kıs.',
          en: 'If the butter browned, toss it, wipe the pan, add fresh butter and lower the heat.',
        },
      },
    },
    {
      id: 'crack_eggs',
      title: { tr: 'Yumurtaları kır', en: 'Crack the eggs' },
      instruction: {
        tr: 'Yumurtaları doğrudan tavaya kır.',
        en: 'Crack the eggs straight into the pan.',
      },
      kind: 'action',
      requires: ['heat_pan'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yumurtaları yavaşça tavaya kır.',
        en: 'Gently crack the eggs into the pan.',
      },
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Yumurta akı tamamen tutana kadar kısık ateşte pişir.',
        en: 'Cook over low heat until the egg whites are fully set.',
      },
      kind: 'action',
      requires: ['crack_eggs'],
      completion: 'user',
      durationSec: 180,
      safety: {
        critical: true,
        message: {
          tr: 'Yumurta akı tamamen donmalı (akışkan beyaz kalmasın). Akışkan sarı sevsen de hamile, çocuk ve bağışıklığı düşük kişiler için tam pişmiş güvenlidir.',
          en: 'The egg whites must be fully set (no runny white). Even if you like a runny yolk, fully cooked is safest for pregnant people, young children and those with weakened immunity.',
        },
        minInternalTempC: 71,
      },
      voice_on_enter: {
        tr: 'Kısık ateşte, akı tutana kadar pişirelim.',
        en: "Over low heat, let's cook until the whites set.",
      },
      voice_on_complete: {
        tr: 'Akın tamamen tuttuğundan emin ol.',
        en: 'Make sure the whites are fully set.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Tuz, karabiber serp ve sıcak servis et.',
        en: 'Sprinkle salt and black pepper, and serve hot.',
      },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Tuz karabiber serp, afiyet olsun!',
        en: 'Sprinkle salt and pepper — enjoy!',
      },
    },
  ],
};
