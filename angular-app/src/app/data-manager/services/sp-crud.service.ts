import { Injectable } from '@angular/core';
import { SP_SEED } from '../data/seed-data';
import { Sp } from '../models/sp.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class SpCrudService extends EntityCrudService<Sp> {
  constructor() {
    super('sp', SP_SEED, 'sp');
  }
}
