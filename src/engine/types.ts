/**
 * Lezzet motorunun çekirdek tipleri.
 *
 * Bu modül SAFTIR: React yok, I/O yok, platform API'si yok (CLAUDE.md → Mimari).
 * Tarif = yürütülebilir bir graf. Düğümler işlerdir; kenarlar (`requires`)
 * bağımlılıklardır. Karşılanmamış bağımlılığı olmayan düğümler aynı anda
 * (paralel) yürüyebilir — örn. domates rendelenirken biber doğranır. Bu yapı
 * motoru deterministik ve test edilebilir kılar.
 */

/** Bir düğümün yaşam döngüsü. */
export type NodeStatus =
  | 'pending' // bağımlılıklar henüz karşılanmadı
  | 'ready' // bağımlılıklar tamam, başlatılabilir
  | 'active' // şu an yürüyor (aynı anda birden fazla olabilir)
  | 'done' // başarıyla tamamlandı
  | 'failed' // denendi ama ters gitti; tekrar denenebilir (kurtarma)
  | 'skipped'; // bilerek yapılmadı (yalnızca kritik olmayan adımlarda)

/** Düğüm türü (CLAUDE.md → State Machine: action/prep/finish). */
export type NodeKind = 'prep' | 'action' | 'finish';

/**
 * Tamamlanma türü — bir düğümün nasıl "done" olacağını belirler.
 * - user:   sesli onay (kullanıcı "tamam/bitti" der)
 * - timer:  süre dolunca
 * - vision: kamera kontrolü (GÖZLEM + ÖNERİ — bkz. gıda güvenliği)
 * - auto:   hazır olunca otomatik (geçiş düğümleri)
 */
export type CompletionType = 'user' | 'timer' | 'vision' | 'auto';

/**
 * Bir düğüme bağlı gıda güvenliği kısıtı (CLAUDE.md → GIDA GÜVENLİĞİ).
 * Motor `critical` bir düğümü ATLATMAZ; UI/ses katmanı `message`'ı göstermek
 * zorundadır.
 */
export interface SafetyRule {
  /** true ise adım atlanamaz. */
  critical: boolean;
  /** Kullanıcıya gösterilecek uyarı (TR; ileride i18n anahtarı). */
  message: string;
  /** Uygun olduğunda güvenli minimum iç sıcaklık (°C). */
  minInternalTempC?: number;
}

/**
 * Bir adıma özel kurtarma kuralları: kullanıcı niyeti → kurtarma cevabı.
 * Örn. { "yaktim": "Ocağı kıs, yanan kısma dokunma; üstten al.", ... }
 */
export type RecoveryRules = Record<string, string>;

export interface RecipeNode {
  id: string;
  /** Listeler/başlıklar için kısa etiket. */
  title: string;
  /** Tam yönerge; ekranda gösterilir ve TTS ile seslendirilir. */
  instruction: string;
  kind: NodeKind;
  /** Bu düğümden önce `done`/`skipped` olması gereken düğüm id'leri. */
  requires: string[];
  /** Bilgilendirme amaçlı: aynı anda yürümesi beklenen düğümler. */
  parallel_with?: string[];
  completion: CompletionType;
  /** timer/active düğümler için geri sayım (saniye). */
  durationSec?: number;
  /** Düğüme girince söylenecek kısa, sıcak metin. */
  voice_on_enter?: string;
  /** Düğüm tamamlanınca söylenecek metin. */
  voice_on_complete?: string;
  /** Adıma özgü kurtarma kuralları. */
  recovery_rules?: RecoveryRules;
  /** Gıda güvenliği kısıtı. */
  safety?: SafetyRule;
}

export interface Recipe {
  id: string;
  title: string;
  servings: number;
  /** Yazılı metnin BCP-47 yerel ayarı, örn. "tr". */
  locale: string;
  nodes: RecipeNode[];
}
