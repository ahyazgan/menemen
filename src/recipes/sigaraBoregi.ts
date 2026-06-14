/** Sigara Böreği — kızgın yağ uyarısı (kritik-olmayan güvenlik). */
import type { Recipe } from '../engine/types';

export const sigaraBoregi: Recipe = {
  id: 'sigara-boregi',
  title: { tr: 'Sigara Böreği', en: 'Cheese Rolls (Sigara Böreği)' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Çıtır çıtır, peynirli klasik börek.',
    en: 'Crispy, cheese-filled classic pastry rolls.',
  },
  totalMinutes: 25,
  nodes: [
    {
      id: 'make_filling',
      title: 'İç harcı hazırla',
      instruction: 'Beyaz peyniri maydanozla ezerek karıştır.',
      kind: 'prep',
      requires: [],
      parallel_with: ['heat_oil'],
      completion: 'user',
      voice_on_enter: 'Peyniri maydanozla karıştıralım.',
    },
    {
      id: 'roll',
      title: 'Böğrekleri sar',
      instruction: 'Yufkayı üçgen kes, harcı koy, sigara gibi sıkıca sar.',
      kind: 'prep',
      requires: ['make_filling'],
      completion: 'user',
      voice_on_enter: 'Yufkaya harcı koyup sıkıca saralım.',
    },
    {
      id: 'heat_oil',
      title: 'Yağı kızdır',
      instruction: 'Tavada kızartma yağını orta-yüksek ateşte kızdır.',
      kind: 'action',
      requires: [],
      parallel_with: ['make_filling'],
      completion: 'user',
      voice_on_enter: 'Yağı kızdıralım, ama dumanlanmasın.',
      recovery_rules: { yaktim: 'Yağ dumanlandıysa ocağı kapat, soğumasını bekle, ateşi düşür.' },
    },
    {
      id: 'fry',
      title: 'Kızart',
      instruction: 'Böğrekleri altın rengine dönene dek çevirerek kızart.',
      kind: 'action',
      requires: ['roll', 'heat_oil'],
      completion: 'user',
      durationSec: 240,
      safety: {
        critical: false,
        message:
          'Kızgın yağa dikkat: börekleri kendine doğru değil, uzağa yatık bırak; su değdirme, sıçrar.',
      },
      voice_on_enter: 'Böğrekleri dikkatlice yağa bırak, altın renginde çıkar.',
    },
    {
      id: 'drain',
      title: 'Süzdür ve servis et',
      instruction: 'Kâğıt havluya alıp fazla yağını süzdür, sıcak servis et.',
      kind: 'finish',
      requires: ['fry'],
      completion: 'user',
      voice_on_enter: 'Yağını süzüp sıcak servis et. Afiyet olsun!',
    },
  ],
};
