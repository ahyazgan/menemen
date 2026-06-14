/** Mantar Çorbası — vegan; sotelenmiş mantar, unla bağlanır. */
import type { Recipe } from '../engine/types';

export const mantarCorbasi: Recipe = {
  id: 'mantar-corbasi',
  title: { tr: 'Mantar Çorbası', en: 'Mushroom Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Sotelenmiş mantarın aromasıyla sıcacık.',
    en: 'Warming, with the aroma of sautéed mushrooms.',
  },
  totalMinutes: 25,
  ingredients: [
    { name: { tr: 'mantar', en: 'mushrooms' }, quantity: 300, unit: { tr: 'g', en: 'g' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'un', en: 'flour' }, quantity: 1, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
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
      title: { tr: 'Mantarı sotele', en: 'Sauté the mushrooms' },
      instruction: {
        tr: 'Soğanı ve dilimlenmiş mantarı suyunu salıp çekene dek kavur.',
        en: 'Sauté the onion and sliced mushrooms until they release and reabsorb their liquid.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Mantarlar suyunu salacak, sabırla kavuralım.',
        en: 'The mushrooms will release water — sauté patiently.',
      },
    },
    {
      id: 'roux',
      title: { tr: 'Unu ekle', en: 'Add the flour' },
      instruction: {
        tr: 'Unu ekleyip bir iki dakika kavur.',
        en: 'Add the flour and cook a minute or two.',
      },
      kind: 'action',
      requires: ['saute'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Suyu ekle ve pişir', en: 'Add water and simmer' },
      instruction: {
        tr: 'Suyu azar azar ekle, tuzla, 10 dakika kaynat.',
        en: 'Add water gradually, season, and simmer 10 minutes.',
      },
      kind: 'action',
      requires: ['roux'],
      completion: 'timer',
      durationSec: 600,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Sıcak servis et; istersen karabiber serp.',
        en: 'Serve hot, with black pepper if you like.',
      },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
