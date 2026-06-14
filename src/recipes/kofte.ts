/** Tava Köfte — kritik kıyma pişirme adımı (iç sıcaklık 71°C). */
import type { Recipe } from '../engine/types';

export const kofte: Recipe = {
  id: 'kofte',
  title: { tr: 'Tava Köfte', en: 'Pan Meatballs' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Baharatlı, sulu ev köftesi.',
    en: 'Spiced, juicy homemade meatballs.',
  },
  totalMinutes: 40,
  nodes: [
    {
      id: 'mix',
      title: { tr: 'Harcı yoğur', en: 'Knead the mixture' },
      instruction: {
        tr: 'Kıymayı rendelenmiş soğan, baharat ve ekmek içiyle yoğur.',
        en: 'Knead the mince with grated onion, spices and breadcrumbs.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Kıymayı baharatlarla güzelce yoğuralım.',
        en: "Let's knead the mince well with the spices.",
      },
    },
    {
      id: 'rest',
      title: { tr: 'Dinlendir', en: 'Rest' },
      instruction: { tr: 'Harcı buzdolabında dinlendir.', en: 'Rest the mixture in the fridge.' },
      kind: 'action',
      requires: ['mix'],
      completion: 'timer',
      durationSec: 900,
      voice_on_enter: {
        tr: 'Harç dinlensin, kıvamı oturacak.',
        en: 'Let the mixture rest so it firms up.',
      },
      voice_on_complete: { tr: 'Harç hazır.', en: 'The mixture is ready.' },
    },
    {
      id: 'shape',
      title: { tr: 'Şekil ver', en: 'Shape' },
      instruction: {
        tr: 'Köfteleri eşit boyda şekillendir.',
        en: 'Shape the meatballs to an even size.',
      },
      kind: 'prep',
      requires: ['rest'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Tavada her iki yüzü kızarana ve içi pişene dek pişir.',
        en: 'Cook in the pan until both sides brown and the inside is cooked through.',
      },
      kind: 'action',
      requires: ['shape'],
      completion: 'user',
      durationSec: 600,
      safety: {
        critical: true,
        message: {
          tr: 'Köftelerin içi tamamen pişmeli (pembe kalmamalı), iç sıcaklık 71°C olmalı. Birini ortadan kesip kontrol et.',
          en: 'The meatballs must be fully cooked through (no pink left), internal temperature should reach 71°C. Cut one open in the middle to check.',
        },
        minInternalTempC: 71,
      },
      voice_on_enter: {
        tr: 'Köfteleri orta ateşte çevirerek pişir.',
        en: 'Cook the meatballs over medium heat, turning them.',
      },
      voice_on_complete: {
        tr: 'Bir köfteyi kesip içinin piştiğini kontrol et.',
        en: 'Cut one meatball open and check the inside is cooked.',
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Közlenmiş biber ve pilavla servis et.',
        en: 'Serve with roasted peppers and rice.',
      },
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
