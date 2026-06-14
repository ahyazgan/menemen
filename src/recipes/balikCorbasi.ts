/** Balık Çorbası — balık adımı KRİTİK (iç sıcaklık 63°C). */
import type { Recipe } from '../engine/types';

export const balikCorbasi: Recipe = {
  id: 'balik-corbasi',
  title: { tr: 'Balık Çorbası', en: 'Fish Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Sebzeli, limonlu, hafif bir deniz çorbası.',
    en: 'A light sea soup with vegetables and lemon.',
  },
  totalMinutes: 35,
  ingredients: [
    { name: { tr: 'balık', en: 'fish fillet' }, quantity: 400, unit: { tr: 'g', en: 'g' } },
    { name: { tr: 'havuç', en: 'carrot' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'patates', en: 'potato' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'limon', en: 'lemon' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'su', en: 'water' }, quantity: 6, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'soften_veg',
      title: { tr: 'Sebzeleri yumuşat', en: 'Soften the vegetables' },
      instruction: {
        tr: 'Soğan, havuç ve patatesi suda yarı yumuşayana dek pişir.',
        en: 'Cook the onion, carrot and potato in water until half-tender.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 900,
      voice_on_enter: {
        tr: 'Önce sebzeleri pişirelim, balık sona kalsın.',
        en: "Let's cook the vegetables first; the fish goes in last.",
      },
    },
    {
      id: 'add_fish',
      title: { tr: 'Balığı ekle', en: 'Add the fish' },
      instruction: {
        tr: 'Kuşbaşı balığı ekle, dağılmadan pişir.',
        en: 'Add the cubed fish and cook gently without breaking it up.',
      },
      kind: 'action',
      requires: ['soften_veg'],
      completion: 'timer',
      durationSec: 600,
      safety: {
        critical: true,
        message: {
          tr: 'Balık tam pişmeli; eti matlaşıp çatalla kolayca ayrılmalı (iç sıcaklık ~63°C). Emin değilsen biraz daha pişir.',
          en: 'The fish must be fully cooked; it should turn opaque and flake easily (internal ~63°C). If unsure, cook a bit more.',
        },
        minInternalTempC: 63,
      },
      voice_on_complete: {
        tr: 'Balık matlaşıp ayrışıyorsa pişmiştir.',
        en: 'If the fish is opaque and flakes, it is done.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Limonla servis et', en: 'Serve with lemon' },
      instruction: { tr: 'Limon sıkıp sıcak servis et.', en: 'Squeeze lemon and serve hot.' },
      kind: 'finish',
      requires: ['add_fish'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
