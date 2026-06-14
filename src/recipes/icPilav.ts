/** İç Pilav — vejetaryen; tereyağlı, kuş üzümlü, fıstıklı. */
import type { Recipe } from '../engine/types';

export const icPilav: Recipe = {
  id: 'ic-pilav',
  title: { tr: 'İç Pilav', en: 'İç Pilav (Currant Rice)' },
  servings: 4,
  locale: 'tr',
  category: 'pilav',
  summary: {
    tr: 'Kuş üzümü, fıstık ve baharatla bayramlık pilav.',
    en: 'Festive rice with currants, pine nuts and spices.',
  },
  totalMinutes: 35,
  ingredients: [
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'dolmalık fıstık', en: 'pine nuts' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'kuş üzümü', en: 'currants' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'sıcak su', en: 'hot water' },
      quantity: 3,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'toast_nuts',
      title: { tr: 'Fıstığı ve soğanı kavur', en: 'Toast nuts and onion' },
      instruction: {
        tr: 'Tereyağında fıstığı pembeleştir, soğanı ekleyip kavur, kuş üzümünü kat.',
        en: 'Brown the pine nuts in butter, add the onion and sauté, then the currants.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Fıstıkları yakmadan pembeleştirelim.',
        en: "Let's brown the pine nuts without burning.",
      },
    },
    {
      id: 'toast_rice',
      title: { tr: 'Pirinci kavur', en: 'Toast the rice' },
      instruction: {
        tr: 'Yıkanmış pirinci ekleyip baharatlarla kavur.',
        en: 'Add the rinsed rice and toast with the spices.',
      },
      kind: 'action',
      requires: ['toast_nuts'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Suyu ekle ve pişir', en: 'Add water and cook' },
      instruction: {
        tr: 'Sıcak su ve tuzu ekle, suyunu çekene dek kısık ateşte pişir.',
        en: 'Add hot water and salt; cook on low until absorbed.',
      },
      kind: 'action',
      requires: ['toast_rice'],
      completion: 'timer',
      durationSec: 900,
    },
    {
      id: 'rest',
      title: { tr: 'Demlendir ve servis et', en: 'Rest and serve' },
      instruction: {
        tr: '10 dakika demlendir, çatalla havalandır.',
        en: 'Rest 10 minutes and fluff with a fork.',
      },
      kind: 'finish',
      requires: ['cook'],
      completion: 'timer',
      durationSec: 600,
      voice_on_enter: { tr: 'Demlenince afiyet olsun!', en: 'After it rests — enjoy!' },
    },
  ],
};
