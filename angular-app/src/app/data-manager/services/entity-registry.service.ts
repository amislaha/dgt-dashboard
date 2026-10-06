import { Injectable } from '@angular/core';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { EntityConfig } from '../models/entity-config.model';
import { EntityKey, ENTITY_ORDER } from '../models/entity-key.model';
import { EntityCrudService } from './entity-crud.service';
import { IkuCrudService } from './iku-crud.service';
import { KomoditiCrudService } from './komoditi-crud.service';
import { PersonelCrudService } from './personel-crud.service';
import { ProdukWilayahCrudService, ProfilWilayahCrudService } from './profil-wilayah-crud.service';
import { ProgramCrudService } from './program-crud.service';
import { SatkerCrudService } from './satker-crud.service';
import {
  ApplicationSettingsCrudService,
  ApprovalFlowCrudService,
  IkuDefinitionCrudService,
  IkuNkoCrudService,
  IkuStatusCrudService,
  ProdukJenisCrudService,
  ProfilCategoryCrudService,
  ProfilGroupCrudService,
  ProfilMeasureCrudService,
  ProjectCrudService,
  RecommendationCategoryCrudService,
  SatkerTypeCrudService,
  StrategicTargetCrudService,
  WilayahCategoryCrudService,
  WilayahStatusCrudService,
  WilayahTargetCrudService
} from './simple-master-crud.service';
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
 *
 * 16 more entities were added later for the header nav's "Data Master"/
 * "Settings" groups (see entity-key.model.ts's MASTER_DATA_ORDER/
 * SETTINGS_ORDER) — mechanical to wire in here too: one constructor param and
 * one registry entry per entity, same as the original 8.
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
    iku: IkuCrudService,
    wilayahStatus: WilayahStatusCrudService,
    wilayahCategory: WilayahCategoryCrudService,
    wilayahTarget: WilayahTargetCrudService,
    project: ProjectCrudService,
    satkerType: SatkerTypeCrudService,
    strategicTarget: StrategicTargetCrudService,
    ikuDefinition: IkuDefinitionCrudService,
    ikuNko: IkuNkoCrudService,
    ikuStatus: IkuStatusCrudService,
    produkJenis: ProdukJenisCrudService,
    recommendationCategory: RecommendationCategoryCrudService,
    profilCategory: ProfilCategoryCrudService,
    profilGroup: ProfilGroupCrudService,
    profilMeasure: ProfilMeasureCrudService,
    applicationSettings: ApplicationSettingsCrudService,
    approvalFlow: ApprovalFlowCrudService,
    profilWilayah: ProfilWilayahCrudService,
    produkWilayah: ProdukWilayahCrudService
  ) {
    this.registry = {
      wpt: { config: ENTITY_CONFIGS.wpt, service: wpt },
      skp: { config: ENTITY_CONFIGS.skp, service: skp },
      sp: { config: ENTITY_CONFIGS.sp, service: sp },
      komoditi: { config: ENTITY_CONFIGS.komoditi, service: komoditi },
      program: { config: ENTITY_CONFIGS.program, service: program },
      satker: { config: ENTITY_CONFIGS.satker, service: satker },
      personel: { config: ENTITY_CONFIGS.personel, service: personel },
      iku: { config: ENTITY_CONFIGS.iku, service: iku },
      wilayahStatus: { config: ENTITY_CONFIGS.wilayahStatus, service: wilayahStatus },
      wilayahCategory: { config: ENTITY_CONFIGS.wilayahCategory, service: wilayahCategory },
      wilayahTarget: { config: ENTITY_CONFIGS.wilayahTarget, service: wilayahTarget },
      project: { config: ENTITY_CONFIGS.project, service: project },
      satkerType: { config: ENTITY_CONFIGS.satkerType, service: satkerType },
      strategicTarget: { config: ENTITY_CONFIGS.strategicTarget, service: strategicTarget },
      ikuDefinition: { config: ENTITY_CONFIGS.ikuDefinition, service: ikuDefinition },
      ikuNko: { config: ENTITY_CONFIGS.ikuNko, service: ikuNko },
      ikuStatus: { config: ENTITY_CONFIGS.ikuStatus, service: ikuStatus },
      produkJenis: { config: ENTITY_CONFIGS.produkJenis, service: produkJenis },
      recommendationCategory: { config: ENTITY_CONFIGS.recommendationCategory, service: recommendationCategory },
      profilCategory: { config: ENTITY_CONFIGS.profilCategory, service: profilCategory },
      profilGroup: { config: ENTITY_CONFIGS.profilGroup, service: profilGroup },
      profilMeasure: { config: ENTITY_CONFIGS.profilMeasure, service: profilMeasure },
      applicationSettings: { config: ENTITY_CONFIGS.applicationSettings, service: applicationSettings },
      approvalFlow: { config: ENTITY_CONFIGS.approvalFlow, service: approvalFlow },
      profilWilayah: { config: ENTITY_CONFIGS.profilWilayah, service: profilWilayah },
      produkWilayah: { config: ENTITY_CONFIGS.produkWilayah, service: produkWilayah }
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
