/**
 * Uygulama girişi + basit yönlendirici. Abonelik kapısının ardında:
 * tarif seçimi (RecipeListScreen) → canlı pişirme (CookingScreen).
 * Henüz harici navigasyon kütüphanesi yok; tek state ile geçiş yeterli.
 */
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { CookingScreen } from './src/screens/CookingScreen';
import { RecipeListScreen } from './src/screens/RecipeListScreen';
import { SubscriptionGate } from './src/components/SubscriptionGate';
import { initLocaleFromDevice } from './src/i18n/deviceLocale';
import { useCookingStore } from './src/state/cookingStore';
import { createExpoNotify } from './src/services/notify';
import type { Recipe } from './src/engine/types';

export default function App() {
  // İlk render'dan önce: cihaz dilini uygula + gerçek bildirim servisini bağla.
  useState(() => {
    initLocaleFromDevice();
    useCookingStore.getState().setNotify(createExpoNotify());
    return null;
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SubscriptionGate>
        {recipe ? (
          <CookingScreen recipe={recipe} onBack={() => setRecipe(null)} />
        ) : (
          <RecipeListScreen onSelect={setRecipe} />
        )}
      </SubscriptionGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8F0' },
});
