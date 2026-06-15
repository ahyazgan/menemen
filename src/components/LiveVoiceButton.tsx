/**
 * LiveVoiceButton — canlı (full-duplex) ses modu kontrolü. CLAUDE.md: yalnızca
 * `liveVoice` flag'i açıkken görünür (v1'de KAPALI). Sadece UI; tüm iş
 * voiceSessionStore action'larından geçer (screens servis çağırmaz).
 *
 * GİZLİLİK: Canlı modda mikrofon sürekli açıktır → net gösterge + tek dokunuş
 * sustur + bitir. Bas-konuş (VoiceButton) varsayılan kalır; bu opt-in bir moddur.
 */
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useVoiceSessionStore } from '../state/voiceSessionStore';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { Recipe, RecipeNode } from '../engine/types';

interface Props {
  recipe: Recipe;
  currentNode: RecipeNode | null;
}

export function LiveVoiceButton({ recipe, currentNode }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const locale = useUiStore((s) => s.locale);
  const conn = useVoiceSessionStore((s) => s.session.conn);
  const muted = useVoiceSessionStore((s) => s.session.muted);
  const agentSpeaking = useVoiceSessionStore((s) => s.session.agentSpeaking);
  const lastTurn = useVoiceSessionStore((s) => s.lastTurn);
  const start = useVoiceSessionStore((s) => s.start);
  const stop = useVoiceSessionStore((s) => s.stop);
  const toggleMuted = useVoiceSessionStore((s) => s.toggleMuted);
  const updateContext = useVoiceSessionStore((s) => s.updateContext);

  const context = useMemo(
    () => ({
      recipeId: recipe.id,
      recipeTitle: localize(recipe.title, locale),
      currentStep: currentNode ? localize(currentNode.instruction, locale) : undefined,
      locale,
    }),
    [recipe, currentNode, locale],
  );

  // Aktif adım değişince ajana güncel bağlamı ilet (yalnızca canlıyken).
  useEffect(() => {
    if (conn === 'live') void updateContext(context);
  }, [conn, context, updateContext]);

  // Ekrandan ayrılınca oturumu kapat (mikrofon açık kalmasın).
  useEffect(() => () => void stop(), [stop]);

  const isLive = conn === 'live' || conn === 'reconnecting';
  const isBusy = conn === 'connecting';

  if (!isLive && !isBusy) {
    return (
      <View style={styles.wrap}>
        <Pressable
          style={styles.startBtn}
          onPress={() => void start(context)}
          accessibilityRole="button"
          accessibilityLabel={t('live.start')}
        >
          <Text style={styles.startText}>{t('live.start')}</Text>
        </Pressable>
        <Text style={styles.hint}>{t('live.hint')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.liveCard}>
      <View style={styles.liveHeader}>
        <View style={[styles.dot, agentSpeaking ? styles.dotSpeaking : styles.dotLive]} />
        <Text style={styles.liveLabel}>
          {conn === 'reconnecting'
            ? t('live.reconnecting')
            : agentSpeaking
              ? t('live.agentSpeaking')
              : t('live.listening')}
        </Text>
      </View>

      {lastTurn && (
        <Text style={styles.turn} numberOfLines={2}>
          {lastTurn.text}
        </Text>
      )}

      <View style={styles.row}>
        <Pressable
          style={[styles.ctrl, muted && styles.ctrlOn]}
          onPress={() => void toggleMuted()}
          accessibilityRole="button"
          accessibilityLabel={muted ? t('live.unmute') : t('live.mute')}
        >
          <Text style={[styles.ctrlText, muted && styles.ctrlTextOn]}>
            {muted ? t('live.unmute') : t('live.mute')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.ctrl, styles.endBtn]}
          onPress={() => void stop()}
          accessibilityRole="button"
          accessibilityLabel={t('live.end')}
        >
          <Text style={styles.endText}>{t('live.end')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { marginTop: 16, alignItems: 'center' },
    startBtn: {
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    startText: { color: c.onAccent, fontSize: 16, fontWeight: '800' },
    hint: { color: c.textSubtle, fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 18 },
    liveCard: {
      marginTop: 16,
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.accent,
      padding: 16,
    },
    liveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    dotLive: { backgroundColor: c.success },
    dotSpeaking: { backgroundColor: c.accent },
    liveLabel: { fontSize: 15, fontWeight: '700', color: c.text },
    turn: { fontSize: 15, color: c.textBody, marginTop: 10, lineHeight: 21, fontStyle: 'italic' },
    row: { flexDirection: 'row', gap: 10, marginTop: 14 },
    ctrl: {
      flex: 1,
      backgroundColor: c.fill,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    ctrlOn: { backgroundColor: c.warningBg },
    ctrlText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    ctrlTextOn: { color: c.warning },
    endBtn: { backgroundColor: c.primary },
    endText: { color: c.onPrimary, fontSize: 15, fontWeight: '800' },
  });
