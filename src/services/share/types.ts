/**
 * Paylaşım servisi — OS paylaşım sayfasını açar. Interface arkasında: store
 * yalnızca bunu çağırır, native modülü görmez (CLAUDE.md → services interface arkasında).
 */
export interface ShareService {
  /** Verilen mesajı sistem paylaşım sayfasıyla paylaşır. */
  share(message: string): Promise<void>;
}
