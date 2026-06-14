/**
 * cookingStore — uygulamanın durum makinesi (CLAUDE.md → State Machine).
 *
 * RecipeEngine'i (saf motor) Zustand'a sarar ve servisleri (stt/tts/vision/
 * intent) buraya bağlar. KURAL: screens asla servisleri doğrudan çağırmaz;
 * yalnızca buradaki action'ları çağırır.
 */
import { create } from 'zustand';

import {
  RecipeEngine,
  SafetyError,
  safeCookingAdvice,
  type EngineSnapshot,
  type Recipe,
} from '../engine';
import type { Services, VisionResult } from '../services/types';
import { createMockServices } from '../services/mock';
import { INTENT_CONFIDENCE_THRESHOLD } from '../config';

interface CookingState {
  // --- durum ---
  engine: RecipeEngine | null;
  recipe: Recipe | null;
  snapshot: EngineSnapshot | null;
  services: Services;
  /** Kullanıcının odaklandığı düğüm. */
  currentNodeId: string | null;
  listening: boolean;
  lastSpoken: string | null;
  lastVision: VisionResult | null;
  /** Güvenlik nedeniyle engellenen eylem için kullanıcıya not. */
  safetyNotice: string | null;

  // --- action'lar ---
  loadRecipe: (recipe: Recipe) => void;
  startCooking: () => void;
  focus: (nodeId: string) => void;
  startNode: (nodeId: string) => Promise<void>;
  completeNode: (nodeId: string) => Promise<void>;
  skipNode: (nodeId: string) => Promise<void>;
  retryNode: (nodeId: string) => void;
  failNode: (nodeId: string) => void;
  /** Ses kaydını dinle → metne çevir → niyet işle. */
  listen: (audioUri: string) => Promise<void>;
  /** Metni doğrudan niyet olarak işle (test/klavye girişi). */
  handleUtterance: (text: string) => Promise<void>;
  /** Frame-on-demand: tek kare çek → Vision gözlem + öneri (asla hüküm). */
  checkPot: (imageUri: string) => Promise<void>;
  /** Zamanlayıcıları ilerlet; süresi dolan timer düğümlerini tamamlar. */
  tick: () => void;
  speak: (text: string, interrupt?: boolean) => Promise<void>;
}

