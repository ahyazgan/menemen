/**
 * Uygulama girişi + basit yönlendirici. Abonelik kapısının ardında:
 * tarif seçimi (RecipeListScreen) → canlı pişirme (CookingScreen).
 * Henüz harici navigasyon kütüphanesi yok; tek state ile geçiş yeterli.
 */
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { CookingScreen } from './src/screens/CookingScreen';
import { RecipeListScreen } from './src/screens/RecipeListScreen';
import { ShoppingListScreen } from './src/screens/ShoppingListScreen';
import { PantryScreen } from './src/screens/PantryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SubscriptionGate } from './src/components/SubscriptionGate';
import { initLocaleFromDevice } from './src/i18n/deviceLocale';
import { useCookingStore } from './src/state/cookingStore';
import { useUiStore, useThemeColors } from './src/state/uiStore';
import { useFavoritesStore } from './src/state/favoritesStore';
import { useShoppingStore } from './src/state/shoppingStore';
import { useHistoryStore } from './src/state/historyStore';
import { useNotesStore } from './src/state/notesStore';
import { usePantryStore } from './src/state/pantryStore';
import { useStepPhotosStore } from './src/state/stepPhotosStore';
import { useProfileStore } from './src/state/profileStore';
import { createExpoNotify } from './src/services/notify';
import { createExpoPhoto } from './src/services/photo';
import { createAsyncStorage } from './src/services/storage';
import type { Recipe } from './src/engine/types';

export default function App() {
  // İlk render'dan önce: cihaz dilini uygula + uiStore'a yansıt + bildirim servisi.
  useState(() => {
    const detected = initLocaleFromDevice();
    useUiStore.getState().setLocale(detected);
    useCookingStore.getState().setNotify(createExpoNotify());
    // Kalıcı depoları (favori + alışveriş + tema) bağla ve yükle.
    const storage = createAsyncStorage();
    const ui = useUiStore.getState();
    ui.setThemeStore(storage);
    void ui.loadTheme();
    const favorites = useFavoritesStore.getState();
    favorites.setStore(storage);
    void favorites.load();
    const shopping = useShoppingStore.getState();
    shopping.setStore(storage);
    void shopping.load();
    const history = useHistoryStore.getState();
    history.setStore(storage);
    void history.load();
    const notes = useNotesStore.getState();
    notes.setStore(storage);
    void notes.load();
    const pantry = usePantryStore.getState();
    pantry.setStore(storage);
    void pantry.load();
    const stepPhotos = useStepPhotosStore.getState();
    stepPhotos.setStore(storage);
    stepPhotos.setPhoto(createExpoPhoto());
    void stepPhotos.load();
    const profile = useProfileStore.getState();
    profile.setStore(storage);
    void profile.load();
    return null;
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShopping, setShowShopping] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  function openRecipe(r: Recipe) {
    setShowPantry(false);
    setRecipe(r);
  }

  function content() {
    if (recipe) return <CookingScreen recipe={recipe} onBack={() => setRecipe(null)} />;
    if (showShopping) return <ShoppingListScreen onBack={() => setShowShopping(false)} />;
    if (showPantry) return <PantryScreen onSelect={openRecipe} onBack={() => setShowPantry(false)} />;
    if (showProfile) return <ProfileScreen onBack={() => setShowProfile(false)} />;
    return (
      <RecipeListScreen
        onSelect={setRecipe}
        onOpenShopping={() => setShowShopping(true)}
        onOpenPantry={() => setShowPantry(true)}
        onOpenProfile={() => setShowProfile(true)}
      />
    );
  }

  const colors = useThemeColors();
  const theme = useUiStore((s) => s.theme);
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <SubscriptionGate>{content()}</SubscriptionGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
