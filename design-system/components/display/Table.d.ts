import * as React from "react";
/** Data table with sticky header, hover rows and optional zebra striping. */
export interface TableColumn<T = any> {
  key: string;
  label: React.ReactNode;
  /** Right-aligned, tabular figures. */
  numeric?: boolean;
  width?: string;
  /** Custom cell renderer. */
  render?: (row: T) => React.ReactNode;
}
export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  rows: T[];
  /** @default "default" */
  density?: "default" | "compact";
  /** @default false */
  zebra?: boolean;
  /** @default true */
  hover?: boolean;
  /** Empty-state copy. @default "Belum ada data" */
  emptyLabel?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}
export declare function Table<T = any>(props: TableProps<T>): JSX.Element;
