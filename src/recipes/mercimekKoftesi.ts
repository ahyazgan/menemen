/** Mercimek Köftesi — vegan; pişirmesiz, kıymasız köfte. */
import type { Recipe } from '../engine/types';

export const mercimekKoftesi: Recipe = {
  id: 'mercimek-koftesi',
  title: { tr: 'Mercimek Köftesi', en: 'Lentil Balls' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Etsiz, doyurucu, marul yaprağında harika.',
    en: 'Meat-free and filling — lovely in a lettuce leaf.',
  },
  totalMinutes: 40,
  ingredients: [
    {
      name: { tr: 'kırmızı mercimek', en: 'red lentils' },
      quantity: 1,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    {
      name: { tr: 'bulgur', en: 'fine bulgur' },
      quantity: 1,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'maydanoz', en: 'parsley' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 3,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'cook_lentils',
      title: { tr: 'Mercimeği pişir', en: 'Cook the lentils' },
      instruction: {
        tr: 'Mercimeği suyla yumuşayana dek pişir, bulguru ekleyip ocağı kapat, demlenmeye bırak.',
        en: 'Cook the lentils until soft, stir in the bulgur, turn off the heat and let it swell.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 1200,
      voice_on_enter: {
        tr: 'Mercimekle başlayalım, bulgur sonra demlenecek.',
        en: 'Start with the lentils; the bulgur swells after.',
      },
    },
    {
      id: 'saute_paste',
      title: { tr: 'Soğan-salçayı kavur', en: 'Sauté onion and paste' },
      instruction: {
        tr: 'Soğanı zeytinyağında kavur, salçayı ekle.',
        en: 'Sauté the onion in olive oil and add the paste.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['cook_lentils'],
      completion: 'user',
    },
    {
      id: 'mix',
      title: { tr: 'Yoğur', en: 'Knead' },
      instruction: {
        tr: 'Hepsini maydanoz ve tuzla yoğur, ılıyınca köfte şekli ver.',
        en: 'Knead everything with parsley and salt; shape into balls once warm.',
      },
      kind: 'finish',
      requires: ['cook_lentils', 'saute_paste'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Marul yaprağına sarıp ye, afiyet olsun!',
        en: 'Wrap in lettuce and enjoy!',
      },
    },
  ],
};
