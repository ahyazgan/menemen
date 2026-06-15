/**
 * SettingsScreen — dil, tema, abonelik (geri yükle), veri temizleme ve gizlilik
 * tek yerde. Sadece UI; iş store'lardan (uiStore/subscriptionStore) ve
 * resetUserData yardımcısından geçer.
 */
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AVAILABLE_LOCALES, t } from '../i18n';
import { useUiStore, useThemeColors, type VoiceRate } from '../state/uiStore';
import { useSubscriptionStore } from '../state/subscriptionStore';
import { useCookingStore } from '../state/cookingStore';
import { resetUserData } from '../state/reset';
import { APP_VERSION } from '../config';
import type { ThemeColors } from '../config/theme';

const RATES: readonly VoiceRate[] = ['slow', 'normal', 'fast'];

function rateLabel(rate: VoiceRate): string {
  if (rate === 'slow') return t('settings.rateSlow');
  if (rate === 'fast') return t('settings.rateFast');
  return t('settings.rateNormal');
}

export function SettingsScreen({
  onBack,
  onOpenPrivacy,
}: {
  onBack: () => void;
  onOpenPrivacy: () => void;
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const voiceEnabled = useUiStore((s) => s.voiceEnabled);
  const setVoiceEnabled = useUiStore((s) => s.setVoiceEnabled);
  const voiceRate = useUiStore((s) => s.voiceRate);
  const setVoiceRate = useUiStore((s) => s.setVoiceRate);
  const speak = useCookingStore((s) => s.speak);
  const subscribed = useSubscriptionStore((s) => s.subscribed);
  const restore = useSubscriptionStore((s) => s.restore);
  const [restored, setRestored] = useState(false);
  const [cleared, setCleared] = useState(false);

  function onRestore(): void {
    void restore().then(() => {
      setRestored(true);
      setTimeout(() => setRestored(false), 2000);
    });
  }

  function onClear(): void {
    Alert.alert(t('settings.clearConfirmTitle'), t('settings.clearConfirmMessage'), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.clearConfirm'),
        style: 'destructive',
        onPress: () =>
          void resetUserData().then(() => {
            setCleared(true);
            setTimeout(() => setCleared(false), 2000);
          }),
      },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <Text style={styles.section}>{t('settings.language')}</Text>
      <View style={styles.row}>
        {AVAILABLE_LOCALES.map((code) => (
          <Pressable
            key={code}
            style={[styles.pill, locale === code && styles.pillOn]}
            onPress={() => setLocale(code)}
          >
            <Text style={[styles.pillText, locale === code && styles.pillTextOn]}>
              {code.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>{t('settings.theme')}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.pill, theme === 'light' && styles.pillOn]}
          onPress={() => void setTheme('light')}
        >
          <Text style={[styles.pillText, theme === 'light' && styles.pillTextOn]}>
            ☀️ {t('settings.themeLight')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.pill, theme === 'dark' && styles.pillOn]}
          onPress={() => void setTheme('dark')}
        >
          <Text style={[styles.pillText, theme === 'dark' && styles.pillTextOn]}>
            🌙 {t('settings.themeDark')}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.section}>{t('settings.voice')}</Text>
      <Text style={styles.hint}>{t('settings.voiceHint')}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.pill, voiceEnabled && styles.pillOn]}
          onPress={() => void setVoiceEnabled(true)}
        >
          <Text style={[styles.pillText, voiceEnabled && styles.pillTextOn]}>
            {t('settings.voiceOn')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.pill, !voiceEnabled && styles.pillOn]}
          onPress={() => void setVoiceEnabled(false)}
        >
          <Text style={[styles.pillText, !voiceEnabled && styles.pillTextOn]}>
            {t('settings.voiceOff')}
          </Text>
        </Pressable>
      </View>
      {voiceEnabled && (
        <>
          <View style={[styles.row, styles.rowGap]}>
            {RATES.map((r) => (
              <Pressable
                key={r}
                style={[styles.pill, voiceRate === r && styles.pillOn]}
                onPress={() => void setVoiceRate(r)}
              >
                <Text style={[styles.pillText, voiceRate === r && styles.pillTextOn]}>
                  {rateLabel(r)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.action}
            onPress={() => void speak(t('settings.voiceSample'), true)}
          >
            <Text style={styles.actionText}>{t('settings.testVoice')}</Text>
          </Pressable>
        </>
      )}

      <Text style={styles.section}>{t('settings.subscription')}</Text>
      <Text style={styles.status}>
        {subscribed ? t('settings.subscribedBadge') : t('settings.notSubscribed')}
      </Text>
      <Pressable style={styles.action} onPress={onRestore}>
        <Text style={styles.actionText}>
          {restored ? t('settings.restoreDone') : t('settings.restore')}
        </Text>
      </Pressable>

      <Text style={styles.section}>{t('settings.legal')}</Text>
      <Pressable style={styles.action} onPress={onOpenPrivacy}>
        <Text style={styles.actionText}>{t('settings.privacy')}</Text>
      </Pressable>

      <Text style={styles.section}>{t('settings.data')}</Text>
      <Pressable style={[styles.action, styles.danger]} onPress={onClear}>
        <Text style={styles.dangerText}>
          {cleared ? t('settings.cleared') : t('settings.clearData')}
        </Text>
      </Pressable>

      <Text style={styles.version}>
        {t('settings.version')} {APP_VERSION} · {t('settings.support')}: a.hakan_@hotmail.com
      </Text>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    title: { fontSize: 30, fontWeight: '800', color: c.primary, marginBottom: 8 },
    section: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
      marginTop: 22,
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    rowGap: { marginTop: 10 },
    hint: { fontSize: 13, color: c.textSubtle, marginBottom: 10, lineHeight: 19 },
    pill: {
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 18,
      paddingVertical: 10,
    },
    pillOn: { backgroundColor: c.primary, borderColor: c.primary },
    pillText: { color: c.textBody, fontSize: 14, fontWeight: '700' },
    pillTextOn: { color: c.onPrimary },
    status: { fontSize: 15, color: c.textBody, marginBottom: 10 },
    action: {
      backgroundColor: c.fill,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginTop: 4,
    },
    actionText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    danger: { backgroundColor: c.warningBg },
    dangerText: { color: c.primary, fontSize: 15, fontWeight: '700' },
    version: {
      fontSize: 13,
      color: c.textSubtle,
      marginTop: 28,
      textAlign: 'center',
      lineHeight: 19,
    },
  });
