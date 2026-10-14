import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { WILAYAH_CHILD_CONFIG_MAP } from '../config/wilayah-child-configs';
import { WPT_SEED } from '../data/seed-data';
import { WilayahChildKey, WilayahChildRecord } from '../models/wilayah-child.model';
import { EntityRegistryService } from './entity-registry.service';
import { getOperator, STORAGE_PREFIX } from './entity-crud.service';

const ID_PREFIX: { [key in WilayahChildKey]: string } = {
  kategori: 'wkc',
  hpl: 'hpl',
  shm: 'shm',
  kk: 'wkk',
  profil: 'wpf',
  produk: 'wpu',
  psu: 'psu',
  iku: 'wik',
  rekomendasi: 'rek',
  target: 'wtg'
};

/**
 * Storage for the Wilayah editor's per-kawasan lists (HPL, SHM, KK, ...). Each list is one localStorage
 * array under `dgt-data-manager:wilayah-<key>`, rows tagged with `wilayahId`. A config with `entity`
 * (Target → Wilayah Target) is read from and written to that registry entity instead, so the Data
 * Master screen and the editor tab show the same rows.
 */
@Injectable({ providedIn: 'root' })
export class WilayahChildService {
  private readonly cache: { [key: string]: WilayahChildRecord[] } = {};
  private readonly changed = new BehaviorSubject<void>(undefined);
  /** Fires after any child list (or a backing registry entity) changes. */
  readonly changes$: Observable<void>;

  constructor(private readonly registry: EntityRegistryService) {
    this.changes$ = merge(this.changed, this.registry.get('wilayahTarget').service.changes.pipe(mapTo(undefined)));
  }

  list(key: WilayahChildKey, wilayahId: string): WilayahChildRecord[] {
    return this.all(key).filter(row => row.wilayahId === wilayahId);
  }

  get(key: WilayahChildKey, id: string | null | undefined): WilayahChildRecord | undefined {
    return id ? this.all(key).find(row => row.id === id) : undefined;
  }

  count(key: WilayahChildKey, wilayahId: string): number {
    return this.list(key, wilayahId).length;
  }

  save(key: WilayahChildKey, wilayahId: string, id: string | null, value: { [field: string]: any }): WilayahChildRecord {
    const backing = this.backing(key);
    if (backing) {
      return (id ? backing.update(id, value) : backing.create({ ...value, wilayahId })) as WilayahChildRecord;
    }
    const now = new Date().toISOString();
    const who = getOperator() || undefined;
    const rows = this.all(key);
    let saved: WilayahChildRecord;
    if (id) {
      saved = { ...(rows.find(row => row.id === id) as WilayahChildRecord), ...value, id, wilayahId, lastModifiedBy: who, lastModifiedDate: now };
      this.write(key, rows.map(row => (row.id === id ? saved : row)));
    } else {
      saved = { ...value, id: this.nextId(key, rows), wilayahId, createdBy: who, createdDate: now, lastModifiedBy: who, lastModifiedDate: now };
      this.write(key, [...rows, saved]);
    }
    return saved;
  }

  remove(key: WilayahChildKey, id: string): void {
    const backing = this.backing(key);
    if (backing) {
      backing.remove(id);
      return;
    }
    this.write(key, this.all(key).filter(row => row.id !== id));
  }

  /** Drops every child record of a deleted kawasan. */
  removeAllFor(wilayahId: string): void {
    (Object.keys(WILAYAH_CHILD_CONFIG_MAP) as WilayahChildKey[]).forEach(key => {
      this.list(key, wilayahId).forEach(row => this.remove(key, row.id));
    });
  }

  private backing(key: WilayahChildKey) {
    const entity = WILAYAH_CHILD_CONFIG_MAP[key].entity;
    return entity ? this.registry.get(entity).service : null;
  }

  private all(key: WilayahChildKey): WilayahChildRecord[] {
    const backing = this.backing(key);
    if (backing) {
      return backing.list() as WilayahChildRecord[];
    }
    if (!this.cache[key]) {
      this.cache[key] = this.load(key);
    }
    return this.cache[key];
  }

  private load(key: WilayahChildKey): WilayahChildRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + 'wilayah-' + key);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // fall through to the seed
    }
    const seed = key === 'kategori' ? this.kategoriSeed() : [];
    this.persist(key, seed);
    return seed;
  }

  /** Every seeded kawasan comes from the "Matriks 45 Kawasan Transmigrasi Prioritas Nasional" sheet, so it starts in that category. */
  private kategoriSeed(): WilayahChildRecord[] {
    return WPT_SEED.map((w, i) => ({ id: 'wkc' + (i + 1), wilayahId: w.id, categoryId: 'wct1' }));
  }

  private nextId(key: WilayahChildKey, rows: WilayahChildRecord[]): string {
    let max = 0;
    rows.forEach(row => {
      const match = /^\D*(\d+)$/.exec(row.id);
      if (match) {
        max = Math.max(max, parseInt(match[1], 10));
      }
    });
    return ID_PREFIX[key] + (max + 1);
  }

  private write(key: WilayahChildKey, rows: WilayahChildRecord[]): void {
    this.cache[key] = rows;
    this.persist(key, rows);
    this.changed.next(undefined);
  }

  private persist(key: WilayahChildKey, rows: WilayahChildRecord[]): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'wilayah-' + key, JSON.stringify(rows));
    } catch (e) {
      console.error(`WilayahChildService: could not save ${key}`, e);
    }
  }
}
