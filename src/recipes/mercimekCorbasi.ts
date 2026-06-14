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
      title: 'Sebzeleri doğra',
      instruction: 'Soğanı ve havucu küçük küçük doğra.',
      kind: 'prep',
      requires: [],
      parallel_with: ['rinse_lentil'],
      completion: 'user',
      voice_on_enter: 'Soğanla havucu küçük doğrayalım.',
      voice_on_complete: 'Sebzeler hazır.',
    },
    {
      id: 'rinse_lentil',
      title: 'Mercimeği yıka',
      instruction: 'Kırmızı mercimeği suyu berraklaşana dek yıka.',
      kind: 'prep',
      requires: [],
      parallel_with: ['prep_veg'],
      completion: 'user',
    },
    {
      id: 'saute',
      title: 'Soğanı kavur',
      instruction: 'Tencerede yağı ısıt, soğan ve havucu yumuşayana dek kavur.',
      kind: 'action',
      requires: ['prep_veg'],
      completion: 'timer',
      durationSec: 240,
      voice_on_enter: 'Yağı ısıt, sebzeleri kavurmaya başla.',
      voice_on_complete: 'Sebzeler yumuşadı.',
      recovery_rules: { yaktim: 'Ateşi kıs, yanan kısmı alma; biraz su ekle ve karıştır.' },
    },
    {
      id: 'add_lentil_water',
      title: 'Mercimek ve su ekle',
      instruction: 'Mercimeği, sıcak suyu ve tuzu ekle, karıştır.',
      kind: 'action',
      requires: ['saute', 'rinse_lentil'],
      completion: 'user',
      voice_on_enter: 'Mercimeği ve suyu ekle, bir karıştır.',
    },
    {
      id: 'simmer',
      title: 'Pişir',
      instruction: 'Kısık ateşte mercimekler dağılana kadar pişir.',
      kind: 'action',
      requires: ['add_lentil_water'],
      completion: 'timer',
      durationSec: 1500,
      voice_on_enter: 'Kapağı arala, kısık ateşte pişmeye bırak.',
      voice_on_complete: 'Mercimekler dağılmış olmalı.',
      recovery_rules: { sulu: 'Çok suluysa kapağı açıp birkaç dakika daha pişir.' },
    },
    {
      id: 'blend',
      title: 'Blenderdan geçir',
      instruction: 'El blenderıyla çorbayı pürüzsüz hale getir.',
      kind: 'action',
      requires: ['simmer'],
      completion: 'user',
      safety: {
        critical: false,
        message: 'Sıcak sıvıyı blenderlarken dikkat et — sıçramaması için blenderı içine batırıp öyle çalıştır.',
      },
      voice_on_enter: 'Şimdi blenderla pürüzsüz edelim; dikkatli ol, sıcak.',
    },
    {
      id: 'serve',
      title: 'Servis et',
      instruction: 'Üzerine limon sık, pul biber ve nane serp.',
      kind: 'finish',
      requires: ['blend'],
      completion: 'user',
      voice_on_enter: 'Limon ve pul biberle servis et. Afiyet olsun!',
    },
  ],
};
