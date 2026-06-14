/** Çoban Salatası — pişirme yok; tüm doğramalar paralel. */
import type { Recipe } from '../engine/types';

export const cobanSalatasi: Recipe = {
  id: 'coban-salatasi',
  title: { tr: 'Çoban Salatası', en: "Shepherd's Salad" },
  servings: 2,
  locale: 'tr',
  summary: {
    tr: 'Pişirmeden, dakikalar içinde ferah bir salata.',
    en: 'A fresh, no-cook salad ready in minutes.',
  },
  totalMinutes: 10,
  nodes: [
    {
      id: 'chop_tomato',
      title: 'Domatesleri doğra',
      instruction: 'Domatesleri küçük küp doğra.',
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_cucumber', 'chop_onion'],
      completion: 'user',
      voice_on_enter: 'Domatesleri küp küp doğrayalım.',
    },
    {
      id: 'chop_cucumber',
      title: 'Salatalığı doğra',
      instruction: 'Salatalığı küp doğra.',
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_tomato', 'chop_onion'],
      completion: 'user',
    },
    {
      id: 'chop_onion',
      title: 'Soğan ve yeşillik',
      instruction: 'Soğanı ince, maydanozu kıyarak doğra.',
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_tomato', 'chop_cucumber'],
      completion: 'user',
    },
    {
      id: 'dress',
      title: 'Sosla ve karıştır',
      instruction: 'Zeytinyağı, limon ve tuz ekleyip harmanla.',
      kind: 'finish',
      requires: ['chop_tomato', 'chop_cucumber', 'chop_onion'],
      completion: 'user',
      voice_on_enter: 'Zeytinyağı ve limonla harmanla, afiyet olsun!',
    },
  ],
};
