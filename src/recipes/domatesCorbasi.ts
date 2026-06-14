/** Domates Çorbası — blender adımında kritik-olmayan sıcak sıvı uyarısı. */
import type { Recipe } from '../engine/types';

export const domatesCorbasi: Recipe = {
  id: 'domates-corbasi',
  title: { tr: 'Domates Çorbası', en: 'Tomato Soup' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Kadifemsi, sıcacık ev usulü domates çorbası.',
    en: 'A velvety, warming homemade tomato soup.',
  },
  totalMinutes: 25,
  nodes: [
    {
      id: 'roux',
      title: { tr: 'Unu kavur', en: 'Toast the flour' },
      instruction: {
        tr: 'Tereyağında unu kokusu çıkana dek kavur.',
        en: 'Toast the flour in butter until fragrant.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 120,
      voice_on_enter: {
        tr: 'Tereyağında unu kavuralım, topaklanmasın.',
        en: "Let's toast the flour in butter so it doesn't clump.",
      },
      recovery_rules: {
        yaktim: {
          tr: 'Un karardıysa baştan başla; çok kısık ateşte kavur.',
          en: 'If the flour browned, start over; toast over very low heat.',
        },
      },
    },
    {
      id: 'add_tomato',
      title: { tr: 'Domates ve su ekle', en: 'Add tomato and water' },
      instruction: {
        tr: 'Rendelenmiş domates, salça ve sıcak suyu ekle, karıştır.',
        en: 'Add the grated tomato, tomato paste and hot water, then stir.',
      },
      kind: 'action',
      requires: ['roux'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Domatesi ve suyu ekleyip karıştır.',
        en: 'Add the tomato and water and stir.',
      },
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Kaynayınca kısık ateşte pişir.',
        en: 'Once boiling, simmer over low heat.',
      },
      kind: 'action',
      requires: ['add_tomato'],
      completion: 'timer',
      durationSec: 600,
      voice_on_complete: { tr: 'Çorba kıvamını aldı.', en: 'The soup has thickened.' },
    },
    {
      id: 'blend',
      title: { tr: 'Blenderdan geçir', en: 'Blend' },
      instruction: {
        tr: 'El blenderıyla pürüzsüz et.',
        en: 'Blend smooth with a hand blender.',
      },
      kind: 'action',
      requires: ['simmer'],
      completion: 'user',
      safety: {
        critical: false,
        message: {
          tr: 'Sıcak sıvıyı blenderlarken dikkatli ol — blenderı içine batırıp öyle çalıştır, sıçramasın.',
          en: "Be careful blending hot liquid — submerge the blender before turning it on so it doesn't splash.",
        },
      },
      voice_on_enter: {
        tr: 'Pürüzsüz olması için blenderdan geçirelim; dikkat, sıcak.',
        en: "Let's blend it smooth; careful, it's hot.",
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Üzerine rendelenmiş kaşar serpip servis et.',
        en: 'Sprinkle grated cheese on top and serve.',
      },
      kind: 'finish',
      requires: ['blend'],
      completion: 'user',
      voice_on_enter: { tr: 'Kaşarla servis et, afiyet olsun!', en: 'Serve with cheese — enjoy!' },
    },
  ],
};
