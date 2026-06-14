/** Peynirli Tost — vejetaryen; kaşarlı, kızarmış ekmek. */
import type { Recipe } from '../engine/types';

export const peynirliTost: Recipe = {
  id: 'peynirli-tost',
  title: { tr: 'Peynirli Tost', en: 'Cheese Toast' },
  servings: 1,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Dışı çıtır, içi eriyik peynir.',
    en: 'Crisp outside, melty cheese inside.',
  },
  totalMinutes: 8,
  ingredients: [
    { name: { tr: 'ekmek', en: 'bread' }, quantity: 2, unit: { tr: 'dilim', en: 'slices' } },
    {
      name: { tr: 'kaşar peyniri', en: 'kashar cheese' },
      quantity: 2,
      unit: { tr: 'dilim', en: 'slices' },
    },
    { name: { tr: 'tereyağı', en: 'butter' }, quantity: 1, unit: { tr: 'çay kaşığı', en: 'tsp' } },
  ],
  nodes: [
    {
      id: 'assemble',
      title: { tr: 'Hazırla', en: 'Assemble' },
      instruction: {
        tr: 'Ekmeklerin arasına kaşarı yerleştir, dışını hafif yağla.',
        en: 'Place the cheese between the bread slices and lightly butter the outsides.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Peyniri ekmeğin arasına koyalım.',
        en: "Let's tuck the cheese between the bread.",
      },
    },
    {
      id: 'toast',
      title: { tr: 'Kızart', en: 'Toast' },
      instruction: {
        tr: 'Tost makinesinde ya da tavada iki yüzü de kızarana ve peynir eriyene dek tutu.',
        en: 'Toast in a press or pan until both sides are golden and the cheese melts.',
      },
      kind: 'action',
      requires: ['assemble'],
      completion: 'timer',
      durationSec: 240,
      voice_on_complete: {
        tr: 'Kızarmış ve peynir erimiş olmalı.',
        en: 'It should be golden and the cheese melted.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Üçgen kes, sıcak servis et.', en: 'Cut into triangles and serve hot.' },
      kind: 'finish',
      requires: ['toast'],
      completion: 'user',
      voice_on_enter: { tr: 'Sıcakken ye, afiyet olsun!', en: 'Eat it hot — enjoy!' },
    },
  ],
};
