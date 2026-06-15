/**
 * PantryScreen — "Elimde ne var?". Elindeki malzemeleri işaretle; yapabileceğin
 * tarifleri (eksiği en az olandan başlayarak) göster. Sadece UI; mantık saf
 * (recipes/pantry.ts), seçim pantryStore'da kalıcı.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { allIngredients, rankByPantry } from '../recipes/pantry';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { usePantryStore } from '../state/pantryStore';
import { useRecipeSourceStore } from '../state/recipeSourceStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { Recipe } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
  onBack: () => void;
}

export function PantryScreen({ onSelect, onBack }: Props) {
  const locale = useUiStore((s) => s.locale);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const owned = usePantryStore((s) => s.owned);
  const toggle = usePantryStore((s) => s.toggle);

  const sourceList = useRecipeSourceStore((s) => s.list);
  const ingredients = useMemo(() => allIngredients(sourceList), [sourceList]);
  const ownedSet = useMemo(() => new Set(owned), [owned]);
  const ranked = useMemo(() => rankByPantry(sourceList, ownedSet), [sourceList, ownedSet]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('pantry.title')}</Text>
      <Text style={styles.subtitle}>{t('pantry.subtitle')}</Text>

      <Text style={styles.section}>{t('pantry.pickIngredients')}</Text>
      <View style={styles.chips}>
        {ingredients.map((ing) => {
          const on = ownedSet.has(ing.key);
          return (
            <Pressable
              key={ing.key}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => void toggle(ing.key)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {localize(ing.name, locale)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>{t('pantry.canMake')}</Text>
      {ranked.length === 0 ? (
        <Text style={styles.empty}>{t('pantry.none')}</Text>
      ) : (
        ranked.map(({ recipe, have, total }) => (
          <Pressable key={recipe.id} style={styles.card} onPress={() => onSelect(recipe)}>
            <Text style={styles.cardTitle}>{localize(recipe.title, locale)}</Text>
            <Text style={[styles.cardMeta, have === total && styles.cardMetaFull]}>
              {have}/{total} {t('pantry.ofTotal')}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    title: { fontSize: 30, fontWeight: '800', color: c.primary },
    subtitle: { fontSize: 15, color: c.textMuted, marginTop: 6, marginBottom: 16, lineHeight: 21 },
    section: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
      marginTop: 12,
      marginBottom: 10,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: c.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    chipOn: { backgroundColor: c.successSoft, borderColor: c.successSoft },
    chipText: { color: c.textBody, fontSize: 14, fontWeight: '600' },
    chipTextOn: { color: '#FFFFFF' },
    empty: { fontSize: 15, color: c.textMuted, marginTop: 4 },
    card: {
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: c.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: { fontSize: 17, fontWeight: '700', color: c.text, flex: 1, paddingRight: 8 },
    cardMeta: { fontSize: 14, color: c.textSubtle, fontWeight: '600' },
    cardMetaFull: { color: c.success },
  });
