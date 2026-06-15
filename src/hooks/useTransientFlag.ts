/**
 * useTransientFlag — kısa süreli bir onay bayrağı (örn. "Listeye eklendi ✓").
 * `trigger()` çağrılınca bayrak true olur ve `durationMs` sonra otomatik false'a
 * döner. Bileşen unmount olursa zamanlayıcı temizlenir (unmounted setState yok);
 * üst üste tetiklemede önceki zamanlayıcı iptal edilir (süre baştan sayılır).
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useTransientFlag(durationMs = 2000): readonly [boolean, () => void] {
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const trigger = useCallback(() => {
    clear();
    setActive(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setActive(false);
    }, durationMs);
  }, [clear, durationMs]);

  // Unmount'ta bekleyen zamanlayıcıyı temizle.
  useEffect(() => clear, [clear]);

  return [active, trigger];
}
