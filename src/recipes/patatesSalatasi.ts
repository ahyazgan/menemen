/** Patates Salatası — vegan; haşlanmış patates, zeytinyağlı. */
import type { Recipe } from '../engine/types';

export const patatesSalatasi: Recipe = {
  id: 'patates-salatasi',
  title: { tr: 'Patates Salatası', en: 'Potato Salad' },
  servings: 4,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'Zeytinyağlı, limonlu, hafif bir patates salatası.',
    en: 'A light potato salad with olive oil and lemon.',
  },
  totalMinutes: 25,
  ingredients: [
    { name: { tr: 'patates', en: 'potato' }, quantity: 4, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'maydanoz', en: 'parsley' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 4,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'limon', en: 'lemon' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'boil_potato',
      title: { tr: 'Patatesleri haşla', en: 'Boil the potatoes' },
      instruction: {
        tr: 'Patatesleri kabuğuyla, bıçak kolay batana dek haşla.',
        en: 'Boil the potatoes in their skins until a knife slides in easily.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 1200,
      voice_on_enter: {
        tr: 'Patatesleri haşlamaya koyalım.',
        en: "Let's get the potatoes boiling.",
      },
      voice_on_complete: {
        tr: 'Patatesler yumuşamış olmalı.',
        en: 'The potatoes should be tender.',
      },
    },
    {
      id: 'chop',
      title: { tr: 'Soğan ve maydanozu doğra', en: 'Chop onion and parsley' },
      instruction: {
        tr: 'Soğanı ince, maydanozu kıyarak doğra.',
        en: 'Slice the onion thinly and finely chop the parsley.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['boil_potato'],
      completion: 'user',
    },
    {
      id: 'dress',
      title: { tr: 'Doğra, sosla, karıştır', en: 'Cube, dress, toss' },
      instruction: {
        tr: 'Patatesler ılıyınca soy, küp doğra; zeytinyağı, limon, tuz ve yeşillikle harmanla.',
        en: 'Peel and cube the warm potatoes; toss with olive oil, lemon, salt and herbs.',
      },
      kind: 'finish',
      requires: ['boil_potato', 'chop'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Ilıkken harmanla, daha iyi emer. Afiyet olsun!',
        en: 'Toss while warm so it soaks up the dressing — enjoy!',
      },
    },
  ],
};
