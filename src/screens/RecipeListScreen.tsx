/**
 * RecipeListScreen — "Ne pişsem?" (CLAUDE.md değer #1: ne pişeceğine karar).
 * Arama + kategori filtresi. Sadece UI: seçim yukarı bildirilir; filtre saf
 * (filterRecipes), pişirmeyi App yönlendirir.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { recipeList, randomRecipe, getRecipe } from '../recipes';
import { CATEGORIES, filterRecipes } from '../recipes/filter';
import { AVAILABLE_LOCALES, t } from '../i18n';
import { useUiStore } from '../state/uiStore';
import { useFavoritesStore } from '../state/favoritesStore';
import { useHistoryStore } from '../state/historyStore';
import { localize } from '../engine';
import type { Recipe, RecipeCategory } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
  onOpenShopping: () => void;
}

export function RecipeListScreen({ onSelect, onOpenShopping }: Props) {
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const historyEntries = useHistoryStore((s) => s.entries);
  const recent = useMemo(
    () =>
      historyEntries
        .map((e) => getRecipe(e.recipeId))
        .filter((r): r is Recipe => r != null)
        .slice(0, 6),
    [historyEntries],
  );
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const shown = useMemo(() => {
    const base = filterRecipes(recipeList, { query, category });
    return onlyFavorites ? base.filter((r) => favoriteIds.includes(r.id)) : base;
  }, [query, category, onlyFavorites, favoriteIds]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
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
        </View>
      </View>
      <Text style={styles.subtitle}>{t('picker.subtitle')}</Text>

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
        placeholderTextColor="#A8927F"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {/* Kategori + favori sekmeleri */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip label={t('picker.all')} active={category === null} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={t(`picker.categories.${c}`)}
            active={category === c}
            onPress={() => setCategory((prev) => (prev === c ? null : c))}
          />
        ))}
        <Chip
          label={t('picker.favorites')}
          active={onlyFavorites}
          onPress={() => setOnlyFavorites((v) => !v)}
        />
      </ScrollView>

      <View style={styles.actionsRow}>
        <Pressable style={[styles.random, styles.flex]} onPress={() => onSelect(randomRecipe())}>
          <Text style={styles.randomText}>{t('picker.random')}</Text>
        </Pressable>
        <Pressable style={styles.shopping} onPress={onOpenShopping}>
          <Text style={styles.shoppingText}>{t('picker.shopping')}</Text>
        </Pressable>
      </View>

      {shown.length === 0 ? (
        <Text style={styles.empty}>{t('picker.noResults')}</Text>
      ) : (
        shown.map((recipe) => {
          const fav = favoriteIds.includes(recipe.id);
          return (
            <Pressable key={recipe.id} style={styles.card} onPress={() => onSelect(recipe)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{localize(recipe.title, locale)}</Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => void toggleFavorite(recipe.id)}
                  style={styles.star}
                >
                  <Text style={[styles.starText, fav && styles.starActive]}>{fav ? '★' : '☆'}</Text>
                </Pressable>
              </View>
              {recipe.summary && (
                <Text style={styles.cardSummary}>{localize(recipe.summary, locale)}</Text>
              )}
              <Text style={styles.cardMeta}>
                {recipe.totalMinutes != null
                  ? `${recipe.totalMinutes} ${t('picker.minutes')} · `
                  : ''}
                {recipe.servings} {t('picker.servings')}
              </Text>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  langRow: { flexDirection: 'row', gap: 6 },
  lang: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  langActive: { backgroundColor: '#B5300F', borderColor: '#B5300F' },
  langText: { color: '#8A6D5B', fontSize: 13, fontWeight: '700' },
  langTextActive: { color: '#FFF' },
  title: { fontSize: 32, fontWeight: '800', color: '#B5300F' },
  subtitle: { fontSize: 16, color: '#8A6D5B', marginTop: 6, marginBottom: 16 },
  recentBlock: { marginBottom: 14 },
  recentLabel: { fontSize: 13, fontWeight: '700', color: '#8A6D5B', marginBottom: 8 },
  recentChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  recentText: { color: '#2B2B2B', fontSize: 14, fontWeight: '600' },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2B2B2B',
  },
  chips: { marginTop: 12, marginBottom: 4 },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#B5300F', borderColor: '#B5300F' },
  chipText: { color: '#8A6D5B', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  random: {
    backgroundColor: '#2B2B2B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  randomText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 20 },
  flex: { flex: 1, marginTop: 0, marginBottom: 0 },
  shopping: {
    backgroundColor: '#F0E2D6',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoppingText: { color: '#8A6D5B', fontSize: 15, fontWeight: '700' },
  empty: { fontSize: 16, color: '#8A6D5B', textAlign: 'center', marginTop: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E2D6',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#2B2B2B', flex: 1, paddingRight: 8 },
  star: { paddingHorizontal: 2 },
  starText: { fontSize: 22, color: '#C9B7A6' },
  starActive: { color: '#E0A100' },
  cardSummary: { fontSize: 15, color: '#6B5648', marginTop: 4, lineHeight: 21 },
  cardMeta: { fontSize: 13, color: '#A8927F', marginTop: 10 },
});
