/** Sucuklu Yumurta — yumurta adımı KRİTİK (iyice pişmeli). */
import type { Recipe } from '../engine/types';

export const sucukluYumurta: Recipe = {
  id: 'sucuklu-yumurta',
  title: { tr: 'Sucuklu Yumurta', en: 'Eggs with Sucuk' },
  servings: 2,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Kızarmış sucuğun üzerine yumurta — klasik Türk kahvaltısı.',
    en: 'Eggs over sizzled sucuk — a Turkish breakfast classic.',
  },
  totalMinutes: 12,
  ingredients: [
    {
      name: { tr: 'sucuk', en: 'sucuk (spiced sausage)' },
      quantity: 8,
      unit: { tr: 'dilim', en: 'slices' },
    },
    { name: { tr: 'yumurta', en: 'egg' }, quantity: 4, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'fry_sucuk',
      title: { tr: 'Sucukları kızart', en: 'Sizzle the sucuk' },
      instruction: {
        tr: 'Sucukları yağsız tavada, iki yüzü de kızarana dek pişir.',
        en: 'Cook the sucuk in a dry pan until browned on both sides.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Sucuk kendi yağını salacak, yağ eklemeye gerek yok.',
        en: 'The sucuk releases its own fat — no oil needed.',
      },
    },
    {
      id: 'add_eggs',
      title: { tr: 'Yumurtaları kır', en: 'Crack the eggs' },
      instruction: {
        tr: 'Yumurtaları sucukların üzerine kır, tuz serp.',
        en: 'Crack the eggs over the sucuk and season with salt.',
      },
      kind: 'action',
      requires: ['fry_sucuk'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Kapağı kapat, beyazı tamamen pişene dek kısık ateşte tut.',
        en: 'Cover and cook on low until the whites are fully set.',
      },
      kind: 'action',
      requires: ['add_eggs'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Yumurta beyazı tamamen pişmeli; akışkan beyaz kalmasın. Emin değilsen biraz daha pişir.',
          en: 'The egg white must be fully cooked; no runny white. If unsure, cook a little more.',
        },
        minInternalTempC: 71,
      },
      voice_on_complete: { tr: 'Beyazı pişmiş olmalı.', en: 'The white should be set.' },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Sıcak, ekmekle servis et.', en: 'Serve hot with bread.' },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
