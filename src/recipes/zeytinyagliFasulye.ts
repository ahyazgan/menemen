/** Zeytinyağlı Taze Fasulye — vegan; domatesli, zeytinyağlı. */
import type { Recipe } from '../engine/types';

export const zeytinyagliFasulye: Recipe = {
  id: 'zeytinyagli-fasulye',
  title: { tr: 'Zeytinyağlı Taze Fasulye', en: 'Olive Oil Green Beans' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Domatesli, zeytinyağlı, soğukken bile lezzetli.',
    en: 'With tomato and olive oil — delicious even cold.',
  },
  totalMinutes: 40,
  ingredients: [
    { name: { tr: 'taze fasulye', en: 'green beans' }, quantity: 500, unit: { tr: 'g', en: 'g' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'domates', en: 'tomato' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'zeytinyağı', en: 'olive oil' }, quantity: 4, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'su', en: 'water' }, quantity: 1, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'clean_beans',
      title: { tr: 'Fasulyeleri ayıkla', en: 'Trim the beans' },
      instruction: {
        tr: 'Fasulyelerin uçlarını kır, kılçığını al, ikiye böl.',
        en: 'Snap off the ends, remove strings, and halve the beans.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Önce fasulyeleri ayıklayalım.', en: "Let's trim the beans first." },
    },
    {
      id: 'saute_onion',
      title: { tr: 'Soğanı kavur', en: 'Sauté the onion' },
      instruction: { tr: 'Soğanı zeytinyağında yumuşat, domatesi ekle.', en: 'Soften the onion in olive oil and add the tomato.' },
      kind: 'action',
      requires: [],
      parallel_with: ['clean_beans'],
      completion: 'user',
    },
    {
      id: 'combine',
      title: { tr: 'Birleştir', en: 'Combine' },
      instruction: {
        tr: 'Fasulyeleri, suyu ve tuzu ekleyip karıştır.',
        en: 'Add the beans, water and salt, and stir.',
      },
      kind: 'action',
      requires: ['clean_beans', 'saute_onion'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Kıs ateşte pişir', en: 'Simmer' },
      instruction: {
        tr: 'Kapağı kapat, fasulyeler yumuşayana dek 25-30 dakika pişir.',
        en: 'Cover and simmer 25–30 minutes until the beans are tender.',
      },
      kind: 'action',
      requires: ['combine'],
      completion: 'timer',
      durationSec: 1500,
      recovery_rules: {
        sulu: { tr: 'Suyu fazlaysa kapağı açıp biraz uçur.', en: 'If too watery, uncover and reduce a little.' },
      },
    },
    {
      id: 'serve',
      title: { tr: 'Soğut ve servis et', en: 'Cool and serve' },
      instruction: { tr: 'Ilık ya da soğuk, zeytinyağıyla servis et.', en: 'Serve warm or cold, with a drizzle of olive oil.' },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
