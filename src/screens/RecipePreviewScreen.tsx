/**
 * RecipePreviewScreen — pişirmeye başlamadan önce tarif önizlemesi: özet, meta,
 * malzemeler (porsiyon ayarlı, alışverişe ekle), tüm adımlar (okunur). "Pişirmeye
 * başla" ile canlı pişirmeye geçilir. Sadece UI; mantık saf yardımcılardan/store'lardan.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ingredientLabel } from '../recipes/ingredients';
import { recipeDifficulty, recipeDiet } from '../recipes/profile';
import type { ShoppingItem } from '../recipes/shopping';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useFavoritesStore } from '../state/favoritesStore';
import { useShoppingStore } from '../state/shoppingStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { Recipe } from '../engine/types';

interface Props {
  recipe: Recipe;
  onCook: () => void;
  onBack: () => void;
}

export function RecipePreviewScreen({ recipe, onCook, onBack }: Props) {
  const locale = useUiStore((s) => s.locale);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const addToShopping = useShoppingStore((s) => s.add);
  const [servings, setServings] = useState(recipe.servings);
  const [added, setAdded] = useState(false);

  const fav = favoriteIds.includes(recipe.id);
  const diet = recipeDiet(recipe);
  const dietLabel = diet.vegan
    ? t('profile.diets.vegan')
    : diet.vegetarian
      ? t('profile.diets.vegetarian')
      : null;

  function onAddToShopping(): void {
    if (!recipe.ingredients) return;
    const items: ShoppingItem[] = recipe.ingredients.map((ing, idx) => ({
      id: `${recipe.id}:${idx}`,
      label: ingredientLabel(ing, recipe.servings, servings, locale),
      checked: false,
    }));
    void addToShopping(items);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{localize(recipe.title, locale)}</Text>
        <Pressable hitSlop={10} onPress={() => void toggleFavorite(recipe.id)} style={styles.star}>
          <Text style={[styles.starText, fav && styles.starActive]}>{fav ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      {recipe.summary && <Text style={styles.summary}>{localize(recipe.summary, locale)}</Text>}

      <View style={styles.badges}>
        {recipe.totalMinutes != null && (
          <Badge text={`${recipe.totalMinutes} ${t('picker.minutes')}`} styles={styles} />
        )}
        <Badge text={`${recipe.servings} ${t('picker.servings')}`} styles={styles} />
        <Badge text={t(`difficulty.${recipeDifficulty(recipe)}`)} styles={styles} />
        {dietLabel && <Badge text={dietLabel} styles={styles} />}
      </View>

      <Pressable style={styles.cook} onPress={onCook}>
        <Text style={styles.cookText}>{t('preview.cook')}</Text>
      </Pressable>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{t('cooking.ingredients')}</Text>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setServings((s) => Math.max(1, s - 1))}
              >
                <Text style={styles.stepText}>−</Text>
              </Pressable>
              <Text style={styles.servings}>
                {servings} {t('picker.servings')}
              </Text>
              <Pressable style={styles.stepBtn} onPress={() => setServings((s) => s + 1)}>
                <Text style={styles.stepText}>+</Text>
              </Pressable>
            </View>
          </View>
          {recipe.ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.ingItem}>
              • {ingredientLabel(ing, recipe.servings, servings, locale)}
            </Text>
          ))}
          <Pressable style={styles.addBtn} onPress={onAddToShopping}>
            <Text style={styles.addText}>
              {added ? t('cooking.added') : t('cooking.addToShopping')}
            </Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.section}>{t('preview.steps')}</Text>
      {recipe.nodes.map((node, idx) => (
        <View key={node.id} style={styles.stepRow}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{idx + 1}</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>{localize(node.title, locale)}</Text>
            <Text style={styles.stepText2}>{localize(node.instruction, locale)}</Text>
            {node.safety?.critical && <Text style={styles.crit}>⚠️ {t('preview.critical')}</Text>}
          </View>
        </View>
      ))}

      <Text style={styles.safetyFooter}>{t('safety.general')}</Text>
    </ScrollView>
  );
}

function Badge({ text, styles }: { text: string; styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    title: { fontSize: 30, fontWeight: '800', color: c.primary, flex: 1, paddingRight: 8 },
    star: { paddingHorizontal: 2 },
    starText: { fontSize: 28, color: c.starOff },
    starActive: { color: c.star },
    summary: { fontSize: 16, color: c.textBody, marginTop: 8, lineHeight: 23 },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
    badge: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    badgeText: { color: c.textMuted, fontSize: 13, fontWeight: '700' },
    cook: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 18,
    },
    cookText: { color: c.onPrimary, fontSize: 17, fontWeight: '800' },
    panel: {
      backgroundColor: c.surfaceAlt,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginTop: 20,
    },
    panelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    panelTitle: { fontSize: 16, fontWeight: '700', color: c.textMuted },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: c.fill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepText: { fontSize: 18, color: c.primary, fontWeight: '700' },
    servings: { fontSize: 14, color: c.text, fontWeight: '600', minWidth: 64, textAlign: 'center' },
    ingItem: { fontSize: 15, color: c.textBody, lineHeight: 24 },
    addBtn: {
      marginTop: 12,
      backgroundColor: c.fill,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
    },
    addText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    section: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
      marginTop: 24,
      marginBottom: 12,
      textTransform: 'uppercase',
    },
    stepRow: { flexDirection: 'row', marginBottom: 16 },
    stepNum: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: c.fill,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    stepNumText: { color: c.primary, fontSize: 13, fontWeight: '800' },
    stepBody: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: c.text },
    stepText2: { fontSize: 15, color: c.textBody, marginTop: 3, lineHeight: 22 },
    crit: { fontSize: 13, color: c.warning, marginTop: 4, fontWeight: '600' },
    safetyFooter: {
      fontSize: 12,
      color: c.textSubtle,
      marginTop: 8,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
