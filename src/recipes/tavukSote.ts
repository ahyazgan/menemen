/** Tavuk Sote — kritik tavuk pişirme adımı (iç sıcaklık 74°C). */
import type { Recipe } from '../engine/types';

export const tavukSote: Recipe = {
  id: 'tavuk-sote',
  title: { tr: 'Tavuk Sote', en: 'Chicken Sauté' },
  servings: 3,
  locale: 'tr',
  summary: {
    tr: 'Sebzeli, sulu, pratik tavuk sote.',
    en: 'A quick, saucy chicken sauté with vegetables.',
  },
  totalMinutes: 30,
  nodes: [
    {
      id: 'chop_chicken',
      title: { tr: 'Tavuğu doğra', en: 'Cut the chicken' },
      instruction: {
        tr: 'Tavuk göğsünü kuşbaşı doğra.',
        en: 'Cut the chicken breast into bite-sized cubes.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_veg'],
      completion: 'user',
      voice_on_enter: { tr: 'Tavuğu kuşbaşı doğrayalım.', en: "Let's cut the chicken into cubes." },
    },
    {
      id: 'chop_veg',
      title: { tr: 'Sebzeleri doğra', en: 'Chop the vegetables' },
      instruction: {
        tr: 'Biber, soğan ve domatesi doğra.',
        en: 'Chop the peppers, onion and tomato.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_chicken'],
      completion: 'user',
    },
    {
      id: 'sear',
      title: { tr: 'Tavuğu soteleyin', en: 'Sear the chicken' },
      instruction: {
        tr: 'Yağı ısıt, tavuğu suyunu çekip renk alana dek soteleme.',
        en: 'Heat the oil and sear the chicken until its liquid evaporates and it takes on color.',
      },
      kind: 'action',
      requires: ['chop_chicken'],
      completion: 'timer',
      durationSec: 480,
      voice_on_enter: { tr: 'Tavuğu kızgın yağda soteleyelim.', en: "Let's sear the chicken in hot oil." },
      voice_on_complete: { tr: 'Tavuk renk aldı.', en: 'The chicken has browned.' },
      recovery_rules: {
        yaktim: {
          tr: 'Ateşi kıs, dipte yanma varsa biraz su ekleyip kazı.',
          en: 'Lower the heat; if it caught on the bottom, add a splash of water and scrape it up.',
        },
      },
    },
    {
      id: 'add_veg',
      title: { tr: 'Sebzeleri ekle', en: 'Add the vegetables' },
      instruction: {
        tr: 'Sebzeleri ekle, yumuşayana dek kavur.',
        en: 'Add the vegetables and sauté until soft.',
      },
      kind: 'action',
      requires: ['sear', 'chop_veg'],
      completion: 'timer',
      durationSec: 420,
      voice_on_enter: {
        tr: 'Sebzeleri ekle, birlikte kavuralım.',
        en: "Add the vegetables and let's sauté them together.",
      },
    },
    {
      id: 'finish_cook',
      title: { tr: 'Pişir', en: 'Cook through' },
      instruction: {
        tr: 'Baharatla; tavuk tamamen pişene dek pişir.',
        en: 'Season; cook until the chicken is fully cooked through.',
      },
      kind: 'action',
      requires: ['add_veg'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Tavuk tamamen pişmeli — en kalın parçada pembe kalmamalı, iç sıcaklık 74°C olmalı. Emin değilsen biraz daha pişir.',
          en: 'The chicken must be fully cooked — no pink in the thickest piece, internal temperature should reach 74°C. If unsure, cook a little more.',
        },
        minInternalTempC: 74,
      },
      voice_on_enter: {
        tr: 'Tavuğun içinin de piştiğinden emin olalım.',
        en: "Let's make sure the chicken is cooked through inside too.",
      },
      voice_on_complete: {
        tr: 'Parçaları kesip pembe kalmadığını kontrol et.',
        en: 'Cut a piece open and check there is no pink left.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Sıcak servis et.', en: 'Serve hot.' },
      kind: 'finish',
      requires: ['finish_cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
