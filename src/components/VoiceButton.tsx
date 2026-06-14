/**
 * VoiceButton — bas-konuş ses kaydı (expo-audio). Basılı tutarken kaydeder,
 * bırakınca kaydı durdurup store.listen(uri)'ye verir. KURAL: servisi doğrudan
 * çağırmaz; yalnızca store action'ını tetikler (screens → state → services).
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { RecordingPresets, requestRecordingPermissionsAsync, useAudioRecorder } from 'expo-audio';

import { useCookingStore } from '../state/cookingStore';
import { t } from '../i18n';

export function VoiceButton() {
  // RecordingPresets dizin imzasıyla tiplenmiş; sabit ön ayar her zaman mevcut.
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY!);
  const listening = useCookingStore((s) => s.listening);
  const listen = useCookingStore((s) => s.listen);
  const [recording, setRecording] = useState(false);

  async function start(): Promise<void> {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) return;
    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecording(true);
  }

  async function finish(): Promise<void> {
    if (!recording) return;
    setRecording(false);
    await recorder.stop();
    const uri = recorder.uri;
    if (uri) await listen(uri);
  }

  const active = recording || listening;
  const label = recording ? t('cooking.listening') : listening ? '…' : t('cooking.listen');

  return (
    <Pressable
      onPressIn={() => void start()}
      onPressOut={() => void finish()}
      style={[styles.mic, active && styles.micActive]}
    >
      <Text style={styles.micText}>🎙 {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mic: {
    marginTop: 28,
    backgroundColor: '#2B2B2B',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  micActive: { backgroundColor: '#B5300F' },
  micText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
