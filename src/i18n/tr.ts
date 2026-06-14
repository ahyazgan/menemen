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
    search: 'Tarif ara…',
    all: 'Hepsi',
    noResults: 'Sonuç yok.',
    categories: {
      kahvalti: 'Kahvaltı',
      corba: 'Çorba',
      'ana-yemek': 'Ana Yemek',
      salata: 'Salata',
      pilav: 'Pilav',
    },
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
  voice: {
    secondsLeft: 'saniye kaldı',
    noTimer: 'Şu an süreli bir iş yok.',
    checkPrompt: 'Telefonu tencereye doğrult, fotoğrafı çekiyorum.',
    recoveryDefault: 'Merak etme, hallederiz. Ateşi biraz kıs ve bana anlat.',
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
};

/**
 * Çeviri ağacının şekli TR sözlüğünden türetilir (literal değil, string olarak
 * genişletilir). Diğer diller bu tipe uymak zorundadır → eksik/fazla anahtar
 * derleme hatası verir (tsc key paritesini zorlar).
 */
export type TranslationTree = typeof tr;
