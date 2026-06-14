/** Yayla Çorbası — vejetaryen; yoğurtlu, pirinçli, naneli. */
import type { Recipe } from '../engine/types';

export const yaylaCorbasi: Recipe = {
  id: 'yayla-corbasi',
  title: { tr: 'Yayla Çorbası', en: 'Yayla (Yogurt) Soup' },
  servings: 4,
  locale: 'tr',
  category: 'corba',
  summary: {
    tr: 'Yoğurtlu, naneli, hafif ekşi bir Anadolu klasiği.',
    en: 'A tangy, minty yogurt soup — an Anatolian classic.',
  },
  totalMinutes: 30,
  ingredients: [
    { name: { tr: 'pirinç', en: 'rice' }, quantity: 3, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'yoğurt', en: 'yogurt' }, quantity: 2, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'un', en: 'flour' }, quantity: 1, unit: { tr: 'yemek kaşığı', en: 'tbsp' } },
    { name: { tr: 'nane', en: 'dried mint' } },
    {
      name: { tr: 'tereyağı', en: 'butter' },
      quantity: 1,
      unit: { tr: 'yemek kaşığı', en: 'tbsp' },
    },
    { name: { tr: 'su', en: 'water' }, quantity: 5, unit: { tr: 'su bardağı', en: 'cup' } },
    { name: { tr: 'tuz', en: 'salt' } },
  ],
  nodes: [
    {
      id: 'cook_rice',
      title: { tr: 'Pirinci haşla', en: 'Cook the rice' },
      instruction: {
        tr: 'Pirinci tuzlu suda yumuşayana dek haşla.',
        en: 'Boil the rice in salted water until tender.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 720,
      voice_on_enter: { tr: 'Pirinci haşlamaya başlayalım.', en: "Let's start boiling the rice." },
    },
    {
      id: 'temper',
      title: { tr: 'Terbiyeyi hazırla', en: 'Make the tempering' },
      instruction: {
        tr: 'Yoğurt ve unu çırp; pürüzsüz bir terbiye yap.',
        en: 'Whisk the yogurt and flour into a smooth tempering.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['cook_rice'],
      completion: 'user',
    },
    {
      id: 'combine',
      title: { tr: 'Birleştir', en: 'Combine' },
      instruction: {
        tr: 'Terbiyeyi azar azar sıcak suya kat, sürekli karıştırarak kaynat.',
        en: 'Stir the tempering into the hot water gradually and bring to a gentle boil, stirring.',
      },
      kind: 'action',
      requires: ['cook_rice', 'temper'],
      completion: 'timer',
      durationSec: 420,
      recovery_rules: {
        kesik: {
          tr: 'Yoğurt kesilmesin diye kısık ateşte ve sürekli karıştırarak ekle.',
          en: 'To keep the yogurt from splitting, add on low heat while stirring constantly.',
        },
      },
    },
    {
      id: 'finish',
      title: { tr: 'Naneli yağ gezdir', en: 'Add minted butter' },
      instruction: {
        tr: 'Tereyağında naneyi kızdır, çorbanın üzerine gezdir.',
        en: 'Sizzle the mint in butter and drizzle over the soup.',
      },
      kind: 'finish',
      requires: ['combine'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Naneli yağla bitir, afiyet olsun!',
        en: 'Finish with minted butter — enjoy!',
      },
    },
  ],
};
