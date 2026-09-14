import { Injectable } from '@angular/core';
import { PERSONEL_SEED } from '../data/seed-data';
import { Personel } from '../models/personel.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class PersonelCrudService extends EntityCrudService<Personel> {
  constructor() {
    super('personel', PERSONEL_SEED, 'per');
  }
}
