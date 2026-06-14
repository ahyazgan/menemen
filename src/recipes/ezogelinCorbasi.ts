/** Ezogelin Çorbası — vegan; mercimek-pirinç-bulgur, naneli. */
import type { Recipe } from '../engine/types';

export const ezogelinCorbasi: Recipe = {
  id: 'ezogelin-corbasi',
  title: { tr: 'Ezogelin Çorbası', en: 'Ezogelin Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Naneli, kırmızı, içini ısıtan klasik çorba.',
    en: 'A minty, red, soul-warming classic soup.',
  },
  totalMinutes: 35,
  ingredients: [
    {
      name: { tr: 'kırmızı mercimek', en: 'red lentils' },
      quantity: 1,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 2, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'bulgur', en: 'bulgur' }, quantity: 2, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'nane', en: 'dried mint' } },
    {
      name: { tr: 'sıcak su', en: 'hot water' },
      quantity: 6,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'saute',
      title: { tr: 'Soğan ve salçayı kavur', en: 'Sauté onion and paste' },
      instruction: {
        tr: 'Soğanı yağda kavur, salça ve naneyi ekleyip kokusu çıkana dek karıştır.',
        en: 'Sauté the onion, add paste and mint, stir until fragrant.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Soğanı kavuralım, nane güzel kokacak.',
        en: "Let's sauté the onion; the mint will smell lovely.",
      },
    },
    {
      id: 'add_grains',
      title: { tr: 'Mercimek ve taneleri ekle', en: 'Add lentils and grains' },
      instruction: {
        tr: 'Mercimek, pirinç ve bulguru ekleyip kısaca kavur.',
        en: 'Add lentils, rice and bulgur and toast briefly.',
      },
      kind: 'action',
      requires: ['saute'],
      completion: 'user',
    },
    {
      id: 'add_water',
      title: { tr: 'Sıcak suyu ekle', en: 'Add hot water' },
      instruction: {
        tr: 'Sıcak su ve tuzu ekle, kaynamaya bırak.',
        en: 'Add the hot water and salt, bring to a boil.',
      },
      kind: 'action',
      requires: ['add_grains'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Kıs ateşte pişir', en: 'Simmer' },
      instruction: {
        tr: 'Mercimek dağılana dek kısık ateşte 20-25 dakika pişir, ara sıra karıştır.',
        en: 'Simmer 20–25 minutes until the lentils break down, stirring now and then.',
      },
      kind: 'action',
      requires: ['add_water'],
      completion: 'timer',
      durationSec: 1320,
      voice_on_complete: {
        tr: 'Mercimekler dağılmış olmalı.',
        en: 'The lentils should have broken down.',
      },
      recovery_rules: {
        sulu: {
          tr: 'Çok suluysa kapağı açıp birkaç dakika daha pişir.',
          en: 'If too thin, cook uncovered a few more minutes.',
        },
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'İstersen üzerine kızdırılmış nane gez, sıcak servis et.',
        en: 'Drizzle with sizzled mint if you like, and serve hot.',
      },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Sıcacık servis et, afiyet olsun!', en: 'Serve piping hot — enjoy!' },
    },
  ],
};
