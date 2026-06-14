/**
 * expo-image-picker tabanlı tek kare çekimi (frame-on-demand). Kullanıcı bir
 * adıma fotoğraf eklemek isteyince kamerayı açar; sürekli akış YOK (CLAUDE.md:
 * kamera yalnızca kullanıcı isteyince).
 */
import * as ImagePicker from 'expo-image-picker';

import type { PhotoService } from './types';

export function createExpoPhoto(): PhotoService {
  return {
    async requestPermission(): Promise<boolean> {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      return granted;
    },
    async capture(): Promise<string | null> {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.6,
        allowsEditing: false,
      });
      if (result.canceled) return null;
      return result.assets[0]?.uri ?? null;
    },
  };
}
