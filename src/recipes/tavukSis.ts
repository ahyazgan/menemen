/** Tavuk Şiş — tavuk adımı KRİTİK (iç sıcaklık 74°C). */
import type { Recipe } from '../engine/types';

export const tavukSis: Recipe = {
  id: 'tavuk-sis',
  title: { tr: 'Tavuk Şiş', en: 'Chicken Skewers' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Marine edilmiş tavuk, ızgarada sulu ve lezzetli.',
    en: 'Marinated chicken, juicy and flavorful off the grill.',
  },
  totalMinutes: 50,
  ingredients: [
    {
      name: { tr: 'tavuk göğsü', en: 'chicken breast' },
      quantity: 600,
      unit: { tr: 'g', en: 'g' },
    },
    { name: { tr: 'yoğurt', en: 'yogurt' }, quantity: 2, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'biber', en: 'pepper' }, quantity: 2, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 2,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'marinate',
      title: { tr: 'Marine et', en: 'Marinate' },
      instruction: {
        tr: 'Tavuğu kuşbaşı doğra; yoğurt, zeytinyağı, tuz ve baharatla en az 30 dakika beklet.',
        en: 'Cube the chicken; marinate with yogurt, olive oil, salt and spices at least 30 minutes.',
      },
      kind: 'prep',
      requires: [],
      completion: 'timer',
      durationSec: 1800,
      voice_on_enter: {
        tr: 'Marine ne kadar uzun olursa o kadar lezzetli.',
        en: 'The longer it marinates, the tastier.',
      },
    },
    {
      id: 'skewer',
      title: { tr: 'Şişe diz', en: 'Thread the skewers' },
      instruction: {
        tr: 'Tavuğu biber ve soğanla şişlere diz.',
        en: 'Thread the chicken onto skewers with peppers and onion.',
      },
      kind: 'prep',
      requires: ['marinate'],
      completion: 'user',
    },
    {
      id: 'grill',
      title: { tr: 'Izgara yap', en: 'Grill' },
      instruction: {
        tr: 'Şişleri çevirerek her yanı pişene dek ızgarada tut.',
        en: 'Grill the skewers, turning, until cooked through on all sides.',
      },
      kind: 'action',
      requires: ['skewer'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Tavuk tam pişmeli; ortası beyaz, suyu berrak olmalı (iç sıcaklık 74°C). Emin değilsen biraz daha pişir.',
          en: 'Chicken must be fully cooked; center white, juices clear (internal 74°C). If unsure, cook more.',
        },
        minInternalTempC: 74,
      },
      voice_on_complete: {
        tr: 'En kalın parçayı kesip kontrol et.',
        en: 'Cut the thickest piece to check.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Lavaş ve sumaklı soğanla servis et.',
        en: 'Serve with flatbread and sumac onions.',
      },
      kind: 'finish',
      requires: ['grill'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
