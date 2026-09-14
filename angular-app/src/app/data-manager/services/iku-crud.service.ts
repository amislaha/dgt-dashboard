import { Injectable } from '@angular/core';
import { IKU_SEED } from '../data/seed-data';
import { Iku } from '../models/iku.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class IkuCrudService extends EntityCrudService<Iku> {
  constructor() {
    super('iku', IKU_SEED, 'iku');
  }
}
