import { Injectable } from '@angular/core';
import { HPL_SEED } from '../data/hpl.seed';
import { Hpl, hplNama } from '../models/hpl.model';
import { EntityCrudService } from './entity-crud.service';

/** Stored under `dgt-data-manager:hpl`; also injected by the dashboard's HPL overview, so both read the same rows. */
@Injectable({ providedIn: 'root' })
export class HplCrudService extends EntityCrudService<Hpl> {
  constructor() {
    super('hpl', HPL_SEED, 'hpl');
    // Rows saved before `desa`/`nama` existed: take the seed's desa (same id) and derive the name, once.
    this.migrateOnce('nama-desa-v1', items =>
      items.map(record => {
        const seed = HPL_SEED.find(s => s.id === record.id);
        const desa = record.desa || (seed && seed.nomorSk === record.nomorSk ? seed.desa : '') || '';
        return { ...record, desa, nama: hplNama({ desa, nomorSk: record.nomorSk }) };
      })
    );
  }

  create(input: Omit<Hpl, 'id'>, by?: string): Hpl {
    return super.create({ ...input, nama: hplNama(input) }, by);
  }

  update(id: string, patch: Partial<Hpl>, by?: string): Hpl | undefined {
    const merged = { ...this.get(id), ...patch } as Hpl;
    return super.update(id, { ...patch, nama: hplNama(merged) }, by);
  }
}
