/** Omlet — vejetaryen; yumurta adımı KRİTİK (iyice pişmeli). */
import type { Recipe } from '../engine/types';

export const omlet: Recipe = {
  id: 'omlet',
  title: { tr: 'Omlet', en: 'Omelette' },
  servings: 1,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Hızlı, doyurucu, dakikalar içinde kahvaltı.',
    en: 'A quick, filling breakfast in minutes.',
  },
  totalMinutes: 10,
  ingredients: [
    { name: { tr: 'yumurta', en: 'egg' }, quantity: 3, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'tereyağı', en: 'butter' }, quantity: 1, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'tuz', en: 'salt' } },
    { name: { tr: 'karabiber', en: 'black pepper' } },
  ],
  nodes: [
    {
      id: 'beat_eggs',
      title: { tr: 'Yumurtaları çırp', en: 'Beat the eggs' },
      instruction: {
        tr: 'Yumurtaları tuz ve karabiberle çırp.',
        en: 'Beat the eggs with salt and pepper.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['heat_pan'],
      completion: 'user',
      voice_on_enter: { tr: 'Yumurtaları güzelce çırpalım.', en: "Let's beat the eggs well." },
    },
    {
      id: 'heat_pan',
      title: { tr: 'Tavayı ısıt', en: 'Heat the pan' },
      instruction: { tr: 'Tereyağını orta ateşte erit.', en: 'Melt the butter over medium heat.' },
      kind: 'action',
      requires: [],
      parallel_with: ['beat_eggs'],
      completion: 'user',
    },
    {
      id: 'cook_eggs',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Yumurtaları tavaya dök, kısık ateşte üstü kuruyana dek pişir.',
        en: 'Pour the eggs in and cook over low heat until the top is set.',
      },
      kind: 'action',
      requires: ['beat_eggs', 'heat_pan'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Yumurta iyice pişmeli; akışkan kısım kalmamalı. Emin değilsen biraz daha pişir.',
          en: 'The egg must be fully set; no runny part left. If unsure, cook a little more.',
        },
        minInternalTempC: 71,
      },
      voice_on_enter: { tr: 'Kısık ateşte sabırla pişirelim.', en: "Let's cook it patiently over low heat." },
      voice_on_complete: { tr: 'Üstü kurumuş gibi; akışkan kısım kalmadığından emin ol.', en: 'The top looks set; make sure no runny part remains.' },
      recovery_rules: {
        sulu: { tr: 'Ortası akışkansa kapağı kapat, biraz daha pişir.', en: 'If the center is runny, cover and cook a bit more.' },
      },
    },
    {
      id: 'serve',
      title: { tr: 'Katla ve servis et', en: 'Fold and serve' },
      instruction: { tr: 'İkiye katla, sıcak servis et.', en: 'Fold in half and serve hot.' },
      kind: 'finish',
      requires: ['cook_eggs'],
      completion: 'user',
      voice_on_enter: { tr: 'Katla, afiyet olsun!', en: 'Fold it over — enjoy!' },
    },
  ],
};
