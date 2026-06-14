/** Mevsim Salatası — vegan; karışık yeşillik, zeytinyağlı-limonlu. */
import type { Recipe } from '../engine/types';

export const mevsimSalatasi: Recipe = {
  id: 'mevsim-salatasi',
  title: { tr: 'Mevsim Salatası', en: 'Garden Salad' },
  servings: 4,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'Marul, domates, salatalık; ferah ve hafif.',
    en: 'Lettuce, tomato, cucumber — fresh and light.',
  },
  totalMinutes: 10,
  ingredients: [
    { name: { tr: 'marul', en: 'lettuce' }, quantity: 1, unit: { tr: 'adet', en: 'head' } },
    { name: { tr: 'domates', en: 'tomato' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'salatalık', en: 'cucumber' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'havuç', en: 'carrot' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 3,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'limon', en: 'lemon' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'chop',
      title: { tr: 'Malzemeleri doğra', en: 'Chop the ingredients' },
      instruction: {
        tr: 'Marulu yırt, domates ve salatalığı doğra, havucu rendele.',
        en: 'Tear the lettuce, chop the tomato and cucumber, grate the carrot.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yeşillikleri doğramayla başlayalım.',
        en: "Let's start chopping the greens.",
      },
    },
    {
      id: 'dress',
      title: { tr: 'Sosla ve karıştır', en: 'Dress and toss' },
      instruction: {
        tr: 'Zeytinyağı, limon ve tuzu ekleyip servisten hemen önce harmanla.',
        en: 'Add olive oil, lemon and salt; toss just before serving.',
      },
      kind: 'finish',
      requires: ['chop'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Servisten hemen önce sosla, afiyet olsun!',
        en: 'Dress right before serving — enjoy!',
      },
    },
  ],
};
