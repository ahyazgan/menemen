/**
 * Menemen — örnek tarif grafı (tam çift dilli: TR + EN referans uygulaması).
 * Graf paralelliği gösterir; yumurta adımı güvenlik açısından KRİTİKtir.
 */
import type { Recipe } from '../engine/types';

export const menemen: Recipe = {
  id: 'menemen',
  title: { tr: 'Menemen', en: 'Menemen' },
  servings: 2,
  locale: 'tr',
  category: 'kahvalti',
  summary: {
    tr: 'Biber, domates ve yumurtayla klasik Türk kahvaltısı.',
    en: 'A classic Turkish breakfast with peppers, tomatoes and eggs.',
  },
  totalMinutes: 20,
  ingredients: [
    {
      "name": {
        "tr": "sivri biber",
        "en": "green pepper"
      },
      "quantity": 4,
      "unit": {
        "tr": "adet",
        "en": "pcs"
      }
    },
    {
      "name": {
        "tr": "domates",
        "en": "tomato"
      },
      "quantity": 3,
      "unit": {
        "tr": "adet",
        "en": "pcs"
      }
    },
    {
      "name": {
        "tr": "yumurta",
        "en": "egg"
      },
      "quantity": 4,
      "unit": {
        "tr": "adet",
        "en": "pcs"
      }
    },
    {
      "name": {
        "tr": "tereyağı",
        "en": "butter"
      },
      "quantity": 2,
      "unit": {
        "tr": "yemek kaşığı",
        "en": "tbsp"
      }
    },
    {
      "name": {
        "tr": "tuz",
        "en": "salt"
      }
    },
    {
      "name": {
        "tr": "karabiber",
        "en": "black pepper"
      }
    }
  ],
  nodes: [
    {
      id: 'chop_pepper',
      title: { tr: 'Biberleri doğra', en: 'Chop the peppers' },
      instruction: { tr: 'Sivri biberleri ince ince doğra.', en: 'Finely chop the green peppers.' },
      kind: 'prep',
      requires: [],
      parallel_with: ['grate_tomato', 'crack_eggs', 'heat_oil'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Hadi biberlerden başlayalım, ince ince doğra.',
        en: "Let's start with the peppers — chop them finely.",
      },
      voice_on_complete: { tr: 'Süper, biberler hazır.', en: 'Great, the peppers are ready.' },
      recovery_rules: {
        tuzlu: {
          tr: 'Henüz tuz atmadık, merak etme; doğramaya devam.',
          en: "We haven't added salt yet, no worries — keep chopping.",
        },
      },
    },
    {
      id: 'grate_tomato',
      title: { tr: 'Domatesleri rendele', en: 'Grate the tomatoes' },
      instruction: {
        tr: 'Olgun domatesleri rendele, kabuklarını ayır.',
        en: 'Grate the ripe tomatoes and discard the skins.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_pepper', 'crack_eggs', 'heat_oil'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Domatesleri rendele, suyunu da alalım.',
        en: "Grate the tomatoes — let's keep the juice too.",
      },
      voice_on_complete: { tr: 'Domates hazır, güzel.', en: 'Tomatoes done, nice.' },
    },
    {
      id: 'crack_eggs',
      title: { tr: 'Yumurtaları hazırla', en: 'Prepare the eggs' },
      instruction: {
        tr: 'Yumurtaları bir kâseye kır, sarısı dağılmasın.',
        en: 'Crack the eggs into a bowl, keeping the yolks intact.',
      },
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_pepper', 'grate_tomato', 'heat_oil'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Yumurtaları bir kâseye kır, sonra ekleyeceğiz.',
        en: "Crack the eggs into a bowl; we'll add them later.",
      },
    },
    {
      id: 'heat_oil',
      title: { tr: 'Yağı ısıt', en: 'Heat the fat' },
      instruction: {
        tr: 'Tavaya tereyağı ya da zeytinyağı koy, orta ateşte ısıt.',
        en: 'Add butter or olive oil to the pan and heat over medium.',
      },
      kind: 'action',
      requires: [],
      parallel_with: ['chop_pepper', 'grate_tomato', 'crack_eggs'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Tavayı orta ateşe al, yağını koy.',
        en: 'Set the pan to medium heat and add the fat.',
      },
      recovery_rules: {
        yaktim: {
          tr: 'Yağ yandıysa dökme, tavayı kapat, yenisini koy; düşük ateşe al.',
          en: 'If the fat burned, toss it, wipe the pan, add fresh fat and lower the heat.',
        },
      },
    },
    {
      id: 'saute_pepper',
      title: { tr: 'Biberleri kavur', en: 'Sauté the peppers' },
      instruction: {
        tr: 'Biberleri yağa ekle, yumuşayana dek kavur.',
        en: 'Add the peppers to the fat and sauté until softened.',
      },
      kind: 'action',
      requires: ['heat_oil', 'chop_pepper'],
      completion: 'timer',
      durationSec: 180,
      voice_on_enter: {
        tr: 'Biberleri ekle, ara ara karıştır.',
        en: 'Add the peppers and stir now and then.',
      },
      voice_on_complete: {
        tr: 'Biberler yumuşadı, sıra domateste.',
        en: 'Peppers are soft — tomatoes next.',
      },
      recovery_rules: {
        yaktim: {
          tr: 'Ateşi kıs, yanmayan biberleri ayır; gerekirse biraz su ekle.',
          en: 'Lower the heat, set aside the unburned peppers; add a splash of water if needed.',
        },
      },
    },
    {
      id: 'add_tomato',
      title: { tr: 'Domatesi ekle', en: 'Add the tomatoes' },
      instruction: {
        tr: 'Rendelenmiş domatesi ekle, suyunu çekene kadar pişir.',
        en: 'Add the grated tomatoes and cook until the liquid reduces.',
      },
      kind: 'action',
      requires: ['saute_pepper', 'grate_tomato'],
      completion: 'timer',
      durationSec: 420,
      voice_on_enter: {
        tr: 'Domatesi ekle, suyunu çekene kadar bekleyelim.',
        en: "Add the tomatoes and let's wait until the liquid reduces.",
      },
      voice_on_complete: {
        tr: 'Domates suyunu çekti, harika.',
        en: 'The tomatoes have reduced, perfect.',
      },
      recovery_rules: {
        sulu: {
          tr: 'Çok suluysa ateşi açıp birkaç dakika daha karıştırarak pişir.',
          en: 'If too watery, raise the heat and cook a few more minutes, stirring.',
        },
        tuzlu: {
          tr: 'Tuzluysa rendelenmiş bir domates daha ekleyip dengele.',
          en: 'If too salty, grate in one more tomato to balance it.',
        },
      },
    },
    {
      id: 'add_eggs',
      title: { tr: 'Yumurtaları ekle', en: 'Add the eggs' },
      instruction: {
        tr: 'Yumurtaları ekle, kısık ateşte karıştırarak pişir.',
        en: 'Add the eggs and cook over low heat, stirring.',
      },
      kind: 'finish',
      requires: ['add_tomato', 'crack_eggs'],
      completion: 'user',
      safety: {
        critical: true,
        message: {
          tr: 'Yumurta iyice pişmeli — akışkan kısım kalmamalı. Emin değilsen biraz daha pişir.',
          en: 'The eggs must be fully cooked — no runny part left. If unsure, cook a little more.',
        },
        minInternalTempC: 71,
      },
      voice_on_enter: {
        tr: 'Yumurtaları ekle, kısık ateşte yavaşça karıştır.',
        en: 'Add the eggs and stir gently over low heat.',
      },
      voice_on_complete: {
        tr: 'Yumurtalar tutmuş gibi; akışkan kısım kalmadığından emin ol.',
        en: 'The eggs look set; make sure no runny part remains.',
      },
      recovery_rules: {
        sulu: {
          tr: 'Akışkansa biraz daha pişir; yumurta tam pişmeden ocaktan alma.',
          en: "If runny, cook a bit more; don't take it off the heat until fully set.",
        },
      },
    },
    {
      id: 'serve',
      title: { tr: 'Servis et', en: 'Serve' },
      instruction: {
        tr: 'Karabiber ve tuz serp, sıcak servis et.',
        en: 'Sprinkle black pepper and salt, and serve hot.',
      },
      kind: 'finish',
      requires: ['add_eggs'],
      completion: 'user',
      voice_on_enter: {
        tr: 'Üzerine biraz karabiber serp, sıcakken servis et. Afiyet olsun!',
        en: 'Sprinkle some black pepper and serve while hot. Enjoy!',
      },
    },
  ],
};
