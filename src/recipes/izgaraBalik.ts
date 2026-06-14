/** Izgara Balık — kritik balık pişirme (iç sıcaklık 63°C). */
import type { Recipe } from '../engine/types';

export const izgaraBalik: Recipe = {
  id: 'izgara-balik',
  title: { tr: 'Izgara Balık', en: 'Grilled Fish' },
  servings: 2,
  locale: 'tr',
  summary: {
    tr: 'Limonlu, sade ve sağlıklı ızgara balık.',
    en: 'Simple, healthy grilled fish with lemon.',
  },
  totalMinutes: 20,
  nodes: [
    {
      id: 'prep_fish',
      title: 'Balığı hazırla',
      instruction: 'Balığı temizle, kurula; tuz, limon ve zeytinyağı sür.',
      kind: 'prep',
      requires: [],
      parallel_with: ['heat_grill'],
      completion: 'user',
      voice_on_enter: 'Balığı kurulayıp tuz-limon-yağ sürelim; kuru balık ızgaraya yapışmaz.',
    },
    {
      id: 'heat_grill',
      title: 'Izgarayı kızdır',
      instruction: 'Izgarayı/tavayı iyice kızdır.',
      kind: 'action',
      requires: [],
      parallel_with: ['prep_fish'],
      completion: 'user',
      voice_on_enter: 'Izgarayı iyice kızdıralım.',
    },
    {
      id: 'grill',
      title: 'Pişir',
      instruction: 'Her iki yüzünü, eti pul pul ayrılana dek pişir.',
      kind: 'action',
      requires: ['prep_fish', 'heat_grill'],
      completion: 'user',
      durationSec: 600,
      safety: {
        critical: true,
        message:
          'Balık tam pişmeli: eti matlaşmalı ve çatalla kolayca pul pul ayrılmalı, iç sıcaklık 63°C olmalı. Cam gibi/şeffaf görünüyorsa biraz daha pişir.',
        minInternalTempC: 63,
      },
      voice_on_enter: 'Acele çevirme; bir yüzü iyice kızarınca dön.',
      voice_on_complete: 'Çatalla dene: et pul pul ayrılıyor mu?',
    },
    {
      id: 'serve',
      title: 'Servis et',
      instruction: 'Roka ve limonla servis et.',
      kind: 'finish',
      requires: ['grill'],
      completion: 'user',
      voice_on_enter: 'Roka ve limonla servis et, afiyet olsun!',
    },
  ],
};
