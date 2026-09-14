/**
 * The 8 master-data entities this tool manages (mirrors `ENTITY_ORDER` in the
 * original data-manager/index.html — see CLAUDE.md's data-manager/ section).
 * "Produk Unggulan" from the source ERD is intentionally left out here, same
 * as in the port spec: the sheet defines the column but ships no data.
 */
export type EntityKey =
  | 'wpt'
  | 'skp'
  | 'sp'
  | 'komoditi'
  | 'program'
  | 'satker'
  | 'personel'
  | 'iku';

export const ENTITY_ORDER: EntityKey[] = ['wpt', 'skp', 'sp', 'komoditi', 'program', 'satker', 'personel', 'iku'];
