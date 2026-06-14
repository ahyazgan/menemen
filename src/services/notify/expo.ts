/**
 * expo-notifications tabanlı yerel bildirimler. Ekran kapalı/arka plandayken
 * zamanlayıcı süresi dolunca kullanıcıyı uyarır (CLAUDE.md: AI susmasın değeri).
 */
import * as Notifications from 'expo-notifications';

import type { NotificationService, ScheduledNotice } from './types';

export function createExpoNotify(): NotificationService {
  // Uygulama önplandayken de bildirim banner'ı göster.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  return {
    async requestPermission(): Promise<boolean> {
      const { granted } = await Notifications.requestPermissionsAsync();
      return granted;
    },
    async schedule(notice: ScheduledNotice): Promise<void> {
      await Notifications.scheduleNotificationAsync({
        identifier: notice.id,
        content: { title: notice.title, body: notice.body },
        trigger: { seconds: Math.max(1, Math.ceil(notice.inSeconds)) },
      });
    },
    async cancel(id: string): Promise<void> {
      await Notifications.cancelScheduledNotificationAsync(id);
    },
    async cancelAll(): Promise<void> {
      await Notifications.cancelAllScheduledNotificationsAsync();
    },
  };
}
