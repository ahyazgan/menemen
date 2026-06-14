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
      title: 'Harcı yoğur',
      instruction: 'Kıymayı rendelenmiş soğan, baharat ve ekmek içiyle yoğur.',
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: 'Kıymayı baharatlarla güzelce yoğuralım.',
    },
    {
      id: 'rest',
      title: 'Dinlendir',
      instruction: 'Harcı buzdolabında dinlendir.',
      kind: 'action',
      requires: ['mix'],
      completion: 'timer',
      durationSec: 900,
      voice_on_enter: 'Harç dinlensin, kıvamı oturacak.',
      voice_on_complete: 'Harç hazır.',
    },
    {
      id: 'shape',
      title: 'Şekil ver',
      instruction: 'Köfteleri eşit boyda şekillendir.',
      kind: 'prep',
      requires: ['rest'],
      completion: 'user',
    },
    {
      id: 'cook',
      title: 'Pişir',
      instruction: 'Tavada her iki yüzü kızarana ve içi pişene dek pişir.',
      kind: 'action',
      requires: ['shape'],
      completion: 'user',
      durationSec: 600,
      safety: {
        critical: true,
        message:
          'Köftelerin içi tamamen pişmeli (pembe kalmamalı), iç sıcaklık 71°C olmalı. Birini ortadan kesip kontrol et.',
        minInternalTempC: 71,
      },
      voice_on_enter: 'Köfteleri orta ateşte çevirerek pişir.',
      voice_on_complete: 'Bir köfteyi kesip içinin piştiğini kontrol et.',
    },
    {
      id: 'serve',
      title: 'Servis et',
      instruction: 'Közlenmiş biber ve pilavla servis et.',
      kind: 'finish',
      requires: ['cook'],
      completion: 'user',
      voice_on_enter: 'Afiyet olsun!',
    },
  ],
};
