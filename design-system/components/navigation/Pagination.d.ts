import * as React from "react";
/** Page control with truncated page list and an id-ID formatted record count. */
export interface PaginationProps {
  page?: number;
  totalPages?: number;
  /** Total record count, shown left of the controls. */
  totalItems?: number;
  onChange?: (page: number) => void;
  className?: string;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
