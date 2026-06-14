/** Nohut Yemeği — vegan; salçalı, sulu nohut. */
import type { Recipe } from '../engine/types';

export const nohutYemegi: Recipe = {
  id: 'nohut-yemegi',
  title: { tr: 'Nohut Yemeği', en: 'Chickpea Stew' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Salçalı, doyurucu, pilavla harika giden bir klasik.',
    en: 'A hearty, tomatoey classic that loves a side of rice.',
  },
  totalMinutes: 35,
  ingredients: [
    {
      name: { tr: 'haşlanmış nohut', en: 'cooked chickpeas' },
      quantity: 2,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 3,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'saute_onion',
      title: { tr: 'Soğanı kavur', en: 'Sauté the onion' },
      instruction: {
        tr: 'Soğanı zeytinyağında pembeleştir.',
        en: 'Soften the onion in olive oil.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: { tr: 'Soğanla başlayalım.', en: "Let's start with the onion." },
    },
    {
      id: 'add_paste',
      title: { tr: 'Salçayı ekle', en: 'Add the paste' },
      instruction: {
        tr: 'Salçayı ekleyip kokusu çıkana dek kavur.',
        en: 'Add the paste and sauté until fragrant.',
      },
      kind: 'action',
      requires: ['saute_onion'],
      completion: 'user',
    },
    {
      id: 'add_chickpeas',
      title: { tr: 'Nohut ve suyu ekle', en: 'Add chickpeas and water' },
      instruction: {
        tr: 'Haşlanmış nohut, su ve tuzu ekle.',
        en: 'Add the cooked chickpeas, water and salt.',
      },
      kind: 'action',
      requires: ['add_paste'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Tatları otursun diye 15-20 dakika kısık ateşte pişir.',
        en: 'Simmer 15–20 minutes to let the flavors settle.',
      },
      kind: 'action',
      requires: ['add_chickpeas'],
      completion: 'timer',
      durationSec: 1080,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Pilav ya da ekmekle sıcak servis et.',
        en: 'Serve hot with rice or bread.',
      },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
