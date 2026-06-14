/** Kuzu Pirzola — et adımı KRİTİK (iç sıcaklık 63°C, dinlendir). */
import type { Recipe } from '../engine/types';

export const kuzuPirzola: Recipe = {
  id: 'kuzu-pirzola',
  title: { tr: 'Kuzu Pirzola', en: 'Lamb Chops' },
  servings: 2,
  locale: 'tr',
  category: 'ana-yemek',
  summary: {
    tr: 'Sade baharatla, ızgarada; sulu ve lezzetli.',
    en: 'Simply seasoned and grilled — juicy and flavorful.',
  },
  totalMinutes: 25,
  ingredients: [
    {
      name: { tr: 'kuzu pirzola', en: 'lamb chops' },
      quantity: 6,
      unit: { tr: 'adet', en: 'pcs' },
    },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'kekik', en: 'thyme' } },
    { name: { tr: 'tuz', en: 'salt' } },
    { name: { tr: 'karabiber', en: 'black pepper' } },
  ],
  nodes: [
    {
      id: 'season',
      title: { tr: 'Baharatla', en: 'Season' },
      instruction: {
        tr: 'Pirzolaları zeytinyağı, kekik ve karabiberle ovala (tuzu pişerken ekle).',
        en: 'Rub the chops with olive oil, thyme and pepper (salt while cooking).',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Etin tadını bastırmadan baharatlayalım.',
        en: "Let's season without overpowering the meat.",
      },
    },
    {
      id: 'sear',
      title: { tr: 'Kızgın ızgarada mühürle', en: 'Sear on high heat' },
      instruction: {
        tr: 'Çok kızgın ızgara/tavada her yüzü 2-3 dakika, istediğin pişmişliğe göre pişir.',
        en: 'On a very hot grill/pan, sear each side 2–3 minutes to your preferred doneness.',
      },
      kind: 'action',
      requires: ['season'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Bütün et parçasında güvenli iç sıcaklık ~63°C’dir; kıymadan farklı olarak orta pişebilir ama emin değilsen daha çok pişir.',
          en: 'For whole cuts the safe internal temperature is ~63°C; unlike mince it can be medium, but cook more if unsure.',
        },
        minInternalTempC: 63,
      },
      voice_on_complete: { tr: 'Et dinlenmeye hazır.', en: 'The meat is ready to rest.' },
    },
    {
      id: 'rest',
      title: { tr: 'Dinlendir', en: 'Rest' },
      instruction: {
        tr: 'Pirzolaları 5 dakika dinlendir ki suyunu salmasın.',
        en: 'Rest the chops 5 minutes so they keep their juices.',
      },
      kind: 'action',
      requires: ['sear'],
      completion: 'timer',
      durationSec: 300,
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Tuzunu ekleyip servis et.', en: 'Add salt and serve.' },
      kind: 'finish',
      requires: ['rest'],
      completion: 'user',
      voice_on_enter: { tr: 'Afiyet olsun!', en: 'Enjoy!' },
    },
  ],
};
