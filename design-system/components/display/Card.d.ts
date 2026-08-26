import * as React from "react";
/**
 * Surface container: header (title/description/action), body, optional footer.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** default = 1px border + shadow-xs; flat = border only; raised = shadow-md, no border. @default "default" */
  variant?: "default" | "flat" | "raised";
  /** Hover lift + pointer. @default false */
  interactive?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right slot, usually a ghost/icon Button or Badge. */
  action?: React.ReactNode;
  footer?: React.ReactNode;
  /** Adds a top border above the footer. @default false */
  footerBordered?: boolean;
}
export declare function Card(props: CardProps): JSX.Element;
