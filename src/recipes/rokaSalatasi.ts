/** Roka Salatası — vegan; nar ekşili, limonlu. */
import type { Recipe } from '../engine/types';

export const rokaSalatasi: Recipe = {
  id: 'roka-salatasi',
  title: { tr: 'Roka Salatası', en: 'Arugula Salad' },
  servings: 2,
  locale: 'tr',
  category: 'salata',
  summary: {
    tr: 'Rokanın keskinliği, nar ekşisinin mayhoşluğu.',
    en: 'Peppery arugula with tangy pomegranate molasses.',
  },
  totalMinutes: 8,
  ingredients: [
    { name: { tr: 'roka', en: 'arugula' }, quantity: 1, unit: { tr: 'demet', en: 'bunch' } },
    { name: { tr: 'domates', en: 'cherry tomato' }, quantity: 6, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'nar ekşisi', en: 'pomegranate molasses' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'limon', en: 'lemon' }, quantity: 0.5, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'prep',
      title: { tr: 'Hazırla', en: 'Prepare' },
      instruction: {
        tr: 'Rokayı yıka, domatesleri ikiye böl, geniş bir kâseye al.',
        en: 'Wash the arugula, halve the tomatoes, place in a wide bowl.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Rokayı güzelce yıkayalım.', en: "Let's wash the arugula well." },
    },
    {
      id: 'dress',
      title: { tr: 'Sosla', en: 'Dress' },
      instruction: {
        tr: 'Zeytinyağı, nar ekşisi, limon ve tuzu gezdirip nazikçe karıştır.',
        en: 'Drizzle olive oil, pomegranate molasses, lemon and salt; toss gently.',
      },
      kind: 'finish',
      requires: ['prep'],
      completion: 'user',
      voice_on_enter: { tr: 'Nazikçe harmanla, afiyet olsun!', en: 'Toss gently — enjoy!' },
    },
  ],
};
