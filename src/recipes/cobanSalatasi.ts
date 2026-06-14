/** Çoban Salatası — pişirme yok; tüm doğramalar paralel. */
import type { Recipe } from '../engine/types';

export const cobanSalatasi: Recipe = {
  id: 'coban-salatasi',
  title: { tr: 'Çoban Salatası', en: "Shepherd's Salad" },
  servings: 2,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'Pişirmeden, dakikalar içinde ferah bir salata.',
    en: 'A fresh, no-cook salad ready in minutes.',
  },
  totalMinutes: 10,
  nodes: [
    {
      id: 'chop_tomato',
      title: { tr: 'Domatesleri doğra', en: 'Chop the tomatoes' },
      instruction: { tr: 'Domatesleri küçük küp doğra.', en: 'Dice the tomatoes small.' },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_cucumber', 'chop_onion'],
      completion: 'user',
      voice_on_enter: { tr: 'Domatesleri küp küp doğrayalım.', en: "Let's dice the tomatoes." },
    },
    {
      id: 'chop_cucumber',
      title: { tr: 'Salatalığı doğra', en: 'Chop the cucumber' },
      instruction: { tr: 'Salatalığı küp doğra.', en: 'Dice the cucumber.' },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_tomato', 'chop_onion'],
      completion: 'user',
    },
    {
      id: 'chop_onion',
      title: { tr: 'Soğan ve yeşillik', en: 'Onion and herbs' },
      instruction: {
        tr: 'Soğanı ince, maydanozu kıyarak doğra.',
        en: 'Slice the onion thinly and finely chop the parsley.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_tomato', 'chop_cucumber'],
      completion: 'user',
    },
    {
      id: 'dress',
      title: { tr: 'Sosla ve karıştır', en: 'Dress and toss' },
      instruction: {
        tr: 'Zeytinyağı, limon ve tuz ekleyip harmanla.',
        en: 'Add olive oil, lemon and salt, then toss.',
      },
      kind: 'finish',
      requires: ['chop_tomato', 'chop_cucumber', 'chop_onion'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Zeytinyağı ve limonla harmanla, afiyet olsun!',
        en: 'Toss with olive oil and lemon — enjoy!',
      },
    },
  ],
};
