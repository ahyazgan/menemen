/**
 * Menemen — örnek tarif grafı. (CLAUDE.md: ileride recipes/ JSON grafları;
 * şimdilik tip güvenli TS modülü olarak tutuyoruz.)
 *
 * Graf paralelliği gösterir: doğrama/rendeleme/yumurta kırma ile yağ ısıtma
 * aynı anda yürüyebilir. Yumurta adımı güvenlik açısından KRİTİKtir.
 */
import type { Recipe } from '../engine/types';

export const menemen: Recipe = {
  id: 'menemen',
  title: 'Menemen',
  servings: 2,
  locale: 'tr',
  summary: 'Biber, domates ve yumurtayla klasik Türk kahvaltısı.',
  totalMinutes: 20,
  nodes: [
    {
      id: 'chop_pepper',
      title: 'Biberleri doğra',
      instruction: 'Sivri biberleri ince ince doğra.',
      kind: 'prep',
      requires: [],
      parallel_with: ['grate_tomato', 'crack_eggs', 'heat_oil'],
      completion: 'user',
      voice_on_enter: 'Hadi biberlerden başlayalım, ince ince doğra.',
      voice_on_complete: 'Süper, biberler hazır.',
      recovery_rules: {
        tuzlu: 'Henüz tuz atmadık, merak etme; doğramaya devam.',
      },
    },
    {
      id: 'grate_tomato',
      title: 'Domatesleri rendele',
      instruction: 'Olgun domatesleri rendele, kabuklarını ayır.',
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_pepper', 'crack_eggs', 'heat_oil'],
      completion: 'user',
      voice_on_enter: 'Domatesleri rendele, suyunu da alalım.',
      voice_on_complete: 'Domates hazır, güzel.',
    },
    {
      id: 'crack_eggs',
      title: 'Yumurtaları hazırla',
      instruction: 'Yumurtaları bir kâseye kır, sarısı dağılmasın.',
      kind: 'prep',
      requires: [],
      parallel_with: ['chop_pepper', 'grate_tomato', 'heat_oil'],
      completion: 'user',
      voice_on_enter: 'Yumurtaları bir kâseye kır, sonra ekleyeceğiz.',
    },
    {
      id: 'heat_oil',
      title: 'Yağı ısıt',
      instruction: 'Tavaya tereyağı ya da zeytinyağı koy, orta ateşte ısıt.',
      kind: 'action',
      requires: [],
      parallel_with: ['chop_pepper', 'grate_tomato', 'crack_eggs'],
      completion: 'user',
      voice_on_enter: 'Tavayı orta ateşe al, yağını koy.',
      recovery_rules: {
        yaktim: 'Yağ yandıysa dökme, tavayı kapat, yenisini koy; düşük ateşe al.',
      },
    },
    {
      id: 'saute_pepper',
      title: 'Biberleri kavur',
      instruction: 'Biberleri yağa ekle, yumuşayana dek kavur.',
      kind: 'action',
      requires: ['heat_oil', 'chop_pepper'],
      completion: 'timer',
      durationSec: 180,
      voice_on_enter: 'Biberleri ekle, ara ara karıştır.',
      voice_on_complete: 'Biberler yumuşadı, sıra domateste.',
      recovery_rules: {
        yaktim: 'Ateşi kıs, yanmayan biberleri ayır; gerekirse biraz su ekle.',
      },
    },
    {
      id: 'add_tomato',
      title: 'Domatesi ekle',
      instruction: 'Rendelenmiş domatesi ekle, suyunu çekene kadar pişir.',
      kind: 'action',
      requires: ['saute_pepper', 'grate_tomato'],
      completion: 'timer',
      durationSec: 420,
      voice_on_enter: 'Domatesi ekle, suyunu çekene kadar bekleyelim.',
      voice_on_complete: 'Domates suyunu çekti, harika.',
      recovery_rules: {
        sulu: 'Çok suluysa ateşi açıp birkaç dakika daha karıştırarak pişir.',
        tuzlu: 'Tuzluysa rendelenmiş bir domates daha ekleyip dengele.',
      },
    },
    {
      id: 'add_eggs',
      title: 'Yumurtaları ekle',
      instruction: 'Yumurtaları ekle, kısık ateşte karıştırarak pişir.',
      kind: 'finish',
      requires: ['add_tomato', 'crack_eggs'],
      completion: 'user',
      safety: {
        critical: true,
        message:
          'Yumurta iyice pişmeli — akışkan kısım kalmamalı. Emin değilsen biraz daha pişir.',
        minInternalTempC: 71,
      },
      voice_on_enter: 'Yumurtaları ekle, kısık ateşte yavaşça karıştır.',
      voice_on_complete: 'Yumurtalar tutmuş gibi; akışkan kısım kalmadığından emin ol.',
      recovery_rules: {
        sulu: 'Akışkansa biraz daha pişir; yumurta tam pişmeden ocaktan alma.',
      },
    },
    {
      id: 'serve',
      title: 'Servis et',
      instruction: 'Karabiber ve tuz serp, sıcak servis et.',
      kind: 'finish',
      requires: ['add_eggs'],
      completion: 'user',
      voice_on_enter: 'Üzerine biraz karabiber serp, sıcakken servis et. Afiyet olsun!',
    },
  ],
};
