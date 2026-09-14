import { Injectable } from '@angular/core';
import { SKP_SEED } from '../data/seed-data';
import { Skp } from '../models/skp.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class SkpCrudService extends EntityCrudService<Skp> {
  constructor() {
    super('skp', SKP_SEED, 'skp');
  }
}
