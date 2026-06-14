/**
 * Yerel bildirim servisi (arka planda/ekran kapalıyken zamanlayıcı uyarısı).
 * Interface arkasında — store yalnızca bunu çağırır, native modülü görmez.
 */
export interface ScheduledNotice {
  /** Kararlı kimlik (planla/iptal eşleşmesi). */
  id: string;
  title: string;
  body: string;
  /** Şu andan itibaren kaç saniye sonra (>= 1). */
  inSeconds: number;
}

export interface NotificationService {
  /** İzin iste; verildiyse true. */
  requestPermission(): Promise<boolean>;
  /** Bir bildirim planla (aynı id varsa üzerine yazar). */
  schedule(notice: ScheduledNotice): Promise<void>;
  /** Kimliğe göre planlı bildirimi iptal et. */
  cancel(id: string): Promise<void>;
  /** Tüm planlı bildirimleri iptal et. */
  cancelAll(): Promise<void>;
}
