/** İmam Bayıldı — vegan; zeytinyağlı, soğan-domates dolgulu patlıcan. */
import type { Recipe } from '../engine/types';

export const imamBayildi: Recipe = {
  id: 'imam-bayildi',
  title: { tr: 'İmam Bayıldı', en: 'İmam Bayıldı' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Zeytinyağlı, bol soğanlı, soğukken bile lezzetli patlıcan.',
    en: 'Olive-oil eggplant with plenty of onion — delicious even cold.',
  },
  totalMinutes: 55,
  ingredients: [
    { name: { tr: 'patlıcan', en: 'eggplant' }, quantity: 4, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 3, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'domates', en: 'tomato' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'sarımsak', en: 'garlic' }, quantity: 4, unit: { tr: 'diş', en: 'clove' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 6,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'soften_eggplant',
      title: { tr: 'Patlıcanları yumuşat', en: 'Soften the eggplants' },
      instruction: {
        tr: 'Patlıcanları alacalı soyup zeytinyağında her yanı yumuşayana dek pişir.',
        en: 'Peel in stripes and cook the eggplants in olive oil until soft all over.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Patlıcanları yağda yumuşatalım.',
        en: "Let's soften the eggplants in oil.",
      },
    },
    {
      id: 'make_filling',
      title: { tr: 'İç harcı yap', en: 'Make the filling' },
      instruction: {
        tr: 'Bol soğanı, sarımsağı ve domatesi zeytinyağında ağır ağır pişir.',
        en: 'Slowly cook the onions, garlic and tomato in olive oil.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['soften_eggplant'],
      completion: 'user',
    },
    {
      id: 'stuff_simmer',
      title: { tr: 'Doldur ve pişir', en: 'Stuff and simmer' },
      instruction: {
        tr: 'Patlıcanları yar, harcı doldur; az suyla kısık ateşte 25 dakika pişir.',
        en: 'Slit the eggplants, fill them and simmer with a little water 25 minutes.',
      },
      kind: 'action',
      requires: ['soften_eggplant', 'make_filling'],
      completion: 'timer',
      durationSec: 1500,
    },
    {
      id: 'serve',
      title: { tr: 'Soğut ve servis et', en: 'Cool and serve' },
      instruction: { tr: 'Ilık ya da soğuk servis et.', en: 'Serve warm or cold.' },
      kind: 'finish',
      requires: ['stuff_simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
