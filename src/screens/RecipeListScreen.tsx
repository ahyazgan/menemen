/**
 * RecipeListScreen — "Ne pişsem?" (CLAUDE.md değer #1: ne pişeceğine karar).
 * Arama + kategori filtresi. Sadece UI: seçim yukarı bildirilir; filtre saf
 * (filterRecipes), pişirmeyi App yönlendirir.
 *
 * Performans: kartlar FlatList ile sanallaştırılır ve React.memo'lu — aramada
 * her tuşta tüm liste değil, yalnızca değişen kartlar render olur. Başlık
 * `ListHeaderComponent`'e ELEMENT olarak verilir (arama kutusu odağını korur).
 */
import { memo, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';

import { randomRecipe, getRecipe } from '../recipes';
import { CATEGORIES, filterRecipes } from '../recipes/filter';
import { filterByProfile, recipeDifficulty } from '../recipes/profile';
import { AVAILABLE_LOCALES, t } from '../i18n';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useFavoritesStore } from '../state/favoritesStore';
import { useHistoryStore } from '../state/historyStore';
import { useStreakStore } from '../state/streakStore';
import { useProfileStore } from '../state/profileStore';
import { useRecipeSourceStore } from '../state/recipeSourceStore';
import { useFlag } from '../state/flagsStore';
import { cookCounts } from '../recipes/history';
import { computeStreak, toDayNumber } from '../recipes/streak';
import { localize } from '../engine';
import type { ThemeColors } from '../config/theme';
import type { Recipe, RecipeCategory } from '../engine/types';

type Styles = ReturnType<typeof makeStyles>;

interface Props {
  onSelect: (recipe: Recipe) => void;
  onOpenShopping: () => void;
  onOpenPantry: () => void;
  onOpenProfile: () => void;
  onOpenSuggest: () => void;
  onOpenPlan: () => void;
  onOpenSettings: () => void;
  /** Sürdürülebilir oturum varsa, kaldığı yerden devam edilecek tarif. */
  resumeRecipe?: Recipe | null;
  /** "Kaldığın yerden devam et" tıklanınca. */
  onResume?: () => void;
  /** Sürdürme teklifini kapat (oturumu unut). */
  onDismissResume?: () => void;
}

