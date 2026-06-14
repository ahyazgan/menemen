/** Cacık — vejetaryen; yoğurt, salatalık, sarımsak. Pişirme yok. */
import type { Recipe } from '../engine/types';

export const cacik: Recipe = {
  id: 'cacik',
  title: { tr: 'Cacık', en: 'Cacık (Yogurt & Cucumber)' },
  servings: 4,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'Serinletici, sarımsaklı yoğurt; yaz için birebir.',
    en: 'A cooling, garlicky yogurt dip — perfect for summer.',
  },
  totalMinutes: 10,
  ingredients: [
    { name: { tr: 'yoğurt', en: 'yogurt' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'salatalık', en: 'cucumber' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'sarımsak', en: 'garlic' }, quantity: 1, unit: { tr: 'diş', en: 'clove' } },
    { name: { tr: 'nane', en: 'dried mint' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'grate_cucumber',
      title: { tr: 'Salatalığı rendele', en: 'Grate the cucumber' },
      instruction: {
        tr: 'Salatalıkları rendele; çok suluysa hafif sık.',
        en: 'Grate the cucumbers; squeeze out excess water if very juicy.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['mix_yogurt'],
      completion: 'user',
      voice_on_enter: { tr: 'Salatalığı rendeleyelim.', en: "Let's grate the cucumber." },
    },
    {
      id: 'mix_yogurt',
      title: { tr: 'Yoğurdu hazırla', en: 'Prepare the yogurt' },
      instruction: {
        tr: 'Yoğurdu ezilmiş sarımsak ve tuzla çırp, biraz su ile aç.',
        en: 'Whisk the yogurt with crushed garlic and salt; loosen with a little water.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['grate_cucumber'],
      completion: 'user',
    },
    {
      id: 'combine',
      title: { tr: 'Karıştır ve servis et', en: 'Combine and serve' },
      instruction: {
        tr: 'Salatalığı yoğurda kat; nane ve zeytinyağı gezdir.',
        en: 'Fold the cucumber into the yogurt; top with mint and olive oil.',
      },
      kind: 'finish',
      requires: ['grate_cucumber', 'mix_yogurt'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Karıştır, soğuk servis et. Afiyet olsun!',
        en: 'Mix and serve cold — enjoy!',
      },
    },
  ],
};
