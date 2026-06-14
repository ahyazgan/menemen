/** Haşlanmış Yumurta — zamanlayıcı; pişme derecesi için güvenlik notu. */
import type { Recipe } from '../engine/types';

export const haslanmisYumurta: Recipe = {
  id: 'haslanmis-yumurta',
  title: { tr: 'Haşlanmış Yumurta', en: 'Boiled Eggs' },
  servings: 2,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'İstediğin kıvamda, zamanlayıcıyla kusursuz.',
    en: 'Perfect every time with a timer, to your liking.',
  },
  totalMinutes: 12,
  nodes: [
    {
      id: 'boil_water',
      title: { tr: 'Suyu kaynat', en: 'Boil the water' },
      instruction: {
        tr: 'Yumurtaları örtecek kadar suyu kaynat.',
        en: 'Boil enough water to cover the eggs.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Önce suyu kaynatalım.', en: "Let's boil the water first." },
    },
    {
      id: 'add_eggs',
      title: { tr: 'Yumurtaları ekle', en: 'Add the eggs' },
      instruction: {
        tr: 'Yumurtaları kaşıkla yavaşça suya bırak.',
        en: 'Lower the eggs gently into the water with a spoon.',
      },
      kind: 'action',
      requires: ['boil_water'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yumurtaları çatlamasın diye yavaşça bırak.',
        en: "Lower them gently so they don't crack.",
      },
    },
    {
      id: 'cook',
      title: { tr: 'Haşla', en: 'Boil' },
      instruction: {
        tr: 'Kıvamına göre kaynat (kayısı için ~7 dk, tam katı için ~9-10 dk).',
        en: 'Boil to taste (~7 min for jammy, ~9–10 min for fully set).',
      },
      kind: 'action',
      requires: ['add_eggs'],
      completion: 'timer',
      durationSec: 540,
      safety: {
        critical: false,
        message: {
          tr: 'Akışkan sarı seversen sorun yok; ama hamile, küçük çocuk ve bağışıklığı düşük kişiler için sarısı da katı olana dek (en az ~9 dk) pişir.',
          en: 'A runny yolk is fine; but for pregnant people, young children and those with weakened immunity, cook until the yolk is firm too (at least ~9 min).',
        },
      },
      voice_on_enter: {
        tr: 'Zamanlayıcıyı kur, istediğin kıvama göre haşlayalım.',
        en: "Set the timer and let's boil to your liking.",
      },
      voice_on_complete: { tr: 'Süre doldu.', en: "Time's up." },
    },
    {
      id: 'cool',
      title: { tr: 'Soğuk suya al', en: 'Cool in cold water' },
      instruction: {
        tr: 'Yumurtaları buzlu suya al; soyması kolaylaşır.',
        en: "Move the eggs to iced water; they'll peel more easily.",
      },
      kind: 'action',
      requires: ['cook'],
      completion: 'timer',
      durationSec: 120,
      voice_on_enter: {
        tr: 'Soğuk suya alalım, kabuğu rahat soyulur.',
        en: "Let's move them to cold water so they peel easily.",
      },
    },
    {
      id: 'serve',
      title: { tr: 'Soy ve servis et', en: 'Peel and serve' },
      instruction: {
        tr: 'Kabuğunu soy, tuz serpip servis et.',
        en: 'Peel, sprinkle with salt and serve.',
      },
      kind: 'finish',
      requires: ['cool'],
      completion: 'user',
      voice_on_enter: { tr: 'Soyup servis et, afiyet olsun!', en: 'Peel and serve — enjoy!' },
    },
  ],
};
