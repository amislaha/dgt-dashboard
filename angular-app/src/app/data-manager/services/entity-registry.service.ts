import { Injectable } from '@angular/core';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { EntityConfig } from '../models/entity-config.model';
import { EntityKey, ENTITY_ORDER } from '../models/entity-key.model';
import { EntityCrudService } from './entity-crud.service';
import { IkuCrudService } from './iku-crud.service';
import { KomoditiCrudService } from './komoditi-crud.service';
import { PersonelCrudService } from './personel-crud.service';
import { ProgramCrudService } from './program-crud.service';
import { SatkerCrudService } from './satker-crud.service';
import { SkpCrudService } from './skp-crud.service';
import { SpCrudService } from './sp-crud.service';
import { WptCrudService } from './wpt-crud.service';

export interface EntityRegistryEntry<T extends { id: string } = any> {
  config: EntityConfig<T>;
  service: EntityCrudService<T>;
}

/**
 * Maps each `EntityKey` to its `{ config, service }` pair. This is what makes
 * the generic `EntityListComponent`/`EntityFormComponent` possible: they read
 * the active entity key from the route and ask this registry for both the
 * schema (`EntityConfig`) and the data access object (`EntityCrudService`)
 * instead of having a switch statement or 8 separate component classes.
 *
 * Type safety is intentionally traded for this generic-driven approach — the
 * map is typed `EntityRegistryEntry<any>`, so callers narrow via the known
 * `EntityKey` string rather than the compiler proving the pairing. Documented
 * as a deliberate tradeoff in PORT_NOTES.md.
 */
@Injectable({ providedIn: 'root' })
export class EntityRegistryService {
  private readonly registry: { [key in EntityKey]: EntityRegistryEntry };

  constructor(
    wpt: WptCrudService,
    skp: SkpCrudService,
    sp: SpCrudService,
    komoditi: KomoditiCrudService,
    program: ProgramCrudService,
    satker: SatkerCrudService,
    personel: PersonelCrudService,
    iku: IkuCrudService
  ) {
    this.registry = {
      wpt: { config: ENTITY_CONFIGS.wpt, service: wpt },
      skp: { config: ENTITY_CONFIGS.skp, service: skp },
      sp: { config: ENTITY_CONFIGS.sp, service: sp },
      komoditi: { config: ENTITY_CONFIGS.komoditi, service: komoditi },
      program: { config: ENTITY_CONFIGS.program, service: program },
      satker: { config: ENTITY_CONFIGS.satker, service: satker },
      personel: { config: ENTITY_CONFIGS.personel, service: personel },
      iku: { config: ENTITY_CONFIGS.iku, service: iku }
    };
  }

  get(key: EntityKey): EntityRegistryEntry {
    return this.registry[key];
  }

  get all(): EntityRegistryEntry[] {
    return ENTITY_ORDER.map(key => this.registry[key]);
  }

  /** Total entry count across every entity — the Angular equivalent of the original topbar stat. */
  get totalCount(): number {
    return this.all.reduce((sum, entry) => sum + entry.service.list().length, 0);
  }
}
