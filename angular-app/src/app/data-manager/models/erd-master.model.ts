/**
 * Record shapes for the master tables read off the dbdiagram.io ERD (the "DGT" schema image). Field
 * names are the ERD's snake_case columns in camelCase; `bigint` FKs are string ids (this tool's id
 * scheme, see EntityCrudService), audit columns (created_by/created_date/last_modified_*) are
 * omitted — a localStorage tool has no user/session to stamp them with — and the derived
 * reporting_year/month/week/day columns are omitted where `reportingDate` already carries them.
 */

/** Shared columns of the ERD's plain lookup tables (code, name, description, sequence, active). */
export interface LookupMaster {
  id: string;
  code: string;
  name: string;
  description?: string;
  sequence?: number;
  active: boolean;
}

export type ProfilCategory = LookupMaster;
export type ProfilMeasure = LookupMaster;
export type ProdukJenis = LookupMaster;
export type WilayahStatus = LookupMaster;

export interface ProfilGroup extends LookupMaster {
  categoryId: string;
}

export interface SatkerType {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface WilayahCategory {
  id: string;
  name: string;
  active: boolean;
}

export interface RecommendationCategory extends LookupMaster {
  satkerTypeId: string;
}

export interface StrategicTarget extends LookupMaster {
  transmigrationProgramId: string;
  satkerId: string;
}

export interface WilayahTarget {
  id: string;
  wilayahId: string;
  /** `target_type` enum in the ERD — its values aren't legible in the diagram, so free text. */
  targetType: string;
  targetYear?: number;
  targetValue?: number;
  unit?: string;
  budgetTarget?: number;
  budgetRealization?: number;
  budgetPercentage?: number;
}

export interface Project {
  id: string;
  satkerId: string;
  reportingDate?: string;
  code?: string;
  name: string;
  description?: string;
  tahunAnggaran?: number;
  budgetAllocation?: number;
  budgetRealization?: number;
  budgetRealizationPercentage?: number;
  startDate?: string;
  finishDate?: string;
  sequence?: number;
  active: boolean;
}

export interface IkuDefinition {
  id: string;
  ikuIndicatorId: string;
  reportingDate?: string;
  referenceYear?: number;
  targetValue?: number;
  actualValueNumeric?: number;
  unit?: string;
  achievementPercentage?: number;
  aggregationType?: string;
  valueDirection?: string;
  reportingFrequency?: string;
  budgetAllocation?: number;
  budgetRealization?: number;
  budgetRealizationPercentage?: number;
  pic?: string;
  weight?: number;
  sequence?: number;
  active: boolean;
  approvalStatus?: string;
  approvalNote?: string;
}

/** Shared by the ERD's `iku_nko` and `iku_status` — identical columns (a named achievement band). */
export interface IkuBand {
  id: string;
  code?: string;
  name: string;
  description?: string;
  minAchievementPercentage?: number;
  maxAchievementPercentage?: number;
  sequence?: number;
  active: boolean;
}

export type IkuNko = IkuBand;
export type IkuStatus = IkuBand;

export interface ApprovalFlow {
  id: string;
  role?: string;
  selfApproval?: boolean;
  terminate?: boolean;
  reviewer?: string;
  nextApprovalFlowId?: string;
  active: boolean;
}

export interface ApplicationSetting {
  id: string;
  title?: string;
  description?: string;
  prefix?: string;
  values?: string;
  active: boolean;
}