export const useCookingStore = create<CookingState>((set, get) => ({
  engine: null,
  recipe: null,
  snapshot: null,
  services: createMockServices(),
  currentNodeId: null,
  listening: false,
  lastSpoken: null,
  lastVision: null,
  safetyNotice: null,

  loadRecipe: (recipe) => {
    const engine = new RecipeEngine(recipe);
    set({ engine, recipe, snapshot: engine.snapshot(), currentNodeId: null, safetyNotice: null });
  },

  startCooking: () => {
    const { engine } = get();
    if (!engine) return;
    const snap = engine.snapshot();
    const first = snap.ready[0] ?? null;
    set({ snapshot: snap, currentNodeId: first });
    if (first) void get().startNode(first);
  },

  focus: (nodeId) => set({ currentNodeId: nodeId, safetyNotice: null }),

  startNode: async (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    const snapshot = engine.start(nodeId);
    set({ snapshot, currentNodeId: nodeId, safetyNotice: null });
    const node = engine.node(nodeId);
    if (node.voice_on_enter) await get().speak(node.voice_on_enter);
  },

  completeNode: async (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    const node = engine.node(nodeId);
    const snapshot = engine.complete(nodeId);
    if (node.voice_on_complete) await get().speak(node.voice_on_complete);
    // Odağı bir sonraki hazır adıma taşı; bittiyse kutla.
    const nextId = snapshot.ready[0] ?? null;
    set({ snapshot, currentNodeId: nextId, safetyNotice: null });
    if (snapshot.complete) {
      await get().speak('Yemek hazır, afiyet olsun!');
    } else if (nextId) {
      await get().startNode(nextId);
    }
  },

  skipNode: async (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    try {
      const snapshot = engine.skip(nodeId);
      const nextId = snapshot.ready[0] ?? get().currentNodeId;
      set({ snapshot, currentNodeId: nextId, safetyNotice: null });
    } catch (err) {
      if (err instanceof SafetyError) {
        set({ safetyNotice: err.message });
        await get().speak(err.message, true);
      } else {
        throw err;
      }
    }
  },

  retryNode: (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    set({ snapshot: engine.retry(nodeId), safetyNotice: null });
  },

  failNode: (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    set({ snapshot: engine.fail(nodeId) });
  },

  listen: async (audioUri) => {
    set({ listening: true });
    try {
      const text = await get().services.stt.transcribe(audioUri);
      await get().handleUtterance(text);
    } finally {
      set({ listening: false });
    }
  },

  handleUtterance: async (text) => {
    const { engine, currentNodeId, services } = get();
    if (!engine) return;
    const node = currentNodeId ? engine.node(currentNodeId) : undefined;
    const intent = await services.intent.parse(text, {
      currentNodeId: currentNodeId ?? undefined,
      recoveryKeys: node?.recovery_rules ? Object.keys(node.recovery_rules) : [],
    });

    if (intent.confidence < INTENT_CONFIDENCE_THRESHOLD && intent.kind === 'unknown') {
      await get().speak('Tam anlayamadım, tekrar söyler misin?');
      return;
    }

    switch (intent.kind) {
      case 'next':
        if (currentNodeId) await get().completeNode(currentNodeId);
        break;
      case 'repeat':
        if (node) await get().speak(node.instruction);
        break;
      case 'how_long': {
        const active = engine.snapshot().active.find((id) => engine.remainingSec(id) != null);
        const remaining = active ? engine.remainingSec(active) : null;
        await get().speak(
          remaining != null ? `Yaklaşık ${remaining} saniye kaldı.` : 'Şu an süreli bir iş yok.',
        );
        break;
      }
      case 'what_now': {
        const snap = engine.snapshot();
        const next = snap.ready[0] ?? snap.active[0];
        await get().speak(next ? engine.node(next).instruction : 'Şu an yapılacak hazır adım yok.');
        break;
      }
      case 'check':
        await get().speak('Telefonu tencereye doğrult, fotoğrafı çekiyorum.');
        break;
      case 'recovery': {
        const advice = intent.recoveryKey && node?.recovery_rules?.[intent.recoveryKey];
        await get().speak(advice || 'Merak etme, hallederiz. Ateşi biraz kıs ve bana anlat.');
        break;
      }
      case 'pause':
        await get().services.tts.stop();
        break;
      default:
        await get().speak('Tam anlayamadım, tekrar söyler misin?');
    }
  },

  checkPot: async (imageUri) => {
    const { engine, currentNodeId, services } = get();
    const node = currentNodeId && engine ? engine.node(currentNodeId) : undefined;
    const result = await services.vision.analyze(imageUri, node?.instruction ?? '');
    set({ lastVision: result });
    // GIDA GÜVENLİĞİ: kritik adımda asla onay verme — temkinli öneriye düş.
    if (node?.safety?.critical) {
      await get().speak(`${result.observation} ${safeCookingAdvice('eggDishes')}`);
    } else {
      await get().speak(`${result.observation} ${result.suggestion}`);
    }
  },

  tick: () => {
    const { engine } = get();
    if (!engine) return;
    const snap = engine.snapshot();
    let changed = false;
    for (const id of snap.active) {
      if (engine.node(id).completion === 'timer' && engine.isExpired(id)) {
        engine.complete(id);
        changed = true;
      }
    }
    if (changed) set({ snapshot: engine.snapshot() });
  },

  speak: async (text, interrupt = false) => {
    set({ lastSpoken: text });
    await get().services.tts.speak(text, { interrupt });
  },
}));
