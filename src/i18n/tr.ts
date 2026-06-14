/**
 * Türkçe kullanıcı metinleri (CLAUDE.md → tüm görünür metin burada, i18n hazır).
 * Ton: kısa, sıcak, samimi — "annenin mutfakta olması".
 */
export const tr = {
  app: {
    name: 'Lezzet',
  },
  cooking: {
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
} as const;

export type TranslationTree = typeof tr;
