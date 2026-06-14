/** Pankek — vejetaryen; sütlü-yumurtalı hamur, tavada. */
import type { Recipe } from '../engine/types';

export const pankek: Recipe = {
  id: 'pankek',
  title: { tr: 'Pankek', en: 'Pancakes' },
  servings: 2,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Kabarık, yumuşacık; bal ya da reçelle.',
    en: 'Fluffy and soft; great with honey or jam.',
  },
  totalMinutes: 20,
  ingredients: [
    { name: { tr: 'un', en: 'flour' }, quantity: 1, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'süt', en: 'milk' }, quantity: 1, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'yumurta', en: 'egg' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'şeker', en: 'sugar' }, quantity: 1, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
  ],
  nodes: [
    {
      id: 'mix_batter',
      title: { tr: 'Hamuru hazırla', en: 'Make the batter' },
      instruction: {
        tr: 'Un, süt, yumurta ve şekeri pürüzsüz olana dek çırp.',
        en: 'Whisk flour, milk, egg and sugar until smooth.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Hamuru topaksız olana dek çırpalım.',
        en: "Let's whisk the batter until lump-free.",
      },
    },
    {
      id: 'heat_pan',
      title: { tr: 'Tavayı ısıt', en: 'Heat the pan' },
      instruction: {
        tr: 'Az tereyağıyla tavayı orta ateşte ısıt.',
        en: 'Heat the pan with a little butter over medium.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['mix_batter'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Birer kepçe dök; üstü kabarcıklanınca çevir, diğer yüzü de pişir.',
        en: 'Pour a ladleful; flip when bubbles form, cook the other side.',
      },
      kind: 'action',
      requires: ['mix_batter', 'heat_pan'],
      completion: 'user',
      voice_on_complete: {
        tr: 'İki yüzü de altın olunca hazır.',
        en: 'Ready when golden on both sides.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Üzerine bal ya da reçel ile servis et.', en: 'Serve with honey or jam.' },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
