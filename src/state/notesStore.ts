/**
 * notesStore — tarife özel notları reaktif tutar ve KeyValueStore ile
 * kalıcılaştırır. Saf harita mantığı recipes/notes.ts'te ve testli.
 */
import { create } from 'zustand';

import { parseNotes, serializeNotes, setNote } from '../recipes/notes';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.notes';

interface NotesState {
  store: KeyValueStore;
  notes: Record<string, string>;
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  setNote: (recipeId: string, text: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  store: createMemoryStore(),
  notes: {},

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ notes: parseNotes(raw) });
  },

  setNote: async (recipeId, text) => {
    const notes = setNote(get().notes, recipeId, text);
    set({ notes });
    await get().store.setItem(KEY, serializeNotes(notes));
  },
}));
