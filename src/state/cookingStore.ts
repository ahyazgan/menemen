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
  buildTimerNotification,
  isTimerNode,
  localize,
  safeCookingAdvice,
  timerNotificationId,
  type EngineSnapshot,
  type Recipe,
} from '../engine';
import type { Services, VisionResult } from '../services/types';
import { createMockServices } from '../services/mock';
import { createMockNotify } from '../services/notify';
import type { NotificationService } from '../services/notify';
import { INTENT_CONFIDENCE_THRESHOLD } from '../config';
import { getLocale, t } from '../i18n';

interface CookingState {
  // --- durum ---
  engine: RecipeEngine | null;
  recipe: Recipe | null;
  snapshot: EngineSnapshot | null;
  services: Services;
  notify: NotificationService;
  /** Kullanıcının odaklandığı düğüm. */
  currentNodeId: string | null;
  listening: boolean;
  lastSpoken: string | null;
  lastVision: VisionResult | null;
  /** Güvenlik nedeniyle engellenen eylem için kullanıcıya not. */
  safetyNotice: string | null;

  // --- action'lar ---
  /** Servisleri değiştir (mock → gerçek geçişi; bkz. services/real). */
  setServices: (services: Services) => void;
  /** Bildirim servisini değiştir (mock → expo; bkz. services/notify). */
  setNotify: (notify: NotificationService) => void;
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
  notify: createMockNotify(),
  currentNodeId: null,
  listening: false,
  lastSpoken: null,
  lastVision: null,
  safetyNotice: null,

  setServices: (services) => set({ services }),
  setNotify: (notify) => set({ notify }),

  loadRecipe: (recipe) => {
    const engine = new RecipeEngine(recipe);
    set({ engine, recipe, snapshot: engine.snapshot(), currentNodeId: null, safetyNotice: null });
  },

  startCooking: () => {
    const { engine } = get();
    if (!engine) return;
    void get().notify.requestPermission();
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
    const locale = getLocale();
    // Süreli adım: arka planda/ekran kapalıyken uyarması için bildirim planla.
    if (isTimerNode(node)) {
      const body = node.voice_on_complete
        ? localize(node.voice_on_complete, locale)
        : t('notify.timerDone');
      const notice = buildTimerNotification(
        node,
        locale,
        body,
        engine.remainingSec(nodeId) ?? undefined,
      );
      void get().notify.schedule(notice);
    }
    if (node.voice_on_enter) await get().speak(localize(node.voice_on_enter, locale));
  },

  completeNode: async (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    const node = engine.node(nodeId);
    const snapshot = engine.complete(nodeId);
    void get().notify.cancel(timerNotificationId(nodeId)); // erken bitti → bildirimi iptal et
    if (node.voice_on_complete) await get().speak(localize(node.voice_on_complete, getLocale()));
    // Odağı bir sonraki hazır adıma taşı; bittiyse kutla.
    const nextId = snapshot.ready[0] ?? null;
    set({ snapshot, currentNodeId: nextId, safetyNotice: null });
    if (snapshot.complete) {
      await get().speak(t('cooking.finished'));
    } else if (nextId) {
      await get().startNode(nextId);
    }
  },

  skipNode: async (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    try {
      const snapshot = engine.skip(nodeId);
      void get().notify.cancel(timerNotificationId(nodeId));
      const nextId = snapshot.ready[0] ?? get().currentNodeId;
      set({ snapshot, currentNodeId: nextId, safetyNotice: null });
    } catch (err) {
      if (err instanceof SafetyError) {
        // Kullanıcıya gösterilecek metni güvenlik kuralından localize et.
        const message =
          localize(engine.node(nodeId).safety?.message, getLocale()) || t('safety.cannotSkip');
        set({ safetyNotice: message });
        await get().speak(message, true);
      } else {
        throw err;
      }
    }
  },

  retryNode: (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    void get().notify.cancel(timerNotificationId(nodeId));
    set({ snapshot: engine.retry(nodeId), safetyNotice: null });
  },

  failNode: (nodeId) => {
    const { engine } = get();
    if (!engine) return;
    void get().notify.cancel(timerNotificationId(nodeId));
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

    const locale = getLocale();

    if (intent.confidence < INTENT_CONFIDENCE_THRESHOLD && intent.kind === 'unknown') {
      await get().speak(t('intent.unknown'));
      return;
    }

    switch (intent.kind) {
      case 'next':
        if (currentNodeId) await get().completeNode(currentNodeId);
        break;
      case 'repeat':
        if (node) await get().speak(localize(node.instruction, locale));
        break;
      case 'how_long': {
        const active = engine.snapshot().active.find((id) => engine.remainingSec(id) != null);
        const remaining = active ? engine.remainingSec(active) : null;
        await get().speak(
          remaining != null ? `${remaining} ${t('voice.secondsLeft')}` : t('voice.noTimer'),
        );
        break;
      }
      case 'what_now': {
        const snap = engine.snapshot();
        const next = snap.ready[0] ?? snap.active[0];
        await get().speak(
          next ? localize(engine.node(next).instruction, locale) : t('cooking.nothingReady'),
        );
        break;
      }
      case 'check':
        await get().speak(t('voice.checkPrompt'));
        break;
      case 'recovery': {
        const advice = intent.recoveryKey ? node?.recovery_rules?.[intent.recoveryKey] : undefined;
        await get().speak(advice ? localize(advice, locale) : t('voice.recoveryDefault'));
        break;
      }
      case 'pause':
        await get().services.tts.stop();
        break;
      default:
        await get().speak(t('intent.unknown'));
    }
  },

  checkPot: async (imageUri) => {
    const { engine, currentNodeId, services } = get();
    const node = currentNodeId && engine ? engine.node(currentNodeId) : undefined;
    const prompt = node ? localize(node.instruction, getLocale()) : '';
    const result = await services.vision.analyze(imageUri, prompt);
    set({ lastVision: result });
    // GIDA GÜVENLİĞİ: kritik adımda asla onay verme — temkinli öneriye düş.
    if (node?.safety?.critical) {
      await get().speak(`${result.observation} ${safeCookingAdvice('eggDishes', getLocale())}`);
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
        // Önplandayken motor tamamladı → planlı bildirimi iptal et (çift uyarma).
        void get().notify.cancel(timerNotificationId(id));
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
