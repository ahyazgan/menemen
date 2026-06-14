/** Sigara Böreği — kızgın yağ uyarısı (kritik-olmayan güvenlik). */
import type { Recipe } from '../engine/types';

export const sigaraBoregi: Recipe = {
  id: 'sigara-boregi',
  title: { tr: 'Sigara Böreği', en: 'Cheese Rolls (Sigara Böreği)' },
  servings: 4,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Çıtır çıtır, peynirli klasik börek.',
    en: 'Crispy, cheese-filled classic pastry rolls.',
  },
  totalMinutes: 25,
  nodes: [
    {
      id: 'make_filling',
      title: { tr: 'İç harcı hazırla', en: 'Make the filling' },
      instruction: {
        tr: 'Beyaz peyniri maydanozla ezerek karıştır.',
        en: 'Mash the white cheese together with parsley.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['heat_oil'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Peyniri maydanozla karıştıralım.',
        en: "Let's mix the cheese with parsley.",
      },
    },
    {
      id: 'roll',
      title: { tr: 'Böğrekleri sar', en: 'Roll them up' },
      instruction: {
        tr: 'Yufkayı üçgen kes, harcı koy, sigara gibi sıkıca sar.',
        en: 'Cut the filo into triangles, add filling and roll tightly like a cigar.',
      },
      kind: 'prep',
      requires: ['make_filling'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yufkaya harcı koyup sıkıca saralım.',
        en: 'Add the filling to the filo and roll it up tightly.',
      },
    },
    {
      id: 'heat_oil',
      title: { tr: 'Yağı kızdır', en: 'Heat the oil' },
      instruction: {
        tr: 'Tavada kızartma yağını orta-yüksek ateşte kızdır.',
        en: 'Heat frying oil in a pan over medium-high heat.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['make_filling'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yağı kızdıralım, ama dumanlanmasın.',
        en: "Let's heat the oil, but don't let it smoke.",
      },
      recovery_rules: {
        yaktim: {
          tr: 'Yağ dumanlandıysa ocağı kapat, soğumasını bekle, ateşi düşür.',
          en: 'If the oil starts smoking, turn off the heat, let it cool, then lower the temperature.',
        },
      },
    },
    {
      id: 'fry',
      title: { tr: 'Kızart', en: 'Fry' },
      instruction: {
        tr: 'Böğrekleri altın rengine dönene dek çevirerek kızart.',
        en: 'Fry the rolls, turning, until golden.',
      },
      kind: 'action',
      requires: ['roll', 'heat_oil'],
      completion: 'user',
      durationSec: 240,
      safety: {
        critical: false,
        message: {
          tr: 'Kızgın yağa dikkat: börekleri kendine doğru değil, uzağa yatık bırak; su değdirme, sıçrar.',
          en: 'Watch the hot oil: lay the rolls in away from you, not toward you; keep water away — it spatters.',
        },
      },
      voice_on_enter: {
        tr: 'Böğrekleri dikkatlice yağa bırak, altın renginde çıkar.',
        en: 'Carefully lay the rolls into the oil and take them out golden.',
      },
    },
    {
      id: 'drain',
      title: { tr: 'Süzdür ve servis et', en: 'Drain and serve' },
      instruction: {
        tr: 'Kâğıt havluya alıp fazla yağını süzdür, sıcak servis et.',
        en: 'Drain on paper towels and serve hot.',
      },
      kind: 'finish',
      requires: ['fry'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yağını süzüp sıcak servis et. Afiyet olsun!',
        en: 'Drain and serve hot. Enjoy!',
      },
    },
  ],
};
