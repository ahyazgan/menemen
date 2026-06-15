/**
 * VoiceButton — bas-konuş sesli komut. Önce **cihaz-içi canlı tanıma**
 * (@react-native-voice; dev-client) denenir; ara sonuçlar gösterilir, bırakınca
 * son metin store.handleUtterance'a verilir. Canlı tanıma yoksa (Expo Go) eski
 * **kayıt → store.listen(uri)** yoluna düşülür. KURAL: servisi doğrudan çağırmaz;
 * yalnızca store action'larını tetikler (screens → state → services).
 */
import { useMemo, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { RecordingPresets, requestRecordingPermissionsAsync, useAudioRecorder } from 'expo-audio';

import { useCookingStore } from '../state/cookingStore';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { createVoiceRecognizer } from '../services/stt';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';

export function VoiceButton() {
  // RecordingPresets dizin imzasıyla tiplenmiş; sabit ön ayar her zaman mevcut.
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY!);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const locale = useUiStore((s) => s.locale);
  const listening = useCookingStore((s) => s.listening);
  const listen = useCookingStore((s) => s.listen);
  const handleUtterance = useCookingStore((s) => s.handleUtterance);
  const recognizer = useRef(createVoiceRecognizer());
  const liveActive = useRef(false);
  const [recording, setRecording] = useState(false);
  const [denied, setDenied] = useState(false);
  const [partial, setPartial] = useState('');

  async function start(): Promise<void> {
    setDenied(false);
    setPartial('');
    // 1) Cihaz-içi canlı tanıma (dev-client). Başarısızsa kayıt yedeğine düş.
    try {
      await recognizer.current.start({ locale, onPartial: setPartial });
      liveActive.current = true;
      setRecording(true);
      return;
    } catch {
      liveActive.current = false;
    }
    // 2) Yedek: ses kaydı → store.listen (mock/cloud STT).
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setDenied(true);
      return;
    }
    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecording(true);
  }

  async function finish(): Promise<void> {
    if (!recording) return;
    setRecording(false);
    if (liveActive.current) {
      liveActive.current = false;
      const text = await recognizer.current.stop();
      setPartial('');
      if (text.trim()) await handleUtterance(text);
      return;
    }
    await recorder.stop();
    const uri = recorder.uri;
    if (uri) await listen(uri);
  }

  const active = recording || listening;
  const label = recording ? t('cooking.listening') : listening ? '…' : t('cooking.listen');

  return (
    <View>
      <Pressable
        onPressIn={() => void start()}
        onPressOut={() => void finish()}
        style={[styles.mic, active && styles.micActive]}
        accessibilityRole="button"
        accessibilityLabel={t('cooking.listen')}
      >
        <Text style={styles.micText}>🎙 {label}</Text>
      </Pressable>
      {partial.length > 0 && <Text style={styles.partial}>“{partial}”</Text>}
      {denied && (
        <View style={styles.deniedRow}>
          <Text style={styles.deniedText}>{t('cooking.micDenied')}</Text>
          <Pressable
            onPress={() => void Linking.openSettings()}
            accessibilityRole="button"
            accessibilityLabel={t('cooking.openSettings')}
          >
            <Text style={styles.deniedLink}>{t('cooking.openSettings')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    mic: {
      marginTop: 28,
      backgroundColor: c.accent,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    micActive: { backgroundColor: c.primary },
    micText: { color: c.onAccent, fontSize: 17, fontWeight: '600' },
    partial: { marginTop: 8, color: c.textMuted, fontStyle: 'italic', textAlign: 'center' },
    deniedRow: { marginTop: 8, alignItems: 'center' },
    deniedText: { color: c.warning, fontSize: 13, textAlign: 'center', lineHeight: 18 },
    deniedLink: { color: c.primary, fontSize: 14, fontWeight: '700', marginTop: 4 },
  });
