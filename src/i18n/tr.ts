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
    favorites: '★ Favoriler',
    shopping: '🛒 Alışveriş listesi',
    pantry: '🧺 Elimde ne var?',
    recent: 'Son pişirdiklerin',
    times: 'kez',
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
    ingredients: 'Malzemeler',
    addToShopping: '🛒 Alışveriş listesine ekle',
    added: 'Listeye eklendi ✓',
    notes: 'Notların',
    notesPlaceholder: 'Bu tarife not ekle… (örn. daha az tuz)',
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
    addPhoto: '📷 Adım fotoğrafı ekle',
    retakePhoto: '🔄 Yeniden çek',
    removePhoto: 'Fotoğrafı sil',
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
  notify: {
    timerDone: 'Süre doldu!',
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
  shopping: {
    title: 'Alışveriş Listesi',
    empty: 'Liste boş. Bir tarifin malzemelerini ekleyebilirsin.',
    clearChecked: 'Alınanları sil',
    clearAll: 'Listeyi temizle',
  },
  pantry: {
    title: 'Elimde Ne Var?',
    subtitle: 'Elindeki malzemeleri işaretle; sana ne yapabileceğini söyleyeyim.',
    pickIngredients: 'Malzemeler',
    canMake: 'Yapabileceklerin',
    none: 'Önce birkaç malzeme seç.',
    ofTotal: 'malzeme',
  },
  profile: {
    button: '👤 Profilim',
    title: 'Profilim',
    subtitle: 'Seni tanıyayım ki sana uygun tarifleri önereyim.',
    diet: 'Beslenme',
    skill: 'Mutfak becerin',
    avoid: 'Yemediğin / kaçındığın malzemeler',
    avoidHint: 'Seçtiklerini içeren tarifler listede gösterilmez.',
    saved: 'Tercihlerin kayıtlı, ona göre öneriyorum.',
    diets: {
      all: 'Hepsi',
      vegetarian: 'Vejetaryen',
      vegan: 'Vegan',
    },
    skills: {
      beginner: 'Yeni başlayan',
      intermediate: 'Orta',
      advanced: 'İleri',
    },
  },
  difficulty: {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  },
  suggest: {
    button: '✨ Bana özel öner',
    title: 'Bugün canın ne çekiyor?',
    subtitle: 'Birkaç kelimeyle anlat; profiline göre en uygun tarifi seçeyim.',
    placeholder: 'örn. hafif bir çorba, acılı olabilir',
    go: 'Tarif öner',
    thinking: 'Düşünüyorum…',
    reason: 'Neden bu?',
    defaultReason: 'Profiline ve canının çektiğine en uygun tarif bu.',
    cook: 'Hadi yapalım',
    again: 'Başka öner',
    none: 'Sana uygun bir tarif bulamadım; profilini biraz gevşetmeyi dene.',
  },
};

/**
 * Çeviri ağacının şekli TR sözlüğünden türetilir (literal değil, string olarak
 * genişletilir). Diğer diller bu tipe uymak zorundadır → eksik/fazla anahtar
 * derleme hatası verir (tsc key paritesini zorlar).
 */
export type TranslationTree = typeof tr;
