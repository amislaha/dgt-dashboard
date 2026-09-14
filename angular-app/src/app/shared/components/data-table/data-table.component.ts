import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataTableColumn, SortDirection } from './data-table.model';

/**
 * Generic sortable table, replacing the `.table-wrap` + manual `sortKey`/
 * `sortDir` mutation pattern repeated across dashboard (Detail Kawasan
 * "Tabel" tab) and data-manager (every entity list).
 */
@Component({
  selector: 'dgt-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T = any> {
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() sortKey: string | null = null;
  @Input() sortDir: SortDirection = 'asc';
  @Input() emptyLabel = 'Belum ada data.';
  @Input() density: 'default' | 'compact' = 'default';
  @Output() sortChange = new EventEmitter<{ key: string; dir: SortDirection }>();
  @Output() rowClick = new EventEmitter<T>();

  onHeaderClick(column: DataTableColumn<T>): void {
    if (!column.sortable) {
      return;
    }
    const dir: SortDirection = this.sortKey === column.key && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key: column.key, dir });
  }

  cell(row: T, column: DataTableColumn<T>): string {
    if (column.format) {
      return column.format(row);
    }
    const value = (row as any)[column.key];
    return value === null || value === undefined ? '' : String(value);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
