/** Tavuklu Pilav — tavuk adımı KRİTİK (iç sıcaklık 74°C). */
import type { Recipe } from '../engine/types';

export const tavukluPilav: Recipe = {
  id: 'tavuklu-pilav',
  title: { tr: 'Tavuklu Pilav', en: 'Chicken Pilaf' },
  servings: 4,
  locale: 'tr',
  category: 'pilav',
  summary: {
    tr: 'Tane tane pilav, didiklenmiş tavukla doyurucu.',
    en: 'Fluffy rice made hearty with shredded chicken.',
  },
  totalMinutes: 40,
  ingredients: [
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tavuk göğsü', en: 'chicken breast' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    { name: { tr: 'tereyağı', en: 'butter' }, quantity: 2, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'sıcak su', en: 'hot water' }, quantity: 3, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'cook_chicken',
      title: { tr: 'Tavuğu haşla', en: 'Boil the chicken' },
      instruction: {
        tr: 'Tavuk göğsünü tuzlu suda iyice pişir; ortası beyaz, suyu berrak olmalı. Sonra didikle.',
        en: 'Cook the chicken breast thoroughly in salted water; the center should be white and juices clear. Then shred.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 1200,
      safety: {
        critical: true,
        message: {
          tr: 'Tavuk tam pişmeli; iç sıcaklık 74°C olmalı. Pembe kısım kalmasın, emin değilsen biraz daha pişir.',
          en: 'Chicken must be fully cooked; internal temperature should reach 74°C. No pink left; if unsure, cook more.',
        },
        minInternalTempC: 74,
      },
      voice_on_enter: { tr: 'Tavuğu iyice haşlayalım, acele etmeyelim.', en: "Let's boil the chicken thoroughly — no rush." },
      voice_on_complete: { tr: 'Tavuk pişmiş olmalı; ortasını kontrol et.', en: 'The chicken should be done; check the center.' },
    },
    {
      id: 'saute_rice',
      title: { tr: 'Pirinci kavur', en: 'Toast the rice' },
      instruction: {
        tr: 'Yıkanmış pirinci tereyağında, tanesi şeffaflaşana dek kavur.',
        en: 'Toast the rinsed rice in butter until the grains turn translucent.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['cook_chicken'],
      completion: 'user',
    },
    {
      id: 'combine',
      title: { tr: 'Birleştir', en: 'Combine' },
      instruction: {
        tr: 'Didiklenmiş tavuğu pirince kat, sıcak su ve tuzu ekle.',
        en: 'Stir the shredded chicken into the rice, add hot water and salt.',
      },
      kind: 'action',
      requires: ['cook_chicken', 'saute_rice'],
      completion: 'timer',
      durationSec: 900,
      voice_on_complete: { tr: 'Suyunu çekmiş olmalı.', en: 'The water should be absorbed now.' },
    },
    {
      id: 'rest',
      title: { tr: 'Demlendir', en: 'Rest' },
      instruction: { tr: 'Ocağı kapat, 10 dakika demlendir.', en: 'Turn off the heat and rest 10 minutes.' },
      kind: 'action',
      requires: ['combine'],
      completion: 'timer',
      durationSec: 600,
    },
    {
      id: 'serve',
      title: { tr: 'Karıştır ve servis et', en: 'Fluff and serve' },
      instruction: { tr: 'Çatalla havalandır, sıcak servis et.', en: 'Fluff with a fork and serve hot.' },
      kind: 'finish',
      requires: ['rest'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
