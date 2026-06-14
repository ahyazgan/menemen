/**
 * PotCheckButton — frame-on-demand kamera (CLAUDE.md: sürekli akış YOK).
 * Kamera YALNIZCA kullanıcı "tencereye bak" deyince modalde açılır, tek kare
 * çekilir, store.checkPot(base64)'e verilir ve kamera kapanır.
 */
import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useCookingStore } from '../state/cookingStore';
import { t } from '../i18n';

export function PotCheckButton() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const checkPot = useCookingStore((s) => s.checkPot);
  const cameraRef = useRef<CameraView | null>(null);

  async function openCamera(): Promise<void> {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setOpen(true);
  }

  async function capture(): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      const picture = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.5 });
      setOpen(false);
      if (picture?.base64) {
        await checkPot(`data:image/jpeg;base64,${picture.base64}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Pressable style={styles.checkBtn} onPress={() => void openCamera()}>
        <Text style={styles.checkText}>📷 {t('cooking.check')}</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          {/* Kamera yalnızca modal açıkken monte edilir → frame-on-demand. */}
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.controls}>
            <Pressable style={styles.captureBtn} onPress={() => void capture()}>
              <Text style={styles.captureText}>{t('cooking.capture')}</Text>
            </Pressable>
            <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>{t('cooking.close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  checkBtn: {
    marginTop: 12,
    backgroundColor: '#F0E2D6',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkText: { color: '#8A6D5B', fontSize: 16, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    backgroundColor: '#000',
  },
  captureBtn: { backgroundColor: '#B5300F', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 36 },
  captureText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  closeBtn: { backgroundColor: '#333', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 28 },
  closeText: { color: '#FFF', fontSize: 16 },
});
