import { Injectable } from '@angular/core';
import { SATKER_SEED } from '../data/seed-data';
import { Satker } from '../models/satker.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class SatkerCrudService extends EntityCrudService<Satker> {
  constructor() {
    super('satker', SATKER_SEED, 'sat');
  }
}
