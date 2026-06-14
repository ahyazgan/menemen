/** Brokoli Çorbası — vegan; patatesle kremamsı kıvam. */
import type { Recipe } from '../engine/types';

export const brokoliCorbasi: Recipe = {
  id: 'brokoli-corbasi',
  title: { tr: 'Brokoli Çorbası', en: 'Broccoli Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Patatesle kremamsı, kremasız ve hafif.',
    en: 'Creamy from potato — no cream, still light.',
  },
  totalMinutes: 30,
  ingredients: [
    { name: { tr: 'brokoli', en: 'broccoli' }, quantity: 1, unit: { tr: 'adet', en: 'head' } },
    { name: { tr: 'patates', en: 'potato' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
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
      title: { tr: 'Brokoli ve patatesi ekle', en: 'Add broccoli and potato' },
      instruction: {
        tr: 'Brokoli çiçeklerini ve doğranmış patatesi ekle, suyu ve tuzu koy.',
        en: 'Add the broccoli florets and diced potato, then the water and salt.',
      },
      kind: 'action',
      requires: ['saute'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Sebzeler yumuşayana dek 15 dakika pişir.',
        en: 'Simmer 15 minutes until the vegetables are soft.',
      },
      kind: 'action',
      requires: ['add'],
      completion: 'timer',
      durationSec: 900,
    },
    {
      id: 'blend',
      title: { tr: 'Blenderdan geçir', en: 'Blend' },
      instruction: {
        tr: 'El blenderıyla pürüzsüz hale getir, tuzunu ayarla.',
        en: 'Blend smooth with a stick blender and adjust the salt.',
      },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Pürüzsüz olunca afiyet olsun!', en: 'Once smooth — enjoy!' },
    },
  ],
};
