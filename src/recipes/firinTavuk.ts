/** Fırın Tavuk Baget — kritik tavuk pişirme (iç sıcaklık 74°C). */
import type { Recipe } from '../engine/types';

export const firinTavuk: Recipe = {
  id: 'firin-tavuk',
  title: { tr: 'Fırında Tavuk Baget', en: 'Baked Chicken Drumsticks' },
  servings: 4,
  locale: 'tr',
  summary: {
    tr: 'Baharatlı, çıtır kabuklu fırın tavuk.',
    en: 'Spiced, crispy-skinned baked chicken.',
  },
  totalMinutes: 55,
  nodes: [
    {
      id: 'marinate',
      title: 'Marine et',
      instruction: 'Bagetleri yağ, salça, sarımsak ve baharatla harmanla.',
      kind: 'prep',
      requires: [],
      parallel_with: ['preheat'],
      completion: 'user',
      voice_on_enter: 'Tavukları baharatlarla güzelce harmanlayalım.',
    },
    {
      id: 'preheat',
      title: 'Fırını ısıt',
      instruction: 'Fırını 200°C ayarla ve ısınmasını bekle.',
      kind: 'action',
      requires: [],
      parallel_with: ['marinate'],
      completion: 'user',
      voice_on_enter: 'Fırını 200 dereceye ayarlayalım.',
    },
    {
      id: 'bake',
      title: 'Fırınla',
      instruction: 'Bagetleri tepside, ara ara çevirerek pişir.',
      kind: 'action',
      requires: ['marinate', 'preheat'],
      completion: 'user',
      durationSec: 2400,
      safety: {
        critical: true,
        message:
          'Tavuk tamamen pişmeli: en kalın yerde iç sıcaklık 74°C olmalı, bıçak batırınca berrak su akmalı. Pembe/sulu görünüyorsa biraz daha pişir.',
        minInternalTempC: 74,
      },
      voice_on_enter: 'Fırına verelim; süre bitince iç sıcaklığı kontrol edeceğiz.',
      voice_on_complete: 'En kalın bagete bıçak batır; su berrak akıyor mu, içi pembe mi bak.',
    },
    {
      id: 'rest',
      title: 'Dinlendir ve servis et',
      instruction: 'Birkaç dakika dinlendirip servis et.',
      kind: 'finish',
      requires: ['bake'],
      completion: 'timer',
      durationSec: 300,
      voice_on_enter: 'Kısaca dinlensin, suyu dağılmasın. Afiyet olsun!',
    },
  ],
};
