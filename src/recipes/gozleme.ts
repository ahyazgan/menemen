/** Peynirli Gözleme — vejetaryen; açılmış hamura peynir, sacda kızartma. */
import type { Recipe } from '../engine/types';

export const gozleme: Recipe = {
  id: 'gozleme',
  title: { tr: 'Peynirli Gözleme', en: 'Cheese Gözleme' },
  servings: 2,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'İnce hamur, bol peynir, sacda çıtır çıtır.',
    en: 'Thin dough, plenty of cheese, crisp off the griddle.',
  },
  totalMinutes: 25,
  ingredients: [
    {
      name: { tr: 'hazır yufka', en: 'flatbread sheets' },
      quantity: 2,
      unit: { tr: 'adet', en: 'pcs' },
    },
    { name: { tr: 'beyaz peynir', en: 'white cheese' }, quantity: 200, unit: { tr: 'g', en: 'g' } },
    { name: { tr: 'maydanoz', en: 'parsley' } },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
  ],
  nodes: [
    {
      id: 'prep_filling',
      title: { tr: 'İç harcı hazırla', en: 'Make the filling' },
      instruction: {
        tr: 'Peyniri ezip kıyılmış maydanozla karıştır.',
        en: 'Crumble the cheese and mix with chopped parsley.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Peyniri maydanozla harmanlayalım.',
        en: "Let's mix the cheese with parsley.",
      },
    },
    {
      id: 'fill',
      title: { tr: 'Yufkayı doldur', en: 'Fill the sheet' },
      instruction: {
        tr: 'Yufkanın yarısına harcı yay, üçgen ya da dörtgen şeklinde kapat.',
        en: 'Spread the filling over half the sheet and fold closed.',
      },
      kind: 'prep',
      requires: ['prep_filling'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Sacda/tavada kızart', en: 'Griddle it' },
      instruction: {
        tr: 'Az tereyağıyla iki yüzünü de altın rengi olana dek pişir.',
        en: 'Cook with a little butter until golden on both sides.',
      },
      kind: 'action',
      requires: ['fill'],
      completion: 'timer',
      durationSec: 360,
      voice_on_complete: { tr: 'İki yüzü de kızarmış olmalı.', en: 'Both sides should be golden.' },
    },
    {
      id: 'serve',
      title: { tr: 'Dilimle ve servis et', en: 'Slice and serve' },
      instruction: { tr: 'Dilimle, sıcak servis et.', en: 'Slice and serve hot.' },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Çayla harika gider, afiyet olsun!', en: 'Great with tea — enjoy!' },
    },
  ],
};
