/** Sebze Çorbası — vegan; mevsim sebzeleriyle hafif çorba. */
import type { Recipe } from '../engine/types';

export const sebzeCorbasi: Recipe = {
  id: 'sebze-corbasi',
  title: { tr: 'Sebze Çorbası', en: 'Vegetable Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Hafif, doyurucu ve tamamen sebzeli.',
    en: 'Light, filling and all-vegetable.',
  },
  totalMinutes: 30,
  ingredients: [
    { name: { tr: 'havuç', en: 'carrot' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'patates', en: 'potato' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 6, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'chop_veg',
      title: { tr: 'Sebzeleri doğra', en: 'Chop the vegetables' },
      instruction: {
        tr: 'Havuç, patates ve soğanı küçük küpler hâlinde doğra.',
        en: 'Dice the carrot, potato and onion into small cubes.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Sebzeleri küçük küp doğrayalım, çabuk pişsin.',
        en: "Let's dice the veg small so it cooks fast.",
      },
    },
    {
      id: 'saute',
      title: { tr: 'Kavur', en: 'Sauté' },
      instruction: {
        tr: 'Soğanı yağda kavur, salçayı ekle, sonra havuç ve patatesi de kat.',
        en: 'Sauté the onion in oil, add the paste, then the carrot and potato.',
      },
      kind: 'action',
      requires: ['chop_veg'],
      completion: 'user',
    },
    {
      id: 'add_water',
      title: { tr: 'Suyu ekle', en: 'Add water' },
      instruction: { tr: 'Su ve tuzu ekle, kaynat.', en: 'Add water and salt, bring to a boil.' },
      kind: 'action',
      requires: ['saute'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Sebzeler yumuşayana dek 15-20 dakika kısık ateşte pişir.',
        en: 'Simmer 15–20 minutes until the vegetables are tender.',
      },
      kind: 'action',
      requires: ['add_water'],
      completion: 'timer',
      durationSec: 1080,
      voice_on_complete: {
        tr: 'Sebzeler yumuşamış olmalı.',
        en: 'The vegetables should be tender now.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Sıcak servis et, istersen limon sık.',
        en: 'Serve hot, with a squeeze of lemon if you like.',
      },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
