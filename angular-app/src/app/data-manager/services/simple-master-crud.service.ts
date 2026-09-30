import { Injectable } from '@angular/core';
import {
  ApplicationSetting, ApprovalFlow, IkuDefinition, IkuNko, IkuStatus, ProdukJenis, ProfilCategory, ProfilGroup, ProfilMeasure,
  Project, RecommendationCategory, SatkerType, StrategicTarget, WilayahCategory, WilayahStatus, WilayahTarget
} from '../models/erd-master.model';
import { EntityCrudService } from './entity-crud.service';

/**
 * One tiny `EntityCrudService` subclass per ERD-backed master table (see models/erd-master.model.ts
 * and entity-key.model.ts) — same one-class-per-entity pattern as wpt-crud.service.ts etc. (each
 * needs its own Angular DI token and its own localStorage key/id prefix), grouped into a single
 * file since the boilerplate is otherwise identical. Storage keys match the `EntityKey` string.
 * No seed rows: the ERD image defines columns only, there is no source data to transcribe.
 */
@Injectable({ providedIn: 'root' })
export class WilayahStatusCrudService extends EntityCrudService<WilayahStatus> {
  constructor() {
    super('wilayahStatus', [], 'wst');
  }
}

@Injectable({ providedIn: 'root' })
export class WilayahCategoryCrudService extends EntityCrudService<WilayahCategory> {
  constructor() {
    super('wilayahCategory', [], 'wct');
  }
}

@Injectable({ providedIn: 'root' })
export class WilayahTargetCrudService extends EntityCrudService<WilayahTarget> {
  constructor() {
    super('wilayahTarget', [], 'wtg');
  }
}

@Injectable({ providedIn: 'root' })
export class ProjectCrudService extends EntityCrudService<Project> {
  constructor() {
    super('project', [], 'prj');
  }
}

@Injectable({ providedIn: 'root' })
export class SatkerTypeCrudService extends EntityCrudService<SatkerType> {
  constructor() {
    super('satkerType', [], 'stp');
  }
}

@Injectable({ providedIn: 'root' })
export class StrategicTargetCrudService extends EntityCrudService<StrategicTarget> {
  constructor() {
    super('strategicTarget', [], 'sgt');
  }
}

@Injectable({ providedIn: 'root' })
export class IkuDefinitionCrudService extends EntityCrudService<IkuDefinition> {
  constructor() {
    super('ikuDefinition', [], 'ikd');
  }
}

@Injectable({ providedIn: 'root' })
export class IkuNkoCrudService extends EntityCrudService<IkuNko> {
  constructor() {
    super('ikuNko', [], 'ikn');
  }
}

@Injectable({ providedIn: 'root' })
export class IkuStatusCrudService extends EntityCrudService<IkuStatus> {
  constructor() {
    super('ikuStatus', [], 'iks');
  }
}

@Injectable({ providedIn: 'root' })
export class ProdukJenisCrudService extends EntityCrudService<ProdukJenis> {
  constructor() {
    super('produkJenis', [], 'pdj');
  }
}

@Injectable({ providedIn: 'root' })
export class RecommendationCategoryCrudService extends EntityCrudService<RecommendationCategory> {
  constructor() {
    super('recommendationCategory', [], 'rec');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfilCategoryCrudService extends EntityCrudService<ProfilCategory> {
  constructor() {
    super('profilCategory', [], 'pfc');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfilGroupCrudService extends EntityCrudService<ProfilGroup> {
  constructor() {
    super('profilGroup', [], 'pfg');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfilMeasureCrudService extends EntityCrudService<ProfilMeasure> {
  constructor() {
    super('profilMeasure', [], 'pfm');
  }
}

@Injectable({ providedIn: 'root' })
export class ApplicationSettingsCrudService extends EntityCrudService<ApplicationSetting> {
  constructor() {
    super('applicationSettings', [], 'aps');
  }
}

@Injectable({ providedIn: 'root' })
export class ApprovalFlowCrudService extends EntityCrudService<ApprovalFlow> {
  constructor() {
    super('approvalFlow', [], 'apf');
  }
}
