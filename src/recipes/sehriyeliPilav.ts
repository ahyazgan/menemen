/** Şehriyeli Pilav — vejetaryen; tereyağlı, şehriyeli. */
import type { Recipe } from '../engine/types';

export const sehriyeliPilav: Recipe = {
  id: 'sehriyeli-pilav',
  title: { tr: 'Şehriyeli Pilav', en: 'Vermicelli Pilaf' },
  servings: 4,
  locale: 'tr',
  category: 'pilav',
  summary: {
    tr: 'Kızarmış şehriyeyle kokulu, klasik pilav.',
    en: 'Classic pilaf with toasted vermicelli.',
  },
  totalMinutes: 30,
  ingredients: [
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    {
      name: { tr: 'şehriye', en: 'vermicelli' },
      quantity: 0.5,
      unit: { tr: 'su bardağı', en: 'cup' },
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
      id: 'toast_vermicelli',
      title: { tr: 'Şehriyeyi kavur', en: 'Toast the vermicelli' },
      instruction: {
        tr: 'Tereyağında şehriyeyi altın rengine dönene dek kavur.',
        en: 'Toast the vermicelli in butter until golden.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Şehriyeyi yakmadan altın rengine getirelim.',
        en: "Let's get the vermicelli golden without burning.",
      },
    },
    {
      id: 'toast_rice',
      title: { tr: 'Pirinci ekle', en: 'Add the rice' },
      instruction: {
        tr: 'Yıkanmış pirinci ekleyip birkaç dakika kavur.',
        en: 'Add the rinsed rice and toast a few minutes.',
      },
      kind: 'action',
      requires: ['toast_vermicelli'],
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
