/** Zeytinyağlı Biber Dolması — vegan; pirinçli iç harç. */
import type { Recipe } from '../engine/types';

export const biberDolmasi: Recipe = {
  id: 'biber-dolmasi',
  title: { tr: 'Zeytinyağlı Biber Dolması', en: 'Stuffed Peppers (Olive Oil)' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Pirinçli, naneli iç harçla zeytinyağlı dolma.',
    en: 'Olive-oil stuffed peppers with rice and mint.',
  },
  totalMinutes: 60,
  ingredients: [
    {
      name: { tr: 'dolmalık biber', en: 'bell peppers' },
      quantity: 8,
      unit: { tr: 'adet', en: 'pcs' },
    },
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 1, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'maydanoz', en: 'parsley' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 5,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 1, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'make_filling',
      title: { tr: 'İç harcı hazırla', en: 'Make the filling' },
      instruction: {
        tr: 'Soğanı kavur, pirinci ekleyip kavur; maydanoz, tuz ve baharatla harmanla.',
        en: 'Sauté the onion, toast the rice, then mix with parsley, salt and spices.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'İç harçla başlayalım.', en: "Let's start with the filling." },
    },
    {
      id: 'stuff',
      title: { tr: 'Biberleri doldur', en: 'Stuff the peppers' },
      instruction: {
        tr: 'Biberlerin içini temizle, harcı dörtte üçüne kadar doldur (pirinç şişer).',
        en: 'Hollow the peppers and fill three-quarters full (the rice expands).',
      },
      kind: 'prep',
      requires: ['make_filling'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Tencereye diz, su ve zeytinyağı ekle; pirinç pişene dek 40 dakika kısık ateşte pişir.',
        en: 'Arrange in a pot, add water and olive oil; simmer 40 minutes until the rice is cooked.',
      },
      kind: 'action',
      requires: ['stuff'],
      completion: 'timer',
      durationSec: 2400,
      voice_on_complete: { tr: 'Pirinç pişmiş olmalı.', en: 'The rice should be cooked now.' },
    },
    {
      id: 'serve',
      title: { tr: 'Soğut ve servis et', en: 'Cool and serve' },
      instruction: { tr: 'Ilık ya da soğuk servis et.', en: 'Serve warm or cold.' },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
