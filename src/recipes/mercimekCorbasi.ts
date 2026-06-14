/**
 * Mercimek Çorbası — örnek tarif grafı (etsiz). Kritik güvenlik adımı yok;
 * blender adımında kritik OLMAYAN bir güvenlik uyarısı (sıcak sıvı) var.
 */
import type { Recipe } from '../engine/types';

export const mercimekCorbasi: Recipe = {
  id: 'mercimek-corbasi',
  title: { tr: 'Mercimek Çorbası', en: 'Red Lentil Soup' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Kırmızı mercimekle pürüzsüz, ısıtan klasik çorba.',
    en: 'A smooth, warming classic made with red lentils.',
  },
  totalMinutes: 35,
  nodes: [
    {
      id: 'prep_veg',
      title: { tr: 'Sebzeleri doğra', en: 'Chop the vegetables' },
      instruction: {
        tr: 'Soğanı ve havucu küçük küçük doğra.',
        en: 'Finely chop the onion and carrot.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['rinse_lentil'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Soğanla havucu küçük doğrayalım.',
        en: "Let's finely chop the onion and carrot.",
      },
      voice_on_complete: { tr: 'Sebzeler hazır.', en: 'Vegetables ready.' },
    },
    {
      id: 'rinse_lentil',
      title: { tr: 'Mercimeği yıka', en: 'Rinse the lentils' },
      instruction: {
        tr: 'Kırmızı mercimeği suyu berraklaşana dek yıka.',
        en: 'Rinse the red lentils until the water runs clear.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['prep_veg'],
      completion: 'user',
    },
    {
      id: 'saute',
      title: { tr: 'Soğanı kavur', en: 'Sauté the onion' },
      instruction: {
        tr: 'Tencerede yağı ısıt, soğan ve havucu yumuşayana dek kavur.',
        en: 'Heat oil in the pot and sauté the onion and carrot until soft.',
      },
      kind: 'action',
      requires: ['prep_veg'],
      completion: 'timer',
      durationSec: 240,
      voice_on_enter: {
        tr: 'Yağı ısıt, sebzeleri kavurmaya başla.',
        en: 'Heat the oil and start sautéing the vegetables.',
      },
      voice_on_complete: { tr: 'Sebzeler yumuşadı.', en: 'The vegetables have softened.' },
      recovery_rules: {
        yaktim: {
          tr: 'Ateşi kıs, yanan kısmı alma; biraz su ekle ve karıştır.',
          en: "Lower the heat, don't scrape up the burnt bits; add a splash of water and stir.",
        },
      },
    },
    {
      id: 'add_lentil_water',
      title: { tr: 'Mercimek ve su ekle', en: 'Add lentils and water' },
      instruction: {
        tr: 'Mercimeği, sıcak suyu ve tuzu ekle, karıştır.',
        en: 'Add the lentils, hot water and salt, then stir.',
      },
      kind: 'action',
      requires: ['saute', 'rinse_lentil'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Mercimeği ve suyu ekle, bir karıştır.',
        en: 'Add the lentils and water and give it a stir.',
      },
    },
    {
      id: 'simmer',
      title: { tr: 'Pişir', en: 'Simmer' },
      instruction: {
        tr: 'Kısık ateşte mercimekler dağılana kadar pişir.',
        en: 'Simmer over low heat until the lentils break down.',
      },
      kind: 'action',
      requires: ['add_lentil_water'],
      completion: 'timer',
      durationSec: 1500,
      voice_on_enter: {
        tr: 'Kapağı arala, kısık ateşte pişmeye bırak.',
        en: 'Crack the lid and leave it to simmer over low heat.',
      },
      voice_on_complete: {
        tr: 'Mercimekler dağılmış olmalı.',
        en: 'The lentils should have broken down.',
      },
      recovery_rules: {
        sulu: {
          tr: 'Çok suluysa kapağı açıp birkaç dakika daha pişir.',
          en: 'If too thin, uncover and cook a few more minutes.',
        },
      },
    },
    {
      id: 'blend',
      title: { tr: 'Blenderdan geçir', en: 'Blend' },
      instruction: {
        tr: 'El blenderıyla çorbayı pürüzsüz hale getir.',
        en: 'Blend the soup smooth with a hand blender.',
      },
      kind: 'action',
      requires: ['simmer'],
      completion: 'user',
      safety: {
        critical: false,
        message: {
          tr: 'Sıcak sıvıyı blenderlarken dikkat et — sıçramaması için blenderı içine batırıp öyle çalıştır.',
          en: "Be careful blending hot liquid — submerge the blender before turning it on so it doesn't splash.",
        },
      },
      voice_on_enter: {
        tr: 'Şimdi blenderla pürüzsüz edelim; dikkatli ol, sıcak.',
        en: "Now let's blend it smooth; be careful, it's hot.",
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Üzerine limon sık, pul biber ve nane serp.',
        en: 'Squeeze lemon over it and sprinkle chili flakes and mint.',
      },
      kind: 'finish',
      requires: ['blend'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Limon ve pul biberle servis et. Afiyet olsun!',
        en: 'Serve with lemon and chili flakes. Enjoy!',
      },
    },
  ],
};
