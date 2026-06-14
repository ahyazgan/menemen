/**
 * Türkçe kullanıcı metinleri (CLAUDE.md → tüm görünür metin burada, i18n hazır).
 * Ton: kısa, sıcak, samimi — "annenin mutfakta olması".
 */
export const tr = {
  app: {
    name: 'Lezzet',
  },
  picker: {
    title: 'Ne pişsem?',
    subtitle: 'Bugün canın ne çekiyor?',
    random: '🎲 Şansıma seç',
    minutes: 'dk',
    servings: 'kişilik',
  },
  cooking: {
    back: '‹ Tarifler',
    ready: 'Hazır adımlar',
    active: 'Şu an',
    done: 'Bitti',
    start: 'Başla',
    complete: 'Tamam, bitti',
    skip: 'Atla',
    retry: 'Tekrar dene',
    listen: 'Bas konuş',
    listening: 'Dinliyorum…',
    check: 'Tencereye bak',
    capture: 'Çek',
    close: 'Kapat',
    permissionNeeded: 'İzin gerekiyor.',
    progress: 'İlerleme',
    finished: 'Yemek hazır, afiyet olsun!',
    nothingReady: 'Şu an yapılacak hazır adım yok.',
    remaining: 'kalan',
  },
  safety: {
    cannotSkip: 'Bu adım güvenlik açısından atlanamaz.',
    title: 'Güvenlik notu',
  },
  intent: {
    unknown: 'Tam anlayamadım, tekrar söyler misin?',
  },
  subscription: {
    title: 'Lezzet Pro',
    subtitle: 'Mutfakta yanında bir usta. İlk hafta ücretsiz.',
    restore: 'Satın alımları geri yükle',
    subscribed: 'Aboneliğin aktif. Afiyet olsun!',
    loading: 'Yükleniyor…',
    purchase: 'Başla',
    terms: 'Abonelik mağaza hesabından yenilenir; istediğin zaman iptal edebilirsin.',
  },
} as const;

export type TranslationTree = typeof tr;
