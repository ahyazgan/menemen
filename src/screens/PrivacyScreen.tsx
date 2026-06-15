/**
 * PrivacyScreen — uygulama içi gizlilik özeti (mağaza erişilebilir link şartı).
 * Tam politika PRIVACY.md'de; burada kullanıcıya net bir özet gösterilir.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useThemeColors } from '../state/uiStore';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('privacy.title')}</Text>
      <Text style={styles.intro}>{t('privacy.intro')}</Text>
      {(['p1', 'p2', 'p3', 'p4', 'p5'] as const).map((k) => (
        <Text key={k} style={styles.item}>
          • {t(`privacy.${k}`)}
        </Text>
      ))}
      <Text style={styles.contact}>{t('privacy.contact')}</Text>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    title: { fontSize: 30, fontWeight: '800', color: c.primary, marginBottom: 10 },
    intro: { fontSize: 16, color: c.textBody, lineHeight: 23, marginBottom: 16 },
    item: { fontSize: 15, color: c.textBody, lineHeight: 23, marginBottom: 12 },
    contact: { fontSize: 14, color: c.textMuted, marginTop: 12, fontWeight: '600' },
  });
