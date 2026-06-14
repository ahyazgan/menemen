/** Karnıyarık — kıyma adımı KRİTİK (iç sıcaklık 71°C). */
import type { Recipe } from '../engine/types';

export const karniyarik: Recipe = {
  id: 'karniyarik',
  title: { tr: 'Karnıyarık', en: 'Karnıyarık (Stuffed Eggplant)' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Kızarmış patlıcanın içinde kıymalı harç.',
    en: 'Fried eggplant filled with spiced minced meat.',
  },
  totalMinutes: 50,
  ingredients: [
    { name: { tr: 'patlıcan', en: 'eggplant' }, quantity: 4, unit: { tr: 'adet', en: 'pcs' } },
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
        tr: 'Patlıcanları alacalı soyup tuzla beklet, sonra yumuşayana dek kızart.',
        en: 'Peel the eggplants in stripes, salt and rest, then fry until soft.',
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
      id: 'cook_filling',
      title: { tr: 'Kıymalı harcı pişir', en: 'Cook the meat filling' },
      instruction: {
        tr: 'Soğanı kavur, kıymayı ekle; suyunu çekip rengi tamamen dönene dek pişir. Domates ve salçayı kat.',
        en: 'Sauté the onion, add the meat; cook until no pink remains and the liquid reduces. Add tomato and paste.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['fry_eggplant'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Kıyma tam pişmeli; pembe kısım kalmamalı (iç sıcaklık 71°C). Emin değilsen biraz daha pişir.',
          en: 'The minced meat must be fully cooked; no pink left (internal 71°C). If unsure, cook more.',
        },
        minInternalTempC: 71,
      },
      voice_on_complete: {
        tr: 'Kıymanın rengi tamamen dönmüş olmalı.',
        en: 'The meat should be fully browned through.',
      },
    },
    {
      id: 'stuff_bake',
      title: { tr: 'Doldur ve pişir', en: 'Stuff and bake' },
      instruction: {
        tr: 'Patlıcanları yar, harcı doldur; biraz suyla fırında ya da kısık ateşte 20 dakika pişir.',
        en: 'Slit the eggplants, fill them, add a little water and bake or simmer 20 minutes.',
      },
      kind: 'action',
      requires: ['fry_eggplant', 'cook_filling'],
      completion: 'timer',
      durationSec: 1200,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Pilavla sıcak servis et.', en: 'Serve hot with rice.' },
      kind: 'finish',
      requires: ['stuff_bake'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
