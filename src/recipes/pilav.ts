/** Tereyağlı Pirinç Pilavı — zamanlayıcı ağırlıklı, kritik güvenlik adımı yok. */
import type { Recipe } from '../engine/types';

export const pilav: Recipe = {
  id: 'pilav',
  title: { tr: 'Tereyağlı Pirinç Pilavı', en: 'Buttery Rice Pilaf' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Tane tane, şehriyeli klasik pilav.',
    en: 'Fluffy, separate grains — the classic vermicelli pilaf.',
  },
  totalMinutes: 30,
  nodes: [
    {
      id: 'rinse',
      title: { tr: 'Pirinci yıka', en: 'Rinse the rice' },
      instruction: {
        tr: 'Pirinci berrak su gelene dek yıka, ılık suda beklet.',
        en: 'Rinse the rice until the water runs clear, then soak in warm water.',
      },
      kind: 'prep',
      requires: [],
      completion: 'user',
      voice_on_enter: {
        tr: 'Pirinci yıkayıp biraz bekletelim.',
        en: "Let's rinse the rice and let it soak a bit.",
      },
    },
    {
      id: 'toast',
      title: { tr: 'Şehriyeyi kavur', en: 'Toast the vermicelli' },
      instruction: {
        tr: 'Tereyağında şehriyeyi pembeleştir, süzülmüş pirinci ekle kavur.',
        en: 'Toast the vermicelli in butter until golden, add the drained rice and toast.',
      },
      kind: 'action',
      requires: ['rinse'],
      completion: 'timer',
      durationSec: 180,
      voice_on_enter: {
        tr: 'Şehriyeyi pembeleşene dek kavuralım.',
        en: "Let's toast the vermicelli until golden.",
      },
      recovery_rules: {
        yaktim: {
          tr: 'Şehriye karardıysa baştan başla; düşük ateşte kavur.',
          en: 'If the vermicelli browned, start over; toast over low heat.',
        },
      },
    },
    {
      id: 'add_water',
      title: { tr: 'Su ekle', en: 'Add water' },
      instruction: {
        tr: 'Sıcak su ve tuzu ekle, karıştır.',
        en: 'Add hot water and salt, then stir.',
      },
      kind: 'action',
      requires: ['toast'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Sıcak suyu ekle, bir karıştır.',
        en: 'Add the hot water and give it a stir.',
      },
    },
    {
      id: 'cook',
      title: { tr: 'Pişir', en: 'Cook' },
      instruction: {
        tr: 'Kapağı kapat, suyunu çekene dek kısık ateşte pişir.',
        en: 'Cover and cook over low heat until the water is absorbed.',
      },
      kind: 'action',
      requires: ['add_water'],
      completion: 'timer',
      durationSec: 900,
      voice_on_enter: {
        tr: 'Kısık ateşte suyunu çekmesini bekleyelim.',
        en: "Let's wait over low heat for the water to be absorbed.",
      },
      voice_on_complete: { tr: 'Su çekildi.', en: 'The water is absorbed.' },
      recovery_rules: {
        sulu: {
          tr: 'Su kaldıysa kapağı açıp birkaç dakika daha pişir.',
          en: 'If water remains, uncover and cook a few more minutes.',
        },
      },
    },
    {
      id: 'rest',
      title: { tr: 'Demlendir', en: 'Rest' },
      instruction: {
        tr: 'Ocaktan al, üzerine bez örtüp demlendir.',
        en: 'Take off the heat, cover with a cloth and let it rest.',
      },
      kind: 'finish',
      requires: ['cook'],
      completion: 'timer',
      durationSec: 600,
      voice_on_enter: {
        tr: 'Bezle örtüp demlenmeye bırak, tanesi tane olur.',
        en: 'Cover with a cloth and let it rest — the grains will separate nicely.',
      },
      voice_on_complete: { tr: 'Pilav hazır, afiyet olsun!', en: 'The pilaf is ready — enjoy!' },
    },
  ],
};
