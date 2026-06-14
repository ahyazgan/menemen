/**
 * Adım fotoğrafı servisi — kullanıcı bir pişirme adımına kendi fotoğrafını
 * eklemek istediğinde tek kare çeker. Interface arkasında: store/ekran yalnızca
 * bunu çağırır, native modülü görmez (CLAUDE.md → services hep interface arkasında).
 */
export interface PhotoService {
  /** İzin iste; verildiyse true. */
  requestPermission(): Promise<boolean>;
  /**
   * Tek kare çek (frame-on-demand, sürekli akış YOK). Çekilen görüntünün yerel
   * URI'sini döner; kullanıcı vazgeçer veya izin yoksa null.
   */
  capture(): Promise<string | null>;
}
