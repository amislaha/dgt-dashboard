import { Injectable } from '@angular/core';
import { KOMODITI_SEED } from '../data/seed-data';
import { Komoditi } from '../models/komoditi.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class KomoditiCrudService extends EntityCrudService<Komoditi> {
  constructor() {
    super('komoditi', KOMODITI_SEED, 'kom');
    // Commodities added after this table was first saved: append the missing seed rows (by id), once.
    this.migrateOnce('produk-unggulan-v1', items => [...items, ...KOMODITI_SEED.filter(s => !items.some(i => i.id === s.id))]);
  }
}
