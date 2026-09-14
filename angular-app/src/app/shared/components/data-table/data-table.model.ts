export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  numeric?: boolean;
  sortable?: boolean;
  /** Optional cell formatter, e.g. `(row) => row.anggaran.toLocaleString('id-ID')`. */
  format?: (row: T) => string;
}

export type SortDirection = 'asc' | 'desc';
