/**
 * Uygulama girişi + basit yönlendirici. Abonelik kapısının ardında:
 * tarif seçimi (RecipeListScreen) → canlı pişirme (CookingScreen).
 * Henüz harici navigasyon kütüphanesi yok; tek state ile geçiş yeterli.
 */
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Linking, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { CookingScreen } from './src/screens/CookingScreen';
import { RecipeListScreen } from './src/screens/RecipeListScreen';
import { ShoppingListScreen } from './src/screens/ShoppingListScreen';
import { PantryScreen } from './src/screens/PantryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SuggestScreen } from './src/screens/SuggestScreen';
import { WeeklyPlanScreen } from './src/screens/WeeklyPlanScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
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
import { useMealPlanStore } from './src/state/mealPlanStore';
import { useShareStore } from './src/state/shareStore';
import { useOnboardingStore } from './src/state/onboardingStore';
import { createExpoNotify } from './src/services/notify';
import { createExpoPhoto } from './src/services/photo';
import { createRNShare } from './src/services/share';
import { setAnalytics, createMockAnalytics } from './src/services/analytics';
import { createAsyncStorage } from './src/services/storage';
import { getRecipe } from './src/recipes';
import { parseRecipeLink } from './src/recipes/share';
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
    const mealPlan = useMealPlanStore.getState();
    mealPlan.setStore(storage);
    void mealPlan.load();
    useShareStore.getState().setService(createRNShare());
    // Analitik: dev'de olayları logla. Üretimde createHttpAnalytics(proxy) ile değiştir.
    setAnalytics(createMockAnalytics((event) => console.log('[analytics]', event.name)));
    const onboarding = useOnboardingStore.getState();
    onboarding.setStore(storage);
    void onboarding.load();
    return null;
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShopping, setShowShopping] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  function openRecipe(r: Recipe) {
    setShowPantry(false);
    setShowSuggest(false);
    setShowPlan(false);
    setRecipe(r);
  }

  // Android donanım geri tuşu: açık alt ekranı kapat (uygulamadan çıkma).
  // Pişirme ekranı kendi geri tuşunu yönetir; orada bu devre dışı.
  const handleHardwareBack = useCallback(() => {
    if (recipe) return false; // CookingScreen kendi onayını yönetir
    const closers: [boolean, () => void][] = [
      [showPrivacy, () => setShowPrivacy(false)],
      [showSettings, () => setShowSettings(false)],
      [showSuggest, () => setShowSuggest(false)],
      [showPlan, () => setShowPlan(false)],
      [showProfile, () => setShowProfile(false)],
      [showPantry, () => setShowPantry(false)],
      [showShopping, () => setShowShopping(false)],
    ];
    const open = closers.find(([isOpen]) => isOpen);
    if (open) {
      open[1]();
      return true;
    }
    return false;
  }, [
    recipe,
    showPrivacy,
    showSettings,
    showSuggest,
    showPlan,
    showProfile,
    showPantry,
    showShopping,
  ]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [handleHardwareBack]);

  // Gelen derin bağlantı (lezzet://recipe/<id>) → paylaşılan tarifi aç.
  useEffect(() => {
    function handle(url: string | null): void {
      const id = parseRecipeLink(url);
      if (!id) return;
      const r = getRecipe(id);
      if (r) openRecipe(r);
    }
    void Linking.getInitialURL().then(handle);
    const sub = Linking.addEventListener('url', (e) => handle(e.url));
    return () => sub.remove();
  }, []);

  function content() {
    if (recipe) return <CookingScreen recipe={recipe} onBack={() => setRecipe(null)} />;
    if (showShopping) return <ShoppingListScreen onBack={() => setShowShopping(false)} />;
    if (showPantry)
      return <PantryScreen onSelect={openRecipe} onBack={() => setShowPantry(false)} />;
    if (showProfile) return <ProfileScreen onBack={() => setShowProfile(false)} />;
    if (showSuggest)
      return <SuggestScreen onSelect={openRecipe} onBack={() => setShowSuggest(false)} />;
    if (showPlan)
      return <WeeklyPlanScreen onSelect={openRecipe} onBack={() => setShowPlan(false)} />;
    if (showPrivacy) return <PrivacyScreen onBack={() => setShowPrivacy(false)} />;
    if (showSettings)
      return (
        <SettingsScreen
          onBack={() => setShowSettings(false)}
          onOpenPrivacy={() => setShowPrivacy(true)}
        />
      );
    return (
      <RecipeListScreen
        onSelect={setRecipe}
        onOpenShopping={() => setShowShopping(true)}
        onOpenPantry={() => setShowPantry(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenSuggest={() => setShowSuggest(true)}
        onOpenPlan={() => setShowPlan(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
    );
  }

  const colors = useThemeColors();
  const theme = useUiStore((s) => s.theme);
  const onboardingLoaded = useOnboardingStore((s) => s.loaded);
  const onboardingSeen = useOnboardingStore((s) => s.seen);

  function gated() {
    // Kalıcı değer okunana dek nötr (onboarding dönen kullanıcıya yanıp sönmesin).
    if (!onboardingLoaded) return null;
    if (!onboardingSeen) return <OnboardingScreen />;
    return <SubscriptionGate>{content()}</SubscriptionGate>;
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {gated()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
