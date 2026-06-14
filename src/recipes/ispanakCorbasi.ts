/** Ispanak Çorbası — vegan; yeşil, hafif, demir deposu. */
import type { Recipe } from '../engine/types';

export const ispanakCorbasi: Recipe = {
  id: 'ispanak-corbasi',
  title: { tr: 'Ispanak Çorbası', en: 'Spinach Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Yeşil, hafif ve besleyici bir çorba.',
    en: 'A green, light and nourishing soup.',
  },
  totalMinutes: 25,
  ingredients: [
    { name: { tr: 'ıspanak', en: 'spinach' }, quantity: 400, unit: { tr: 'g', en: 'g' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 2, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 5, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'saute',
      title: { tr: 'Soğanı kavur', en: 'Sauté the onion' },
      instruction: { tr: 'Soğanı zeytinyağında yumuşat.', en: 'Soften the onion in olive oil.' },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Soğanla başlayalım.', en: "Let's start with the onion." },
    },
    {
      id: 'add',
      title: { tr: 'Pirinç, su ve ıspanak', en: 'Rice, water and spinach' },
      instruction: {
        tr: 'Pirinci ve suyu ekle; pirinç yarı pişince doğranmış ıspanağı kat.',
        en: 'Add rice and water; once the rice is half-cooked, add the chopped spinach.',
      },
      kind: 'action',
      requires: ['saute'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Pirinç ve ıspanak yumuşayana dek 12 dakika pişir.',
        en: 'Simmer 12 minutes until the rice and spinach are tender.',
      },
      kind: 'action',
      requires: ['add'],
      completion: 'timer',
      durationSec: 720,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Limonla servis et.', en: 'Serve with a squeeze of lemon.' },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
