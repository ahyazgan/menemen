/** Tavuk Çorbası — tavuk adımı KRİTİK (iç sıcaklık 74°C). */
import type { Recipe } from '../engine/types';

export const tavukCorbasi: Recipe = {
  id: 'tavuk-corbasi',
  title: { tr: 'Tavuk Çorbası', en: 'Chicken Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Şehriyeli, havuçlu, iyileştiren bir çorba.',
    en: 'A comforting soup with vermicelli and carrot.',
  },
  totalMinutes: 35,
  ingredients: [
    {
      name: { tr: 'tavuk göğsü', en: 'chicken breast' },
      quantity: 1,
      unit: { tr: 'adet', en: 'pcs' },
    },
    { name: { tr: 'havuç', en: 'carrot' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'şehriye', en: 'vermicelli' },
      quantity: 3,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 6, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'boil_chicken',
      title: { tr: 'Tavuğu haşla', en: 'Boil the chicken' },
      instruction: {
        tr: 'Tavuğu suda iyice pişir; ortası beyaz olmalı. Sonra didikle, suyunu sakla.',
        en: 'Cook the chicken fully in water; the center should be white. Shred it and keep the broth.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 1200,
      safety: {
        critical: true,
        message: {
          tr: 'Tavuk tam pişmeli; iç sıcaklık 74°C olmalı. Pembe kalmasın, emin değilsen biraz daha pişir.',
          en: 'Chicken must be fully cooked; internal temperature should reach 74°C. No pink left; if unsure, cook more.',
        },
        minInternalTempC: 74,
      },
      voice_on_enter: { tr: 'Tavuğu iyice haşlayalım.', en: "Let's boil the chicken thoroughly." },
    },
    {
      id: 'add_veg',
      title: { tr: 'Havuç ve şehriyeyi ekle', en: 'Add carrot and vermicelli' },
      instruction: {
        tr: 'Didiklenmiş tavuğu, rendelenmiş havucu ve şehriyeyi suya ekle.',
        en: 'Add the shredded chicken, grated carrot and vermicelli to the broth.',
      },
      kind: 'action',
      requires: ['boil_chicken'],
      completion: 'user',
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Şehriye ve havuç yumuşayana dek 10-12 dakika pişir, tuzunu ayarla.',
        en: 'Simmer 10–12 minutes until the vermicelli and carrot soften; adjust the salt.',
      },
      kind: 'action',
      requires: ['add_veg'],
      completion: 'timer',
      durationSec: 720,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Üzerine biraz tereyağı, sıcak servis et.',
        en: 'Finish with a knob of butter and serve hot.',
      },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Sıcacık servis et, afiyet olsun!', en: 'Serve it warm — enjoy!' },
    },
  ],
};