export function RecipeListScreen({
  onSelect,
  onOpenShopping,
  onOpenPantry,
  onOpenProfile,
  onOpenSuggest,
  onOpenPlan,
  onOpenSettings,
  resumeRecipe,
  onResume,
  onDismissResume,
}: Props) {
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const historyEntries = useHistoryStore((s) => s.entries);
  const profile = useProfileStore((s) => s.profile);
  const sourceList = useRecipeSourceStore((s) => s.list);
  const recent = useMemo(
    () =>
      historyEntries
        .map((e) => getRecipe(e.recipeId))
        .filter((r): r is Recipe => r != null)
        .slice(0, 6),
    [historyEntries],
  );
  const counts = useMemo(() => cookCounts(historyEntries), [historyEntries]);
  const streaksEnabled = useFlag('streaks');
  const cookDays = useStreakStore((s) => s.days);
  const streak = useMemo(() => computeStreak(cookDays, toDayNumber(Date.now())), [cookDays]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const shown = useMemo(() => {
    // Önce profil (diyet + kaçınılan malzeme), sonra arama/kategori/favori süzgeci.
    const byProfile = filterByProfile(sourceList, profile);
    const base = filterRecipes(byProfile, { query, category });
    return onlyFavorites ? base.filter((r) => favoriteIds.includes(r.id)) : base;
  }, [sourceList, query, category, onlyFavorites, favoriteIds, profile]);

  const renderItem = useCallback<ListRenderItem<Recipe>>(
    ({ item }) => (
      <RecipeCard
        recipe={item}
        locale={locale}
        fav={favoriteIds.includes(item.id)}
        count={counts[item.id] ?? 0}
        styles={styles}
        onSelect={onSelect}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [locale, favoriteIds, counts, styles, onSelect, toggleFavorite],
  );

  // Başlık ELEMENT olarak verilir (fonksiyon DEĞİL) → liste güncellenince
  // yeniden monte olmaz, arama kutusu odağı korunur.
  const header = (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{t('picker.title')}</Text>
        <View style={styles.langRow}>
          {AVAILABLE_LOCALES.map((code) => (
            <Pressable
              key={code}
              style={[styles.lang, locale === code && styles.langActive]}
              onPress={() => setLocale(code)}
            >
              <Text style={[styles.langText, locale === code && styles.langTextActive]}>
                {code.toUpperCase()}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.lang} onPress={() => void toggleTheme()}>
            <Text style={styles.langText}>{theme === 'dark' ? '☀️' : '🌙'}</Text>
          </Pressable>
          <Pressable style={styles.lang} onPress={onOpenSettings}>
            <Text style={styles.langText}>{t('settings.button')}</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.subtitle}>{t('picker.subtitle')}</Text>

      {streaksEnabled && (
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>
            {streak.current > 0 ? t('streak.title', { count: streak.current }) : t('streak.start')}
          </Text>
          <Text style={styles.streakSub}>
            {streak.cookedToday
              ? t('streak.today')
              : streak.current > 0
                ? t('streak.keepGoing')
                : t('streak.weekly', { count: streak.weeklyCount })}
          </Text>
          <View style={styles.streakDots}>
            {[6, 5, 4, 3, 2, 1, 0].map((back) => {
              const day = toDayNumber(Date.now()) - back;
              const on = cookDays.includes(day);
              return <View key={back} style={[styles.streakDot, on && styles.streakDotOn]} />;
            })}
          </View>
        </View>
      )}

      {resumeRecipe && onResume && (
        <View style={styles.resumeBanner}>
          <View style={styles.resumeTextBlock}>
            <Text style={styles.resumeLabel}>{t('picker.resumeLabel')}</Text>
            <Text style={styles.resumeTitle} numberOfLines={1}>
              {localize(resumeRecipe.title, locale)}
            </Text>
          </View>
          <Pressable
            style={styles.resumeBtn}
            onPress={onResume}
            accessibilityRole="button"
            accessibilityLabel={t('picker.resume')}
          >
            <Text style={styles.resumeBtnText}>{t('picker.resume')}</Text>
          </Pressable>
          {onDismissResume && (
            <Pressable
              style={styles.resumeDismiss}
              hitSlop={10}
              onPress={onDismissResume}
              accessibilityRole="button"
              accessibilityLabel={t('picker.resumeDismiss')}
            >
              <Text style={styles.resumeDismissText}>✕</Text>
            </Pressable>
          )}
        </View>
      )}

      <Pressable style={styles.suggest} onPress={onOpenSuggest}>
        <Text style={styles.suggestText}>{t('suggest.button')}</Text>
      </Pressable>

      {recent.length > 0 && (
        <View style={styles.recentBlock}>
          <Text style={styles.recentLabel}>{t('picker.recent')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recent.map((r) => (
              <Pressable key={r.id} style={styles.recentChip} onPress={() => onSelect(r)}>
                <Text style={styles.recentText}>{localize(r.title, locale)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <TextInput
        style={styles.search}
        placeholder={t('picker.search')}
        placeholderTextColor={colors.placeholder}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {/* Kategori + favori sekmeleri */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip
          label={t('picker.all')}
          active={category === null}
          onPress={() => setCategory(null)}
          styles={styles}
        />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={t(`picker.categories.${c}`)}
            active={category === c}
            onPress={() => setCategory((prev) => (prev === c ? null : c))}
            styles={styles}
          />
        ))}
        <Chip
          label={t('picker.favorites')}
          active={onlyFavorites}
          onPress={() => setOnlyFavorites((v) => !v)}
          styles={styles}
        />
      </ScrollView>

      <Pressable style={styles.random} onPress={() => onSelect(randomRecipe())}>
        <Text style={styles.randomText}>{t('picker.random')}</Text>
      </Pressable>
      <View style={styles.actionsRow}>
        <Pressable style={[styles.shopping, styles.flex]} onPress={onOpenShopping}>
          <Text style={styles.shoppingText}>{t('picker.shopping')}</Text>
        </Pressable>
        <Pressable style={[styles.shopping, styles.flex]} onPress={onOpenPantry}>
          <Text style={styles.shoppingText}>{t('picker.pantry')}</Text>
        </Pressable>
      </View>
      <View style={styles.actionsRow}>
        <Pressable style={[styles.shopping, styles.flex]} onPress={onOpenPlan}>
          <Text style={styles.shoppingText}>{t('plan.button')}</Text>
        </Pressable>
        <Pressable style={[styles.shopping, styles.flex]} onPress={onOpenProfile}>
          <Text style={styles.shoppingText}>{t('profile.button')}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={shown}
      keyExtractor={(r) => r.id}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {onlyFavorites ? t('picker.noFavorites') : t('picker.noResults')}
        </Text>
      }
      keyboardShouldPersistTaps="handled"
      initialNumToRender={8}
      windowSize={11}
      removeClippedSubviews
    />
  );
}

interface CardProps {
  recipe: Recipe;
  locale: string;
  fav: boolean;
  count: number;
  styles: Styles;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (id: string) => void;
}

const RecipeCard = memo(function RecipeCard({
  recipe,
  locale,
  fav,
  count,
  styles,
  onSelect,
  onToggleFavorite,
}: CardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onSelect(recipe)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{localize(recipe.title, locale)}</Text>
        <Pressable
          hitSlop={10}
          onPress={() => void onToggleFavorite(recipe.id)}
          style={styles.star}
        >
          <Text style={[styles.starText, fav && styles.starActive]}>{fav ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      {recipe.summary && <Text style={styles.cardSummary}>{localize(recipe.summary, locale)}</Text>}
      <Text style={styles.cardMeta}>
        {recipe.totalMinutes != null ? `${recipe.totalMinutes} ${t('picker.minutes')} · ` : ''}
        {recipe.servings} {t('picker.servings')}
        {` · ${t(`difficulty.${recipeDifficulty(recipe)}`)}`}
        {count > 0 ? ` · ${count} ${t('picker.times')}` : ''}
      </Text>
    </Pressable>
  );
});

function Chip({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    langRow: { flexDirection: 'row', gap: 6 },
    lang: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    langActive: { backgroundColor: c.primary, borderColor: c.primary },
    langText: { color: c.textMuted, fontSize: 13, fontWeight: '700' },
    langTextActive: { color: c.onPrimary },
    title: { fontSize: 32, fontWeight: '800', color: c.primary },
    subtitle: { fontSize: 16, color: c.textMuted, marginTop: 6, marginBottom: 14 },
    suggest: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      marginBottom: 16,
    },
    suggestText: { color: c.onPrimary, fontSize: 16, fontWeight: '800' },
    streakCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 16,
    },
    streakTitle: { fontSize: 18, fontWeight: '800', color: c.text },
    streakSub: { fontSize: 14, color: c.textMuted, marginTop: 4 },
    streakDots: { flexDirection: 'row', gap: 8, marginTop: 12 },
    streakDot: { flex: 1, height: 8, borderRadius: 4, backgroundColor: c.fill },
    streakDotOn: { backgroundColor: c.accent },
    resumeBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.primary,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 16,
      gap: 10,
    },
    resumeTextBlock: { flex: 1 },
    resumeLabel: { fontSize: 12, color: c.label, fontWeight: '700', textTransform: 'uppercase' },
    resumeTitle: { fontSize: 16, color: c.text, fontWeight: '700', marginTop: 2 },
    resumeBtn: {
      backgroundColor: c.primary,
      borderRadius: 10,
      paddingVertical: 9,
      paddingHorizontal: 14,
    },
    resumeBtnText: { color: c.onPrimary, fontSize: 14, fontWeight: '800' },
    resumeDismiss: { paddingHorizontal: 4 },
    resumeDismissText: { color: c.textSubtle, fontSize: 16, fontWeight: '700' },
    recentBlock: { marginBottom: 14 },
    recentLabel: { fontSize: 13, fontWeight: '700', color: c.textMuted, marginBottom: 8 },
    recentChip: {
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
    },
    recentText: { color: c.text, fontSize: 14, fontWeight: '600' },
    search: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: c.text,
    },
    chips: { marginTop: 12, marginBottom: 4 },
    chip: {
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
    },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipText: { color: c.textMuted, fontSize: 14, fontWeight: '600' },
    chipTextActive: { color: c.onPrimary },
    random: {
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 20,
    },
    randomText: { color: c.onAccent, fontSize: 17, fontWeight: '700' },
    actionsRow: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 10 },
    flex: { flex: 1, marginTop: 0, marginBottom: 0 },
    shopping: {
      backgroundColor: c.fill,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shoppingText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    empty: { fontSize: 16, color: c.textMuted, textAlign: 'center', marginTop: 24 },
    card: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    cardTitle: { fontSize: 20, fontWeight: '700', color: c.text, flex: 1, paddingRight: 8 },
    star: { paddingHorizontal: 2 },
    starText: { fontSize: 22, color: c.starOff },
    starActive: { color: c.star },
    cardSummary: { fontSize: 15, color: c.textBody, marginTop: 4, lineHeight: 21 },
    cardMeta: { fontSize: 13, color: c.textSubtle, marginTop: 10 },
  });
