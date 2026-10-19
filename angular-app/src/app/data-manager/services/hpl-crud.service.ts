import { Injectable } from '@angular/core';
import { HPL_SEED } from '../data/hpl.seed';
import { Hpl } from '../models/hpl.model';
import { EntityCrudService } from './entity-crud.service';

/** Stored under `dgt-data-manager:hpl`; also injected by the dashboard's HPL overview, so both read the same rows. */
@Injectable({ providedIn: 'root' })
export class HplCrudService extends EntityCrudService<Hpl> {
  constructor() {
    super('hpl', HPL_SEED, 'hpl');
  }
}
