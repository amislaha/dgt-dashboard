import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Same localStorage key prefix as the original data-manager/index.html
 * (`STORAGE_PREFIX = "dgt-data-manager:"`), preserved exactly so a team
 * migrating real user data out of the static prototype's browser storage
 * later lands on a compatible key scheme (see CLAUDE.md / PORT_NOTES.md).
 */
export const STORAGE_PREFIX = 'dgt-data-manager:';

/** Audit columns from the ERD (created_by/created_date/last_modified_by/last_modified_date). Stamped by `EntityCrudService`, never edited in a form. */
export interface AuditFields {
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

const OPERATOR_KEY = STORAGE_PREFIX + 'operator';

/** The name stamped into `createdBy`/`lastModifiedBy` — there is no login, so it's whatever was typed in the header. */
export function getOperator(): string {
  try {
    return localStorage.getItem(OPERATOR_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function setOperator(name: string): void {
  try {
    localStorage.setItem(OPERATOR_KEY, name.trim());
  } catch (e) {
    // name just isn't remembered
  }
}

/**
 * Generic, reusable CRUD base for one entity, backed by localStorage.
 * One concrete subclass per entity (see wpt-crud.service.ts etc.), each
 * `providedIn: 'root'` so there's exactly one instance app-wide — the direct
 * equivalent of the original's per-key `DATA[key]` array plus its
 * `loadEntity`/`saveEntity` helpers, just made reactive (`BehaviorSubject`)
 * so components don't need to manually call a local re-render function.
 *
 * Id generation mirrors the original's `nextId()`: `idPrefix` + 1 past the
 * highest numeric suffix currently in use.
 */
export abstract class EntityCrudService<T extends { id: string }> {
  private readonly itemsSubject: BehaviorSubject<T[]>;
  /** Reactive stream of the full current list — subscribe instead of polling `list()`. */
  readonly changes: Observable<T[]>;

  protected constructor(private readonly storageKey: string, seed: T[], private readonly idPrefix: string, private readonly reseedWhenEmpty = false) {
    this.itemsSubject = new BehaviorSubject<T[]>(this.loadInitial(seed));
    this.changes = this.itemsSubject.asObservable();
  }

  /** Current snapshot (non-reactive convenience, e.g. for populating a FK dropdown once). */
  list(): T[] {
    return this.itemsSubject.value;
  }

  get(id: string | null | undefined): T | undefined {
    if (!id) {
      return undefined;
    }
    return this.itemsSubject.value.find(record => record.id === id);
  }

  /** `by` overrides the stamped operator — used when applying an approved submission, so the record is credited to whoever proposed it. */
  create(input: Omit<T, 'id'>, by?: string): T {
    const now = new Date().toISOString();
    const who = by || getOperator() || undefined;
    const record = { ...(input as object), id: this.nextId(), createdBy: who, createdDate: now, lastModifiedBy: who, lastModifiedDate: now } as any as T;
    this.persist([...this.itemsSubject.value, record]);
    return record;
  }

  update(id: string, patch: Partial<T>, by?: string): T | undefined {
    let updated: T | undefined;
    const next = this.itemsSubject.value.map(record => {
      if (record.id !== id) {
        return record;
      }
      updated = { ...record, ...patch, id: record.id, lastModifiedBy: by || getOperator() || undefined, lastModifiedDate: new Date().toISOString() };
      return updated;
    });
    this.persist(next);
    return updated;
  }

  remove(id: string): void {
    this.persist(this.itemsSubject.value.filter(record => record.id !== id));
  }

  private nextId(): string {
    let max = 0;
    this.itemsSubject.value.forEach(record => {
      const match = /^\D*(\d+)$/.exec(record.id);
      if (match) {
        max = Math.max(max, parseInt(match[1], 10));
      }
    });
    return this.idPrefix + (max + 1);
  }

  /**
   * Runs `fn` over the stored list exactly once per browser (guarded by a localStorage flag) and
   * persists the result. Used to bring data saved by an earlier version up to date — e.g. fill
   * newly added fields from the seed — without wiping what the user already edited.
   */
  protected migrateOnce(flag: string, fn: (items: T[]) => T[]): void {
    const key = STORAGE_PREFIX + 'migrated:' + this.storageKey + ':' + flag;
    try {
      if (localStorage.getItem(key)) {
        return;
      }
      this.persist(fn(this.itemsSubject.value));
      localStorage.setItem(key, '1');
    } catch (e) {
      console.error(`EntityCrudService(${this.storageKey}): migration "${flag}" failed`, e);
    }
  }

  private loadInitial(seed: T[]): T[] {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // A table that used to ship empty and now has seed rows: treat a persisted empty list as never filled.
        if (!(this.reseedWhenEmpty && Array.isArray(parsed) && parsed.length === 0 && seed.length > 0)) {
          return parsed;
        }
      }
    } catch (e) {
      // fall through to seed, matching the original's loadEntity() behaviour
    }
    const seeded = JSON.parse(JSON.stringify(seed));
    this.writeThrough(seeded);
    return seeded;
  }

  private persist(items: T[]): void {
    this.itemsSubject.next(items);
    this.writeThrough(items);
  }

  private writeThrough(items: T[]): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + this.storageKey, JSON.stringify(items));
    } catch (e) {
      // Matches the original's showToast("Gagal menyimpan ke localStorage...") intent; the
      // registry/component layer surfaces a ToastService message on save failure instead of this
      // low-level service reaching into UI concerns directly.
      console.error(`EntityCrudService(${this.storageKey}): failed to persist to localStorage`, e);
    }
  }
}
