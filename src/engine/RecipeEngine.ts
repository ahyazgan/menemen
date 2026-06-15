/**
 * RecipeEngine — tarif grafını yürüten saf durum makinesi (CLAUDE.md → State
 * Machine). React/Expo importu YOK. Tüm zaman `clock` üzerinden enjekte edilir,
 * böylece zamanlayıcılar deterministik olarak test edilebilir.
 *
 * Yetenekler:
 *  - Bağımlılık (`requires`) çözümü ve hazır düğüm hesaplama
 *  - Paralel iş: aynı anda birden çok `active` düğüm
 *  - Zamanlayıcılar: motor tarafından tutulur, `remainingSec` / `isExpired`
 *  - Kurtarma: `fail` → `retry`/`reset`, kritik adımlar atlanamaz
 */
import type { Recipe, RecipeNode, NodeStatus } from './types';
import { assertSkippable } from './foodSafety';

export interface NodeState {
  status: NodeStatus;
  /** active'e geçiş anı (ms epoch), aksi halde null. */
  startedAt: number | null;
  /** done/failed/skipped anı (ms epoch), aksi halde null. */
  finishedAt: number | null;
}

export interface EngineSnapshot {
  recipeId: string;
  states: Record<string, NodeState>;
  ready: string[];
  active: string[];
  done: string[];
  /** Atlanmamış tüm düğümler tamamlandı mı? */
  complete: boolean;
  /** 0..1 arası ilerleme (done / atlanmamış toplam). */
  progress: number;
}

type Clock = () => number;

export class RecipeEngine {
  private readonly recipe: Recipe;
  private readonly clock: Clock;
  private readonly states = new Map<string, NodeState>();
  private readonly byId = new Map<string, RecipeNode>();
  /** Duraklatma başlangıcı (ms epoch); null ise çalışıyor. */
  private pausedAt: number | null = null;

  constructor(recipe: Recipe, clock: Clock = () => Date.now()) {
    this.recipe = recipe;
    this.clock = clock;
    for (const node of recipe.nodes) {
      this.byId.set(node.id, node);
      this.states.set(node.id, { status: 'pending', startedAt: null, finishedAt: null });
    }
    this.validateGraph();
    this.recomputeReady();
  }

  // --- sorgular ------------------------------------------------------------

  get recipeMeta(): Recipe {
    return this.recipe;
  }

  node(id: string): RecipeNode {
    const node = this.byId.get(id);
    if (!node) throw new Error(`Bilinmeyen düğüm: ${id}`);
    return node;
  }

  state(id: string): NodeState {
    const state = this.states.get(id);
    if (!state) throw new Error(`Bilinmeyen düğüm: ${id}`);
    return state;
  }

  /** Bir timer düğümünün kalan süresi (saniye). Süresizse null. */
  remainingSec(id: string, now: number = this.clock()): number | null {
    const node = this.node(id);
    const state = this.state(id);
    if (node.durationSec == null || state.startedAt == null) return null;
    // Duraklatıldıysa zaman durur: kalan süre duraklama anına göre hesaplanır.
    const ref = this.pausedAt ?? now;
    const elapsed = (ref - state.startedAt) / 1000;
    return Math.max(0, Math.ceil(node.durationSec - elapsed));
  }

  /** Süreli, aktif bir düğümün süresi doldu mu? (Duraklatıldıysa dolmaz.) */
  isExpired(id: string, now: number = this.clock()): boolean {
    if (this.pausedAt !== null) return false;
    const remaining = this.remainingSec(id, now);
    return remaining !== null && remaining <= 0 && this.state(id).status === 'active';
  }

  /** Zamanlayıcılar duraklatıldı mı? */
  get isPaused(): boolean {
    return this.pausedAt !== null;
  }

  /** Tüm aktif zamanlayıcıları dondur (kalan süre sabit kalır). */
  pauseTimers(now: number = this.clock()): void {
    if (this.pausedAt === null) this.pausedAt = now;
  }

  /** Zamanlayıcıları sürdür; duraklama süresini aktif düğümlere ekler. */
  resumeTimers(now: number = this.clock()): void {
    if (this.pausedAt === null) return;
    const delta = now - this.pausedAt;
    for (const state of this.states.values()) {
      if (state.status === 'active' && state.startedAt != null) {
        state.startedAt += delta;
      }
    }
    this.pausedAt = null;
  }

  // --- geçişler ------------------------------------------------------------

  /** Hazır bir düğümü başlat (active). Paralel: birden fazla aktif olabilir. */
  start(id: string): EngineSnapshot {
    const state = this.state(id);
    if (state.status !== 'ready') {
      throw new Error(`"${id}" başlatılamaz; durum: ${state.status}`);
    }
    state.status = 'active';
    state.startedAt = this.clock();
    state.finishedAt = null;
    return this.snapshot();
  }

