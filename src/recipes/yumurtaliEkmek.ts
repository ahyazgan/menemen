/** Yumurtalı Ekmek — yumurta adımı KRİTİK (iyice pişmeli). */
import type { Recipe } from '../engine/types';

export const yumurtaliEkmek: Recipe = {
  id: 'yumurtali-ekmek',
  title: { tr: 'Yumurtalı Ekmek', en: 'Egg-Dipped Bread' },
  servings: 2,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Bayat ekmeği değerlendiren, çıtır kahvaltılık.',
    en: 'A crisp way to use up day-old bread.',
  },
  totalMinutes: 10,
  ingredients: [
    { name: { tr: 'ekmek', en: 'bread' }, quantity: 4, unit: { tr: 'dilim', en: 'slices' } },
    { name: { tr: 'yumurta', en: 'egg' }, quantity: 3, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'süt', en: 'milk' }, quantity: 3, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'beat',
      title: { tr: 'Yumurtayı çırp', en: 'Beat the eggs' },
      instruction: { tr: 'Yumurta, süt ve tuzu çırp.', en: 'Beat the eggs with milk and salt.' },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Yumurtayı sütle çırpalım.', en: "Let's beat the eggs with milk." },
    },
    {
      id: 'dip',
      title: { tr: 'Ekmekleri batır', en: 'Dip the bread' },
      instruction: {
        tr: 'Ekmek dilimlerini karışıma iki yüzünden batır.',
        en: 'Dip the bread slices on both sides.',
      },
      kind: 'prep',
      requires: ['beat'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Kızart', en: 'Fry' },
      instruction: {
        tr: 'Tereyağında, yumurta tamamen pişip iki yüzü kızarana dek kızart.',
        en: 'Fry in butter until the egg is fully cooked and both sides are golden.',
      },
      kind: 'action',
      requires: ['dip'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Yumurtalı kaplama tamamen pişmeli; ıslak/akışkan kısım kalmasın.',
          en: 'The egg coating must be fully cooked; no wet/runny part left.',
        },
        minInternalTempC: 71,
      },
      voice_on_complete: { tr: 'İki yüzü de kızarmış olmalı.', en: 'Both sides should be golden.' },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Sıcak servis et; tatlı seversen pudra şekeri serp.',
        en: 'Serve hot; dust with sugar if you like it sweet.',
      },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
