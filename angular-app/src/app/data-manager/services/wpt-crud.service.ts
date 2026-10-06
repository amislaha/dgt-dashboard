import { Injectable } from '@angular/core';
import { WPT_SEED } from '../data/seed-data';
import { Wpt } from '../models/wpt.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class WptCrudService extends EntityCrudService<Wpt> {
  constructor() {
    super('wpt', WPT_SEED, 'wpt');
    // Wilayah saved before the Profil master fields existed: fill in the empty ones from the seed
    // (same id), once. Values the user already entered are never overwritten.
    this.migrateOnce('profil-fields-v1', items =>
      items.map(record => {
        const seed = WPT_SEED.find(s => s.id === record.id);
        if (!seed) {
          return record;
        }
        const filled: { [key: string]: any } = { ...(record as any) };
        Object.keys(seed).forEach(key => {
          const have = filled[key];
          if (have === undefined || have === null || have === '') {
            filled[key] = (seed as any)[key];
          }
        });
        return filled as Wpt;
      })
    );
  }
}
