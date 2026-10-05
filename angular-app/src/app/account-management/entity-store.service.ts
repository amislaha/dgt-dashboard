import { Injectable } from '@angular/core';
import { AuditService } from './audit.service';

export type EntityKind = 'user-groups' | 'applications';

export interface SimpleEntity {
  id: number;
  name: string;
  description: string;
  modifiedDate: string;
}

export const ENTITY_LABELS: { [k in EntityKind]: string } = {
  'user-groups': 'User Group',
  applications: 'Application'
};

/** One localStorage-backed store for the two simple Entities menu items (name + description). */
@Injectable({ providedIn: 'root' })
export class EntityStoreService {
  constructor(private readonly audit: AuditService) {}

  list(kind: EntityKind): SimpleEntity[] {
    try {
      const raw = localStorage.getItem(this.key(kind));
      if (raw) {
        return JSON.parse(raw) as SimpleEntity[];
      }
    } catch (e) { /* fall through to seed */ }
    const seed = this.seed(kind);
    this.write(kind, seed);
    return seed;
  }

  get(kind: EntityKind, id: number): SimpleEntity | undefined {
    return this.list(kind).find(e => e.id === id);
  }

  save(kind: EntityKind, draft: Partial<SimpleEntity> & Pick<SimpleEntity, 'name'>): void {
    const all = this.list(kind);
    const now = new Date().toISOString();
    if (draft.id) {
      const i = all.findIndex(e => e.id === draft.id);
      all[i] = { ...all[i], ...draft, modifiedDate: now };
      this.audit.log('Ubah ' + ENTITY_LABELS[kind], draft.name);
    } else {
      all.push({ id: all.reduce((m, e) => Math.max(m, e.id), 0) + 1, description: '', ...draft, modifiedDate: now });
      this.audit.log('Buat ' + ENTITY_LABELS[kind], draft.name);
    }
    this.write(kind, all);
  }

  remove(kind: EntityKind, entity: SimpleEntity): void {
    this.write(kind, this.list(kind).filter(e => e.id !== entity.id));
    this.audit.log('Hapus ' + ENTITY_LABELS[kind], entity.name);
  }

  isTaken(kind: EntityKind, name: string, ignoreId?: number): boolean {
    const v = name.trim().toLowerCase();
    return this.list(kind).some(e => e.id !== ignoreId && e.name.toLowerCase() === v);
  }

  private key(kind: EntityKind): string {
    return 'dgt-account-management:' + kind;
  }

  private write(kind: EntityKind, all: SimpleEntity[]): void {
    try { localStorage.setItem(this.key(kind), JSON.stringify(all)); } catch (e) { /* storage blocked */ }
  }

  private seed(kind: EntityKind): SimpleEntity[] {
    const now = new Date().toISOString();
    return kind === 'user-groups'
      ? [
        { id: 1, name: 'Pusdatin', description: 'Pusat Data dan Informasi', modifiedDate: now },
        { id: 2, name: 'Pimpinan', description: 'Pimpinan dan pejabat eselon', modifiedDate: now }
      ]
      : [
        { id: 1, name: 'Dashboard DGT', description: 'Peta kawasan dan dasbor eksekutif', modifiedDate: now },
        { id: 2, name: 'Data Manager', description: 'Manajemen data tabel', modifiedDate: now },
        { id: 3, name: 'Geomapping', description: 'Survei dan pemetaan lapangan', modifiedDate: now }
      ];
  }
}
