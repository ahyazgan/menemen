/** Fırın Tavuk Baget — kritik tavuk pişirme (iç sıcaklık 74°C). */
import type { Recipe } from '../engine/types';

export const firinTavuk: Recipe = {
  id: 'firin-tavuk',
  title: { tr: 'Fırında Tavuk Baget', en: 'Baked Chicken Drumsticks' },
  servings: 4,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Baharatlı, çıtır kabuklu fırın tavuk.',
    en: 'Spiced, crispy-skinned baked chicken.',
  },
  totalMinutes: 55,
  ingredients: [
    {
      name: {
        tr: 'tavuk baget',
        en: 'chicken drumstick',
      },
      quantity: 8,
      unit: {
        tr: 'adet',
        en: 'pcs',
      },
    },
    {
      name: {
        tr: 'zeytinyağı',
        en: 'olive oil',
      },
      quantity: 3,
      unit: {
        tr: 'yemek kaşığı',
        en: 'tbsp',
      },
    },
    {
      name: {
        tr: 'salça',
        en: 'tomato paste',
      },
      quantity: 1,
      unit: {
        tr: 'yemek kaşığı',
        en: 'tbsp',
      },
    },
    {
      name: {
        tr: 'sarımsak',
        en: 'garlic',
      },
      quantity: 3,
      unit: {
        tr: 'diş',
        en: 'clove',
      },
    },
    {
      name: {
        tr: 'tuz',
        en: 'salt',
      },
    },
    {
      name: {
        tr: 'karabiber',
        en: 'black pepper',
      },
    },
    {
      name: {
        tr: 'kekik',
        en: 'thyme',
      },
    },
  ],
  nodes: [
    {
      id: 'marinate',
      title: { tr: 'Marine et', en: 'Marinate' },
      instruction: {
        tr: 'Bagetleri yağ, salça, sarımsak ve baharatla harmanla.',
        en: 'Toss the drumsticks with oil, tomato paste, garlic and spices.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['preheat'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Tavukları baharatlarla güzelce harmanlayalım.',
        en: "Let's coat the chicken well with the spices.",
      },
    },
    {
      id: 'preheat',
      title: { tr: 'Fırını ısıt', en: 'Preheat the oven' },
      instruction: {
        tr: 'Fırını 200°C ayarla ve ısınmasını bekle.',
        en: 'Set the oven to 200°C and let it preheat.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['marinate'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Fırını 200 dereceye ayarlayalım.',
        en: "Let's set the oven to 200 degrees.",
      },
    },
    {
      id: 'bake',
      title: { tr: 'Fırınla', en: 'Bake' },
      instruction: {
        tr: 'Bagetleri tepside, ara ara çevirerek pişir.',
        en: 'Bake the drumsticks on a tray, turning occasionally.',
      },
      kind: 'action',
      requires: ['marinate', 'preheat'],
      completion: 'user',
      durationSec: 2400,
      safety: {
        critical: true,
        message: {
          tr: 'Tavuk tamamen pişmeli: en kalın yerde iç sıcaklık 74°C olmalı, bıçak batırınca berrak su akmalı. Pembe/sulu görünüyorsa biraz daha pişir.',
          en: 'The chicken must be fully cooked: internal temperature at the thickest part should reach 74°C and the juices should run clear when pierced. If it looks pink or raw, cook a little more.',
        },
        minInternalTempC: 74,
      },
      voice_on_enter: {
        tr: 'Fırına verelim; süre bitince iç sıcaklığı kontrol edeceğiz.',
        en: "Into the oven; we'll check the internal temperature when the time is up.",
      },
      voice_on_complete: {
        tr: 'En kalın bagete bıçak batır; su berrak akıyor mu, içi pembe mi bak.',
        en: 'Pierce the thickest drumstick; check the juices run clear and there is no pink inside.',
      },
    },
    {
      id: 'rest',
      title: { tr: 'Dinlendir ve servis et', en: 'Rest and serve' },
      instruction: {
        tr: 'Birkaç dakika dinlendirip servis et.',
        en: 'Let it rest a few minutes, then serve.',
      },
      kind: 'finish',
      requires: ['bake'],
      completion: 'timer',
      durationSec: 300,
      voice_on_enter: {
        tr: 'Kısaca dinlensin, suyu dağılmasın. Afiyet olsun!',
        en: 'Let it rest briefly so the juices settle. Enjoy!',
      },
    },
  ],
};
