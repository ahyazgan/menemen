/** Patlıcan Musakka — kıyma adımı KRİTİK (iç sıcaklık 71°C). */
import type { Recipe } from '../engine/types';

export const patlicanMusakka: Recipe = {
  id: 'patlican-musakka',
  title: { tr: 'Patlıcan Musakka', en: 'Eggplant Moussaka' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Patlıcan ve kıymanın domates soslu buluşması.',
    en: 'Eggplant and minced meat in a tomato sauce.',
  },
  totalMinutes: 50,
  ingredients: [
    { name: { tr: 'patlıcan', en: 'eggplant' }, quantity: 3, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'kıyma', en: 'minced meat' }, quantity: 300, unit: { tr: 'g', en: 'g' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'domates', en: 'tomato' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 3,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'fry_eggplant',
      title: { tr: 'Patlıcanları kızart', en: 'Fry the eggplants' },
      instruction: {
        tr: 'Patlıcanları dilimleyip yumuşayana dek kızart.',
        en: 'Slice and fry the eggplants until soft.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Patlıcanları kızartmayla başlayalım.',
        en: "Let's start by frying the eggplants.",
      },
    },
    {
      id: 'cook_meat',
      title: { tr: 'Kıymayı pişir', en: 'Cook the meat' },
      instruction: {
        tr: 'Soğanı kavur, kıymayı ekle; rengi tamamen dönene dek pişir, domates ve salçayı kat.',
        en: 'Sauté the onion, add the meat; cook until no pink remains, then add tomato and paste.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['fry_eggplant'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Kıyma tam pişmeli; pembe kalmamalı (iç sıcaklık 71°C). Emin değilsen biraz daha pişir.',
          en: 'Minced meat must be fully cooked; no pink left (internal 71°C). If unsure, cook more.',
        },
        minInternalTempC: 71,
      },
      voice_on_complete: {
        tr: 'Kıymanın rengi tamamen dönmüş olmalı.',
        en: 'The meat should be fully browned through.',
      },
    },
    {
      id: 'layer_simmer',
      title: { tr: 'Dizip pişir', en: 'Layer and simmer' },
      instruction: {
        tr: 'Patlıcan ve kıymayı tencerede katla, biraz suyla 15 dakika pişir.',
        en: 'Layer the eggplant and meat, add a little water and simmer 15 minutes.',
      },
      kind: 'action',
      requires: ['fry_eggplant', 'cook_meat'],
      completion: 'timer',
      durationSec: 900,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Pilav ile sıcak servis et.', en: 'Serve hot with rice.' },
      kind: 'finish',
      requires: ['layer_simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
