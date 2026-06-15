/**
 * stepPhotosStore — adım fotoğraflarını reaktif tutar, KeyValueStore ile
 * kalıcılaştırır ve PhotoService ile tek kare çeker. Saf harita mantığı
 * recipes/stepPhotos.ts'te ve testli; burada yalnızca durum + servis bağlama var.
 */
import { create } from 'zustand';

import {
  parseStepPhotos,
  serializeStepPhotos,
  setStepPhoto,
  removeStepPhoto,
  type StepPhotos,
} from '../recipes/stepPhotos';
import { createMemoryStore, type KeyValueStore } from '../services/storage';
import { createMockPhoto, type PhotoService } from '../services/photo';

const KEY = 'lezzet.stepPhotos';

interface StepPhotosState {
  store: KeyValueStore;
  photo: PhotoService;
  map: StepPhotos;
  setStore: (store: KeyValueStore) => void;
  setPhoto: (photo: PhotoService) => void;
  load: () => Promise<void>;
  /** Adıma fotoğraf çek (izin + tek kare); başarılıysa kaydeder. */
  capture: (recipeId: string, nodeId: string) => Promise<void>;
  /** Hazır bir görüntü URI'sini adım fotoğrafı olarak kaydet (ör. tencere kontrolü karesi). */
  setUri: (recipeId: string, nodeId: string, uri: string) => Promise<void>;
  /** Adımın fotoğrafını sil. */
  remove: (recipeId: string, nodeId: string) => Promise<void>;
}

export const useStepPhotosStore = create<StepPhotosState>((set, get) => ({
  store: createMemoryStore(),
  photo: createMockPhoto(null),
  map: {},

  setStore: (store) => set({ store }),
  setPhoto: (photo) => set({ photo }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ map: parseStepPhotos(raw) });
  },

  capture: async (recipeId, nodeId) => {
    const { photo } = get();
    const granted = await photo.requestPermission();
    if (!granted) return;
    const uri = await photo.capture();
    if (!uri) return;
    const map = setStepPhoto(get().map, recipeId, nodeId, uri);
    set({ map });
    await get().store.setItem(KEY, serializeStepPhotos(map));
  },

  setUri: async (recipeId, nodeId, uri) => {
    const map = setStepPhoto(get().map, recipeId, nodeId, uri);
    set({ map });
    await get().store.setItem(KEY, serializeStepPhotos(map));
  },

  remove: async (recipeId, nodeId) => {
    const map = removeStepPhoto(get().map, recipeId, nodeId);
    set({ map });
    await get().store.setItem(KEY, serializeStepPhotos(map));
  },
}));
