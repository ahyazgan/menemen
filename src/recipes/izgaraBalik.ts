/** Izgara Balık — kritik balık pişirme (iç sıcaklık 63°C). */
import type { Recipe } from '../engine/types';

export const izgaraBalik: Recipe = {
  id: 'izgara-balik',
  title: { tr: 'Izgara Balık', en: 'Grilled Fish' },
  servings: 2,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Limonlu, sade ve sağlıklı ızgara balık.',
    en: 'Simple, healthy grilled fish with lemon.',
  },
  totalMinutes: 20,
  ingredients: [
    {
      name: {
        tr: 'balık',
        en: 'fish',
      },
      quantity: 2,
      unit: {
        tr: 'adet',
        en: 'pcs',
      },
    },
    {
      name: {
        tr: 'limon',
        en: 'lemon',
      },
      quantity: 1,
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
      quantity: 2,
      unit: {
        tr: 'yemek kaşığı',
        en: 'tbsp',
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
        tr: 'roka',
        en: 'arugula',
      },
    },
  ],
  nodes: [
    {
      id: 'prep_fish',
      title: { tr: 'Balığı hazırla', en: 'Prepare the fish' },
      instruction: {
        tr: 'Balığı temizle, kurula; tuz, limon ve zeytinyağı sür.',
        en: 'Clean and pat the fish dry; rub with salt, lemon and olive oil.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['heat_grill'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Balığı kurulayıp tuz-limon-yağ sürelim; kuru balık ızgaraya yapışmaz.',
        en: "Let's pat the fish dry and rub it with salt, lemon and oil; dry fish won't stick to the grill.",
      },
    },
    {
      id: 'heat_grill',
      title: { tr: 'Izgarayı kızdır', en: 'Heat the grill' },
      instruction: {
        tr: 'Izgarayı/tavayı iyice kızdır.',
        en: 'Heat the grill or pan thoroughly.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['prep_fish'],
      completion: 'user',
      voice_on_enter: { tr: 'Izgarayı iyice kızdıralım.', en: "Let's get the grill really hot." },
    },
    {
      id: 'grill',
      title: { tr: 'Pişir', en: 'Grill' },
      instruction: {
        tr: 'Her iki yüzünü, eti pul pul ayrılana dek pişir.',
        en: 'Cook both sides until the flesh flakes apart.',
      },
      kind: 'action',
      requires: ['prep_fish', 'heat_grill'],
      completion: 'user',
      durationSec: 600,
      safety: {
        critical: true,
        message: {
          tr: 'Balık tam pişmeli: eti matlaşmalı ve çatalla kolayca pul pul ayrılmalı, iç sıcaklık 63°C olmalı. Cam gibi/şeffaf görünüyorsa biraz daha pişir.',
          en: 'The fish must be fully cooked: the flesh should turn opaque and flake easily with a fork, internal temperature should reach 63°C. If it looks glassy or translucent, cook a little more.',
        },
        minInternalTempC: 63,
      },
      voice_on_enter: {
        tr: 'Acele çevirme; bir yüzü iyice kızarınca dön.',
        en: "Don't rush to flip it; turn once one side is well seared.",
      },
      voice_on_complete: {
        tr: 'Çatalla dene: et pul pul ayrılıyor mu?',
        en: 'Test with a fork: does the flesh flake apart?',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Roka ve limonla servis et.', en: 'Serve with arugula and lemon.' },
      kind: 'finish',
      requires: ['grill'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Roka ve limonla servis et, afiyet olsun!',
        en: 'Serve with arugula and lemon — enjoy!',
      },
    },
  ],
};
