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
import { SubscriptionGate } from './src/components/SubscriptionGate';
import { initLocaleFromDevice } from './src/i18n/deviceLocale';
import { useCookingStore } from './src/state/cookingStore';
import { useUiStore } from './src/state/uiStore';
import { useFavoritesStore } from './src/state/favoritesStore';
import { useShoppingStore } from './src/state/shoppingStore';
import { useHistoryStore } from './src/state/historyStore';
import { createExpoNotify } from './src/services/notify';
import { createAsyncStorage } from './src/services/storage';
import type { Recipe } from './src/engine/types';

export default function App() {
  // İlk render'dan önce: cihaz dilini uygula + uiStore'a yansıt + bildirim servisi.
  useState(() => {
    const detected = initLocaleFromDevice();
    useUiStore.getState().setLocale(detected);
    useCookingStore.getState().setNotify(createExpoNotify());
    // Kalıcı depoları (favori + alışveriş) bağla ve yükle.
    const storage = createAsyncStorage();
    const favorites = useFavoritesStore.getState();
    favorites.setStore(storage);
    void favorites.load();
    const shopping = useShoppingStore.getState();
    shopping.setStore(storage);
    void shopping.load();
    const history = useHistoryStore.getState();
    history.setStore(storage);
    void history.load();
    return null;
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShopping, setShowShopping] = useState(false);

  function content() {
    if (showShopping) return <ShoppingListScreen onBack={() => setShowShopping(false)} />;
    if (recipe) return <CookingScreen recipe={recipe} onBack={() => setRecipe(null)} />;
    return <RecipeListScreen onSelect={setRecipe} onOpenShopping={() => setShowShopping(true)} />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SubscriptionGate>{content()}</SubscriptionGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8F0' },
});
