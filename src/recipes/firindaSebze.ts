/** Fırında Sebze — vegan; karışık sebzeler, zeytinyağlı, fırında. */
import type { Recipe } from '../engine/types';

export const firindaSebze: Recipe = {
  id: 'firinda-sebze',
  title: { tr: 'Fırında Sebze', en: 'Roasted Vegetables' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Karışık sebzeler, zeytinyağıyla fırında; pratik ve sağlıklı.',
    en: 'Mixed vegetables roasted in olive oil — easy and healthy.',
  },
  totalMinutes: 45,
  ingredients: [
    { name: { tr: 'patates', en: 'potato' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'havuç', en: 'carrot' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'biber', en: 'pepper' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 4,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'preheat',
      title: { tr: 'Fırını ısıt', en: 'Preheat the oven' },
      instruction: { tr: 'Fırını 200°C’ye ısıt.', en: 'Preheat the oven to 200°C.' },
      kind: 'action',
      requires: [],
      parallel_with: ['chop'],
      completion: 'user',
      voice_on_enter: { tr: 'Fırını ısıtmaya alalım.', en: "Let's get the oven heating." },
    },
    {
      id: 'chop',
      title: { tr: 'Sebzeleri doğra', en: 'Chop the vegetables' },
      instruction: {
        tr: 'Sebzeleri iri parçalar hâlinde doğra, zeytinyağı ve tuzla harmanla.',
        en: 'Cut the vegetables into large pieces and toss with olive oil and salt.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['preheat'],
      completion: 'user',
    },
    {
      id: 'roast',
      title: { tr: 'Fırınla', en: 'Roast' },
      instruction: {
        tr: 'Tepsiye yay, kenarları kızarana dek 30-35 dakika pişir.',
        en: 'Spread on a tray and roast 30–35 minutes until the edges brown.',
      },
      kind: 'action',
      requires: ['preheat', 'chop'],
      completion: 'timer',
      durationSec: 2100,
      voice_on_complete: { tr: 'Kenarları kızarmış olmalı.', en: 'The edges should be browned.' },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Sıcak servis et; yoğurt ile güzel gider.',
        en: 'Serve hot; great with yogurt.',
      },
      kind: 'finish',
      requires: ['roast'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
