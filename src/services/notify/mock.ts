/** Mock bildirim servisi — UI'ı native modülsüz test/çalıştırmak için. */
import type { NotificationService, ScheduledNotice } from './types';

export function createMockNotify(sink: (line: string) => void = () => {}): NotificationService {
  const scheduled = new Map<string, ScheduledNotice>();
  return {
    async requestPermission(): Promise<boolean> {
      return true;
    },
    async schedule(notice: ScheduledNotice): Promise<void> {
      scheduled.set(notice.id, notice);
      sink(`🔔 planlandı ${notice.id} (+${notice.inSeconds}sn): ${notice.title}`);
    },
    async cancel(id: string): Promise<void> {
      scheduled.delete(id);
      sink(`🔕 iptal ${id}`);
    },
    async cancelAll(): Promise<void> {
      scheduled.clear();
      sink('🔕 tümü iptal');
    },
  };
}
