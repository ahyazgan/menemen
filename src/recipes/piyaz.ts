/** Piyaz — vegan; haşlanmış fasulye, soğan, zeytinyağlı. */
import type { Recipe } from '../engine/types';

export const piyaz: Recipe = {
  id: 'piyaz',
  title: { tr: 'Piyaz', en: 'White Bean Salad (Piyaz)' },
  servings: 4,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'Haşlanmış kuru fasulye, soğan ve maydanozla ferah.',
    en: 'Boiled white beans with onion and parsley — fresh and bright.',
  },
  totalMinutes: 15,
  ingredients: [
    {
      name: { tr: 'haşlanmış kuru fasulye', en: 'cooked white beans' },
      quantity: 2,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'maydanoz', en: 'parsley' } },
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
      id: 'prep',
      title: { tr: 'Hazırla', en: 'Prepare' },
      instruction: {
        tr: 'Soğanı piyazlık ince doğra, tuzla ovup acısını al; maydanozu kıy.',
        en: 'Slice the onion thinly, rub with salt to mellow it; chop the parsley.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Soğanı tuzla ovunca acısı gider.',
        en: 'Rubbing the onion with salt mellows it.',
      },
    },
    {
      id: 'combine',
      title: { tr: 'Karıştır', en: 'Combine' },
      instruction: {
        tr: 'Fasulye, soğan ve maydanozu zeytinyağı, limon ve tuzla harmanla.',
        en: 'Toss the beans, onion and parsley with olive oil, lemon and salt.',
      },
      kind: 'finish',
      requires: ['prep'],
      completion: 'user',
      voice_on_enter: {
        tr: 'İstersen üzerine haşlanmış yumurta ekle. Afiyet olsun!',
        en: 'Add boiled egg on top if you like — enjoy!',
      },
    },
  ],
};
