/** Kısır — vegan; ince bulgur, salça, bol yeşillik. */
import type { Recipe } from '../engine/types';

export const kisir: Recipe = {
  id: 'kisir',
  title: { tr: 'Kısır', en: 'Kısır (Bulgur Salad)' },
  servings: 4,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'İnce bulgur, salça ve bol yeşillikle baharatlı.',
    en: 'Fine bulgur with paste and lots of herbs — zesty.',
  },
  totalMinutes: 30,
  ingredients: [
    {
      name: { tr: 'ince bulgur', en: 'fine bulgur' },
      quantity: 2,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'maydanoz', en: 'parsley' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 4,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'limon', en: 'lemon' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'sıcak su', en: 'hot water' },
      quantity: 2,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'soak',
      title: { tr: 'Bulguru ıslat', en: 'Soak the bulgur' },
      instruction: {
        tr: 'Bulgurun üzerine sıcak su dök, kapağını kapatıp şişene dek bekle.',
        en: 'Pour hot water over the bulgur, cover and let it swell.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 900,
      voice_on_enter: {
        tr: 'Bulgur sıcak suyla şişsin, sonra harca geçeriz.',
        en: 'Let the bulgur swell with hot water first.',
      },
    },
    {
      id: 'saute_paste',
      title: { tr: 'Salçayı hazırla', en: 'Prepare the paste' },
      instruction: {
        tr: 'Soğanı zeytinyağında kavur, salçayı ekleyip ılıt.',
        en: 'Sauté the onion in olive oil, add the paste and let it cool a bit.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['soak'],
      completion: 'user',
    },
    {
      id: 'mix',
      title: { tr: 'Karıştır', en: 'Combine' },
      instruction: {
        tr: 'Şişen bulgura salçayı, maydanozu, limon ve tuzu ekleyip iyice yoğur.',
        en: 'Add the paste, parsley, lemon and salt to the swollen bulgur and mix well.',
      },
      kind: 'finish',
      requires: ['soak', 'saute_paste'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Marul yaprağıyla servis et, afiyet olsun!',
        en: 'Serve with lettuce leaves — enjoy!',
      },
    },
  ],
};
