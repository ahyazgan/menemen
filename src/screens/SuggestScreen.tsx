/**
 * SuggestScreen — "Bana özel öner" (CLAUDE.md değer #1: ne pişeceğine karar).
 * Kullanıcı canının ne çektiğini yazar; profiline göre ONAYLI tariflerden biri
 * önerilir. Sadece UI: öneri recommendStore'dan, mantık saf/servis arkasında.
 */
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { recipeList, getRecipe } from '../recipes';
import { recipeDifficulty } from '../recipes/profile';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useProfileStore } from '../state/profileStore';
import { useRecommendStore } from '../state/recommendStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { Recipe } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
  onBack: () => void;
}

export function SuggestScreen({ onSelect, onBack }: Props) {
  const locale = useUiStore((s) => s.locale);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const profile = useProfileStore((s) => s.profile);
  const loading = useRecommendStore((s) => s.loading);
  const error = useRecommendStore((s) => s.error);
  const result = useRecommendStore((s) => s.result);
  const suggest = useRecommendStore((s) => s.suggest);
  const reset = useRecommendStore((s) => s.reset);
  const [craving, setCraving] = useState('');

  const suggested = result?.recipeId ? getRecipe(result.recipeId) : null;

  function onGo(): void {
    void suggest({ craving, locale, profile, candidates: recipeList });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('suggest.title')}</Text>
      <Text style={styles.subtitle}>{t('suggest.subtitle')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('suggest.placeholder')}
        placeholderTextColor={colors.placeholder}
        value={craving}
        onChangeText={setCraving}
        multiline
      />

      <Pressable
        style={[styles.go, loading && styles.goDisabled]}
        onPress={onGo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.goText}>{t('suggest.go')}</Text>
        )}
      </Pressable>

      {loading && <Text style={styles.thinking}>{t('suggest.thinking')}</Text>}

      {!loading && error && <Text style={styles.none}>{t('suggest.error')}</Text>}

      {!loading &&
        !error &&
        result &&
        (suggested ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{localize(suggested.title, locale)}</Text>
            {suggested.summary && (
              <Text style={styles.resultSummary}>{localize(suggested.summary, locale)}</Text>
            )}
            <Text style={styles.resultMeta}>
              {suggested.totalMinutes != null
                ? `${suggested.totalMinutes} ${t('picker.minutes')} · `
                : ''}
              {suggested.servings} {t('picker.servings')} ·{' '}
              {t(`difficulty.${recipeDifficulty(suggested)}`)}
            </Text>

            <Text style={styles.reasonLabel}>{t('suggest.reason')}</Text>
            <Text style={styles.reason}>{result.reason ?? t('suggest.defaultReason')}</Text>

            <Pressable style={styles.cook} onPress={() => onSelect(suggested)}>
              <Text style={styles.cookText}>{t('suggest.cook')}</Text>
            </Pressable>
            <Pressable style={styles.again} onPress={reset}>
              <Text style={styles.againText}>{t('suggest.again')}</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.none}>{t('suggest.none')}</Text>
        ))}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    title: { fontSize: 28, fontWeight: '800', color: c.primary },
    subtitle: { fontSize: 15, color: c.textMuted, marginTop: 6, marginBottom: 16, lineHeight: 21 },
    input: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 14,
      fontSize: 16,
      color: c.text,
      minHeight: 64,
      textAlignVertical: 'top',
    },
    go: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 14,
    },
    goDisabled: { opacity: 0.7 },
    goText: { color: c.onPrimary, fontSize: 17, fontWeight: '700' },
    thinking: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 14,
      fontStyle: 'italic',
    },
    resultCard: {
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 20,
      marginTop: 22,
    },
    resultTitle: { fontSize: 22, fontWeight: '800', color: c.text },
    resultSummary: { fontSize: 15, color: c.textBody, marginTop: 6, lineHeight: 21 },
    resultMeta: { fontSize: 13, color: c.textSubtle, marginTop: 10 },
    reasonLabel: {
      fontSize: 12,
      color: c.label,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginTop: 16,
    },
    reason: { fontSize: 16, color: c.textBody, marginTop: 6, lineHeight: 23 },
    cook: {
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 18,
    },
    cookText: { color: c.onAccent, fontSize: 16, fontWeight: '700' },
    again: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
    againText: { color: c.textMuted, fontSize: 15, fontWeight: '600' },
    none: { fontSize: 16, color: c.textMuted, marginTop: 22, lineHeight: 22 },
  });
