/** Bulgur Pilavı — vegan; soğan-salça kavur, bulguru demle. */
import type { Recipe } from '../engine/types';

export const bulgurPilavi: Recipe = {
  id: 'bulgur-pilavi',
  title: { tr: 'Bulgur Pilavı', en: 'Bulgur Pilaf' },
  servings: 4,
  locale: 'tr',
  category: 'pilav',
  summary: {
    tr: 'Tane tane, doyurucu ve etsiz bir klasik.',
    en: 'Fluffy, filling and meat-free — a classic.',
  },
  totalMinutes: 25,
  ingredients: [
    { name: { tr: 'bulgur', en: 'bulgur' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'soğan', en: 'onion' }, quantity: 1, unit: { tr: 'adet', en: 'pcs' } },
    {
      name: { tr: 'sivri biber', en: 'green pepper' },
      quantity: 1,
      unit: { tr: 'adet', en: 'pcs' },
    },
    {
      name: { tr: 'salça', en: 'tomato paste' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'zeytinyağı', en: 'olive oil' },
      quantity: 3,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    {
      name: { tr: 'sıcak su', en: 'hot water' },
      quantity: 4,
      unit: { tr: 'su bardağı', en: 'cup' },
    },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'saute',
      title: { tr: 'Soğan ve salçayı kavur', en: 'Sauté onion and paste' },
      instruction: {
        tr: 'Soğanı ve biberi zeytinyağında pembeleştir, salçayı ekleyip kokusu çıkana dek kavur.',
        en: 'Soften the onion and pepper in olive oil, add the paste and sauté until fragrant.',
      },
      kind: 'action',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Soğanla başlayalım, salçayı da ekleyince güzel kokacak.',
        en: "Let's start with the onion; it'll smell great once the paste goes in.",
      },
    },
    {
      id: 'add_bulgur',
      title: { tr: 'Bulguru ekle', en: 'Add the bulgur' },
      instruction: {
        tr: 'Bulguru ekleyip birkaç dakika kavur ki tanesi diri kalsın.',
        en: 'Add the bulgur and toast a few minutes so the grains stay firm.',
      },
      kind: 'action',
      requires: ['saute'],
      completion: 'user',
    },
    {
      id: 'add_water',
      title: { tr: 'Sıcak suyu ekle', en: 'Add hot water' },
      instruction: {
        tr: 'Sıcak suyu ve tuzu ekle, kaynayınca kısık ateşe al.',
        en: 'Add the hot water and salt; once it boils, lower the heat.',
      },
      kind: 'action',
      requires: ['add_bulgur'],
      completion: 'timer',
      durationSec: 720,
      voice_on_enter: {
        tr: 'Suyu ekledik, şimdi suyunu çekmesini bekleyelim.',
        en: 'Water in — now wait for it to absorb.',
      },
      voice_on_complete: { tr: 'Suyunu çekti gibi.', en: 'Looks like the water is absorbed.' },
    },
    {
      id: 'rest',
      title: { tr: 'Demlendir', en: 'Let it rest' },
      instruction: {
        tr: 'Ocağı kapat, üzerine bir peçete ve kapak koyup 10 dakika demlendir.',
        en: 'Turn off the heat, cover with a towel and lid, and rest 10 minutes.',
      },
      kind: 'action',
      requires: ['add_water'],
      completion: 'timer',
      durationSec: 600,
    },
    {
      id: 'serve',
      title: { tr: 'Karıştır ve servis et', en: 'Fluff and serve' },
      instruction: {
        tr: 'Çatalla havalandır, sıcak servis et.',
        en: 'Fluff with a fork and serve hot.',
      },
      kind: 'finish',
      requires: ['rest'],
      completion: 'user',
      voice_on_enter: { tr: 'Çatalla havalandır, afiyet olsun!', en: 'Fluff it up — enjoy!' },
    },
  ],
};
