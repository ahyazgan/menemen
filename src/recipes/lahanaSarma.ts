/** Zeytinyağlı Lahana Sarma — vegan; pirinçli iç harç. */
import type { Recipe } from '../engine/types';

export const lahanaSarma: Recipe = {
  id: 'lahana-sarma',
  title: { tr: 'Zeytinyağlı Lahana Sarma', en: 'Cabbage Rolls (Olive Oil)' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'İncecik sarılmış, pirinçli, limonlu zeytinyağlı sarma.',
    en: 'Thinly rolled, olive-oil cabbage rolls with rice and lemon.',
  },
  totalMinutes: 70,
  ingredients: [
    { name: { tr: 'lahana', en: 'cabbage' }, quantity: 1, unit: { tr: 'adet', en: 'head' } },
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 1, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'limon', en: 'lemon' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 5,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'soften_leaves',
      title: { tr: 'Yaprakları haşla', en: 'Blanch the leaves' },
      instruction: {
        tr: 'Lahana yapraklarını kaynar suda yumuşayana dek haşla, ayır.',
        en: 'Blanch the cabbage leaves in boiling water until pliable, then separate.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yapraklar yumuşasın ki kolay sarılsın.',
        en: 'Soften the leaves so they roll easily.',
      },
    },
    {
      id: 'make_filling',
      title: { tr: 'İç harcı yap', en: 'Make the filling' },
      instruction: {
        tr: 'Soğanı kavur, pirinci ve baharatı katıp harcı hazırla.',
        en: 'Sauté the onion, mix in the rice and spices for the filling.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['soften_leaves'],
      completion: 'user',
    },
    {
      id: 'roll',
      title: { tr: 'Sar', en: 'Roll' },
      instruction: {
        tr: 'Yapraklara birer parmak harç koyup sıkıca sar.',
        en: 'Place a finger of filling on each leaf and roll tightly.',
      },
      kind: 'prep',
      requires: ['soften_leaves', 'make_filling'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Sarmaları diz, su-limon-zeytinyağı ekleyip 45 dakika kısık ateşte pişir.',
        en: 'Arrange the rolls, add water, lemon and olive oil, and simmer 45 minutes.',
      },
      kind: 'finish',
      requires: ['roll'],
      completion: 'timer',
      durationSec: 2700,
      voice_on_enter: {
        tr: 'Üzerine ağırlık koy ki dağılmasın.',
        en: 'Place a weight on top so they hold together.',
      },
    },
  ],
};
