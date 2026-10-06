/**
 * Every master-data entity this tool manages. The original 8 (mirrors `ENTITY_ORDER` in the
 * original data-manager/index.html — see CLAUDE.md's data-manager/ section) plus 16 added later for
 * the header nav's "Master Data"/"Settings" groups (see entity-configs.ts and PORT_NOTES.md) —
 * "Produk Unggulan" from the source ERD is still intentionally left out, same as the port spec: the
 * sheet defines the column but ships no data.
 */
export type EntityKey =
  | 'wpt'
  | 'skp'
  | 'sp'
  | 'komoditi'
  | 'program'
  | 'satker'
  | 'personel'
  | 'iku'
  | 'wilayahStatus'
  | 'wilayahCategory'
  | 'wilayahTarget'
  | 'project'
  | 'satkerType'
  | 'strategicTarget'
  | 'ikuDefinition'
  | 'ikuNko'
  | 'ikuStatus'
  | 'produkJenis'
  | 'recommendationCategory'
  | 'profilCategory'
  | 'profilGroup'
  | 'profilMeasure'
  | 'applicationSettings'
  | 'approvalFlow';

/** All 24 keys, in the order the "Data Master" dropdown lists them (Wilayah is not in this list —
 *  it's a top-level header item backed by the same `wpt` entity, see WilayahComponent). Used for
 *  the aggregate entry-count total and to build the registry map exhaustively. */
export const ENTITY_ORDER: EntityKey[] = [
  'wpt',
  'skp',
  'sp',
  'komoditi',
  'program',
  'satker',
  'personel',
  'iku',
  'wilayahStatus',
  'wilayahCategory',
  'wilayahTarget',
  'project',
  'satkerType',
  'strategicTarget',
  'ikuDefinition',
  'ikuNko',
  'ikuStatus',
  'produkJenis',
  'recommendationCategory',
  'profilCategory',
  'profilGroup',
  'profilMeasure',
  'applicationSettings',
  'approvalFlow'
];

/** The header nav's "Data Master" dropdown — every entity except `wpt` (which leads the header as
 *  the standalone "Wilayah" map item, see WilayahComponent) and the 3 Settings-group keys below. */
export const MASTER_DATA_ORDER: EntityKey[] = [
  'wilayahStatus',
  'wilayahCategory',
  'wilayahTarget',
  'project',
  'skp',
  'sp',
  'satker',
  'satkerType',
  'personel',
  'program',
  'strategicTarget',
  'iku',
  'ikuDefinition',
  'ikuNko',
  'ikuStatus',
  'komoditi',
  'produkJenis',
  'recommendationCategory',
  'profilCategory',
  'profilGroup'
];

/** The header nav's "Settings" dropdown. */
export const SETTINGS_ORDER: EntityKey[] = ['profilMeasure', 'applicationSettings', 'approvalFlow'];
