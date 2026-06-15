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
import { RecipePreviewScreen } from './src/screens/RecipePreviewScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SubscriptionGate } from './src/components/SubscriptionGate';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { initLocaleFromDevice } from './src/i18n/deviceLocale';
import { useCookingStore } from './src/state/cookingStore';
import { useCookSessionStore } from './src/state/cookSessionStore';
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
import { useRecommendStore } from './src/state/recommendStore';
import { createExpoNotify } from './src/services/notify';
import { createExpoPhoto } from './src/services/photo';
import { createRNShare } from './src/services/share';
import { createExpoSpeechTTS } from './src/services/speech';
import { VOICE_RATE_VALUE } from './src/state/uiStore';
import { getLocale } from './src/i18n';
import { setAnalytics, createMockAnalytics, track } from './src/services/analytics';
import { useFlagsStore } from './src/state/flagsStore';
import { createAsyncStorage } from './src/services/storage';
import { getRecipe } from './src/recipes';
import { parseRecipeLink } from './src/recipes/share';
import { isResumable } from './src/recipes/session';
import { PROXY_BASE_URL, PROXY_CLIENT_TOKEN } from './src/config';
import type { Recipe } from './src/engine/types';

/** Cihaz-içi (anahtarsız) TTS — hem açılışta hem proxy bağlanınca korunur. */
function makeDeviceTts() {
  return createExpoSpeechTTS({
    getLocale,
    isEnabled: () => useUiStore.getState().voiceEnabled,
    getRate: () => VOICE_RATE_VALUE[useUiStore.getState().voiceRate],
  });
}

export default function App() {
  // İlk render'dan önce: cihaz dilini uygula + uiStore'a yansıt + bildirim servisi.
  useState(() => {
    const detected = initLocaleFromDevice();
    useUiStore.getState().setLocale(detected);
    useCookingStore.getState().setNotify(createExpoNotify());
    // Cihaz-içi TTS: uygulama anahtar/proxy olmadan da gerçekten konuşur.
    useCookingStore.getState().setTts(makeDeviceTts());
    // Kalıcı depoları (favori + alışveriş + tema) bağla ve yükle.
    const storage = createAsyncStorage();
    const ui = useUiStore.getState();
    ui.setThemeStore(storage);
    void ui.loadTheme();
    void ui.loadVoice();
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
    track({ name: 'app_opened' }); // oturum başı (retention/funnel zemini)
    const onboarding = useOnboardingStore.getState();
    onboarding.setStore(storage);
    void onboarding.load();
    // Aktif pişirme oturumu: yarım kalan iş varsa "devam et" teklifi için yükle.
    const cookSession = useCookSessionStore.getState();
    cookSession.setStore(storage);
    void cookSession.load();
    return null;
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [cooking, setCooking] = useState(false);
  // Sürdürülen oturumda tamamlanmış adımlar (varsa CookingScreen'e geçilir).
  const [resumeDone, setResumeDone] = useState<readonly string[] | undefined>(undefined);
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
    setCooking(false); // önce önizleme
    setResumeDone(undefined); // normal açılış: baştan başla
    setRecipe(r);
  }

  // "Kaldığın yerden devam et": önizlemeyi atla, doğrudan canlı pişirmeye gir.
  function resumeRecipe(r: Recipe, doneIds: readonly string[]) {
    setShowPantry(false);
    setShowSuggest(false);
    setShowPlan(false);
    setResumeDone(doneIds);
    setRecipe(r);
    setCooking(true);
  }

  // Android donanım geri tuşu: açık alt ekranı kapat (uygulamadan çıkma).
  // Canlı pişirme ekranı kendi geri tuşunu/onayını yönetir.
  const handleHardwareBack = useCallback(() => {
    if (recipe && cooking) return false; // CookingScreen kendi onayını yönetir
    if (recipe) {
      setRecipe(null); // önizlemeden listeye dön
      return true;
    }
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
    cooking,
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

  // Proxy adresi yapılandırıldıysa gerçek servisleri otomatik bağla (Claude
  // vision/intent + AI öneri + bulut STT). Cihaz-içi TTS korunur (anahtarsız).
  // Servisler dinamik import edilir → proxy yokken @anthropic-ai/sdk açılışa girmez.
  useEffect(() => {
    const base = PROXY_BASE_URL.trim();
    if (!base) return;
    let cancelled = false;
    void (async () => {
      const [real, recommend, analytics] = await Promise.all([
        import('./src/services/real'),
        import('./src/services/recommend'),
        import('./src/services/analytics'),
      ]);
      if (cancelled) return;
      const token = PROXY_CLIENT_TOKEN.trim() || undefined;
      const config = real.proxyRealConfig(base, { clientToken: token });
      const cooking = useCookingStore.getState();
      cooking.setServices(real.createRealServices(config));
      cooking.setTts(makeDeviceTts()); // sesi cihazda tut (anahtarsız + offline)
      useRecommendStore
        .getState()
        .setService(
          recommend.createClaudeRecommend(
            real.createAnthropicClient(config.anthropic),
            config.anthropic.model,
          ),
        );
      setAnalytics(
        analytics.createHttpAnalytics({
          url: `${base.replace(/\/$/, '')}/analytics`,
          clientToken: token,
        }),
      );
      // Remote config (özellik bayrakları). Hata akışı bozmaz → varsayılanlar kalır.
      try {
        const res = await fetch(`${base.replace(/\/$/, '')}/config`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!cancelled && res.ok) useFlagsStore.getState().applyRemote(await res.json());
      } catch {
        // remote config alınamadı → güvenli varsayılanlarla devam
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function content() {
    if (recipe && cooking)
      return (
        <CookingScreen recipe={recipe} resumeDone={resumeDone} onBack={() => setCooking(false)} />
      );
    if (recipe)
      return (
        <RecipePreviewScreen
          recipe={recipe}
          onCook={() => setCooking(true)}
          onBack={() => setRecipe(null)}
        />
      );
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
        onSelect={openRecipe}
        onOpenShopping={() => setShowShopping(true)}
        onOpenPantry={() => setShowPantry(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenSuggest={() => setShowSuggest(true)}
        onOpenPlan={() => setShowPlan(true)}
        onOpenSettings={() => setShowSettings(true)}
        resumeRecipe={resumable}
        onResume={() => {
          if (resumable && session) resumeRecipe(resumable, session.doneIds);
        }}
        onDismissResume={() => void clearSession()}
      />
    );
  }

  const colors = useThemeColors();
  const theme = useUiStore((s) => s.theme);
  const onboardingLoaded = useOnboardingStore((s) => s.loaded);
  const onboardingSeen = useOnboardingStore((s) => s.seen);
  const session = useCookSessionStore((s) => s.session);
  const clearSession = useCookSessionStore((s) => s.clear);
  // Yarım kalan oturum sürdürülebilir mi (adım var + tarif mevcut)?
  const resumable = isResumable(session) ? (getRecipe(session.recipeId) ?? null) : null;

  function gated() {
    // Kalıcı değer okunana dek nötr (onboarding dönen kullanıcıya yanıp sönmesin).
    if (!onboardingLoaded) return null;
    if (!onboardingSeen) return <OnboardingScreen />;
    return <SubscriptionGate>{content()}</SubscriptionGate>;
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ErrorBoundary>{gated()}</ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
