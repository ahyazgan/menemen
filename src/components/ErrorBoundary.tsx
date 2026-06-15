/**
 * ErrorBoundary — bir render hatasında beyaz ekran yerine sıcak bir "tekrar dene"
 * ekranı gösterir (çökme güvenliği). React error boundary'leri sınıf bileşeni
 * olmak zorundadır; yedek arayüz temaya uyumlu fonksiyon bileşeniyle çizilir.
 */
import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../state/uiStore';
import { track } from '../services/analytics';
import { reportError } from '../services/crash';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    track({ name: 'screen_view', screen: 'error' });
    reportError(error, { componentStack: info.componentStack ?? '' });
  }

  reset = (): void => this.setState({ hasError: false });

  override render(): ReactNode {
    if (this.state.hasError) return <ErrorFallback onRetry={this.reset} />;
    return this.props.children;
  }
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>🍳</Text>
      <Text style={styles.title}>{t('error.title')}</Text>
      <Text style={styles.message}>{t('error.message')}</Text>
      <Pressable
        style={styles.retry}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t('error.retry')}
      >
        <Text style={styles.retryText}>{t('error.retry')}</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      flex: 1,
      backgroundColor: c.bg,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    emoji: { fontSize: 48, marginBottom: 16 },
    title: { fontSize: 24, fontWeight: '800', color: c.primary, textAlign: 'center' },
    message: {
      fontSize: 16,
      color: c.textBody,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 23,
    },
    retry: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 28,
      marginTop: 24,
    },
    retryText: { color: c.onPrimary, fontSize: 16, fontWeight: '800' },
  });