  /** Bir düğümü tamamla. ready ya da active olabilir (auto/hızlı onay). */
  complete(id: string): EngineSnapshot {
    const state = this.state(id);
    if (state.status !== 'active' && state.status !== 'ready') {
      throw new Error(`"${id}" tamamlanamaz; durum: ${state.status}`);
    }
    state.status = 'done';
    state.finishedAt = this.clock();
    this.recomputeReady();
    return this.snapshot();
  }

  /** Bir düğüm ters gitti (kurtarma). Bağımlılar bloklu kalır. */
  fail(id: string): EngineSnapshot {
    const state = this.state(id);
    state.status = 'failed';
    state.finishedAt = this.clock();
    this.recomputeReady();
    return this.snapshot();
  }

  /** Başarısız/aktif bir düğümü yeniden denemek üzere sıfırla (kurtarma). */
  retry(id: string): EngineSnapshot {
    const state = this.state(id);
    state.status = 'pending';
    state.startedAt = null;
    state.finishedAt = null;
    this.recomputeReady();
    return this.snapshot();
  }

  /** Herhangi bir düğümü baştan beklemeye al (derin kurtarma). */
  reset(id: string): EngineSnapshot {
    return this.retry(id);
  }

  /** Kritik olmayan bir düğümü atla. Kritikse SafetyError fırlatır. */
  skip(id: string): EngineSnapshot {
    const node = this.node(id);
    assertSkippable(node); // kritik adımda SafetyError
    const state = this.state(id);
    state.status = 'skipped';
    state.finishedAt = this.clock();
    this.recomputeReady();
    return this.snapshot();
  }

  // --- içeride -------------------------------------------------------------

  /** pending↔ready geçişlerini bağımlılık durumuna göre yeniden hesaplar. */
  private recomputeReady(): void {
    for (const node of this.recipe.nodes) {
      const state = this.states.get(node.id)!;
      if (state.status !== 'pending' && state.status !== 'ready') continue;
      state.status = this.requirementsMet(node) ? 'ready' : 'pending';
    }
  }

  /** Bir düğümün tüm `requires` bağımlılıkları done/skipped mi? */
  private requirementsMet(node: RecipeNode): boolean {
    return node.requires.every((dep) => {
      const s = this.states.get(dep);
      return s?.status === 'done' || s?.status === 'skipped';
    });
  }

  /** Grafı doğrular: bilinmeyen bağımlılık ve döngü kontrolü. */
  private validateGraph(): void {
    for (const node of this.recipe.nodes) {
      for (const dep of node.requires) {
        if (!this.byId.has(dep)) {
          throw new Error(`"${node.id}" bilinmeyen düğüme bağımlı: ${dep}`);
        }
      }
    }
    // Kahn algoritmasıyla döngü tespiti.
    const indegree = new Map<string, number>();
    for (const node of this.recipe.nodes) indegree.set(node.id, node.requires.length);
    const queue = [...indegree.entries()].filter(([, d]) => d === 0).map(([id]) => id);
    const dependents = new Map<string, string[]>();
    for (const node of this.recipe.nodes) {
      for (const dep of node.requires) {
        dependents.set(dep, [...(dependents.get(dep) ?? []), node.id]);
      }
    }
    let visited = 0;
    while (queue.length) {
      const id = queue.shift()!;
      visited++;
      for (const next of dependents.get(id) ?? []) {
        const d = indegree.get(next)! - 1;
        indegree.set(next, d);
        if (d === 0) queue.push(next);
      }
    }
    if (visited !== this.recipe.nodes.length) {
      throw new Error('Tarif grafında döngü var (DAG değil).');
    }
  }

  snapshot(): EngineSnapshot {
    const states: Record<string, NodeState> = {};
    const ready: string[] = [];
    const active: string[] = [];
    const done: string[] = [];
    let settled = 0;
    let total = 0;

    for (const node of this.recipe.nodes) {
      const s = this.states.get(node.id)!;
      states[node.id] = { ...s };
      if (s.status === 'ready') ready.push(node.id);
      if (s.status === 'active') active.push(node.id);
      if (s.status === 'done') done.push(node.id);
      if (s.status !== 'skipped') {
        total++;
        if (s.status === 'done') settled++;
      }
    }

    return {
      recipeId: this.recipe.id,
      states,
      ready,
      active,
      done,
      complete: total > 0 && settled === total,
      progress: total === 0 ? 1 : settled / total,
    };
  }
}
