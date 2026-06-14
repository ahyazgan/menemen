/** Kaşarlı Yumurta — vejetaryen; yumurta adımı KRİTİK. */
import type { Recipe } from '../engine/types';

export const kasarliYumurta: Recipe = {
  id: 'kasarli-yumurta',
  title: { tr: 'Kaşarlı Yumurta', en: 'Eggs with Melted Cheese' },
  servings: 1,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Tavada eriyen kaşarla pratik kahvaltı.',
    en: 'A quick breakfast with cheese melting in the pan.',
  },
  totalMinutes: 8,
  ingredients: [
    { name: { tr: 'yumurta', en: 'egg' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'rendelenmiş kaşar', en: 'grated kashar' },
      quantity: 1,
      unit: { tr: 'avuç', en: 'handful' },
    },
    { name: { tr: 'tereyağı', en: 'butter' }, quantity: 1, unit: { tr: 'çay kaşığı', en: 'tsp' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'heat_pan',
      title: { tr: 'Tavayı ısıt', en: 'Heat the pan' },
      instruction: { tr: 'Tereyağını orta ateşte erit.', en: 'Melt the butter over medium heat.' },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Tavayı ısıtalım.', en: "Let's heat the pan." },
    },
    {
      id: 'add_eggs',
      title: { tr: 'Yumurtaları kır', en: 'Crack the eggs' },
      instruction: {
        tr: 'Yumurtaları tavaya kır, üzerine tuz serp.',
        en: 'Crack the eggs into the pan and season with salt.',
      },
      kind: 'action',
      requires: ['heat_pan'],
      completion: 'user',
    },
    {
      id: 'add_cheese_cook',
      title: { tr: 'Kaşarı ekle ve pişir', en: 'Add cheese and cook' },
      instruction: {
        tr: 'Kaşarı serp, kapağı kapat; beyazı tamamen pişip kaşar eriyene dek tut.',
        en: 'Sprinkle the cheese, cover, and cook until the whites are fully set and the cheese melts.',
      },
      kind: 'action',
      requires: ['add_eggs'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Yumurta beyazı tamamen pişmeli. Akışkan beyaz kalmasın; emin değilsen biraz daha pişir.',
          en: 'The egg white must be fully cooked. No runny white left; if unsure, cook a little more.',
        },
        minInternalTempC: 71,
      },
      voice_on_complete: {
        tr: 'Kaşar erimiş, beyazı pişmiş olmalı.',
        en: 'The cheese should be melted and the white set.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Sıcak servis et, ekmekle güzel gider.',
        en: 'Serve hot; great with bread.',
      },
      kind: 'finish',
      requires: ['add_cheese_cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
