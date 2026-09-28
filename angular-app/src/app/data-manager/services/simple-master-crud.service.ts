import { Injectable } from '@angular/core';
import { EMPTY_SIMPLE_MASTER_SEED } from '../data/seed-data';
import { SimpleMaster } from '../models/simple-master.model';
import { EntityCrudService } from './entity-crud.service';

/**
 * One tiny `EntityCrudService<SimpleMaster>` subclass per entity added for the header nav's "Data
 * Master"/"Settings" groups (see entity-key.model.ts) — same one-class-per-entity pattern as
 * wpt-crud.service.ts etc. (each needs its own Angular DI token and its own localStorage key/id
 * prefix), just grouped into a single file since every one of these is otherwise identical
 * boilerplate. Storage keys match the `EntityKey` string, same convention as the original 8.
 */
@Injectable({ providedIn: 'root' })
export class WilayahStatusCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('wilayahStatus', EMPTY_SIMPLE_MASTER_SEED, 'wst');
  }
}

@Injectable({ providedIn: 'root' })
export class WilayahCategoryCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('wilayahCategory', EMPTY_SIMPLE_MASTER_SEED, 'wct');
  }
}

@Injectable({ providedIn: 'root' })
export class WilayahTargetCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('wilayahTarget', EMPTY_SIMPLE_MASTER_SEED, 'wtg');
  }
}

@Injectable({ providedIn: 'root' })
export class ProjectCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('project', EMPTY_SIMPLE_MASTER_SEED, 'prj');
  }
}

@Injectable({ providedIn: 'root' })
export class SatkerTypeCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('satkerType', EMPTY_SIMPLE_MASTER_SEED, 'stp');
  }
}

@Injectable({ providedIn: 'root' })
export class StrategicTargetCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('strategicTarget', EMPTY_SIMPLE_MASTER_SEED, 'sgt');
  }
}

@Injectable({ providedIn: 'root' })
export class IkuDefinitionCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('ikuDefinition', EMPTY_SIMPLE_MASTER_SEED, 'ikd');
  }
}

@Injectable({ providedIn: 'root' })
export class IkuNkoCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('ikuNko', EMPTY_SIMPLE_MASTER_SEED, 'ikn');
  }
}

@Injectable({ providedIn: 'root' })
export class IkuStatusCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('ikuStatus', EMPTY_SIMPLE_MASTER_SEED, 'iks');
  }
}

@Injectable({ providedIn: 'root' })
export class ProdukJenisCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('produkJenis', EMPTY_SIMPLE_MASTER_SEED, 'pdj');
  }
}

@Injectable({ providedIn: 'root' })
export class RecommendationCategoryCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('recommendationCategory', EMPTY_SIMPLE_MASTER_SEED, 'rec');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfilCategoryCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('profilCategory', EMPTY_SIMPLE_MASTER_SEED, 'pfc');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfilGroupCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('profilGroup', EMPTY_SIMPLE_MASTER_SEED, 'pfg');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfilMeasureCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('profilMeasure', EMPTY_SIMPLE_MASTER_SEED, 'pfm');
  }
}

@Injectable({ providedIn: 'root' })
export class ApplicationSettingsCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('applicationSettings', EMPTY_SIMPLE_MASTER_SEED, 'aps');
  }
}

@Injectable({ providedIn: 'root' })
export class ApprovalFlowCrudService extends EntityCrudService<SimpleMaster> {
  constructor() {
    super('approvalFlow', EMPTY_SIMPLE_MASTER_SEED, 'apf');
  }
}
