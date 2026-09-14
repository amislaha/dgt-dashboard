import { Injectable } from '@angular/core';
import { WPT_SEED } from '../data/seed-data';
import { Wpt } from '../models/wpt.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class WptCrudService extends EntityCrudService<Wpt> {
  constructor() {
    super('wpt', WPT_SEED, 'wpt');
  }
}
