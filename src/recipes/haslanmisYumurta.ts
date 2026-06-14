/** Haşlanmış Yumurta — zamanlayıcı; pişme derecesi için güvenlik notu. */
import type { Recipe } from '../engine/types';

export const haslanmisYumurta: Recipe = {
  id: 'haslanmis-yumurta',
  title: { tr: 'Haşlanmış Yumurta', en: 'Boiled Eggs' },
  servings: 2,
  locale: 'tr',
  summary: {
    tr: 'İstediğin kıvamda, zamanlayıcıyla kusursuz.',
    en: 'Perfect every time with a timer, to your liking.',
  },
  totalMinutes: 12,
  nodes: [
    {
      id: 'boil_water',
      title: 'Suyu kaynat',
      instruction: 'Yumurtaları örtecek kadar suyu kaynat.',
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: 'Önce suyu kaynatalım.',
    },
    {
      id: 'add_eggs',
      title: 'Yumurtaları ekle',
      instruction: 'Yumurtaları kaşıkla yavaşça suya bırak.',
      kind: 'action',
      requires: ['boil_water'],
      completion: 'user',
      voice_on_enter: 'Yumurtaları çatlamasın diye yavaşça bırak.',
    },
    {
      id: 'cook',
      title: 'Haşla',
      instruction: 'Kıvamına göre kaynat (kayısı için ~7 dk, tam katı için ~9-10 dk).',
      kind: 'action',
      requires: ['add_eggs'],
      completion: 'timer',
      durationSec: 540,
      safety: {
        critical: false,
        message:
          'Akışkan sarı seversen sorun yok; ama hamile, küçük çocuk ve bağışıklığı düşük kişiler için sarısı da katı olana dek (en az ~9 dk) pişir.',
      },
      voice_on_enter: 'Zamanlayıcıyı kur, istediğin kıvama göre haşlayalım.',
      voice_on_complete: 'Süre doldu.',
    },
    {
      id: 'cool',
      title: 'Soğuk suya al',
      instruction: 'Yumurtaları buzlu suya al; soyması kolaylaşır.',
      kind: 'action',
      requires: ['cook'],
      completion: 'timer',
      durationSec: 120,
      voice_on_enter: 'Soğuk suya alalım, kabuğu rahat soyulur.',
    },
    {
      id: 'serve',
      title: 'Soy ve servis et',
      instruction: 'Kabuğunu soy, tuz serpip servis et.',
      kind: 'finish',
      requires: ['cool'],
      completion: 'user',
      voice_on_enter: 'Soyup servis et, afiyet olsun!',
    },
  ],
};
