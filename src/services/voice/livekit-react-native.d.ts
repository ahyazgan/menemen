/**
 * @livekit/react-native için minimal ambient bildirim (yalnızca kullanılan
 * yüzey). Paket henüz kurulu değil; dinamik import ile çalışma zamanında
 * yüklenir. `npx expo install @livekit/react-native` sonrası gerçek tipler
 * devreye girer.
 */
declare module '@livekit/react-native' {
  export class Room {
    connect(url: string, token: string): Promise<void>;
    disconnect(): Promise<void>;
    on(event: string, cb: (...args: unknown[]) => void): void;
    localParticipant: { setMicrophoneEnabled(enabled: boolean): Promise<void> };
  }
}
