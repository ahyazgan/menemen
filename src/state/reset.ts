/**
 * Kişisel verileri temizleme (Ayarlar → Verileri temizle). Cihazdaki kalıcı
 * anahtarları siler ve ilgili store'ları varsayılana döndürür. Dil/tema tercihi
 * ve "onboarding görüldü" bilgisi korunur (kullanıcı baştan başlamasın).
 */
import { createAsyncStorage } from '../services/storage';
import { useFavoritesStore } from './favoritesStore';
import { useShoppingStore } from './shoppingStore';
import { useHistoryStore } from './historyStore';
import { useNotesStore } from './notesStore';
import { usePantryStore } from './pantryStore';
import { useProfileStore } from './profileStore';
import { useMealPlanStore } from './mealPlanStore';
import { useStepPhotosStore } from './stepPhotosStore';

const KEYS = [
  'lezzet.favorites',
  'lezzet.shopping',
  'lezzet.history',
  'lezzet.notes',
  'lezzet.pantry',
  'lezzet.profile',
  'lezzet.mealPlan',
  'lezzet.stepPhotos',
];

export async function resetUserData(): Promise<void> {
  const storage = createAsyncStorage();
  await Promise.all(KEYS.map((key) => storage.removeItem(key)));
  // Bellek içi durumu da varsayılana çek (depo boş → parse(null) → varsayılan).
  await Promise.all([
    useFavoritesStore.getState().load(),
    useShoppingStore.getState().load(),
    useHistoryStore.getState().load(),
    useNotesStore.getState().load(),
    usePantryStore.getState().load(),
    useProfileStore.getState().load(),
    useMealPlanStore.getState().load(),
    useStepPhotosStore.getState().load(),
  ]);
}
