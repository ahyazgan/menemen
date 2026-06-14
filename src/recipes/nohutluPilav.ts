/** Nohutlu Pilav — vejetaryen; tereyağlı, nohutlu. */
import type { Recipe } from '../engine/types';

export const nohutluPilav: Recipe = {
  id: 'nohutlu-pilav',
  title: { tr: 'Nohutlu Pilav', en: 'Chickpea Pilaf' },
  servings: 4,
  locale: 'tr',
  category: 'pilav',
  summary: {
    tr: 'Tane tane pilav, nohutla doyurucu.',
    en: 'Fluffy pilaf made filling with chickpeas.',
  },
  totalMinutes: 30,
  ingredients: [
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    {
      name: { tr: 'haşlanmış nohut', en: 'cooked chickpeas' },
      quantity: 1,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'sıcak su', en: 'hot water' },
      quantity: 3,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'toast_rice',
      title: { tr: 'Pirinci kavur', en: 'Toast the rice' },
      instruction: {
        tr: 'Tereyağında yıkanmış pirinci, tanesi şeffaflaşana dek kavur; nohutu ekle.',
        en: 'Toast the rinsed rice in butter until translucent; add the chickpeas.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Pirinci kavurmaya başlayalım.', en: "Let's start toasting the rice." },
    },
    {
      id: 'cook',
      title: { tr: 'Suyu ekle ve pişir', en: 'Add water and cook' },
      instruction: {
        tr: 'Sıcak su ve tuzu ekle, suyunu çekene dek kısık ateşte pişir.',
        en: 'Add hot water and salt; cook on low until absorbed.',
      },
      kind: 'action',
      requires: ['toast_rice'],
      completion: 'timer',
      durationSec: 900,
      voice_on_complete: { tr: 'Suyunu çekmiş olmalı.', en: 'The water should be absorbed.' },
    },
    {
      id: 'rest',
      title: { tr: 'Demlendir', en: 'Rest' },
      instruction: {
        tr: 'Ocağı kapat, 10 dakika demlendir.',
        en: 'Turn off the heat and rest 10 minutes.',
      },
      kind: 'action',
      requires: ['cook'],
      completion: 'timer',
      durationSec: 600,
    },
    {
      id: 'serve',
      title: { tr: 'Karıştır ve servis et', en: 'Fluff and serve' },
      instruction: {
        tr: 'Çatalla havalandır, sıcak servis et.',
        en: 'Fluff with a fork and serve hot.',
      },
      kind: 'finish',
      requires: ['rest'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
