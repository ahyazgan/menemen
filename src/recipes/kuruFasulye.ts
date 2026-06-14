/** Kuru Fasulye — uzun pişen klasik (haşlanmış fasulye ile). */
import type { Recipe } from '../engine/types';

export const kuruFasulye: Recipe = {
  id: 'kuru-fasulye',
  title: { tr: 'Kuru Fasulye', en: 'White Bean Stew' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Salçalı, doyurucu Türk klasiği.',
    en: 'A hearty Turkish classic in a tomato-paste sauce.',
  },
  totalMinutes: 50,
  nodes: [
    {
      id: 'saute_onion',
      title: { tr: 'Soğanı kavur', en: 'Sauté the onion' },
      instruction: {
        tr: 'Tencerede yağı ısıt, doğranmış soğanı pembeleştir.',
        en: 'Heat oil in the pot and sauté the chopped onion until golden.',
      },
      kind: 'action',
      requires: [],
      completion: 'timer',
      durationSec: 300,
      voice_on_enter: {
        tr: 'Soğanı yağda pembeleşene dek kavuralım.',
        en: "Let's sauté the onion until golden.",
      },
      recovery_rules: {
        yaktim: {
          tr: 'Ateşi kıs; yanmadan, soğanı sık karıştır.',
          en: "Lower the heat; stir the onion often so it doesn't burn.",
        },
      },
    },
    {
      id: 'add_paste',
      title: { tr: 'Salçayı ekle', en: 'Add the tomato paste' },
      instruction: {
        tr: 'Salçayı ekle, kokusu çıkana dek kavur.',
        en: 'Add the tomato paste and cook until fragrant.',
      },
      kind: 'action',
      requires: ['saute_onion'],
      completion: 'timer',
      durationSec: 120,
      voice_on_enter: { tr: 'Salçayı ekle, kısa süre kavur.', en: 'Add the paste and cook briefly.' },
    },
    {
      id: 'add_beans',
      title: { tr: 'Fasulye ve su ekle', en: 'Add beans and water' },
      instruction: {
        tr: 'Haşlanmış fasulye, sıcak su ve baharatı ekle.',
        en: 'Add the cooked beans, hot water and spices.',
      },
      kind: 'action',
      requires: ['add_paste'],
      completion: 'user',
      voice_on_enter: { tr: 'Fasulyeyi ve suyu ekle.', en: 'Add the beans and water.' },
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Kısık ateşte tadı oturana dek pişir.',
        en: 'Simmer over low heat until the flavors come together.',
      },
      kind: 'action',
      requires: ['add_beans'],
      completion: 'timer',
      durationSec: 1800,
      voice_on_enter: {
        tr: 'Kısık ateşte yavaşça pişsin.',
        en: 'Let it simmer gently over low heat.',
      },
      voice_on_complete: { tr: 'Suyu kıvamını almış olmalı.', en: 'The sauce should have thickened.' },
      recovery_rules: {
        tuzlu: {
          tr: 'Tuzluysa bir patatesi doğrayıp ekle, birkaç dakika pişir, sonra çıkar.',
          en: 'If too salty, add a chopped potato, cook a few minutes, then remove it.',
        },
        sulu: {
          tr: 'Çok suluysa kapağı açıp koyulaşana dek pişir.',
          en: 'If too thin, uncover and cook until it thickens.',
        },
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: { tr: 'Pilav ve turşuyla servis et.', en: 'Serve with rice and pickles.' },
      kind: 'finish',
      requires: ['simmer'],
      completion: 'user',
      voice_on_enter: { tr: 'Pilavın yanında afiyet olsun!', en: 'Enjoy it alongside some rice!' },
    },
  ],
};
