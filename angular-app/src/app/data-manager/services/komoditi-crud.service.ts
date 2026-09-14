import { Injectable } from '@angular/core';
import { KOMODITI_SEED } from '../data/seed-data';
import { Komoditi } from '../models/komoditi.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class KomoditiCrudService extends EntityCrudService<Komoditi> {
  constructor() {
    super('komoditi', KOMODITI_SEED, 'kom');
  }
}
